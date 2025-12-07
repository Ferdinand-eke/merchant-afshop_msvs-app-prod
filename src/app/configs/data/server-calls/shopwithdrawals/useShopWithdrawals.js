import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../utils/errorHandler';
import {
	getMyShopAccountApiDetails,
	getMyShopWithdrawals,
	transferToWalletEndpoint,
	updateMyShopAccountBankDetails,
	updateMyShopBankAccount,
	updateMyShopBankAccountPin,
	withdrawFromMyShopNow
} from '../../client/clientToApiRoutes';

export default function useGetMyShopWthdrawals() {
	return useQuery(['__myshop_withdrawals'], getMyShopWithdrawals);
}

export function useGetMyShopWalletDetails() {
	return useQuery(['__myshop_walletdetails'], getMyShopAccountApiDetails);
}

// update existing shop details
export function useShopAccountUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopBankAccount, {
		onSuccess: (data) => {
			console.log('Updated AccountDetails', data);
			console.log('Updated AccountDetails1212', data);

			if (data) {
				toast.success('account details updated successfully!!');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to update account details');
		}
	});
}

// update shop account pin
export function useAccountPinUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopBankAccountPin, {
		onSuccess: (data) => {
			console.log('Updated AccountPinDetails', data);

			if (data) {
				toast.success('account pin updated successfully!!');
				queryClient.invalidateQueries('__myshop_details');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to update account pin');
		}
	});
}

//
/** *############################################################
 * NEW AFRICANSHOPS AND BANK ACCOUNT DETAILS OPERATIONS
 *################################################################# */
// update existing shop details
export function useUpdateMyShopAccountMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopAccountBankDetails, {
		onSuccess: (data) => {
			console.log('Updated AccountDetails~~~', data?.data);

			if (data?.data) {
				toast.success('account details updated successfully!!');
				queryClient.invalidateQueries('__myshop_details');
				queryClient.invalidateQueries('__myshop_walletdetails');
				queryClient.invalidateQueries('__myshop_account_balance');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to update shop account details');
		}
	});
}

// trandfer funds from shop to shop_Wallet
export function useTransferToShopWalletMutation() {
	const queryClient = useQueryClient();

	return useMutation(transferToWalletEndpoint, {
		onSuccess: (data) => {
			console.log('In-Transfer_Block', data);

			if (data?.data) {
				// console.log('In-Transfer_Block', data);
				toast.success('withdrawal placed successfully!!');
				toast.success(`${data?.data?.message}`);
				queryClient.invalidateQueries('__myshop_details');
				queryClient.invalidateQueries('__myshop_walletdetails');
				queryClient.invalidateQueries('__myshop_account_balance');
			} else if (data?.data?.message) {
				toast.error(`${data?.data?.message}`);
			}
		},
		onError: (error) => {
			// console.log('MuTationError', error);
			// console.log('MuTationErrorMessage', error.message);
			handleApiError(error, 'Failed to transfer to wallet');
		}
	});
}

// withdraw funds from shop to shop_Wallet
// export function useWithdrawWalletFundsMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(withdrawFromMyShopNow, {
//     onSuccess: (data) => {
//       console.log('Withdrwal Placed', data);

//       if (data) {
//         toast.success('withdrawal placed successfully!!');
//         toast.success(`${data?.message}`);
//         queryClient.invalidateQueries('__myshop_details');
//         queryClient.invalidateQueries('__myshop_walletdetails');
//       }
//     },
//     onError: (error) => {
//       console.log('MuTationError', error);
//       // console.log('MuTationErrorMessage', error.message);
//       toast.error(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//     },
//   });
// }

// place shop account withdrawal
export function usePlaceWithdrawalMutation() {
	const queryClient = useQueryClient();

	return useMutation(withdrawFromMyShopNow, {
		onSuccess: (data) => {
			// console.log('Withdrwal Placed', data);

			if (data?.data) {
				toast.success('withdrawal placed successfully!!');
				queryClient.invalidateQueries('__myshop_details');
				queryClient.invalidateQueries('__myshop_walletdetails');
				queryClient.invalidateQueries('__myshop_withdrawals');
			}
		},
		throwOnError: true,
		onError: (error) => {
			console.log('MuTationError', error);
			// console.log('MuTationErrorMessage', error.message);
			handleApiError(error, 'Failed to place withdrawal');
			// toast.error('possible wrong account pin ');
		}
	});
}
