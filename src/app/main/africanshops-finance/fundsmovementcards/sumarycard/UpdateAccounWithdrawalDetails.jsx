import { motion } from "framer-motion";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { format } from "date-fns/format";
import { Button, Card, InputAdornment, TextField } from "@mui/material";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";
import useGetMyShopDetails, {
  useGetShopAccountBalance,
} from "app/configs/data/server-calls/shopdetails/useShopDetails";
// import AccountSummaryWidget from "./sumarycard/AccountSummaryWidget";
import { Controller, useForm, useFormContext } from "react-hook-form";
// import PreviousStatementWidget from "../widgets/PreviousStatementWidget";
import {
  usePlaceWithdrawalMutation,
  useTransferToShopWalletMutation,
  useUpdateMyShopAccountMutation,
} from "app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
/**
 * The activities page.
 */


function UpdateAccounWithdrawalDetails(props) {
    const updateMyShopAccount = useUpdateMyShopAccountMutation();
  const tranferFunds = useTransferToShopWalletMutation();

  const placeWithdrawal = usePlaceWithdrawalMutation();
  const [enterDetails, setEnterDetails] = useState(true);
  const [enterPin, setEnterPin] = useState(false);

  const [drawerError, setDrawerError] = useState("");
  
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      
        afshopAccountPin: '',
        bankName: '',
        bankAccountName: '',
        bankAccountNumber: '',
    },
    // resolver: zodResolver(schema)
  });
  // const methods = useFormContext();
  const { control, formState, watch, getValues, reset } = methods;
  const { isValid, dirtyFields, errors } = formState;
  // const methods = useFormContext();

//   const { data: shopData, isLoading, isError } = useGetMyShopDetails();
//   const {
//     data: shopAccount,
//     isLoading: accountLoading,
//     isError: accountError,
//   } = useGetShopAccountBalance();

  function handleAccountAndPinUpdate() {

    if (getValues()?.afshopAccountPin && getValues()?.bankName && getValues()?.bankAccountName && getValues()?.bankAccountNumber) { 
      updateMyShopAccount.mutate(getValues());
    }
  }

  useEffect(() => {
   
    if (updateMyShopAccount?.isSuccess) {
      setDrawerError("");
      reset();
    //   toast.success("Update successful");
    toggleWithdrawalFormState()
    }
  }, [ updateMyShopAccount.isSuccess]);


  const toggleWithdrawalFormState = () => {
    setEnterDetails((current) => !current);
    setEnterPin((current) => !current);
  };
  const reverseWithdrawalFormState = () => {
    setEnterDetails((current) => !current);
    setEnterPin((current) => !current);
 
  };

  const onEnterDetails = () => {
    if (!getValues()?.bankName || !getValues()?.bankAccountName || !getValues()?.bankAccountNumber) {
      return toast.error("All fields are required");
    }

    toggleWithdrawalFormState();

  };

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageSimple
      content={
        <>
          <div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
            <>
              <>
                

              {enterDetails && (
                        <>
                          <Controller
                            name="bankName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16"
                                required
                                label="Bank Name"
                                autoFocus
                                id="bankName"
                                variant="outlined"
                                fullWidth
                                error={!!errors.bankName}
                                helperText={errors?.bankName?.message}
                              />
                            )}
                          />

                          <Controller
                            name="bankAccountName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16"
                                required
                                label="Bank Account Name"
                                autoFocus
                                id="bankAccountName"
                                variant="outlined"
                                fullWidth
                                error={!!errors.bankAccountName}
                                helperText={errors?.bankAccountName?.message}
                              />
                            )}
                          />

                          <Controller
                            name="bankAccountNumber"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16 mx-4"
                                label="Account Number"
                                id="bankAccountNumber"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      NUBAN
                                    </InputAdornment>
                                  ),
                                }}
                                type="number"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />

                          <Button
                            className="whitespace-nowrap mx-4 mb-4"
                            variant="contained"
                            color="secondary"
                            disabled={!getValues()?.bankName || !getValues()?.bankAccountName || !getValues()?.bankAccountNumber}
                            onClick={() => onEnterDetails()}
                          >
                            Enter Details
                          </Button>
                        </>
                      )}

                      {enterPin && (
                        <>
                          <Controller
                            name="afshopAccountPin"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16"
                                required
                                label="Your pin"
                                autoFocus
                                id="afshopAccountPin"
                                variant="outlined"
                                fullWidth
                                error={!!errors.afshopAccountPin}
                                helperText={errors?.afshopAccountPin?.message}
                              />
                            )}
                          />

                          <Button
                            className="whitespace-nowrap mx-4 mb-4"
                            variant="contained"
                            color="primary"
                            onClick={() => reverseWithdrawalFormState()}
                          >
                            Go back
                          </Button>
                          <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            disabled={
                              _.isEmpty(dirtyFields) ||
                              !isValid ||
                              updateMyShopAccount?.isLoading
                            }
                            onClick={handleAccountAndPinUpdate}
                          >
                            Update Account & Pin
                          </Button>
                        </>
                      )}
              </>
            </>
          </div>
        </>
      }
      scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default UpdateAccounWithdrawalDetails;
