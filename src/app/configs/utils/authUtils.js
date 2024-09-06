import Cookie from 'js-cookie'
import { RESOURCE_AUTH_CRED, AUTH_RESOURCE_TOKEN, RESOURCE_ACTIVATE_CRED, FORGOT_PASS_CREDENTIALS } from '../constants'
// import { UerData } from '@/types/types'
// import { CLIENT_ENDPOINTS } from '../dataService/data/clientEndpoints' setShopForgotPasswordPAYLOAD

export function setAuthCredentials(user) {
    Cookie.set(RESOURCE_AUTH_CRED, JSON.stringify({ user }))
} //done

export function setAuthTokens(token) {
    Cookie.set(AUTH_RESOURCE_TOKEN, JSON.stringify({ token }))
}//done

export function setShopForgotPasswordPAYLOAD(userActivationToken) {
    Cookie.set(FORGOT_PASS_CREDENTIALS, JSON.stringify(userActivationToken))
}//done

/********COokies Stters up above */

export function setActivateUserPAYLOAD(userActivationToken) {
    // , role: any
    // , role
    Cookie.set(RESOURCE_ACTIVATE_CRED, JSON.stringify(userActivationToken))
}

export function setForgotPasswordPAYLOAD(userActivationToken) {
    // , role: any
    // , role
    Cookie.set(FORGOT_PASS_CREDENTIALS, JSON.stringify(userActivationToken))
}





/**
 * 
 * @param context GET COOKIES___PARSED__DATAS
 * @returns 
 */


export function getAuthAdminCredentials() {
    let authCred
    authCred = Cookie.get(RESOURCE_AUTH_CRED)

    if (authCred) {
        return JSON.parse(authCred)
    }
    return { user: null }
}

export function getAuthAdminTokens(){
    let authTokenCred
    authTokenCred = Cookie.get(AUTH_RESOURCE_TOKEN)

    
    if (authTokenCred) {
        return JSON.parse(authTokenCred)
    }
    return { token: null }
}


export function get_ACTIVATION_USER_TOKEN() {
    let activationTokenCred
    activationTokenCred = Cookie.get(RESOURCE_ACTIVATE_CRED)

    if (activationTokenCred) {
        return JSON.parse(activationTokenCred)
    }
    return { activationToken: null }
}

export function get_SHOP_FORGOTPASS_TOKEN() {
    let activationTokenCred
    activationTokenCred = Cookie.get(FORGOT_PASS_CREDENTIALS)

    if (activationTokenCred) {
        return JSON.parse(activationTokenCred)
    }
    return { activationToken: null }
}

//   export function parseSSRCookie(context: any) {
//     return SSRCookie.parse(context.req.headers.cookie ?? '');
//   }
// export function getRouterHandler() {
//     const router = useRouter()

//     return { router }
// }

/****REMOVE SPECIFIC COOKIES */
export function remove_SHOP_FORGOTPASS_TOKEN() {

    Cookie.remove('_FORGOT_SPLAWED_USER_DATA')
    Cookie.remove(FORGOT_PASS_CREDENTIALS);
}


export function logOutRoutHandler() {
    // const router = useRouter()


    Cookie.remove(RESOURCE_AUTH_CRED);
    Cookie.remove(AUTH_RESOURCE_TOKEN)

    Cookie.remove('_AUTH_SPLAW_SESSION_TOKS')
    Cookie.remove('_AUTH_AFSHOP_SPLAW_SESSION_CRED')
    // router.replace(CLIENT_ENDPOINTS.ADMIN_LOGIN);
    window.location.reload()

    // return { router }
}

export const resetSessionForShopUsers = () => {
    
  
    localStorage.removeItem('jwt_auth_credentials');
    // delete axios.defaults.headers.common.Authorization;
    // delete axios.defaults.headers.common.accessToken;
    localStorage.removeItem('jwt_is_authenticated_status');
    localStorage.removeItem('jwt_is_authStatus');
    // localStorage.removeItem('jwt_auth_credentials');
    window.location.reload()
};