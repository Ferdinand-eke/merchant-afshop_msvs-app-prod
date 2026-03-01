import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useMemo, useState } from 'react';
import { format } from 'date-fns/format';
import {
	Box,
	Button,
	Card,
	Chip,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	alpha,
	useTheme
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
	useGetMerchantTransactions,
	useGetMerchantTransactionSummary
} from 'app/configs/data/server-calls/transactions/useTransactions';
import FuseLoading from '@fuse/core/FuseLoading';

const container = {
	show: {
		transition: {
			staggerChildren: 0.05
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

/**
 * Loan Eligibility Score Component
 * Calculates eligibility based on transaction volume, earnings, and commissions
 */
function LoanEligibilityCard({ summary, isLoading }) {
	const theme = useTheme();

	const eligibilityData = useMemo(() => {
		if (!summary?.data?.summary) return null;



		const data = summary?.data?.summary;
		const totalVolume = data.totalRevenue || 0;
		const totalEarnings = data.totalMerchantPayout || 0;
		const totalCommissions = data.totalCommissions || 0;
		const transactionCount = data.totalTransactions || 0;

		// Calculate eligibility score (0-100)
		// Factors: Volume (40%), Earnings (30%), Commission (20%), Transaction Count (10%)
		const volumeScore = Math.min((totalVolume / 1000000) * 40, 40); // Max at 1M
		const earningsScore = Math.min((totalEarnings / 500000) * 30, 30); // Max at 500K
		const commissionScore = Math.min((totalCommissions / 50000) * 20, 20); // Max at 50K
		const countScore = Math.min((transactionCount / 100) * 10, 10); // Max at 100 transactions

		const score = Math.round(volumeScore + earningsScore + commissionScore + countScore);

		// Determine eligibility tier
		let tier = 'Not Eligible';
		let maxLoanAmount = 0;
		let tierColor = 'error';
		let icon = 'heroicons-outline:x-circle';

		if (score >= 80) {
			tier = 'Premium Eligible';
			maxLoanAmount = totalEarnings * 1.5; // 150% of earnings
			tierColor = 'success';
			icon = 'heroicons-outline:check-badge';
		} else if (score >= 60) {
			tier = 'Standard Eligible';
			maxLoanAmount = totalEarnings * 1.0; // 100% of earnings
			tierColor = 'primary';
			icon = 'heroicons-outline:check-circle';
		} else if (score >= 40) {
			tier = 'Basic Eligible';
			maxLoanAmount = totalEarnings * 0.5; // 50% of earnings
			tierColor = 'warning';
			icon = 'heroicons-outline:exclamation-circle';
		}

		return {
			score,
			tier,
			maxLoanAmount,
			tierColor,
			icon,
			totalVolume,
			totalEarnings,
			totalCommissions,
			transactionCount
		};
	}, [summary]);

	if (isLoading) {
		return (
			<Card
				className="p-24 rounded-2xl"
				sx={{
					background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
					border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
				}}
			>
				<Box className="flex items-center justify-center py-40">
					<CircularProgress />
				</Box>
			</Card>
		);
	}

	if (!eligibilityData) return null;

	return (
		<Card
			className="p-24 rounded-2xl"
			sx={{
				background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
				border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
			}}
		>
			{/* Header */}
			<Box className="flex items-center justify-between mb-24">
				<Box>
					<Typography
						variant="h6"
						className="font-bold mb-4"
					>
						Loan Eligibility Assessment
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Based on your transaction history and earnings
					</Typography>
				</Box>
				<Box
					className="flex items-center justify-center w-56 h-56 rounded-xl"
					sx={{
						background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`
					}}
				>
					<FuseSvgIcon
						className="text-white"
						size={28}
					>
						{eligibilityData.icon}
					</FuseSvgIcon>
				</Box>
			</Box>

			{/* Score Display */}
			<Box className="mb-24">
				<Box className="flex items-center justify-between mb-8">
					<Typography
						variant="body2"
						className="font-semibold"
					>
						Eligibility Score
					</Typography>
					<Typography
						variant="h4"
						className="font-bold"
						color={`${eligibilityData.tierColor}.main`}
					>
						{eligibilityData.score}/100
					</Typography>
				</Box>
				<LinearProgress
					variant="determinate"
					value={eligibilityData.score}
					sx={{
						height: 12,
						borderRadius: 6,
						backgroundColor: alpha(theme.palette.background.default, 0.5),
						'& .MuiLinearProgress-bar': {
							borderRadius: 6,
							background: `linear-gradient(90deg, ${theme.palette[eligibilityData.tierColor].main} 0%, ${theme.palette[eligibilityData.tierColor].light} 100%)`
						}
					}}
				/>
			</Box>

			{/* Tier Badge */}
			<Box className="mb-24">
				<Chip
					label={eligibilityData.tier}
					color={eligibilityData.tierColor}
					size="medium"
					sx={{
						fontWeight: 'bold',
						fontSize: '0.875rem',
						height: 36,
						px: 2
					}}
					icon={
						<FuseSvgIcon size={18}>
							{eligibilityData.icon}
						</FuseSvgIcon>
					}
				/>
			</Box>

			{/* Max Loan Amount */}
			{eligibilityData.maxLoanAmount > 0 && (
				<Box
					className="p-16 rounded-xl mb-24"
					sx={{
						backgroundColor: alpha(theme.palette.success.main, 0.1),
						border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
					}}
				>
					<Typography
						variant="caption"
						color="text.secondary"
						className="block mb-4"
					>
						Maximum Loan Amount
					</Typography>
					<Typography
						variant="h4"
						className="font-bold text-success-600"
					>
						{eligibilityData.maxLoanAmount.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 0
						})}
					</Typography>
				</Box>
			)}

			{/* Key Metrics */}
			<Divider className="mb-16" />
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={6}
				>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Transaction Volume
					</Typography>
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{eligibilityData.totalVolume.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 0
						})}
					</Typography>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Total Earnings
					</Typography>
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{eligibilityData.totalEarnings.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 0
						})}
					</Typography>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Commissions Earned
					</Typography>
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{eligibilityData.totalCommissions.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 0
						})}
					</Typography>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Total Transactions
					</Typography>
					<Typography
						variant="body2"
						className="font-semibold"
					>
						{eligibilityData.transactionCount}
					</Typography>
				</Grid>
			</Grid>

			{/* CTA Button */}
			{eligibilityData.maxLoanAmount > 0 && (
				<>
					<Divider className="my-16" />
					<Button
						variant="contained"
						color="success"
						fullWidth
						size="large"
						startIcon={
							<FuseSvgIcon size={20}>heroicons-outline:currency-dollar</FuseSvgIcon>
						}
						sx={{
							background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
							'&:hover': {
								background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
							}
						}}
					>
						Apply for Loan
					</Button>
				</>
			)}
		</Card>
	);
}

/**
 * Transaction Summary Stats Component
 */
function TransactionSummaryStats({ summary, isLoading }) {

	// console.log("Summary on stats", summary)
	const theme = useTheme();

	if (isLoading) {
		return (
			<Grid
				container
				spacing={2}
			>
				{[1, 2, 3, 4].map((i) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						key={i}
					>
						<Card className="p-16">
							<CircularProgress size={20} />
						</Card>
					</Grid>
				))}
			</Grid>
		);
	}

	const stats = summary?.data?.summary || {};
	// const stats = summary || {};

	// console.log("Stats in summary stats", stats)

	const statCards = [
		{
			title: 'Total Transactions',
			value: stats.totalTransactions || 0,
			format: 'number',
			icon: 'heroicons-outline:chart-bar',
			color: 'primary',
			bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
		},
		{
			title: 'Transaction Volume',
			value: stats.totalRevenue || 0,
			format: 'currency',
			icon: 'heroicons-outline:banknotes',
			color: 'success',
			bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`
		},
		{
			title: 'Total Earnings',
			value: stats.totalMerchantPayout || 0,
			format: 'currency',
			icon: 'heroicons-outline:currency-dollar',
			color: 'secondary',
			bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`
		},
		{
			title: 'Commissions Earned',
			value: stats.totalCommissions || 0,
			format: 'currency',
			icon: 'heroicons-outline:receipt-percent',
			color: 'warning',
			bgGradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`
		}
	];

	return (
		<Grid
			container
			spacing={2}
		>
			{statCards.map((stat, index) => (
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
					key={index}
				>
					<motion.div
						variants={item}
						initial="hidden"
						animate="show"
					>
						<Card
							className="p-16 rounded-xl"
							sx={{
								background: stat.bgGradient,
								border: `1px solid ${alpha(theme.palette[stat.color].main, 0.2)}`
							}}
						>
							<Box className="flex items-start justify-between mb-12">
								<Box
									className="flex items-center justify-center w-40 h-40 rounded-lg"
									sx={{
										backgroundColor: alpha(theme.palette[stat.color].main, 0.15)
									}}
								>
									<FuseSvgIcon
										className={`text-${stat.color}`}
										size={20}
									>
										{stat.icon}
									</FuseSvgIcon>
								</Box>
							</Box>
							<Typography
								variant="caption"
								color="text.secondary"
								className="block mb-4"
							>
								{stat.title}
							</Typography>
							<Typography
								variant="h5"
								className="font-bold"
								color={`${stat.color}.main`}
							>
								{stat.format === 'currency'
									? stat.value.toLocaleString('en-NG', {
											style: 'currency',
											currency: 'NGN',
											minimumFractionDigits: 0
										})
									: stat.value.toLocaleString()}
							</Typography>
						</Card>
					</motion.div>
				</Grid>
			))}
		</Grid>
	);
}

/**
 * Main Transaction Report Widget Component
 */
function TransactionsReportWidget() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const { data: summary, isLoading: summaryLoading } = useGetMerchantTransactionSummary();
	const { data: transactions, isLoading: transactionsLoading } = useGetMerchantTransactions({
		page: page + 1,
		limit: rowsPerPage
	});

	const handleChangePage = (_event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const transactionData = transactions?.data?.transactions || [];
	const totalCount = transactions?.data?.pagination?.total || 0;

	if (summaryLoading && transactionsLoading) {
		return <FuseLoading />;
	}

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="space-y-24"
		>
			{/* Summary Stats */}
			<motion.div variants={item}>
				<TransactionSummaryStats
					summary={summary}
					isLoading={summaryLoading}
				/>
			</motion.div>

			{/* Loan Eligibility Card */}
			<motion.div variants={item}>
				<LoanEligibilityCard
					summary={summary}
					isLoading={summaryLoading}
				/>
			</motion.div>

			{/* Transaction History Table */}
			<motion.div variants={item}>
				<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
					{/* Header */}
					<Box className="flex items-center justify-between mb-24">
						<Box>
							<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
								Transaction History
							</Typography>
							<Typography
								className="font-medium"
								color="text.secondary"
							>
								All your trade transactions on the platform
							</Typography>
						</Box>
						<Box className="flex items-center gap-12">
							<Tooltip title="Export to CSV">
								<IconButton size="small">
									<FuseSvgIcon size={20}>heroicons-outline:arrow-down-tray</FuseSvgIcon>
								</IconButton>
							</Tooltip>
							<Tooltip title="Refresh">
								<IconButton size="small">
									<FuseSvgIcon size={20}>heroicons-outline:arrow-path</FuseSvgIcon>
								</IconButton>
							</Tooltip>
						</Box>
					</Box>

					{/* Table */}
					<div className="table-responsive">
						<Table className="simple w-full min-w-full">
							<TableHead>
								<TableRow>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Transaction ID
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Date
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Type
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Amount
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Commission
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Earnings
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											color="text.secondary"
											className="font-semibold text-12 whitespace-nowrap"
										>
											Status
										</Typography>
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{transactionsLoading ? (
									<TableRow>
										<TableCell
											colSpan={7}
											align="center"
										>
											<CircularProgress size={24} />
										</TableCell>
									</TableRow>
								) : transactionData.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											align="center"
										>
											<Box className="py-40">
												<FuseSvgIcon
													size={48}
													className="text-gray-400 mb-12"
												>
													heroicons-outline:inbox
												</FuseSvgIcon>
												<Typography
													color="text.secondary"
													className="font-medium"
												>
													No transactions found
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Your transaction history will appear here
												</Typography>
											</Box>
										</TableCell>
									</TableRow>
								) : (
									transactionData.map((row) => (
										<TableRow
											key={row._id || row?.id}
											hover
										>
											<TableCell>
												<Tooltip title={row._id || row?.id}>
													<Typography
														variant="body2"
														color="text.secondary"
													>
														{row._id || row?.id?.substring(0, 8)}...
													</Typography>
												</Tooltip>
											</TableCell>
											<TableCell>
												<Typography variant="body2">
													{format(new Date(row.createdAt), 'MMM dd, yyyy')}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={row.transactionType || 'N/A'}
													size="small"
													variant="outlined"
													sx={{ textTransform: 'capitalize' }}
												/>
											</TableCell>
											<TableCell>
												<Typography
													variant="body2"
													className="font-semibold"
												>
													{(row.totalAmount || 0).toLocaleString('en-NG', {
														style: 'currency',
														currency: 'NGN'
													})}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													variant="body2"
													className="text-orange-600"
												>
													{(row.commissionAmount || 0).toLocaleString('en-NG', {
														style: 'currency',
														currency: 'NGN'
													})}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													variant="body2"
													className="font-semibold text-green-600"
												>
													{(row.merchantPayout || 0).toLocaleString('en-NG', {
														style: 'currency',
														currency: 'NGN'
													})}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={row.status || 'completed'}
													size="small"
													className={clsx(
														'font-semibold',
														row.status === 'pending' && 'bg-yellow-100 text-yellow-800',
														row.status === 'completed' && 'bg-green-100 text-green-800',
														row.status === 'failed' && 'bg-red-100 text-red-800'
													)}
												/>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>

						{/* Pagination */}
						{transactionData.length > 0 && (
							<TablePagination
								component="div"
								count={totalCount}
								page={page}
								onPageChange={handleChangePage}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								rowsPerPageOptions={[5, 10, 25, 50]}
							/>
						)}
					</div>
				</Paper>
			</motion.div>
		</motion.div>
	);
}

export default memo(TransactionsReportWidget);
