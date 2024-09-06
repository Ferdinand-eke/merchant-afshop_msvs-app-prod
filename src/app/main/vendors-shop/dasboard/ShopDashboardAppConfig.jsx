import { lazy } from 'react';

const ShopDashboardApp = lazy(() => import('./ShopDashboardApp'));
/**
 * The ProjectDashboardApp configuration.
 */
const ShopDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'shop-dashboard',
			element: <ShopDashboardApp />
		}
	]
};
export default ShopDashboardAppConfig;

