import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../utils/errorHandler';
import {
	createMerchantFintechAccount,
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
	return useQuery(['__myshop_account_balance'], getMyShopAccountApiDetails, {
		retry: 2,
		staleTime: 30000, // 30 seconds
		refetchOnWindowFocus: true,
		select: (data) => {
			// Transform the response to handle the nested structure correctly
			if (data?.data?.success === false && data?.data?.payload === null) {
				return { ...data, hasAccount: false };
			}
			return { ...data, hasAccount: true };
		}
	});
}

/** *Create Merchant Fintech Account */
export function useCreateMerchantAccount() {
	const queryClient = useQueryClient();

	return useMutation(createMerchantFintechAccount, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Account created successfully!');
				// Invalidate and refetch account balance
				queryClient.invalidateQueries('__myshop_account_balance');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to create account');
		}
	});
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
			handleApiError(error, 'Failed to update shop details');
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
			handleApiError(error, 'Failed to create shop branch');
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
			handleApiError(error, 'Failed to update shop branch');
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
