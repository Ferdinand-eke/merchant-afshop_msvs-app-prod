import { useMutation, useQuery, useQueryClient } from 'react-query';

import { toast } from 'react-toastify';
import {
	createMyShopBranch,
	getJustMyShopDetails,
	getJustMyShopDetailsAndPlan,
	getJustMyShopDetailsAndPlanForUpdate,
	getMinimizedJustMyShopDetails,
	getMyOtherShopsList,
	getMyShopAccountApiDetails,
	getMyShopDetails,
	getShopSealedBookingsReservationsApi,
	updateMyShopBranch,
	updateMyShopDetails
} from '../../client/clientToApiRoutes';

export default function useGetMyShopDetails() {
	return useQuery(['__myshop_details'], getMyShopDetails);
} //* (Msvs => Done)

/** ***Get just my shop details */
export function useGetMinimizedJustMyShopDetailsQuery() {
	return useQuery(['__justmyshop'], getMinimizedJustMyShopDetails);
}

export function useGetJustMyShopDetails() {
	return useQuery(['__justmyshop_Details'], getJustMyShopDetails);
}

// useGetMyShopDetails
export function useGetMyOtherShopLists() {
	return useQuery(['__myshop_other_details'], getMyOtherShopsList);
}

// Shop details and shop plan
export function useGetMyShopAndPlan(boolValue) {
	// '?queryAllData=${queryParam}');boolValue
	//
	// console.log("BoolValue", boolValue)
	// return useQuery(['__myshop_and_accountplan'], getJustMyShopDetailsAndPlan(boolValue)); boolValue
	return useQuery(
		['__myshop_and_accountplan', boolValue], // include boolValue to refetch when it changes boolValue
		() => getJustMyShopDetailsAndPlan(boolValue)
	);
} // (Mcsvs => Done)

/** *Shop details and shop plan For Update */
export function useGetMyShopAndPlanForUpdate() {
	return useQuery(['__myshop_and_accountplan_for_Update'], getJustMyShopDetailsAndPlanForUpdate);
} // (Mcsvs => Done)

/** **
 *
 * FINANCE MANAGEMENT STARTS HERE
 */
/** *Get Shop Wallet Account Balance */
export function useGetShopAccountBalance() {
	return useQuery(['__myshop_account_balance'], getMyShopAccountApiDetails);
}

// update existing shop details
export function useShopUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopDetails, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'shop updated successfully!'}`);
				queryClient.invalidateQueries('__myshop_details');
			}
		},
		onError: (error) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
		}
	});
} // (Msvs => Done)

/** Create a new Shop Vendor */
export function useCreateVendorShopBranch() {
	const queryClient = useQueryClient();

	return useMutation(createMyShopBranch, {
		onSuccess: (data) => {
			if (data) {
				toast.success(data?.data?.message);
				queryClient.invalidateQueries('shops');
			}
		},
		onError: (error, data) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
			// queryClient.invalidateQueries('__myshop_orders');
		}
	});
}

/** *Update Vendor Branch Details here */
export function useUpdateVendorShopBranch() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopBranch, {
		onSuccess: (data) => {
			if (data) {
				toast.success('Shop data updated successfully');
				// queryClient.invalidateQueries('__myshop_details');

				queryClient.invalidateQueries('shops');
				// queryClient.refetchQueries('__myshop_products', { force: true });
			}

			// navigate('/transaction-list'); error.message
		},
		onError: (error) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
			// queryClient.invalidateQueries('__myshop_orders');
		}
	});
}

/** **
 * #######################################################################
 *               HANDLE HOTELS & APARTMENTS DATAS
 * #######################################################################
 */

/** ***Get Hotel & Apartments Sealed Reservations */
export function useGetMerchantSealedReservations() {
	return useQuery(['__justmyshop'], getShopSealedBookingsReservationsApi);
} // (Msvs : => :)
