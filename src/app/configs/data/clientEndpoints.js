/**
 * ADMIN DASHBOARD CLIENT ROUTES
 */

export const CONTROL_CLIENT_PAGES = {
	ADMIN_LOGIN: '/control/login',
	ADMIN_REGISTER: '/control/register',
	ADMIN_FORGOT_PASS: '/control/forgotPassword',
	ADMIN_LOGOUT: '/control/logout',

	/**
	 * auth pages
	 */
	/** ADMINISTRATION ACTIVITIES STARTS */
	ADMIN_LIST_OFFICES: '/control/offices',
	ADMIN_LIST_DERPARTMENTS: '/control/departments',
	ADMIN_LIST_DESIGNATIONS: '/control/designations',
	ADMIN_LIST_OPERATIONAL_COUNTRIES: '/control/bus_countries',
	ADMIN_LIST_OPERATIONAL_STATES: '/control/bus_states',
	ADMIN_LIST_OPERATIONAL_LGAS: '/control/bus_lgas',
	/** ADMINISTRATION ACTIVITIES ENDS/// */

	/** ADMINISTRATIVE USER CONTROL STARTS */
	ADMIN_DASHBOARD: '/control',
	ADMIN_LIST_STAFF: '/control/staff',
	ADMIN_LIST_USERS: '/control/users',

	ADMIN_LIST_VENDOR_PLANS: '/control/vendors/vendorplans',
	ADMIN_LIST_VENDORS: '/control/vendors',
	ADMIN_LIST_VENDORS_STAFF: '/control/vendors/vendor-staff',
	ADMIN_LIST_VENDORS_CUSTOMERS: '/control/vendors/vendorcustomers',
	/** ADMINISTRATIVE USER CONTROL ENDs/// */
	/** **================================================================================================ */

	/** ADMINISTRATIVE PRODUCT CONTROL STARTS */
	ADMIN_LIST_WAREHOUSES: '/control/warehouses',
	ADMIN_LIST_WAREHOUSES_STAFF: '/control/warehouses/warehouse-staff',
	ADMIN_LIST_WAREHOUSES_CUSTOMERS: '/control/warehouses/warehousecustomers',

	ADMIN_LIST_PRODUCTS: '/control/products',
	ADMIN_LIST_VENDOR_PRODUCTS: '/control/products/vendorproducts',

	ADMIN_LIST_PRODUCTS_CATEGORIES: '/control/products/categories',

	ADMIN_LIST_TRADEHUBS: '/control/tradehubs',
	/** ADMINISTRATIVE PRODUCT CONTROL ENDS/// */
	/** **================================================================================================ */

	/** ADMINISTRATIVE ORDER MANAGEMENT STARTS */
	ADMIN_LIST_ORDERS: '/control/orders',
	ADMIN_LIST_TRANSACTIONS: '/control/transactions',
	ADMIN_LIST_POS: '/control/pos',

	/** ADMINISTRATIVE ORDER MANAGEMENT ENDS/// */
	/** **================================================================================================ */

	/** ADMINISTRATIVE E-COMMERCE FINANACE MANAGEMENT STARTS */
	ADMIN_LIST_TAX: '/control/taxes',
	ADMIN_LIST_SHIPPINGS: '/control/shippings',
	ADMIN_LIST_SHOPS_WITHDRAWALS: '/control/shops_withdrawals',
	ADMIN_LIST_WAREHOUSE_WITHDRAWALS: '/control/warehouse_withdrawals',

	ADMIN_LIST_REFUNDS: '/control/refunds',
	ADMIN_LIST_REFUNDS_POLICY: '/control/refunds_policies',

	/** ADMINISTRATIVE E-COMMERCE FINANACE ENDS/// */
	/** **================================================================================================ */

	/** E-COMMERCE PROMOTIONAL MANAGEMENT STARTS */
	ADMIN_LIST_COUPONS: '/control/coupons',
	ADMIN_LIST_FLASH_SALES: '/control/flashsales',
	/** E-COMMERCE PROMOTIONAL MANAGEMENT ENDS//// */
	/** **================================================================================================ */

	/** E-COMMERCE FEED BACK CONTROL MANAGEMENT STARTS */
	ADMIN_LIST_REVIEWS: '/control/reviews',
	ADMIN_LIST_QUESTIONS: '/control/questionsandanswers',
	ADMIN_LIST_SUPPORT_TICKETS: '/control/support/tickets',
	/** E-COMMERCE FEED BACK CONTROL MANAGEMENT ENDS//// */
	/** **================================================================================================ */

	/** E-COMMERCE FEATURE CONTROL MANAGEMENT STARTS */
	ADMIN_LIST_MESSAGE: '/control/messages',
	ADMIN_LIST_NOTICES: '/control/store_notices',

	/** E-COMMERCE FEATURE CONTROL MANAGEMENT ENDS//// */
	/** **================================================================================================ */

	/** E-COMMERCE LAYOUT PAGE MANAGEMENT STARTS */
	ADMIN_LIST_HOMEBOARD: '/control',
	ADMIN_LIST_TERMSAND: '/control/store_notices',
	/** E-COMMERCE LAYOUT PAGE MANAGEMENT ENDS//// */
	/** **================================================================================================ */

	/** E-COMMERCE SITE SETTINGS STARTS */
	ADMIN_LIST_GENERAL_SETTING: '/control/general_settings',
	ADMIN_LIST_PAYMENT_SETTING: '/control/payment_settings',
	/** E-COMMERCE  ENDS//// */

	ADD_PROPERTY: '/control/admin/addadmin'
};

/**
 * VENDOR DASHBOARD CLIENT ROUTES
 */

// export const VENDOR_CLIENT_PAGES = {
//     VENDOR_LOGIN: '/vendor/login',
//     VENDOR_REGISTER: '/vendor/register',
//     VENDOR_FORGOT_PASS: '/vendor/forgotPassword',
//     VENDOR_LOGOUT: '/vendor/logout',

// /**
//  * auth pages
//  */
// VENDOR_DASHBOARD: '/vendor',
// // ADMIN_AUTH_PAGE: '/lachariz/login',

// ADD_PROPERTY: '/vendor/admin/addadmin',
// }

/**
 * WAREHOUSE DASHBOARD CLIENT ROUTES
 */
// export const WAREHOUSE_CLIENT_PAGES = {
//     WAREHOUSE_LOGIN: '/warehouse/login',
//     WAREHOUSE_REGISTER: '/warehouse/register',
//     WAREHOUSE_FORGOT_PASS: '/warehouse/forgotPassword',
//     WAREHOUSE_LOGOUT: '/warehouse/logout',

// /**
//  * auth pages
//  */
// WAREHOUSE_DASHBOARD: '/warehouse',
// // ADMIN_AUTH_PAGE: '/lachariz/login',

// ADD_PROPERTY: '/warehouse/admin/addadmin',
// }
