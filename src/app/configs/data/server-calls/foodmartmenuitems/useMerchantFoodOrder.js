import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getMerchantFoodOrdersApi, merchantDeliverFoodOrdersApi, merchantGetFoodOrderByIdApi, merchantGetFoodOrderItemsInFoodOrderById, merchantPackFoodOrders, merchantShipFoodOrders,  } from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

/*** 1) get food-mart orders */   
export default function useMerchantFoodOrders() {
  return useQuery(['__merchant_foodorders'], getMerchantFoodOrdersApi);
}

/*** 2) get a single food-order */
export function useMerchantFindSingleFoodOrder(orderId) {
  return useQuery(['__merchant_foodorders', orderId], () =>
  merchantGetFoodOrderByIdApi(orderId)
  );
}


/*** 3) merchant mark food-orderas packed */
export function useMerchantPackFoodOrder() {
  const queryClient = useQueryClient();
  return useMutation(merchantPackFoodOrders, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success('Order Packed successfully!');
        queryClient.invalidateQueries('__merchant_foodorders');
      }else{
        toast.info('Something alien occured!');
      }
  
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}


/*** 4) merchant mark food-orderas as shipped */
export function useMerchantShipFoodOrder() {
  const queryClient = useQueryClient();
  return useMutation(merchantShipFoodOrders, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success('Order Shipped successfully!');
        queryClient.invalidateQueries('__merchant_foodorders');
      }else{
        toast.info('Something alien occured!');
      }
    
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );    },
  });
}


/*** 5) Merchant deliver food-order */
export function useMerchantDeliverFoodOrder() {
  const queryClient = useQueryClient();
  return useMutation(merchantDeliverFoodOrdersApi, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success('Order Delivered successfully!');
        queryClient.invalidateQueries('__merchant_foodorders');
      }else{
        toast.info('Something alien occured!');
      }
    
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}


/******
 * ==================================================
 * HANDLING OF FOOD ORDER ITEMS  
 * =====================================================
 */

/**** 1) Get food-order items */
export function useGetMerchantFoodOrderItems(orderId) {
  return useQuery(['foodorders_items', orderId], () =>
  merchantGetFoodOrderItemsInFoodOrderById(orderId)
  );
}
