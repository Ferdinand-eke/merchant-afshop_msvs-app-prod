import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Collapse } from '@mui/material';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useShopSettingsCloseShopAccount } from 'app/configs/data/server-calls/auth/useAuth';

const defaultValues = {
	shopemail: '',
	checkEmail: '',
	closeAccount: false
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	shopemail: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
	checkEmail: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
	closeAccount: z.boolean()
});

function CloseAccountSetting(props) {
	const { basemerchant } = props;
	const closeThisAccount = useShopSettingsCloseShopAccount();
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const { control, reset, watch, handleSubmit, formState, getValues } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	const { closeAccount } = watch();

	useEffect(() => {
		reset(basemerchant);
	}, [basemerchant, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData, e) {
		e.preventDefault();
	}

	const handleCloseAccount = () => {
		if (getValues().shopemail?.toString() === getValues()?.checkEmail?.toString()) {
			setConfirmDialogOpen(true);
		} else {
			toast.error('You have entered incorrect email details. Please verify and try again.');
		}
	};

	const confirmAccountClosure = () => {
		setConfirmDialogOpen(false);
		closeThisAccount.mutate();
	};

	return (
		<Paper
			elevation={0}
			sx={{
				p: 4,
				mb: 3,
				background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
				border: '2px solid rgba(220, 38, 38, 0.2)',
				borderRadius: 2
			}}
		>
			<Box className="flex items-center gap-12 mb-24">
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: '12px',
						background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
					}}
				>
					<FuseSvgIcon
						className="text-white"
						size={24}
					>
						heroicons-outline:exclamation-triangle
					</FuseSvgIcon>
				</Box>
				<Box>
					<Typography
						variant="h6"
						className="font-bold"
						sx={{ color: '#292524', mb: 0.5 }}
					>
						Danger Zone
					</Typography>
					<Typography
						variant="caption"
						sx={{ color: '#78716c' }}
					>
						Permanently delete your merchant account
					</Typography>
				</Box>
			</Box>

			{/* Warning Alert */}
			<Paper
				elevation={0}
				sx={{
					p: 2,
					mb: 3,
					background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.08) 100%)',
					border: '1px solid rgba(220, 38, 38, 0.3)',
					borderRadius: 1.5
				}}
			>
				<Box className="flex items-start gap-12">
					<FuseSvgIcon
						size={18}
						sx={{ color: '#dc2626', mt: 0.25 }}
					>
						heroicons-outline:shield-exclamation
					</FuseSvgIcon>
					<Box>
						<Typography
							variant="body2"
							sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
						>
							Account Deletion is Permanent
						</Typography>
						<Typography
							variant="caption"
							sx={{ color: '#57534e', lineHeight: 1.6 }}
						>
							Once you delete your account, there is no going back. All your data, products, orders, and settings will be permanently deleted.
						</Typography>
					</Box>
				</Box>
			</Paper>

			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Close Account Toggle */}
				<Box className="mb-24">
					<Controller
						name="closeAccount"
						control={control}
						render={({ field: { onChange, value } }) => (
							<FormControlLabel
								classes={{ root: 'm-0' }}
								labelPlacement="start"
								sx={{
									width: '100%',
									justifyContent: 'space-between',
									ml: 0,
									p: 2,
									background: 'rgba(220, 38, 38, 0.04)',
									borderRadius: 1.5,
									border: '1px solid rgba(220, 38, 38, 0.15)'
								}}
								label={
									<Box>
										<Typography
											variant="body2"
											sx={{ color: '#292524', fontWeight: 600 }}
										>
											Enable Account Deletion
										</Typography>
										<Typography
											variant="caption"
											sx={{ color: '#78716c' }}
										>
											Toggle this to access account deletion options
										</Typography>
									</Box>
								}
								control={
									<Switch
										onChange={(ev) => {
											onChange(ev.target.checked);
										}}
										checked={value}
										name="closeAccount"
										sx={{
											'& .MuiSwitch-switchBase.Mui-checked': {
												color: '#dc2626'
											},
											'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
												backgroundColor: '#dc2626'
											}
										}}
									/>
								}
							/>
						)}
					/>
				</Box>

				{/* Account Closure Form */}
				<Collapse in={closeAccount}>
					<Box className="grid gap-24 mt-24">
						{/* Current Email */}
						<Controller
							name="shopemail"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Current Email"
									type="email"
									error={!!errors.shopemail}
									helperText={errors?.shopemail?.message}
									variant="outlined"
									fullWidth
									disabled
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon
													size={20}
													sx={{ color: '#dc2626' }}
												>
													heroicons-solid:mail
												</FuseSvgIcon>
											</InputAdornment>
										)
									}}
									sx={{
										'& .MuiOutlinedInput-root': {
											'&:hover fieldset': {
												borderColor: '#dc2626'
											},
											'&.Mui-focused fieldset': {
												borderColor: '#dc2626'
											}
										},
										'& .MuiInputLabel-root.Mui-focused': {
											color: '#dc2626'
										}
									}}
								/>
							)}
						/>

						{/* Confirm Email */}
						<Controller
							name="checkEmail"
							control={control}
							render={({ field }) => (
								<Box>
									<TextField
										{...field}
										label="Confirm Email to Delete Account"
										placeholder="Type your email to confirm"
										type="email"
										error={!!errors.checkEmail}
										variant="outlined"
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#dc2626' }}
													>
														heroicons-solid:shield-exclamation
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#dc2626'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#dc2626'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#dc2626'
											}
										}}
									/>
									<FormHelperText sx={{ color: '#78716c', mt: 1 }}>
										{errors?.checkEmail?.message ||
											'Type your email address exactly as shown above to confirm account deletion'}
									</FormHelperText>
								</Box>
							)}
						/>
					</Box>

					{/* Action Buttons */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							mt: 3,
							background: 'rgba(220, 38, 38, 0.05)',
							border: '1px solid rgba(220, 38, 38, 0.2)',
							borderRadius: 2
						}}
					>
						<Box className="flex flex-col sm:flex-row items-center justify-between gap-16">
							<Box className="flex items-center gap-12">
								<FuseSvgIcon
									size={20}
									sx={{ color: '#dc2626' }}
								>
									heroicons-outline:exclamation
								</FuseSvgIcon>
								<Typography
									variant="body2"
									sx={{ color: '#dc2626', fontWeight: 600 }}
								>
									This action cannot be undone!
								</Typography>
							</Box>

							<Box className="flex items-center gap-12">
								<Button
									variant="outlined"
									disabled={_.isEmpty(dirtyFields)}
									onClick={() => reset(basemerchant)}
									sx={{
										color: '#78716c',
										borderColor: 'rgba(120, 113, 108, 0.3)',
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#78716c',
											background: 'rgba(120, 113, 108, 0.04)'
										}
									}}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									disabled={
										_.isEmpty(dirtyFields) || !isValid || closeThisAccount.isLoading
									}
									onClick={handleCloseAccount}
									startIcon={
										closeThisAccount.isLoading ? (
											<FuseSvgIcon
												size={18}
												className="animate-spin"
											>
												heroicons-outline:refresh
											</FuseSvgIcon>
										) : (
											<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
										)
									}
									sx={{
										background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
										color: 'white',
										fontWeight: 700,
										textTransform: 'none',
										px: 4,
										py: 1.25,
										boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
										'&:hover': {
											background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
											boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35)'
										},
										'&:disabled': {
											background: 'rgba(120, 113, 108, 0.12)',
											color: 'rgba(120, 113, 108, 0.38)',
											boxShadow: 'none'
										}
									}}
								>
									{closeThisAccount.isLoading ? 'Deleting Account...' : 'Delete My Account'}
								</Button>
							</Box>
						</Box>
					</Paper>
				</Collapse>
			</form>

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
				PaperProps={{
					sx: {
						borderRadius: 2,
						minWidth: { xs: '90%', sm: 500 },
						maxWidth: 600
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: '14px',
								background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={28}
							>
								heroicons-outline:exclamation-triangle
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-bold"
								sx={{ color: '#292524', mb: 0.5 }}
							>
								Confirm Account Deletion
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: '#78716c' }}
							>
								This is your last chance to reconsider
							</Typography>
						</Box>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ pt: 3 }}>
					<Box className="space-y-20">
						{/* Warning Card */}
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.08) 100%)',
								border: '2px solid rgba(220, 38, 38, 0.2)',
								borderRadius: 2
							}}
						>
							<Typography
								variant="body1"
								sx={{ color: '#292524', fontWeight: 700, mb: 2 }}
							>
								Are you absolutely sure about this decision?
							</Typography>
							<Typography
								variant="body2"
								sx={{ color: '#57534e', lineHeight: 1.7, mb: 2 }}
							>
								We would love to have you reconsider. Is there anything we can do to help you avoid this? This action is <strong>completely irreversible</strong> and all data concerning your merchant account will be permanently erased from our services.
							</Typography>

							<Box className="space-y-8 mt-16">
								<Box className="flex items-start gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#dc2626', mt: 0.5 }}
									>
										heroicons-solid:x
									</FuseSvgIcon>
									<Typography
										variant="caption"
										sx={{ color: '#57534e' }}
									>
										All products and inventory will be deleted
									</Typography>
								</Box>
								<Box className="flex items-start gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#dc2626', mt: 0.5 }}
									>
										heroicons-solid:x
									</FuseSvgIcon>
									<Typography
										variant="caption"
										sx={{ color: '#57534e' }}
									>
										Order history and customer data will be lost
									</Typography>
								</Box>
								<Box className="flex items-start gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#dc2626', mt: 0.5 }}
									>
										heroicons-solid:x
									</FuseSvgIcon>
									<Typography
										variant="caption"
										sx={{ color: '#57534e' }}
									>
										Your shop name will become available to others
									</Typography>
								</Box>
								<Box className="flex items-start gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#dc2626', mt: 0.5 }}
									>
										heroicons-solid:x
									</FuseSvgIcon>
									<Typography
										variant="caption"
										sx={{ color: '#57534e' }}
									>
										All settings and customizations will be removed
									</Typography>
								</Box>
							</Box>
						</Paper>

						{/* Support Message */}
						<Paper
							elevation={0}
							sx={{
								p: 2,
								background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
								border: '1px solid rgba(59, 130, 246, 0.2)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-start gap-12">
								<FuseSvgIcon
									size={18}
									sx={{ color: '#3b82f6', mt: 0.25 }}
								>
									heroicons-outline:support
								</FuseSvgIcon>
								<Box>
									<Typography
										variant="body2"
										sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
									>
										Need Help?
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#57534e', lineHeight: 1.6 }}
									>
										If you're experiencing issues, our support team is here to help. Contact us before making this irreversible decision.
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Box>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 2 }}>
					<Button
						onClick={() => setConfirmDialogOpen(false)}
						variant="outlined"
						sx={{
							color: '#78716c',
							borderColor: 'rgba(120, 113, 108, 0.3)',
							fontWeight: 600,
							textTransform: 'none',
							px: 3,
							'&:hover': {
								borderColor: '#78716c',
								background: 'rgba(120, 113, 108, 0.04)'
							}
						}}
					>
						Keep My Account
					</Button>
					<Button
						onClick={confirmAccountClosure}
						disabled={closeThisAccount.isLoading}
						variant="contained"
						startIcon={
							closeThisAccount.isLoading ? (
								<FuseSvgIcon
									size={18}
									className="animate-spin"
								>
									heroicons-outline:refresh
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
						sx={{
							background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
							color: 'white',
							fontWeight: 700,
							textTransform: 'none',
							px: 4,
							py: 1.25,
							boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
							'&:hover': {
								background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
								boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35)'
							},
							'&:disabled': {
								background: 'rgba(120, 113, 108, 0.12)',
								color: 'rgba(120, 113, 108, 0.38)',
								boxShadow: 'none'
							}
						}}
					>
						{closeThisAccount.isLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
}

export default CloseAccountSetting;
