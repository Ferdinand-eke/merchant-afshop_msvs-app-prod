import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  createMyShopBranch,
  getJustMyShopDetails,
  getJustMyShopDetailsAndPlan,
  getMinimizedJustMyShopDetails,
  getMyOtherShopsList,
  getMyShopAccountApiDetails,
  getMyShopDetails,
  updateMyShopBranch,
  updateMyShopDetails,
} from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';

export default function useGetMyShopDetails() {
  return useQuery(['__myshop_details'], getMyShopDetails);
}

/*****Get just my shop details */
export function useGetMinimizedJustMyShopDetailsQuery() {
  return useQuery(['__justmyshop'], getMinimizedJustMyShopDetails);
}

export function useGetJustMyShopDetails() {
  return useQuery(['__justmyshop'], getJustMyShopDetails);
}

//useGetMyShopDetails
export function useGetMyOtherShopLists() {
  return useQuery(['__myshop_other_details'], getMyOtherShopsList);
}

//Shop details and shop plan
export function useGetMyShopAndPlan() {
  return useQuery(['__myshop_and_accountplan'], getJustMyShopDetailsAndPlan);
}



/****
 * 
 * FINANCE MANAGEMENT STARTS HERE
 */
/***Get Shop Wallet Account Balance */
export function useGetShopAccountBalance() {
  return useQuery(['__myshop_account_balance'], getMyShopAccountApiDetails);
}


//update existing shop details
export function useShopUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopDetails, {
    onSuccess: (data) => {
      // console.log('Updated shop clientController', data);

      if (data?.data?.success) {
        toast.success('shop updated successfully!!');

      /**Set/update users client data to have newly updated user details */

        queryClient.invalidateQueries('__myshop_details');
      }
    },
    onError: (error) => {
      toast.error(error.response && error.response.data.message
        ? error.response.data.message
        : error.message)

    },
  });
}

/**Create a new Shop Vendor */
export function useCreateVendorShopBranch() {
  const queryClient = useQueryClient();

  return useMutation(createMyShopBranch, {
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message);
        queryClient.invalidateQueries('shops');
      }
    },
    onError: (error, data) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

/***Update Vendor Branch Details here */
export function useUpdateVendorShopBranch() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopBranch, {
    onSuccess: (data) => {
      if (data) {
        toast.success('Shop data updated successfully');
        // queryClient.invalidateQueries('__myshop_details');

        queryClient.invalidateQueries('shops');
        // queryClient.refetchQueries('__myshop_products', { force: true });
      }

      // navigate('/transaction-list'); error.message
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}
