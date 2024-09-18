// const baseUrl = 'http://localhost:8000'

const baseUrl = 'https://coral-app-n8ox9.ondigitalocean.app' //Africanshops




const jwtAuthConfig = {
	tokenStorageKey: 'jwt_access_token',
	signInUrl: 'mock-api/auth/sign-in',
	signUpUrl: 'mock-api/auth/sign-up',
	tokenRefreshUrl: 'mock-api/auth/refresh',
	getUserUrl: 'mock-api/auth/user',
	updateUserUrl: 'mock-api/auth/user',
	updateTokenFromHeader: true,


	/******Bravort Admin Dashboard Controls API */
	// signInBravortAdminUrl: `${baseUrl}/admin/login`,

	// signInBravortAdminUrl: `${adminSignIn()}`,
	signInBravortAdminUrl: `${baseUrl}/api/shop/login`,    



	// getAuthAdminInBravortAdminUrl: `${baseUrl}/admin/get-auth-admin`,

	getAuthAdminInBravortAdminUrl: `${baseUrl}/shop/get-auth-shop`,
	isAuthenticatedStatus: 'jwt_is_authenticated_status',
	authStatus: 'jwt_is_authStatus',
	adminCredentials: 'jwt_auth_credentials',

};
export default jwtAuthConfig;


