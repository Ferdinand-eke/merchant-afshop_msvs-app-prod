import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { get_SHOP_FORGOTPASS_TOKEN } from 'app/configs/utils/authUtils';
import { useResetShopPass } from 'app/configs/data/server-calls/merchant-auth';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		activationCode: z.string().nonempty('Activation code is required'),
		newPassword: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		confirmpasword: z.string().nonempty('Password confirmation is required')
	})
	.refine((data) => data.newPassword === data.confirmpasword, {
		message: 'Passwords must match',
		path: ['confirmpasword']
	});

const defaultValues = {
	confirmpasword: '',
	newPassword: '',
	activationCode: '',
	activationToken: ''
};

/**
 * AfricanShops Reset Password Page - Redesigned for Production
 * Secure, engaging, and professional password reset completion experience
 */
function ModernReversedResetPasswordPage() {
	const { mutate: shopResetPass, isLoading } = useResetShopPass();
	const { control, formState, handleSubmit, getValues, setValue } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		const activationTokenToCheck = get_SHOP_FORGOTPASS_TOKEN();

		setValue('activationToken', activationTokenToCheck);

		shopResetPass(getValues());
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-32">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:shadow md:w-full md:max-w-6xl">
				{/* Left Side - Form */}
				<div className="w-full px-16 py-32 sm:w-auto sm:p-48 md:p-64 ltr:border-r-1 rtl:border-l-1">
					<div className="mx-auto w-full max-w-384 sm:mx-0 sm:w-384">
						{/* Logo with Animation */}
						<motion.img
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className="w-48"
							src="assets/images/afslogo/afslogo.png"
							alt="AfricanShops Logo"
						/>

						{/* Header */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<Typography className="mt-32 text-40 font-black leading-tight tracking-tight">
								Create New Password
							</Typography>
							<Typography
								className="mt-8"
								color="text.secondary"
							>
								Enter the OTP code sent to your email, then create a strong new password.
							</Typography>
						</motion.div>

						{/* Info Alert with Gradient */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Box
								className="mt-32 p-20 rounded-xl"
								sx={{
									background:
										'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 127, 0, 0.05) 100%)',
									border: '1px solid',
									borderColor: alpha('#FF6B35', 0.2)
								}}
							>
								<Box className="flex items-start gap-12">
									<Box
										sx={{
											width: 32,
											height: 32,
											borderRadius: '8px',
											background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0
										}}
									>
										<FuseSvgIcon
											size={18}
											sx={{ color: 'white' }}
										>
											heroicons-solid:shield-check
										</FuseSvgIcon>
									</Box>
									<div>
										<Typography
											className="text-14 font-bold mb-4"
											sx={{ color: '#FF6B35' }}
										>
											Password Security Requirements
										</Typography>
										<Typography
											className="text-13 leading-relaxed"
											color="text.secondary"
										>
											Your password must be at least 8 characters long. Choose a strong, unique
											password to keep your account secure.
										</Typography>
									</div>
								</Box>
							</Box>
						</motion.div>

						{/* Form */}
						<motion.form
							name="registerForm"
							noValidate
							className="mt-32 flex w-full flex-col justify-center"
							onSubmit={handleSubmit(onSubmit)}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Controller
								name="activationCode"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-24"
										label="OTP Activation Code"
										type="text"
										error={!!errors.activationCode}
										helperText={errors?.activationCode?.message}
										variant="outlined"
										required
										fullWidth
										InputProps={{
											startAdornment: (
												<Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
													<FuseSvgIcon
														size={20}
														color="action"
													>
														heroicons-outline:key
													</FuseSvgIcon>
												</Box>
											)
										}}
									/>
								)}
							/>

							<Controller
								name="newPassword"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-24"
										label="New Password"
										type="password"
										error={!!errors.newPassword}
										helperText={errors?.newPassword?.message}
										variant="outlined"
										required
										fullWidth
										InputProps={{
											startAdornment: (
												<Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
													<FuseSvgIcon
														size={20}
														color="action"
													>
														heroicons-outline:lock-closed
													</FuseSvgIcon>
												</Box>
											)
										}}
									/>
								)}
							/>

							<Controller
								name="confirmpasword"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-24"
										label="Confirm Password"
										type="password"
										error={!!errors.confirmpasword}
										helperText={errors?.confirmpasword?.message}
										variant="outlined"
										required
										fullWidth
										InputProps={{
											startAdornment: (
												<Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
													<FuseSvgIcon
														size={20}
														color="action"
													>
														heroicons-outline:lock-closed
													</FuseSvgIcon>
												</Box>
											)
										}}
									/>
								)}
							/>

							<Button
								variant="contained"
								className="mt-4 w-full"
								aria-label="Reset password"
								disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
								type="submit"
								size="large"
								sx={{
									background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
									color: 'white',
									fontWeight: 'bold',
									'&:hover': {
										background: 'linear-gradient(135deg, #F77F00 0%, #FF6B35 100%)'
									},
									'&.Mui-disabled': {
										background: alpha('#FF6B35', 0.3),
										color: 'rgba(255, 255, 255, 0.6)'
									}
								}}
							>
								{isLoading ? 'Resetting Password...' : 'Reset Password'}
							</Button>

							<Box className="mt-32 flex items-center justify-center gap-8">
								<FuseSvgIcon
									size={16}
									sx={{ color: '#FF6B35' }}
								>
									heroicons-solid:arrow-left
								</FuseSvgIcon>
								<Typography
									className="text-md font-medium"
									color="text.secondary"
								>
									<span>Return to</span>
									<Link
										className="ml-4 font-bold"
										to="/sign-in"
										style={{ color: '#FF6B35' }}
									>
										Sign in
									</Link>
								</Typography>
							</Box>
						</motion.form>

						{/* Password Tips */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="mt-32"
						>
							<Typography
								className="text-13 font-bold mb-12"
								color="text.secondary"
							>
								Password Tips:
							</Typography>
							<Box className="space-y-8">
								{[
									'Use a mix of uppercase and lowercase letters',
									'Include numbers and special characters',
									"Don't reuse passwords from other accounts"
								].map((tip, index) => (
									<Box
										key={index}
										className="flex items-start gap-8"
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: '#10B981', mt: 0.25 }}
										>
											heroicons-solid:check-circle
										</FuseSvgIcon>
										<Typography
											className="text-12"
											color="text.secondary"
										>
											{tip}
										</Typography>
									</Box>
								))}
							</Box>
						</motion.div>
					</div>
				</div>

				{/* Right Side - Gradient Hero */}
				<Box
					className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
					sx={{
						background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 50%, #FCBF49 100%)'
					}}
				>
					{/* Decorative Background */}
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.1,
							background:
								'radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 80%, white 0%, transparent 50%)'
						}}
					/>

					{/* Content */}
					<div className="relative z-10 w-full max-w-2xl">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
						>
							{/* Main Heading */}
							<Typography
								className="text-56 font-black leading-tight mb-16"
								sx={{ color: 'white' }}
							>
								Almost There!
							</Typography>

							{/* Subtitle */}
							<Typography
								className="text-18 leading-relaxed mb-40"
								sx={{ color: 'rgba(255, 255, 255, 0.95)' }}
							>
								You're one step away from regaining full access to your merchant account. Create a
								strong password to secure your business data.
							</Typography>

							{/* Security Features Grid */}
							<Box className="space-y-16 mb-40">
								{[
									{
										icon: 'heroicons-outline:shield-check',
										title: 'Enterprise-Grade Security',
										description:
											'Your password is encrypted with industry-standard AES-256 encryption'
									},
									{
										icon: 'heroicons-outline:finger-print',
										title: 'Unique Authentication',
										description:
											'Each password reset link is single-use and time-limited for your safety'
									},
									{
										icon: 'heroicons-outline:lock-closed',
										title: 'Account Protection',
										description:
											'We never share your credentials and monitor for suspicious activity'
									}
								].map((feature, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.3 + index * 0.1 }}
									>
										<Box
											className="flex items-start gap-16 p-20 rounded-xl"
											sx={{
												backgroundColor: 'rgba(255, 255, 255, 0.15)',
												backdropFilter: 'blur(10px)'
											}}
										>
											<Box
												sx={{
													width: 48,
													height: 48,
													borderRadius: '12px',
													backgroundColor: 'white',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													flexShrink: 0
												}}
											>
												<FuseSvgIcon
													size={24}
													sx={{ color: '#FF6B35' }}
												>
													{feature.icon}
												</FuseSvgIcon>
											</Box>
											<div className="flex-1">
												<Typography
													className="text-16 font-bold mb-8"
													sx={{ color: 'white' }}
												>
													{feature.title}
												</Typography>
												<Typography
													className="text-14 leading-relaxed"
													sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
												>
													{feature.description}
												</Typography>
											</div>
										</Box>
									</motion.div>
								))}
							</Box>

							{/* What Happens Next */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
							>
								<Box
									className="p-24 rounded-xl"
									sx={{
										backgroundColor: 'rgba(255, 255, 255, 0.15)',
										backdropFilter: 'blur(10px)',
										borderLeft: '4px solid white'
									}}
								>
									<Typography
										className="text-15 font-bold mb-12"
										sx={{ color: 'white' }}
									>
										What Happens After Reset?
									</Typography>
									<Box className="space-y-8">
										{[
											"You'll be redirected to the sign-in page",
											'Use your new password to access your account',
											'All active sessions will be logged out for security',
											'You can change your password anytime in settings'
										].map((item, index) => (
											<Box
												key={index}
												className="flex items-start gap-8"
											>
												<Box
													sx={{
														width: 20,
														height: 20,
														borderRadius: '50%',
														backgroundColor: 'white',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														flexShrink: 0,
														mt: 0.25
													}}
												>
													<Typography
														className="text-11 font-black"
														sx={{ color: '#FF6B35' }}
													>
														{index + 1}
													</Typography>
												</Box>
												<Typography
													className="text-14 leading-relaxed"
													sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
												>
													{item}
												</Typography>
											</Box>
										))}
									</Box>
								</Box>
							</motion.div>

							{/* Social Proof */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7 }}
								className="flex items-center gap-16 mt-32"
							>
								<AvatarGroup
									max={4}
									sx={{
										'& .MuiAvatar-root': {
											width: 40,
											height: 40,
											borderWidth: 2,
											borderColor: 'white',
											fontSize: '0.875rem'
										}
									}}
								>
									<Avatar src="assets/images/avatars/female-18.jpg" />
									<Avatar src="assets/images/avatars/female-11.jpg" />
									<Avatar src="assets/images/avatars/male-09.jpg" />
									<Avatar src="assets/images/avatars/male-16.jpg" />
								</AvatarGroup>

								<div>
									<Typography
										className="text-15 font-bold mb-4"
										sx={{ color: 'white' }}
									>
										Trusted by 1,000+ Merchants
									</Typography>
									<Typography
										className="text-13"
										sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
									>
										Your security is our top priority
									</Typography>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</Box>
			</Paper>
		</div>
	);
}

