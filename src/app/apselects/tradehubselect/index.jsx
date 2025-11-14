import Select from 'react-select';
import useHubs from 'app/configs/data/server-calls/tradehubs/useTradeHubs';

function TradehubSelect({ value, onChange }) {
	const { data: hubData } = useHubs();

	console.log('trade-Hubs', hubData?.data);
	return (
		<div>
			<label style={{ fontSize: '12px', fontWeight: '800' }}>*Shop/Business Trade Hub</label>
			<Select
				placeholder="Where on the globe are you?"
				isClearable
				options={hubData?.data?.tradehubs}
				value={value}
				onChange={(value) => onChange(value)}
				formatOptionLabel={(option) => (
					<div className="flex flex-row items-center gap-3 index-[100]">
						<div>{option?.hubname}</div>
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

export default TradehubSelect;
