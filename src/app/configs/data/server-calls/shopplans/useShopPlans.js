import { useQuery } from 'react-query';
import { getShopPlanById, getShopPlans } from '../../client/clientToApiRoutes';

export default function useShopplans() {
	return useQuery(['shopplans'], getShopPlans);
}  //(Mcsvs => Done)

// get single shop plan
export function useSingleShopplans(shopplanId) {
	if (!shopplanId) {
		return ' ';
	}

	return useQuery(['__shopplan', shopplanId], () => getShopPlanById(shopplanId), {
		enabled: Boolean(shopplanId)
	});
}
