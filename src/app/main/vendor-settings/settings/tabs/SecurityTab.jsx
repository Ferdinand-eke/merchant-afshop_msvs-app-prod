import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Paper, IconButton, Chip } from '@mui/material';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { useShopSettingsChangePass } from 'app/configs/data/server-calls/auth/useAuth';
import { useGetMinimizedJustMyShopDetailsQuery } from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import ChangeEmailSetting from './securitsettings/ChangeEmailSetting';
import CloseAccountSetting from './securitsettings/CloseAccountSetting';
import { motion } from 'framer-motion';

const defaultValues = {
	currentPassword: '',
	newPassword: '',
	twoStepVerification: false,
	askPasswordChange: false,
	confirmPassword: ''
};

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		currentPassword: z.string().min(1, 'Please enter your current password.'),
		newPassword: z
			.string()
			.min(1, 'Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		confirmPassword: z.string().min(1, 'Password confirmation is required')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword']
	});

function SecurityTab() {
	const changeShopPass = useShopSettingsChangePass();
	const { data: shopData } = useGetMinimizedJustMyShopDetailsQuery();

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { control, reset, handleSubmit, formState, getValues } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		if (changeShopPass?.isSuccess) {
			reset();
		}
	}, [changeShopPass?.isSuccess, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit() {
		changeShopPass.mutate(getValues());
	}

	// Password strength calculator
	const calculatePasswordStrength = (password) => {
		if (!password) return { strength: 0, label: '', color: '' };

		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (password.length >= 12) strength += 25;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
		if (/\d/.test(password)) strength += 15;
		if (/[^a-zA-Z\d]/.test(password)) strength += 10;

		if (strength < 40) return { strength, label: 'Weak', color: '#dc2626' };
		if (strength < 70) return { strength, label: 'Fair', color: '#f97316' };
		if (strength < 90) return { strength, label: 'Good', color: '#16a34a' };
		return { strength, label: 'Strong', color: '#16a34a' };
	};

	const newPassword = getValues('newPassword');
	const passwordStrength = calculatePasswordStrength(newPassword);

	return (
		<Box className="w-full max-w-4xl">
			{/* Change Password Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<Paper
					elevation={0}
					sx={{
						p: 4,
						mb: 3,
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
						border: '1px solid rgba(234, 88, 12, 0.1)',
						borderRadius: 2
					}}
				>
					<Box className="flex items-center gap-12 mb-24">
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={24}
							>
								heroicons-outline:lock-closed
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-bold"
								sx={{ color: '#292524', mb: 0.5 }}
							>
								Change Password
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: '#78716c' }}
							>
								Update your password to keep your account secure
							</Typography>
						</Box>
					</Box>

					{/* Info Alert */}
					<Paper
						elevation={0}
						sx={{
							p: 2,
							mb: 3,
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
								heroicons-outline:information-circle
							</FuseSvgIcon>
							<Box>
								<Typography
									variant="body2"
									sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
								>
									Password Change Limit
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#57534e', lineHeight: 1.6 }}
								>
									For security reasons, you can only change your password twice within 24 hours.
								</Typography>
							</Box>
						</Box>
					</Paper>

					<form onSubmit={handleSubmit(onSubmit)}>
						<Box className="grid gap-24">
							{/* Current Password */}
							<Controller
								name="currentPassword"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Current Password"
										placeholder="Enter your current password"
										type={showCurrentPassword ? 'text' : 'password'}
										error={!!errors.currentPassword}
										helperText={errors?.currentPassword?.message}
										variant="outlined"
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:key
													</FuseSvgIcon>
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={() => setShowCurrentPassword(!showCurrentPassword)}
														edge="end"
														size="small"
													>
														<FuseSvgIcon
															size={20}
															sx={{ color: '#78716c' }}
														>
															{showCurrentPassword
																? 'heroicons-outline:eye-off'
																: 'heroicons-outline:eye'}
														</FuseSvgIcon>
													</IconButton>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#f97316'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ea580c'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#ea580c'
											}
										}}
									/>
								)}
							/>

							{/* New Password */}
							<Box>
								<Controller
									name="newPassword"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											label="New Password"
											placeholder="Enter your new password"
											type={showNewPassword ? 'text' : 'password'}
											error={!!errors.newPassword}
											helperText={errors?.newPassword?.message}
											variant="outlined"
											fullWidth
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon
															size={20}
															sx={{ color: '#ea580c' }}
														>
															heroicons-solid:key
														</FuseSvgIcon>
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={() => setShowNewPassword(!showNewPassword)}
															edge="end"
															size="small"
														>
															<FuseSvgIcon
																size={20}
																sx={{ color: '#78716c' }}
															>
																{showNewPassword
																	? 'heroicons-outline:eye-off'
																	: 'heroicons-outline:eye'}
															</FuseSvgIcon>
														</IconButton>
													</InputAdornment>
												)
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													'&:hover fieldset': {
														borderColor: '#f97316'
													},
													'&.Mui-focused fieldset': {
														borderColor: '#ea580c'
													}
												},
												'& .MuiInputLabel-root.Mui-focused': {
													color: '#ea580c'
												}
											}}
										/>
									)}
								/>

								{/* Password Strength Indicator */}
								{newPassword && (
									<Box className="mt-12">
										<Box className="flex items-center justify-between mb-8">
											<Typography
												variant="caption"
												sx={{ color: '#78716c', fontWeight: 500 }}
											>
												Password Strength
											</Typography>
											<Chip
												label={passwordStrength.label}
												size="small"
												sx={{
													background: `${passwordStrength.color}15`,
													color: passwordStrength.color,
													fontWeight: 600,
													fontSize: '0.7rem',
													height: 20
												}}
											/>
										</Box>
										<Box
											sx={{
												width: '100%',
												height: 6,
												background: 'rgba(120, 113, 108, 0.1)',
												borderRadius: 1,
												overflow: 'hidden'
											}}
										>
											<Box
												sx={{
													width: `${passwordStrength.strength}%`,
													height: '100%',
													background: passwordStrength.color,
													transition: 'width 0.3s, background 0.3s',
													borderRadius: 1
												}}
											/>
										</Box>
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mt: 1 }}
										>
											Use 8+ characters with a mix of letters, numbers & symbols
										</Typography>
									</Box>
								)}
							</Box>

							{/* Confirm Password */}
							<Controller
								name="confirmPassword"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Confirm New Password"
										placeholder="Re-enter your new password"
										type={showConfirmPassword ? 'text' : 'password'}
										error={!!errors.confirmPassword}
										helperText={errors?.confirmPassword?.message}
										variant="outlined"
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:shield-check
													</FuseSvgIcon>
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
														edge="end"
														size="small"
													>
														<FuseSvgIcon
															size={20}
															sx={{ color: '#78716c' }}
														>
															{showConfirmPassword
																? 'heroicons-outline:eye-off'
																: 'heroicons-outline:eye'}
														</FuseSvgIcon>
													</IconButton>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#f97316'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ea580c'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#ea580c'
											}
										}}
									/>
								)}
							/>
						</Box>

						{/* Action Buttons */}
						<Paper
							elevation={0}
							sx={{
								p: 3,
								mt: 3,
								background: 'rgba(249, 115, 22, 0.03)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 2
							}}
						>
							<Box className="flex flex-col sm:flex-row items-center justify-between gap-16">
								<Box className="flex items-center gap-12">
									<FuseSvgIcon
										size={20}
										sx={{ color: '#78716c' }}
									>
										heroicons-outline:information-circle
									</FuseSvgIcon>
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										{_.isEmpty(dirtyFields)
											? 'No changes made yet'
											: 'Password fields updated'}
									</Typography>
								</Box>

								<Box className="flex items-center gap-12">
									<Button
										variant="outlined"
										disabled={_.isEmpty(dirtyFields)}
										onClick={() => reset()}
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
										Reset
									</Button>
									<Button
										variant="contained"
										disabled={_.isEmpty(dirtyFields) || !isValid || changeShopPass?.isLoading}
										type="submit"
										startIcon={
											changeShopPass?.isLoading ? (
												<FuseSvgIcon
													size={18}
													className="animate-spin"
												>
													heroicons-outline:refresh
												</FuseSvgIcon>
											) : (
												<FuseSvgIcon size={18}>heroicons-outline:check-circle</FuseSvgIcon>
											)
										}
										sx={{
											background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
											color: 'white',
											fontWeight: 700,
											textTransform: 'none',
											px: 4,
											py: 1.25,
											boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
											'&:hover': {
												background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
												boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)'
											},
											'&:disabled': {
												background: 'rgba(120, 113, 108, 0.12)',
												color: 'rgba(120, 113, 108, 0.38)',
												boxShadow: 'none'
											}
										}}
									>
										{changeShopPass?.isLoading ? 'Updating Password...' : 'Update Password'}
									</Button>
								</Box>
							</Box>
						</Paper>
					</form>
				</Paper>
			</motion.div>

			{/* Change Email Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<ChangeEmailSetting basemerchant={shopData?.data?.basemerchant} />
			</motion.div>

			{/* Close Account Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<CloseAccountSetting basemerchant={shopData?.data?.basemerchant} />
			</motion.div>
		</Box>
	);
}

export default SecurityTab;
