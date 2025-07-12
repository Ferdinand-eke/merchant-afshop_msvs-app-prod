import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import _ from "@lodash";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import useJwtAuth from "../useJwtAuth";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useShopAdminLogin } from "app/configs/data/server-calls/auth/admin-auth";
/**
 * Form Validation Schema
 */
const schema = z.object({
//   email: z
//     .string()
//     .email("You must enter a valid email")
//     .nonempty("You must enter an email"),
shopemail: z
    .string()
    .email("You must enter a valid email")
    .nonempty("You must enter an email"),
  password: z
    .string()
    .min(4, "Password is too short - must be at least 4 chars.")
    .nonempty("Please enter your password."),
});
const defaultValues = {

  shopemail: "",
  password: "",
  remember: true,
};

function JwtSignInForm() {
  const adminLogIn = useShopAdminLogin()
  const { signIn, isLoginLoading } = useJwtAuth();
  const { control, formState, handleSubmit, setValue, setError } = useForm({
    mode: "onChange",
    defaultValues,
    // resolver: zodResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const [showPassword, setShowPassword] = useState(false) 
 

  
  function onSubmit(formData) {
    console.log("Login-Values", formData);
    const { 
		shopemail,
		password } = formData;
    signIn({
      shopemail,
      password,
    }).catch((error) => {
      console.log("FormJSXError", error);

   
    });
  }

  const toggleShowPassword = () =>{
		setShowPassword(!showPassword)
	}

  return (
    <form
      name="loginForm"
      noValidate
      className="mt-32 flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="shopemail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-24"
            label="Email"
            autoFocus
            type="email"
            error={!!errors.shopemail}
            helperText={errors?.shopemail?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-24"
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            required
            fullWidth
            InputProps={{
							endAdornment: <InputAdornment position="end">
								<IconButton
								onClick={() => toggleShowPassword()}
								>

									{showPassword ? <VisibilityOff/> : <Visibility/>}
								</IconButton>
								</InputAdornment>
						}}
          />
        )}
      />

      <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-md font-medium"
					to="/forgot-password"
				>
					Forgot password?
				</Link>
			</div>

      <Button
        variant="contained"
        color="secondary"
        className=" mt-16 w-full"
        aria-label="Sign in"
        disabled={_.isEmpty(dirtyFields) || !isValid || adminLogIn.isLoading }
        type="submit"
        size="large"
      >
        { adminLogIn.isLoading ? "processing..." : "Sign in"}
        {/* Sign in */}
      </Button>
    </form>
  );
}

export default JwtSignInForm;
