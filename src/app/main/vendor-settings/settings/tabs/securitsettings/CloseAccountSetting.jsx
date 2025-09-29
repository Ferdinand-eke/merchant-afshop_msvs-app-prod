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
import { useGetMinimizedJustMyShopDetailsQuery } from "app/configs/data/server-calls/shopdetails/useShopDetails";
import { toast } from "react-toastify";
import { useShopSettingsCloseShopAccount } from "app/configs/data/server-calls/auth/useAuth";
// import { useGetSecuritySettingsQuery, useUpdateSecuritySettingsMutation } from '../SettingsApi';

const defaultValues = {
  shopemail: "",
  checkEmail: "",
  closeAccount: false,
  // askPasswordChange: false,
};
/**
 * Form Validation Schema
 */
const schema = z.object({
  // currentPassword: z.string(),
  // newPassword: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),

  // oldPassword: z.string(),
  // password: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),
  // confirmPassword: '',
  shopemail: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	checkEmail: z.string().email('You must enter a valid email').nonempty('You must enter an email'),

  closeAccount: z.boolean(),
  // askPasswordChange: z.boolean(),
});

function CloseAccountSetting() {
  // const { data: securitySettings } = useGetSecuritySettingsQuery();
  // const [updateSecuritySettings, { error: updateError, isSuccess }] = useUpdateSecuritySettingsMutation();

  const { data: shopData } = useGetMinimizedJustMyShopDetailsQuery();
  const closeThisAccount = useShopSettingsCloseShopAccount()
  const {
    control,
    setError,
    reset,
    watch,
    handleSubmit,
    formState,
    getValues,
  } = useForm({
    defaultValues,
    mode: "all",
    resolver: zodResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const { closeAccount } = watch();

  useEffect(() => {
    reset(shopData?.data);
  }, [shopData?.data, reset]);
  // useEffect(() => {
  // 	reset({ ...securitySettings, currentPassword: '', newPassword: '' });
  // }, [isSuccess]);

  // useEffect(() => {
  // 	reset(securitySettings);
  // }, [securitySettings, reset]);
  // useEffect(() => {
  // 	reset({ ...securitySettings, currentPassword: '', newPassword: '' });
  // }, [isSuccess]);
  // useEffect(() => {
  // 	if (updateError) {
  // 		updateError?.response?.data?.map((err) => {
  // 			setError(err.name, { type: 'manual', message: err.message });
  // 			return undefined;
  // 		});
  // 	}
  // }, [updateError, setError]);

  /**
   * Form Submit
   */
  function onSubmit(formData, e) {
    e.preventDefault();

    console.log("Form Data", formData);
    return;
    // updateSecuritySettings(formData);
  }


  const onCloseAccount = () => {

   
   

    if(getValues().shopemail?.toString() === getValues()?.checkEmail?.toString()){
     
      if (window.confirm("Are you sure abou this?. We would love to have you reconsider, how do we help avoid this, because this action is irreversible as all data concerning you will be totally erased from our services")) {
        console.log("Closng user account...", getValues());
        closeThisAccount.mutate()
      }
    }else{
      toast.error('you have entered incorrect details')
    }
  };

  // console.log("ShopMinimizedData", shopData?.data);

  return (
    <div className="w-full max-w-3xl">
      <Divider className="mb-40 mt-44 border-t" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <div className="w-full">
            <Typography className="text-xl">
              Close Account preferences
            </Typography>
            <Typography color="text.secondary">
              Close your account if this you consider taking a break from us
              with following preferences.
            </Typography>
          </div>
          <div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-32">
            <div className="flex items-center justify-between sm:col-span-4">
              <Controller
                name="closeAccount"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="flex flex-col w-full">
                    <FormControlLabel
                      classes={{ root: "m-0", label: "flex flex-1" }}
                      labelPlacement="start"
                      label="Close this merchant accunt"
                      control={
                        <Switch
                          onChange={(ev) => {
                            onChange(ev.target.checked);
                          }}
                          checked={value}
                          name="closeAccount"
                        />
                      }
                    />
                    {/* <FormHelperText>
										Protects you against password theft by requesting an authentication code via SMS
										on every login.
									</FormHelperText> */}
                  </div>
                )}
              />
            </div>
          </div>
        </>

        {closeAccount && (
          <>
            <div className="w-full max-w-3xl">
              <form onSubmit={handleSubmit(onCloseAccount)}>
                {/* <div className="w-full">
					<Typography className="text-xl">Change your email</Typography>
					<Typography color="text.secondary">
						You can only change your email twice within 6 months!
					</Typography>
				</div> */}
                <div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-32">
                  <div className="sm:col-span-4">
                    <Controller
                      name="shopemail"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Current email "
                          type="email"
                          error={!!errors.shopemail}
                          helperText={errors?.shopemail?.message}
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FuseSvgIcon size={20}>
                                  heroicons-solid:mail
                                </FuseSvgIcon>
                              </InputAdornment>
                            ),
                          }}
                          disabled
                        />
                      )}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Controller
                      name="checkEmail"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col w-full">
                          <TextField
                            {...field}
                            label="Confirm email"
                            type="email"
                            error={!!errors.checkEmail}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FuseSvgIcon size={20}>
                                    heroicons-solid:mail
                                  </FuseSvgIcon>
                                </InputAdornment>
                              ),
                            }}
                            helperText={errors?.checkEmail?.message}
                          />

                          <FormHelperText>
                            Please type the email as seen in the above field
                            here to really confirm your decision on closing this
                            account
                          </FormHelperText>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <Divider className="mb-40 mt-44 border-t" />
                <div className="flex items-center justify-end space-x-16">
                  <Button
                    variant="outlined"
                    disabled={_.isEmpty(dirtyFields)}
                    // onClick={() => reset(securitySettings)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={
                      _.isEmpty(dirtyFields) || !isValid
                      // || changeMail.isLoading
                    }
                    // type="submit"
                    onClick={() => onCloseAccount()}
                  >
                    Close this account
                  </Button>
                </div>

                <div className="my-40 border-t" />
              </form>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default CloseAccountSetting;