export default ModernReversedResetPasswordPage;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import _ from "@lodash";
import Paper from "@mui/material/Paper";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { get_SHOP_FORGOTPASS_TOKEN } from "app/configs/utils/authUtils";
import { useResetShopPass } from "app/configs/data/server-calls/merchant-auth";

const schema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum."),
    confirmpasword: z.string().nonempty("Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmpasword, {
    message: "Passwords must match",
    path: ["confirmpasword"],
  });
const defaultValues = {
  confirmpasword: "",
  newPassword: "",
  activationCode: "",
  activationToken: "",
};

function ModernReversedResetPasswordPage() {
  const { mutate: shopResetPass, isLoading } = useResetShopPass();
  const { control, formState, handleSubmit, reset, getValues, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: zodResolver(schema),
    });
  const { isValid, dirtyFields, errors } = formState;

  function onSubmit() {
    const activationTokenToCheck = get_SHOP_FORGOTPASS_TOKEN();

    setValue("activationToken", activationTokenToCheck);

    shopResetPass(getValues());
  }

  return (
    <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-32">
      <Paper className="flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:shadow md:w-full md:max-w-6xl">
        <Box
          className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
          sx={{ backgroundColor: "primary.main" }}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Box
              component="g"
              sx={{ color: "primary.light" }}
              className="opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </Box>
          </svg>
          <Box
            component="svg"
            className="absolute -right-64 -top-64 opacity-20"
            sx={{ color: "primary.light" }}
            viewBox="0 0 220 192"
            width="220px"
            height="192px"
            fill="none"
          >
            <defs>
              <pattern
                id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect
              width="220"
              height="192"
              fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
            />
          </Box>

          <div className="relative z-10 w-full max-w-2xl">
            <div className="text-7xl font-bold leading-none text-gray-100">
              <div>Welcome to</div>
              <div>our community</div>
            </div>
            <div className="mt-24 text-lg leading-6 tracking-tight text-gray-400">
              Fuse helps developers to build organized and well coded dashboards
              full of beautiful and rich modules. Join us and start building
              your application today.
            </div>
            <div className="mt-32 flex items-center">
              <AvatarGroup
                sx={{
                  "& .MuiAvatar-root": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <Avatar src="assets/images/avatars/female-18.jpg" />
                <Avatar src="assets/images/avatars/female-11.jpg" />
                <Avatar src="assets/images/avatars/male-09.jpg" />
                <Avatar src="assets/images/avatars/male-16.jpg" />
              </AvatarGroup>

              <div className="ml-16 font-medium tracking-tight text-gray-400">
                More than 17k people joined us, it's your turn
              </div>
            </div>
          </div>
        </Box>

        <div className="w-full px-16 py-32 ltr:border-l-1 rtl:border-r-1 sm:w-auto sm:p-48 md:p-64">
          <div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
            <img
              className="w-40"
              src="assets/images/afslogo/afslogo.png"
              alt="logo"
            />

            <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
              Reset your password
            </Typography>
            <Typography className="font-medium">
              Enter the otp-code sent to your email, then provide your new
              password to complete this process.
            </Typography>

            <form
              name="registerForm"
              noValidate
              className="mt-32 flex w-full flex-col justify-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="activationCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="activationCode"
                    type="text"
                    error={!!errors.activationCode}
                    helperText={errors?.activationCode?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="New Password"
                    type="password"
                    error={!!errors.newPassword}
                    helperText={errors?.newPassword?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="confirmpasword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Password (Confirm)"
                    type="password"
                    error={!!errors.confirmpasword}
                    helperText={errors?.confirmpasword?.message}
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
                disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
                type="submit"
                size="large"
              >
                Reset your password
              </Button>

              <Typography
                className="mt-32 text-md font-medium"
                color="text.secondary"
              >
                <span>Return to</span>
                <Link className="ml-4" to="/sign-in">
                  sign in
                </Link>
              </Typography>
            </form>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default ModernReversedResetPasswordPage;
*/
