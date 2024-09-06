import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const SettingsApp = lazy(() => import('./SettingsApp'));
const PosTable = lazy(() => import('./tabs/PosTable'));
const AccountTab = lazy(() => import('./tabs/AccountTab'));
const SecurityTab = lazy(() => import('./tabs/SecurityTab'));
const PlanBillingTab = lazy(() => import('./tabs/PlanBillingTab'));
const NotificationsTab = lazy(() => import('./tabs/NotificationsTab'));
const TeamTab = lazy(() => import('./tabs/TeamTab'));
/**
 * The Settings app config.
 */
const ShopsPosAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'africanshops/shops',
			element: <SettingsApp />,
			children: [
				
				{
					path: 'pos',
					element: <PosTable />
				},
				// {
				// 	path: 'account',
				// 	element: <AccountTab />
				// },
				// {
				// 	path: 'security',
				// 	element: <SecurityTab />
				// },
				// {
				// 	path: 'plan-billing',
				// 	element: <PlanBillingTab />
				// },
				// {
				// 	path: 'security',
				// 	element: <SecurityTab />
				// },
				// {
				// 	path: 'notifications',
				// 	element: <NotificationsTab />
				// },
				// {
				// 	path: 'team',
				// 	element: <TeamTab />
				// },
				{
					path: '',
					element: <Navigate to="account" />
				}
			]
		}
	]
};
export default ShopsPosAppConfig;
