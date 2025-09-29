import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from 'src/app/auth';
import RegisterMerchantPage from './registermerchant/RegisterMerchantPage';

const AcademyApp = lazy(() => import('./AcademyApp'));
/**
 * The Academy app config.
 */


const HomeAppConfig = {
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
			path: 'homeregistry',
			element: <AcademyApp />,
			children: [
				{
					path: '',
					element: <Navigate to="/homeregistry/register/:accountId/chosen-plan" />
				},
				
				{
					path: 'register/:accountId/chosen-plan',
					// element: <Courses />
					element: <RegisterMerchantPage />
				}
			]
		}
	]
};
export default HomeAppConfig;
