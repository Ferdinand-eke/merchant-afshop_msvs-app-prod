import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  calculateCompanyEarnings,
  calculateShopEarnings,
} from "app/configs/Calculus";
import { Controller, useFormContext } from "react-hook-form";
import { formatCurrency } from "../../../pos/PosUtils";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

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
                  <InputAdornment position="start">N</InputAdornment>
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
      </div>
      <div className="flex items-center text-slate-500">
        <span>
          <FuseSvgIcon
            size={20}
            color="action"
            className="bg-orange-700 rounded-12"
          >
            heroicons-solid:bell
          </FuseSvgIcon>
        </span>

        <div className="ml-2">
          <span className="mr-1">
            Your product price is currently set at {""}{" "}
            <span className="text-primary font-medium">
              N{getValues()?.price ? getValues()?.price : 0}{" "}
            </span>
            . At {shopData?.merchantShopplan?.percetageCommissionCharge}%
            commission you earnings will be{" "}
            <span className="text-primary font-bold">
              N
              {formatCurrency(
                calculateShopEarnings(
                  getValues()?.price,
                  shopData?.merchantShopplan
                    ?.percetageCommissionChargeConversion
                )
              )}
            </span>{" "}
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
          {/* <a
                        href="https://themeforest.net/item/midone-jquery-tailwindcss-html-admin-template/26366820"
                        className="text-primary font-medium"
                        target="blank"
                      >
                        Learn More
                      </a> */}
        </div>
      </div>
    </div>
  );
}

export default PricingTab;
