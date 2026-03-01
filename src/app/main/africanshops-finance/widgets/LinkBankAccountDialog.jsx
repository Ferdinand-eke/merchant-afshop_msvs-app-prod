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
	useResolveAccountNumber,
	useGetBanksList,
	useLinkBankAccount
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';

// Validation schema
const schema = yup.object().shape({
	bankName: yup.string().required('Bank name is required'),
	accountNumber: yup
		.string()
		.required('Account number is required')
		.matches(/^\d{10}$/, 'Account number must be 10 digits'),
	accountPin: yup
		.string()
		.required('Account PIN is required for security')
		.matches(/^\d{4}$/, 'PIN must be exactly 4 digits'),
	accountOwnershipConsent: yup
		.boolean()
		.required('You must confirm account ownership')
		.oneOf([true], 'You must confirm account ownership to proceed')
});

function LinkBankAccountDialog({ open, onClose, shopData }) {
	const [bankSearchTerm, setBankSearchTerm] = useState('');
	const [verifiedBankDetails, setVerifiedBankDetails] = useState(null);
	const [verificationStep, setVerificationStep] = useState('input'); // 'input' | 'verified'
	const [showPin, setShowPin] = useState(false);

	const { mutate: resolveAccount, isLoading: isResolvingAccount } = useResolveAccountNumber();
	const { mutate: linkBankAccount, isLoading: isLinkingAccount } = useLinkBankAccount();
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
		trigger
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
		defaultValues: {
			bankName: '',
			accountNumber: '',
			accountPin: '',
			accountOwnershipConsent: false
		}
	});

	const handleVerifyBank = async () => {
		const isValid = await trigger(['bankName', 'accountNumber', 'accountPin', 'accountOwnershipConsent']);

		if (!isValid) {
			return;
		}

		const bankName = watch('bankName');
		const accountNumber = watch('accountNumber');
		const accountPin = watch('accountPin');

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

						// Store complete verification data
						const completeVerificationData = {
							bankName,
							bankCode,
							accountNumber,
							accountName,
							bankId,
							bankDetails: selectedBank,
							resolutionResponse: resolveResponse?.data,
							verificationMethod: 'account_resolution',
							verificationStatus: 'verified',
							verifiedAt: new Date().toISOString()
						};

						setVerifiedBankDetails(completeVerificationData);
						setVerificationStep('verified');
					} else {
						alert(
							resolveResponse?.data?.message ||
								'Failed to verify account number. Please check your details.'
						);
					}
				},
				onError: (error) => {
					alert(
						error?.response?.data?.message ||
							'Failed to verify account. Please check your details and try again.'
					);
				}
			}
		);
	};

	const handleLinkAccount = () => {
		if (!verifiedBankDetails) {
			return;
		}

		const accountPin = watch('accountPin');

		const linkData = {
			linkedBankName: verifiedBankDetails.bankName,
			linkedBankAccountNumber: verifiedBankDetails.accountNumber,
			linkedBankAccountName: verifiedBankDetails.accountName,
			linkedBankId: verifiedBankDetails.bankId?.toString() || '',
			linkedBankCode: verifiedBankDetails.bankCode,
			accountPin,
			bankVerificationData: verifiedBankDetails
		};

		linkBankAccount(linkData, {
			onSuccess: (response) => {
				if (response?.data?.success) {
					reset();
					setVerifiedBankDetails(null);
					setVerificationStep('input');
					onClose();
				}
			},
			onError: (error) => {
				alert(
					error?.response?.data?.message || 'Failed to link bank account. Please try again.'
				);
			}
		});
	};

	const handleDialogClose = () => {
		if (!isResolvingAccount && !isLinkingAccount) {
			reset();
			setVerifiedBankDetails(null);
			setVerificationStep('input');
			setShowPin(false);
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleDialogClose}
			maxWidth="sm"
			fullWidth
			disableEscapeKeyDown={isResolvingAccount || isLinkingAccount}
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
								heroicons-outline:link
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								Link Bank Account
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{verificationStep === 'input'
									? 'Verify your bank account for withdrawals'
									: 'Confirm and link your account'}
							</Typography>
						</Box>
					</Box>
					<IconButton
						onClick={handleDialogClose}
						disabled={isResolvingAccount || isLinkingAccount}
						size="small"
					>
						<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent className="pt-24">
				{verificationStep === 'input' ? (
					<Box className="space-y-24">
						<Alert
							severity="info"
							icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
						>
							Link your bank account to enable direct withdrawals. All withdrawals will be sent to this
							account.
						</Alert>

						<Controller
							name="bankName"
							control={control}
							render={({ field }) => {
								const filteredBanks = banksList.filter((bank) =>
									bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
								);

								return (
									<FormControl
										fullWidth
										error={!!errors.bankName}
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
										{errors.bankName && <FormHelperText>{errors.bankName?.message}</FormHelperText>}
									</FormControl>
								);
							}}
						/>

						<Controller
							name="accountNumber"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Account Number"
									placeholder="Enter 10-digit account number"
									fullWidth
									error={!!errors.accountNumber}
									helperText={errors.accountNumber?.message}
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

						<Alert
							severity="info"
							icon={<FuseSvgIcon size={20}>heroicons-outline:shield-check</FuseSvgIcon>}
						>
							<Typography
								variant="body2"
								className="font-medium mb-4"
							>
								Security Notice
							</Typography>
							<Typography variant="caption">
								Your account PIN is required to securely link this bank account. This PIN will be needed
								for all future withdrawal transactions.
							</Typography>
						</Alert>

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
				) : (
					<Box className="space-y-24">
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
										{verifiedBankDetails?.bankName}
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
										{verifiedBankDetails?.accountNumber}
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
										{verifiedBankDetails?.accountName}
									</Typography>
								</Box>
							</Box>
						</Box>

						<Alert
							severity="warning"
							icon={<FuseSvgIcon size={20}>heroicons-outline:exclamation-triangle</FuseSvgIcon>}
						>
							<Typography
								variant="body2"
								className="font-medium mb-4"
							>
								Important Notice
							</Typography>
							<Typography variant="caption">
								All future withdrawals will be sent to this bank account. Make sure the details are correct
								before proceeding.
							</Typography>
						</Alert>
					</Box>
				)}
			</DialogContent>

			<DialogActions className="px-24 pb-24">
				<Button
					onClick={handleDialogClose}
					disabled={isResolvingAccount || isLinkingAccount}
					color="inherit"
				>
					Cancel
				</Button>
				<Box className="flex-1" />
				{verificationStep === 'input' ? (
					<Button
						onClick={handleVerifyBank}
						variant="contained"
						color="secondary"
						disabled={isResolvingAccount}
						startIcon={
							isResolvingAccount ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={20}>heroicons-outline:shield-check</FuseSvgIcon>
							)
						}
					>
						{isResolvingAccount ? 'Verifying...' : 'Verify Account'}
					</Button>
				) : (
					<Button
						onClick={handleLinkAccount}
						variant="contained"
						color="secondary"
						disabled={isLinkingAccount}
						startIcon={
							isLinkingAccount ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
							)
						}
					>
						{isLinkingAccount ? 'Linking Account...' : 'Link Account'}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}

export default LinkBankAccountDialog;
