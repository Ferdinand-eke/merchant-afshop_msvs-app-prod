import { lazy } from 'react';

const FinanceDashboardApp = lazy(() => import('./FinanceDashboardApp'));
const FinanceDashboardAppWithdarwals = lazy(() => import('./FinanceDashboardAppWithdarwals'));
const FinanceDashboardAppTransactionReports = lazy(() => import('./FinanceDashboardAppTransactionReports'));
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
		},

		{
			path: 'africanshops/withdrawals',
			element: <FinanceDashboardAppWithdarwals />
			// element: <FinanceDashboardApp />
		},

		{
			path: 'africanshops/transaction-reports',
			element: <FinanceDashboardAppTransactionReports />
			// element: <FinanceDashboardApp />
		}
	]
};
export default AfricanshopsFinanceDashboardAppConfig;
