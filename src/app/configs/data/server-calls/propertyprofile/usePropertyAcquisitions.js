import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
	getPropertyAcquisitions,
	getSingleAcquisition,
	uploadAgreementDocuments
} from '../../client/propertyProfileApiRoutes';

/**
 * Get all property acquisitions for the merchant
 * @param {Object} params - Query parameters (limit, offset)
 * @returns {Object} React Query result with acquisitions data
 */
export default function usePropertyAcquisitions({ limit = 10, offset = 0 } = {}) {
	return useQuery(
		['property_acquisitions', { limit, offset }],
		() => getPropertyAcquisitions({ limit, offset }),
		{
			staleTime: 5 * 60 * 1000, // 5 minutes
			refetchOnWindowFocus: false,
			keepPreviousData: true // Keep previous data while fetching new page
		}
	);
}

/**
 * Get a single acquisition by ID
 * @param {string} acquisitionId - The acquisition ID
 * @returns {Object} React Query result with single acquisition data
 */
export function useSingleAcquisition(acquisitionId) {
	return useQuery(['property_acquisition', acquisitionId], () => getSingleAcquisition(acquisitionId), {
		enabled: Boolean(acquisitionId),
		staleTime: 5 * 60 * 1000
	});
}

/**
 * Mutation to upload agreement documents
 * @returns {Object} React Query mutation result
 */
export function useUploadAgreementDocumentsMutation() {
	const queryClient = useQueryClient();

	return useMutation(uploadAgreementDocuments, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Agreement documents uploaded successfully!');
				queryClient.invalidateQueries('property_acquisitions');
				queryClient.invalidateQueries('property_acquisition');
			}
		},
		onError: (error) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
		}
	});
}
