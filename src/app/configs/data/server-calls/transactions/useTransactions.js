import { useQuery } from 'react-query';
import { getMerchantTransactions, getMerchantTransactionSummary } from '../../client/clientToApiRoutes';

/**
 * Hook to fetch merchant transactions with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.transactionType - Filter by transaction type
 * @param {string} params.status - Filter by status
 * @param {string} params.startDate - Filter by start date
 * @param {string} params.endDate - Filter by end date
 */
export function useGetMerchantTransactions(params = {}) {
	return useQuery(['merchant_transactions', params], () => getMerchantTransactions(params), {
		keepPreviousData: true, // Keep previous data while fetching new page
		staleTime: 60000, // 1 minute
		refetchOnWindowFocus: false
	});
}

/**
 * Hook to fetch merchant transaction summary/analytics
 * Returns aggregated data for loan eligibility assessment
 */
export function useGetMerchantTransactionSummary() {
	return useQuery(['merchant_transaction_summary'], getMerchantTransactionSummary, {
		staleTime: 300000, // 5 minutes - summary data doesn't change frequently
		refetchOnWindowFocus: true
	});
}
