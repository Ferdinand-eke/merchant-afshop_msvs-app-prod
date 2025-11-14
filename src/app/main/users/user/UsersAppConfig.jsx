import { lazy } from 'react';
import UserContactView from './contact/UserContactView';
import ContactForm from './contact/ContactForm';
// import { authRoles } from 'src/app/auth';
import AddUserForm from './contact/AddUserForm';
import ActivateUserForm from './contact/ActivateUserForm';

const ContactsApp = lazy(() => import('./ContactsApp'));
/**
 * The ContactsApp configuration.
 */
const UsersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles.admin,

	routes: [
		{
			path: 'users/user',
			element: <ContactsApp />,
			children: [
				{
					path: ':id/create',
					element: <AddUserForm />
				},
				{
					path: ':id/activate',
					element: <ActivateUserForm />
				},
				{
					path: ':id',
					element: <UserContactView />
				},
				{
					path: ':id/edit',
					// element: <ContactForm />
					element: <ContactForm />
				}
			]
		}
	]
};
export default UsersAppConfig;
