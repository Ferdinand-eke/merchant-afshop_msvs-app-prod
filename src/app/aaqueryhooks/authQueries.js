import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { userForgotPassword, userResetPasswordWithCode } from './routestoserver';
import { resetForgotPassToken, setUserForgotPassCreedStorage } from './utils/opsUtils';

export function useStudentForgotPass() {
	const navigate = useNavigate();

	return useMutation(userForgotPassword, {
		onSuccess: (data) => {
			// console.log("Forgot-Pass__DATA-000", data?.data)

			if (data?.data?.success) {
				setUserForgotPassCreedStorage(data?.data?.forgotpass_activation_token);
				toast.success(data?.data?.message);

				navigate('/reset-password');
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				// window.alert(data?.data?.error?.message)
			} else {
				// toast.info('something unexpected happened')
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			const {
				response: { data }
			} = error ?? {};
			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);

			// Array.isArray(data?.message)
			// ? data?.message?.map((m) => window.alert('error-message', m))
			// : window.alert(data?.message)
		}
	});
}

export function useStudentResetPass() {
	const navigate = useNavigate();

	return useMutation(userResetPasswordWithCode, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				//   console.log("Reset-Pass__DATA--22", data?.data)
				toast.success(data?.data?.message);
				resetForgotPassToken();
				navigate('/sign-in');
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				// window.alert(data?.data?.error?.message)
			} else {
				// toast.info('something unexpected happened')
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			const {
				response: { data }
			} = error ?? {};
			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);

			// Array.isArray(data?.message)
			// ? data?.message?.map((m) => window.alert('error-message', m))
			// : window.alert(data?.message)
		}
	});
}
