import { lazy } from 'react';

const ProfileApp = lazy(() => import('./ProfileApp'));
/**
 * The Profile app config.
 */
const merchantProfileAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'merchant/profile',
			element: <ProfileApp />
		}
	]
};
export default merchantProfileAppConfig;
