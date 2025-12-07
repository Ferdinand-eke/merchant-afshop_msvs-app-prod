import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs'; // or use new URLSearchParams()
import { resetSessionForShopUsers } from 'app/configs/utils/authUtils';
import { getAdminAccessToken } from '../utils/opsUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_PROD;

/** *================================================================================================================= */
export const customHeaders = {
	Accept: 'application/json'
};

export const baseUrl = `${API_BASE_URL}`;

export function Api() {
	const Api = axios.create({
		baseURL: baseUrl,
		headers: customHeaders
	});

	return Api;
}

export function AuthApi() {
	const token = getAdminAccessToken();

	// console.log("AUTH_TOKEN", token)

	const customHeaders = {
		Accept: 'application/json',
		withcredentials: true,
		headers: {
			// 'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
		// token: `Bearer ${TOKEN}`,
	};

	const Api = axios.create({
		/** ***********Previous for Here starts */
		baseURL: baseUrl,
		// headers: customHeaders,
		/** ***************Previous for Here starts  ends */
		headers: { shoparccreed: `${token}` }
	});
	Api.interceptors.response.use(
		(response) => response,
		(error) => {
			console.error('Interceptor---ERROR', error);

			if (error?.response?.status === 403) {
				console.log('responseSTATS', error?.response?.status);
				// merchantLogOutCall();
				// toast.error(
				//   error.response && error.response.data.message
				//     ? error.response.data.message
				//     : error.message
				// );

				return Promise.reject({ status: 401, errors: ['Unauthorized'] });
			}

			if (error.response?.status === 422) {
				const errors = Object.values(error?.response?.data?.errors || {});
			}

			return Promise.reject(error);
		}
	);

	return Api;
}

export const merchantSignIn = (formData) => {
	console.log('DATA_IN_FORM', formData);
	return Api().post(`/auth-merchant/login`, formData);
}; // (Mcsvs => Done)

export const shopForgotPasswordInit = (formData) => {
	console.log('DATA_IN_FORM', formData);
	return Api().post(`/auth-merchant/forgot-password`, formData);
}; // (Mcsvs => Done)

export const resetshopPasswordWithcode = (formData) => {
	console.log('RESETPASS_DATA_INTORM', formData);
	return Api().put(`/auth-merchant/reset-password`, formData);
}; // (Mcsvs => Done)

export const logOutAdmin = () => {
	// Api().post(`${CONTROL_API_ENDPOINTS.ADMIN_LOGIN}`, formData);
	const ok = true;
	return ok;
};

/** ==============================================================|
 *   Shop authenticated settings start routes    
================================================================ */
export const authShopChangePasword = (formData) => AuthApi().put(`/auth-merchant/settings/change-password`, formData); // (Mcsvs => Done)
export const initiateMerchantChangeEmail = (formData) =>
	AuthApi().put(`/auth-merchant/settings/change-email/initiate`, formData);

export const authShopChangeEmail = (formData) => AuthApi().put(`/auth-merchant/settings/change-email/update`, formData);

export const authShopCloseAccountCall = () => AuthApi().post(`/auth-merchant/settings/close-merchant-account`);

/** ==============================================================|
 *   Shop authenticated settings start routes   
================================================================ */

/**
 * =============================================================
 * GUEST ROUTES AND CTIVITIES STARTS HERE
 * ==========================================================
 */

/** *Post categories */
export const getPostcats = () => Api().get('/postcats'); // done
// Posts
export const getBlogPosts = () => Api().get('/posts');
export const getBlogPostsById = (slug) => Api().get(`/posts/by/${slug}`);

// Tradehubs
export const getTradehubs = () => Api().get('/trade-hubs'); // (Msvs => Done)

export const getTradehubById = (id) => Api().get(`/trade-hubs/${id}`); // (Msvs => Done)

// Country Routes
export const getCountries = () => Api().get('/buzcountries/operational'); // (Msvs => Done)
export const getCountryDataById = (id) => Api().get(`/buzcountries/${id}`);

// State Routes
export const getBStates = () => Api().get('/buzstates');
export const getStateById = (id) => Api().get(`/buzstates/${id}`);

export const getStateByCountryId = (cid) => Api().get(`/buzstates/in-country/${cid}/operational`); // (Msvs => Done)

// lgas Routes''
export const getBLgas = () => Api().get('/buz-lgas'); // done
export const getLgaById = (id) => Api().get(`/buz-lgas/${id}`); // done
export const getLgaByStateId = (id) => Api().get(`/buz-lgas/in-state/${id}/operational`); // (Msvs => Done)

//= =======================================Market Routes starts
export const getAfMarkets = () => Api().get('/markets');
export const getMarketById = (id) => Api().get(`/markets/${id}`);
export const getMarketsByStateId = (id) => Api().get(`/markets/states/${id}`);
export const getMarketsByLgaId = (id) => Api().get(`/markets/in-state/${id}/operational`); // (mscvs => )

//= =======================================Market Routes ends

/**
 * =============================================================
 * GUEST ROUTES AND CTIVITIES STARTS HERE
 * ==========================================================
 */
/** ================================================================================================================== */

/**
 * =============================================================
 * AUTH ROUTES AND ACTIVITIES STARTS HERE
 * ==========================================================
 */

// Product Categories Routes
export const getProdCats = () => AuthApi().get('/categories'); // (Msvs => Done)
export const getProdCatById = (id) => AuthApi().get(`/productcats/${id}`);

// Product Units Routes
export const getProdUnits = () => AuthApi().get('/unit-weights'); // (Msvs => Done)
export const getProdUnitByShopPlan = (id) => Api().get(`/unit-weights/by-shopplan/${id}`); // (Msvs => Done)

export const getProdUnitById = (id) => AuthApi().get(`/unit-weights/${id}`);

// Product Shipping Weight Units Routes
export const getProdShippingWeightUnit = () => Api().get('/shipping-weights');

// {===============================shop product handling starts=======================================}
export const storeProductImages = (formData) =>
	AuthApi().post(`/productsbymerchant/${formData?.productId}/uploadimages`, formData);

export const removeProductImagesById = (formData) =>
	AuthApi().post(`/productsbymerchant/${formData?.productId}/removeimage`, formData);

export const getShopProducts = () => AuthApi().get('/productsbymerchant/get-merchant-products'); // (Msvs => Done)

export const storeShopProduct = (formData) => AuthApi().post('/productsbymerchant/merchant-product', formData); // (Msvs => Done)

// export const getMyShopProductById = (id) =>
//   AuthApi().get(`/api/myshop-products/${id}`);
export const getMyShopProductById = (id) => AuthApi().get(`/productsbymerchant/merchant-product/${id}/view`); // (Msvs : 'Done)

export const updateMyShopProductById = (productFormData) =>
	AuthApi().put(`/productsbymerchant/merchant-product/${productFormData?.id}/update`, productFormData); // (Msvs : 'Done)

// pushing for export
export const pushMyShopProductByIdToExport = (productFormData) =>
	AuthApi().put(`/myshop/push-product-to-export/${productFormData}`);
// pulling product from export
export const pullMyShopProductByIdFromExport = (productFormData) =>
	AuthApi().put(`/myshop/pull-product-from-export/${productFormData}`);

export const deleteShopProductImage = (imageData) => {
	console.log('imageDataPayload', imageData);
	return AuthApi().delete(`/productsbymerchant/${imageData?.productId}/delete-product-image`, { data: imageData });
};

// Change/Replace a single product image
// TODO: Update endpoint when backend provides the correct route
export const changeShopProductImage = (imageData) => {
	console.log('changeImagePayload', imageData);
	// imageData: { productId, oldImagePublicId, newImageFile }
	return AuthApi().put(`/productsbymerchant/${imageData?.productId}/change-product-image`, imageData);
};

export const deleteShopProduct = (id) => {
	console.log('productToDelete', id);
	return AuthApi().delete(`/productsbymerchant/delete-product/${id}`);
};

// Price Tier Management for existing products
export const addProductPriceTier = (tierData) => {
	console.log('addPriceTierPayload', tierData);
	// tierData: { productId, minQuantity, maxQuantity, price }
	return AuthApi().post(`/productsbymerchant/${tierData?.productId}/add-price-tier`, tierData);
};

export const updateProductPriceTier = (tierData) => {
	console.log('updatePriceTierPayload', tierData);
	// tierData: { productId, tierId, minQuantity, maxQuantity, price } /${tierData?.tierId}
	return AuthApi().put(`/productsbymerchant/${tierData?.productId}/update-price-tier/${tierData?.tierId}`, tierData);
};

export const deleteProductPriceTier = (tierData) => {
	console.log('deletePriceTierPayload', tierData);
	// tierData: { productId, tierId }
	return AuthApi().delete(`/productsbymerchant/${tierData?.productId}/delete-price-tier/${tierData?.tierId}`);
};

// {===============================shop product handling ends   =======================================}

// {===============================shop detals handling starts   =======================================}
export const getJustMyShopDetails = () => AuthApi().get('/api/myshop/get-just-details');

export const getMinimizedJustMyShopDetails = () => AuthApi().get('/auth-merchant/get-base-merchant');

export const getJustMyShopDetailsAndPlan = (params) => {
	// ?queryAllData=${queryParam} queryAllData
	// console.log("PARAM__IN__ROUTE", queryAllData)
	const queryString = qs.stringify(params, { arrayFormat: 'repeat' });
	return AuthApi().get(`/auth-merchant/myshop/get-just-details/plan?${queryString}`); //* (Msvs => Done)
}; //* (Msvs => Done)

export const getJustMyShopDetailsAndPlanForUpdate = () => {
	return AuthApi().get(`/auth-merchant/myshop/get-just-details/for-update`); //* (Msvs => Done)
}; //* (Msvs => Done)

export const getMyShopDetails = () => AuthApi().get('/auth-merchant/myshop/get-just-details/plan'); //* (Msvs => Done)

export const getMyOtherShopsList = () => AuthApi().get('/api/myshop/get-my-other-shops');

export const createMyShopBranch = (shopFormData) => AuthApi().post(`/api/myshop/create-branch`, shopFormData);

export const updateMyShopBranch = (shopFormData) =>
	AuthApi().put(`/api/myshop/update-branch/${shopFormData?._id}`, shopFormData); // newDashboard Not-done

export const updateMyShopDetails = (shopFormData) =>
	AuthApi().put(`auth-merchant/myshop/get-just-details/update`, shopFormData); // (Msvs => Done)

export const deleteMyShopCompletely = (id, shopFormData) =>
	AuthApi().post(`/api/myshop/delete-myshop-completely/${id}`, shopFormData);

//= =====handle shop bank account updates and withdrawals id, /${id}
export const updateMyShopBankAccount = (shopFormData) =>
	AuthApi().put(`/api/myshop/update-finance-details`, shopFormData); // newDashboard done

export const updateMyShopBankAccountPin = (shopFormData) =>
	AuthApi().put(`/api/myshop/update-account-pin`, shopFormData); // newDashboard done

export const getMyShopWithdrawals = () => AuthApi().get('/api/myshop/get-my-Withdrawals'); // newDashboard done

/** *##########################################################################
 * Handle shop acoount tasks for separate "AACOUNT" model
 *############################################################################# */
export const getMyShopAccountApiDetails = () => AuthApi().get('/fintech-accounts/merchant/account/my-account'); // newDashboards //done /**(Msvs => Done) */
export const createMerchantFintechAccount = (formData) => AuthApi().post('/fintech-accounts/merchant/account/create', formData); // (Msvs => Done)
export const updateMyShopAccountBankDetails = (shopFormData) =>
	AuthApi().put(`/api/myshop/update-account-details`, shopFormData);

export const transferToWalletEndpoint = (productFormData) =>
	AuthApi().post('/api/myshop/transfer-funds-to-wallet', productFormData);

export const withdrawFromMyShopNow = (productFormData) =>
	AuthApi().post('/api/myshop/place-myshop-withdrawal', productFormData);

// {===============================user shop transferlogs handling starts=======================================}

// {===============================user shop transferlogs handling ends=======================================}
export const getMyShopTransactionsLogs = () => AuthApi().get('/api/myshop/get-myshop-transfertransactions');

// {===============================shop orders handling starts=======================================}
// user order Items Routes
export const GetShopOrderItems = () => AuthApi().get(`/api/myshop/get-my-orders`); // newDashboard

export const myShopOrderByShopId = (id) => AuthApi().get(`/api/myshop/find-one-order/${id}`); // newDashboard

export const GetShopItemsInOrders = (params) => {
	const queryString = params ? qs.stringify(params, { arrayFormat: 'repeat' }) : '';
	return AuthApi().get(`/merchant-orders/orderitems${queryString ? `?${queryString}` : ''}`);
}; // newDashboard // (Msvs => Done)

export const myShopItemsInOrdersByShopId = (id) => {
	// console.log('ID_TO_FIND1', id)

	return AuthApi().get(`/merchant-orders/order-item/${id}/view`); // newDashboard (Msvs => Done)
};
export const MyShopCashOutOrderByOrderIdShopId = (id) => AuthApi().post(`/api/myshop/cashout-order/${id}`);

export const MyShopCashOutOrderItemsByOrderItemsIdShopId = (id) => {
	console.log('CASHOUT_ORDER_ITEM_ID', id);
	// return
	return AuthApi().put(`/merchant-orders/order-item/${id}/cashout`); // newDashboard (Msvs => Done)
};

/** **Sealed-Orders */
export const GetShopSealedOrderItems = (params) => {
	const queryString = params ? qs.stringify(params, { arrayFormat: 'repeat' }) : '';
	return AuthApi().get(`/merchant-orders/sealed-orderitems${queryString ? `?${queryString}` : ''}`);
}; // (Msvs => Done)

/** ****HAndle SHop Point of Sale Activities below  myshop/create-invoiceorder */
export const GetShopPointOfSalesItems = () => AuthApi().get(`/api/myshop/get-sealed-invoiceorder`); // newDashboard
export const CreateShopPointOfSales = (invoiceFormData) =>
	AuthApi().post(`/api/myshop/create-invoiceorder`, invoiceFormData); // newDashboard

/**
 *
 * @returns HANDLE SHOP_PLANS
 */
// SHopPlans Routes
export const getShopPlans = () => Api().get('/merchant-plans'); // done //(Mcsvs => Done)
export const getShopPlanById = (id) => Api().get(`/merchant-plans/${id}/view`); // done //done //(Mcsvs => )

// {===============================shop orders handling ends =======================================}
// export const createProduct = (productFormData) =>
//   AuthApi().post('/usersproducts', productFormData);

/** **
 *
 * HANDLE MERCHANT UNBOADING STARTS
 */
// export const newShopSignup = (formData) =>
//   Api().post("/api/pre-shop-signup", formData);
export const newShopSignupWithOtp = (formData) => {
	// Extract referral params from formData
	const { referralParams, ...dataToSend } = formData;

	// Build query string if referral params exist
	let url = '/auth-merchant/register-merchant';

	if (referralParams && Object.keys(referralParams).length > 0) {
		const queryString = qs.stringify(referralParams, { arrayFormat: 'repeat' });
		url = `${url}?${queryString}`;
	}

	return Api().post(url, dataToSend);
}; // (Mcsvs => Done)
// export const getAfPostById = (id) => Api().get(`/posts/${id}`);
// export const storePreShopUserData = (formData) =>
//   Api().post("/api/register-preshop-user", formData);
export const storePreShopUserDataWithOtp = (formData) => Api().post('/auth-merchant/activate-merchant', formData); // (Mcsvs => Done)

/** **
 *
 * HANDLE MERCHANT UNBOADING ENDS
 */

/** *
 * #############################################################################################
 * HANDLE SHOP ESTATE PRPERTIES STARTS HERE
 * ############################################################################################
 */
// {===============================shop estate property handling starts=======================================}
export const getShopEstateProperties = () => AuthApi().get('/properties/get-merchant-properties'); // (newDashboard) //(Msvs => Done)

export const storeShopEstateProperty = (formData) => AuthApi().post('/properties/merchant-property/create', formData);

export const getMyShopEstatePropertyBySlug = (slug) => AuthApi().get(`/properties/merchant-property/${slug}/view`);

export const updateMyShopEstatePropertyById = (productFormData) =>
	AuthApi().put(`/properties/merchant-property/${productFormData?.id}/update`, productFormData);
export const deleteShopEstateProperty = (id) => AuthApi().delete(`/myshop/delete-estateproperty/${id}`);
// {===============================shop estate handling ends   =======================================}
/** *
 * #############################################################################################
 * HANDLE SHOP ESTATE PRPERTIES ENDS HERE
 * ############################################################################################
 */

/** *
 * #############################################################################################
 * HANDLE SHOP HOMES, HOTELS and APARTMENT BOOKINGS STARTS HERE
 * ############################################################################################
 */
// {===============================shop estate property handling starts=======================================}
export const getShopBookingsProperties = (params) => {
	const queryString = params ? qs.stringify(params, { arrayFormat: 'repeat' }) : '';
	return AuthApi().get(`/bookings/get-merchant-bookings${queryString ? `?${queryString}` : ''}`);
}; // (Msvs => Done)

export const storeShopBookingsProperty = (formData) => AuthApi().post('/bookings/create-listing', formData); // (Msvs => done)

export const getMyShopBookingsPropertyBySlug = (id) => AuthApi().get(`/bookings/merchant-listing/${id}/view`); // (Msvs => done)

export const updateMyShopBookingsPropertyById = (productFormData) => {
	const { id, ...rest } = productFormData;
	return AuthApi().put(`/bookings/merchant-listing/${id}/update`, rest);
}; // (Msvs => done)

export const deleteShopBookingsProperty = (id) => AuthApi().delete(`/myshop/delete-bookingproperty/${id}`);

export const deleteMerchantBookingListing = (id) => AuthApi().delete(`/bookings/merchant-listing/${id}/delete`);

/** *Manage rooms
 * of prperties */
export const getBookingsPropertyRoomsById = (propertyId) => {
	console.log('In Route TABLE', propertyId);
	return AuthApi().get(`/bookings/property-rooms/${propertyId}/view`); // (Msvs => done)
};

export const getSingleRoomOfProperty = (roomId) => {
	return AuthApi().get(`/bookings/${roomId}/get-room`); // (Msvs => done)
};

export const createRoomOnProperty = (formData) => AuthApi().post('/bookings/create-room', formData); // (Msvs => done)

export const updateRoomOnProperty = (productFormData) => {
	return AuthApi().put(`/bookings/${productFormData?.id}/update-room`, productFormData); // (Msvs => done)
}; // (Msvs => Done)

export const updateRoomImageOnProperty = ({ roomId, updateData }) => {
	return AuthApi().put(`/bookings/${roomId}/update-room-image`, updateData); // (Msvs => done)
};

export const deleteSingleRoomImage = ({ roomImageId, deleteData }) => {
	return AuthApi().delete(`/bookings/${roomImageId}/delete-room-image`, { data: deleteData }); // (Msvs => done)
};

export const deleteRoomOnProperty = (roomId) => {
	return AuthApi().delete(`/bookings/${roomId}/delete-room`); // (Msvs => done)
};

/** *Property Listing Images Management */
export const updatePropertyListingImage = ({ propertyId, updateData }) => {
	console.log('updatePropertyListingImage API - propertyId:', propertyId);
	console.log('updatePropertyListingImage API - updateData:', updateData);
	console.log(
		'updatePropertyListingImage API - Full URL:',
		`/bookings/property-listing/${propertyId}/update-listing-image`
	);
	return AuthApi().put(`/bookings/property-listing/${propertyId}/update-listing-image`, updateData); // (Msvs => done)
};

export const deletePropertyListingImage = ({ propertyId, deleteData }) => {
	return AuthApi().delete(`/bookings/property-listing/${propertyId}/delete-listing-image`, { data: deleteData }); // (Msvs => done)
};

/** **Reservations */ // reservations/get-merchant-reservations on-property/:propertyId/get-reservations
export const getShopBookingsReservationsApi = (params) => {
	const queryString = params ? qs.stringify(params, { arrayFormat: 'repeat' }) : '';
	return AuthApi().get(`/reservations/get-merchant-reservations${queryString ? `?${queryString}` : ''}`);
}; // newDashboard (Msvs => Done)
export const getShopSealedBookingsReservationsApi = () =>
	AuthApi().get('/reservations/get-merchant-sealed-reservations'); // newDashboard //(Msvs : => :done)
export const getSingleMerchantReservationApi = (reservationId) =>
	AuthApi().get(`/reservations/merchant-reservation/${reservationId}/view`); // (Msvs : => :done)
export const getReservationsOnPropertyApi = (propertyId) =>
	AuthApi().get(`/reservations/on-prop/${propertyId}/get-reservations`); // (Msvs : => :done)

export const merchantCheckInGuestReservations = (payload) => {
	const { reservationId, checkInCode } = payload;
	return AuthApi().put(`/reservations/merchant-handle-reservation/${reservationId}/check-in-guest`, {
		checkInCode
	});
}; // (Msvs : => :done)

export const merchantCheckOutGuestReservations = (payload) => {
	const { reservationId, checkOutCode } = payload;
	return AuthApi().put(`/reservations/merchant-handle-reservation/${reservationId}/check-out-guest`, {
		checkOutCode
	});
};
export const merchantCashOutReservationEarning = (id) => {
	return AuthApi().put(`/reservations/merchant-handle-reservation/${id}/cashout-reservation-earning`);
};
// {===============================shop b=homes handling ends   =======================================}
/** *merchant-handle-reservation/:reservationId/cashout-reservation-earning
 * #############################################################################################
 * HANDLE SHOP HOMES, HOTELS and APARTMENT BOOKINGS ENDS HERE
 * ############################################################################################
 */

/** *
 * #############################################################################################
 * HANDLE SHOP FOOD MART STARTS HERE
 * ############################################################################################
 */
// {===============================shop estate property handling starts=======================================}
export const getShopFoodMarts = () => AuthApi().get('/rcs/get-merchant-rcs'); // newDashboard //(Msvs => Done)

export const storeShopFoodMart = (formData) => AuthApi().post('/rcs/merchant-rcs/create', formData); // (Msvs => Done)

export const getMyShopFoodMartBySlug = (slug) => AuthApi().get(`/rcs/merchant-rcs/${slug}/view`); // (Msvs => Done)

export const updateMyShopFoodMartById = (productFormData) => {
	console.log('updateMyShopFoodMartById_PAYLOAD', productFormData);
	return AuthApi().put(`/rcs/merchant-rcs/${productFormData?.id}/update`, productFormData);
}; // (Msvs => Done)

export const deleteShopFoodMart = (id) => AuthApi().delete(`/myshop/delete-foodmart/${id}`);
// {===============================shop estate handling ends   =======================================}
/** *
 * #############################################################################################
 * HANDLE SHOP FOOD MART ENDS HERE
 * ############################################################################################
 */

/** *
 * #############################################################################################
 * HANDLE SHOP FOOD MART-MENUS ITEMS STARTS HERE
 * ############################################################################################
 */
// {===============================shop estate property handling starts /myshop/food-mart/get-my-menu/:foodMartId=======================================}
export const getAllMerchantOwnedMartMenus = () => AuthApi().get(`/api/myshop/food-mart/get-all-merchant-menu`); // newDashboard
export const getShopFoodMartMenus = (foodMartId) => AuthApi().get(`/rcs-menu/${foodMartId}/get-merchant-menu`); // newDashboard //(Mcsvs => Done)

export const getMyShopFoodMartMenuBySlug = (slug) => AuthApi().get(`/myshop/foodmart-menu/${slug}`);

export const storeShopFoodMartMenu = (formData) => {
	/// ${formData?.martId}
	return AuthApi().post(`/rcs-menu/merchant-menu/create`, formData);
}; // (Mcsvs => Done)

/** **
 * Merchant Handling of Food Orders
 * */
export const getMerchantFoodOrdersApi = () => AuthApi().get('/api/myshop/food-mart/get-merchant-foodorders'); // newDashboard

export const merchantGetFoodOrderByIdApi = (id) => AuthApi().get(`/api/myshop/food-mart/get-foodorder/${id}`);
export const merchantGetFoodOrderItemsInFoodOrderById = (id) =>
	AuthApi().get(`/api/myshop/food-mart/get-foodorderitems/${id}`);

export const merchantDeleteFoodOrders = (id) => AuthApi().delete(`/api/myshop/food-mart/deleteorder/${id}`);
export const merchantPackFoodOrders = (id) => AuthApi().put(`/api/myshop/food-mart/pack-unpack/${id}`);
export const merchantShipFoodOrders = (id) => AuthApi().put(`/api/myshop/food-mart/ship-unship/${id}`);
export const merchantDeliverFoodOrdersApi = (id) => AuthApi().put(`/api/myshop/food-mart/deliver-undeliver/${id}`);
/** *
 * #############################################################################################
 * HANDLE SHOP FOOD  MART-MENUS ITEMS ENDS HERE
 * ############################################################################################
 */

/** *
 * #############################################################################################
 * HANDLE MERCHANT TRANSACTIONS ANALYTICS STARTS HERE
 * ############################################################################################
 */
export const getMerchantTransactions = (params) => {
	const queryString = params ? qs.stringify(params, { arrayFormat: 'repeat' }) : '';
	return AuthApi().get(`/trade-transactions/merchant/transactions${queryString ? `?${queryString}` : ''}`);
}; // (Msvs => Transaction Analytics)

export const getMerchantTransactionSummary = () =>
	AuthApi().get('/trade-transactions/merchant/summary'); // (Msvs => Transaction Summary)

/** *
 * #############################################################################################
 * HANDLE MERCHANT TRANSACTIONS ANALYTICS ENDS HERE
 * ############################################################################################
 */

/** *
 * #############################################################################################
 * HANDLE USER AUTHENTICATED SESSION STARTS HERE
 * ############################################################################################
 */
// Shop Users Logout functionality  usersproducts
export const MyShopLogOutSession = () => AuthApi().post(`/shop/logout`);
export const logOut = () => {
	if (typeof window !== 'undefined') {
		// remove logged in user's cookie and redirect to login page 'authUserCookie', state.user, 60 * 24
		// try {
		// AuthApi();
		MyShopLogOutSession()
			.then((response) => {
				console.log('logged out successfully', response);

				Cookies.remove('_auth');
				Cookies.remove('_auth_storage');
				Cookies.remove('_auth_state');
				Cookies.remove('AMD_AFSP_Show_Hide_tmp_Lead_ARC');
				Cookies.remove('SLG_GWPT_Show_Hide_tmp');

				window.location.reload();
			})
			.catch((error) => {
				console.log(
					error.response && error.response.data.message ? error.response.data.message : error.message
				);
			});
	}
};

export const merchantLogOutCall = () => {
	if (typeof window !== 'undefined') {
		// Cookies.set(
		//   'AMD_AFSP_Show_Hide_tmp_Lead_ARC',
		//   JSON.stringify(response?._nnip_shop_ASHP_ALOG),
		//   '1h'
		// );

		try {
			/** Fuse admin starts */
			resetSessionForShopUsers();

			Cookies.remove('jwt_auth_credentials');
			/** *Fuse admin ends */

			Cookies.remove('authUserInfo');
			Cookies.remove('isloggedin');
			Cookies.remove('_auth');
			Cookies.remove('_auth_state');
			Cookies.remove('_auth_type');
			Cookies.remove('_auth_storage');
			Cookies.remove('_ga');
			Cookies.remove('_ga_WJH9CH067R');
			Cookies.remove('SLG_G_WPT_TO');
			Cookies.remove('ADMIN_AFSP_Show_Hide_tmp_Lead');
			Cookies.remove('ADMIN_AFSP_Show_Hide_tmp_Lead_ARC');

			localStorage.removeItem('jwt_auth_credentials');
			localStorage.clear();

			// Cookies.set(
			//   'ADMIN_AFSP_Show_Hide_tmp_Lead',
			//   JSON.stringify(response?.data?.accessToken),
			//   '1h'
			// );

			// window.location.reload(false);
		} catch (error) {
			console.log(error);
		}
	}
};
