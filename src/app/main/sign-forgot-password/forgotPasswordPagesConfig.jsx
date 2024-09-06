import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from 'src/app/auth';

const ModernReversedForgotPasswordPage = lazy(() => import('./ModernReversedForgotPasswordPage'));
/**
 * Route Configuration for Forgot Password Pages.
 */
const forgotPasswordConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: true
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	
	auth: authRoles.onlyGuest,
	routes: [

		{
			path: 'forgot-password',
			element: <ModernReversedForgotPasswordPage />
		},

		// {
		// 	path: 'forgot-password',
		// 	children: [
		// 		{
		// 			path: '',
		// 			element: <Navigate to="classic" />
		// 		},
		// 		{
		// 			path: 'classic',
		// 			element: <ClassicForgotPasswordPage />
		// 		},
		// 		{
		// 			path: 'modern',
		// 			element: <ModernForgotPasswordPage />
		// 		},
		// 		{
		// 			path: 'modern-reversed',
		// 			element: <ModernReversedForgotPasswordPage />
		// 		},
		// 		{
		// 			path: 'split-screen',
		// 			element: <SplitScreenForgotPasswordPage />
		// 		},
		// 		{
		// 			path: 'split-screen-reversed',
		// 			element: <SplitScreenReversedForgotPasswordPage />
		// 		},
		// 		{
		// 			path: 'full-screen',
		// 			element: <FullScreenForgotPasswordPage />
		// 		},
		// 		{
		// 			path: 'full-screen-reversed',
		// 			element: <FullScreenReversedForgotPasswordPage />
		// 		}
		// 	]
		// }
	]
};
export default forgotPasswordConfig;
