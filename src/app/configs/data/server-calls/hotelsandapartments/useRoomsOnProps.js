import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	createRoomOnProperty,
	updateRoomOnProperty,
	getBookingsPropertyRoomsById,
	getSingleRoomOfProperty
} from '../../client/clientToApiRoutes';

/**
 * Utility function to format and display error messages
 * Handles both NestJS and Express error response formats
 *
 * NestJS format: { message: string | string[], error: string, statusCode: number }
 * Express format: { message: string, error?: string }
 *
 * @param {Error} error - The error object from the API call
 */
const handleApiError = (error) => {
	console.error('API Error:', error);

	// Check if error response exists
	if (!error?.response?.data) {
		toast.error(error?.message || 'An unexpected error occurred');
		return;
	}

	const { data } = error.response;

	// Handle NestJS validation errors (array of objects with message property)
	if (Array.isArray(data?.message)) {
		data.message.forEach((msg) => {
			// NestJS validation error format: { message: string, property?: string }
			if (typeof msg === 'object' && msg?.message) {
				toast.error(msg.message);
			}
			// Simple string array
			else if (typeof msg === 'string') {
				toast.error(msg);
			}
		});
		return;
	}

	// Handle single error message (both NestJS and Express)
	if (data?.message) {
		toast.error(data.message);
		return;
	}

	// Handle generic error field
	if (data?.error) {
		toast.error(data.error);
		return;
	}

	// Fallback error message
	toast.error('An error occurred while processing your request');
};

/** ***
 *
 * MANAGE ROOMS ATTACHED TO PROPERTIES
 *
 */

/** **1) get rooms from single booking property by Property-ID */

export function useGetRoomsFromBookingProperty(slug) {
	//   console.log("Fetching rooms for booking property:", slug)

	return useQuery({
		queryKey: ['roomsOnBookingProperty', slug],
		queryFn: () => getBookingsPropertyRoomsById(slug),
		enabled: Boolean(slug) // only run if slug is truthy
	});
} // (Mcsvs => Done)

export function useGetSingleRoomOfProperty(roomId) {
	console.log('Fetching single room :', roomId);

	return useQuery({
		queryKey: ['_roomsOnBookingProperty', roomId],
		queryFn: () => getSingleRoomOfProperty(roomId),
		enabled: Boolean(roomId) // only run if slug is truthy
	});
}

/** **2) create new room on  property */
export function useAddRoomPropertyMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newRoomProperty) => {
			return createRoomOnProperty(newRoomProperty);
		},
		{
			onSuccess: (data) => {
				console.log('createRoomOnProperty_DATA', data);

				if (data?.data?.success) {
					toast.success('Room added successfully!');
					queryClient.invalidateQueries(['roomsOnBookingProperty']);
					queryClient.refetchQueries('roomsOnBookingProperty', {
						force: true
					});
					//   navigate("/bookings/managed-listings");
				}
			},
			onError: (error) => {
				handleApiError(error);
			}
		}
	);
} // Mcsvs

/** ***3) update existing room on bookings-property */
export function useRoomOnPropertyUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateRoomOnProperty, {
		onSuccess: (data) => {
			console.log('Update Room On Property Data:', data);

			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Room updated successfully!'}`);
				queryClient.invalidateQueries('roomsOnBookingProperty');
			}
		},
		onError: (error) => {
			handleApiError(error);
		}
	});
}
