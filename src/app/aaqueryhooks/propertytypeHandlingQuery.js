import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
	createPropertyTypesEndpoint,
	deletePropertyTypesEndpoint,
	getAllPropertyTypesEndpoint,
	getSinglePropertyTypesEndpoint,
	updatePropertyTypesEndpoint
} from './routestoserver';
// import { resetForgotPassToken, setUserForgotPassCreedStorage } from './utils/opsUtils';

export default function useGetAllPropertytypes() {
	return useQuery(['__getAllPropertyTypes'], getAllPropertyTypesEndpoint);
}

/** *Get property type By Its ID */
export function useGetPropertyType(params) {
	// console.log('GETING SERVICETYPE-PARAMS', params)
	return useQuery(['__getAllPropertyTypes', params], () => getSinglePropertyTypesEndpoint(params), {
		enabled: Boolean(params)
		// staleTime: 5000,
	});
}

export function useCreatePropertyType() {
	const navigate = useNavigate();

	return useMutation(createPropertyTypesEndpoint, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.propertytype) {
				toast.success('property type created successfully');
				// window.alert(data?.data?.message )
				navigate(`/types/propertytypes`);
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

export function useUpdatePropertyType() {
	const navigate = useNavigate();

	return useMutation(updatePropertyTypesEndpoint, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.propertytype) {
				toast.success('property type updated successfully');
				// window.alert(data?.data?.message )
				navigate(`/types/propertytypes`);
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

export function useDeletePropertyType() {
	const navigate = useNavigate();

	return useMutation(deletePropertyTypesEndpoint, {
		onSuccess: (data) => {
			if (data?.data?.success && data?.data?.propertytype) {
				toast.success('property type deleted successfully');
				// window.alert(data?.data?.message )
				navigate(`/types/propertytypes`);
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
