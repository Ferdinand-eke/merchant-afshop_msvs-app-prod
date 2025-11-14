import { memo, useState } from 'react';
import { Paper, Typography, Box, Chip, Grid, Card, CardContent, Skeleton, LinearProgress, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell
} from 'recharts';
import usePropertyAcquisitions from 'app/configs/data/server-calls/propertyprofile/usePropertyAcquisitions';

/**
 * AcquisitionsTab - Shows property acquisitions with analytics and charts
 */
function AcquisitionsTab() {
	const [limit] = useState(20);
	const [offset] = useState(0);

	const { data: acquisitionsData, isLoading } = usePropertyAcquisitions({
		limit,
		offset
	});

	const acquisitions = acquisitionsData?.data?.acquisitions || [];
	const pagination = acquisitionsData?.pagination || {};

	// Calculate analytics
	const totalAcquisitions = acquisitions.length;
	const totalValue = acquisitions.reduce((sum, acq) => sum + (acq.acquisitionAmount || 0), 0);
	const avgValue = totalAcquisitions > 0 ? totalValue / totalAcquisitions : 0;

	// Status distribution
	const statusCounts = acquisitions.reduce((acc, acq) => {
		const status = acq.status || 'UNKNOWN';
		acc[status] = (acc[status] || 0) + 1;
		return acc;
	}, {});

	// Chart data
	const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
		name,
		value
	}));

	// Timeline data (group by month)
	const timelineData = acquisitions
		.reduce((acc, acq) => {
			const date = new Date(acq.createdAt || acq.acquisitionDate);
			const monthYear = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
			const existing = acc.find((item) => item.month === monthYear);

			if (existing) {
				existing.count += 1;
				existing.value += acq.acquisitionAmount || 0;
			} else {
				acc.push({
					month: monthYear,
					count: 1,
					value: acq.acquisitionAmount || 0
				});
			}

			return acc;
		}, [])
		.sort((a, b) => {
			const dateA = new Date(a.month);
			const dateB = new Date(b.month);
			return dateA - dateB;
		});

	const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	};

	const getStatusColor = (status) => {
		switch (status?.toUpperCase()) {
			case 'COMPLETED':
			case 'ACTIVE':
				return 'success';
			case 'PENDING':
			case 'AGREEMENT_PENDING':
			case 'DOCUMENTS_PENDING':
				return 'warning';
			case 'CANCELLED':
			case 'REJECTED':
				return 'error';
			case 'APPROVED':
			case 'DOCUMENTS_APPROVED':
				return 'info';
			default:
				return 'default';
		}
	};

	if (isLoading) {
		return (
			<Box className="w-full">
				<Grid
					container
					spacing={2}
					className="mb-24"
				>
					{[1, 2, 3].map((i) => (
						<Grid
							item
							xs={12}
							sm={4}
							key={i}
						>
							<Skeleton
								variant="rectangular"
								height={120}
								className="rounded-xl"
							/>
						</Grid>
					))}
				</Grid>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
						md={8}
					>
						<Skeleton
							variant="rectangular"
							height={400}
							className="rounded-xl"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Skeleton
							variant="rectangular"
							height={400}
							className="rounded-xl"
						/>
					</Grid>
				</Grid>
			</Box>
		);
	}

	return (
		<Box className="w-full">
			{/* Stats Section */}
			<Grid
				container
				spacing={2}
				className="mb-24"
			>
				<Grid
					item
					xs={12}
					sm={4}
				>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Total Acquisitions</Typography>
										<Typography className="text-3xl font-bold mt-8">{totalAcquisitions}</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:shopping-bag
										</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid
					item
					xs={12}
					sm={4}
				>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Total Value</Typography>
										<Typography className="text-3xl font-bold mt-8">
											{formatCurrency(totalValue)}
										</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:currency-dollar
										</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid
					item
					xs={12}
					sm={4}
				>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Average Value</Typography>
										<Typography className="text-3xl font-bold mt-8">
											{formatCurrency(avgValue)}
										</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:chart-bar
										</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>
			</Grid>

			{/* Charts Section */}
			<Grid
				container
				spacing={2}
				className="mb-24"
			>
				{/* Growth Chart */}
				<Grid
					item
					xs={12}
					md={8}
				>
					<Paper className="p-20 shadow rounded-xl">
						<Box className="flex items-center justify-between mb-20">
							<Box>
								<Typography className="text-lg font-bold">Acquisition Growth Over Time</Typography>
								<Typography className="text-sm text-gray-500">
									Monthly acquisition value trends
								</Typography>
							</Box>
							<FuseSvgIcon
								className="text-blue-600"
								size={32}
							>
								heroicons-outline:trending-up
							</FuseSvgIcon>
						</Box>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<AreaChart data={timelineData}>
								<defs>
									<linearGradient
										id="colorValue"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor="#3b82f6"
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor="#3b82f6"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip
									formatter={(value) => formatCurrency(value)}
									contentStyle={{ borderRadius: '8px' }}
								/>
								<Area
									type="monotone"
									dataKey="value"
									stroke="#3b82f6"
									fillOpacity={1}
									fill="url(#colorValue)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>

				{/* Status Distribution */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Paper className="p-20 shadow rounded-xl">
						<Box className="flex items-center justify-between mb-20">
							<Box>
								<Typography className="text-lg font-bold">Status Distribution</Typography>
								<Typography className="text-sm text-gray-500">By acquisition status</Typography>
							</Box>
							<FuseSvgIcon
								className="text-purple-600"
								size={32}
							>
								heroicons-outline:chart-pie
							</FuseSvgIcon>
						</Box>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<PieChart>
								<Pie
									data={statusChartData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{statusChartData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</Grid>

			{/* Acquisitions List */}
			<Paper className="p-20 shadow rounded-xl">
				<Box className="flex items-center justify-between mb-20">
					<Box>
						<Typography className="text-lg font-bold">Your Acquisitions</Typography>
						<Typography className="text-sm text-gray-500">
							{totalAcquisitions} acquisition{totalAcquisitions !== 1 ? 's' : ''} found
						</Typography>
					</Box>
					<Button
						variant="outlined"
						startIcon={<FuseSvgIcon>heroicons-outline:arrow-path</FuseSvgIcon>}
						size="small"
					>
						Refresh
					</Button>
				</Box>

				{acquisitions.length === 0 ? (
					<Box className="flex flex-col items-center justify-center py-48 text-center">
						<FuseSvgIcon
							className="text-gray-400"
							size={64}
						>
							heroicons-outline:inbox
						</FuseSvgIcon>
						<Typography className="text-gray-500 mt-16 text-lg">No acquisitions yet</Typography>
						<Typography className="text-gray-400 text-sm mt-8">
							Your property acquisitions will appear here
						</Typography>
					</Box>
				) : (
					<Box className="flex flex-col gap-12">
						{acquisitions.map((acquisition, idx) => (
							<motion.div
								key={acquisition.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: idx * 0.05 }}
							>
								<Paper className="p-16 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
									<Grid
										container
										spacing={2}
										alignItems="center"
									>
										{/* Property Image/Icon */}
										<Grid
											item
											xs={12}
											sm={2}
										>
											<Box className="w-64 h-64 sm:w-full sm:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
												{acquisition.property?.image ? (
													<img
														src={acquisition.property.image}
														alt={acquisition.property?.title}
														className="w-full h-full object-cover"
													/>
												) : (
													<FuseSvgIcon
														className="text-white"
														size={32}
													>
														heroicons-outline:home
													</FuseSvgIcon>
												)}
											</Box>
										</Grid>

										{/* Property Details */}
										<Grid
											item
											xs={12}
											sm={4}
										>
											<Typography className="font-semibold text-base mb-4">
												{acquisition.property?.title || 'Property'}
											</Typography>
											<Typography className="text-sm text-gray-500 mb-8">
												ID: {acquisition.id?.slice(0, 12)}...
											</Typography>
											<Chip
												label={acquisition.status || 'PENDING'}
												color={getStatusColor(acquisition.status)}
												size="small"
											/>
										</Grid>

										{/* Financial Details */}
										<Grid
											item
											xs={12}
											sm={3}
										>
											<Box className="flex flex-col gap-8">
												<Box>
													<Typography className="text-xs text-gray-500">
														Acquisition Amount
													</Typography>
													<Typography className="text-lg font-bold text-green-600">
														{formatCurrency(acquisition.acquisitionAmount || 0)}
													</Typography>
												</Box>
												{acquisition.property?.price && (
													<Box>
														<Typography className="text-xs text-gray-500">
															Original Price
														</Typography>
														<Typography className="text-sm">
															{formatCurrency(acquisition.property.price)}
														</Typography>
													</Box>
												)}
											</Box>
										</Grid>

										{/* Progress/Date */}
										<Grid
											item
											xs={12}
											sm={3}
										>
											<Box className="flex flex-col gap-8">
												<Box>
													<Typography className="text-xs text-gray-500 mb-4">
														Acquisition Date
													</Typography>
													<Typography className="text-sm">
														{new Date(
															acquisition.createdAt || acquisition.acquisitionDate
														).toLocaleDateString('en-US', {
															year: 'numeric',
															month: 'short',
															day: 'numeric'
														})}
													</Typography>
												</Box>
												{acquisition.completionPercentage !== undefined && (
													<Box>
														<Typography className="text-xs text-gray-500 mb-4">
															Progress
														</Typography>
														<Box className="flex items-center gap-8">
															<LinearProgress
																variant="determinate"
																value={acquisition.completionPercentage}
																className="flex-1"
																color="primary"
															/>
															<Typography className="text-xs font-semibold">
																{acquisition.completionPercentage}%
															</Typography>
														</Box>
													</Box>
												)}
												<Button
													size="small"
													variant="outlined"
													fullWidth
													endIcon={
														<FuseSvgIcon size={16}>
															heroicons-outline:arrow-right
														</FuseSvgIcon>
													}
												>
													View Details
												</Button>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</motion.div>
						))}
					</Box>
				)}
			</Paper>
		</Box>
	);
}

export default memo(AcquisitionsTab);
