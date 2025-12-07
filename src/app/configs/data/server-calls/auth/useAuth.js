import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { setShopResetMailPAYLOAD } from 'app/configs/utils/authUtils';
import { handleApiError } from '../../../utils/errorHandler';
import {
	authShopChangeEmail,
	authShopCloseAccountCall,
	authShopChangePasword,
	initiateMerchantChangeEmail
} from '../../client/clientToApiRoutes';

/** *
 *  1) update user password by logged in merchant
 */
export function useShopSettingsChangePass() {
	const queryClient = useQueryClient();
	return useMutation(authShopChangePasword, {
		onSuccess: (data) => {
			console.log('Transaction Data', data);

			if (data?.data?.success) {
				toast.success(data?.data?.message);
			}
		},

		onError: (error) => {
			handleApiError(error, 'Failed to change password');
		}
	});
} // (Mcsvs => Done)

/** ** 2) Initiate Base-Merchant email while logged in */
export function useInitiateBaseMerchantSettingsChangeEmail() {
	const queryClient = useQueryClient();

	return useMutation(initiateMerchantChangeEmail, {
		onSuccess: (data) => {
			if (data?.data && data?.data?.success && data?.data?.changemail_activation_token) {
				toast.success(data?.data?.message);

				setShopResetMailPAYLOAD(data?.data?.changemail_activation_token);
			}
		},

		onError: (error) => {
			handleApiError(error, 'Failed to initiate email change');
		}
	});
}

/** ** 2) change user email while logged in */
export function useShopSettingsChangeEmail() {
	const queryClient = useQueryClient();

	return useMutation(authShopChangeEmail, {
		onSuccess: (data) => {
			if (data?.data && data?.data?.success && data?.data?.changemail_activation_token) {
				toast.success(data?.data?.message);

				setShopResetMailPAYLOAD(data?.data?.changemail_activation_token);
			}
		},

		onError: (error) => {
			handleApiError(error, 'Failed to change email');
		}
	});
}

/** ** 3) close user account and log out user */
export function useShopSettingsCloseShopAccount() {
	const queryClient = useQueryClient();

	return useMutation(authShopCloseAccountCall, {
		onSuccess: (data) => {
			console.log('closeAccountDetasil', data);
		},

		onError: (error) => {
			handleApiError(error, 'Failed to close account');
		}
	});
}
