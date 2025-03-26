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

  return <Outlet />;
}

export default ECommerceApp;
