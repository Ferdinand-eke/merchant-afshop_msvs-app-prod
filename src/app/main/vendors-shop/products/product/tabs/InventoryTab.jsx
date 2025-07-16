import InputAdornment from "@mui/material/InputAdornment";
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useProductUnitsByShopPlan } from "app/configs/data/server-calls/product-units/useProductUnits";
import { MenuItem, Select } from "@mui/material";

/**
 * The inventory tab.
 */
function InventoryTab({shopData}) {
	// const user = useAppSelector(selectUser);
	const { data: unitsByPlan } = useProductUnitsByShopPlan(shopData?.merchantShopplan?.id);

  // console.log("merchant_Plan", shopData?.merchantShopplan?.id)
  // console.log("Unit_WEIGHTS", unitsByPlan)

	const methods = useFormContext();
	const { control, formState } = methods;

	const { errors } = formState;
	return (
		<div>

<div className="flex -mx-4">
        <Controller
          name="quantityInStock"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label=" Quantity In Stock"
              id="quantityInStock"
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">$</InputAdornment>
              //   ),
              // }}
              type="number"
              variant="outlined"
              fullWidth
            />
          )}
        />

       
<Controller
        name="quantityunitweight"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="quantityunitweight"
            label="Quantity unit weight"
            variant="outlined"
            placeholder="Select a category"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.category}
            helpertext={errors?.category?.message}
          >
            <MenuItem value="">Select a product unit weight</MenuItem>
            {unitsByPlan?.data?.unitweight &&
              unitsByPlan?.data?.unitweight?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.unitname}
                </MenuItem>
              ))}
          </Select>
        )}
      />

      
      </div>


			{/* <Controller
				name="sku"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="SKU"
						autoFocus
						id="sku"
						variant="outlined"
						fullWidth
					/>
				)}
			/> */}

			{/* <Controller
				name="quantity"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Quantity"
						id="quantity"
						variant="outlined"
						type="number"
						fullWidth
					/>
				)}
			/> */}
		</div>
	);
}

export default InventoryTab;
