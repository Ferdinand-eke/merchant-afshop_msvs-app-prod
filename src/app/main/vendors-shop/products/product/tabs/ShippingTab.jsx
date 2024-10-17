import { MenuItem, Select } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useProductShippingWeightUnit } from "app/configs/data/server-calls/product-units/useProductUnits";
import { Controller, useFormContext } from "react-hook-form";

/**
 * The shipping tab.
 */
function ShippingTab() {
	const { data: shippingWeightUnit, isLoading: shippingweightIsLoading } =
    useProductShippingWeightUnit(); 

	// console.log("shipinUniWeight", shippingWeightUnit)
//   const methods = useFormContext();
//   const { control } = methods;

  const methods = useFormContext();
	const { control, formState } = methods;

	const { errors } = formState;
  return (
    <div>
      <div className="flex -mx-4">
        <Controller
          name="length"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Length"
              id="length"
              variant="outlined"
              fullWidth
			  InputProps={{
                startAdornment: (
                  <InputAdornment position="start">cm</InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="breadth"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="breadth"
              autoFocus
              id="breadth"
              variant="outlined"
              fullWidth
			  InputProps={{
                startAdornment: (
                  <InputAdornment position="start">cm</InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Height"
              id="height"
              variant="outlined"
              fullWidth
			  InputProps={{
                startAdornment: (
                  <InputAdornment position="start">cm</InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>

	  <div className="flex -mx-4">
      

<Controller
        name="productWeight"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Product Weight"
            id="productWeight"
            variant="outlined"
            fullWidth
			InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
					<Controller
        name="perUnitShippingWeight"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="perUnitShippingWeight"
            label="Shipping weight unit"
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
            {shippingWeightUnit?.data?.data &&
              shippingWeightUnit?.data?.data?.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.weightname}
                </MenuItem>
              ))}
          </Select>
        )}
      />
				  </InputAdornment>
                ),
              }}
			
          />
        )}
      />


        
      </div>

     
      {/* <Controller
        name="extraShippingFee"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Extra Shipping Fee"
            id="extraShippingFee"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            fullWidth
          />
        )}
      /> */}
    </div>
  );
}

export default ShippingTab;
