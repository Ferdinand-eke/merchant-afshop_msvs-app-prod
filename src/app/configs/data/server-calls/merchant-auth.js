import { useMutation } from 'react-query';
import {
  merchantSignIn,
  resetshopPasswordWithcode,
  shopForgotPasswordInit,
} from '../client/clientToApiRoutes';
import {
  remove_SHOP_FORGOTPASS_TOKEN,
  setAuthCredentials,
  setAuthTokens,
  setShopForgotPasswordPAYLOAD,
} from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


/***1) Login for merchants account */
export function useAdminLogin() {
  return useMutation(merchantSignIn, {
    onSuccess: (data) => {
      if (data?.data?.data && data?.data?._nnip_shop_ASHP_ALOG) {
        setAuthCredentials(data?.data?.data);
        setAuthTokens(data?.data?._nnip_shop_ASHP_ALOG);
        toast.success('logged in successfully');

        window.location.replace('/shop-dashboard');

        return;
      } else if (data) {
        Array.isArray(data?.data?.message) ? data?.data?.message?.map((m) =>toast.error(m.message)) :toast.error(data?.data?.message);
        return;
      } else {
        toast.info('something unexpected happened');
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}

/***2) Forgot password for merchants account */
export function useShopForgotPass() {
  const navigate = useNavigate();
  return useMutation(shopForgotPasswordInit, {
    onSuccess: (data) => {
      if (data?.data?.forgotpass_activation_token && data?.data?.message) {
        setShopForgotPasswordPAYLOAD(data?.data?.forgotpass_activation_token);
        toast.success(data?.data?.message);

        navigate('/reset-password');
        return;
      } else if (data?.data?.infomessage) {

       toast.error(data?.data?.infomessage);
        return;
      } else {
        toast.info('something unexpected happened');
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}

/***3) Reset password for merchants account */
export function useResetShopPass() {
  const navigate = useNavigate();
  return useMutation(resetshopPasswordWithcode, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        remove_SHOP_FORGOTPASS_TOKEN()
        toast.success(data?.data?.message);

        navigate('/sign-in');

        return;
      }else if (data?.data?.infomessage) {
       toast.error(data?.data?.infomessage);
        return;
      } else {
        toast.info('something unexpected happened');
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}


