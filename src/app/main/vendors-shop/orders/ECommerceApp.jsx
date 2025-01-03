import { useGetMyShopAndPlan } from "app/configs/data/server-calls/shopdetails/useShopDetails";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
const RETAIL_KEY = import.meta.env.VITE_AFS_RETAIL;
const WHOLESALE_KEY = import.meta.env.VITE_AFS_WHOLESALERETAIL;
const MANUFACTURER_KEY = import.meta.env.VITE_AFS_MANUFACTURERS;

/**
 * The E-Commerce app.
 */
function ECommerceApp() {
//   const { data: myshopData, isLoading } = useGetMyShopAndPlan();
//   const navigate = useNavigate();


//   useEffect(() => {
//     if (isLoading) {
//       return null;
//     } else {
//       if (

// 		myshopData?.data?.shopplan?.plankey.toString() !== RETAIL_KEY ||
//         myshopData?.data?.shopplan?.plankey.toString() !== WHOLESALE_KEY ||
//         myshopData?.data?.shopplan?.plankey.toString() !== MANUFACTURER_KEY
//       ) {
//         // navigate("/");
//       }
//     }
//   }, [
//     myshopData?.data?.shopplan?.plankey,
//     RETAIL_KEY,
//     WHOLESALE_KEY,
//     MANUFACTURER_KEY,

//     navigate,
//   ]);

  return <Outlet />;
}

export default ECommerceApp;
