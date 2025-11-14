import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import SummaryAccountWidget from './foodmart-widgets/SummaryAccountWidget';
import MenuCountWidget from './foodmart-widgets/MenuCountWidget';
import FoodOrdersCountWidget from './foodmart-widgets/FoodOrdersCountWidget';
import SealedOrdersCountWidget from './foodmart-widgets/SealedOrdersCountWidget';

function FoodmartBoard(props) {
	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const { merchantData, isLoading } = props;
	return (
		<>
			<motion.div variants={item}>
				<SummaryAccountWidget
					shopData={merchantData?.data}
					isLoading={isLoading}
				/>
			</motion.div>
			<motion.div variants={item}>
				<MenuCountWidget />
			</motion.div>
			<motion.div variants={item}>
				<FoodOrdersCountWidget />
			</motion.div>
			<motion.div variants={item}>
				<SealedOrdersCountWidget />
			</motion.div>

			<>
				<motion.div
					variants={item}
					className="sm:col-span-2 md:col-span-4"
				>
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
}

export default FoodmartBoard;
