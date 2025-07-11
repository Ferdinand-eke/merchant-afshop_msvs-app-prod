import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getMyShopBookingsPropertyBySlug,
  getShopBookingsProperties,
  storeShopBookingsProperty,
  updateMyShopBookingsPropertyById,
} from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

/***1) get all Specific user shop-Bookings property   */ 
export default function useMyShopBookingsProperties() {
  return useQuery(['__myshop_bookingsproperties'], getShopBookingsProperties);
}


/****2) get single booking property details */
export function useSingleShopBookingsProperty(slug) {
  if (!slug || slug === "new") {
    return {};
  }
  return useQuery(
    ['singlebookingproperty', slug],
    () => getMyShopBookingsPropertyBySlug(slug),
    {
      enabled: Boolean(slug),
    }
  );
}

/****3) create new Booking property */
export function useAddShopBookingsPropertyMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newEstateProperty) => {
      return storeShopBookingsProperty(newEstateProperty);
    },

    {
      onSuccess: (data) => {
        console.log("creatBokibg_Property_DATA", data)
        if (data?.data?.success) {
          toast.success('property  added successfully!');
          queryClient.invalidateQueries(['__myshop_bookingsproperties']);
          queryClient.refetchQueries('__myshop_bookingsproperties', { force: true });
          navigate('/bookings/managed-listings')
        }
      },
    },
    {
      onError: (error, rollback) => {
        console.log("creatBokibg_Property_ERROR", error)
        console.log('MutationError 2', error.response.data);
        console.log('MutationError 3', error.data);
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        rollback();
     
      },
    }
  );
}

/*****4) update existing  bookings-property */
export function useBookingsPropertyUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopBookingsPropertyById, {
    onSuccess: (data) => {
      if (data?.data?.success) {
       toast.success(`${data?.data?.message ? data?.data?.message : "product updated successfully!!"}`);
        queryClient.invalidateQueries('__myshop_bookingsproperties');
      }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}
