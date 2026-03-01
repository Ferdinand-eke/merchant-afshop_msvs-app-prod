import { useState, useEffect } from 'react';
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
	CircularProgress,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	FormHelperText
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useCreateMerchantAccount,
	useResolveAccountNumber,
	useGetBanksList
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';
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
	verifyBankName: yup.string().optional(),
	verifyBankAccountNumber: yup
		.string()
		.optional()
		.matches(/^\d{10}$/, 'Account number must be 10 digits'),
	accountOwnershipConsent: yup
		.boolean()
		.optional()
		.oneOf([true], 'You must confirm account ownership to proceed'),
	linkedBankName: yup.string().optional(),
	linkedBankAccountNumber: yup.string().optional(),
	linkedBankAccountName: yup.string().optional(),
	linkedBankId: yup.string().optional()
});

const steps = ['Account Details', 'Security', 'Bank Verification (Optional)', 'Confirm Bank Details'];

const SESSION_STORAGE_KEY = 'createAccountDialog_state';

// Get environment variable
const isDevelopment = import.meta.env.VITE_ENV === 'Development';

function CreateAccountDialog({ open, onClose, onSuccess, shopData }) {
	const [activeStep, setActiveStep] = useState(0);
	const [showPin, setShowPin] = useState(false);
	const [showConfirmPin, setShowConfirmPin] = useState(false);
	const [verifiedBankDetails, setVerifiedBankDetails] = useState(null);
	const [bankSearchTerm, setBankSearchTerm] = useState('');
	const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

	const { mutate: createAccount, isLoading } = useCreateMerchantAccount();
	const { mutate: resolveAccount, isLoading: isResolvingAccount } = useResolveAccountNumber();
	const { data: banksList = [], isLoading: isLoadingBanks } = useGetBanksList({
		country: 'nigeria',
		perPage: 100
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		trigger,
		setValue
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: {
			accountName: shopData?.shopName || '',
			accountPin: '',
			confirmPin: '',
			verifyBankName: '',
			verifyBankAccountNumber: '',
			accountOwnershipConsent: false,
			linkedBankName: '',
			linkedBankAccountNumber: '',
			linkedBankAccountName: '',
			linkedBankId: ''
		}
	});

	// Restore state from session storage on mount
	useEffect(() => {
		const savedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (savedState && open) {
			try {
				const parsedState = JSON.parse(savedState);
				setActiveStep(parsedState.activeStep || 0);
				setVerifiedBankDetails(parsedState.verifiedBankDetails || null);

				// Restore form values
				if (parsedState.formValues) {
					Object.keys(parsedState.formValues).forEach((key) => {
						setValue(key, parsedState.formValues[key]);
					});
				}
			} catch (error) {
				console.error('Error restoring dialog state:', error);
			}
		}
	}, [open, setValue]);

	// Save state to session storage whenever it changes
	useEffect(() => {
		if (open) {
			const currentFormValues = watch();
			const stateToSave = {
				activeStep,
				verifiedBankDetails,
				formValues: currentFormValues
			};

			try {
				sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
			} catch (error) {
				console.error('Error saving dialog state:', error);
			}
		}
	}, [activeStep, verifiedBankDetails, watch, open]);

	const handleVerifyBank = async () => {
		const bankName = watch('verifyBankName');
		const accountNumber = watch('verifyBankAccountNumber');

		if (!bankName || !accountNumber) {
			return;
		}

		// Find the bank details from the banks list
		const selectedBank = banksList.find((bank) => bank.name === bankName);
		const bankCode = selectedBank?.code;

		// Resolve account number to get account name
		resolveAccount(
			{
				account_number: accountNumber,
				bank_code: bankCode
			},
			{
				onSuccess: (resolveResponse) => {
					if (resolveResponse?.data?.success) {
						const resolvedData = resolveResponse?.data?.data || resolveResponse?.data?.payload;
						const accountName = resolvedData?.account_name;
						const bankId = resolvedData?.bank_id;

						console.log('Account Resolution Data:', resolveResponse?.data);

						// Store complete verification data
						const completeVerificationData = {
							// Bank details
							bankName,
							bankCode,
							accountNumber,
							accountName,
							bankId,
							// Selected bank info from list
							bankDetails: selectedBank,
							// Resolution API response
							resolutionResponse: resolveResponse?.data,
							// Verification metadata
							verificationMethod: 'account_resolution',
							verificationStatus: 'verified',
							verifiedAt: new Date().toISOString()
						};

						setVerifiedBankDetails(completeVerificationData);

						// Auto-populate the confirmed bank details
						setValue('linkedBankName', bankName);
						setValue('linkedBankAccountNumber', accountNumber);
						setValue('linkedBankAccountName', accountName);
						setValue('linkedBankId', bankId?.toString() || '');

						setActiveStep(3); // Move to confirmation step
					} else {
						alert(
							resolveResponse?.data?.message ||
								'Failed to verify account number. Please check your details.'
						);
					}
				}
			}
		);
	};

	const handleNext = async () => {
		let fieldsToValidate = [];

		if (activeStep === 0) {
			fieldsToValidate = ['accountName'];
		} else if (activeStep === 1) {
			fieldsToValidate = ['accountPin', 'confirmPin'];
		} else if (activeStep === 2) {
			// Step 2 is optional, allow skipping
			const hasAnyBankData = watch('verifyBankName') || watch('verifyBankAccountNumber');

			if (hasAnyBankData) {
				// If user started filling, validate required fields
				fieldsToValidate = ['verifyBankName', 'verifyBankAccountNumber', 'accountOwnershipConsent'];
				const isValid = await trigger(fieldsToValidate);

				if (!isValid) {
					return;
				}

				// Trigger verification instead of moving forward
				handleVerifyBank();
				return;
			}
		}

		const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;

		if (isValid) {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const onSubmit = (data) => {
		const {
			confirmPin,
			verifyBankName,
			verifyBankAccountNumber,
			accountOwnershipConsent,
			...accountData
		} = data;

		// Prepare complete account creation payload with verification data
		const completeAccountData = {
			...accountData,
			// Include complete bank verification data if available
			bankVerificationData: verifiedBankDetails || null
		};

		console.log('Complete Account Creation Payload:', completeAccountData);


		return;
		createAccount(completeAccountData, {
			onSuccess: (response) => {
				if (response?.data?.success) {
					console.log('Account Creation Response:', response?.data);

					// Clear session storage on successful account creation
					sessionStorage.removeItem(SESSION_STORAGE_KEY);

					reset();
					setActiveStep(0);
					setVerifiedBankDetails(null);
					onSuccess?.();
					onClose();
				}
			}
		});
	};

	const handleCloseAttempt = () => {
		if (!isLoading && !isResolvingAccount) {
			// Show confirmation dialog before closing
			setShowCloseConfirmation(true);
		}
	};

	const handleConfirmClose = () => {
		// Clear session storage when manually closing
		sessionStorage.removeItem(SESSION_STORAGE_KEY);

		reset();
		setActiveStep(0);
		setVerifiedBankDetails(null);
		setShowCloseConfirmation(false);
		onClose();
	};

	const handleCancelClose = () => {
		setShowCloseConfirmation(false);
	};

	// If in production, show "feature under development" message
	if (!isDevelopment) {
		return (
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="sm"
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
									background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={24}
								>
									heroicons-outline:wrench-screwdriver
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-semibold"
								>
									Feature Under Development
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Coming soon to enhance your experience
								</Typography>
							</Box>
						</Box>
						<IconButton
							onClick={onClose}
							size="small"
						>
							<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
				</DialogTitle>

				<DialogContent className="pt-24">
					<Alert
						severity="info"
						icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
						className="mb-24"
					>
						<Typography
							variant="body2"
							className="font-medium mb-8"
						>
							Fintech Account Creation
						</Typography>
						<Typography variant="caption">
							We're currently developing this feature to provide you with a seamless financial account
							management experience. This feature will be available soon.
						</Typography>
					</Alert>

					<Box className="p-20 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-700">
						<Typography
							variant="body2"
							className="font-semibold mb-12 flex items-center gap-8"
						>
							<FuseSvgIcon
								size={20}
								className="text-orange-600"
							>
								heroicons-outline:sparkles
							</FuseSvgIcon>
							What to Expect
						</Typography>
						<Box
							component="ul"
							className="space-y-8 ml-20"
						>
							<Typography
								component="li"
								variant="caption"
							>
								Create and manage your merchant fintech account
							</Typography>
							<Typography
								component="li"
								variant="caption"
							>
								Link your bank account for seamless withdrawals
							</Typography>
							<Typography
								component="li"
								variant="caption"
							>
								Track earnings and manage transactions in real-time
							</Typography>
							<Typography
								component="li"
								variant="caption"
							>
								Secure PIN-protected access for all financial operations
							</Typography>
						</Box>
					</Box>

					<Alert
						severity="warning"
						icon={<FuseSvgIcon size={20}>heroicons-outline:clock</FuseSvgIcon>}
						className="mt-24"
					>
						<Typography variant="caption">
							<strong>Stay Tuned!</strong> We'll notify you as soon as this feature becomes available. Thank
							you for your patience.
						</Typography>
					</Alert>
				</DialogContent>

				<DialogActions className="px-24 pb-24">
					<Button
						onClick={onClose}
						variant="contained"
						color="primary"
						fullWidth
					>
						Got It
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	return (
		<Dialog
			open={open}
			onClose={(_event, reason) => {
				// Prevent closing on backdrop click or escape key
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
					return;
				}
			}}
			maxWidth="md"
			fullWidth
			disableEscapeKeyDown
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
								Set up your merchant finance account in 4 easy steps
							</Typography>
						</Box>
					</Box>
					<IconButton
						onClick={handleCloseAttempt}
						disabled={isLoading || isResolvingAccount}
						size="small"
					>
						<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent className="pt-24">
				{/* Development Mode Badge */}
				<Alert
					severity="warning"
					className="mb-24"
					icon={<FuseSvgIcon size={20}>heroicons-outline:beaker</FuseSvgIcon>}
				>
					<Typography
						variant="caption"
						component="div"
						className="font-semibold"
					>
						DEVELOPMENT MODE - This feature is currently under development
					</Typography>
				</Alert>

				{/* Persistence Info Alert */}
				<Alert
					severity="info"
					className="mb-24"
					icon={<FuseSvgIcon size={20}>heroicons-outline:shield-check</FuseSvgIcon>}
				>
					<Typography
						variant="caption"
						component="div"
					>
						Your progress is automatically saved. You can safely refresh this page and continue where you left
						off.
					</Typography>
				</Alert>

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
								Verify your bank account for secure withdrawals. This step is optional and can be completed
								later.
							</Alert>

							<Controller
								name="verifyBankName"
								control={control}
								render={({ field }) => {
									// Filter banks based on search term
									const filteredBanks = banksList.filter((bank) =>
										bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
									);

									return (
										<FormControl
											fullWidth
											error={!!errors.verifyBankName}
										>
											<InputLabel id="bank-name-label">Bank Name</InputLabel>
											<Select
												{...field}
												labelId="bank-name-label"
												label="Bank Name"
												disabled={isLoadingBanks}
												MenuProps={{
													PaperProps: {
														style: {
															maxHeight: 400
														}
													}
												}}
												startAdornment={
													<InputAdornment position="start">
														<FuseSvgIcon size={20}>heroicons-outline:library</FuseSvgIcon>
													</InputAdornment>
												}
												onOpen={() => setBankSearchTerm('')}
											>
												<Box className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-8">
													<TextField
														placeholder="Search banks..."
														size="small"
														fullWidth
														value={bankSearchTerm}
														onChange={(e) => setBankSearchTerm(e.target.value)}
														onClick={(e) => e.stopPropagation()}
														onKeyDown={(e) => e.stopPropagation()}
														InputProps={{
															startAdornment: (
																<InputAdornment position="start">
																	<FuseSvgIcon size={16}>heroicons-outline:search</FuseSvgIcon>
																</InputAdornment>
															)
														}}
													/>
												</Box>

												{isLoadingBanks ? (
													<MenuItem disabled>
														<Box className="flex items-center gap-8">
															<CircularProgress size={20} />
															<Typography variant="body2">Loading banks...</Typography>
														</Box>
													</MenuItem>
												) : filteredBanks.length === 0 ? (
													<MenuItem disabled>
														<Typography variant="body2">
															{bankSearchTerm ? 'No banks match your search' : 'No banks available'}
														</Typography>
													</MenuItem>
												) : (
													filteredBanks.map((bank) => (
														<MenuItem
															key={bank.code || bank.id}
															value={bank.name}
														>
															{bank.name}
														</MenuItem>
													))
												)}
											</Select>
											{errors.verifyBankName && (
												<FormHelperText>{errors.verifyBankName?.message}</FormHelperText>
											)}
										</FormControl>
									);
								}}
							/>

							<Controller
								name="verifyBankAccountNumber"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Account Number"
										placeholder="Enter 10-digit account number"
										fullWidth
										error={!!errors.verifyBankAccountNumber}
										helperText={errors.verifyBankAccountNumber?.message}
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

							<Alert
								severity="warning"
								icon={<FuseSvgIcon size={20}>heroicons-outline:shield-exclamation</FuseSvgIcon>}
							>
								<Typography
									variant="body2"
									className="font-medium mb-8"
								>
									Legal Disclaimer & Account Ownership
								</Typography>
								<Typography
									variant="caption"
									component="div"
									className="mb-12"
								>
									By proceeding with bank account verification, you confirm that:
								</Typography>
								<Box
									component="ul"
									className="space-y-4 ml-16"
								>
									<Typography
										component="li"
										variant="caption"
									>
										The bank account details provided belong to you
									</Typography>
									<Typography
										component="li"
										variant="caption"
									>
										You have the legal right to operate this account
									</Typography>
									<Typography
										component="li"
										variant="caption"
									>
										You authorize us to verify this account for payout purposes
									</Typography>
									<Typography
										component="li"
										variant="caption"
									>
										You understand that providing false information may result in account suspension
									</Typography>
								</Box>
							</Alert>

							<Controller
								name="accountOwnershipConsent"
								control={control}
								render={({ field }) => (
									<Box>
										<FormControlLabel
											control={
												<Checkbox
													{...field}
													checked={field.value}
													color="secondary"
												/>
											}
											label={
												<Typography variant="body2">
													<strong>I confirm that I own this account and have the legal right to operate it</strong>
												</Typography>
											}
										/>
										{errors.accountOwnershipConsent && (
											<Typography
												variant="caption"
												color="error"
												className="ml-32 block"
											>
												{errors.accountOwnershipConsent?.message}
											</Typography>
										)}
									</Box>
								)}
							/>
						</Box>
					)}

					{activeStep === 3 && (
						<Box className="space-y-24">
							{verifiedBankDetails ? (
								<>
									<Alert
										severity="success"
										icon={<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>}
									>
										Bank account verified successfully! Please review and confirm the details below.
									</Alert>

									<Box className="p-16 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
										<Typography
											variant="subtitle2"
											className="font-semibold mb-16 flex items-center gap-8"
										>
											<FuseSvgIcon
												size={20}
												className="text-green-600"
											>
												heroicons-solid:check-badge
											</FuseSvgIcon>
											Verified Bank Account Details
										</Typography>
										<Box className="space-y-12">
											<Box className="flex justify-between">
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Bank Name:
												</Typography>
												<Typography
													variant="body2"
													className="font-medium"
												>
													{verifiedBankDetails.bankName}
												</Typography>
											</Box>
											<Box className="flex justify-between">
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Account Number:
												</Typography>
												<Typography
													variant="body2"
													className="font-medium"
												>
													{verifiedBankDetails.accountNumber}
												</Typography>
											</Box>
											<Box className="flex justify-between">
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Account Name:
												</Typography>
												<Typography
													variant="body2"
													className="font-medium"
												>
													{verifiedBankDetails.accountName}
												</Typography>
											</Box>
										</Box>
									</Box>

									<Controller
										name="linkedBankName"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Bank Name"
												fullWidth
												disabled
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
												fullWidth
												disabled
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
												fullWidth
												disabled
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
								</>
							) : (
								<Alert
									severity="info"
									icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
								>
									You chose to skip bank verification. You can link your bank account later from account
									settings.
								</Alert>
							)}
						</Box>
					)}
				</Box>
			</DialogContent>

			<DialogActions className="px-24 pb-24">
				<Button
					onClick={handleCloseAttempt}
					disabled={isLoading || isResolvingAccount}
					color="inherit"
				>
					Cancel
				</Button>
				<Box className="flex-1" />
				{activeStep > 0 && (
					<Button
						onClick={handleBack}
						disabled={isLoading || isResolvingAccount}
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
						disabled={isResolvingAccount}
						startIcon={
							isResolvingAccount && activeStep === 2 ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : null
						}
					>
						{isResolvingAccount && activeStep === 2
							? 'Verifying...'
							: activeStep === 2
								? 'Verify & Continue'
								: 'Next'}
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

			{/* Confirmation Dialog */}
			<Dialog
				open={showCloseConfirmation}
				onClose={handleCancelClose}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<FuseSvgIcon
							className="text-orange-600"
							size={24}
						>
							heroicons-outline:exclamation-triangle
						</FuseSvgIcon>
						<Typography variant="h6">Confirm Close</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Typography variant="body2">
						Are you sure you want to close this dialog? Your progress has been saved and you can continue
						later.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCancelClose}
						color="inherit"
					>
						Continue Creating
					</Button>
					<Button
						onClick={handleConfirmClose}
						variant="contained"
						color="error"
					>
						Yes, Close
					</Button>
				</DialogActions>
			</Dialog>
		</Dialog>
	);
}

export default CreateAccountDialog;
