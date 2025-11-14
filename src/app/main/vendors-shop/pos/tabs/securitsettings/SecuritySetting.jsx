import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
// import { useGetSecuritySettingsQuery, useUpdateSecuritySettingsMutation } from '../SettingsApi';

const defaultValues = {
	// currentPassword: '',
	// newPassword: '',
	twoStepVerification: false,
	askPasswordChange: false
};
/**
 * Form Validation Schema
 */
const schema = z.object({
	// currentPassword: z.string(),
	// newPassword: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),

	// oldPassword: z.string(),
	// password: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),
	// confirmPassword: '',

	twoStepVerification: z.boolean(),
	askPasswordChange: z.boolean()
});

function SecuritySetting() {
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
	function onSubmit(formData, e) {
		e.preventDefault();

		console.log('Form Data', formData);

		// updateSecuritySettings(formData);
	}

	return (
		<div className="w-full max-w-3xl">
			<form onSubmit={handleSubmit(onSubmit)}>
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

				<div className="flex items-center justify-end space-x-16">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						// onClick={() => reset(securitySettings)}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						type="submit"
						// onClick={(e) => handleSubmit(onSubmit, e)}
					>
						Save setting
					</Button>
				</div>
			</form>
		</div>
	);
}

export default SecuritySetting;
