import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import _ from "@lodash";
import { useEffect } from "react";
import SecuritySetting from "./securitsettings/SecuritySetting";
import ChangeEmailSetting from "./securitsettings/ChangeEmailSetting";
import { useShopSettingsResetPass } from "app/configs/data/server-calls/auth/useAuth";
import CloseAccountSetting from "./securitsettings/CloseAccountSetting";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  twoStepVerification: false,
  askPasswordChange: false,
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
/**
 * Form Validation Schema
 */
const schema = z
  .object({
    oldPassword: z.string().nonempty("Please enter your current password."),
    password: z
      .string()
      .nonempty("Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum."),
    confirmPassword: z.string().nonempty("Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });



function SecurityTab() {
  const resetShopPass = useShopSettingsResetPass();
  // const { data: securitySettings } = useGetSecuritySettingsQuery();
  const { control, setError, reset, handleSubmit, formState, getValues } =
    useForm({
      defaultValues,
      mode: "all",
      resolver: zodResolver(schema),
    });
  const { isValid, dirtyFields, errors } = formState;
  useEffect(() => {
    if (resetShopPass?.isSuccess) {
      reset();
    }
  }, [resetShopPass?.isSuccess, reset]);

  /**
   * Form Submit
   */
  function onSubmit() {
    resetShopPass.mutate(getValues());
  }

  
  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Typography className="text-xl">Change your password</Typography>
          <Typography color="text.secondary">
            You can only change your password twice within 24 hours!
          </Typography>
        </div>
        <div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-32">
          <div className="sm:col-span-4">
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current password (default:changeme)"
                  type="password"
                  error={!!errors.oldPassword}
                  helperText={errors?.oldPassword?.message}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
          <div className="sm:col-span-4">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="New password"
                  type="password"
                  error={!!errors.password}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors?.password?.message}
                />
              )}
            />
          </div>
          <div className="sm:col-span-4">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password Confirm"
                  type="password"
                  error={!!errors.confirmPassword}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors?.confirmPassword?.message}
                />
              )}
            />
          </div>
        </div>

        <Divider className="mb-40 mt-44 border-t" />
        <div className="flex items-center justify-end space-x-16">
          <Button
            variant="outlined"
            disabled={_.isEmpty(dirtyFields)}
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={
              _.isEmpty(dirtyFields) || !isValid || resetShopPass?.isLoading
            }
            type="submit"
          >
            Save changed password
          </Button>
        </div>

        <div className="my-40 border-t" />
      </form>

      <ChangeEmailSetting />

      {/* <SecuritySetting /> */}

      <CloseAccountSetting />
    </div>
  );
}

export default SecurityTab;
