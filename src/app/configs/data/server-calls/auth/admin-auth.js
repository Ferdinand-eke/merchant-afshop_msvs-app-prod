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
      console.log("userFromAuthentication", data?.data?.data);
      console.log("tokenFromAuthentication", data?.data?._nnip_shop_ASHP_ALOG);

      //  return
      if (data?.data?.data && data?.data?._nnip_shop_ASHP_ALOG) {
        /**============================================================================== */

        const transFormedUser = {
          id: data?.data?.data?._id,
          name: data?.data?.data?.shopname,
          email: data?.data?.data?.shopemail,
          role: "merchant",

          isAdmin: data?.data?.data?.isAdmin,
          avatar: data?.data?.data?.avatar,
        };

        // setSession(_nnip_shop_ASHP_ALOG);   
        if (data?.data?._nnip_shop_ASHP_ALOG) {
          localStorage.setItem(config.tokenStorageKey, data?.data?._nnip_shop_ASHP_ALOG);
          // axios.defaults.headers.common.Authorization = `Bearer ${_nnip_shop_ASHP_ALOG}`;
          axios.defaults.headers.common.accessToken = `${data?.data?._nnip_shop_ASHP_ALOG}`;
        }

        // setIsAuthenticated(setIsAthenticatedStorage(_nnip_shop_ASHP_ALOG));
        if (isTokenValid(data?.data?._nnip_shop_ASHP_ALOG)) {
          localStorage.setItem(config.isAuthenticatedStatus, true);
        } else {
          localStorage.setItem(config.isAuthenticatedStatus, false);
        }

        if(transFormedUser){
          setUserCredentialsStorage(transFormedUser);
          window.location.reload();
        }

       

        // return;
      } else if (data) {
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
