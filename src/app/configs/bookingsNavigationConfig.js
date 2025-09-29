import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);
/**
 * The bookingsNavigationConfig object is an array of navigation items for the Fuse application.
 */

const bookingsNavigationConfig = [
	/** *Dashboard pane */
	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'Navigation helpers',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'shop.dashboards',
				title: 'Bookings Dashboard',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/shop-dashboard'
			}
		]
	},

	{
		id: 'booklistings',
		title: 'Manage Bookings properties',
		subtitle: 'Bookings Properties management helpers',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'BOOKINGSPROPERTIES',
		children: [
			{
				id: 'properties.managedbooklist',
				title: 'Managed Booking Listings',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/bookings/managed-listings'
			},

			{
				id: 'properties.reservationsList',
				title: 'Merchant Reservations',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/bookings/list-reservations'
			}
		]
	},

	/** *Finance management pane */
	{
		id: 'FInance',
		title: 'Manage Finance',
		subtitle: 'Earnings from businesses you run',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'FINANCE',
		children: [
			{
				id: 'estates.earnings',
				title: 'Wallet',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/africanshops/finance'
			}
		]
	},

	/** *Support management pane */
	{
		id: 'Support.Helpcenter',
		title: 'Get Support',
		subtitle: 'Get Clarity And Support From Admin',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'SUPPORT',
		children: [
			{
				id: 'support.users',
				title: 'Suppport',
				type: 'item',
				icon: 'heroicons-outline:support',
				url: '/support'
			}
		]
	},

	/** *Messanger pane */
	{
		id: 'Africanshops.Messanger',
		title: 'Messanger',
		subtitle: 'Chat with potential customres and admin',
		type: 'group',
		icon: 'heroicons-outline:chat-alt',
		translate: 'MESSANGER',
		children: [
			{
				id: 'apps.messenger',
				title: 'Messenger',
				type: 'item',
				icon: 'heroicons-outline:chat-alt',
				url: '/africanshops/messenger',
				translate: 'MESSENGER'
			}
		]
	}
];
export default bookingsNavigationConfig;
