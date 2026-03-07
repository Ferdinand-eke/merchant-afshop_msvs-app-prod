import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Typography,
	Box,
	Alert,
	Slider,
	FormControlLabel,
	Radio,
	RadioGroup,
	Divider,
	CircularProgress,
	alpha,
	useTheme
} from '@mui/material';
import { useState, useMemo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { PaystackButton } from 'react-paystack';

/**
 * Remittance Configuration
 */
const REMITTANCE_CONFIG = {
	MINIMUM_PERCENTAGE: 50, // Minimum 50% of total charge must be remitted
	PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here',
	PAYMENT_CHANNELS: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
};

/**
 * RemittancePlatformChargeDialog Component
 * Handles platform service charge remittance with Paystack integration
 *
 * Features:
 * - Full payment or partial payment (minimum 50%)
 * - Amount validation
 * - Paystack payment gateway integration
 * - Real-time calculation of remaining balance
 * - Professional UI with clear messaging
 */
function RemittancePlatformChargeDialog({ open, onClose, shopData, onRemittanceSuccess }) {
	const theme = useTheme();

	// Extract platform charge data
	const platformChargeBalance = shopData?.platformChargeAccount?.servicechargebalance || 0;
	const shopEmail = shopData?.email || 'merchant@africanshops.com';
	const shopName = shopData?.shopname || 'Merchant';
	const shopPhone = shopData?.phone || '';

	// State management
	const [paymentOption, setPaymentOption] = useState('full'); // 'full' or 'partial'
	const [partialAmount, setPartialAmount] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	// Calculate minimum remittable amount (50% of total)
	const minimumRemittableAmount = useMemo(() => {
		return (platformChargeBalance * REMITTANCE_CONFIG.MINIMUM_PERCENTAGE) / 100;
	}, [platformChargeBalance]);

	// Calculate payment amount based on selection
	const paymentAmount = useMemo(() => {
		if (paymentOption === 'full') {
			return platformChargeBalance;
		}
		return partialAmount || 0;
	}, [paymentOption, partialAmount, platformChargeBalance]);

	// Calculate remaining balance after payment
	const remainingBalance = useMemo(() => {
		return platformChargeBalance - paymentAmount;
	}, [platformChargeBalance, paymentAmount]);

	// Validation
	const isValidAmount = useMemo(() => {
		if (paymentOption === 'full') return true;
		if (paymentAmount < minimumRemittableAmount) return false;
		if (paymentAmount > platformChargeBalance) return false;
		return true;
	}, [paymentAmount, minimumRemittableAmount, platformChargeBalance, paymentOption]);

	// Handle payment option change
	const handlePaymentOptionChange = (event) => {
		const option = event.target.value;
		setPaymentOption(option);
		setError('');
		if (option === 'full') {
			setPartialAmount(platformChargeBalance);
		} else {
			setPartialAmount(minimumRemittableAmount);
		}
	};

	// Handle partial amount change
	const handlePartialAmountChange = (event) => {
		const value = parseFloat(event.target.value) || 0;
		setPartialAmount(value);
		setError('');
	};

	// Handle slider change
	const handleSliderChange = (_event, newValue) => {
		setPartialAmount(newValue);
		setError('');
	};

	// Paystack configuration
	const paystackConfig = {
		reference: `REMIT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		email: shopEmail,
		amount: Math.round(paymentAmount * 100), // Paystack expects amount in kobo
		publicKey: REMITTANCE_CONFIG.PAYSTACK_PUBLIC_KEY,
		text: 'Pay Now',
		channels: REMITTANCE_CONFIG.PAYMENT_CHANNELS,
		metadata: {
			custom_fields: [
				{
					display_name: 'Shop Name',
					variable_name: 'shop_name',
					value: shopName
				},
				{
					display_name: 'Payment Type',
					variable_name: 'payment_type',
					value: 'Platform Service Charge Remittance'
				},
				{
					display_name: 'Payment Option',
					variable_name: 'payment_option',
					value: paymentOption === 'full' ? 'Full Payment' : 'Partial Payment'
				}
			]
		}
	};

	// Paystack success callback
	const handlePaystackSuccess = (reference) => {
		setIsProcessing(true);
		setSuccess(true);

		// Call the parent success handler
		if (onRemittanceSuccess) {
			onRemittanceSuccess({
				reference: reference.reference,
				amount: paymentAmount,
				remainingBalance,
				paymentOption,
				transactionId: reference.trans,
				status: reference.status
			});
		}

		// Show success message briefly before closing
		setTimeout(() => {
			setIsProcessing(false);
			handleClose();
		}, 2000);
	};

	// Paystack close callback
	const handlePaystackClose = () => {
		setError('Payment was cancelled. Please try again.');
	};

	// Handle dialog close
	const handleClose = () => {
		if (!isProcessing) {
			setPaymentOption('full');
			setPartialAmount(0);
			setError('');
			setSuccess(false);
			onClose();
		}
	};

	// Component props for Paystack button
	const componentProps = {
		...paystackConfig,
		onSuccess: handlePaystackSuccess,
		onClose: handlePaystackClose
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3
				}
			}}
		>
			<DialogTitle>
				<Box className="flex items-center gap-12">
					<Box
						className="flex items-center justify-center w-48 h-48 rounded-xl"
						sx={{
							background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
							boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.4)}`
						}}
					>
						<FuseSvgIcon
							className="text-white"
							size={24}
						>
							heroicons-outline:currency-dollar
						</FuseSvgIcon>
					</Box>
					<Box>
						<Typography
							variant="h6"
							className="font-bold"
						>
							Remit Platform Charges
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Pay your service charges to continue operations
						</Typography>
					</Box>
				</Box>
			</DialogTitle>

			<DialogContent>
				{/* Success Message */}
				{success && (
					<Alert
						severity="success"
						className="mb-16"
						icon={<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>}
					>
						Payment successful! Processing your remittance...
					</Alert>
				)}

				{/* Error Message */}
				{error && (
					<Alert
						severity="error"
						className="mb-16"
						onClose={() => setError('')}
					>
						{error}
					</Alert>
				)}

				{/* Outstanding Balance */}
				<Box
					className="p-16 rounded-xl mb-24"
					sx={{
						backgroundColor: alpha(theme.palette.error.main, 0.08),
						border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
					}}
				>
					<Typography
						variant="caption"
						color="text.secondary"
						className="block mb-4"
					>
						Outstanding Platform Charges
					</Typography>
					<Typography
						variant="h4"
						className="font-bold"
						sx={{ color: theme.palette.error.main }}
					>
						{platformChargeBalance.toLocaleString('en-NG', {
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
						Service charges from desk account transactions
					</Typography>
				</Box>

				{/* Payment Options */}
				<Box className="mb-24">
					<Typography
						variant="subtitle2"
						className="font-semibold mb-12"
					>
						Payment Option
					</Typography>
					<RadioGroup
						value={paymentOption}
						onChange={handlePaymentOptionChange}
					>
						<FormControlLabel
							value="full"
							control={<Radio />}
							label={
								<Box>
									<Typography variant="body2">Pay Full Amount</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Clear all outstanding charges
									</Typography>
								</Box>
							}
						/>
						<FormControlLabel
							value="partial"
							control={<Radio />}
							label={
								<Box>
									<Typography variant="body2">Pay Partial Amount</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Minimum 50% of total charges
									</Typography>
								</Box>
							}
						/>
					</RadioGroup>
				</Box>

				{/* Partial Payment Section */}
				{paymentOption === 'partial' && (
					<Box
						className="p-16 rounded-xl mb-24"
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.05),
							border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
						}}
					>
						<Typography
							variant="subtitle2"
							className="font-semibold mb-12"
						>
							Enter Amount
						</Typography>

						<TextField
							fullWidth
							type="number"
							value={partialAmount}
							onChange={handlePartialAmountChange}
							placeholder="Enter amount"
							inputProps={{
								min: minimumRemittableAmount,
								max: platformChargeBalance,
								step: 1000
							}}
							helperText={`Minimum: ${minimumRemittableAmount.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN',
								minimumFractionDigits: 0
							})}`}
							error={!isValidAmount && partialAmount > 0}
							sx={{ mb: 2 }}
						/>

						{/* Slider */}
						<Slider
							value={partialAmount}
							onChange={handleSliderChange}
							min={minimumRemittableAmount}
							max={platformChargeBalance}
							step={1000}
							marks={[
								{
									value: minimumRemittableAmount,
									label: '50%'
								},
								{
									value: platformChargeBalance,
									label: '100%'
								}
							]}
							valueLabelDisplay="auto"
							valueLabelFormat={(value) =>
								value.toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})
							}
						/>
					</Box>
				)}

				{/* Payment Summary */}
				<Box
					className="p-16 rounded-xl"
					sx={{
						backgroundColor: alpha(theme.palette.success.main, 0.05),
						border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
					}}
				>
					<Typography
						variant="subtitle2"
						className="font-semibold mb-12"
					>
						Payment Summary
					</Typography>

					<Box className="space-y-8">
						<Box className="flex items-center justify-between">
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Payment Amount
							</Typography>
							<Typography
								variant="body2"
								className="font-semibold"
							>
								{paymentAmount.toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})}
							</Typography>
						</Box>

						<Divider />

						<Box className="flex items-center justify-between">
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Remaining Balance
							</Typography>
							<Typography
								variant="body2"
								className="font-semibold"
								sx={{
									color: remainingBalance > 0 ? theme.palette.warning.main : theme.palette.success.main
								}}
							>
								{remainingBalance.toLocaleString('en-NG', {
									style: 'currency',
									currency: 'NGN',
									minimumFractionDigits: 0
								})}
							</Typography>
						</Box>
					</Box>
				</Box>

				{/* Information Note */}
				<Alert
					severity="info"
					className="mt-16"
					icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
				>
					Payment will be processed securely via Paystack. You'll receive a confirmation email after
					successful payment.
				</Alert>
			</DialogContent>

			<DialogActions className="px-24 pb-24">
				<Button
					onClick={handleClose}
					disabled={isProcessing}
					variant="outlined"
				>
					Cancel
				</Button>

				{isProcessing ? (
					<Button
						variant="contained"
						disabled
						startIcon={<CircularProgress size={20} />}
					>
						Processing...
					</Button>
				) : (
					<PaystackButton
						{...componentProps}
						className="MuiButton-root MuiButton-contained MuiButton-containedSuccess MuiButton-sizeMedium"
						style={{
							background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
							color: 'white',
							padding: '8px 22px',
							borderRadius: '8px',
							border: 'none',
							fontSize: '0.875rem',
							fontWeight: 600,
							textTransform: 'uppercase',
							cursor: isValidAmount ? 'pointer' : 'not-allowed',
							opacity: isValidAmount ? 1 : 0.5,
							boxShadow: isValidAmount
								? `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
								: 'none',
							transition: 'all 0.2s ease'
						}}
						disabled={!isValidAmount || platformChargeBalance <= 0}
					>
						Pay {paymentAmount.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 0
						})}
					</PaystackButton>
				)}
			</DialogActions>
		</Dialog>
	);
}

export default RemittancePlatformChargeDialog;
