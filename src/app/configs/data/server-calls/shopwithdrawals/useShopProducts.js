import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { storeShopProduct } from '../../store-redux/api/apiRoutes';
import {
  getMyShopProductById,
  getShopProducts,
  pullMyShopProductByIdFromExport,
  pushMyShopProductByIdToExport,
  // storeShopProduct,
  updateMyShopProductById,
} from '../../client/clientToApiRoutes';
import { message } from 'antd';

//get all Specific user shop-products
export default function useMyShopProducts() {
  return useQuery(['__myshop_products'], getShopProducts);
}

//get single prooduct details
export function useSingleShopProduct(productId) {
  return useQuery(
    ['singleproduct', productId],
    () => getMyShopProductById(productId),
    {
      enabled: Boolean(productId),
      // staleTime: 5000,
    }
  );
}

//update existing product
export function useProductUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopProductById, {
    onSuccess: (data) => {
      console.log('Updated Producr clientController', data);

      if (data) {
        message.success('product updated successfully!!');

        queryClient.invalidateQueries('__myshop_products');
        // queryClient.refetchQueries('__myshop_products', { force: true });
      }

      // navigate('/transaction-list');
    },
    onError: (error) => {
      message.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

//update existing product: Pushing it for export
export function usePushProductForExportMutation() {
  const queryClient = useQueryClient();

  return useMutation(pushMyShopProductByIdToExport, {
    onSuccess: (data) => {
      console.log('push Product clientController', data);

      if (data) {
        message.success('product pushed to export successfully!!');

        queryClient.invalidateQueries('__myshop_products');
        queryClient.invalidateQueries([
          '__myshop_products',
          '__myshop_details',
        ]);
      }
    },
    onError: (error) => {
      console.log('PushingExportError', error);
      message.error('Error occured while pushing product!!');
      // message.error(
      //   error.response && error.response.data.message
      //     ? error.response.data.message
      //     : error.message
      // );
    },
  });
}

//update existing product: Pulling it from export
export function usePullProductFromExportMutation() {
  const queryClient = useQueryClient();

  return useMutation(pullMyShopProductByIdFromExport, {
    onSuccess: (data) => {
      console.log('Pull Product clientController', data);

      if (data) {
        message.success('product pulled successfully!!');

        // queryClient.invalidateQueries('__myshop_products');
        queryClient.invalidateQueries([
          '__myshop_products',
          '__myshop_details',
        ]);
      }
    },
    onError: (error) => {
      message.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}
