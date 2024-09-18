import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from 'src/app/auth';
import LandingCenterHome from './home/LandingCenterHome';
import RegisterMerchantPage from './registermerchant/RegisterMerchantPage';

const AcademyApp = lazy(() => import('./AcademyApp'));
const Course = lazy(() => import('./course/Course'));
const Courses = lazy(() => import('./courses/Courses'));
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
					element: <Navigate to="/homeregistry/register/:accountId" />
				},
				// {
				// 	path: '/africanshops/:courseId/*',
				// 	element: <Course />
				// },
				// {
				// 	path: 'africanshops',
				// 	// element: <Courses />
				// 	// element: <LandingCenterHome />
				// },
				
				{
					path: 'register/:accountId',
					// element: <Courses />
					element: <RegisterMerchantPage />
				}
			]
		}
	]
};
export default HomeAppConfig;
