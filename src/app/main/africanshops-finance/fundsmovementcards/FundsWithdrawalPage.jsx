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
	Stepper,
	Step,
	StepLabel
} from '@mui/material';
import useGetMyShopDetails, {
	useGetShopAccountBalance
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { Controller, useForm } from 'react-hook-form';
import { usePlaceWithdrawalMutation } from 'app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals';
import { toast } from 'react-toastify';
import { useEffect, useState, useMemo } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Funds Withdrawal Modal - Withdraw funds from fintech wallet to bank account
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

const steps = ['Enter Amount', 'Verify PIN', 'Confirm'];

function FundsWithdrawalPage({ onClose }) {
	const theme = useTheme();

	const placeWithdrawal = usePlaceWithdrawalMutation();
	const [activeStep, setActiveStep] = useState(0);
	const [showPin, setShowPin] = useState(false);

	const { control, formState, getValues, reset, setValue, watch } = useForm({
		mode: 'onChange',
		defaultValues: {
			amount: '',
			accountpin: ''
		}
	});

	const { errors } = formState;
	const watchAmount = watch('amount');
	const watchPin = watch('accountpin');

	const { data: shopData } = useGetMyShopDetails();
	const {
		data: shopAccount,
		isLoading: accountLoading,
		refetch: refetchAccount
	} = useGetShopAccountBalance();

	// Process account data
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

	const handleNext = () => {
		const amount = parseFloat(getValues()?.amount);

		if (activeStep === 0) {
			if (!amount || amount <= 0) {
				return toast.error('Please enter a valid withdrawal amount');
			}

			if (!accountData?.account?.accountBalance) {
				return toast.error('Unable to verify account balance');
			}

			if (accountData.account.accountBalance < amount) {
				return toast.error('Insufficient balance to withdraw');
			}

			setActiveStep(1);
		} else if (activeStep === 1) {
			const pin = getValues()?.accountpin;

			if (!pin || pin.length !== 4) {
				return toast.error('Please enter your 4-digit PIN');
			}

			setActiveStep(2);
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	function handleWithdrawFunds() {
		const amount = parseFloat(getValues()?.amount);
		const pin = getValues()?.accountpin;

		if (!amount || amount <= 0) {
			return toast.error('Invalid withdrawal amount');
		}

		if (!pin || pin.length !== 4) {
			return toast.error('Invalid PIN');
		}

		if (!accountData?.account?.linkedBankName || !accountData?.account?.linkedBankAccountNumber) {
			return toast.error('Please link your bank account first');
		}

		placeWithdrawal.mutate(getValues());
	}

	useEffect(() => {
		if (placeWithdrawal?.isSuccess) {
			reset();
			setActiveStep(0);
			refetchAccount();
			toast.success('Withdrawal request placed successfully!');
		}
	}, [placeWithdrawal?.isSuccess, reset, refetchAccount]);

	const availableBalance = accountData?.account?.accountBalance || 0;
	const hasBankLinked =
		accountData?.account?.linkedBankName && accountData?.account?.linkedBankAccountNumber;

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
							background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
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
									heroicons-outline:banknotes
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
								>
									Withdraw Funds
								</Typography>
								<Typography
									variant="caption"
									sx={{ opacity: 0.9 }}
								>
									Transfer funds to your linked bank account
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
						{/* Check if account exists */}
						{!accountData?.hasAccount ? (
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
										You need to create a fintech account before you can withdraw funds. Please create
										one from the finance dashboard.
									</Typography>
								</Alert>
							</motion.div>
						) : (
							<>
								{/* Stepper */}
								<motion.div variants={item}>
									<Stepper
										activeStep={activeStep}
										alternativeLabel
									>
										{steps.map((label) => (
											<Step key={label}>
												<StepLabel>{label}</StepLabel>
											</Step>
										))}
									</Stepper>
								</motion.div>

								{/* Bank Account Info */}
								{hasBankLinked && (
									<motion.div variants={item}>
										<Card
											className="p-16 rounded-xl"
											sx={{
												backgroundColor: alpha(theme.palette.info.main, 0.1),
												border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
											}}
										>
											<Box className="flex items-center gap-12">
												<FuseSvgIcon
													size={20}
													className="text-info"
												>
													heroicons-outline:building-library
												</FuseSvgIcon>
												<Box>
													<Typography
														variant="caption"
														color="text.secondary"
													>
														Destination Bank
													</Typography>
													<Typography
														variant="body2"
														className="font-semibold"
													>
														{accountData?.account?.linkedBankName}
													</Typography>
													<Typography
														variant="caption"
														color="text.secondary"
													>
														{accountData?.account?.linkedBankAccountNumber} •{' '}
														{accountData?.account?.linkedBankAccountName}
													</Typography>
												</Box>
											</Box>
										</Card>
									</motion.div>
								)}

								{!hasBankLinked && (
									<motion.div variants={item}>
										<Alert
											severity="warning"
											icon={<FuseSvgIcon size={20}>heroicons-outline:exclamation-triangle</FuseSvgIcon>}
										>
											<Typography
												variant="body2"
												className="font-medium mb-4"
											>
												Bank Account Not Linked
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Please link your bank account details before you can withdraw funds.
											</Typography>
										</Alert>
									</motion.div>
								)}

								{/* Available Balance */}
								<motion.div variants={item}>
									<Card
										className="p-16 rounded-xl"
										sx={{
											backgroundColor: alpha(theme.palette.success.main, 0.1),
											border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
										}}
									>
										<Box className="flex items-center justify-between">
											<Box className="flex items-center gap-8">
												<FuseSvgIcon
													size={20}
													className="text-green-600"
												>
													heroicons-outline:wallet
												</FuseSvgIcon>
												<Typography
													variant="caption"
													className="font-medium"
												>
													Available Balance
												</Typography>
											</Box>
											<Typography
												variant="h6"
												className="font-bold text-green-600"
											>
												{availableBalance.toLocaleString('en-NG', {
													style: 'currency',
													currency: 'NGN'
												})}
											</Typography>
										</Box>
									</Card>
								</motion.div>

								{/* Step Content */}
								<motion.div variants={item}>
									<Card
										className="p-20 rounded-xl"
										sx={{
											background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
										}}
									>
										{activeStep === 0 && (
											<Box>
												<Box className="flex items-center gap-12 mb-16">
													<FuseSvgIcon
														className="text-error"
														size={20}
													>
														heroicons-outline:banknotes
													</FuseSvgIcon>
													<Typography
														variant="subtitle2"
														className="font-semibold"
													>
														Withdrawal Amount
													</Typography>
												</Box>

												<Divider className="mb-16" />

												<Controller
													name="amount"
													control={control}
													rules={{
														required: 'Withdrawal amount is required',
														min: { value: 100, message: 'Minimum withdrawal is NGN 100' },
														max: {
															value: availableBalance,
															message: 'Amount exceeds available balance'
														}
													}}
													render={({ field }) => (
														<TextField
															{...field}
															label="Withdrawal Amount"
															placeholder="Enter amount to withdraw"
															type="number"
															variant="outlined"
															fullWidth
															error={!!errors.amount}
															helperText={errors.amount?.message}
															InputProps={{
																startAdornment: (
																	<InputAdornment position="start">
																		<Chip
																			label="NGN"
																			size="small"
																			color="error"
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
															onClick={() => setValue('amount', amount.toString())}
															disabled={amount > availableBalance}
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
														color="error"
														onClick={() => setValue('amount', availableBalance.toString())}
														disabled={availableBalance <= 0}
													>
														Withdraw All
													</Button>
												</Box>
											</Box>
										)}

										{activeStep === 1 && (
											<Box>
												<Alert
													severity="warning"
													icon={
														<FuseSvgIcon size={20}>heroicons-outline:shield-exclamation</FuseSvgIcon>
													}
													className="mb-16"
												>
													Enter your 4-digit account PIN to authorize this withdrawal
												</Alert>

												<Controller
													name="accountpin"
													control={control}
													rules={{
														required: 'PIN is required',
														minLength: { value: 4, message: 'PIN must be 4 digits' },
														maxLength: { value: 4, message: 'PIN must be 4 digits' }
													}}
													render={({ field }) => (
														<TextField
															{...field}
															label="Account PIN"
															placeholder="Enter your 4-digit PIN"
															type={showPin ? 'text' : 'password'}
															variant="outlined"
															fullWidth
															error={!!errors.accountpin}
															helperText={errors.accountpin?.message}
															inputProps={{ maxLength: 4 }}
															InputProps={{
																startAdornment: (
																	<InputAdornment position="start">
																		<FuseSvgIcon size={20}>
																			heroicons-outline:lock-closed
																		</FuseSvgIcon>
																	</InputAdornment>
																),
																endAdornment: (
																	<InputAdornment position="end">
																		<IconButton
																			onClick={() => setShowPin(!showPin)}
																			edge="end"
																		>
																			{showPin ? <VisibilityOff /> : <Visibility />}
																		</IconButton>
																	</InputAdornment>
																)
															}}
														/>
													)}
												/>
											</Box>
										)}

										{activeStep === 2 && (
											<Box>
												<Alert
													severity="info"
													icon={<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>}
													className="mb-16"
												>
													Review your withdrawal details before confirming
												</Alert>

												<Box
													className="p-16 rounded-lg"
													sx={{
														backgroundColor: alpha(theme.palette.background.default, 0.5)
													}}
												>
													<Box className="flex justify-between items-center py-12">
														<Typography
															variant="body2"
															color="text.secondary"
														>
															Withdrawal Amount:
														</Typography>
														<Typography
															variant="h6"
															className="font-bold"
														>
															{parseFloat(watchAmount || 0).toLocaleString('en-NG', {
																style: 'currency',
																currency: 'NGN'
															})}
														</Typography>
													</Box>
													<Divider />
													<Box className="flex justify-between items-center py-12">
														<Typography
															variant="body2"
															color="text.secondary"
														>
															Destination Bank:
														</Typography>
														<Typography variant="body2">
															{accountData?.account?.linkedBankName}
														</Typography>
													</Box>
													<Divider />
													<Box className="flex justify-between items-center py-12">
														<Typography
															variant="body2"
															color="text.secondary"
														>
															Account Number:
														</Typography>
														<Typography variant="body2">
															{accountData?.account?.linkedBankAccountNumber}
														</Typography>
													</Box>
												</Box>
											</Box>
										)}

										{/* Action Buttons */}
										<Box className="flex justify-between gap-12 mt-20">
											<Button
												onClick={handleBack}
												disabled={activeStep === 0 || placeWithdrawal?.isLoading}
												variant="outlined"
												size="small"
											>
												Back
											</Button>

											<Box className="flex-1" />

											{activeStep < steps.length - 1 ? (
												<Button
													variant="contained"
													color="primary"
													onClick={handleNext}
													disabled={
														!hasBankLinked ||
														(activeStep === 0 && !watchAmount) ||
														(activeStep === 1 && watchPin?.length !== 4)
													}
												>
													Next
												</Button>
											) : (
												<Button
													variant="contained"
													color="error"
													onClick={handleWithdrawFunds}
													disabled={!hasBankLinked || placeWithdrawal?.isLoading}
													startIcon={
														placeWithdrawal?.isLoading ? (
															<CircularProgress
																size={20}
																color="inherit"
															/>
														) : (
															<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>
														)
													}
													sx={{
														background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
														'&:hover': {
															background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.warning.dark} 100%)`
														}
													}}
												>
													{placeWithdrawal?.isLoading ? 'Processing...' : 'Confirm Withdrawal'}
												</Button>
											)}
										</Box>
									</Card>
								</motion.div>

								{/* Withdrawal Info */}
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
											Important Information:
										</Typography>
										<Box className="space-y-8">
											{[
												{ icon: 'heroicons-outline:clock', text: 'Processing within 24-48 hours' },
												{ icon: 'heroicons-outline:shield-check', text: 'Secure & encrypted transfer' },
												{ icon: 'heroicons-outline:currency-dollar', text: 'No hidden fees' }
											].map((info, index) => (
												<Box
													key={index}
													className="flex items-center gap-8"
												>
													<FuseSvgIcon
														size={16}
														className="text-error"
													>
														{info.icon}
													</FuseSvgIcon>
													<Typography variant="caption">{info.text}</Typography>
												</Box>
											))}
										</Box>
									</Card>
								</motion.div>
							</>
						)}
					</motion.div>
				</Box>
			</motion.div>
		</Box>
	);
}

export default FundsWithdrawalPage;
