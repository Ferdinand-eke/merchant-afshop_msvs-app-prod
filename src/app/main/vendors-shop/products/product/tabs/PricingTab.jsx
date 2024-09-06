import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  calculateCompanyEarnings,
  calculateShopEarnings,
} from "app/configs/Calculus";
import { Controller, useFormContext } from "react-hook-form";

/**
 * The pricing tab.
 */
function PricingTab({ shopData }) {
  const methods = useFormContext();
  const { control, formState, watch, getValues } = methods;
  //   const { formState, watch, getValues } = methods;
  
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
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
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
                startAdornment: (
                  <InputAdornment position="start">N</InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
          )}
        />

        {/* <Controller
          name="priceCommissionIncl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Commission Included Price"
              id="priceCommissionIncl"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
          )}
        /> */}
      </div>
      <div className="flex items-center text-slate-500">
        <span>
          {/* <Lucide
                        icon="Lightbulb"
                        className="w-5 h-5 text-warning"
                      /> */}
        </span>
        <div className="ml-2">
          <span className="mr-1">
            Your product price is currently set at {""}{" "}
            <span className="text-primary font-medium">
              {/* {getValues()?.price} */}N
              {getValues()?.price ? getValues()?.price : 0}{" "}
            </span>
            . At {shopData?.data?.data?.shopplan?.percetageCommissionCharge}%
            commission you earn{" "}
            <span className="text-primary font-medium">
              N
              {calculateShopEarnings(
                getValues()?.price,
                shopData?.data?.data?.shopplan
                  ?.percetageCommissionChargeConversion
              )}
            </span>{" "}
            while we earn{" "}
            <span className="text-primary font-medium">
              N
              {calculateCompanyEarnings(
                getValues()?.price,
                shopData?.data?.data?.shopplan
                  ?.percetageCommissionChargeConversion
              )}
            </span>
          </span>
          {/* <a
                        href="https://themeforest.net/item/midone-jquery-tailwindcss-html-admin-template/26366820"
                        className="text-primary font-medium"
                        target="blank"
                      >
                        Learn More
                      </a> */}
        </div>
      </div>

      {/* <Controller
        name="priceTaxExcl"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Tax Excluded Price"
            id="priceTaxExcl"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />

      <Controller
        name="priceTaxIncl"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Tax Included Price"
            id="priceTaxIncl"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="taxRate"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Tax Rate"
            id="taxRate"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="comparedPrice"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Compared Price"
            id="comparedPrice"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            type="number"
            variant="outlined"
            fullWidth
            helperText="Add a compare price to show next to the real price"
          />
        )}
      /> */}
    </div>
  );
}

export default PricingTab;
