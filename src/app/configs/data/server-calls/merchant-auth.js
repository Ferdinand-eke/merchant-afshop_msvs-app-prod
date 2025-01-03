import { useMutation } from 'react-query';
import {
  adminSignIn,
  resetshopPasswordWithcode,
  shopForgotPasswordInit,
  // adminClientLogin, adminSignIn,
  //  logOutAdmin,
} from '../client/clientToApiRoutes';
import {
  remove_SHOP_FORGOTPASS_TOKEN,
  setAuthCredentials,
  setAuthTokens,
  setShopForgotPasswordPAYLOAD,
} from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useAdminLogin() {
  return useMutation(adminSignIn, {
    onSuccess: (data) => {
      if (data?.data?.data && data?.data?._nnip_shop_ASHP_ALOG) {
        console.log("Merchant logging in")
        setAuthCredentials(data?.data?.data);
        setAuthTokens(data?.data?._nnip_shop_ASHP_ALOG);
        toast.success('logged in successfully');

        window.location.replace('/admin');

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
      console.log('LoginError22', error);
      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}

export function useResetShopPass() {
  const navigate = useNavigate();
  return useMutation(resetshopPasswordWithcode, {
    onSuccess: (data) => {
      console.log("RESET_DATA", data)
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
      console.log('LoginError22__', error);
      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}


