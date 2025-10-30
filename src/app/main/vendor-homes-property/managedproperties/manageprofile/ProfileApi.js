import { apiService as api } from 'app/store/apiService';

// const baseUrl = 'https://sea-turtle-app-c6p3o.ondigitalocean.app';
const baseUrl = 'http://localhost:8000';

export const addTagTypes = [
	'inspection_schedules',
	'inspection_schedule_details',
	'property_offers',
	'property_offer_details',
	'property_acquisitions',
	'property_acquisition_details'
];

const ProfileApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			// ============== INSPECTION SCHEDULES ==============
			getInspectionSchedules: build.query({
				query: () => ({
					url: `${baseUrl}/inspection-schedules/merchant/schedules`,
					method: 'GET'
				}),
				providesTags: ['inspection_schedules']
			}),

			// ============== PROPERTY OFFERS ==============
			getPropertyOffers: build.query({
				query: ({ propertyId, page = 1, limit = 10 }) => ({
					url: `${baseUrl}/realestate-offers/merchant/offers`,
					method: 'GET',
					params: { propertyId, page, limit }
				}),
				providesTags: ['property_offers']
			}),

			getSingleOffer: build.query({
				query: (offerId) => ({
					url: `${baseUrl}/realestate-offers/merchant/offer/${offerId}`,
					method: 'GET'
				}),
				providesTags: (result, error, offerId) => [{ type: 'property_offer_details', id: offerId }]
			}),

			declineOffer: build.mutation({
				query: ({ offerId, rejectionReason }) => ({
					url: `${baseUrl}/realestate-offers/merchant/decline/${offerId}`,
					method: 'PUT',
					body: { rejectionReason }
				}),
				invalidatesTags: ['property_offers', 'property_offer_details']
			}),

			acceptOffer: build.mutation({
				query: (offerId) => ({
					url: `${baseUrl}/realestate-offers/merchant/accept/${offerId}`,
					method: 'PUT'
				}),
				invalidatesTags: ['property_offers', 'property_offer_details']
			}),

			sendCounterOffer: build.mutation({
				query: ({ offerId, counterOfferAmount, counterOfferMessage }) => ({
					url: `${baseUrl}/realestate-offers/merchant/counter/${offerId}`,
					method: 'POST',
					body: { counterOfferAmount, counterOfferMessage }
				}),
				invalidatesTags: ['property_offers', 'property_offer_details']
			}),

			revokeOfferApproval: build.mutation({
				query: ({ offerId, revocationReason }) => ({
					url: `${baseUrl}/realestate-offers/merchant/revoke/${offerId}`,
					method: 'PUT',
					body: { revocationReason }
				}),
				invalidatesTags: ['property_offers', 'property_offer_details']
			}),

			// ============== PROPERTY ACQUISITIONS ==============
			getPropertyAcquisitions: build.query({
				query: ({ limit = 10, offset = 0 }) => ({
					url: `${baseUrl}/real-estate/acquisitions/merchant/properties`,
					method: 'GET',
					params: { limit, offset }
				}),
				providesTags: ['property_acquisitions']
			}),

			getSingleAcquisition: build.query({
				query: (acquisitionId) => ({
					url: `${baseUrl}/real-estate/acquisitions/merchant/${acquisitionId}`,
					method: 'GET'
				}),
				providesTags: (result, error, acquisitionId) => [
					{ type: 'property_acquisition_details', id: acquisitionId }
				]
			}),

			uploadAgreementDocuments: build.mutation({
				query: ({ acquisitionId, documents }) => ({
					url: `${baseUrl}/real-estate/acquisitions/merchant/${acquisitionId}/agreement-documents`,
					method: 'PUT',
					body: { documents }
				}),
				invalidatesTags: ['property_acquisitions', 'property_acquisition_details']
			})
		}),
		overrideExisting: false
	});

export default ProfileApi;

export const {
	useGetInspectionSchedulesQuery,
	useGetPropertyOffersQuery,
	useGetSingleOfferQuery,
	useDeclineOfferMutation,
	useAcceptOfferMutation,
	useSendCounterOfferMutation,
	useRevokeOfferApprovalMutation,
	useGetPropertyAcquisitionsQuery,
	useGetSingleAcquisitionQuery,
	useUploadAgreementDocumentsMutation
} = ProfileApi;
