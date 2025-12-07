import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { merchantSignIn, resetshopPasswordWithcode, shopForgotPasswordInit } from '../client/clientToApiRoutes';
import {
	remove_SHOP_FORGOTPASS_TOKEN,
	setAuthCredentials,
	setAuthTokens,
	setShopForgotPasswordPAYLOAD
} from '../../utils/authUtils';
import { handleApiError } from '../../utils/errorHandler';

/** *1) Login for merchants account */
export function useAdminLogin() {
	return useMutation(merchantSignIn, {
		onSuccess: (data) => {
			if (data?.data?.data && data?.data?._nnip_shop_ASHP_ALOG) {
				setAuthCredentials(data?.data?.data);
				setAuthTokens(data?.data?._nnip_shop_ASHP_ALOG);
				toast.success('logged in successfully');

				window.location.replace('/shop-dashboard');
			} else if (data) {
				Array.isArray(data?.data?.message)
					? data?.data?.message?.map((m) => toast.error(m.message))
					: toast.error(data?.data?.message);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Login failed. Please check your credentials.');
		}
	});
}

/** *2) Forgot password for merchants account */
export function useShopForgotPass() {
	const navigate = useNavigate();
	return useMutation(shopForgotPasswordInit, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.token) {
				setShopForgotPasswordPAYLOAD(data?.data?.token);
				toast.success(data?.data?.message);

				navigate('/reset-password');
				return;
			}

			if (data?.data?.success) {
				toast.success(data?.data?.message);
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to initiate password reset. Please try again.');
		}
	});
}

/** *3) Reset password for merchants account */
export function useResetShopPass() {
	const navigate = useNavigate();
	return useMutation(resetshopPasswordWithcode, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				remove_SHOP_FORGOTPASS_TOKEN();
				toast.success(data?.data?.message);

				navigate('/sign-in');
			} else if (data?.data?.infomessage) {
				toast.error(data?.data?.infomessage);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to reset password. Please try again.');
		}
	});
}
