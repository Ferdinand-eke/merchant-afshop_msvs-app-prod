import { motion } from "framer-motion";
import SummaryWidget from "./widgets/SummaryWidget";
import OverdueWidget from "./widgets/OverdueWidget";
import IssuesWidget from "./widgets/IssuesWidget";
import FeaturesWidget from "./widgets/FeaturesWidget";
import GithubIssuesWidget from "./widgets/GithubIssuesWidget";
import TaskDistributionWidget from "./widgets/TaskDistributionWidget";
import ScheduleWidget from "./widgets/ScheduleWidget";
import useGetMyShopDetails, { useGetMyShopAndPlan } from "app/configs/data/server-calls/shopdetails/useShopDetails";
import HotelsHospitalityBoard from "./hotels-boards/HotelsHospitalityBoard";
import EcommerceBoard from "./ecom-boards/EcommerceBoard";
import FoodmartBoard from "./foodmart-boards/FoodmartBoard";

/**
 * The HomeTab component.
 */

function HomeTab() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // const { data: shopData, isLoading, isError } = useGetMyShopDetails();
    const { data: shopData, isLoading } = useGetMyShopAndPlan();
  
    console.log("MerchantPROFILE", shopData?.data)
  

//   const fistFiveOrders = shopData?.data?.orderItems?.slice(0, 4);


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
            isLoading={isLoading}
            layout="vertical"
          />
        </>
      )}

      {shopData?.data?.merchant?.merchantShopplan?.plankey === "WHOLESALEANDRETAILERS" && (
        <>
        {/* <p> WHOLE SALE</p> */}
          {/* Change this to wholesale specific dashboard later on */}
          <EcommerceBoard
            merchantData={shopData?.data?.merchant}
            isLoading={isLoading}
            layout="vertical"
          />
        </>
      )}

      {shopData?.data?.merchant?.merchantShopplan?.plankey === "MANUFACTURERS" && (
        <>
          {/* Change this to manufacturer specific dashboard later on */}
          <EcommerceBoard
            merchantData={shopData?.data?.merchant}
            isLoading={isLoading}
            layout="vertical"
          />
        </>
      )}

      {shopData?.data?.merchant?.merchantShopplan?.plankey === "HOTELSANDAPARTMENTS" && (
        <>
          <HotelsHospitalityBoard
            merchantData={shopData?.data?.merchant}
            isLoading={isLoading}
            layout="vertical"
          />
        </>
      )}



      {shopData?.data?.merchant?.merchantShopplan?.plankey === "FOODVENDORS" && (
        <>
          <FoodmartBoard
            merchantData={shopData?.data?.merchant}
            isLoading={isLoading}
            layout="vertical"
          />
        </>
      )}
    </motion.div>
  );
}

export default HomeTab;
