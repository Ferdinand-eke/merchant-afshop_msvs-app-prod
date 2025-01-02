import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  CreateShopPointOfSales,
  GetShopItemsInOrders,
  GetShopOrderItems,
  GetShopPointOfSalesItems,
  // getShopProducts,
  MyShopCashOutOrderByOrderIdShopId,
  MyShopCashOutOrderItemsByOrderItemsIdShopId,
  myShopItemsInOrdersByShopId,
  myShopOrderByShopId,
} from '../../client/clientToApiRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { message } from 'antd';

export default function useMyShopOrders() {
  return useQuery(['__myshop_orders'], GetShopOrderItems);
}
//useShopItemsInOrders useShopItemsInOrders
export function useFindShopOrder(orderId) {
  return useQuery(['__myshop_orders', orderId], () =>
    myShopOrderByShopId(orderId)
  );
}

export function useCashoutShopEarnings() {
  const queryClient = useQueryClient();
  const history = useNavigate();
  return useMutation(MyShopCashOutOrderByOrderIdShopId, {
    onSuccess: () => {
      toast.success('Order Sealed successfully!');
      queryClient.invalidateQueries('__myshop_orders');
      history('/control/orders');
    },
    onError: () => {
      toast.success('Oops!, an error occured');
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

export function useShopItemsInOrders() {
  return useQuery(['__myshop_items_orders'], GetShopItemsInOrders);
}


export function useFindShopItemsInOrders(itemId) {
  return useQuery(['__myshop_items_orders', itemId], () => {
    // console.log('ShopItemsBy-ORDER_ID', itemId)
    return myShopItemsInOrdersByShopId(itemId
      )
  }
  );
}



export function useCashoutShopOrderItemsEarnings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(MyShopCashOutOrderItemsByOrderItemsIdShopId, {
    onSuccess: (data) => {
      if(data?.data?.success){
        toast.success(data?.data?.message ? data?.data?.message : 'Order Sealed successfully!');
        queryClient.invalidateQueries('__myshop_items_orders');
        navigate('/shoporders-list/orders');
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

/******
 * MANAGE SHOP POINT OF SALE OPERATIONS CreateShopPointOfSales
 */

/***Get all shop invoice orders */
export function useGetMyShopInvoiceOrders() {
  return useQuery(['__myshop_invoiveorders'], GetShopPointOfSalesItems);
}

export function useShopCreateInvoiceOrder() {
  const queryClient = useQueryClient();
  // const { removeItems } = useEcomerce();
  // const navigate = useNavigate();
  return useMutation(CreateShopPointOfSales, {
    onSuccess: (data) => {
      if (data?.data) {
        console.log('Create-Invoice-Data HOOK', data);
        toast.success('Invoice created successfully!');
        // removeItems
        queryClient.invalidateQueries('__myshop_invoiveorders');
      }

      // navigate('/transaction-list-items');
    },
    onError: (error) => {
      console.log('Create-Invoice-Error', error);
      toast.success('Oops!, an error occured');
      // queryClient.invalidateQueries('__myshop_invoiveorders');
    },
  });
}