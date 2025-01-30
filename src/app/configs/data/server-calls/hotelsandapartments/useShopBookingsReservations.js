import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getShopBookingsReservationsApi, getSingleMerchantReservationApi, merchantCashOutReservationEarning, merchantCheckInGuestReservations, merchantCheckOutGuestReservations } from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

/***get all Specific user shop-estate property */   
export default function useMyPropertiesReservations() {
  return useQuery(['__merchant_reservations'], getShopBookingsReservationsApi);
}

/****Get single Guest Bookded Reservation */
export function useFindMerchantSingleReservation(itemId) {
  return useQuery(['__merchant_reservations', itemId], () => {
    return getSingleMerchantReservationApi(itemId)
  }
  );
}

/***Check In Guest Users Reservations */
export function useCheckInGuest() {
  const queryClient = useQueryClient();
  return useMutation(merchantCheckInGuestReservations, {
    onSuccess: (data) => {
      if(data){
        toast.success('Reservation Checked In successfully!');
        queryClient.invalidateQueries('__merchant_reservations');
      }
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

/***Check Out Guest Users Reservations */
export function useCheckOutGuest() {
  const queryClient = useQueryClient();
  return useMutation(merchantCheckOutGuestReservations, {
    onSuccess: (data) => {
      if(data){

        toast.success('Reservation Checked Out successfully!');
        queryClient.invalidateQueries('__merchant_reservations');
      }
   
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}


/***Cashout reservation earnings */
export function useCashoutMerchantReservationEarnings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(merchantCashOutReservationEarning, {
    onSuccess: (data) => {
      // console.log("Cash-Out-Success", data?.data)
      if(data?.data?.success){
        // toast.success('Reservation Transaction Sealed successfully!');
        toast.success(data?.data?.message)
        queryClient.invalidateQueries('__merchant_reservations');
        navigate('/bookings/list-reservations');
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
