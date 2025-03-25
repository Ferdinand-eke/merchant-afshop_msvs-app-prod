import { motion } from 'framer-motion';
import SummaryWidget from './hotels-widgets/SummaryWidget';
import OverdueWidget from './hotels-widgets/OverdueWidget';
import IssuesWidget from './hotels-widgets/IssuesWidget';
import FeaturesWidget from './hotels-widgets/FeaturesWidget';
import GithubIssuesWidget from './hotels-widgets/GithubIssuesWidget';
import TaskDistributionWidget from './hotels-widgets/TaskDistributionWidget';
import ScheduleWidget from './hotels-widgets/ScheduleWidget';
import { Typography } from '@mui/material';
import useMyPropertiesReservations from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';



const HotelsHospitalityBoard = (props) => {
  const {data:reservations, isLoading:reserveLoading} = useMyPropertiesReservations()
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

const { merchantData, isLoading} = props
  return (
    <>
    <motion.div variants={item}>
      <SummaryWidget
        shopData={merchantData?.data}
        isLoading={isLoading}
      />
    </motion.div>
   
    <motion.div variants={item}>
      <IssuesWidget
      reservationsData={reservations?.data?.data}
      />
    </motion.div>

  

    <motion.div variants={item}>
      <FeaturesWidget
      />
    </motion.div>

      <motion.div variants={item}>
      <OverdueWidget
      />
    </motion.div>

   <>
   <motion.div variants={item} className="sm:col-span-2 md:col-span-4">
      {/* <GithubIssuesWidget /> */}

      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
            Analytics coming soon!
          </Typography>
    </motion.div>
    {/* <motion.div
      variants={item}
      className="sm:col-span-2 md:col-span-4 lg:col-span-2"
    >
      <TaskDistributionWidget />
    </motion.div> */}
    {/* <motion.div
      variants={item}
      className="sm:col-span-2 md:col-span-4 lg:col-span-2"
    >
      <ScheduleWidget />
    </motion.div> */}
   </>
  </>
  )
}

export default HotelsHospitalityBoard