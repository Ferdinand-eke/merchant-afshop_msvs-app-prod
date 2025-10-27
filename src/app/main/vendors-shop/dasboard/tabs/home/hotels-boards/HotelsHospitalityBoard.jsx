import { motion } from "framer-motion";
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

  // console.log("RESRVATIONS", reservations?.data)

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const { merchantData, isLoading } = props;
  return (
    <>
      <motion.div variants={item}>
        <SummaryWidget hosMerchantData={merchantData} isLoading={isLoading} />
      </motion.div>

      <motion.div variants={item}>
        <IssuesWidget reservationsCount={reservations?.data?.count} />
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
