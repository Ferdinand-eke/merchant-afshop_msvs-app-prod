import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

/**
 * The shipping tab.
 */
function ShippingTabProperty() {
  const methods = useFormContext();
  const { control } = methods;
  return (
    <div>
      <div className="flex -mx-4">
        <Controller
          name="width"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Property width in meter(s)"
              autoFocus
              id="width"
              variant="outlined"
              fullWidth
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
              label="Property heigth in meter(s)"
              id="height"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Controller
          name="length"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Property Length in meter(s)"
              id="length"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>

      {/* <Controller
				name="weight"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Weight"
						id="weight"
						variant="outlined"
						fullWidth
					/>
				)}
			/> */}
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

      {/* <>
	  <Controller
        name="length"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Property measurement length"
            id="length"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Length</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="width"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Property measurement width"
            id="width"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Width</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="heigth"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Property measurement heigth"
            id="heigth"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Heigth</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            fullWidth
          />
        )}
      />
	  </> */}
    </div>
  );
}

export default ShippingTabProperty;
