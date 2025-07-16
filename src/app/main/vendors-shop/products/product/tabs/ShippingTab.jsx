import { MenuItem, Select } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useProductShippingWeightUnit } from "app/configs/data/server-calls/product-units/useProductUnits";
import { Controller, useFormContext } from "react-hook-form";

/**
 * The shipping tab.
 */
function ShippingTab() {
  const {
    data: shippingWeightUnit,
    // isLoading: shippingweightIsLoading
  } = useProductShippingWeightUnit();

  // console.log("shipinUniWeight", shippingWeightUnit?.data)
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
                          <MenuItem value="">
                            Select a product unit weight
                          </MenuItem>
                          {shippingWeightUnit?.data?.shippingweights &&
                            shippingWeightUnit?.data?.shippingweights?.map(
                              (option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.weightname}
                                </MenuItem>
                              )
                            )}
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
    </div>
  );
}

export default ShippingTab;
