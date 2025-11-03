import { motion } from "framer-motion";
import { Box, Paper, Skeleton } from "@mui/material";
import SummaryWidget from "./hotels-widgets/SummaryWidget";
import OverdueWidget from "./hotels-widgets/OverdueWidget";
import IssuesWidget from "./hotels-widgets/IssuesWidget";
import FeaturesWidget from "./hotels-widgets/FeaturesWidget";
import ReservationsCalendar from "./hotels-widgets/ReservationsCalendar";
import SocialActivityFeed from "./hotels-widgets/SocialActivityFeed";
import useMyPropertiesReservations from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";

const HotelsHospitalityBoard = (props) => {
  const { data: reservations, isLoading: reserveLoading } =
    useMyPropertiesReservations();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const { merchantData, isLoading } = props;

  // Render loading skeleton for widgets
  const renderWidgetSkeleton = () => (
    <Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-16">
      <Box className="flex items-center justify-between mb-16">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
      <Skeleton variant="text" width="60%" height={32} className="mx-auto" />
      <Skeleton variant="text" width="80%" height={48} className="mx-auto mt-8" />
      <Box className="mt-16">
        <Skeleton variant="rectangular" width="100%" height={36} className="rounded-lg" />
      </Box>
    </Paper>
  );

  return (
    <>
      <motion.div variants={item}>
        {isLoading ? renderWidgetSkeleton() : (
          <SummaryWidget hosMerchantData={merchantData} isLoading={isLoading} />
        )}
      </motion.div>

      <motion.div variants={item}>
        {reserveLoading ? renderWidgetSkeleton() : (
          <IssuesWidget reservationsCount={reservations?.data?.count} />
        )}
      </motion.div>

      <motion.div variants={item}>
        <FeaturesWidget />
      </motion.div>

      <motion.div variants={item}>
        <OverdueWidget />
      </motion.div>

      <>
        {/* Calendar and Activity Feed Section */}
        <motion.div
          variants={item}
          className="sm:col-span-2 md:col-span-4 lg:col-span-3"
        >
          <ReservationsCalendar
            reservations={reservations}
            isLoading={reserveLoading}
          />
        </motion.div>
        <motion.div
          variants={item}
          className="sm:col-span-2 md:col-span-4 lg:col-span-1"
        >
          <SocialActivityFeed merchantData={merchantData} />
        </motion.div>
      </>
    </>
  );
};

export default HotelsHospitalityBoard;
