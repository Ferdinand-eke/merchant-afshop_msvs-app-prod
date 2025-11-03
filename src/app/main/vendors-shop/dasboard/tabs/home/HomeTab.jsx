import { motion } from "framer-motion";
import { useState } from "react";
import ContentLoadingPlaceholder from "app/shared-components/ContentLoadingPlaceholder";
import { useGetMyShopAndPlan } from "app/configs/data/server-calls/shopdetails/useShopDetails";
import HotelsHospitalityBoard from "./hotels-boards/HotelsHospitalityBoard";
import EcommerceBoard from "./ecom-boards/EcommerceBoard";
import FoodmartBoard from "./foodmart-boards/FoodmartBoard";
import { useShopItemsInOrders, useShopSealedOrderItems } from "app/configs/data/server-calls/orders/useShopOrders";
import useMyShopProducts from "app/configs/data/server-calls/products/useShopProducts";

/**
 * The HomeTab component.
 */

function HomeTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  // const { data: shopData, isLoading, isError } = useGetMyShopDetails();
  const { data: shopData, isLoading: shopIsLoading } = useGetMyShopAndPlan();
  const { data: shopOrderItems, isLoading: shopOrderItemsIsLoading } = useShopItemsInOrders();
  const { data: myshop_products, isLoading: shopProductsIsLoading } = useMyShopProducts();
  const { data: sealedOrderItems, isLoading: sealedOrdersIsLoading } = useShopSealedOrderItems();

  // Extract counts from pagination responses for efficiency
  const ordersCount = shopOrderItems?.data?.pagination?.total || 0;
  const sealedOrdersCount = sealedOrderItems?.data?.pagination?.total || 0;
  const productsCount = myshop_products?.data?.merchantProducts?.length || 0;

  // Show loading state only when shop data is loading
  if (shopIsLoading) {
    return (
      <ContentLoadingPlaceholder
        title="Loading Your Store..."
        subtitle="Getting your business insights ready"
        cardCount={4}
      />
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
        {shopData?.data?.merchant?.merchantShopplan?.plankey === "RETAIL" && (
        <>
          <EcommerceBoard
            merchantData={shopData?.data?.merchant}
            ordersCount={ordersCount}
            sealedOrdersCount={sealedOrdersCount}
            productsCount={productsCount}
            isShopLoading={shopIsLoading}
            isOrdersLoading={shopOrderItemsIsLoading}
            isProductsLoading={shopProductsIsLoading}
            isSealedOrdersLoading={sealedOrdersIsLoading}
            layout="vertical"
            onPageChange={setPage}
            onLimitChange={setLimit}
            currentPage={page}
            currentLimit={limit}
          />
        </>
      )}

      {shopData?.data?.merchant?.merchantShopplan?.plankey === "WHOLESALEANDRETAILERS" && (
        <>
          <EcommerceBoard
            merchantData={shopData?.data?.merchant}
            ordersCount={ordersCount}
            sealedOrdersCount={sealedOrdersCount}
            productsCount={productsCount}
            isShopLoading={shopIsLoading}
            isOrdersLoading={shopOrderItemsIsLoading}
            isProductsLoading={shopProductsIsLoading}
            isSealedOrdersLoading={sealedOrdersIsLoading}
            layout="vertical"
            onPageChange={setPage}
            onLimitChange={setLimit}
            currentPage={page}
            currentLimit={limit}
          />
        </>
      )}

      {shopData?.data?.merchant?.merchantShopplan?.plankey === "MANUFACTURERS" && (
        <>
          <EcommerceBoard
            merchantData={shopData?.data?.merchant}
            ordersCount={ordersCount}
            sealedOrdersCount={sealedOrdersCount}
            productsCount={productsCount}
            isShopLoading={shopIsLoading}
            isOrdersLoading={shopOrderItemsIsLoading}
            isProductsLoading={shopProductsIsLoading}
            isSealedOrdersLoading={sealedOrdersIsLoading}
            layout="vertical"
            onPageChange={setPage}
            onLimitChange={setLimit}
            currentPage={page}
            currentLimit={limit}
          />
        </>
      )}

      {shopData?.data?.merchant?.merchantShopplan?.plankey === "HOTELSANDAPARTMENTS" && (
        <>
          <HotelsHospitalityBoard
            merchantData={shopData?.data?.merchant}
            isLoading={shopIsLoading}
            layout="vertical"
          />
        </>
      )}



      {shopData?.data?.merchant?.merchantShopplan?.plankey === "FOODVENDORS" && (
        <>
          <FoodmartBoard
            merchantData={shopData?.data?.merchant}
            isLoading={shopIsLoading}
            layout="vertical"
          />
        </>
      )}
    </motion.div>
  );
}

export default HomeTab;
