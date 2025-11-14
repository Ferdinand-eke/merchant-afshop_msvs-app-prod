// import useCountries from '@/hooks/useCountries'
import Select from 'react-select';
import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries';
import useCountries from '../../hooks/useCountries';

// export type CountrySelectValue = {
//     flag: string;
//     label: string;
//     latlng: number[];
//     region: string;
//     value: string;
// }

// interface CountrySelectProps {
//     value?: CountrySelectValue
//     onChange: (value: CountrySelectValue) => void
// }
function CountrySelect({ value, onChange }) {
	const { getAll } = useCountries();
	const { data: countries } = useSellerCountries();
	// console.log("AllCountries", getAll())

	console.log('SellerCountries', countries?.data?.data);
	return (
		<div>
			<label style={{ fontSize: '12px', fontWeight: '800' }}>*Shop/Business Country Origin</label>
			<Select
				placeholder="Where on the globe are you?"
				isClearable
				options={countries?.data?.data}
				value={value}
				onChange={(value) => onChange(value)}
				formatOptionLabel={(option) => (
					<div className="flex flex-row items-center gap-3">
						{/* <div> */}
						<image
							src={option?.flag}
							// height={10}
							// width={10}
							className="height-[10px] width-[14px]"
						/>
						{/* </div> */}
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

export default CountrySelect;
