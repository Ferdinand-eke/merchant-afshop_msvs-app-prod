import { Box, Paper, Skeleton, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { memo } from 'react';

/**
 * Pulse animation for skeleton items
 */
const pulseAnimation = {
	initial: { opacity: 0.6 },
	animate: {
		opacity: [0.6, 1, 0.6],
		transition: {
			duration: 1.5,
			repeat: Infinity,
			ease: 'easeInOut'
		}
	}
};

/**
 * Shimmer effect component
 */
function ShimmerEffect() {
	const theme = useTheme();

	return (
		<Box
			sx={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflow: 'hidden',
				'&::after': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: '-100%',
					width: '100%',
					height: '100%',
					background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`,
					animation: 'shimmer 2s infinite',
				},
				'@keyframes shimmer': {
					'100%': {
						transform: 'translateX(200%)',
					}
				}
			}}
		/>
	);
}

/**
 * Card Skeleton - General purpose card loading skeleton
 */
export function CardSkeleton({ height = 'auto', variant = 'default' }) {
	const theme = useTheme();

	return (
		<Paper
			className="relative flex flex-col flex-auto p-24 rounded-2xl shadow-lg overflow-hidden"
			sx={{
				background: alpha(theme.palette.background.paper, 0.8),
				border: '1px solid',
				borderColor: 'divider',
				height
			}}
		>
			<ShimmerEffect />

			{variant === 'default' && (
				<motion.div
					variants={pulseAnimation}
					initial="initial"
					animate="animate"
				>
					{/* Header */}
					<Box className="flex items-start gap-16 mb-24">
						<Skeleton
							variant="rounded"
							width={56}
							height={56}
							sx={{ borderRadius: 3 }}
						/>
						<Box className="flex-1">
							<Skeleton
								variant="text"
								width="40%"
								height={28}
							/>
							<Skeleton
								variant="text"
								width="60%"
								height={20}
								sx={{ mt: 1 }}
							/>
						</Box>
					</Box>

					{/* Content */}
					<Box className="mb-24">
						<Skeleton
							variant="text"
							width="70%"
							height={48}
							sx={{ mb: 1 }}
						/>
						<Skeleton
							variant="text"
							width="50%"
							height={20}
						/>
					</Box>

					{/* Additional content */}
					<Box className="mb-24">
						<Skeleton
							variant="rounded"
							height={80}
							sx={{ borderRadius: 2 }}
						/>
					</Box>

					{/* Actions */}
					<Box className="flex gap-12">
						<Skeleton
							variant="rounded"
							height={48}
							sx={{ flex: 1, borderRadius: 2 }}
						/>
						<Skeleton
							variant="rounded"
							width={48}
							height={48}
							sx={{ borderRadius: 2 }}
						/>
					</Box>
				</motion.div>
			)}

			{variant === 'chart' && (
				<motion.div
					variants={pulseAnimation}
					initial="initial"
					animate="animate"
				>
					{/* Header */}
					<Box className="mb-24">
						<Skeleton
							variant="text"
							width="40%"
							height={28}
						/>
						<Skeleton
							variant="text"
							width="60%"
							height={20}
							sx={{ mt: 1 }}
						/>
					</Box>

					{/* Stats */}
					<Box className="flex gap-24 mb-24">
						<Box className="flex-1">
							<Skeleton
								variant="text"
								width="100%"
								height={48}
							/>
							<Skeleton
								variant="text"
								width="80%"
								height={20}
								sx={{ mt: 1 }}
							/>
						</Box>
						<Box className="flex-1">
							<Skeleton
								variant="text"
								width="100%"
								height={48}
							/>
							<Skeleton
								variant="text"
								width="80%"
								height={20}
								sx={{ mt: 1 }}
							/>
						</Box>
					</Box>

					{/* Chart Area */}
					<Skeleton
						variant="rounded"
						height={200}
						sx={{ borderRadius: 2 }}
					/>
				</motion.div>
			)}
		</Paper>
	);
}

/**
 * Statement Widget Skeleton - Specialized for CurrentStatementWidget
 */
export function StatementWidgetSkeleton() {
	const theme = useTheme();

	return (
		<Paper
			className="relative flex flex-col flex-auto p-32 rounded-2xl shadow-lg overflow-hidden"
			sx={{
				background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%)',
				border: '1px solid',
				borderColor: 'divider'
			}}
		>
			<ShimmerEffect />

			<motion.div
				variants={pulseAnimation}
				initial="initial"
				animate="animate"
			>
				{/* Header Section */}
				<Box className="flex items-start justify-between mb-24">
					<Box className="flex items-start gap-16">
						<Skeleton
							variant="rounded"
							width={56}
							height={56}
							sx={{ borderRadius: 3 }}
						/>
						<Box>
							<Skeleton
								variant="text"
								width={160}
								height={28}
							/>
							<Skeleton
								variant="text"
								width={140}
								height={20}
								sx={{ mt: 1 }}
							/>
						</Box>
					</Box>
					<Skeleton
						variant="circular"
						width={36}
						height={36}
					/>
				</Box>

				{/* Balance Display */}
				<Box className="mb-32">
					<Skeleton
						variant="text"
						width="60%"
						height={64}
						sx={{ mb: 1 }}
					/>
					<Skeleton
						variant="text"
						width="40%"
						height={20}
					/>
				</Box>

				{/* Bank Account Status */}
				<Box className="mb-24">
					<Skeleton
						variant="rounded"
						height={80}
						sx={{ borderRadius: 2 }}
					/>
				</Box>

				{/* Action Buttons */}
				<Box className="flex gap-12">
					<Skeleton
						variant="rounded"
						height={48}
						sx={{ flex: 1, borderRadius: 2 }}
					/>
					<Skeleton
						variant="rounded"
						width={48}
						height={48}
						sx={{ borderRadius: 2 }}
					/>
				</Box>
			</motion.div>

			{/* Background Decoration */}
			<Box
				className="absolute -bottom-24 -right-24 opacity-5"
				sx={{
					width: 200,
					height: 200,
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '50%',
					filter: 'blur(40px)'
				}}
			/>
		</Paper>
	);
}

/**
 * Balance Chart Widget Skeleton - Specialized for AccountBalanceWidget
 */
export function BalanceChartWidgetSkeleton() {
	const theme = useTheme();

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<ShimmerEffect />

			<motion.div
				variants={pulseAnimation}
				initial="initial"
				animate="animate"
				className="flex flex-col p-24 pb-16"
			>
				{/* Header */}
				<Box className="flex items-start justify-between mb-24">
					<Box className="flex-1">
						<Skeleton
							variant="text"
							width="50%"
							height={28}
						/>
						<Skeleton
							variant="text"
							width="70%"
							height={20}
							sx={{ mt: 1 }}
						/>
					</Box>
					<Skeleton
						variant="rounded"
						width={80}
						height={28}
						sx={{ borderRadius: 4 }}
					/>
				</Box>

				{/* Stats Row */}
				<Box className="flex items-start gap-32 mb-24">
					<Box className="flex-1">
						<Skeleton
							variant="text"
							width="90%"
							height={48}
						/>
						<Skeleton
							variant="text"
							width="70%"
							height={20}
							sx={{ mt: 1 }}
						/>
					</Box>
					<Box className="flex-1">
						<Skeleton
							variant="text"
							width="90%"
							height={48}
						/>
						<Skeleton
							variant="text"
							width="70%"
							height={20}
							sx={{ mt: 1 }}
						/>
					</Box>
				</Box>
			</motion.div>

			{/* Chart Area */}
			<Box className="px-24 pb-24">
				<Skeleton
					variant="rounded"
					height={200}
					sx={{ borderRadius: 2 }}
				/>
			</Box>
		</Paper>
	);
}

/**
 * Full Page Dashboard Skeleton - For FinanceDashboardApp
 */
export function DashboardPageSkeleton() {
	return (
		<div className="w-full px-24 md:px-32 pb-24">
			<motion.div
				className="w-full"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-32 w-full mt-32">
					<div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">
						<CardSkeleton />
						<StatementWidgetSkeleton />
					</div>
					<BalanceChartWidgetSkeleton />
				</div>

				<div className="grid grid-cols-1 gap-32 w-full mt-32">
					<CardSkeleton
						variant="chart"
						height={400}
					/>
				</div>
			</motion.div>
		</div>
	);
}

// Export a default loading component
export default memo(CardSkeleton);
