import { lazy } from 'react';
import ContactView from './contact/ContactView';
import ContactForm from './contact/ContactForm';
// import { authRoles } from 'src/app/auth';

const ContactsApp = lazy(() => import('./PropertiesApp'));
/**
 * The ContactsApp configuration.
 */
const PropertiesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles.admin,
	routes: [
		{
			path: 'properties/listings',
			element: <ContactsApp />,
			children: [
				{
					path: ':id',
					element: <ContactView />
				},
				{
					path: ':id/edit',
					element: <ContactForm />
				}
			]
		}
	]
};

export default PropertiesAppConfig;
