// import { useGetMyShopAndPlan } from 'app/configs/data/server-calls/shopdet/ails/useShopDetails';
import { Outlet } from 'react-router-dom';

/**
 * The E-Commerce app.
 */
function ManagedBookingListingApp() {
	// const {data:myshopData, isLoading} = useGetMyShopAndPlan()
	// if(myshopData?.data?.shopplan?.plankey !== 'HOTELSANDAPARTMENTS'){
	// 	return <Navigate to={`/shop-dashboard`} />
	// }

	return <Outlet />;
}

export default ManagedBookingListingApp;
