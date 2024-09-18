// import useCountries from '@/hooks/useCountries'
import React from 'react'
import Select from 'react-select'
import useCountries from '../../hooks/useCountries'
import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries'
import useHubs from 'app/configs/data/server-calls/tradehubs/useTradeHubs'

// export type TradehubSelectValue = {
//     flag: string;
//     label: string;
//     latlng: number[];
//     region: string;
//     value: string;
// }

// interface TradehubSelectProps {
//     value?: TradehubSelectValue
//     onChange: (value: TradehubSelectValue) => void
// }
const TradehubSelect = ({ value, onChange }) => {
    // const { getAll } = useCountries()
    // const {data:countries} = useSellerCountries()
    const { data: hubData } = useHubs();
    // console.log("AllCountries", getAll())

    // console.log("SellerCountries", hubData?.data?.data)
    return (
        <div>
              <label
                                style={{ fontSize: '12px', fontWeight: '800' }}>
                                *Shop/Business Trade Hub
                            </label>
            <Select
                placeholder="Where on the globe are you?"
                isClearable
                options={hubData?.data?.data}
                value={value}
                onChange={(value) => onChange(value )}
                formatOptionLabel={(option) => (
                    <div className="flex flex-row items-center gap-3 index-[100]">
                        {/* <div> */}
                            {/* <image 
                        src={option?.flag}
                        className='height-[10px] width-[14px]'
                        /> */}
                        {/* </div> */}
                        <div>
                            {option?.hubname}
                            {/* <span className='text-neutral-800 ml-1'>
                                {option.region}
                            </span> */}
                        </div>
                    </div>

                    
                )}
                theme={(theme) => ({
                    ...theme,
                    borderRadius:6,
                    colors
                    : {
                        ...theme.colors,
                        primary: 'black',
                        primary25: '#ffe4e6'
                    }
                })}
            />
        </div>
    )
}

export default TradehubSelect
