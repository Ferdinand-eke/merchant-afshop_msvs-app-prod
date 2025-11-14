import { Outlet } from 'react-router-dom';

/**
 * The E-Commerce app.
 */
function ManagedFoodMartApp() {
	// const {data:myshopData, isLoading} = useGetMyShopAndPlan()
	// if(myshopData?.data?.shopplan?.plankey !== 'HOTELSANDAPARTMENTS'){
	// 	return <Navigate to={`/shop-dashboard`} />
	// }

	return <Outlet />;
}

export default ManagedFoodMartApp;
