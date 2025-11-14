import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ServiceTypesApp = lazy(() => import('./ServiceTypesApp'));
const ServiceType = lazy(() => import('./serviceplan/ServiceType'));
const ServiceTypes = lazy(() => import('./serviceplans/ServiceTypes'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const ServiceTypesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'packages',
			element: <ServiceTypesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="servicetypes" />
				},
				{
					path: 'servicetypes',
					element: <ServiceTypes />
				},
				// packages/servicetypes
				{
					path: 'servicetypes/:productId/*',
					element: <ServiceType />
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
export default ServiceTypesAppConfig;
