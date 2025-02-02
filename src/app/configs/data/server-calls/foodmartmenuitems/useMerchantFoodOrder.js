import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getMerchantFoodOrdersApi, merchantDeliverFoodOrdersApi, merchantGetFoodOrderByIdApi, merchantGetFoodOrderItemsInFoodOrderById, merchantPackFoodOrders, merchantShipFoodOrders,  } from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

/***get all Specific user shop-estate property */   
export default function useMerchantFoodOrders() {
  return useQuery(['__merchant_foodorders'], getMerchantFoodOrdersApi);
}

/***get a single food-order */
export function useMerchantFindSingleFoodOrder(orderId) {
  return useQuery(['__merchant_foodorders', orderId], () =>
  merchantGetFoodOrderByIdApi(orderId)
  );
}


/***merchant mark food-orderas packed */
export function useMerchantPackFoodOrder() {
  const queryClient = useQueryClient();
  return useMutation(merchantPackFoodOrders, {
    onSuccess: (data) => {
      console.log("PACK_ORDER", data)
      if(data?.data?.success){
        toast.success('Order Packed successfully!');
        queryClient.invalidateQueries('__merchant_foodorders');
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


/***merchant mark food-orderas as shipped */
export function useMerchantShipFoodOrder() {
  const queryClient = useQueryClient();
  return useMutation(merchantShipFoodOrders, {
    onSuccess: (data) => {
      console.log("SHIP_ORDER", data)
      if(data?.data?.success){
        toast.success('Order Shipped successfully!');
        queryClient.invalidateQueries('__merchant_foodorders');
      }
    
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured');

      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );    },
  });
}

/***merchant Handle for order arrival */
// export function useMerchantHandleFoodOrderArrival() {
//   const queryClient = useQueryClient();
//   return useMutation(adminConfirmOrderArrival, {
//     onSuccess: () => {
//       toast.success('Order Arrived Warehouse successfully!');
//       queryClient.invalidateQueries('__merchant_foodorders');
//     },
//     onError: (err) => {
//       // toast.success('Oops!, an error occured');
//       toast.error(
//         err.response && err.response.data.message
//           ? err.response.data.message
//           : err.message
//       );
//     },
//   });
// }

/***Merchant deliver food-order */
export function useMerchantDeliverFoodOrder() {
  const queryClient = useQueryClient();
  return useMutation(merchantDeliverFoodOrdersApi, {
    onSuccess: (data) => {
      console.log("DELIVER_ORDER", data)
      if(data?.data?.success){
        toast.success('Order Delivered successfully!');
        queryClient.invalidateQueries('__merchant_foodorders');
      }
    
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured while processing request');
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
 * HANDLING OF ORDER ITEMS  
 * =====================================================
 */

export function useGetMerchantFoodOrderItems(orderId) {
  return useQuery(['foodorders_items', orderId], () =>
  merchantGetFoodOrderItemsInFoodOrderById(orderId)
  );
}
