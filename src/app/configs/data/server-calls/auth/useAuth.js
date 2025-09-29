import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { setShopResetMailPAYLOAD } from 'app/configs/utils/authUtils';
import { authShopChangeEmail, authShopCloseAccountCall, authShopResetPasword } from '../../client/clientToApiRoutes';

/** *
 *  1) update user password by logged in merchant
 */
export function useShopSettingsResetPass() {
	const queryClient = useQueryClient();
	return useMutation(authShopResetPasword, {
		onSuccess: (data) => {
			if (data?.data && data?.data?.success) {
				toast.success(data?.data?.message);
			}
		},

		onError: (error) => {
			toast.error(
				error?.response && error?.response?.data?.message ? error?.response?.data?.message : error?.message
			);
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
			toast.error(
				error?.response && error?.response?.data?.message ? error?.response?.data?.message : error?.message
			);
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
			toast.error(
				error?.response && error?.response?.data?.message ? error?.response?.data?.message : error?.message
			);
		}
	});
}
