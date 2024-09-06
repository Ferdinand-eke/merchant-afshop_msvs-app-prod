import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import { useEffect } from 'react';
import { useGetSecuritySettingsQuery, useUpdateSecuritySettingsMutation } from '../SettingsApi';
import SecuritySetting from './securitsettings/SecuritySetting';
import ChangeEmailSetting from './securitsettings/ChangeEmailSetting';

const defaultValues = {
	currentPassword: '',
	newPassword: '',
	twoStepVerification: false,
	askPasswordChange: false
};
/**
 * Form Validation Schema
 */
const schema = z.object({

	oldPassword: z.string().nonempty('Please enter your current password.'),
	// password: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),
	password: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
	passwordConfirm: z.string().nonempty('Password confirmation is required'),
}).refine((data) => data.password === data.passwordConfirm, {
	message: 'Passwords must match',
	path: ['passwordConfirm']
});;


function SecurityTab() {
	const { data: securitySettings } = useGetSecuritySettingsQuery();
	const [updateSecuritySettings, { error: updateError, isSuccess }] = useUpdateSecuritySettingsMutation();
	const { control, setError, reset, handleSubmit, formState, getValues } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	// useEffect(() => {
	// 	reset(securitySettings);
	// }, [securitySettings, reset]);
	// useEffect(() => {
	// 	reset({ ...securitySettings, currentPassword: '', newPassword: '' });
	// }, [isSuccess]);
	// useEffect(() => {
	// 	if (updateError) {
	// 		updateError?.response?.data?.map((err) => {
	// 			setError(err.name, { type: 'manual', message: err.message });
	// 			return undefined;
	// 		});
	// 	}
	// }, [updateError, setError]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData) {


		console.log("Form Data", formData)
		return
		updateSecuritySettings(formData);
	}

	return (
		<div className="w-full max-w-3xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="w-full">
					<Typography className="text-xl">Change your password</Typography>
					<Typography color="text.secondary">
						You can only change your password twice within 24 hours!
					</Typography>
				</div>
				<div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-32">
					<div className="sm:col-span-4">
						<Controller
							name="oldPassword"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Current password (default:changeme)"
									type="password"
									error={!!errors.oldPassword}
									helperText={errors?.oldPassword?.message}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-4">
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="New password"
									type="password"
									error={!!errors.password}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
											</InputAdornment>
										)
									}}
									helperText={errors?.password?.message}
								/>
							)}
						/>
					</div>
				</div>

				<Divider className="mb-40 mt-44 border-t" />
				<div className="flex items-center justify-end space-x-16">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						onClick={() => reset(securitySettings)}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						type="submit"
					>
						Save changed password
					</Button>
				</div>


				<div className="my-40 border-t" />

				{/* <>
				<div className="w-full">
					<Typography className="text-xl">Security preferences</Typography>
					<Typography color="text.secondary">
						Keep your account more secure with following preferences.
					</Typography>
				</div>
				<div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-32">
					<div className="flex items-center justify-between sm:col-span-4">
						<Controller
							name="twoStepVerification"
							control={control}
							render={({ field: { onChange, value } }) => (
								<div className="flex flex-col w-full">
									<FormControlLabel
										classes={{ root: 'm-0', label: 'flex flex-1' }}
										labelPlacement="start"
										label="Enable 2-step authentication"
										control={
											<Switch
												onChange={(ev) => {
													onChange(ev.target.checked);
												}}
												checked={value}
												name="twoStepVerification"
											/>
										}
									/>
									<FormHelperText>
										Protects you against password theft by requesting an authentication code via SMS
										on every login.
									</FormHelperText>
								</div>
							)}
						/>
					</div>
					<div className="flex items-center justify-between sm:col-span-4">
						<Controller
							name="askPasswordChange"
							control={control}
							render={({ field: { onChange, value } }) => (
								<div className="flex flex-col w-full">
									<FormControlLabel
										classes={{
											root: 'm-0',
											label: 'flex flex-1'
										}}
										labelPlacement="start"
										label="Ask to change password on every 6 months"
										control={
											<Switch
												onChange={(ev) => {
													onChange(ev.target.checked);
												}}
												checked={value}
												name="askPasswordChange"
											/>
										}
									/>
									<FormHelperText>
										A simple but an effective way to be protected against data leaks and password
										theft.
									</FormHelperText>
								</div>
							)}
						/>
					</div>
				</div>
				</> */}

				

				
			</form>

			<ChangeEmailSetting />

			<SecuritySetting />
		</div>
	);
}

export default SecurityTab;
