import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getMyShopFoodMartBySlug,
  getShopFoodMarts,
  storeShopFoodMart,
  updateMyShopFoodMartById,
} from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

/****1) get all Specific user shop-food mart */
export default function useMyShopFoodMarts() {
  return useQuery(['__myshop_foodmarts'], getShopFoodMarts);
} //(Mcsvsn => Done)

/**2) get single food mart details */
export function useSingleShopFoodMart(slug) {
  if (!slug || slug === "new") {
    return {};
  }
  return useQuery(
    ['singlefoodmart', slug],
    () => getMyShopFoodMartBySlug(slug),
    {
      enabled: Boolean(slug),
    }
  );
}  //(Mcsvsn => Done)


/****3) create new food mart storeShopFoodMart */
export function useAddShopFoodMartMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newFoodMart) => {
      return storeShopFoodMart(newFoodMart);
    },
    {
      onSuccess: (data) => {
        if (data?.data?.success ) {
          toast.success(`${data?.data?.message ? data?.data?.message : 'Food mart created successfully!!'}`);
          queryClient.invalidateQueries(['__myshop_foodmarts']);
          queryClient.refetchQueries('__myshop_foodmarts', { force: true });
          navigate('/foodmarts/managed-foodmerchants')
        }
      },
    },
    {
      onError: (error, rollback) => {
        const {
          response: { data },
        } = error ?? {};
        Array.isArray(data?.message)
          ? data?.message?.map((m) => toast.error(m))
          : toast.error(data?.message);
        rollback();
      },
    }
  );
}  //(Mcsvsn => Done)

/***4) update existing property */
export function useFoodMartUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopFoodMartById, {
    onSuccess: (data) => {

      if (data?.data?.success) {
       toast.success(`${data?.data?.message ? data?.data?.message : 'Food mart updated successfully!!'}`);
        queryClient.invalidateQueries('__myshop_foodmarts');
      }
    },
    onError: (error) => {
      const {
          response: { data },
        } = error ?? {};
        Array.isArray(data?.message)
          ? data?.message?.map((m) => toast.error(m))
          : toast.error(data?.message);
        rollback();
    },
  });
}  //(Mcsvsn => Done)
