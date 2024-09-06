import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import config from './jwtAuthConfig';
import {  useSnackbar } from 'notistack';
import Cookie from 'js-cookie'
import { toast } from 'react-toastify';


const defaultAuthContext = {
	isAuthenticated: false,
	isLoading: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null,
	refreshToken: null,
	setIsLoading: () => {},
	authStatus: 'configuring'
};
export const JwtAuthContext = createContext(defaultAuthContext);

function JwtAuthProvider(props) {
/**
	 * Handle set authenticated boolean status starts
	========================================================= */
		// Set IsAuthenticated
		const setIsAthenticatedStorage = useCallback((accessToken) => {
			// if (accessToken) {
			// 	localStorage.setItem(config.isAuthenticatedStatus, true);
			
			// }
			if (isTokenValid(accessToken)) {
				localStorage.setItem(config.isAuthenticatedStatus, true);
			}else{
				localStorage.setItem(config.isAuthenticatedStatus, false);
			}
		}, []);

		// Reset IsAuthenticated
	const removeIsAthenticatedStorage = useCallback(() => {
		localStorage?.removeItem(config.isAuthenticatedStatus);
	}, []);

	const getIsAuthenticatedStatus = useCallback(() => {
		return localStorage.getItem(config.isAuthenticatedStatus);
	}, []);
	/**===================================================
	 * Handle set authenticated boolean status ends
	 */


	/**
	 * Handle set authenticated boolean status starts
	========================================================= */
		// Set IsAuthenticated
		const setAuthStatusStorage = useCallback((accessToken) => {
			// if (accessToken) {
			// 	localStorage.setItem(config.isAuthenticatedStatus, true); 'authenticated' : 'unauthenticated'
			// authStatus
			// }
			if (isTokenValid(accessToken)) {
				localStorage.setItem(config.authStatus, 'authenticated');
			}else{
				localStorage.setItem(config.authStatus, 'unauthenticated');
			}
		}, []);

		// Reset IsAuthenticated
	const resetAuthStatusStorage = useCallback(() => {
		// localStorage.removeItem(config.authStatus);
		localStorage.setItem(config.authStatus, 'configuring');
	}, []);

	const getIsAuthStatusStorage = useCallback(() => {
		return localStorage.getItem(config.authStatus);
	}, []);
	/**===================================================
	 * Handle set authenticated boolean status ends 
	 */

	/*****
	 * HANDLE USER DAT STORAGE
	 */
	const setUserCredentialsStorage = useCallback((userCredentials) => {
		console.log("UserCredentials TO-SET", userCredentials)
		// return
		// localStorage.setItem(config.adminCredentials, JSON.stringify({ userCredentials }))
		Cookie.set(config.adminCredentials, JSON.stringify({ userCredentials }))
		
		
	}, []);

	/**Get User credentials */
	const getUserCredentialsStorage  = useCallback(() => {
	//  let userCredentail

		  const {userCredentials} = Cookie.get('jwt_auth_credentials') ? JSON.parse(Cookie.get('jwt_auth_credentials')) : ''
		  if(userCredentials){
			// return userCredentail = userCredentials
			return  userCredentials
		  }

		//   return userCredentials
		// return JSON.parse();
	}, []);

	/***Remove user credentials */
		const removeUserCredentialsStorage = useCallback(() => {
			// localStorage.removeItem(config.userCredentials);
			Cookie.remove(config.userCredentials);
			Cookie.remove('jwt_auth_credentials');
		}, []);

	const [user, setUser] = useState(getUserCredentialsStorage());
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(getIsAuthenticatedStatus());
	const [authStatus, setAuthStatus] = useState(getIsAuthStatusStorage()); //'configuring'
	const { children } = props;


	// console.log("isAuthenticated-RENDERING", isAuthenticated)
	// console.log("AUTH-STATUS", authStatus)
	// console.log("AUTH-USER", user)
	// console.log("userFromStorage", getUserCredentialsStorage())
	// console.log("setting-user-from-storage", Cookie.get('jwt_auth_credentials'))




	/**
	 * Handle sign-in success
	 */
	const handleSignInSuccess = useCallback((userData, accessToken) => {
		setSession(accessToken);
		// setIsAuthenticated(true);
		setIsAuthenticated(setIsAthenticatedStorage(accessToken));
		
		// setUser(userData);
		setUserCredentialsStorage(userData)
		window.location.reload()
	}, []); //here is where token is stored
	/**
	 * Handle sign-up success
	 */
	const handleSignUpSuccess = useCallback((userData, accessToken) => {
		setSession(accessToken);
		// setIsAuthenticated(true);
		setIsAuthenticated(setIsAthenticatedStorage(accessToken));
		// setUser(userData);
		setUserCredentialsStorage(userData)
	}, []);
	/**
	 * Handle sign-in failure
	 */
	const handleSignInFailure = useCallback((error) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
		handleError(error);
	}, []);
	/**
	 * Handle sign-up failure
	 */
	const handleSignUpFailure = useCallback((error) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
		handleError(error);
	}, []);
	/**
	 * Handle error
	 */
	const handleError = useCallback((_error) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
	}, []);
	// Set session
	const setSession = useCallback((accessToken) => {
		if (accessToken) {
			localStorage.setItem(config.tokenStorageKey, accessToken);
			// axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
			axios.defaults.headers.common.accessToken = `${accessToken}`;
		}
	}, []);
	// Reset session
	const resetSession = useCallback(() => {
		localStorage.removeItem(config.tokenStorageKey);
		// delete axios.defaults.headers.common.Authorization;
		delete axios.defaults.headers.common.accessToken;
	}, []);
	// Get access token from local storage
	const getAccessToken = useCallback(() => {
		return localStorage.getItem(config.tokenStorageKey);
	}, []);

	// Check if the access token is valid
	const isTokenValid = useCallback((accessToken) => {
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
	}, []);
	// Check if the access token exist and is valid on mount
	useEffect(() => {
		const attemptAutoLogin = async () => {

			const accessToken = getAccessToken();


			if (isTokenValid(accessToken)) {
				try {
					setIsLoading(true);
					const response = await axios.get(config.getAuthAdminInBravortAdminUrl, {
						headers: { shoparccreed: `${accessToken}` }
					});
					console.log("User-FROM-IsTokeValid", response)
					const transFormedUser = {
						id:response?.data?.user?.id,
						name:response?.data?.user?.name,
						email:response?.data?.user?.email,
						// role:response?.data?.user?.role.toLowerCase(),
						role:'merchant',
						shopplan:response?.data?.user?.shopplan
						// name:response?.data?.user?.name,
						// name:response?.data?.user?.name,
					}
					// const userData = transFormedUser;
					// console.log("GETING-AUTHENTICATED-USER", userData)
					handleSignInSuccess(transFormedUser, accessToken);
					setIsLoading(false);
					return true;
				} catch (error) {
					const axiosError = error;
					toast.error(error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message)
					handleSignInFailure(axiosError);
					setIsLoading(false);
					return false;
				}
			} else {
				setIsLoading(false);
				resetSession();
				removeUserCredentialsStorage()
				// signOut()
				return false;
			}
		};

		if (!isAuthenticated || isAuthenticated === null)  {
			console.log("isAUTHENTICATED?", isAuthenticated)
			attemptAutoLogin().then((signedIn) => {
				console.log("signedInSTATUS", signedIn)
				setIsLoading(false);
				setAuthStatus(signedIn  ? 'authenticated' : 'unauthenticated');
			});
		}
	}, [
		isTokenValid,
		setSession,
		handleSignInSuccess,
		handleSignInFailure,
		handleError,
		getAccessToken,
		isAuthenticated
	]);
	const handleRequest = async (url, data,
		//  handleSuccess,
		 handleSignInSuccess,
		//  handleFailure,
		handleSignInFailure
		 ) => {
			// const { enqueueSnackbar, closeSnackbar } = useSnackbar();
		try {

			
			const response = await axios.post(url, data);

			console.log("Request-SUCESS User", response?.data?.data)
			console.log("Request-SUCESS TOKEN", response?.data?._nnip_shop_ASHP_ALOG)
			// return
			if(response?.data?.data && response?.data?._nnip_shop_ASHP_ALOG){
				const transFormedUser = {
					id:response?.data?.data?._id,
					name:response?.data?.data?.shopname,
					email:response?.data?.data?.shopemail,
					role:'merchant',
					shopplan:response?.data?.user?.shopplan
					// name:response?.data?.user?.name,
					// name:response?.data?.user?.name,
				}

				// const userData = transFormedUser;
				const accessToken = response?.data?._nnip_shop_ASHP_ALOG;
				handleSignInSuccess(transFormedUser, accessToken);
			return transFormedUser;
			}

			if(response.data.error){
				// enqueueSnackbar(`${response?.data?.error?.message}`)
				// window.alert(`${response?.data?.error?.message}`)
				toast.error(`${response?.data?.error?.message}`)
				return
			}

			// return
			

			// console.log("Request-SUCESS", response.data) accessToken
			// console.log("Request-SUCESS User", userData)
			// console.log("Request-SUCESS TOKEN", accessToken)
			//handleSignInSuccess
			// handleSuccess(userData, accessToken);
			
		} catch (error) {
			const axiosError = error;
			console.log("Request-Error", error)
			toast.error(error?.response && error?.response?.data?.message
                ? error?.response?.data?.message
                : error?.message)

			// return
			//handleSignInFailure
			// handleFailure(axiosError);
			handleSignInFailure(axiosError);
			return axiosError;
		}
	};
	// Refactor signIn function
	const signIn = (credentials) => {
		// console.log("IN-JWT-Provider", credentials)
		return handleRequest( config.signInBravortAdminUrl, credentials, handleSignInSuccess, handleSignInFailure);
	};
	// Refactor signUp function
	const signUp = useCallback((data) => {
		return handleRequest(config.signUpUrl, data, handleSignUpSuccess, handleSignUpFailure);
	}, []);
	/**
	 * Sign out
	 */
	const signOut = useCallback(() => {
		resetAuthStatusStorage()
		resetSession();
		removeIsAthenticatedStorage()
		// setIsAuthenticated(false);
		// setUser(null);
		removeUserCredentialsStorage()

		window.location.reload()
	}, []);
	/**
	 * Update user
	 */
	const updateUser = useCallback(async (userData) => {
		try {
			const response = await axios.put(config.updateUserUrl, userData);
			const updatedUserData = response?.data;
			setUser(updatedUserData);
			return null;
		} catch (error) {
			const axiosError = error;
			handleError(axiosError);
			return axiosError;
		}
	}, []);
	/**
	 * Refresh access token
	 */
	const refreshToken = async () => {
		setIsLoading(true);
		try {
			const response = await axios.post(config.tokenRefreshUrl);
			const accessToken = response?.headers?.['New-Access-Token'];

			if (accessToken) {
				setSession(accessToken);
				return accessToken;
			}

			return null;
		} catch (error) {
			const axiosError = error;
			handleError(axiosError);
			return axiosError;
		}
	};
	/**
	 * if a successful response contains a new Authorization header,
	 * updates the access token from it.
	 *
	 */
	useEffect(() => {
		if (config.updateTokenFromHeader && isAuthenticated) {
			axios.interceptors.response.use(
				(response) => {
					const newAccessToken = response?.headers?.['New-Access-Token'];

					if (newAccessToken) {
						setSession(newAccessToken);
					}

					return response;
				},
				(error) => {
					const axiosError = error;

					if (axiosError?.response?.status === 401) {
						signOut();
						// eslint-disable-next-line no-console
						console.warn('Unauthorized request. User was signed out.');
					}

					return Promise.reject(axiosError);
				}
			);
		}
	}, [isAuthenticated]);
	const storedAccessToken = getAccessToken();
	useEffect(() => {
		
		// if (user ) {
		// 	setAuthStatus('authenticated');
		// } else {
		// 	setAuthStatus('unauthenticated');
		// }


//user && 
		if (storedAccessToken) {
		// 	setAuthStatus('authenticated');
		// } else {
		// 	setAuthStatus('unauthenticated');
		setAuthStatusStorage(storedAccessToken)
		}
	}, [user, storedAccessToken]);
	const authContextValue = useMemo(
		() => ({
			user,
			isAuthenticated,
			authStatus,
			isLoading,
			signIn,
			signUp,
			signOut,
			updateUser,
			refreshToken,
			setIsLoading
		}),
		[user, isAuthenticated, isLoading, signIn, signUp, signOut, updateUser, refreshToken, setIsLoading]
	);
	return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
}


export default JwtAuthProvider;
