import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import history from '@history';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'app/store/hooks';

import MenuItem from '@mui/material/MenuItem';
// import { useAdminRecruitStaff } from "src/app/aaqueryhooks/adminHandlingQuery";
import { useAdminCreateNewUser } from 'src/app/aaqueryhooks/usersHandlingQuery';
import ContactModel from '../models/ContactModel';
// import InputAdornment from '@mui/material/InputAdornment';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { useGetAdminById } from 'src/app/aaqueryhooks/adminHandlingQuery';

function BirtdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

/**
 * Form Validation Schema
 */
// Zod schema for ContactEmail
const ContactEmailSchema = z.object({
	email: z.string().optional(),
	type: z.string().optional()
});
// Zod schema for ContactPhoneNumber
const ContactPhoneNumberSchema = z.object({
	number: z.string().optional(),
	type: z.string().optional()
});
const schema = z.object({
	avatar: z.string().optional(),
	background: z.string().optional(),
	name: z.string().min(1, { message: 'Name is required' }),
	emails: z.array(ContactEmailSchema).optional(),
	email: z.string().optional(),
	phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
	title: z.string().optional(),
	company: z.string().optional(),
	birthday: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional()
});
// const schema = z.object({
// 	email: z.string().optional(),
// 	label: z.string().optional()
// });

/**
 * The contact form.
 */

export const roleset = [
	{
		role: 'User'
		// icon: TbBeach,
		//   description: "This property is close to the beach",
	}
	// {
	// 	role: "",
	// 	// icon: TbBeach,
	//   //   description: "This property is close to the beach",
	//   },
	//   {
	// 	role: "HR",
	// 	// icon: TbBeach,
	//   //   description: "This property is close to the beach",
	//   },
	//   {
	// 	role: "Marketing",
	// 	// icon: TbBeach,
	//   //   description: "This property is close to the beach",
	//   },
	// {
	//   role: "IT",
	//   // icon: GiWindmill,
	// //   description: "This property has windmills",
	// },
	// {
	//   role: "Finance",
	//   // icon: MdOutlineVilla,
	// //   description: "This property is modern",
	// },
];

function AddUserForm() {
	const generateSingleOptions = () => {
		return roleset.map((option, index) => {
			return (
				<MenuItem
					key={index}
					value={option.role}
				>
					{option.role}
				</MenuItem>
			);
		});
	};

	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	// const { id: contactId } = routeParams;
	const { id } = routeParams;

	// const { data: contact, isError } = useGetContactsItemQuery(contactId, {
	// 	skip: !contactId
	// });

	// const {
	// 	data: admin,
	// 	isLoading: adminLoading,
	// 	isError: adminIsError
	// } = useGetAdminById(id, {
	// 	skip: !id || id === 'new'
	// });

	const recruitNewUserAccount = useAdminCreateNewUser();

	const { control, watch, reset, handleSubmit, formState } = useForm({
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();

	useEffect(
		() => {
			// if (contactId === 'new') {
			// 	reset(ContactModel({}));
			// }
			// if (id === 'new') {
			// 	reset(ContactModel({}));
			// }
			//   if(recruitNewUserAccount.isSuccess){
			// 	reset(ContactModel({}));
			//   }
			reset(ContactModel({}));
		},
		// [contactId, reset]
		[
			// id,
			reset
			//   recruitNewUserAccount?.isSuccess,
		]
	);

	// useEffect(() => {
	// 	if (admin?.data) {
	// 		reset({ ...admin?.data });
	// 	}
	// }, [admin?.data, reset]);

	/**
	 * Form Submit
	 */

	const onSubmit = useCallback(() => {
		// console.log("Crete STAFF-FORMDATA", { contact: form })
		console.log('Crete User-FORMDATA', form);

		recruitNewUserAccount.mutate(form);
		// reset(ContactModel({}));
	}, [form]);

	function handleRemoveContact() {
		// if (!contact) {
		// 	return;
		// }
		// if (!admin?.data) {
		// 	return;
		// }
	}

	const background = watch('background');
	const name = watch('name');

	// if (adminIsError && id !== 'new' ) {
	// 	//&& id !== 'new'
	// 	setTimeout(() => {
	// 		navigate('/users/admin');
	// 		dispatch(showMessage({ message: 'NOT FOUND' }));
	// 	}, 0);
	// 	return null;
	// }

	// if (_.isEmpty(form)) {
	// 	return <FuseLoading className="min-h-screen" />;
	// }

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={background}
						alt="user background"
					/>
				)}
			</Box>

			<div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
				<div className="w-full">
					<div className="flex flex-auto items-end -mt-64">
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-8 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader = new FileReader();
																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(reader.result)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};
																reader.onerror = reject;
																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();
														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-full h-full text-64 font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>
				</div>

				{/* <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              className="mt-32"
              {...field}
              id="role"
              label="Role"
              placeholder="Role"
              variant="outlined"
              fullWidth
              error={!!errors.role}
              helperText={errors?.role?.message}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {generateSingleOptions()}
            </Select>
          )}
        /> */}

				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Name"
							placeholder="Name"
							id="name"
							error={!!errors.name}
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Email"
							placeholder="Email"
							variant="outlined"
							fullWidth
							error={!!errors.email}
							helperText={errors?.email?.message}
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

				<Controller
					control={control}
					name="address"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Address"
							placeholder="Address"
							id="address"
							error={!!errors.address}
							helperText={errors?.address?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="birthday"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toISOString());
							}}
							className="mt-32 mb-16 w-full"
							slotProps={{
								textField: {
									id: 'birthday',
									label: 'Birthday',
									InputLabelProps: {
										shrink: true
									},
									fullWidth: true,
									variant: 'outlined',
									error: !!errors.birthday,
									helperText: errors?.birthday?.message
								},
								actionBar: {
									actions: ['clear', 'today']
								}
							}}
							slots={{
								openPickerIcon: BirtdayIcon
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="phone"
					render={({ field }) => (
						<TextField
							{...field}
							label="Phone"
							placeholder="Phone"
							variant="outlined"
							fullWidth
							error={!!errors.phone}
							helperText={errors?.phone?.message}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Notes"
							placeholder="Notes"
							id="notes"
							error={!!errors.notes}
							helperText={errors?.notes?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={5}
							maxRows={10}
							InputProps={{
								className: 'max-h-min h-min items-start',
								startAdornment: (
									<InputAdornment
										className="mt-16"
										position="start"
									>
										<FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
			</div>
			<Box
				className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
				sx={{ backgroundColor: 'background.default' }}
			>
				{/* {id !== 'new' && (
					<Button
						color="error"
						// onClick={handleRemoveContact}
					>
						Delete
					</Button>
				)} */}
				<Button
					className="ml-auto"
					onClick={() => history.back()}
				>
					Cancel
				</Button>
				<Button
					className="ml-8"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid || recruitNewUserAccount.isLoading}
					onClick={handleSubmit(onSubmit)}
				>
					Save
				</Button>
			</Box>
		</>
	);
}

export default AddUserForm;
