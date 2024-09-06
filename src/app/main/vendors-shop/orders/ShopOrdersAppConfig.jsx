import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ECommerceApp = lazy(() => import('./ECommerceApp'));
// const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
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
			//shoporders-list/orders
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
					path: 'orders/:orderId',
					element: <Order />
				},

				
				{
					path: 'pos',
					element: <Products />
				},
				
			]
		}
	]
};
export default ShopOrdersAppConfig;
