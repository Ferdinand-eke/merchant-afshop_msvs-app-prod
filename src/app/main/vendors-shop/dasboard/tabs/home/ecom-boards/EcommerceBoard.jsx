import { motion } from "framer-motion";
import SummaryWidget from "./ecoom-widgets/SummaryWidget";
import OverdueWidget from "./ecoom-widgets/OverdueWidget";
import IssuesWidget from "./ecoom-widgets/IssuesWidget";
import FeaturesWidget from "./ecoom-widgets/FeaturesWidget";
import GithubIssuesWidget from "./ecoom-widgets/GithubIssuesWidget";
import TaskDistributionWidget from "./ecoom-widgets/TaskDistributionWidget";
import ScheduleWidget from "./ecoom-widgets/ScheduleWidget";
import { Typography } from "@mui/material";
import FuseLoading from "@fuse/core/FuseLoading";

const EcommerceBoard = (props) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const { merchantData, isLoading } = props;

  if (isLoading) {
		return <FuseLoading />;
	}
  return (
    <>
      <motion.div variants={item}>
        <SummaryWidget shopData={merchantData?.data} isLoading={isLoading} />
      </motion.div>
      <motion.div variants={item}>
        <OverdueWidget
          merchantProducts={merchantData?.products}
          isLoading={isLoading}
        />
      </motion.div>
      <motion.div variants={item}>
        <IssuesWidget
          orderItems={merchantData?.orderItems}
          isLoading={isLoading}
        />
      </motion.div>
      <motion.div variants={item}>
        <FeaturesWidget
          sealedOrderItems={merchantData?.sealedOrderItems}
          isLoading={isLoading}
        />
      </motion.div>

      <>
        <motion.div variants={item} className="sm:col-span-2 md:col-span-4">
          <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
            Analytics coming soon!
          </Typography>
          {/* <GithubIssuesWidget /> */}
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
  );
};

export default EcommerceBoard;
