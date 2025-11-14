import { Outlet } from 'react-router-dom';

/**
 * The E-Commerce app. RETAIL WHOLESALEANDRETAILERS  MANUFACTURERS
 *
 * WHOLESALEANDRETAILERS
 */
function ShopProductsApp() {
	// const {data:myshopData, isLoading} = useGetMyShopAndPlan()
	// console.log("THIS-SHOP-PLAN-KEY", myshopData?.data?.shopplan?.plankey)
	// if(myshopData?.data?.shopplan?.plankey !== 'RETAIL'
	// 	|| myshopData?.data?.shopplan?.plankey !== 'WHOLESALEANDRETAILERS'
	// 	|| myshopData?.data?.shopplan?.plankey !== 'MANUFACTURERS'
	// ){
	// 	return <Navigate to={`/shop-dashboard`} />
	// }

	return <Outlet />;
}

export default ShopProductsApp;
