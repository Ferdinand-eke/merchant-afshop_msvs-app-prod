import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { calculateShopEarnings } from 'app/configs/Calculus';
import { Controller, useFormContext } from 'react-hook-form';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';

/**
 * The pricing tab.
 */
function PricingTabProperty({ shopData }) {
	const methods = useFormContext();
	const { control, formState, watch, getValues } = methods;

	return (
		<div>
			<div className="flex -mx-4">
				<Controller
					name="price"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-4"
							label=" Price"
							id="price"
							InputProps={{
								startAdornment: <InputAdornment position="start">N</InputAdornment>
							}}
							type="number"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="listprice"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 mx-4"
							label="List Price"
							id="listprice"
							InputProps={{
								startAdornment: <InputAdornment position="start">N</InputAdornment>
							}}
							type="number"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex items-center text-slate-500">
				<span />
				<div className="ml-2">
					<span className="mr-1">
						Your listed property price is currently set at {''}{' '}
						<span className="text-primary font-medium">
							N{getValues()?.price ? formatCurrency(getValues()?.price) : 0}{' '}
						</span>
						. At {shopData?.merchantShopplan?.percetageCommissionCharge}% commission you earn{' '}
						<span className="text-primary font-medium">
							N
							{formatCurrency(
								calculateShopEarnings(
									getValues()?.price,
									shopData?.merchantShopplan?.percetageCommissionChargeConversion
								)
							)}
						</span>{' '}
						{/* while we earn{" "}
            <span className="text-primary font-medium">
              N
              {formatCurrency(calculateCompanyEarnings(
                getValues()?.price,
                shopData?.merchantShopplan
                  ?.percetageCommissionChargeConversion
              ))}
            </span> */}
					</span>
				</div>
			</div>
		</div>
	);
}

export default PricingTabProperty;
