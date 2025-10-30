import { useQuery } from 'react-query';
import { getInspectionSchedules } from '../../client/propertyProfileApiRoutes';

/**
 * Get all inspection schedules for the merchant
 * @returns {Object} React Query result with schedules data
 */
export default function useInspectionSchedules() {
	return useQuery(['inspection_schedules'], getInspectionSchedules, {
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: false
	});
}
