import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Card,
	InputAdornment,
	TextField,
	Alert,
	CircularProgress,
	Chip,
	Divider,
	useTheme,
	alpha,
	IconButton,
	Skeleton
} from '@mui/material';
import useGetMyShopDetails, {
	useGetShopAccountBalance
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { Controller, useForm } from 'react-hook-form';
import { useTransferToShopWalletMutation } from 'app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals';
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';

/**
 * Funds Movement Modal - Transfer funds from shop account to fintech wallet
 * This modal is displayed in a drawer from FinanceDashboardAppHeader
 */

const container = {
	show: {
		transition: {
			staggerChildren: 0.1
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

function FundsMovementPage({ onClose }) {
	const theme = useTheme();

	const transferFunds = useTransferToShopWalletMutation();

	const { control, formState, getValues, reset, setValue } = useForm({
		mode: 'onChange',
		defaultValues: {
			transferAmount: ''
		}
	});

	const { errors } = formState;

	const { data: shopData, isLoading: shopLoading } = useGetMyShopDetails();
	const {
		data: shopAccount,
		isLoading: accountLoading,
		isError: accountError,
		refetch: refetchAccount
	} = useGetShopAccountBalance();

	// Process fintech account data
	const accountData = useMemo(() => {
		if (!shopAccount) return null;

		const hasAccount = shopAccount?.hasAccount !== false && shopAccount?.data?.payload !== null;
		const payload = shopAccount?.data?.payload;

		return {
			hasAccount,
			account: payload,
			success: shopAccount?.data?.success
		};
	}, [shopAccount]);

	function handleMoveFunds() {
		const amount = parseFloat(getValues()?.transferAmount);

		if (!amount || amount <= 0) {
			return toast.error('Please enter a valid transfer amount');
		}

		// Check shop account balance (source)
		const shopAccountBalance = shopData?.data?.merchant?.shopaccount?.accountbalance || 0;

		if (shopAccountBalance < amount) {
			return toast.error('Insufficient balance in shop account to transfer');
		}

		transferFunds.mutate(getValues());
	}

	useEffect(() => {
		if (transferFunds?.isSuccess) {
			reset();
			refetchAccount();
			toast.success('Funds transferred successfully to wallet!');
		}
	}, [transferFunds?.isSuccess, reset, refetchAccount]);

	// Get shop account balance (source of funds)
	const shopAccountBalance = shopData?.data?.merchant?.shopaccount?.accountbalance || 0;
	// Get fintech wallet balance (destination)
	const fintechBalance = accountData?.account?.accountBalance || 0;

	return (
		<Box
			className="flex flex-col h-full"
			sx={{ width: '100%', maxWidth: 600 }}
		>
			<motion.div
				className="flex flex-col h-full"
				variants={container}
				initial="hidden"
				animate="show"
			>
				{/* Header with Close Button */}
				<motion.div variants={item}>
					<Box
						className="flex items-center justify-between p-24 pb-16"
						sx={{
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
							color: 'white'
						}}
					>
						<Box className="flex items-center gap-12">
							<Box
								className="flex items-center justify-center w-48 h-48 rounded-xl"
								sx={{
									backgroundColor: alpha('#fff', 0.2)
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={24}
								>
									heroicons-outline:arrow-path
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
								>
									Transfer to Wallet
								</Typography>
								<Typography
									variant="caption"
									sx={{ opacity: 0.9 }}
								>
									Move funds from shop account to fintech wallet
								</Typography>
							</Box>
						</Box>
						<IconButton
							onClick={onClose}
							sx={{ color: 'white' }}
							size="small"
						>
							<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
				</motion.div>

				{/* Content */}
				<Box className="flex-1 overflow-y-auto p-24">
					<motion.div
						className="space-y-24"
						variants={container}
					>
						{/* Info Alert */}
						<motion.div variants={item}>
							<Alert
								severity="info"
								icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							>
								Transfer funds from your shop account (where sales are received) to your fintech wallet
								for enhanced financial management.
							</Alert>
						</motion.div>

						{/* Account Balances */}
						<motion.div variants={item}>
							<Card
								className="p-20 rounded-xl"
								sx={{
									background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
								}}
							>
								<Typography
									variant="subtitle2"
									className="font-semibold mb-16"
									color="text.secondary"
								>
									Account Balances
								</Typography>

								{/* Shop Account Balance (Source) */}
								<Box
									className="p-16 rounded-lg mb-12"
									sx={{
										backgroundColor: alpha(theme.palette.success.main, 0.1),
										border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
									}}
								>
									<Box className="flex items-center justify-between mb-8">
										<Box className="flex items-center gap-8">
											<FuseSvgIcon
												size={20}
												className="text-green-600"
											>
												heroicons-outline:building-storefront
											</FuseSvgIcon>
											<Typography
												variant="caption"
												className="font-medium"
											>
												Shop Account (Source)
											</Typography>
										</Box>
										<Chip
											label="Available"
											size="small"
											color="success"
											sx={{ height: 20, fontSize: '0.65rem' }}
										/>
									</Box>
									{shopLoading ? (
										<Skeleton
											variant="text"
											width="60%"
											height={32}
										/>
									) : (
										<Typography
											variant="h5"
											className="font-bold text-green-600"
										>
											{shopAccountBalance.toLocaleString('en-NG', {
												style: 'currency',
												currency: 'NGN'
											})}
										</Typography>
									)}
								</Box>

								<Box className="flex justify-center py-8">
									<FuseSvgIcon
										size={20}
										className="text-primary"
									>
										heroicons-outline:arrow-down
									</FuseSvgIcon>
								</Box>

								{/* Fintech Wallet Balance (Destination) */}
								<Box
									className="p-16 rounded-lg"
									sx={{
										backgroundColor: alpha(theme.palette.primary.main, 0.1),
										border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
									}}
								>
									<Box className="flex items-center justify-between mb-8">
										<Box className="flex items-center gap-8">
											<FuseSvgIcon
												size={20}
												className="text-primary"
											>
												heroicons-outline:wallet
											</FuseSvgIcon>
											<Typography
												variant="caption"
												className="font-medium"
											>
												Fintech Wallet (Destination)
											</Typography>
										</Box>
										<Chip
											label={accountData?.hasAccount ? 'Active' : 'Not Created'}
											size="small"
											color={accountData?.hasAccount ? 'primary' : 'default'}
											sx={{ height: 20, fontSize: '0.65rem' }}
										/>
									</Box>
									{accountLoading ? (
										<Skeleton
											variant="text"
											width="60%"
											height={32}
										/>
									) : accountData?.hasAccount ? (
										<Typography
											variant="h5"
											className="font-bold text-primary"
										>
											{fintechBalance.toLocaleString('en-NG', {
												style: 'currency',
												currency: 'NGN'
											})}
										</Typography>
									) : (
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Create fintech account to transfer funds
										</Typography>
									)}
								</Box>
							</Card>
						</motion.div>

						{/* Transfer Form */}
						{accountData?.hasAccount ? (
							<motion.div variants={item}>
								<Card
									className="p-20 rounded-xl"
									sx={{
										background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
									}}
								>
									<Box className="flex items-center gap-12 mb-16">
										<FuseSvgIcon
											className="text-primary"
											size={20}
										>
											heroicons-outline:banknotes
										</FuseSvgIcon>
										<Typography
											variant="subtitle2"
											className="font-semibold"
										>
											Transfer Amount
										</Typography>
									</Box>

									<Divider className="mb-16" />

									{/* Transfer Amount Input */}
									<Controller
										name="transferAmount"
										control={control}
										rules={{
											required: 'Transfer amount is required',
											min: { value: 1, message: 'Amount must be greater than 0' },
											max: {
												value: shopAccountBalance,
												message: 'Amount exceeds shop account balance'
											}
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Transfer Amount"
												placeholder="Enter amount to transfer"
												type="number"
												variant="outlined"
												fullWidth
												error={!!errors.transferAmount}
												helperText={errors.transferAmount?.message}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Chip
																label="NGN"
																size="small"
																color="primary"
															/>
														</InputAdornment>
													)
												}}
												className="mb-16"
											/>
										)}
									/>

									{/* Quick Amount Buttons */}
									<Box className="flex flex-wrap gap-8 mb-16">
										<Typography
											variant="caption"
											className="w-full mb-4"
											color="text.secondary"
										>
											Quick Select:
										</Typography>
										{[1000, 5000, 10000, 50000].map((amount) => (
											<Button
												key={amount}
												size="small"
												variant="outlined"
												onClick={() => setValue('transferAmount', amount.toString())}
												disabled={amount > shopAccountBalance}
											>
												{amount.toLocaleString('en-NG', {
													style: 'currency',
													currency: 'NGN',
													minimumFractionDigits: 0
												})}
											</Button>
										))}
										<Button
											size="small"
											variant="outlined"
											color="secondary"
											onClick={() => setValue('transferAmount', shopAccountBalance.toString())}
											disabled={shopAccountBalance <= 0}
										>
											Transfer All
										</Button>
									</Box>

									{/* Submit Button */}
									<Button
										variant="contained"
										color="secondary"
										size="large"
										fullWidth
										disabled={!getValues()?.transferAmount || transferFunds?.isLoading || shopAccountBalance <= 0}
										onClick={handleMoveFunds}
										startIcon={
											transferFunds?.isLoading ? (
												<CircularProgress
													size={20}
													color="inherit"
												/>
											) : (
												<FuseSvgIcon size={20}>heroicons-outline:arrow-right-circle</FuseSvgIcon>
											)
										}
										sx={{
											background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
											'&:hover': {
												background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
											}
										}}
									>
										{transferFunds?.isLoading ? 'Processing Transfer...' : 'Transfer to Wallet'}
									</Button>
								</Card>
							</motion.div>
						) : (
							<motion.div variants={item}>
								<Alert
									severity="warning"
									icon={<FuseSvgIcon size={20}>heroicons-outline:exclamation-triangle</FuseSvgIcon>}
								>
									<Typography
										variant="body2"
										className="font-medium mb-4"
									>
										Fintech Account Required
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										You need to create a fintech account before you can transfer funds. Please create
										one from the finance dashboard.
									</Typography>
								</Alert>
							</motion.div>
						)}

						{/* Benefits */}
						<motion.div variants={item}>
							<Card
								className="p-16 rounded-xl"
								sx={{
									backgroundColor: alpha(theme.palette.background.paper, 0.5)
								}}
							>
								<Typography
									variant="caption"
									className="font-semibold mb-12 block"
									color="text.secondary"
								>
									Transfer Benefits:
								</Typography>
								<Box className="space-y-8">
									{[
										{ icon: 'heroicons-outline:bolt', text: 'Instant transfer' },
										{ icon: 'heroicons-outline:shield-check', text: 'Secure transaction' },
										{ icon: 'heroicons-outline:chart-bar', text: 'Enhanced financial tracking' }
									].map((benefit, index) => (
										<Box
											key={index}
											className="flex items-center gap-8"
										>
											<FuseSvgIcon
												size={16}
												className="text-green-600"
											>
												{benefit.icon}
											</FuseSvgIcon>
											<Typography variant="caption">{benefit.text}</Typography>
										</Box>
									))}
								</Box>
							</Card>
						</motion.div>
					</motion.div>
				</Box>
			</motion.div>
		</Box>
	);
}

export default FundsMovementPage;
