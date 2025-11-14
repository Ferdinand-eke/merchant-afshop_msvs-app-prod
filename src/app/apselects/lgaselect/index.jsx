// import useCountries from '@/hooks/useCountries'
import Select from 'react-select';

// export type LgaSelectValue = {
//     flag: string;
//     label: string;
//     latlng: number[];
//     region: string;
//     value: string;
// }

// interface LgaSelectProps {
//     value?: CountrySelectValue
//     onChange: (value: CountrySelectValue) => void
// }
function LgaSelect({ value, onChange, blgas }) {
	// const { getAll } = useCountries()
	// const {data:countries} = useSellerCountries()
	// console.log("AllCountries", getAll())

	// console.log("SellerLGAs-By-Country", blgas)

	return (
		<div>
			<label style={{ fontSize: '12px', fontWeight: '800' }}>*Shop/Business LGA/County Origin</label>
			<Select
				placeholder="What LGA/County are you in?"
				isClearable
				options={blgas}
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

export default LgaSelect;
