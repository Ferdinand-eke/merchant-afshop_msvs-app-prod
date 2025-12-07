import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../utils/errorHandler';
import {
	getPropertyOffers,
	getSingleOffer,
	declineOffer,
	acceptOffer,
	sendCounterOffer,
	revokeOfferApproval
} from '../../client/propertyProfileApiRoutes';

/**
 * Get all property offers for the merchant
 * @param {Object} params - Query parameters (propertyId, page, limit)
 * @returns {Object} React Query result with offers data
 */
export default function usePropertyOffers({ propertyId, page = 1, limit = 10 } = {}) {
	return useQuery(
		['property_offers', { propertyId, page, limit }],
		() => getPropertyOffers({ propertyId, page, limit }),
		{
			staleTime: 5 * 60 * 1000, // 5 minutes
			refetchOnWindowFocus: false,
			keepPreviousData: true // Keep previous data while fetching new page
		}
	);
}

/**
 * Get a single offer by ID
 * @param {string} offerId - The offer ID
 * @returns {Object} React Query result with single offer data
 */
export function useSingleOffer(offerId) {
	return useQuery(['property_offer', offerId], () => getSingleOffer(offerId), {
		enabled: Boolean(offerId),
		staleTime: 5 * 60 * 1000
	});
}

/**
 * Mutation to decline an offer
 * @returns {Object} React Query mutation result
 */
export function useDeclineOfferMutation() {
	const queryClient = useQueryClient();

	return useMutation(declineOffer, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Offer declined successfully!');
				queryClient.invalidateQueries('property_offers');
				queryClient.invalidateQueries('property_offer');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to decline offer');
		}
	});
}

/**
 * Mutation to accept an offer
 * @returns {Object} React Query mutation result
 */
export function useAcceptOfferMutation() {
	const queryClient = useQueryClient();

	return useMutation(acceptOffer, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Offer accepted successfully!');
				queryClient.invalidateQueries('property_offers');
				queryClient.invalidateQueries('property_offer');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to accept offer');
		}
	});
}

/**
 * Mutation to send a counter offer
 * @returns {Object} React Query mutation result
 */
export function useSendCounterOfferMutation() {
	const queryClient = useQueryClient();

	return useMutation(sendCounterOffer, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Counter offer sent successfully!');
				queryClient.invalidateQueries('property_offers');
				queryClient.invalidateQueries('property_offer');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to send counter offer');
		}
	});
}

/**
 * Mutation to revoke offer approval
 * @returns {Object} React Query mutation result
 */
export function useRevokeOfferApprovalMutation() {
	const queryClient = useQueryClient();

	return useMutation(revokeOfferApproval, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Offer approval revoked successfully!');
				queryClient.invalidateQueries('property_offers');
				queryClient.invalidateQueries('property_offer');
			}
		},
		onError: (error) => {
			handleApiError(error, 'Failed to revoke offer approval');
		}
	});
}
