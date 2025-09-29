import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
	andminActivateNewUserEndpoint,
	andminCreateNewUserEndpoint,
	getAllUsers,
	getSingleUserAndListings
} from './routestoserver';
import { setCreateNewUserAccount } from './utils/opsUtils';
// import { resetForgotPassToken, setUserForgotPassCreedStorage } from './utils/opsUtils';

export default function useGetAllUsers() {
	return useQuery(['__getAllUsers'], getAllUsers);
}

/** *Get USER By  ID */
export function useGetUserDataById(params) {
	return useQuery(['__getAllUsers', params], () => getSingleUserAndListings(params), {
		enabled: Boolean(params)
		// || Boolean(params !== 'new')
		// staleTime: 5000,
	});
}

/** *Recruite New User Accounts */
export function useAdminCreateNewUser() {
	const navigate = useNavigate();
	return useMutation(andminCreateNewUserEndpoint, {
		onSuccess: (data) => {
			console.log('User-INVITATION-PAYLOAD', data?.data);
			// return activation_token

			if (data?.data?.success && data?.data?.activation_token) {
				setCreateNewUserAccount(data?.data?.activation_token);
				navigate('/users/user/authorize/activate');
				toast.success(data?.data?.message);
			} else if (data?.data?.error) {
				// toast.error(data?.data?.error?.message)
				console.log('In-BoundError:', data?.data?.error);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			const {
				response: { data }
			} = error ?? {};

			// Array.isArray(data?.message)
			//     ? data?.message?.map((m) => toast.error(m))
			//     : toast.error(data?.message)

			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);
		}
	});
}

/** *Recruite New User Accounts */
export function useActivateNewUserByAdmin() {
	const navigate = useNavigate();
	return useMutation(andminActivateNewUserEndpoint, {
		onSuccess: (data) => {
			// console.log("User-INVITATION-PAYLOAD", data?.data)
			// return
			if (data?.data?.success && data?.data?.user) {
				setCreateNewUserAccount(data?.data?.activation_token);
				navigate('/users/user');
				toast.success(data?.data?.message);
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				console.log('In-BoundError:', data?.data?.error);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			const {
				response: { data }
			} = error ?? {};

			// Array.isArray(data?.message)
			//     ? data?.message?.map((m) => toast.error(m))
			//     : toast.error(data?.message)
			console.log('INSIDE ERROR BLOCK', data);

			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);
		}
	});
}

// export function useStudentForgotPass() {
//   const navigate = useNavigate()

//     return useMutation(userForgotPassword, {
//         onSuccess: (data) => {

//             if (data?.data?.success ) {
//                 setUserForgotPassCreedStorage(data?.data?.forgotpass_activation_token)
//                 window.alert(data?.data?.message )

//                 navigate('/reset-password');
//                 return;

//             }
//             else if (data?.data?.error){
//                 window.alert(data?.data?.error?.message)
//                 return;

//             }else{
//                 window.alert('something unexpected happened')
//                 return;
//             }
//         },
//         onError: (error) => {
//           console.log("ForgotPASS22", error)
//         //   console.log("LoginError2211", JSON.stringify(error?.response) )
//         //   console.log("LoginError2212", error)
//         //   toast.error(error)
//         // const {
//         //     response: { data  },
//         //   }: any = error ?? {};

//         //   data?.message?.map((m : []) => toast.error(m))
//         const {
//             response: { data },
//         }= error ?? {}
//         // Array.isArray(data?.message)
//         // ? data?.message?.map((m) => toast.error(m))
//         // : toast.error(data?.message)

//         Array.isArray(data?.message)
//         ? data?.message?.map((m) => window.alert('error-message', m))
//         : window.alert(data?.message)

//         },
//     });

//   }
