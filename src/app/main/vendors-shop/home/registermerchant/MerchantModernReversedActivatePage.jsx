import { Controller, useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import _ from '@lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStoreShopPreSignUpFromOtp } from 'app/configs/data/server-calls/useShops/useShopsQuery';
import {
	getMerchantSignUpToken,
	removeMerchantSignUpToken,
	removeResendMerchantSignUpOtp
} from 'app/configs/utils/authUtils';
import { useEffect, useState, useCallback } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * Form Validation Schema
 */
const schema = z.object({
	otp: z.string().min(1, 'You must enter your OTP').length(6, 'OTP must be exactly 6 digits')
});

const defaultValues = {
	otp: '',
	preuser: ''
};

// Styled components for enhanced UI
const OTPInput = styled(TextField)(() => ({
	'& .MuiOutlinedInput-root': {
		fontSize: '32px',
		fontWeight: 700,
		letterSpacing: '8px',
		textAlign: 'center',
		'& input': {
			textAlign: 'center'
		},
		'&.Mui-focused fieldset': {
			borderColor: '#FF6B35',
			borderWidth: '2px'
		}
	}
}));

/**
 * Production-Ready Merchant Account Activation Page
 * Features: Professional design, countdown timer, OTP validation, responsive layout
 */
function MerchantModernReversedActivatePage({ resendOTP }) {
	const remoteResponseToken = getMerchantSignUpToken();
	const activateMerchant = useStoreShopPreSignUpFromOtp();

	const { control, formState, handleSubmit, reset, getValues, setValue } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	// Timer state - 10 minutes (600 seconds)
	const [timeLeft, setTimeLeft] = useState(600);
	const [canResend, setCanResend] = useState(false);
	const [isResending, setIsResending] = useState(false);

	// Format time as MM:SS
	const formatTime = useCallback((seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}, []);

	// Calculate progress percentage for visual indicator
	const progress = ((600 - timeLeft) / 600) * 100;

	// Countdown timer effect
	useEffect(() => {
		if (timeLeft === 0) {
			setCanResend(true);
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setCanResend(true);
					return 0;
				}

				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	// Handle OTP resend
	const handleResendOTP = useCallback(() => {
		setIsResending(true);
		resendOTP();

		// Reset timer after a brief delay
		setTimeout(() => {
			setTimeLeft(600);
			setCanResend(false);
			setIsResending(false);
			reset({ otp: '' });
		}, 1000);
	}, [resendOTP, reset]);

	// Form submission
	function onSubmit() {
		setValue('preuser', remoteResponseToken);
		activateMerchant.mutate(getValues());
	}

	// Cleanup on successful activation
	useEffect(() => {
		if (activateMerchant?.isSuccess) {
			removeMerchantSignUpToken();
			removeResendMerchantSignUpOtp();
		}
	}, [activateMerchant?.isSuccess]);

	// Determine timer color based on time remaining
	const getTimerColor = () => {
		if (timeLeft > 300) return '#10B981'; // Green (>5 minutes)

		if (timeLeft > 120) return '#F59E0B'; // Orange (2-5 minutes)

		return '#EF4444'; // Red (<2 minutes)
	};

	return (
		<Box className="w-full px-16 py-48 ltr:border-l-1 rtl:border-r-1 sm:w-auto sm:p-48 md:p-64">
			<div className="mx-auto w-full max-w-384 sm:mx-0 sm:w-384">
				{/* Logo */}
				<motion.img
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-48"
					src="assets/images/afslogo/afslogo.png"
					alt="AfricanShops Logo"
				/>

				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Typography className="mt-32 text-40 font-black leading-tight tracking-tight">
						Verify Your Account
					</Typography>
					<Typography
						className="mt-8 text-16"
						color="text.secondary"
					>
						We've sent a 6-digit verification code to your email. Enter it below to activate your merchant
						account.
					</Typography>
				</motion.div>

				{/* Timer Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Paper
						elevation={0}
						className="mt-32 p-24 rounded-xl"
						sx={{
							background: alpha(getTimerColor(), 0.1),
							border: `1px solid ${alpha(getTimerColor(), 0.2)}`
						}}
					>
						<Box className="flex items-center justify-between mb-12">
							<Box className="flex items-center gap-12">
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: '10px',
										backgroundColor: alpha(getTimerColor(), 0.2),
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<FuseSvgIcon
										size={20}
										sx={{ color: getTimerColor() }}
									>
										heroicons-outline:clock
									</FuseSvgIcon>
								</Box>
								<div>
									<Typography
										className="text-12 font-bold"
										sx={{ color: alpha('#000', 0.6) }}
									>
										Code expires in
									</Typography>
									<Typography
										className="text-32 font-black"
										sx={{
											color: getTimerColor(),
											lineHeight: 1,
											fontVariantNumeric: 'tabular-nums'
										}}
									>
										{formatTime(timeLeft)}
									</Typography>
								</div>
							</Box>

							{timeLeft === 0 && (
								<Chip
									label="Expired"
									size="small"
									sx={{
										backgroundColor: '#EF4444',
										color: 'white',
										fontWeight: 700
									}}
								/>
							)}
						</Box>

						<LinearProgress
							variant="determinate"
							value={progress}
							sx={{
								height: 6,
								borderRadius: 3,
								backgroundColor: alpha(getTimerColor(), 0.2),
								'& .MuiLinearProgress-bar': {
									backgroundColor: getTimerColor(),
									borderRadius: 3,
									transition: 'background-color 0.3s ease'
								}
							}}
						/>
					</Paper>
				</motion.div>

				{/* OTP Form */}
				<motion.form
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					name="activateForm"
					noValidate
					className="mt-32 flex w-full flex-col justify-center"
					onSubmit={handleSubmit(onSubmit)}
				>
					{/* OTP Input */}
					<Controller
						name="otp"
						control={control}
						render={({ field }) => (
							<OTPInput
								{...field}
								className="mb-24"
								label="Enter 6-Digit Code"
								type="text"
								error={!!errors.otp}
								helperText={errors?.otp?.message || 'Check your email for the verification code'}
								variant="outlined"
								required
								fullWidth
								inputProps={{
									maxLength: 6,
									pattern: '[0-9]*',
									inputMode: 'numeric'
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon
												size={24}
												color="action"
											>
												heroicons-outline:shield-check
											</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>

					{/* Activate Button */}
					<Button
						variant="contained"
						className="mt-16 w-full"
						aria-label="Activate Account"
						disabled={_.isEmpty(dirtyFields) || !isValid || activateMerchant.isLoading || timeLeft === 0}
						type="submit"
						size="large"
						sx={{
							background: 'linear-gradient(90deg, #FF6B35 0%, #F77F00 100%)',
							color: 'white',
							fontWeight: 700,
							fontSize: '16px',
							padding: '14px',
							'&:hover': {
								background: 'linear-gradient(90deg, #F77F00 0%, #FF6B35 100%)'
							},
							'&:disabled': {
								background: alpha('#FF6B35', 0.3),
								color: 'rgba(255, 255, 255, 0.5)'
							}
						}}
						endIcon={
							activateMerchant.isLoading ? (
								<FuseSvgIcon
									size={20}
									className="animate-spin"
								>
									heroicons-outline:refresh
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>
							)
						}
					>
						{activateMerchant.isLoading ? 'Activating...' : 'Activate Account'}
					</Button>

					{/* Resend OTP Section */}
					<AnimatePresence mode="wait">
						{canResend ? (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="mt-32"
							>
								<Paper
									elevation={0}
									className="p-20 rounded-xl text-center"
									sx={{
										background: alpha('#EF4444', 0.1),
										border: `1px solid ${alpha('#EF4444', 0.2)}`
									}}
								>
									<FuseSvgIcon
										size={32}
										sx={{ color: '#EF4444', mb: 2 }}
									>
										heroicons-outline:exclamation-circle
									</FuseSvgIcon>
									<Typography
										className="text-16 font-bold mb-8"
										sx={{ color: '#EF4444' }}
									>
										Code Expired
									</Typography>
									<Typography
										className="text-14 mb-16"
										color="text.secondary"
									>
										Your verification code has expired. Request a new one to continue.
									</Typography>
									<Button
										variant="contained"
										fullWidth
										onClick={handleResendOTP}
										disabled={isResending}
										sx={{
											background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
											color: 'white',
											fontWeight: 700,
											'&:hover': {
												background: 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)'
											}
										}}
										startIcon={
											isResending ? (
												<FuseSvgIcon
													size={20}
													className="animate-spin"
												>
													heroicons-outline:refresh
												</FuseSvgIcon>
											) : (
												<FuseSvgIcon size={20}>heroicons-outline:mail</FuseSvgIcon>
											)
										}
									>
										{isResending ? 'Sending...' : 'Resend Verification Code'}
									</Button>
								</Paper>
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="mt-32 text-center"
							>
								<Typography
									className="text-14"
									color="text.secondary"
								>
									Didn't receive the code?{' '}
									<Typography
										component="span"
										className="text-14 font-bold"
										sx={{ color: alpha('#FF6B35', 0.7) }}
									>
										Wait {formatTime(timeLeft)} to resend
									</Typography>
								</Typography>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.form>

				{/* Help Section */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
				>
					<Box
						className="mt-40 p-16 rounded-lg flex items-start gap-12"
						sx={{
							backgroundColor: alpha('#3B82F6', 0.1),
							border: `1px solid ${alpha('#3B82F6', 0.2)}`
						}}
					>
						<FuseSvgIcon
							size={20}
							sx={{ color: '#3B82F6', flexShrink: 0, mt: '2px' }}
						>
							heroicons-outline:information-circle
						</FuseSvgIcon>
						<div>
							<Typography
								className="text-13 font-bold mb-4"
								sx={{ color: '#3B82F6' }}
							>
								Having trouble?
							</Typography>
							<Typography
								className="text-12"
								color="text.secondary"
							>
								Check your spam folder or ensure you entered the correct email address. The code is
								valid for 10 minutes.
							</Typography>
						</div>
					</Box>
				</motion.div>

				{/* Security Badge */}
				<Box className="mt-24 flex items-center justify-center gap-8">
					<FuseSvgIcon
						size={16}
						sx={{ color: '#10B981' }}
					>
						heroicons-solid:shield-check
					</FuseSvgIcon>
					<Typography
						className="text-12"
						sx={{ color: '#10B981', fontWeight: 600 }}
					>
						Secure verification process
					</Typography>
				</Box>
			</div>
		</Box>
	);
}

export default MerchantModernReversedActivatePage;
