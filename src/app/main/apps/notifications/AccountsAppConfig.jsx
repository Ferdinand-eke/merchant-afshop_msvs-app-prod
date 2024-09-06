import { lazy } from 'react';

const AccountssApp = lazy(() => import('./AccountssApp'));
/**
 * The Notifications app config.
 */
const AccountsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/notifications',
			children: [
				{
					path: '',
					element: <AccountssApp />,
					exact: true
				}
			]
		}
	]
};
export default AccountsAppConfig;
