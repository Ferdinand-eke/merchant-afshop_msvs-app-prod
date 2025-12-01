import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import Error404Page from '../main/404/Error404Page';
// import AppsConfigs from "../main/apps/appsConfigs";
// import UserInterfaceConfigs from "../main/user-interface/UserInterfaceConfigs";
// import DocumentationConfig from "../main/documentation/DocumentationConfig";
import authRoleExamplesConfigs from '../main/auth/authRoleExamplesConfigs';
// import UsersAppConfig from "../main/users/user/UsersAppConfig";
// import StaffAppConfig from "../main/users/admin/StaffAppConfig";
// import PropertiesAppConfig from "../main/properties/listings/PropertiesAppConfig";
// import ServiceTypesAppConfig from "../main/homes/servicetypes/ServiceTypesAppConfig";
import ManagedListingsAppConfig from '../main/vendor-homes-property/managedproperties/ManagedListingsAppConfig';
import ShopDashboardAppConfig from '../main/vendors-shop/dasboard/ShopDashboardAppConfig';
import ShopProductsAppConfig from '../main/vendors-shop/products/ShopProductsAppConfig';
import ShopOrdersAppConfig from '../main/vendors-shop/orders/ShopOrdersAppConfig';
import SupportHelpCenterAppConfig from '../main/vendors-shop/support-center/SupportHelpCenterAppConfig';
import AfricanshopsFinanceDashboardAppConfig from '../main/africanshops-finance/AfricanshopsFinanceDashboardAppConfig';
import AfricanshopsMessengerAppConfig from '../main/africanshops-messenger/AfricanshopsMessengerAppConfig';
import forgotPasswordConfig from '../main/sign-forgot-password/forgotPasswordPagesConfig';
import resetPasswordConfig from '../main/sign-reset-password/resetPasswordPagesConfig';
import merchantProfileAppConfig from '../main/vendors-shop/profile/merchantProfileAppConfig';
import SettingsAppConfig from '../main/vendor-settings/settings/SettingsAppConfig';
import ShopsPosAppConfig from '../main/vendors-shop/pos/ShopsPosAppConfig';
import blogAppConfig from '../main/newsblog/blogAppConfig';
import HomeAppConfig from '../main/vendors-shop/home/HomeAppConfig';
import MerchantMailboxAppConfig from '../main/vendors-shop/mailbox/MerchantMailboxAppConfig';
import ManagedBookingsListingsAppConfig from '../main/vendor-hotelsandapartments/managed-booking-listings/ManagedBookingsListingsAppConfig';
import ManagedFoodMartsAppConfig from '../main/vendor-foodmarts/managed-foood-mart/ManagedFoodMartsAppConfig';
// import AfricanshopsMessengerAppConfig from '../main/africanshops-messenger/AfricanshopsMessengerAppConfig';

const routeConfigs = [
	// SignOutConfig,
	SignInConfig,
	// SignUpConfig,
	// SignAcceptInviteConfig,
	forgotPasswordConfig,
	resetPasswordConfig,
	// DocumentationConfig,

	/** *User management and properties starts ManagedUserListingsAppConfig */
	// UsersAppConfig,
	// StaffAppConfig,
	// PropertiesAppConfig,
	// ServiceTypesAppConfig,

	/** ****Hotels, apartment and suites management  starts*/
	ManagedBookingsListingsAppConfig,
	/** ****Hotels, apartment and suites management  ends*/

	// PropertyTypesAppConfig,
	// ManagedUserListingsAppConfig,

	/** ***Food Mart (Restaurants, Bakeries etc) starts */
	ManagedFoodMartsAppConfig,
	/** ***Food Mart (Restaurants, Bakeries etc) ends */

	/** ***Estates Homes and estate management starts*/
	ManagedListingsAppConfig,
	/** ***Estates Homes and estate management ends*/

	/** *User management and properties starts */

	/** **Africanshops Dashboard Configs Starts Here */
	ShopDashboardAppConfig,
	ShopProductsAppConfig,
	ShopOrdersAppConfig,
	SupportHelpCenterAppConfig,
	AfricanshopsFinanceDashboardAppConfig,
	AfricanshopsMessengerAppConfig,
	merchantProfileAppConfig,
	MerchantMailboxAppConfig,

	SettingsAppConfig,
	ShopsPosAppConfig,

	/** **Africanshops Dashboard Configs Ends Here */

	/** **
	 *
	 * Start of Un-Authenticated pages are listed below here
	 */
	//   HomeAppConfig,
	HomeAppConfig,
	blogAppConfig,

	/** **
	 *
	 * End of Un-Authenticated pages are listed below here
	 */

	/** Routes Below to be disabled */
	// ...PagesConfigs,
	// ...UserInterfaceConfigs,
	// ...DashboardsConfigs,
	// ...AppsConfigs,
	...authRoleExamplesConfigs
];
/**
 * The routes of the application.
 */
const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/shop-dashboard" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}

	// {
	//   path: "/",
	//   settings: {
	//     layout: {
	//       config: {
	//         navbar: {
	//           display: false,
	//         },
	//         toolbar: {
	//           display: true,
	//         },
	//         footer: {
	//           display: false,
	//         },
	//         leftSidePanel: {
	//           display: false,
	//         },
	//         rightSidePanel: {
	//           display: false,
	//         },
	//       },
	//     },
	//   },
	//   element: <LandingCenterHome />,

	// },
];
export default routes;
