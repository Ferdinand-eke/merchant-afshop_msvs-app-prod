import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import _ from "@lodash";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStoreShopPreSignUpFromOtp } from "app/configs/data/server-calls/useShops/useShopsQuery";
import {
  getMerchantSignUpToken,
  removeMerchantSignUpToken,
  removeResendMerchantSignUpOtp,
} from "app/configs/utils/authUtils";
import { useEffect } from "react";
/**
 * Form Validation Schema
 */
const schema = z.object({
  otp: z.string().nonempty("You must enter your OTP"),
});
const defaultValues = {
  otp: "",
  preuser: "",
};

/**
 * The modern forgot password page.
 */
function MerchantModernReversedActivatePage({ resendOTP }) {

  const remoteResponseToken = getMerchantSignUpToken();
  const avtivateMerchant = useStoreShopPreSignUpFromOtp();
  const { control, formState, handleSubmit, reset, getValues, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: zodResolver(schema),
    });
  const { isValid, dirtyFields, errors } = formState;

  function onSubmit() {
    setValue("preuser", remoteResponseToken);

    avtivateMerchant.mutate(getValues());
  }

  useEffect(() => {
    if (avtivateMerchant?.isSuccess) {
      removeMerchantSignUpToken();
      removeResendMerchantSignUpOtp();
    }
  }, [avtivateMerchant?.isSuccess]);

  return (
    <>
      <div className="w-full px-16 py-32 ltr:border-l-1 rtl:border-r-1 sm:w-auto sm:p-48 md:p-64">
        <div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
          <img
            className="w-48"
            src="assets/images/afslogo/afLogo.svg"
            alt="logo"
          />

          <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
            Activate Your Merchant Account
          </Typography>
          <div className="mt-2 flex items-baseline font-medium">
            <Typography>Fill the form to activate your account</Typography>
          </div>

          <form
            name="registerForm"
            noValidate
            className="mt-32 flex w-full flex-col justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="OTP code"
                  type="text"
                  error={!!errors.otp}
                  helperText={errors?.otp?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              color="secondary"
              className=" mt-4 w-full"
              aria-label="Register"
              disabled={
                _.isEmpty(dirtyFields) || !isValid || avtivateMerchant.isLoading
              }
              type="submit"
              size="large"
            >
              Activate Merchant Account
            </Button>

            <Typography
              className="mt-32 text-md font-medium"
              color="text.secondary"
            >
              <span>Resend OTP on expiration of timer</span> <span>5-55</span>
              <Button
                className="ml-4 btn cursor-pointer"
                // to="/sign-in"
                onClick={() => resendOTP()}
              >
                Resend
              </Button>
            </Typography>
          </form>
        </div>
      </div>
    </>
  );
}

export default MerchantModernReversedActivatePage;
