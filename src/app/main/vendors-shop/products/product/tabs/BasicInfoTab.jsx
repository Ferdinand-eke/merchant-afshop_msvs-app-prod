import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { MenuItem, Select, Typography } from "@mui/material";
import useProductCats from "app/configs/data/server-calls/product-categories/useProductCategories";
import useHubs from "app/configs/data/server-calls/tradehubs/useTradeHubs";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const {
    data: hubs,
    // isLoading, refetch
  } = useHubs();
  const {
    data: catData,
    //  isLoading: catIsLoading
  } = useProductCats();
  

    // console.log("tradeHUBS", hubs?.data);
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  return (
    <div>
      <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
        Trade Hub
      </Typography>
      <Controller
        name="tradehub"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="tradehub"
            label="Tradehub"
            variant="outlined"
            placeholder="Select a category"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.category}
            helpertext={errors?.category?.message}
          >
            <MenuItem value="">Select a product category</MenuItem>
            {hubs?.data?.tradehubs &&
              hubs?.data?.tradehubs?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.hubname}
                </MenuItem>
              ))}
          </Select>
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors?.name?.message}
          />
        )}
      />

      <Controller
        name="shortDescription"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Short Description"
            autoFocus
            id="shortDescription"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            error={!!errors.shortDescription}
            helperText={errors?.shortDescription?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="description"
            label="Description"
            type="text"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
        Product category
      </Typography>
      <Controller
        name="category"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="category"
            label="category"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.category}
            helpertext={errors?.category?.message}
            //  {...other}
            //  {...(error && {error: true, helperText: error})}
          >
            <MenuItem value="">Select a product category</MenuItem>
            {catData?.data?.categories &&
              catData?.data?.categories?.map((option, id) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
