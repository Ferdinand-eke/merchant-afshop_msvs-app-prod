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

/**
 * Loan Configuration Constants
 * These values can be overridden by API values when available
 */
const LOAN_CONFIG = {
	MINIMUM_COMMISSION_FOR_LOAN: 50000, // Minimum commission required to apply for a loan (NGN 50,000)
	LOAN_TO_COMMISSION_RATIO: 1.25, // 125% of total commissions paid
	REPAYMENT_PERIOD_MONTHS: 12, // Standard repayment period
	ELIGIBILITY_TIERS: {
		PREMIUM: {
			threshold: 200000, // 200K+ in commissions
			name: 'Premium Tier',
			color: 'success',
			icon: 'heroicons-outline:check-badge',
			description: 'Excellent commission history'
		},
		STANDARD: {
			threshold: 100000, // 100K+ in commissions
			name: 'Standard Tier',
			color: 'primary',
			icon: 'heroicons-outline:check-circle',
			description: 'Good commission history'
		},
		GROWING: {
			threshold: 50000, // 50K+ in commissions (qualifies for loan)
			name: 'Growing Tier',
			color: 'warning',
			icon: 'heroicons-outline:shield-check',
			description: 'Qualifies for loan'
		},
		BUILDING: {
			threshold: 0, // Any commission amount
			name: 'Building Tier',
			color: 'info',
			icon: 'heroicons-outline:arrow-trending-up',
			description: 'Building commission history'
		}
	}
};

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
 * Loan Eligibility Assessment Component
 * Calculates loan eligibility based on total commissions paid by merchant
 *
 * Key Rules:
 * - All merchants see their eligibility tier and score
 * - Loan Amount = Total Commissions × 125% (1.25 ratio)
 * - Minimum Commission for Loan: NGN 50,000 (hard requirement)
 * - Repayment Period: 12 months for all loans
 *
 * Eligibility Tiers (for tracking progress):
 * - Premium: NGN 200,000+ in commissions → NGN 250,000+ loan
 * - Standard: NGN 100,000+ in commissions → NGN 125,000+ loan
 * - Growing: NGN 50,000+ in commissions → NGN 62,500+ loan (QUALIFIES)
 * - Building: < NGN 50,000 in commissions → Cannot apply yet
 */
