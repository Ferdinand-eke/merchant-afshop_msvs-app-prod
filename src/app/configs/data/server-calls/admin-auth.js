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
// import { useNavigate } from 'react-router-dom';

export function useAdminLogin() {
  // const history = useNavigate();
  return useMutation(adminSignIn, {
    onSuccess: (data) => {
      // console.log('LoginError11', data);
      console.log('LoginError22', data?.data);
      // console.log('LoginError33', data?.data?.data);
      // console.log('LoginError33', data?.data?._nnip_shop_ASHP_ALOG);
      if (data?.data?.data && data?.data?._nnip_shop_ASHP_ALOG) {
        // console.log("userFromAuthentication", data?.data?.user)
        // console.log("tokenFromAuthentication", data?.data?.accessToken)
        setAuthCredentials(data?.data?.data);
        setAuthTokens(data?.data?._nnip_shop_ASHP_ALOG);
        toast.success('logged in successfully');

        // history('/admin');
        window.location.replace('/admin');

        return;
      } else if (data) {
        console.log('LoginError22_', data.data);

        //toast.error(data?.data?.message);
        // console.log(Array.isArray(data?.data?.message) ? data?.data?.message?.map((m) =>toast.error(m.message)) :toast.error(data?.data?.message))
        Array.isArray(data?.data?.message) ? data?.data?.message?.map((m) =>toast.error(m.message)) :toast.error(data?.data?.message);
        return;
      } else {
        toast.info('something unexpected happened');
        return;
      }
    },
    onError: (error) => {
      console.log('LoginError22Block', error);
      //   console.log("LoginError2211", JSON.stringify(error?.response) )
      //   console.log("LoginError2212", error)
      //  toast.error(error)
      // const {
      //     response: { data  },
      //   }: any = error ?? {};

      //   data?.message?.map((m : []) =>toast.error(m))
      const {
        response: { data },
      } = error ?? {};
      // data?.message?.map((m: []) =>toast.error(m))
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}

export function useShopForgotPass() {
  const navigate = useNavigate();
  return useMutation(shopForgotPasswordInit, {
    onSuccess: (data) => {
      console.log('LoginError11', data);
      console.log('LoginError22', data?.data);
      console.log('LoginError33', data?.data?.data);
      if (data?.data?.forgotpass_activation_token && data?.data?.message) {
        // ?.data
        // setShopForgotPasswordPAYLOAD
        setShopForgotPasswordPAYLOAD(data?.data?.forgotpass_activation_token);
        // toast.success('logged in successfully')
        toast.success(data?.data?.message);

        // history('/resetShopPassword');
        navigate('/reset-password');
        // window.location.replace('/rese')infomessage

        return;
      } else if (data?.data?.infomessage) {
        console.log('LoginError22', data);

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
      // data?.message?.map((m: []) =>toast.error(m))
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}

export function useResetShopPass() {
  const history = useNavigate();
  return useMutation(resetshopPasswordWithcode, {
    onSuccess: (data) => {
      console.log('RESET', data);
    //   console.log('LoginError22', data?.data?.infomessage);
    //   console.log('LoginError33', data?.data?.data);
      if (data?.data?.message & data?.data?.user) {
        console.log('SuccessDATaA_____', data);
        remove_SHOP_FORGOTPASS_TOKEN()
        toast.success(data?.data?.message);

        // history('/resetShopPassword');
        // window.location.replace('/rese')infomessage

        return;
      }
      // else if (data?.data?.message) {
      //   Array.isArray(data?.data?.message) ? data?.data?.message?.map((m) =>toast.error(m.message)) :toast.error(data?.data?.message);

        
      //   // 
      //   //toast.error(data?.data?.infomessage);
      //   return;
      // }  
      else if (data?.data?.infomessage) {
        console.log('LoginError22', data?.data?.message);

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
      // data?.message?.map((m: []) =>toast.error(m))
      Array.isArray(data?.message) ? data?.message?.map((m) =>toast.error(m)) :toast.error(data?.message);
    },
  });
}

//   export function useUserLogin() {
//     const router = useRouter()
//     return useMutation(userSignIn, {
//         onSuccess: (data) => {
//             if (data?.data?.accessToken && data?.data?.user) {
//                 setAuthCredentials(data?.data?.user)
//                 setAuthTokens(data?.data?.accessToken)
//                 toast.success('logged in successfully')

//                 router.push(`${CLIENT_ENDPOINTS.LACHARIZ_LISTINGS}`)
//                 return
//             } else if (data?.data?.error) {
//                toast.error(data?.data?.error?.message)
//                 return
//             } else {
//                 toast.info('something unexpected happened')
//                 return
//             }
//         },
//         onError: (error) => {
//             const {
//                 response: { data },
//             }: any = error ?? {}
//             data?.message?.map((m: []) =>toast.error(m))
//         },
//     })
// }

//   export const useLogoutMutation = () => {
//     const router = useRouter();

//     return useMutation(logOutAdmin, {
//       onSuccess: () => {
//         Cookies.remove(AUTH_CRED);
//         router.replace(CLIENT_ENDPOINTS.ADMIN_LOGIN);
//         // toast.success(t('common:successfully-logout'), {
//         //   messageId: 'logoutSuccess',
//         // });
//       },
//     });
//   };
