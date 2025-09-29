// const baseUrl = 'http://localhost:8002'

const homesServerConfig = {
	/** ****Bravort Admin Dashboard Controls API */
	siggnInBravortStudentUrl: `/user/sign-in`,
	fogotPassBravortStudentUrl: `/user/forgot-password`,
	resetPassBravortStudentUrl: `/user/reset-password-withcode`,

	/** *HANLE USERS : Geta all Homes Users */
	getAllUsers: `/handle-users`,
	recruitNewUserAccounts: `/handle-users/recruit-new-useraccount`,
	activateNewUserAccounts: `/handle-users/activate-newuser-byadmin`,

	/** *HANLE ADMIN : Geta all Homes Admins  */
	getAllAdmins: `/admin/get-all-admin`,
	recruitAdmins: `/admin/recruit-staff`,
	acceptInviteByAdmins: `/admin/admin-accept-invite`,

	/** *HANLE LISTINGS : Geta all Listsings by Property-Vendors/Users */
	getAllListings: `/handle-listings`,
	/** **Approve a listing */
	approveListings: `/handle-listings/approve`,
	disapproveListings: `/handle-listings/dis-approve`,

	/** Get all service types */
	getAllServiceTypes: `/sevice-type`,

	/** **Get All property type services */
	getAllPropertyTypes: `/property-type`,

	// signInBravortStudentUrl: `${baseUrl}/user/login`,
	// getAuthStudentInBravortAdminUrl: `${baseUrl}/admin/get-auth-user`,
	// isAuthenticatedStatus: 'jwt_is_student_authenticated_status',
	// authStatus: 'jwt_is_student_authStatus',
	// adminCredentials: 'jwt_auth_student_credentials',

	/** ****Bravort Studenst Portal Constants */
	studentForgotPassTk: 'jwt_forgotpass_student_creed',

	/** *
	 * HANDLING USER UNBOARDING
	 */

	// create new user
	createNewUserTk: 'admincreate-new-user-rc'
};
export default homesServerConfig;
