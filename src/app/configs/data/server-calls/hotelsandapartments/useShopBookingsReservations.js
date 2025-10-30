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
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
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
			if (data?.data?.success) {
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
