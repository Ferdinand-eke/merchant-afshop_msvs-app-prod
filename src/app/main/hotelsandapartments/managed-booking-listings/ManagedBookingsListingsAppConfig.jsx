import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
const AddStaffContactForm = lazy(() => import('./manageprofile/tabs/photos-videos/AddUserForm')); 
const ManageReservationContent =lazy(() => import('./manageprofile/tabs/photos-videos/ManageReservationContent'));  
const ManagedBookingListingApp = lazy(() => import('./ManagedBookingListingApp'));
const BookingPropertyListing = lazy(() => import('./bookingsproperty/BookingPropertyListing'));
const BookingProperties = lazy(() => import('./properties/BookingProperties'));
const BookingProfileApp = lazy(() => import('./manageprofile/BookingProfileApp'));

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
					path: 'managed-listings/:productId/*',
					element: <BookingPropertyListing />
				},

				{
					path: 'managed-listings/:productId/manage',
					element: <BookingProfileApp />,
					children: [
						{
							element: <ManageReservationContent />,
							children: [
								{
									path: ':reservationId/handle-arrival',
									element: <AddStaffContactForm />
								}
							]

						}
					]
				},
				

				{
					path: 'list-reservations',
					element: <ReservationsOfBookedProperties />
				}, //(Msvs: => : Done)

				
				{
					path: 'list-reservation/:reservationId/manage',
					element: <ReservationOrder />
				},//(Msvs: => : Done)

				
				
				

			

			]
		}
	]
};

export default ManagedBookingsListingsAppConfig;
