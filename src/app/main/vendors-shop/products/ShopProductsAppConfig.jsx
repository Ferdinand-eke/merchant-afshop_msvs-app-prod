import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ShopProductsApp = lazy(() => import('./ShopProductsApp'));
const ShopProduct = lazy(() => import('./product/ShopProduct'));
const ShopProducts = lazy(() => import('./products/ShopProducts'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const ShopProductsAppConfig = {
	settings: {
		layout: {}
	},

	routes: [
		{
			path: 'shopproducts-list',
			element: <ShopProductsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="products" />
				},
				{
					path: 'products',
					element: <ShopProducts />
				},
				{
					path: 'products/:productId/*',
					element: <ShopProduct />
				},
				{
					path: 'inventory',
					element: <ShopProducts />
				}
				// {
				// 	path: 'orders',
				// 	element: <Orders />
				// },
				// {
				// 	path: 'orders/:orderId',
				// 	element: <Order />
				// }
			]
		}
	]
};
export default ShopProductsAppConfig;
