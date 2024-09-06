import Cookie from 'js-cookie';
import homesServerConfig from '../configServerRoutes/homesServerConfig';
import jwtAuthConfig from 'src/app/auth/services/jwt/jwtAuthConfig';

export const setUserForgotPassCreedStorage = (userForgotPassCredentialsTk) => {

    localStorage.setItem(homesServerConfig.studentForgotPassTk, userForgotPassCredentialsTk)
    
    
};

export const getForgotPassToken = () => {
    return localStorage.getItem(homesServerConfig.studentForgotPassTk);
};

export const resetForgotPassToken = () => {
    return localStorage.removeItem(homesServerConfig.studentForgotPassTk);
};



export const getAdminAccessToken = () => {
    //jwt_access_token
    // return localStorage.getItem(jwtAuthConfig.tokenStorageKey);
    return localStorage.getItem('jwt_access_token');
};


/****LOGGING OUT AN ADMIN USER */
export const logOutAdminUser = () => {
    return localStorage.removeItem(homesServerConfig.studentForgotPassTk);
};


/****
 * UNBOARDING AND HANDLING USER STORAGES createNewUserTk
 */

export function setCreateNewUserAccount(userActivationToken) {
    
    localStorage.setItem(homesServerConfig.createNewUserTk, userActivationToken)

    // Cookie.set(homesServerConfig.createNewUserTk, JSON.stringify(userActivationToken))
}

export const getNewUserAccountToken = () => {
    return localStorage.getItem(homesServerConfig.createNewUserTk);


    // return Cookie.get(homesServerConfig.createNewUserTk);

    
};