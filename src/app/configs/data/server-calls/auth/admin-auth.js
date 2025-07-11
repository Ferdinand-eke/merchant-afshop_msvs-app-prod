import { useMutation } from "react-query";
import config from "../../../../auth/services/jwt/jwtAuthConfig";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";

import { toast } from "react-toastify";
import { merchantSignIn } from "../../client/clientToApiRoutes";
// import { adminSigin } from "../apiRoutes";

export function useShopAdminLogin() {
  
  // const navigate = useNavigate();
  return useMutation(merchantSignIn, {
    onSuccess: (data) => {
      console.log("userFromAuthentication", data?.data?.user);
      // console.log("tokenFromAuthentication", data?.data?.merchantAccessToken);
      console.log("tokenFromAuthentication", data?.data?.merchantAccessToken);

      //  return
      if (data?.data?.user && data?.data?.merchantAccessToken) {
        /**============================================================================== */

        const transFormedUser = {
          id: data?.data?.user?._id,
          name: data?.data?.user?.shopname,
          email: data?.data?.user?.shopemail,
          role: "merchant",

          isAdmin: data?.data?.user?.isAdmin,
          avatar: data?.data?.user?.avatar,
        };
 
        if (data?.data?.merchantAccessToken) {
          localStorage.setItem(config.tokenStorageKey, data?.data?.merchantAccessToken);
          // axios.defaults.headers.common.Authorization = `Bearer ${_nnip_shop_ASHP_ALOG}`;
          axios.defaults.headers.common.accessToken = `${data?.data?.merchantAccessToken}`;
        }

        if (isTokenValid(data?.data?.merchantAccessToken)) {
          localStorage.setItem(config.isAuthenticatedStatus, true);
        } else {
          localStorage.setItem(config.isAuthenticatedStatus, false);
        }

        if(transFormedUser){
          setUserCredentialsStorage(transFormedUser);
          window.location.reload();
        }

       

        // return;
      } else if (data.data?.error) {
        console.log("LoginError22_", data.data);

        Array.isArray(data?.data?.message)
          ? data?.data?.message?.map((m) => toast.error(m.message))
          : toast.error(data?.data?.message);
        return;
      } else {
        toast.info("something unexpected happened");
        return;
      }
    },
    onError: (error) => {
      console.log("LoginError22Block", error);

      const {
        response: { data },
      } = error ?? {};
      Array.isArray(data?.message)
        ? data?.message?.map((m) => toast.error(m))
        : toast.error(data?.message);
    },
  });
}

const isTokenValid = (accessToken) => {
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      // console.log("DECODED Token-DATA", decoded)
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  return false;
};

const setUserCredentialsStorage = (userCredentials) => {
  console.log("UserCredentials TO-SET", userCredentials);
  // localStorage.setItem(config.adminCredentials, JSON.stringify({ userCredentials }))
  Cookie.set(config.adminCredentials, JSON.stringify({ userCredentials }));
};
