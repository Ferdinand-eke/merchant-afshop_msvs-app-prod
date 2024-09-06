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
// import { useGetSecuritySettingsQuery, useUpdateSecuritySettingsMutation } from '../SettingsApi';

const defaultValues = {
	currentEmail: '',
	shopemail: '',
	// twoStepVerification: false,
	// askPasswordChange: false
};
/**
 * Form Validation Schema
 */
const schema = z.object({
	// currentPassword: z.string(),
	// newPassword: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),

	currentEmail: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	shopemail: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	// confirmPassword: '',

	// twoStepVerification: z.boolean(),
	// askPasswordChange: z.boolean()
});


function ChangeEmailSetting() {
	// const { data: securitySettings } = useGetSecuritySettingsQuery();
	// const [updateSecuritySettings, { error: updateError, isSuccess }] = useUpdateSecuritySettingsMutation();
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
		// updateSecuritySettings(formData);
	}

	return (
		<div className="w-full max-w-3xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="w-full">
					<Typography className="text-xl">Change your email</Typography>
					<Typography color="text.secondary">
						You can only change your email twice within 6 months!
					</Typography>
				</div>
				<div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-32">
					<div className="sm:col-span-4">
						<Controller
							name="currentEmail"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Current email "
									type="email"
									error={!!errors.currentEmail}
									helperText={errors?.currentEmail?.message}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-4">
						<Controller
							name="shopemail"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="New email"
									type="email"
									error={!!errors.shopemail}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
											</InputAdornment>
										)
									}}
									helperText={errors?.shopemail?.message}
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
						Changed email
					</Button>
				</div>


				<div className="my-40 border-t" />

								

				
			</form>

			{/* <SecuritySetting /> */}
		</div>
	);
}

export default ChangeEmailSetting;