function LoanEligibilityCard({ summary, isLoading }) {
	const theme = useTheme();

	const eligibilityData = useMemo(() => {
		if (!summary?.data?.summary) return null;

		const data = summary?.data?.summary;
		const totalCommissions = data.totalCommissions || 0;
		const totalVolume = data.totalRevenue || 0;
		const totalEarnings = data.totalMerchantPayout || 0;
		const transactionCount = data.totalTransactions || 0;

		// Calculate potential loan amount (125% of commissions paid)
		const calculatedLoanAmount = totalCommissions * LOAN_CONFIG.LOAN_TO_COMMISSION_RATIO;

		// Determine if merchant qualifies for loan (HARD REQUIREMENT: 50K+ in commissions)
		const qualifiesForLoan = totalCommissions >= LOAN_CONFIG.MINIMUM_COMMISSION_FOR_LOAN;

		// Set max loan amount - only if qualified
		const maxLoanAmount = qualifiesForLoan ? calculatedLoanAmount : 0;

		// Determine eligibility tier based on commission thresholds (ALWAYS show tier)
		let tier = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.name;
		let tierColor = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.color;
		let icon = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.icon;
		let tierDescription = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.description;
		let score = 0;

		if (totalCommissions >= LOAN_CONFIG.ELIGIBILITY_TIERS.PREMIUM.threshold) {
			tier = LOAN_CONFIG.ELIGIBILITY_TIERS.PREMIUM.name;
			tierColor = LOAN_CONFIG.ELIGIBILITY_TIERS.PREMIUM.color;
			icon = LOAN_CONFIG.ELIGIBILITY_TIERS.PREMIUM.icon;
			tierDescription = LOAN_CONFIG.ELIGIBILITY_TIERS.PREMIUM.description;
			score = 100;
		} else if (totalCommissions >= LOAN_CONFIG.ELIGIBILITY_TIERS.STANDARD.threshold) {
			tier = LOAN_CONFIG.ELIGIBILITY_TIERS.STANDARD.name;
			tierColor = LOAN_CONFIG.ELIGIBILITY_TIERS.STANDARD.color;
			icon = LOAN_CONFIG.ELIGIBILITY_TIERS.STANDARD.icon;
			tierDescription = LOAN_CONFIG.ELIGIBILITY_TIERS.STANDARD.description;
			score = 80;
		} else if (totalCommissions >= LOAN_CONFIG.ELIGIBILITY_TIERS.GROWING.threshold) {
			tier = LOAN_CONFIG.ELIGIBILITY_TIERS.GROWING.name;
			tierColor = LOAN_CONFIG.ELIGIBILITY_TIERS.GROWING.color;
			icon = LOAN_CONFIG.ELIGIBILITY_TIERS.GROWING.icon;
			tierDescription = LOAN_CONFIG.ELIGIBILITY_TIERS.GROWING.description;
			score = 60;
		} else {
			// Building tier - calculate progress score (0-50)
			tier = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.name;
			tierColor = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.color;
			icon = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.icon;
			tierDescription = LOAN_CONFIG.ELIGIBILITY_TIERS.BUILDING.description;
			score = Math.min(Math.round((totalCommissions / LOAN_CONFIG.MINIMUM_COMMISSION_FOR_LOAN) * 50), 50);
		}

		// Calculate monthly repayment amount (only if qualified)
		const monthlyRepayment = maxLoanAmount > 0
			? maxLoanAmount / LOAN_CONFIG.REPAYMENT_PERIOD_MONTHS
			: 0;

		// Calculate how much more commission needed to qualify
		const commissionNeeded = qualifiesForLoan
			? 0
			: LOAN_CONFIG.MINIMUM_COMMISSION_FOR_LOAN - totalCommissions;

		return {
			score,
			tier,
			tierColor,
			icon,
			tierDescription,
			maxLoanAmount,
			potentialLoanAmount: calculatedLoanAmount, // Show what they COULD get
			totalCommissions,
			totalVolume,
			totalEarnings,
			transactionCount,
			repaymentPeriod: LOAN_CONFIG.REPAYMENT_PERIOD_MONTHS,
			monthlyRepayment,
			commissionRatio: LOAN_CONFIG.LOAN_TO_COMMISSION_RATIO,
			minimumRequired: LOAN_CONFIG.MINIMUM_COMMISSION_FOR_LOAN,
			qualifiesForLoan,
			commissionNeeded
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
						Based on total commissions paid • 125% loan-to-commission ratio
					</Typography>
				</Box>
				<Box
					className="flex items-center justify-center w-56 h-56 rounded-xl"
					sx={{
						background: `linear-gradient(135deg, ${theme.palette[eligibilityData.tierColor].main} 0%, ${theme.palette[eligibilityData.tierColor].light} 100%)`,
						boxShadow: `0 4px 12px ${alpha(theme.palette[eligibilityData.tierColor].main, 0.3)}`
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
				<Typography
					variant="caption"
					color="text.secondary"
					className="block mt-8"
				>
					{eligibilityData.tierDescription}
				</Typography>
			</Box>

			{/* Loan Amount & Repayment Details */}
			{eligibilityData.qualifiesForLoan ? (
				<>
					{/* Qualified - Show Available Loan Amount */}
					<Box
						className="p-16 rounded-xl mb-16"
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
							Loan Amount Available
						</Typography>
						<Typography
							variant="h4"
							className="font-bold"
							sx={{ color: theme.palette.success.main }}
						>
							{eligibilityData.maxLoanAmount.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN',
								minimumFractionDigits: 0
							})}
						</Typography>
					</Box>

					{/* Repayment Details */}
					<Box
						className="p-16 rounded-xl mb-24"
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.05),
							border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
						}}
					>
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
									Repayment Period
								</Typography>
								<Typography
									variant="body1"
									className="font-semibold"
								>
									{eligibilityData.repaymentPeriod} months
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
									Monthly Payment
								</Typography>
								<Typography
									variant="body1"
									className="font-semibold"
								>
									{eligibilityData.monthlyRepayment.toLocaleString('en-NG', {
										style: 'currency',
										currency: 'NGN',
										minimumFractionDigits: 0
									})}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</>
			) : (
				<>
					{/* Not Qualified - Show Progress Info */}
					<Box
						className="p-16 rounded-xl mb-16"
						sx={{
							backgroundColor: alpha(theme.palette.warning.main, 0.05),
							border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
						}}
					>
						<Box className="flex items-start gap-12">
							<FuseSvgIcon
								className="text-warning"
								size={20}
							>
								heroicons-outline:information-circle
							</FuseSvgIcon>
							<Box className="flex-1">
								<Typography
									variant="body2"
									className="font-semibold mb-4"
								>
									Loan Qualification Progress
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									You need {LOAN_CONFIG.MINIMUM_COMMISSION_FOR_LOAN.toLocaleString('en-NG', {
										style: 'currency',
										currency: 'NGN',
										minimumFractionDigits: 0
									})} in total commissions to qualify for a loan.
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									className="block mt-8"
								>
									Current commissions: {eligibilityData.totalCommissions.toLocaleString('en-NG', {
										style: 'currency',
										currency: 'NGN',
										minimumFractionDigits: 0
									})}
								</Typography>
								{eligibilityData.commissionNeeded > 0 && (
									<Typography
										variant="caption"
										className="block mt-4 font-semibold"
										sx={{ color: theme.palette.warning.main }}
									>
										Only {eligibilityData.commissionNeeded.toLocaleString('en-NG', {
											style: 'currency',
											currency: 'NGN',
											minimumFractionDigits: 0
										})} more needed!
									</Typography>
								)}
							</Box>
						</Box>
					</Box>

					{/* Show Potential Loan Amount */}
					{eligibilityData.potentialLoanAmount > 0 && (
						<Box
							className="p-16 rounded-xl mb-24"
							sx={{
								backgroundColor: alpha(theme.palette.info.main, 0.05),
								border: `1px dashed ${alpha(theme.palette.info.main, 0.2)}`
							}}
						>
							<Typography
								variant="caption"
								color="text.secondary"
								className="block mb-4"
							>
								Your Potential Loan Amount (when qualified)
							</Typography>
							<Typography
								variant="h5"
								className="font-bold"
								color="info"
							>
								{eligibilityData.potentialLoanAmount.toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								className="block mt-4"
							>
								Based on your current commission of {eligibilityData.totalCommissions.toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})} × 125%
							</Typography>
						</Box>
					)}
				</>
			)}

			{/* Key Metrics */}
			<Divider className="mb-16" />
			<Box className="mb-16">
				<Typography
					variant="caption"
					color="text.secondary"
					className="block mb-12"
				>
					Eligibility Factors
				</Typography>
				<Grid
					container
					spacing={2}
				>
					{/* Primary Factor - Commissions (highlighted) */}
					<Grid
						item
						xs={12}
					>
						<Box
							className="p-12 rounded-lg"
							sx={{
								backgroundColor: alpha(theme.palette.primary.main, 0.08),
								border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
							}}
						>
							<Box className="flex items-center gap-8 mb-4">
								<FuseSvgIcon
									className="text-primary"
									size={16}
								>
									heroicons-outline:star
								</FuseSvgIcon>
								<Typography
									variant="caption"
									color="primary"
									className="font-semibold"
								>
									Total Commissions Paid (Primary Factor)
								</Typography>
							</Box>
							<Typography
								variant="h6"
								className="font-bold"
								color="primary"
							>
								{eligibilityData.totalCommissions.toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								className="block mt-4"
							>
								Loan calculation: Commissions × 125% = {(eligibilityData.totalCommissions * eligibilityData.commissionRatio).toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})}
							</Typography>
						</Box>
					</Grid>

					{/* Supporting Metrics */}
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
			</Box>

			{/* CTA Button */}
			<Divider className="my-16" />
			{eligibilityData.qualifiesForLoan ? (
				<>
					{/* Qualified Merchants - Active Apply Button */}
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
							boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
							'&:hover': {
								background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
								boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.5)}`
							}
						}}
					>
						Apply for Loan • {eligibilityData.repaymentPeriod} Month Term
					</Button>
					<Typography
						variant="caption"
						color="text.secondary"
						className="block text-center mt-8"
					>
						Get {eligibilityData.maxLoanAmount.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 0
						})} with {eligibilityData.repaymentPeriod}-month flexible repayment
					</Typography>
				</>
			) : (
				<>
					{/* Not Qualified - Disabled Button */}
					<Button
						variant="outlined"
						fullWidth
						size="large"
						disabled
						startIcon={
							<FuseSvgIcon size={20}>heroicons-outline:lock-closed</FuseSvgIcon>
						}
						sx={{
							borderColor: alpha(theme.palette.text.disabled, 0.2)
						}}
					>
						Loan Application Locked
					</Button>
					<Typography
						variant="caption"
						color="text.secondary"
						className="block text-center mt-8"
					>
						{eligibilityData.totalCommissions > 0
							? `You're ${Math.round((eligibilityData.totalCommissions / LOAN_CONFIG.MINIMUM_COMMISSION_FOR_LOAN) * 100)}% of the way to qualifying! Keep earning commissions.`
							: 'Start earning commissions to unlock loan eligibility'}
					</Typography>
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
