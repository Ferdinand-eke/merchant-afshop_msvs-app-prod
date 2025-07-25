import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  createRoomOnProperty,
  updateRoomOnProperty,
  getBookingsPropertyRoomsById,
  getSingleRoomOfProperty,
} from "../../client/clientToApiRoutes";

/*****
 *
 * MANAGE ROOMS ATTACHED TO PROPERTIES
 *
 */

/****1) get rooms from single booking property by Property-ID */

export function useGetRoomsFromBookingProperty(slug) {
  //   console.log("Fetching rooms for booking property:", slug)

  return useQuery({
    queryKey: ["roomsOnBookingProperty", slug],
    queryFn: () => getBookingsPropertyRoomsById(slug),
    enabled: Boolean(slug), // only run if slug is truthy
  });
}

export function useGetSingleRoomOfProperty(roomId) {
  console.log("Fetching single room :", roomId);

  return useQuery({
    queryKey: ["_roomsOnBookingProperty", roomId],
    queryFn: () => getSingleRoomOfProperty(roomId),
    enabled: Boolean(roomId), // only run if slug is truthy
  });
}

/****2) create new room on  property */
export function useAddRoomPropertyMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newRoomProperty) => {
      return createRoomOnProperty(newRoomProperty);
    },

    {
      onSuccess: (data) => {
        console.log("createRoomOnProperty_DATA", data);
        if (data?.data?.success) {
          toast.success("room  added successfully!");
          queryClient.invalidateQueries(["roomsOnBookingProperty"]);
          queryClient.refetchQueries("roomsOnBookingProperty", {
            force: true,
          });
          //   navigate("/bookings/managed-listings");
        }
      },
    },
    {
      onError: (error, rollback) => {
        // console.log("creatBokibg_Property_ERROR", error);
        // console.log("MutationError 2", error.response.data);
        // console.log("MutationError 3", error.data);
        // toast.error(
        //   error.response && error.response.data.message
        //     ? error.response.data.message
        //     : error.message
        // );
        console.log("LoginError22Block", error);

        const {
          response: { data },
        } = error ?? {};
        Array.isArray(data?.message)
          ? data?.message?.map((m) => toast.error(m))
          : toast.error(data?.message);
        rollback();
      },
    }
  );
}

/*****3) update existing room on bookings-property */
export function useRoomOnPropertyUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateRoomOnProperty, {
    onSuccess: (data) => {
      console.log("Update Room On Property Data:", data);
      if (data?.data?.success) {
        toast.success(
          `${data?.data?.message ? data?.data?.message : "room updated successfully!!"}`
        );
        queryClient.invalidateQueries("roomsOnBookingProperty");
      }
    },
    onError: (error) => {
      //   toast.error(
      //     error.response && error.response.data.message
      //       ? error.response.data.message
      //       : error.message
      //   );
      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message)
        ? data?.message?.map((m) => toast.error(m))
        : toast.error(data?.message);
      rollback();
    },
  });
}
