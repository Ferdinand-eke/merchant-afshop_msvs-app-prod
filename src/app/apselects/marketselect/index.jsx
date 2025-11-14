import Select from 'react-select';
// import useCountries from '../../hooks/useCountries'
// import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries'

function MarketSelect({ value, onChange, markets }) {
	// const { getAll } = useCountries()

	return (
		<div>
			<label style={{ fontSize: '12px', fontWeight: '800' }}>*Shop/Business market District</label>
			<Select
				placeholder="What market are you in?"
				isClearable
				options={markets}
				value={value}
				onChange={(value) => onChange(value)}
				formatOptionLabel={(option) => (
					<div className="flex flex-row items-center gap-3">
						<div>
							{option?.name}
							{/* <span className='text-neutral-800 ml-1'>
                                {option.region}
                            </span> */}
						</div>
					</div>
				)}
				theme={(theme) => ({
					...theme,
					borderRadius: 6,
					colors: {
						...theme.colors,
						primary: 'black',
						primary25: '#ffe4e6'
					}
				})}
			/>
		</div>
	);
}

export default MarketSelect;
