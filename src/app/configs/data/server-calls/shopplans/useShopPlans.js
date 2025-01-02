import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  getShopPlanById,
  getShopPlans,
} from '../../client/clientToApiRoutes';

export default function useShopplans() {
  return useQuery(['shopplans'], getShopPlans);
}

//get single shop plan
export function useSingleShopplans(shopplanId) {
  return useQuery(
    ['__shopplan', shopplanId],
    () => getShopPlanById(shopplanId),
    {
      enabled: Boolean(shopplanId),
    }
  );
}
