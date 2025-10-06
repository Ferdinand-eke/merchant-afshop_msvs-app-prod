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
import { useInitiateBaseMerchantSettingsChangeEmail, useShopSettingsChangeEmail } from 'app/configs/data/server-calls/auth/useAuth';

const defaultValues = {
	currentEmail: '',
	newEmail: '',
};
/**
 * Form Validation Schema
 */
const schema = z.object({
	currentEmail: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	newEmail: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	

});


function ChangeEmailSetting(props) {
	 const {basemerchant} = props
	const { control, setError, reset, handleSubmit, formState, getValues } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const initateChangeMail = useInitiateBaseMerchantSettingsChangeEmail()
	const changeMail = useShopSettingsChangeEmail()

	// useEffect(() => {
	// 	reset(securitySettings);
	// }, [securitySettings, reset]);
	// useEffect(() => {
	// 	reset({ ...securitySettings, currentPassword: '', newPassword: '' });
	// }, [isSuccess]);

	useEffect(() => {
		reset({
			currentEmail: basemerchant?.shopemail
		});
	  }, [basemerchant, reset]);
	

	/**
	 * Form Submit
	 */
	function onSubmit(formData) {


		console.log("Form Data", formData)
		initateChangeMail.mutate(formData)
		// return
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
									disabled
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-4">
						<Controller
							name="newEmail"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="New email"
									type="email"
									error={!!errors.newEmail}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
											</InputAdornment>
										)
									}}
									helperText={errors?.newEmail?.message}
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
						// onClick={() => reset(securitySettings)}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid
						// || changeMail.isLoading
						}
						type="submit"
					>
						Changed email
					</Button>
				</div>


				<div className="my-40 border-t" />

								

				
			</form> 
		</div>
	);
}

export default ChangeEmailSetting;
