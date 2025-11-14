import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputAdornment, Typography } from '@mui/material';
// import useCountries from "src/app/hooks/useCountries";
import { useEffect, useState } from 'react';
import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries';
import { getLgaByStateId, getStateByCountryId } from 'app/configs/data/client/clientToApiRoutes';

/**
 * The basic info tab.
 */

export const categoryset = [
	{
		label: 'Beach',
		// icon: TbBeach,
		description: 'This property is close to the beach'
	},
	{
		label: 'Windmills',
		// icon: GiWindmill,
		description: 'This property has windmills'
	},
	{
		label: 'Modern',
		// icon: MdOutlineVilla,
		description: 'This property is modern'
	},
	{
		label: 'Countryside',
		// icon: TbMountain,
		description: 'This property is in the countryside'
	},
	{
		label: 'Skiing',
		// icon: FaSkiing,
		description: 'This property has skiing activities '
	},
	{
		label: 'Castle',
		// icon: GiCastle,
		description: 'This property is in a castle'
	},

	{
		label: 'Camping',
		// icon: GiForestCamp,
		description: 'This property has camping activities'
	},
	{
		label: 'Cave',
		// icon: GiCaveEntrance,
		description: 'This property is jn a cave'
	},
	{
		label: 'luxury',
		// icon: IoDiamond,
		description: 'This property is luxirious'
	},

	{
		label: 'lake',
		// icon: GiBoatFishing,
		description: 'This property is close to ta lake'
	},
	{
		label: 'Island',
		// icon: GiIsland,
		description: 'This property is on an island'
	}
];

function BasicInfoTabProperty() {
	const generateSingleOptions = () => {
		return categoryset.map((option, index) => {
			return (
				<MenuItem
					key={index}
					value={option.label}
				>
					{option.label}
				</MenuItem>
			);
		});
	};

	const methods = useFormContext();
	const { control, formState, getValues } = methods;
	const { errors } = formState;
	const { data: countries, isLoading: countriesLoading, refetch } = useSellerCountries();
	const [loading, setLoading] = useState(false);
	const [bstates, setBstates] = useState([]);
	const [blgas, setBlgas] = useState([]);

	useEffect(() => {
		if (getValues()?.propertyCountry?.length > 0) {
			getStateDFromCountryId(getValues()?.propertyCountry);
		}

		if (getValues()?.propertyState?.length > 0) {
			console.log('Entered......');
			getLgasFromState(getValues()?.propertyState);
		}
	}, [getValues()?.propertyCountry, getValues()?.propertyState]);

	async function getStateDFromCountryId(pid) {
		setLoading(true);

		const responseData = await getStateByCountryId(pid);

		if (responseData) {
			setBstates(responseData?.data?.states);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	//* *Get L.G.As from state_ID data */
	async function getLgasFromState(sid) {
		setLoading(true);
		// const responseData = await ProductRepository.getProductsById(pid);
		const responseData = await getLgaByStateId(sid);

		// console.log("gettingLGA (2) with state ID of:", responseData?.data)
		// return
		if (responseData?.data) {
			// console.log('LGAs From State:', responseData);
			setBlgas(responseData?.data?.lgas);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	console.log('LGA ID', getValues()?.propertyLga);
	// console.log("LGA location", getLgasFromState(getValues()?.propertyLga))

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

			<Typography>Property category</Typography>

			<Controller
				name="category"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="category"
						label="Category"
						variant="outlined"
						placeholder="Select a category"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.category}
						helpertext={errors?.category?.message}
					>
						{generateSingleOptions()}
					</Select>
				)}
			/>

			<Controller
				name="roomCount"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4"
						label="Number of rooms"
						id="roomCount"
						InputProps={{
							startAdornment: <InputAdornment position="start">Rooms</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="bathroomCount"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4"
						label="Number of Bathrooms"
						id="bathroomCount"
						InputProps={{
							startAdornment: <InputAdornment position="start">BathRooms</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="sittingroomCount"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 mx-4"
						label="Number of Sitting rooms"
						id="sittingroomCount"
						InputProps={{
							startAdornment: <InputAdornment position="start">sitting Room(s)</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Country of location?</Typography>
			<Controller
				name="propertyCountry"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						// disabled
						className="mt-8 mb-16"
						id="propertyCountry"
						label="business country"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.propertyCountry}
						helpertext={errors?.propertyCountry?.message}
					>
						<MenuItem value="">Select a country</MenuItem>
						{countries?.data?.countries &&
							countries?.data?.countries?.map((option, id) => (
								<MenuItem
									key={option.id}
									value={option.id}
								>
									{option.name}
								</MenuItem>
							))}
					</Select>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>
				State location? (Dependent on country selected)
			</Typography>
			<Controller
				name="propertyState"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						// disabled
						className="mt-8 mb-16"
						id="propertyState"
						label="business state"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.propertyState}
						helpertext={errors?.propertyState?.message}
					>
						<MenuItem value="">Select a state</MenuItem>
						{bstates &&
							bstates?.map((option, id) => (
								<MenuItem
									key={option.id}
									value={option.id}
								>
									{option.name}
								</MenuItem>
							))}
					</Select>
				)}
			/>

			<div className="sm:col-span-2">
				<Typography style={{ fontSize: '12px', fontWeight: '800' }}>L.G.A/County location</Typography>
				<Controller
					name="propertyLga"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<Select
							className="mt-8 mb-16"
							id="propertyLga"
							label="L.G.A/County of Location"
							placeholder="L.G.A/County of location"
							fullWidth
							defaultValue=""
							onChange={onChange}
							value={value === undefined || null ? '' : value}
							error={!!errors.propertyLga}
							helperText={errors?.propertyLga?.message}
						>
							{blgas.length > 0 ? (
								blgas?.map((lga, index) => (
									<MenuItem
										key={index}
										value={lga?.id}
									>
										{lga?.name}
										{/* {lga?._id} */}
									</MenuItem>
								))
							) : (
								<span>No L.G.As found</span>
							)}
						</Select>
					)}
				/>
			</div>
		</div>
	);
}

export default BasicInfoTabProperty;
