import { lazy } from 'react';
import Chat from './chat/Chat';
import MessengerFirstScreen from './MessengerFirstScreen';

const MessengerApp = lazy(() => import('./MessengerApp'));
/**
 * The chat app config.
 */
const AfricanshopsMessengerAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'africanshops/messenger',
			element: <MessengerApp />,
			children: [
				{
					path: '',
					element: <MessengerFirstScreen />
				},
				{
					path: ':id',
					element: <Chat />
				}
			]
		}
	]
};
export default AfricanshopsMessengerAppConfig;
