import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
	removeMerchantSignUpToken,
	removeResendMerchantSignUpOtp,
	setMerchantSignUpStorage
} from 'app/configs/utils/authUtils';
import { useNavigate } from 'react-router';
import { handleApiError } from '../../../utils/errorHandler';
import {
	// newShopSignup,
	newShopSignupWithOtp,
	// storePreShopUserData,
	storePreShopUserDataWithOtp
} from '../../client/clientToApiRoutes';
// import {
//     newShopSignup,
//     storePreShopUserData,
// } from '~/repositories/RepositoryClient';

/** ***
 * sign up new shop entry without and with otp
 */
export function useShopSignUp() {
	const queryClient = useQueryClient();

	return useMutation(newShopSignup, {
		onSuccess: (data) => {
			if (data) {
				toast.success(data?.data?.message);
			}
		},
		onError: (error) => {
			console.log('MuTationError', error);
			console.log('MuTationErrorMessage', error.message);
			handleApiError(error, 'Failed to sign up. Please try again');
		}
	});
}

export function useShopSignUpWithOtp() {
	const queryClient = useQueryClient();

	return useMutation(newShopSignupWithOtp, {
		onSuccess: (data) => {
			console.log('preShopSignUp', data?.data);

			if (data?.data?.registration_activation_token && data?.data?.message) {
				// Store tokrn in cookie
				setMerchantSignUpStorage(data?.data?.registration_activation_token);
				toast.success(data?.data?.message);
			}

			if (data?.data?.errors) {
				console.log('preShopSignUpErrors', data?.data?.errors);
				// const {
				//     response: { data },
				//   } = data?.data?.error ?? {};
				Array.isArray(data?.data?.errors)
					? data?.data?.errors?.map((m) => toast.error(`${`${m?.message}` + `for` + ` ` + ` ${m?.path[1]}`}`))
					: toast.error(data?.data?.errors?.message);
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to sign up with OTP. Please try again');
		}
	});
} // (Mcsvs => Done)

// Store New Shop User from token
export function useStoreShopPreSignUp() {
	const queryClient = useQueryClient();

	return useMutation(storePreShopUserData, {
		onSuccess: (data) => {
			console.log('RegistrationResponse', data);
			console.log('ResponseMessage', data?.data?.message);

			if (data) {
				toast.success(data?.data?.message);
			}
		},
		onError: (error) => {
			console.log('MuTationError', error);
			console.log('MuTationErrorMessage', error.message);
			handleApiError(error, 'Failed to complete registration. Please try again');
		}
	});
}

// Forgot ShopUser password **Not Authenticated
// export function useShopForgotPassword() {
//     const queryClient = useQueryClient();

//     return useMutation(userShopForgotPassword, {
//         onSuccess: (data) => {
//             console.log('ForgotPassResponse', data);
//             console.log('ForgotResponseMessage', data?.data?.message);

//             if (data) {
//                 toast.success(data?.data?.message);
//             }
//         },
//         onError: (error) => {
//             console.log('MuTationError', error);
//             console.log('MuTationErrorMessage', error.message);
//             toast.error(
//                 error.response && error.response.data.message
//                     ? error.response.data.message
//                     : error.message
//             );
//         },
//     });
// }

// Reset ShopUser password on identity confirmation **Not Authenticated
// export function useShopResetPassword() {
//     const queryClient = useQueryClient();

//     return useMutation(userShopResetPassword, {
//         onSuccess: (data) => {

//             if (data) {
//                 toast.success(data?.data?.message);
//             }

//         },
//         onError: (error) => {
//             toast.error(
//                 error.response && error.response.data.message
//                     ? error.response.data.message
//                     : error.message
//             );
//         },
//     });
// }

/** *Store New Shop User from OTP */
export function useStoreShopPreSignUpFromOtp() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(storePreShopUserDataWithOtp, {
		onSuccess: (data) => {
			console.log('RegistrationResponse', data?.data);
			console.log('ResponseMessage', data?.data?.message);

			if (data?.data?.success) {
				// && data?.data?.newShopFinanceAccount
				toast.success(data?.data?.message);
				removeMerchantSignUpToken();
				removeResendMerchantSignUpOtp();
				navigate('/sign-in');
				// toast.success(data?.data?.success && data?.data?.message && data?.data?.newShopFinanceAccount);
			}

			if (data?.data?.errors) {
				console.log('activate Merchant Errors', data?.data?.errors);

				Array.isArray(data?.data?.errors)
					? data?.data?.errors?.map((m) => toast.error(`${`${m?.message}` + `for` + ` ` + ` ${m?.path[1]}`}`))
					: toast.error(data?.data?.errors?.message);
			}
		},
		onError: (error) => {
			console.log('MuTationError', error);
			console.log('MuTationErrorMessage', error.message);
			handleApiError(error, 'Failed to activate account. Please try again');
		}
	});
} // (Mcsvs => Done)
