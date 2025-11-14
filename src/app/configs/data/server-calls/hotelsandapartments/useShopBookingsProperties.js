import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	// createRoomOnProperty,
	//  updateRoomOnProperty,
	// getBookingsPropertyRoomsById,
	getMyShopBookingsPropertyBySlug,
	getShopBookingsProperties,
	storeShopBookingsProperty,
	updateMyShopBookingsPropertyById,
	updatePropertyListingImage,
	deletePropertyListingImage
} from '../../client/clientToApiRoutes';

/** *1) get all Specific user shop-Bookings property   */
export default function useMyShopBookingsProperties(params = {}) {
	return useQuery(['__myshop_bookingsproperties', params], () => getShopBookingsProperties(params), {
		keepPreviousData: true // Keeps previous data while fetching new data for smoother transitions
	});
}

/** **2) get single booking property details */
export function useSingleShopBookingsProperty(slug) {
	return useQuery(['singlebookingproperty', slug], () => getMyShopBookingsPropertyBySlug(slug), {
		enabled: Boolean(slug) && slug !== 'new'
	});
}

/** **3) create new Booking property */
export function useAddShopBookingsPropertyMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newEstateProperty) => {
			return storeShopBookingsProperty(newEstateProperty);
		},

		{
			onSuccess: (data) => {
				console.log('creatBokibg_Property_DATA', data);

				if (data?.data?.success) {
					toast.success('property  added successfully!');
					queryClient.invalidateQueries(['__myshop_bookingsproperties']);
					queryClient.refetchQueries('__myshop_bookingsproperties', {
						force: true
					});
					navigate('/bookings/managed-listings');
				}
			}
		},
		{
			onError: (error, rollback) => {
				const {
					response: { data }
				} = error ?? {};
				Array.isArray(data?.message)
					? data?.message?.map((m) => {
							console.log('Update Booking Property Error:', m);
							return toast.error(m);
						})
					: toast.error(data?.message);
				rollback();
				// console.log('creatBokibg_Property_ERROR', error);
				// console.log('MutationError 2', error.response.data);
				// console.log('MutationError 3', error.data);
				// toast.error(
				// 	error.response && error.response.data.message ? error.response.data.message : error.message
				// );
				// rollback();
			}
		}
	);
}

/** ***4) update existing  bookings-property */
export function useBookingsPropertyUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopBookingsPropertyById, {
		onSuccess: (data) => {
			console.log('Update Booking Property Data:', data);

			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'product updated successfully!!'}`);
				queryClient.invalidateQueries('__myshop_bookingsproperties');
			}
		},
		onError: (error) => {
			console.log('Update Booking Property Error__11:', error);

			const {
				response: { data }
			} = error ?? {};
			Array.isArray(data?.message)
				? data?.message?.map((m) => {
						console.log('Update Booking Property Error:', m);
						return toast.error(m);
					})
				: toast.error(data?.message);
			rollback();

			// toast.error(

			//   error.response && error.response.data.message
			//     ? error.response.data.message
			//     : error.message
			// );
		}
	});
}

/**
 * Utility function to format and display error messages
 * Handles both NestJS and Express error response formats
 */
const handleApiError = (error) => {
	console.error('API Error:', error);

	if (!error?.response?.data) {
		toast.error(error?.message || 'An unexpected error occurred');
		return;
	}

	const { data } = error.response;

	// Handle NestJS validation errors (array of messages)
	if (Array.isArray(data?.message)) {
		data.message.forEach((msg) => {
			if (typeof msg === 'object' && msg?.message) {
				toast.error(msg.message);
			} else if (typeof msg === 'string') {
				toast.error(msg);
			}
		});
		return;
	}

	// Handle single error message
	if (data?.message) {
		toast.error(data.message);
		return;
	}

	// Handle generic error field
	if (data?.error) {
		toast.error(data.error);
		return;
	}

	toast.error('An error occurred while processing your request');
};

/** ***5) update single property listing image with Cloudinary cleanup */
export function useUpdatePropertyListingImageMutation() {
	const queryClient = useQueryClient();

	return useMutation(
		({ propertyId, cloudinaryPublicId, imageId, type, url }) => {
			const payload = {
				propertyId,
				updateData: {
					cloudinaryPublicId,
					imageId,
					type,
					url
				}
			};
			console.log('useUpdatePropertyListingImageMutation - Sending payload:', payload);
			console.log('useUpdatePropertyListingImageMutation - updateData:', payload.updateData);
			return updatePropertyListingImage(payload);
		},
		{
			onSuccess: (data, variables) => {
				console.log('Update Property Listing Image Data:', data);

				if (data?.data?.success) {
					toast.success(
						data?.data?.message || 'Image replaced successfully! Old image removed from Cloudinary.'
					);

					// Invalidate queries to refresh property data
					queryClient.invalidateQueries(['singlebookingproperty', variables.propertyId]);
					queryClient.invalidateQueries('__myshop_bookingsproperties');
				}
			},
			onError: (error) => {
				handleApiError(error);
				console.error('Image update error:', error);
			}
		}
	);
}

/** ***6) delete single property listing image with Cloudinary cleanup */
export function useDeletePropertyListingImageMutation() {
	const queryClient = useQueryClient();

	return useMutation(
		({ propertyId, cloudinaryPublicId, imageId }) => {
			return deletePropertyListingImage({
				propertyId,
				deleteData: {
					cloudinaryPublicId,
					imageId
				}
			});
		},
		{
			onSuccess: (data, variables) => {
				console.log('Delete Property Listing Image Data:', data);

				if (data?.data?.success) {
					toast.success(data?.data?.message || 'Image deleted successfully! Removed from Cloudinary.');

					// Invalidate queries to refresh property data
					queryClient.invalidateQueries(['singlebookingproperty', variables.propertyId]);
					queryClient.invalidateQueries('__myshop_bookingsproperties');
				}
			},
			onError: (error) => {
				handleApiError(error);
				console.error('Image deletion error:', error);
			}
		}
	);
}
