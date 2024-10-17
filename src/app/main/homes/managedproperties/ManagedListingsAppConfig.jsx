import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ManagedListingApp = lazy(() => import('./ManagedListingApp'));
const PropertyListing = lazy(() => import('./product/PropertyListing'));
const Products = lazy(() => import('./products/Products'));
const ProfileApp = lazy(() => import('./manageprofile/ProfileApp'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const ManagedListingsAppConfig = {
	settings: {
		layout: {}
	},
	
	routes: [
		{
			///property/managed-listings
			path: 'property',
			element: <ManagedListingApp />,
			children: [
				{
					path: '',
					element: <Navigate to="managed-listings" />
				},
				{
					path: 'managed-listings',
					element: <Products />
				},
				{
					path: 'managed-listings/:productId/*',
					element: <PropertyListing />
				},
				{
					path: 'managed-listings/:productId/manage',
					element: <ProfileApp />
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

export default ManagedListingsAppConfig;
