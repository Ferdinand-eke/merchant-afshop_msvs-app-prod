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
}

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
}


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
        if (data?.data?.success && data?.data?.newMFoodMart) {
          toast.success('food mart added successfully!');
          queryClient.invalidateQueries(['__myshop_foodmarts']);
          queryClient.refetchQueries('__myshop_foodmarts', { force: true });
          navigate('/foodmarts/managed-foodmerchants')
        }
      },
    },
    {
      onError: (error, rollback) => {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        console.log('MutationError', error.response.data);
        console.log('MutationError', error.data);
        rollback();
      },
    }
  );
}

/***4) update existing property */
export function useFoodMartUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopFoodMartById, {
    onSuccess: (data) => {

      if (data?.data?.success) {
       toast.success('food mart updated successfully!!');
        queryClient.invalidateQueries('__myshop_foodmarts');
      }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}
