import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	getReservationsOnPropertyApi,
	getShopBookingsReservationsApi,
	getSingleMerchantReservationApi,
	merchantCashOutReservationEarning,
	merchantCheckInGuestReservations,
	merchantCheckOutGuestReservations
} from '../../client/clientToApiRoutes';

/** *get all Specific user shop-estate property */
export default function useMyPropertiesReservations() {
	return useQuery(['__merchant_reservations'], getShopBookingsReservationsApi); // ("Msvs: => : Done")
}

/** **Get  Reservations on a particular property */
export function useFetchReservationsOnProperty(propertyId) {
	if (!propertyId) return { data: null, isLoading: false, isError: true };

	return useQuery(['__merchant_reservations_on_property', propertyId], () => {
		return getReservationsOnPropertyApi(propertyId);
	});
} // ("Msvs: => : Done")

//
/** **Get single Guest Bookded Reservation */
export function useFindMerchantSingleReservation(itemId) {
	if (!itemId) return { data: null, isLoading: false, isError: true };

	return useQuery(['__merchant_reservations', itemId], () => {
		return getSingleMerchantReservationApi(itemId);
	});
} // (Msvs => Done)

/** *Check In Guest Users Reservations */
export function useCheckInGuest() {
	const queryClient = useQueryClient();
	return useMutation(merchantCheckInGuestReservations, {
		onSuccess: (data) => {
			// console.log("CHECK[IN-RESPONSE-DATA", data?.data)
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Reservation Checked In successfully!'}`, {
					position: toast.POSITION.TOP_LEFT
				});
				// toast.success('Reservation Checked In successfully!', { position: toast.POSITION.TOP_LEFT });
				queryClient.invalidateQueries('__merchant_reservations');
			}
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}

/** *Check Out Guest Users Reservations */
export function useCheckOutGuest() {
	const queryClient = useQueryClient();
	return useMutation(merchantCheckOutGuestReservations, {
		onSuccess: (data) => {
			// console.log("Check-OUT-RESPONSE-DATA", data?.data)
			if (data?.data?.success) {
				// , { position: toast.POSITION.TOP_LEFT }
				toast.success(`${data?.data?.message ? data?.data?.message : 'Reservation Checked Out successfully!'}`);
				queryClient.invalidateQueries('__merchant_reservations');
			}
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}

/** *Cashout reservation earnings */
export function useCashoutMerchantReservationEarnings() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation(merchantCashOutReservationEarning, {
		onSuccess: (data) => {
			// console.log("Cash-Out-Success", data?.data)
			if (data?.data?.success) {
				// toast.success('Reservation Transaction Sealed successfully!');
				toast.success(data?.data?.message);
				queryClient.invalidateQueries('__merchant_reservations');
				navigate('/bookings/list-reservations');
			}
		},
		onError: (error) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
		}
	});
}
