import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// import ReservationsOfBookedProperties from './reservations/ReservationsOfBookedProperties';
// import ReservationOrder from './reservationorder/ReservationOrder';
// import SimpleWithSidebarsContentScrollComponent from '../../user-interface/page-layouts/simple/with-sidebars/SimpleWithSidebarsContentScrollComponent';

const ManagedBookingListingApp = lazy(() => import('./ManagedBookingListingApp'));
const BookingPropertyListing = lazy(() => import('./bookingsproperty/BookingPropertyListing'));
const BookingProperties = lazy(() => import('./properties/BookingProperties'));
const BookingProfileApp = lazy(() => import('./manageprofile/BookingProfileApp'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));


const ReservationsOfBookedProperties = lazy(() => import('./reservations/ReservationsOfBookedProperties'));
const ReservationOrder = lazy(() => import('./reservationorder/ReservationOrder'));

const SimpleWithSidebarsContentScrollComponent = lazy(() => import('../../user-interface/page-layouts/simple/with-sidebars/SimpleWithSidebarsContentScrollComponent'));
/**
 * The E-Commerce app configuration.
 */

const ManagedBookingsListingsAppConfig = {
	settings: {
		layout: {}
	},
	
	
	routes: [
		{
			path: 'bookings',
			element: <ManagedBookingListingApp />,
			children: [
				{
					path: '',
					element: <Navigate to="managed-listings" />
				},
				{
					path: 'managed-listings',
					element: <BookingProperties />
				},

				{
					path: 'list-reservations',
					element: <ReservationsOfBookedProperties />
				},
				
				{
					path: 'list-reservation/:reservationId/manage',
					element: <ReservationOrder />
					///myshop/merchant-homes/get-my-reservations/:reservationId
				},

				{
					path: 'managed-listings/:productId/*',
					element: <BookingPropertyListing />
				},
				{
					path: 'managed-listings/:productId/manage',
					element: <BookingProfileApp />
				},

			

			]
		}
	]
};

export default ManagedBookingsListingsAppConfig;
