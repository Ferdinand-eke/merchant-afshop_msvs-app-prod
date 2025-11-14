import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

function BasicInfoTab() {
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
	const { control, formState } = methods;
	const { errors } = formState;
	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Name"
						autoFocus
						id="name"
						variant="outlined"
						fullWidth
						error={!!errors.name}
						helperText={errors?.name?.message}
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

			<Controller
				control={control}
				name="cat"
				// : { onChange, value }
				render={({ field }) => (
					<Select
						className="mt-8 mb-16"
						id="cat"
						label="Cat"
						//   type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
						error={!!errors.cat}
						helperText={errors?.cat?.message}
						//   onChange={onChange} value={value}
					>
						{/* <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
						{generateSingleOptions()}
					</Select>
				)}
			/>

			<Controller
				name="categories"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple categories"
								label="Categories"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/>

			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple tags"
								label="Tags"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
