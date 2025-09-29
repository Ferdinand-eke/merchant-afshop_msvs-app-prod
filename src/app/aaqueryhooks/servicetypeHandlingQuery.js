import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
	createServiceTypes,
	deleteServiceTypesRoute,
	getAllServiceTypes,
	getSingleServiceType,
	updateServiceTypesRoute
} from './routestoserver';
// import { resetForgotPassToken, setUserForgotPassCreedStorage } from './utils/opsUtils';

export default function useGetAllServicetypes() {
	return useQuery(['__getAllServiceTypes'], getAllServiceTypes);
}

/** *Get Listing By Its ID */
export function useGetSingleServiveType(params) {
	// console.log('GETING SERVICETYPE-PARAMS', params)
	return useQuery(['__getAllServiceTypesById', params], () => getSingleServiceType(params), {
		enabled: Boolean(params)
		// staleTime: 5000,
	});
}

export function useCreateServiceType() {
	const navigate = useNavigate();

	return useMutation(createServiceTypes, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.servicetype) {
				toast.success('service type created successfully');
				// window.alert(data?.data?.message )
				navigate(`/packages/servicetypes`);
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				// window.alert(data?.data?.error?.message)
			} else {
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

export function useUpdateServiceType() {
	const navigate = useNavigate();

	return useMutation(updateServiceTypesRoute, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.servicetype) {
				toast.success('service type updated successfully');
				// window.alert(data?.data?.message )
				navigate(`/packages/servicetypes`);
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				// window.alert(data?.data?.error?.message)
			} else {
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

export function useDeleteServiceType() {
	const navigate = useNavigate();

	return useMutation(deleteServiceTypesRoute, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.servicetype) {
				toast.success('service type deleted successfully');
				// window.alert(data?.data?.message )
				navigate(`/packages/servicetypes`);
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
				// window.alert(data?.data?.error?.message)
			} else {
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
