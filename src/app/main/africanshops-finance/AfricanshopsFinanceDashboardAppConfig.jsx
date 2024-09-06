import { lazy } from 'react';

const FinanceDashboardApp = lazy(() => import('./FinanceDashboardApp'));
/**
 * The finance dashboard app config.
 */

const AfricanshopsFinanceDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'africanshops/finance',
			element: <FinanceDashboardApp />
		}
	]
};
export default AfricanshopsFinanceDashboardAppConfig;
