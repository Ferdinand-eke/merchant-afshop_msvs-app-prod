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
import { useShopForgotPass } from 'app/configs/data/server-calls/merchant-auth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	shopemail: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

const defaultValues = {
	shopemail: ''
};

/**
 * AfricanShops Forgot Password Page - Redesigned for Production
 * Engaging, secure, and professional password reset experience
 */
function ModernReversedForgotPasswordPage() {
	const { mutate: shopForgotPass, isLoading } = useShopForgotPass();

	const { control, formState, handleSubmit, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		shopForgotPass(getValues());
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
								Forgot Password?
							</Typography>
							<Typography
								className="mt-8"
								color="text.secondary"
							>
								No worries! Enter your email address and we'll send you a reset link.
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
											heroicons-solid:key
										</FuseSvgIcon>
									</Box>
									<div>
										<Typography
											className="text-14 font-bold mb-4"
											sx={{ color: '#FF6B35' }}
										>
											Secure Password Reset
										</Typography>
										<Typography
											className="text-13 leading-relaxed"
											color="text.secondary"
										>
											We'll send a secure link to your registered email address. The link expires
											in 1 hour for your security.
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
								name="shopemail"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-24"
										label="Shop Email"
										type="email"
										error={!!errors.shopemail}
										helperText={errors?.shopemail?.message}
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
														heroicons-outline:mail
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
								aria-label="Send reset link"
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
								{isLoading ? 'Sending...' : 'Send Reset Link'}
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
									<span>Remember your password?</span>
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

						{/* Trust Indicators */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="mt-32"
						>
							<Box className="flex items-center justify-center gap-24 flex-wrap">
								<Box className="flex items-center gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#10B981' }}
									>
										heroicons-solid:lock-closed
									</FuseSvgIcon>
									<Typography
										className="text-12 font-medium"
										sx={{ color: '#10B981' }}
									>
										Secure Link
									</Typography>
								</Box>
								<Box className="flex items-center gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#10B981' }}
									>
										heroicons-solid:clock
									</FuseSvgIcon>
									<Typography
										className="text-12 font-medium"
										sx={{ color: '#10B981' }}
									>
										1 Hour Validity
									</Typography>
								</Box>
								<Box className="flex items-center gap-8">
									<FuseSvgIcon
										size={16}
										sx={{ color: '#10B981' }}
									>
										heroicons-solid:shield-check
									</FuseSvgIcon>
									<Typography
										className="text-12 font-medium"
										sx={{ color: '#10B981' }}
									>
										Email Verified
									</Typography>
								</Box>
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
								Account Recovery
							</Typography>

							{/* Subtitle */}
							<Typography
								className="text-18 leading-relaxed mb-40"
								sx={{ color: 'rgba(255, 255, 255, 0.95)' }}
							>
								We've got you covered! Password recovery is quick and secure. Get back to managing your
								business in no time.
							</Typography>

							{/* Steps Grid */}
							<Box className="space-y-16 mb-40">
								{[
									{
										icon: 'heroicons-outline:mail',
										title: 'Enter Your Email',
										description: 'Provide your registered shop email address'
									},
									{
										icon: 'heroicons-outline:link',
										title: 'Check Your Inbox',
										description: 'Click the secure reset link we send you'
									},
									{
										icon: 'heroicons-outline:lock-closed',
										title: 'Create New Password',
										description: 'Set a strong password and regain access'
									}
								].map((step, index) => (
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
												<Typography
													className="text-20 font-black"
													sx={{ color: '#FF6B35' }}
												>
													{index + 1}
												</Typography>
											</Box>
											<div className="flex-1">
												<Box className="flex items-center gap-8 mb-8">
													<FuseSvgIcon
														size={20}
														sx={{ color: 'white' }}
													>
														{step.icon}
													</FuseSvgIcon>
													<Typography
														className="text-16 font-bold"
														sx={{ color: 'white' }}
													>
														{step.title}
													</Typography>
												</Box>
												<Typography
													className="text-14 leading-relaxed"
													sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
												>
													{step.description}
												</Typography>
											</div>
										</Box>
									</motion.div>
								))}
							</Box>

							{/* Support Info */}
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
									<Box className="flex items-start gap-12">
										<FuseSvgIcon
											size={24}
											sx={{ color: 'white' }}
										>
											heroicons-outline:information-circle
										</FuseSvgIcon>
										<div>
											<Typography
												className="text-15 font-bold mb-8"
												sx={{ color: 'white' }}
											>
												Need Additional Help?
											</Typography>
											<Typography
												className="text-14 leading-relaxed mb-12"
												sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
											>
												If you don't receive the reset email within 5 minutes, check your spam
												folder or contact our support team.
											</Typography>
											<Box className="flex items-center gap-8">
												<FuseSvgIcon
													size={16}
													sx={{ color: 'white' }}
												>
													heroicons-solid:mail
												</FuseSvgIcon>
												<Typography
													className="text-13 font-medium"
													sx={{ color: 'white' }}
												>
													support@africanshops.com
												</Typography>
											</Box>
										</div>
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
										Your Account is Safe
									</Typography>
									<Typography
										className="text-13"
										sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
									>
										Join 1,000+ merchants trusting AfricanShops
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

export default ModernReversedForgotPasswordPage;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
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
import { useShopForgotPass } from 'app/configs/data/server-calls/merchant-auth';

const schema = z.object({
	shopemail: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});
const defaultValues = {
	shopemail: ''
};

function ModernReversedForgotPasswordPage() {

	const {mutate:shopForgotPass, isLoading} = useShopForgotPass()

	const { control, formState, handleSubmit, reset, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {

		shopForgotPass(getValues())
	}


	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-32">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:shadow md:w-full md:max-w-6xl">
				<Box
					className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
					sx={{ backgroundColor: 'primary.main' }}
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
							sx={{ color: 'primary.light' }}
							className="opacity-20"
							fill="none"
							stroke="currentColor"
							strokeWidth="100"
						>
							<circle
								r="234"
								cx="196"
								cy="23"
							/>
							<circle
								r="234"
								cx="790"
								cy="491"
							/>
						</Box>
					</svg>
					<Box
						component="svg"
						className="absolute -right-64 -top-64 opacity-20"
						sx={{ color: 'primary.light' }}
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
								<rect
									x="0"
									y="0"
									width="4"
									height="4"
									fill="currentColor"
								/>
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
							Fuse helps developers to build organized and well coded dashboards full of beautiful and
							rich modules. Join us and start building your application today.
						</div>
						<div className="mt-32 flex items-center">
							<AvatarGroup
								sx={{
									'& .MuiAvatar-root': {
										borderColor: 'primary.main'
									}
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
							Forgot password?
						</Typography>
						<div className="mt-2 flex items-baseline font-medium">
							<Typography>Fill the form to reset your password</Typography>
						</div>

						<form
							name="registerForm"
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
										label="Shop Email"
										type="email"
										error={!!errors.shopemail}
										helperText={errors?.shopemail?.message}
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
								disabled={_.isEmpty(dirtyFields) || !isValid || shopForgotPass.isLoading}
								type="submit"
								size="large"
							>
								Send reset link
							</Button>

							<Typography
								className="mt-32 text-md font-medium"
								color="text.secondary"
							>
								<span>Return to</span>
								<Link
									className="ml-4"
									to="/sign-in"
								>
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

export default ModernReversedForgotPasswordPage;
*/
