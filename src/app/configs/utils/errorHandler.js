import { toast } from 'react-toastify';

/**
 * Handles API errors from NestJS backend and displays appropriate toast messages
 *
 * NestJS error response structures:
 * 1. Validation errors (400): { statusCode: 400, message: ["error1", "error2"], error: "Bad Request" }
 * 2. Single error message: { statusCode: 4xx/5xx, message: "Error message", error: "Error Type" }
 * 3. Custom error: { message: "Custom error message" }
 *
 * @param {Object} error - The error object from axios/fetch
 * @param {string} fallbackMessage - Optional custom fallback message
 */
export const handleApiError = (error, fallbackMessage = 'An error occurred. Please try again.') => {
	const errorData = error?.response?.data;

	if (errorData) {
		// Handle NestJS validation errors (array of messages)
		if (Array.isArray(errorData.message)) {
			errorData.message.forEach((msg) => toast.error(msg));
			return;
		}

		// Handle single error message
		if (errorData.message) {
			toast.error(errorData.message);
			return;
		}

		// Fallback to error property
		if (errorData.error) {
			toast.error(errorData.error);
			return;
		}

		// If errorData exists but has no message or error property
		toast.error(fallbackMessage);
		return;
	}

	// Handle network errors or errors without response data
	if (error?.message) {
		toast.error(error.message);
		return;
	}

	// Final fallback
	toast.error(fallbackMessage);
};

/**
 * Creates an onError handler for React Query mutations
 * Usage: onError: createErrorHandler('Failed to update product')
 *
 * @param {string} fallbackMessage - Custom fallback message for this specific operation
 * @returns {Function} Error handler function
 */
export const createErrorHandler = (fallbackMessage) => {
	return (error) => handleApiError(error, fallbackMessage);
};
