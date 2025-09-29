import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
	adminUserInviteAcceptanceEndpoint,
	getAllAdminsRoutes,
	getSingleAdminUser,
	recruitAdminUserEndpoint
} from './routestoserver';
// import { resetForgotPassToken, setUserForgotPassCreedStorage } from './utils/opsUtils';

export default function useGetAllAdminUsers() {
	return useQuery(['__getAllAdmin'], getAllAdminsRoutes);
}

/** *Get Admin By Its ID */
export function useGetAdminById(params) {
	return useQuery(['__getAllAdmin', params], () => getSingleAdminUser(params), {
		enabled: Boolean(params) || Boolean(params !== 'new')

		// staleTime: 5000,
	});
}

/** *Recruite New Admins */
export function useAdminRecruitStaff() {
	const navigate = useNavigate();
	//   const queryClient = useQueryClient()
	return useMutation(recruitAdminUserEndpoint, {
		onSuccess: (data) => {
			console.log('ADMIN-INVITATION-PAYLOAD', data?.data);

			// return
			if (data?.data?.success && data?.data?.activation_token) {
				//   window.alert('Admin Invite Sent, Acceptance Pending')
				toast.success('Admin Invite Sent, Acceptance Pending');
				navigate('/users/admin');
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				//   toast.error(data?.data?.error?.message)
				//   console.log("In-BoundError:", data?.data?.error)
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			const {
				response: { data }
			} = error ?? {};

			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);

			//   Array.isArray(data?.message)
			//       ? data?.message?.map((m) => console.log(m))
			//       : console.log(data?.message)
		}
	});
}

/** *Admin Accept Invites */
export function useAdminInvitationAcceptance() {
	// const router = useRouter()
	const navigate = useNavigate();
	// const queryClient = useQueryClient()
	return useMutation(adminUserInviteAcceptanceEndpoint, {
		onSuccess: (data) => {
			console.log('ADMIN-ACCEPT-INVITATION-PAYLOAD', data?.data);

			//    return
			if (data?.data?.success && data?.data?.adminuser) {
				// window.alert('Invitation Accepted, Welcome Onboard, Please Log in.')
				toast.success('Invitation Accepted, Welcome Onboard, Please Log in.');
				navigate('/sign-in');
			} else if (data?.data?.error) {
				// console.log("In-BoundError000:", data?.data?.error)
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);

				// toast.error(data?.data?.error?.message)
				// console.log("In-BoundError:", data?.data?.error?.message)
			} else {
				// toast.info('something unexpected happened')
			}
		},
		onError: (error) => {
			onsole.log('In-BoundError222:', error);
			const {
				response: { data }
			} = error ?? {};

			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);

			// Array.isArray(data?.message)
			//     ? data?.message?.map((m) => console.log(m))
			//     : console.log(data?.message)
		}
	});
}
