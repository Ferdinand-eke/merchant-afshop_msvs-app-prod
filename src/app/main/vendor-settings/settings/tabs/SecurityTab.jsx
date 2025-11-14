import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import { useEffect } from 'react';
import { useShopSettingsChangePass } from 'app/configs/data/server-calls/auth/useAuth';
import { useGetMinimizedJustMyShopDetailsQuery } from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import ChangeEmailSetting from './securitsettings/ChangeEmailSetting';
import CloseAccountSetting from './securitsettings/CloseAccountSetting';

const defaultValues = {
	currentPassword: '',
	newPassword: '',
	twoStepVerification: false,
	askPasswordChange: false,
	// currentPassword: "",
	// newPassword: "",
	confirmPassword: ''
};
/**
 * Form Validation Schema
 */
const schema = z
	.object({
		currentPassword: z.string().nonempty('Please enter your current password.'),
		newPassword: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		confirmPassword: z.string().nonempty('Password confirmation is required')
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword']
	});

function SecurityTab() {
	const changeShopPass = useShopSettingsChangePass();
	const { data: shopData } = useGetMinimizedJustMyShopDetailsQuery();
	// const { data: securitySettings } = useGetSecuritySettingsQuery();
	const { control, setError, reset, handleSubmit, formState, getValues } = useForm({
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
							name="currentPassword"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Current password (default:changeme)"
									type="password"
									error={!!errors.currentPassword}
									helperText={errors?.currentPassword?.message}
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
							name="newPassword"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="New password"
									type="password"
									error={!!errors.newPassword}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
											</InputAdornment>
										)
									}}
									helperText={errors?.newPassword?.message}
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-4">
						<Controller
							name="confirmPassword"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Password Confirm"
									type="password"
									error={!!errors.confirmPassword}
									variant="outlined"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
											</InputAdornment>
										)
									}}
									helperText={errors?.confirmPassword?.message}
								/>
							)}
						/>
					</div>
				</div>

				<Divider className="mb-40 mt-44 border-t" />
				<div className="flex items-center justify-end space-x-16">
					{/* <Button
            variant="outlined"
            disabled={_.isEmpty(dirtyFields)}
            onClick={() => reset()}
          >
            Cancel
          </Button> */}
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || changeShopPass?.isLoading}
						type="submit"
					>
						Save changed password
					</Button>
				</div>

				<div className="my-40 border-t" />
			</form>

			<ChangeEmailSetting basemerchant={shopData?.data?.basemerchant} />

			{/* <SecuritySetting /> */}

			<CloseAccountSetting basemerchant={shopData?.data?.basemerchant} />
		</div>
	);
}

export default SecurityTab;
