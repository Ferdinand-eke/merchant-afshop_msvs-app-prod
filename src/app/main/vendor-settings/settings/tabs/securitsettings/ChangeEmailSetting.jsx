import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Paper } from '@mui/material';
import _ from '@lodash';
import { useEffect } from 'react';
import {
	useInitiateBaseMerchantSettingsChangeEmail,
	useShopSettingsChangeEmail
} from 'app/configs/data/server-calls/auth/useAuth';

const defaultValues = {
	currentEmail: '',
	newEmail: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	currentEmail: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
	newEmail: z.string().email('You must enter a valid email').min(1, 'You must enter an email')
});

function ChangeEmailSetting(props) {
	const { basemerchant } = props;
	const { control, reset, handleSubmit, formState, getValues } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const initateChangeMail = useInitiateBaseMerchantSettingsChangeEmail();

	useEffect(() => {
		reset({
			currentEmail: basemerchant?.shopemail
		});
	}, [basemerchant, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData) {
		initateChangeMail.mutate(formData);
	}

	return (
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
						heroicons-outline:mail
					</FuseSvgIcon>
				</Box>
				<Box>
					<Typography
						variant="h6"
						className="font-bold"
						sx={{ color: '#292524', mb: 0.5 }}
					>
						Change Email Address
					</Typography>
					<Typography
						variant="caption"
						sx={{ color: '#78716c' }}
					>
						Update your account email address
					</Typography>
				</Box>
			</Box>

			{/* Info Alert */}
			<Paper
				elevation={0}
				sx={{
					p: 2,
					mb: 3,
					background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
					border: '1px solid rgba(245, 158, 11, 0.2)',
					borderRadius: 1.5
				}}
			>
				<Box className="flex items-start gap-12">
					<FuseSvgIcon
						size={18}
						sx={{ color: '#f59e0b', mt: 0.25 }}
					>
						heroicons-outline:exclamation
					</FuseSvgIcon>
					<Box>
						<Typography
							variant="body2"
							sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
						>
							Email Change Restrictions
						</Typography>
						<Typography
							variant="caption"
							sx={{ color: '#57534e', lineHeight: 1.6 }}
						>
							For security purposes, you can only change your email address twice within 6 months. A verification email will be sent to your new address.
						</Typography>
					</Box>
				</Box>
			</Paper>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Box className="grid gap-24">
					{/* Current Email */}
					<Controller
						name="currentEmail"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Current Email"
								type="email"
								error={!!errors.currentEmail}
								helperText={errors?.currentEmail?.message}
								variant="outlined"
								fullWidth
								disabled
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon
												size={20}
												sx={{ color: '#ea580c' }}
											>
												heroicons-solid:mail
											</FuseSvgIcon>
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

					{/* New Email */}
					<Controller
						name="newEmail"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="New Email Address"
								placeholder="Enter your new email"
								type="email"
								error={!!errors.newEmail}
								helperText={errors?.newEmail?.message || 'A verification link will be sent to this address'}
								variant="outlined"
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon
												size={20}
												sx={{ color: '#ea580c' }}
											>
												heroicons-solid:mail-open
											</FuseSvgIcon>
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
									: 'Email address updated'}
							</Typography>
						</Box>

						<Box className="flex items-center gap-12">
							<Button
								variant="outlined"
								disabled={_.isEmpty(dirtyFields)}
								onClick={() => reset({ currentEmail: basemerchant?.shopemail })}
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
								disabled={_.isEmpty(dirtyFields) || !isValid || initateChangeMail.isLoading}
								type="submit"
								startIcon={
									initateChangeMail.isLoading ? (
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
								{initateChangeMail.isLoading ? 'Sending Verification...' : 'Change Email'}
							</Button>
						</Box>
					</Box>
				</Paper>
			</form>
		</Paper>
	);
}

export default ChangeEmailSetting;
