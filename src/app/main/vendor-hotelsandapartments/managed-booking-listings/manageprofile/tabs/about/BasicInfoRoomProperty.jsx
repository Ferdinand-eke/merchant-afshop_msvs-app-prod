import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button, InputAdornment, Typography } from '@mui/material';
import { z } from 'zod';
// import useCountries from "src/app/hooks/useCountries";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import {
	useAddRoomPropertyMutation,
	useGetSingleRoomOfProperty,
	useRoomOnPropertyUpdateMutation
} from 'app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps';

/**
 * The basic info tab.
 */

const schema = z.object({
	roomNumber: z.string(),
	roomStatus: z.string(),
	price: z.number(),
	title: z.string().min(5, 'The property title must be at least 5 characters'),
	bookingPropertyId: z.string()
});

export const statuses = ['AVAILABLE', 'BOOKED', 'MAINTENANCE'];

function BasicInfoRoomTabProperty(props) {
	const { roomId, apartmentId } = props;
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			roomNumber: '',
			roomStatus: '',
			price: '',
			title: '',
			description: '',
			bookingPropertyId: apartmentId
		}
		// resolver: zodResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();

	// const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { isValid, dirtyFields, errors } = formState;

	const addRoomProperty = useAddRoomPropertyMutation();
	const updateRoomOnBookingsProperty = useRoomOnPropertyUpdateMutation();

	const {
		data: room,
		isLoading,
		isError
	} = useGetSingleRoomOfProperty(roomId, {
		skip: !roomId
		// || roomId === 'new'
	});

	function handleCreateRoomOnApartmentCall() {
		parseInt(getValues().roomNumber);
		parseInt(getValues().price);
		const formattedData = {
			...getValues(),
			price: parseInt(getValues().price)
		};
		addRoomProperty.mutate(formattedData);
	}

	function handleSaveRoomOnApartment() {
		parseInt(getValues().roomNumber);
		parseInt(getValues().price);
		const formattedData = {
			...getValues(),
			price: parseInt(getValues().price)
		};
		updateRoomOnBookingsProperty.mutate(formattedData);
	}

	function handleRemoveRoomOnApartment() {
		console.log('Deleting BookingProperty_List-Values', getValues());
	}

	useEffect(() => {
		if (addRoomProperty.isSuccess) {
			reset({});
			methods.clearErrors();
			// methods.dirtyFields.
		}
	}, [addRoomProperty.isSuccess]);

	useEffect(() => {
		if (room?.data?.room) {
			reset({ ...room?.data?.room });
		}
	}, [room, reset]);

	return (
		<div>
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Name"
						autoFocus
						id="title"
						variant="outlined"
						fullWidth
						error={!!errors.title}
						helperText={errors?.title?.message}
					/>
				)}
			/>

			<Controller
				name="roomNumber"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4"
						label="Number of rooms"
						id="roomNumber"
						InputProps={{
							startAdornment: <InputAdornment position="start">Number</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="price"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4"
						label="Number of Sitting rooms"
						id="price"
						InputProps={{
							startAdornment: <InputAdornment position="start">price</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Room Status</Typography>
			<Controller
				name="roomStatus"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="roomStatus"
						label="business country"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.roomStatus}
						helpertext={errors?.roomStatus?.message}
					>
						<MenuItem value="">Select a status</MenuItem>
						{statuses &&
							statuses?.map((index) => (
								<MenuItem
									key={index}
									value={index}
								>
									{index}
								</MenuItem>
							))}
					</Select>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="description"
						label="Description"
						type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<motion.div
				className="flex flex-1 w-full pb-8"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{roomId ? (
					<>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveRoomOnApartment}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
						>
							Remove
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid || updateRoomOnBookingsProperty.isLoading}
							onClick={handleSaveRoomOnApartment}
						>
							Save
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || addRoomProperty.isLoading}
						onClick={handleCreateRoomOnApartmentCall}
					>
						Add Room| On Property
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default BasicInfoRoomTabProperty;
