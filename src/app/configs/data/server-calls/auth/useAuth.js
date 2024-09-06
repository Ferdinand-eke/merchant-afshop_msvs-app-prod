import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authShopResetPasword } from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';

/***
 * update user password by logged in merchant
 */
export function useShopSettingsResetPass() {
  const queryClient = useQueryClient();

  return useMutation(authShopResetPasword, {
    onSuccess: (data) => {
      if(data?.data && data?.data?.success){
        
        toast.success(data?.data?.message);
      }
    },

    onError: (error) => {
      toast.error(
        error?.response && error?.response?.data?.message
        ? error?.response?.data?.message
        : error?.message
      );
    },
  });
}
