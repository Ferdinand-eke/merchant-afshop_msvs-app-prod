import { AuthApi } from './clientToApiRoutes';

/**
 * ============================================================================
 * INSPECTION SCHEDULES API ROUTES
 * ============================================================================
 */
export const getInspectionSchedules = () => {
	return AuthApi().get('/inspection-schedules/merchant/schedules');
};

/**
 * ============================================================================
 * PROPERTY OFFERS API ROUTES
 * ============================================================================
 */
export const getPropertyOffers = ({ propertyId, page = 1, limit = 10 }) => {
	const params = new URLSearchParams();
	if (propertyId) params.append('propertyId', propertyId);
	params.append('page', page);
	params.append('limit', limit);

	return AuthApi().get(`/realestate-offers/merchant/offers?${params.toString()}`);
};

export const getSingleOffer = (offerId) => {
	return AuthApi().get(`/realestate-offers/merchant/offer/${offerId}`);
};

export const declineOffer = ({ offerId, rejectionReason }) => {
	return AuthApi().put(`/realestate-offers/merchant/decline/${offerId}`, { rejectionReason });
};

export const acceptOffer = (offerId) => {
	return AuthApi().put(`/realestate-offers/merchant/accept/${offerId}`);
};

export const sendCounterOffer = ({ offerId, counterOfferAmount, counterOfferMessage }) => {
	return AuthApi().post(`/realestate-offers/merchant/counter/${offerId}`, {
		counterOfferAmount,
		counterOfferMessage
	});
};

export const revokeOfferApproval = ({ offerId, revocationReason }) => {
	return AuthApi().put(`/realestate-offers/merchant/revoke/${offerId}`, { revocationReason });
};

/**
 * ============================================================================
 * PROPERTY ACQUISITIONS API ROUTES
 * ============================================================================
 */
export const getPropertyAcquisitions = ({ limit = 10, offset = 0 }) => {
	return AuthApi().get(`/real-estate/acquisitions/merchant/properties?limit=${limit}&offset=${offset}`);
};

export const getSingleAcquisition = (acquisitionId) => {
	return AuthApi().get(`/real-estate/acquisitions/merchant/${acquisitionId}`);
};

export const uploadAgreementDocuments = ({ acquisitionId, documents }) => {
	return AuthApi().put(`/real-estate/acquisitions/merchant/${acquisitionId}/agreement-documents`, {
		documents
	});
};
