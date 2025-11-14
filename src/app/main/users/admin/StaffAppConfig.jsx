import { lazy } from 'react';
import ContactView from './contact/ContactView';
import ContactForm from './contact/ContactForm';
import AddContactForm from './contact/AddContactForm';
// import { authRoles } from 'src/app/auth';

const ContactsApp = lazy(() => import('./ContactsApp'));
const PropertyType = lazy(() => import('./propertytype/PropertyType'));
/**
 * The ContactsApp configuration.
 */

const StaffAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles.admin,
	routes: [
		{
			path: 'users/admin',
			element: <ContactsApp />,
			children: [
				{
					path: ':id/create',
					element: <AddContactForm />
				},
				{
					path: ':id',
					element: <ContactView />
				},
				{
					path: ':id/edit',
					element: <ContactForm />
				}

				// {
				// 	path: 'operate/:productId/*',
				// 	element: <PropertyType />
				// },
			]
		}
	]
};

export default StaffAppConfig;
