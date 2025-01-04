import { motion } from 'framer-motion';
import SummaryWidget from './widgets/SummaryWidget';
import OverdueWidget from './widgets/OverdueWidget';
import IssuesWidget from './widgets/IssuesWidget';
import FeaturesWidget from './widgets/FeaturesWidget';
import GithubIssuesWidget from './widgets/GithubIssuesWidget';
import TaskDistributionWidget from './widgets/TaskDistributionWidget';
import ScheduleWidget from './widgets/ScheduleWidget';
import useGetMyShopDetails from 'app/configs/data/server-calls/shopdetails/useShopDetails';

/**
 * The HomeTab component.
 */
function HomeTab() {
	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const { data:shopData, isLoading, isError } = useGetMyShopDetails();
	const fistFiveOrders = shopData?.data?.orderItems?.slice(0, 4);


	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<motion.div variants={item}>
				<SummaryWidget shopData={shopData?.data?.data} isLoading={isLoading}/>
			</motion.div>
			<motion.div variants={item}>
				<OverdueWidget merchantProducts={shopData?.data?.products} isLoading={isLoading}/>
			</motion.div>
			<motion.div variants={item} >
				<IssuesWidget orderItems={shopData?.data?.orderItems} isLoading={isLoading} />
			</motion.div>
			<motion.div variants={item}>
				<FeaturesWidget sealedOrderItems={shopData?.data?.sealedOrderItems} isLoading={isLoading} />
			</motion.div>
		
			<motion.div
				variants={item}
				className="sm:col-span-2 md:col-span-4"
			>
				<GithubIssuesWidget />
			</motion.div>
			<motion.div
				variants={item}
				className="sm:col-span-2 md:col-span-4 lg:col-span-2"
			>
				<TaskDistributionWidget />
			</motion.div>
			<motion.div
				variants={item}
				className="sm:col-span-2 md:col-span-4 lg:col-span-2"
			>
				<ScheduleWidget />
			</motion.div>
		</motion.div>
	);
}


export default HomeTab;
