import { motion } from 'framer-motion';
import { Typography, Box, Paper, Button, Skeleton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import SummaryWidget from './ecoom-widgets/SummaryWidget';
import OverdueWidget from './ecoom-widgets/OverdueWidget';
import IssuesWidget from './ecoom-widgets/IssuesWidget';
import FeaturesWidget from './ecoom-widgets/FeaturesWidget';

function EcommerceBoard(props) {
	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const {
		merchantData,
		ordersCount,
		sealedOrdersCount,
		productsCount,
		isShopLoading,
		isOrdersLoading,
		isProductsLoading,
		isSealedOrdersLoading
	} = props;

	// Show individual loading skeletons for each widget
	const renderWidgetSkeleton = () => (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden p-16">
			<Box className="flex items-center justify-between mb-16">
				<Skeleton
					variant="circular"
					width={40}
					height={40}
				/>
				<Skeleton
					variant="circular"
					width={24}
					height={24}
				/>
			</Box>
			<Skeleton
				variant="text"
				width="60%"
				height={32}
				className="mx-auto"
			/>
			<Skeleton
				variant="text"
				width="80%"
				height={48}
				className="mx-auto mt-8"
			/>
			<Box className="mt-16">
				<Skeleton
					variant="rectangular"
					width="100%"
					height={36}
					className="rounded-lg"
				/>
			</Box>
		</Paper>
	);

	return (
		<>
			{/* Widget Cards */}
			<motion.div variants={item}>
				{isShopLoading ? (
					renderWidgetSkeleton()
				) : (
					<SummaryWidget
						shopData={merchantData}
						isLoading={isShopLoading}
					/>
				)}
			</motion.div>

			<motion.div variants={item}>
				{isProductsLoading ? (
					renderWidgetSkeleton()
				) : (
					<OverdueWidget
						productsCount={productsCount}
						isLoading={isProductsLoading}
					/>
				)}
			</motion.div>

			<motion.div variants={item}>
				{isOrdersLoading ? (
					renderWidgetSkeleton()
				) : (
					<IssuesWidget
						ordersCount={ordersCount}
						isLoading={isOrdersLoading}
					/>
				)}
			</motion.div>

			<motion.div variants={item}>
				{isSealedOrdersLoading ? (
					renderWidgetSkeleton()
				) : (
					<FeaturesWidget
						sealedOrdersCount={sealedOrdersCount}
						isLoading={isSealedOrdersLoading}
					/>
				)}
			</motion.div>

			{/* Analytics Section */}
			<motion.div
				variants={item}
				className="sm:col-span-2 md:col-span-4"
			>
				<Paper
					className="relative overflow-hidden rounded-2xl shadow-lg p-32 sm:p-48"
					sx={{
						background: 'linear-gradient(135deg, #f5f5f4 0%, #fef3e2 100%)'
					}}
				>
					<Box className="text-center">
						<Box className="flex justify-center mb-16">
							<Box
								className="flex items-center justify-center w-80 h-80 rounded-full"
								sx={{
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={40}
								>
									heroicons-outline:chart-bar
								</FuseSvgIcon>
							</Box>
						</Box>

						<Typography
							variant="h5"
							className="font-bold mb-8"
						>
							Advanced Analytics Coming Soon
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary"
							className="mb-24 max-w-md mx-auto"
						>
							Get deeper insights into your sales trends, customer behavior, and inventory performance
							with our upcoming analytics dashboard.
						</Typography>

						<Box className="flex flex-wrap justify-center gap-12">
							<Box className="flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-xl px-16 py-8">
								<FuseSvgIcon
									className="text-orange-600"
									size={20}
								>
									heroicons-outline:trending-up
								</FuseSvgIcon>
								<Typography
									variant="caption"
									className="font-medium"
								>
									Sales Trends
								</Typography>
							</Box>

							<Box className="flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-xl px-16 py-8">
								<FuseSvgIcon
									className="text-orange-600"
									size={20}
								>
									heroicons-outline:users
								</FuseSvgIcon>
								<Typography
									variant="caption"
									className="font-medium"
								>
									Customer Insights
								</Typography>
							</Box>

							<Box className="flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-xl px-16 py-8">
								<FuseSvgIcon
									className="text-orange-600"
									size={20}
								>
									heroicons-outline:chart-pie
								</FuseSvgIcon>
								<Typography
									variant="caption"
									className="font-medium"
								>
									Revenue Breakdown
								</Typography>
							</Box>

							<Box className="flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-xl px-16 py-8">
								<FuseSvgIcon
									className="text-orange-600"
									size={20}
								>
									heroicons-outline:clock
								</FuseSvgIcon>
								<Typography
									variant="caption"
									className="font-medium"
								>
									Real-time Data
								</Typography>
							</Box>
						</Box>

						<Button
							variant="contained"
							color="primary"
							size="large"
							className="mt-24"
							disabled
							sx={{
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								'&:hover': {
									background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
								}
							}}
						>
							Notify Me When Available
						</Button>
					</Box>

					{/* Decorative elements */}
					<Box
						sx={{
							position: 'absolute',
							top: -50,
							right: -50,
							width: 200,
							height: 200,
							borderRadius: '50%',
							background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)'
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							bottom: -50,
							left: -50,
							width: 200,
							height: 200,
							borderRadius: '50%',
							background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, transparent 70%)'
						}}
					/>
				</Paper>
			</motion.div>
		</>
	);
}

export default EcommerceBoard;
