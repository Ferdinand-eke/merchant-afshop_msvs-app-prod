import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { handleApiError } from '../../../utils/errorHandler';
import {
	createUserWalkinReservationsOnRoomAndProperty,
	getReservationsOnPropertyApi,
	getShopBookingsReservationsApi,
	getSingleMerchantReservationApi,
	getUserReservationsByRoomId,
	merchantCashOutReservationEarning,
	merchantCheckInGuestReservations,
	merchantCheckOutGuestReservations
} from '../../client/clientToApiRoutes';

/** *get all Specific user shop-estate property */
export default function useMyPropertiesReservations(params = {}) {
	return useQuery(['__merchant_reservations', params], () => getShopBookingsReservationsApi(params), {
		keepPreviousData: true // Keep previous data while fetching new data for smoother UX
	}); // ("Msvs: => : Done")
}

/** **Get  Reservations on a particular property */
export function useFetchReservationsOnProperty(propertyId) {
	return useQuery(
		['__merchant_reservations_on_property', propertyId],
		() => {
			return getReservationsOnPropertyApi(propertyId);
		},
		{
			enabled: Boolean(propertyId)
		}
	);
} // ("Msvs: => : Done")

/**** 6.1) get single room  getUserReservationsByRoomId*/
export function useGetReservationsOnRoom(params) {
  return useQuery(
    ["__reservationsByIdOnRoom", params],
    () => getUserReservationsByRoomId(params),
    {
      enabled: Boolean(params),
    }
  );
} // (Done => Msvs)


/**** 1.1) Create reservation On Room : => Done for Africanshops */ //(Done => Msvs)
export function useCreateWalkinGuestReservationOnRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation(
    (newReservation) => {
      return createUserWalkinReservationsOnRoomAndProperty(newReservation);
    },

    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success("reservation  added successfully!");
          queryClient.invalidateQueries(["__merchant_reservations"]);
          queryClient.refetchQueries("__merchant_reservations", { force: true });
        //   navigate(
        //     `/bookings/reservation/review/${data?.data?.createdReservation?.id}`
        //   );
        }
      },
      onError: (error, rollback) => {
        handleApiError(error, {
          fallbackMessage: "Failed to create room reservation. Please try again.",
          onErrorCallback: rollback
        });
      },
    }
  );
} //(Done => Msvs)




//
/** **Get single Guest Bookded Reservation */
export function useFindMerchantSingleReservation(itemId) {
	return useQuery(
		['__merchant_reservations', itemId],
		() => {
			return getSingleMerchantReservationApi(itemId);
		},
		{
			enabled: Boolean(itemId)
		}
	);
} // (Msvs => Done)

/** *Check In Guest Users Reservations */
export function useCheckInGuest() {
	const queryClient = useQueryClient();
	return useMutation(merchantCheckInGuestReservations, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Reservation Checked In successfully!'}`, {
					position: 'top-left' // ✅ correct way
				});
				queryClient.invalidateQueries('__merchant_reservations');
			}
		},
		onError: (err) => {
			handleApiError(err, 'Failed to check in guest');
		}
	});
}

/** *Check Out Guest Users Reservations */
export function useCheckOutGuest() {
	const queryClient = useQueryClient();
	return useMutation(merchantCheckOutGuestReservations, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(
					`${data?.data?.message ? data?.data?.message : 'Reservation Checked Out successfully!'}`,
					{
						position: 'top-left' // ✅ correct way
					}
				);
				queryClient.invalidateQueries('__merchant_reservations');
			}
		},
		onError: (err) => {
			handleApiError(err, 'Failed to check out guest');
		}
	});
}

/** *Cashout reservation earnings */
export function useCashoutMerchantReservationEarnings() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation(merchantCashOutReservationEarning, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message);
				queryClient.invalidateQueries('__merchant_reservations');
				navigate('/bookings/list-reservations');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to cashout reservation earnings');
		}
	});
}
