import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ECommerceApp = lazy(() => import('./ECommerceApp'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const ShopOrdersAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'shoporders-list',
			element: <ECommerceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="orders" />
				},
				{
					path: 'orders',
					element: <Orders />
				},
				{
					path: 'orders/:orderId/item',
					element: <Order />
				}
			]
		}
	]
};

export default ShopOrdersAppConfig;
