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
	Stepper,
	Step,
	StepLabel,
	Alert,
	CircularProgress
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useCreateMerchantAccount } from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Validation schema
const schema = yup.object().shape({
	accountName: yup
		.string()
		.required('Account name is required')
		.min(3, 'Account name must be at least 3 characters'),
	accountPin: yup
		.string()
		.required('Account PIN is required')
		.matches(/^\d{4}$/, 'PIN must be exactly 4 digits'),
	confirmPin: yup
		.string()
		.required('Please confirm your PIN')
		.oneOf([yup.ref('accountPin')], 'PINs must match'),
	linkedBankName: yup.string().optional(),
	linkedBankAccountNumber: yup
		.string()
		.optional()
		.matches(/^\d{10}$/, 'Account number must be 10 digits'),
	linkedBankAccountName: yup.string().optional()
});

const steps = ['Account Details', 'Security', 'Bank Linking (Optional)'];

function CreateAccountDialog({ open, onClose, onSuccess, shopData }) {
	const [activeStep, setActiveStep] = useState(0);
	const [showPin, setShowPin] = useState(false);
	const [showConfirmPin, setShowConfirmPin] = useState(false);

	const { mutate: createAccount, isLoading } = useCreateMerchantAccount();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		trigger
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: {
			accountName: shopData?.shopName || '',
			accountPin: '',
			confirmPin: '',
			linkedBankName: '',
			linkedBankAccountNumber: '',
			linkedBankAccountName: ''
		}
	});

	const handleNext = async () => {
		let fieldsToValidate = [];

		if (activeStep === 0) {
			fieldsToValidate = ['accountName'];
		} else if (activeStep === 1) {
			fieldsToValidate = ['accountPin', 'confirmPin'];
		}

		const isValid = await trigger(fieldsToValidate);

		if (isValid) {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const onSubmit = (data) => {
		const { confirmPin, ...accountData } = data;

		createAccount(accountData, {
			onSuccess: (response) => {
				if (response?.data?.success) {
					reset();
					setActiveStep(0);
					onSuccess?.();
					onClose();
				}
			}
		});
	};

	const handleClose = () => {
		if (!isLoading) {
			reset();
			setActiveStep(0);
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="md"
			fullWidth
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
								heroicons-outline:credit-card
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								Create Your Fintech Account
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Set up your merchant finance account in 3 easy steps
							</Typography>
						</Box>
					</Box>
					<IconButton
						onClick={handleClose}
						disabled={isLoading}
						size="small"
					>
						<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent className="pt-24">
				<Stepper
					activeStep={activeStep}
					className="mb-32"
				>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				<Box className="mt-24">
					{activeStep === 0 && (
						<Box className="space-y-24">
							<Alert
								severity="info"
								icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							>
								Your account name will be used to identify your business in transactions
							</Alert>

							<Controller
								name="accountName"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Account Name"
										placeholder="Enter your business name"
										fullWidth
										required
										error={!!errors.accountName}
										helperText={errors.accountName?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon size={20}>heroicons-outline:office-building</FuseSvgIcon>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>

							<Box className="p-16 rounded-lg bg-gray-100 dark:bg-gray-800">
								<Typography
									variant="body2"
									color="text.secondary"
									className="mb-8"
								>
									Account Benefits:
								</Typography>
								<Box className="space-y-8">
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={16}
											className="text-green-600"
										>
											heroicons-solid:check-circle
										</FuseSvgIcon>
										<Typography variant="caption">Instant transaction processing</Typography>
									</Box>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={16}
											className="text-green-600"
										>
											heroicons-solid:check-circle
										</FuseSvgIcon>
										<Typography variant="caption">Real-time balance tracking</Typography>
									</Box>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={16}
											className="text-green-600"
										>
											heroicons-solid:check-circle
										</FuseSvgIcon>
										<Typography variant="caption">Secure fund management</Typography>
									</Box>
								</Box>
							</Box>
						</Box>
					)}

					{activeStep === 1 && (
						<Box className="space-y-24">
							<Alert
								severity="warning"
								icon={<FuseSvgIcon size={20}>heroicons-outline:shield-check</FuseSvgIcon>}
							>
								Create a 4-digit PIN to secure your account. Keep it confidential and never share it with anyone.
							</Alert>

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
										required
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
													>
														{showPin ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>

							<Controller
								name="confirmPin"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Confirm PIN"
										type={showConfirmPin ? 'text' : 'password'}
										placeholder="Re-enter your PIN"
										fullWidth
										required
										error={!!errors.confirmPin}
										helperText={errors.confirmPin?.message}
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
														onClick={() => setShowConfirmPin(!showConfirmPin)}
														edge="end"
													>
														{showConfirmPin ? <VisibilityOff /> : <Visibility />}
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
						<Box className="space-y-24">
							<Alert
								severity="info"
								icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							>
								Link your bank account for easy withdrawals. This step is optional and can be completed later.
							</Alert>

							<Controller
								name="linkedBankName"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Bank Name"
										placeholder="e.g., First Bank, GTBank"
										fullWidth
										error={!!errors.linkedBankName}
										helperText={errors.linkedBankName?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon size={20}>heroicons-outline:library</FuseSvgIcon>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>

							<Controller
								name="linkedBankAccountNumber"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Account Number"
										placeholder="Enter 10-digit account number"
										fullWidth
										error={!!errors.linkedBankAccountNumber}
										helperText={errors.linkedBankAccountNumber?.message}
										inputProps={{ maxLength: 10 }}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon size={20}>heroicons-outline:hashtag</FuseSvgIcon>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>

							<Controller
								name="linkedBankAccountName"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Account Name"
										placeholder="Account holder name"
										fullWidth
										error={!!errors.linkedBankAccountName}
										helperText={errors.linkedBankAccountName?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon size={20}>heroicons-outline:user</FuseSvgIcon>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>
						</Box>
					)}
				</Box>
			</DialogContent>

			<DialogActions className="px-24 pb-24">
				<Button
					onClick={handleClose}
					disabled={isLoading}
					color="inherit"
				>
					Cancel
				</Button>
				<Box className="flex-1" />
				{activeStep > 0 && (
					<Button
						onClick={handleBack}
						disabled={isLoading}
						variant="outlined"
					>
						Back
					</Button>
				)}
				{activeStep < steps.length - 1 ? (
					<Button
						onClick={handleNext}
						variant="contained"
						color="primary"
					>
						Next
					</Button>
				) : (
					<Button
						onClick={handleSubmit(onSubmit)}
						variant="contained"
						color="secondary"
						disabled={isLoading}
						startIcon={
							isLoading ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
							)
						}
					>
						{isLoading ? 'Creating Account...' : 'Create Account'}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}

export default CreateAccountDialog;
