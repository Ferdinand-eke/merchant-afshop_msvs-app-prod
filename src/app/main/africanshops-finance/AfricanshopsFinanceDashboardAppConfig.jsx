import { lazy } from 'react';

const FinanceDashboardApp = lazy(() => import('./FinanceDashboardApp'));
const FinanceDashboardAppWithdarwals = lazy(() => import('./FinanceDashboardAppWithdarwals'));
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
		}
	],
	
	// routes: [
	// 	{
	// 		path: 'shopproducts-list',
	// 		element: <ShopProductsApp />,
	// 		children: [
	// 			{
	// 				path: '',
	// 				element: <Navigate to="products" />
	// 			},
	// 			{
	// 				path: 'products',
	// 				element: <ShopProducts />
	// 			},
	// 			{
	// 				path: 'products/:productId/*',
	// 				element: <ShopProduct />
	// 			},
	// 			{
	// 				path: 'inventory',
	// 				element: <ShopProducts />
	// 			},
			
	// 		]
	// 	}
	// ]

	
};
export default AfricanshopsFinanceDashboardAppConfig;
