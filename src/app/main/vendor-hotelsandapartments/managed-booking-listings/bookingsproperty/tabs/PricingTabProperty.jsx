import { Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  calculateCompanyEarnings,
  calculateShopEarnings,
} from "app/configs/Calculus";
import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";

/**
 * The pricing tab.
 */
function PricingTabProperty({ shopData }) {
  const routeParams = useParams();
	const { productId } = routeParams;
  // const methods = useFormContext();
	// const { formState, watch, getValues } = methods;
	
  
	const theme = useTheme();

  const methods = useFormContext();
  const { control, formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const [addRoomsDiv, setAddRoomsDiv] = useState(getValues()?.isRentIndividualRoom)

  useEffect(() => {
    if(getValues()?.isRentIndividualRoom){
      setAddRoomsDiv(true)
    }else{
      setAddRoomsDiv(false)
    }

  },[getValues()?.isRentIndividualRoom])
  // const detectChange =


// console.log("rentinINdividual_ROom", getValues()?.isRentIndividualRoom)
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

       
      </div>
      

      <div className="flex items-center text-slate-500">
        <span></span>
        <div className="ml-2">
          <span className="mr-1">
            Your listed property price is currently set at {""}{" "}
            <span className="text-primary font-medium">
              NGN
              {formatCurrency(getValues()?.price ? getValues()?.price : 0)}{" "}
            </span>
            . At {shopData?.data?.merchant?.merchantShopplan?.percetageCommissionCharge}%
            commission you earn{" "}
            <span className="text-primary font-medium">
              N
              {formatCurrency(calculateShopEarnings(
                getValues()?.price,
                shopData?.data?.merchant?.merchantShopplan?.percetageCommissionChargeConversion
              ))}
            </span>{" "}
            {/* while we earn{" "}
            <span className="text-primary font-medium">
              N
              {calculateCompanyEarnings(
                getValues()?.price,
                shopData?.data?.merchant?.merchantShopplan?.percetageCommissionChargeConversion
              )}
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


      <Controller
        name="bookingPeriod"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <FormControl
            fullWidth
            className="mt-16 mb-16"
          >
            <InputLabel id="bookingPeriod-label">Booking Period</InputLabel>
            <Select
              labelId="bookingPeriod-label"
              id="bookingPeriod"
              label="Booking Period"
              onChange={onChange}
              value={value || ""}
            >
              <MenuItem value="">
                <em>Select booking period</em>
              </MenuItem>
              <MenuItem value="NIGHT">Per Night</MenuItem>
              <MenuItem value="WEEK">Per Week</MenuItem>
              <MenuItem value="MONTH">Per Month</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="isRentIndividualRoom"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <FormControl
            fullWidth
            className="mt-16 mb-16"
          >
            <InputLabel id="isRentIndividualRoom-label">Rent Rooms Individually?</InputLabel>
            <Select
              labelId="isRentIndividualRoom-label"
              id="isRentIndividualRoom"
              label="Rent Rooms Individually?"
              onChange={onChange}
              value={value === "" || value === null || value === undefined ? "" : value}
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              <MenuItem value={true}>Yes, rent rooms individually</MenuItem>
              <MenuItem value={false}>No, rent entire property</MenuItem>
            </Select>
          </FormControl>
        )}
      />

     
     
    </div>
  );
}

export default PricingTabProperty;
