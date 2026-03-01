import { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Typography,
	IconButton,
	InputAdornment,
	Box,
	Alert,
	CircularProgress
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useInitiateWithdrawal,
	useConfirmWithdrawal
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';

// Validation schema for amount and PIN (before OTP)
const initiateSchema = yup.object().shape({
	amount: yup
		.number()
		.required('Amount is required')
		.positive('Amount must be positive')
		.test('max-balance', 'Insufficient balance', function (value) {
			const { availableBalance } = this.options.context;
			return value <= availableBalance;
		})
		.test('min-amount', 'Minimum withdrawal amount is ₦100', (value) => value >= 100),
	accountPin: yup
		.string()
		.required('Account PIN is required')
		.matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
});

// Validation schema for full withdrawal (with OTP)
const confirmSchema = yup.object().shape({
	amount: yup
		.number()
		.required('Amount is required')
		.positive('Amount must be positive')
		.test('max-balance', 'Insufficient balance', function (value) {
			const { availableBalance } = this.options.context;
			return value <= availableBalance;
		})
		.test('min-amount', 'Minimum withdrawal amount is ₦100', (value) => value >= 100),
	accountPin: yup
		.string()
		.required('Account PIN is required')
		.matches(/^\d{4}$/, 'PIN must be exactly 4 digits'),
	otp: yup
		.string()
		.required('OTP is required')
		.matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

function WithdrawFundsDialog({ open, onClose, shopData, availableBalance }) {
	const [showPin, setShowPin] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otpExpiresIn, setOtpExpiresIn] = useState(null);

	const { mutate: initiateWithdrawalMutation, isLoading: isInitiating } = useInitiateWithdrawal();
	const { mutate: confirmWithdrawalMutation, isLoading: isConfirming } = useConfirmWithdrawal();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		trigger,
		getValues
	} = useForm({
		resolver: yupResolver(otpSent ? confirmSchema : initiateSchema),
		mode: 'onChange',
		context: { availableBalance },
		defaultValues: {
			amount: '',
			accountPin: '',
			otp: ''
		}
	});

	const handleSendOtp = async () => {
		// Validate amount and PIN first
		const isValid = await trigger(['amount', 'accountPin']);
		if (!isValid) {
			return;
		}

		const formData = getValues();
		const initiateData = {
			amount: parseFloat(formData.amount),
			accountPin: formData.accountPin,
			linkedBankAccountNumber: shopData?.linkedBankAccountNumber,
			linkedBankName: shopData?.linkedBankName,
			linkedBankAccountName: shopData?.linkedBankAccountName,
			linkedBankId: shopData?.linkedBankId || '',
			linkedBankCode: shopData?.linkedBankCode || ''
		};

		initiateWithdrawalMutation(initiateData, {
			onSuccess: (response) => {
				if (response?.data?.success) {
					setOtpSent(true);
					setOtpExpiresIn(response?.data?.expiresIn || '10 minutes');
				}
			},
			onError: (error) => {
				const errorMessage =
					error?.response?.data?.message || 'Failed to send OTP. Please try again.';
				alert(errorMessage);
			}
		});
	};

	const onSubmit = (data) => {
		const confirmData = {
			amount: parseFloat(data.amount),
			accountPin: data.accountPin,
			otp: data.otp,
			linkedBankAccountNumber: shopData?.linkedBankAccountNumber,
			linkedBankName: shopData?.linkedBankName,
			linkedBankAccountName: shopData?.linkedBankAccountName,
			linkedBankId: shopData?.linkedBankId || '',
			linkedBankCode: shopData?.linkedBankCode || ''
		};

		confirmWithdrawalMutation(confirmData, {
			onSuccess: (response) => {
				if (response?.data?.success) {
					reset();
					setOtpSent(false);
					setOtpExpiresIn(null);
					onClose();
				}
			},
			onError: (error) => {
				const errorMessage =
					error?.response?.data?.message || 'Withdrawal failed. Please try again.';
				alert(errorMessage);
			}
		});
	};

	const handleDialogClose = () => {
		if (!isConfirming && !isInitiating) {
			reset();
			setOtpSent(false);
			setOtpExpiresIn(null);
			onClose();
		}
	};

	const handleSetMaxAmount = () => {
		setValue('amount', availableBalance, { shouldValidate: true });
	};

	const linkedBankName = shopData?.linkedBankName;
	const linkedBankAccountNumber = shopData?.linkedBankAccountNumber;
	const linkedBankAccountName = shopData?.linkedBankAccountName;

	return (
		<Dialog
			open={open}
			onClose={handleDialogClose}
			maxWidth="sm"
			fullWidth
			disableEscapeKeyDown={isConfirming || isInitiating}
			PaperProps={{
				sx: {
					borderRadius: 2,
					backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
				}
			}}
		>
			<DialogTitle>
				<Box className="flex items-center justify-between">
					<Box className="flex items-center gap-12">
						<Box
							className="flex items-center justify-center w-48 h-48 rounded-full"
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={24}
							>
								heroicons-outline:arrow-down-tray
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								Withdraw Funds
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Transfer to your linked bank account
							</Typography>
						</Box>
					</Box>
					<IconButton
						onClick={handleDialogClose}
						disabled={isConfirming || isInitiating}
						size="small"
					>
						<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent className="pt-24">
				<Box className="space-y-24">
					{/* Available Balance Info */}
					<Box className="p-16 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
						<Typography
							variant="caption"
							color="text.secondary"
							className="block mb-4"
						>
							Available Balance
						</Typography>
						<Typography
							variant="h5"
							className="font-bold"
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text'
							}}
						>
							{availableBalance.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN'
							})}
						</Typography>
					</Box>

					{/* Destination Bank Account - Enhanced Display */}
					<Box className="p-20 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700">
						<Box className="flex items-center gap-8 mb-12">
							<FuseSvgIcon
								size={20}
								className="text-green-600"
							>
								heroicons-solid:check-badge
							</FuseSvgIcon>
							<Typography
								variant="body2"
								className="font-semibold text-green-800 dark:text-green-400"
							>
								Withdrawal Destination Account
							</Typography>
						</Box>

						<Box className="space-y-12 pl-28">
							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
									className="block mb-4"
								>
									Account Name
								</Typography>
								<Typography
									variant="body1"
									className="font-bold"
								>
									{linkedBankAccountName || 'N/A'}
								</Typography>
							</Box>

							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
									className="block mb-4"
								>
									Bank Name
								</Typography>
								<Typography
									variant="body2"
									className="font-medium"
								>
									{linkedBankName || 'N/A'}
								</Typography>
							</Box>

							<Box>
								<Typography
									variant="caption"
									color="text.secondary"
									className="block mb-4"
								>
									Account Number
								</Typography>
								<Typography
									variant="body2"
									className="font-mono font-medium"
								>
									{linkedBankAccountNumber || 'N/A'}
								</Typography>
							</Box>
						</Box>

						<Alert
							severity="info"
							className="mt-16"
							icon={<FuseSvgIcon size={16}>heroicons-outline:information-circle</FuseSvgIcon>}
							sx={{ py: 0.5 }}
						>
							<Typography variant="caption">
								Funds will be transferred to this account within 24-48 hours
							</Typography>
						</Alert>
					</Box>

					{/* Withdrawal Amount */}
					<Controller
						name="amount"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Withdrawal Amount"
								placeholder="Enter amount"
								fullWidth
								type="number"
								error={!!errors.amount}
								helperText={errors.amount?.message}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-outline:currency-dollar</FuseSvgIcon>
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<Button
												size="small"
												onClick={handleSetMaxAmount}
												variant="text"
												color="secondary"
											>
												Max
											</Button>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>

					{/* Account PIN */}
					<Controller
						name="accountPin"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Account PIN"
								type={showPin ? 'text' : 'password'}
								placeholder="Enter 4-digit PIN"
								fullWidth
								error={!!errors.accountPin}
								helperText={errors.accountPin?.message}
								inputProps={{ maxLength: 4 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-outline:lock-closed</FuseSvgIcon>
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => setShowPin(!showPin)}
												edge="end"
												size="small"
											>
												{showPin ? (
													<FuseSvgIcon size={20}>heroicons-outline:eye-slash</FuseSvgIcon>
												) : (
													<FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
												)}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>

					{/* OTP Section */}
					{!otpSent ? (
						<Alert
							severity="info"
							icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							action={
								<Button
									size="small"
									color="inherit"
									onClick={handleSendOtp}
									disabled={isInitiating}
									startIcon={
										isInitiating ? (
											<CircularProgress
												size={16}
												color="inherit"
											/>
										) : null
									}
								>
									{isInitiating ? 'Sending...' : 'Send OTP'}
								</Button>
							}
						>
							Click "Send OTP" to receive a verification code on your registered phone number
						</Alert>
					) : (
						<>
							<Alert
								severity="success"
								icon={<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>}
							>
								OTP has been sent to your registered phone number. {otpExpiresIn && `Expires in: ${otpExpiresIn}`}
							</Alert>

							<Controller
								name="otp"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Enter OTP"
										placeholder="Enter 6-digit OTP"
										fullWidth
										error={!!errors.otp}
										helperText={errors.otp?.message}
										inputProps={{ maxLength: 6 }}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon size={20}>heroicons-outline:shield-check</FuseSvgIcon>
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<Button
														size="small"
														onClick={handleSendOtp}
														disabled={isInitiating}
														variant="text"
														color="secondary"
													>
														Resend
													</Button>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>
						</>
					)}

					{/* Warning */}
					<Alert
						severity="warning"
						icon={<FuseSvgIcon size={20}>heroicons-outline:exclamation-triangle</FuseSvgIcon>}
					>
						<Typography
							variant="caption"
							component="div"
						>
							<strong>Important:</strong> Withdrawals are processed within 24-48 hours. Ensure all details
							are correct before proceeding.
						</Typography>
					</Alert>
				</Box>
			</DialogContent>

			<DialogActions className="px-24 pb-24">
				<Button
					onClick={handleDialogClose}
					disabled={isConfirming || isInitiating}
					color="inherit"
				>
					Cancel
				</Button>
				<Box className="flex-1" />
				<Button
					onClick={handleSubmit(onSubmit)}
					variant="contained"
					color="secondary"
					disabled={!otpSent || isConfirming}
					startIcon={
						isConfirming ? (
							<CircularProgress
								size={20}
								color="inherit"
							/>
						) : (
							<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
						)
					}
				>
					{isConfirming ? 'Processing Withdrawal...' : 'Confirm Withdrawal'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default WithdrawFundsDialog;
