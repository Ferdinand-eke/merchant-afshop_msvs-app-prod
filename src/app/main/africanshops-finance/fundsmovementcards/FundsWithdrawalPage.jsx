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
import AccountSummaryWidget from "./sumarycard/AccountSummaryWidget";
import { Controller, useForm, useFormContext } from "react-hook-form";
import PreviousStatementWidget from "../widgets/PreviousStatementWidget";
import {
  usePlaceWithdrawalMutation,
  useTransferToShopWalletMutation,
} from "app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import UpdateAccounWithdrawalDetails from "./sumarycard/UpdateAccounWithdrawalDetails";
/**
 * The activities page.
 */

const item = {
  image: "",
  name: "John Doe",
  description:
    "Receive orders from intending buyers, package products ordered and make available at our order collation units within your market,",
};

function FundsWithdrawalPage(props) {
  const tranferFunds = useTransferToShopWalletMutation();

  const placeWithdrawal = usePlaceWithdrawalMutation();
  const [enterAmmount, setEnterAmount] = useState(true);
  const [enterPin, setEnterPin] = useState(false);

  const [drawerError, setDrawerError] = useState("");

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      amount: "",
      accountpin: "",
    },
    // resolver: zodResolver(schema)
  });
  // const methods = useFormContext();
  const { control, formState, watch, getValues, reset } = methods;
  const { isValid, dirtyFields } = formState;
  // const methods = useFormContext();

  const { data: shopData, isLoading, isError } = useGetMyShopDetails();
  const {
    data: shopAccount,
    isLoading: accountLoading,
    isError: accountError,
  } = useGetShopAccountBalance();

  function handleWithdrawFunds() {
    if (parseInt(getValues()?.amount) < 1) {
      return toast.error("Amount is required");
    }

    if (
      getValues()?.accountpin.toString().length > 4 ||
      getValues()?.accountpin.toString().length < 4
    ) {
      return toast.error("4 digits only required");
    }

    if (shopAccount?.data?.accountBalance < getValues()?.amount) {
      return toast.error("insufficient balance to withdraw");
    }

    // return;
    console.log("FormValues 1", getValues());
    if (getValues()?.accountpin && getValues()?.amount) {
      console.log("FormValues 2", getValues());
      placeWithdrawal.mutate(getValues());
      // placeWithdrawal.isSuccess && toast.success("withdrawal placed");

      // toggleWithdrawalFormState();
    }
  }

  useEffect(() => {
    // if (tranferFunds?.isSuccess) {
    //   setDrawerError("");
    //   reset();
    // }
    if (placeWithdrawal?.isSuccess) {
      setDrawerError("");
      reset();
      // toast.success("withdrawal placed");
      toggleWithdrawalFormState()
    }
  }, [
    // tranferFunds?.isSuccess,
     placeWithdrawal.isSuccess,
     shopAccount?.data?.accountBalance
    ]);

  const initiateWithdrawal = () => {
    // setVisibleWithdrawal((current) => !current);
    setEnterAmount(true);
    setEnterPin(false);
    // reset();
  };

  const toggleWithdrawalFormState = () => {
    setEnterAmount((current) => !current);
    setEnterPin((current) => !current);
    // setEnterAmount((current) => console.log("EnterAmount", current));
    // setEnterPin((current) => console.log("EnterPin", current));

    // setEnterAmount(false)
    // setEnterPin(true)
  };
  const reverseWithdrawalFormState = () => {
    setEnterAmount((current) => !current);
    setEnterPin((current) => !current);
    // setEnterAmount((current) => console.log("EnterAmount", current));
    // setEnterPin((current) => console.log("EnterPin", current));

    // setEnterAmount(false)
    // setEnterPin(true)
  };

  const onEnterAmount = (amountData) => {
    console.log("Entered-Amount", amountData);
    if (!amountData || parseInt(amountData) === 0 || parseInt(amountData) < 1) {
      return toast.error("Withdrawal amount is required");
    }
    if (amountData) {
      console.log("Amount__2", amountData);
      toggleWithdrawalFormState();
    }
  };

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageSimple
      content={
        <>
          <div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
            {!shopAccount?.data?.bankName ||
            !shopAccount?.data?.bankAccountName ||
            !shopAccount?.data?.bankAccountNumber ||
            !shopAccount?.data?.afshopAccountPin ? (
              <>
              <>
                <Typography className="text-2xl font-extrabold leading-none tracking-tight">
                  Update your account details.
                </Typography>
                <Typography className="mt-6 text-lg" color="text.secondary">
                  You are required to provide details fo your local banc and a 4 digit pin
                  that should be kept personal for authorization .
                </Typography>
                <Timeline
                  className="py-32"
                  position="right"
                  sx={{
                    "& .MuiTimelineItem-root:before": {
                      display: "none",
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        color="primary"
                        className="mt-0 flex h-40  w-40 items-center justify-center p-0"
                      >
                        {<FuseSvgIcon>{"heroicons-solid:star"}</FuseSvgIcon>}
                      </TimelineDot>

                      {<TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent className="flex flex-col items-start pb-48 pt-0">
                      {/* eslint-disable-next-line react/no-danger */}
                      {
                        <div
                          dangerouslySetInnerHTML={{
                            __html: "Whole saller wallet",
                          }}
                        />
                      }

                      <div className="mt-8 flex flex-col text-md leading-5 sm:mt-4 sm:flex-row sm:items-center sm:space-x-8">
                        <Typography className="text-13" color="text.secondary">
                          {format(new Date(Date.now()), "MMM dd, h:mm a")}
                        </Typography>
                      </div>

                      <motion.div
                        variants={item}
                        className="flex flex-col flex-auto"
                      >
                        <PreviousStatementWidget
                          account={shopAccount?.data}
                          accountLoading={accountLoading}
                          accountError={accountError}
                        />
                      </motion.div>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        color="primary"
                        className="mt-0 flex h-40  w-40 items-center justify-center p-0"
                      >
                        {<FuseSvgIcon>{"heroicons-solid:star"}</FuseSvgIcon>}
                      </TimelineDot>

                      {<TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent className="flex flex-col items-start pb-48 pt-0">
                      <UpdateAccounWithdrawalDetails />
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>

                <motion.div variants={item}>
                  <AccountSummaryWidget
                    shopData={shopData?.data?.data}
                    isLoading={isLoading}
                  />
                </motion.div>
              </>
              </>
            ) : (
              <>
                <Typography className="text-2xl font-extrabold leading-none tracking-tight">
                  Withdraw from your wallet here.
                </Typography>
                <Typography className="mt-6 text-lg" color="text.secondary">
                  You can withraw your funds from merchant wallet to your locan
                  band accounts.
                </Typography>
                <Timeline
                  className="py-32"
                  position="right"
                  sx={{
                    "& .MuiTimelineItem-root:before": {
                      display: "none",
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        color="primary"
                        className="mt-0 flex h-40  w-40 items-center justify-center p-0"
                      >
                        {<FuseSvgIcon>{"heroicons-solid:star"}</FuseSvgIcon>}
                      </TimelineDot>

                      {<TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent className="flex flex-col items-start pb-48 pt-0">
                      {/* eslint-disable-next-line react/no-danger */}
                      {
                        <div
                          dangerouslySetInnerHTML={{
                            __html: "Whole saller wallet",
                          }}
                        />
                      }

                      <div className="mt-8 flex flex-col text-md leading-5 sm:mt-4 sm:flex-row sm:items-center sm:space-x-8">
                        <Typography className="text-13" color="text.secondary">
                          {format(new Date(Date.now()), "MMM dd, h:mm a")}
                        </Typography>
                      </div>

                      <motion.div
                        variants={item}
                        className="flex flex-col flex-auto"
                      >
                        <PreviousStatementWidget
                          account={shopAccount?.data}
                          accountLoading={accountLoading}
                          accountError={accountError}
                        />
                      </motion.div>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        color="primary"
                        className="mt-0 flex h-40  w-40 items-center justify-center p-0"
                      >
                        {<FuseSvgIcon>{"heroicons-solid:star"}</FuseSvgIcon>}
                      </TimelineDot>

                      {<TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent className="flex flex-col items-start pb-48 pt-0">
                      {enterAmmount && (
                        <>
                          <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16 mx-4"
                                label=" Amount"
                                id="amount"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      NGN
                                    </InputAdornment>
                                  ),
                                }}
                                type="number"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />
                          {drawerError && <pan>{drawerError}</pan>}

                          <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            disabled={!getValues()?.amount}
                            onClick={() => onEnterAmount(getValues()?.amount)}
                          >
                            Enter amount
                          </Button>
                        </>
                      )}

                      {enterPin && (
                        <>
                          <Controller
                            name="accountpin"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="mt-8 mb-16 mx-4"
                                label=" Amount"
                                id="accountpin"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      Pin
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
                              placeWithdrawal?.isLoading
                            }
                            onClick={handleWithdrawFunds}
                          >
                            Withdraw from wallet
                          </Button>
                        </>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>

                <motion.div variants={item}>
                  <AccountSummaryWidget
                    shopData={shopData?.data?.data}
                    isLoading={isLoading}
                  />
                </motion.div>
              </>
            )}
          </div>
        </>
      }
      scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default FundsWithdrawalPage;
