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
	deletePropertyListingImage,
	deleteMerchantBookingListing,
	getBookingsAmenities
} from '../../client/clientToApiRoutes';
import { handleApiError } from '../../../utils/errorHandler';

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
				handleApiError(error, 'Failed to create property. Please try again.');

				if (rollback) rollback();
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
			handleApiError(error, 'Failed to update property. Please try again.');
		}
	});
}

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

/** ***7) delete entire booking property listing */
export function useDeleteBookingPropertyMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(
		(propertyId) => {
			return deleteMerchantBookingListing(propertyId);
		},
		{
			onSuccess: (data) => {
				console.log('Delete Booking Property Data:', data);

				if (data?.data?.success) {
					toast.success(data?.data?.message || 'Property deleted successfully!');

					// Invalidate queries to refresh property list
					queryClient.invalidateQueries('__myshop_bookingsproperties');

					// Navigate back to listings page
					navigate('/bookings/managed-listings');
				}
			},
			onError: (error) => {
				handleApiError(error);
				console.error('Property deletion error:', error);
			}
		}
	);
}

/****   MANAGEMENT OF AMENITIES *******************************
   *  START
   * =============================================================================================
   *===============================================================================================
   */
/** *1) get all Specific user shop-Bookings property   */
export  function useGetAmenities(params = {}) {
	return useQuery(['__bookingsproperties_amenities', params], () => getBookingsAmenities(), {
		keepPreviousData: true // Keeps previous data while fetching new data for smoother transitions
	});
}