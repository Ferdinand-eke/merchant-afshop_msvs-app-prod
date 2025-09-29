import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const PropertyTypesApp = lazy(() => import('./PropertyTypesApp'));
const PropertyType = lazy(() => import('./propertytype/PropertyType'));
const PropertyTypes = lazy(() => import('./Propertytypes/PropertyTypes'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const PropertyTypesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'types',
			element: <PropertyTypesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="propertytypes" />
				},
				{
					path: 'propertytypes',
					element: <PropertyTypes />
				},
				{
					path: 'propertytypes/:productId/*',
					element: <PropertyType />
				},
				
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

export default PropertyTypesAppConfig;
