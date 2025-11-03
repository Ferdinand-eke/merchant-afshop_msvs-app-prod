import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import CardContent from '@mui/material/CardContent';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import JwtLoginTab from './tabs/JwtSignInTab';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * AfricanShops Merchant Sign In Page - Redesigned for Production
 * Compelling, engaging, and professional login experience
 */
function SignInPage() {
	const [selectedTabId] = useState('jwt');

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			{/* Left Side - Login Form */}
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-384 sm:mx-0 sm:w-384">
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
							Welcome Back
						</Typography>
						<div className="mt-8 flex items-baseline gap-8">
							<Typography color="text.secondary">Don't have an account?</Typography>
							<Link
								className="font-medium"
								to="/home"
								style={{ color: '#FF6B35' }}
							>
								Sign up
							</Link>
						</div>
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
								background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 127, 0, 0.05) 100%)',
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
									<FuseSvgIcon size={18} sx={{ color: 'white' }}>
										heroicons-solid:shield-check
									</FuseSvgIcon>
								</Box>
								<div>
									<Typography className="text-14 font-bold mb-4" sx={{ color: '#FF6B35' }}>
										Merchant Portal Access
									</Typography>
									<Typography className="text-13 leading-relaxed" color="text.secondary">
										You're accessing the <span className="font-bold">AfricanShops Merchants Portal</span>.
										By signing in, you agree to our Terms of Service and Privacy Policy.
									</Typography>
								</div>
							</Box>
						</Box>
					</motion.div>

					{/* Login Form with Animation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						{selectedTabId === 'jwt' && <JwtLoginTab />}
					</motion.div>

					{/* Trust Indicators */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-32"
					>
						<Box className="flex items-center justify-center gap-24 flex-wrap">
							<Box className="flex items-center gap-8">
								<FuseSvgIcon size={16} sx={{ color: '#10B981' }}>
									heroicons-solid:lock-closed
								</FuseSvgIcon>
								<Typography className="text-12 font-medium" sx={{ color: '#10B981' }}>
									Secure Login
								</Typography>
							</Box>
							<Box className="flex items-center gap-8">
								<FuseSvgIcon size={16} sx={{ color: '#10B981' }}>
									heroicons-solid:shield-check
								</FuseSvgIcon>
								<Typography className="text-12 font-medium" sx={{ color: '#10B981' }}>
									Data Encrypted
								</Typography>
							</Box>
							<Box className="flex items-center gap-8">
								<FuseSvgIcon size={16} sx={{ color: '#10B981' }}>
									heroicons-solid:check-circle
								</FuseSvgIcon>
								<Typography className="text-12 font-medium" sx={{ color: '#10B981' }}>
									GDPR Compliant
								</Typography>
							</Box>
						</Box>
					</motion.div>
				</CardContent>
			</Paper>

			{/* Right Side - Gradient Hero with Info */}
			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
				sx={{
					background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 50%, #FCBF49 100%)',
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
						background: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 80%, white 0%, transparent 50%)'
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
						<Typography className="text-56 font-black leading-tight mb-16" sx={{ color: 'white' }}>
							Welcome to
							<br />
							AfricanShops
						</Typography>

						{/* Subtitle */}
						<Typography className="text-18 leading-relaxed mb-32" sx={{ color: 'rgba(255, 255, 255, 0.95)' }}>
							Manage your business with powerful tools designed for African merchants.
							Scale your operations, track sales, and grow your customer base with our
							comprehensive merchant dashboard.
						</Typography>

						{/* Feature Highlights */}
						<Box className="grid grid-cols-2 gap-16 mb-40">
							{[
								{ icon: 'heroicons-outline:chart-bar', label: 'Real-time Analytics' },
								{ icon: 'heroicons-outline:shopping-bag', label: 'Product Management' },
								{ icon: 'heroicons-outline:truck', label: 'Order Tracking' },
								{ icon: 'heroicons-outline:credit-card', label: 'Secure Payments' }
							].map((feature, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 + index * 0.1 }}
								>
									<Box className="flex items-center gap-12">
										<Box
											sx={{
												width: 40,
												height: 40,
												borderRadius: '10px',
												backgroundColor: 'rgba(255, 255, 255, 0.2)',
												backdropFilter: 'blur(10px)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<FuseSvgIcon size={20} sx={{ color: 'white' }}>
												{feature.icon}
											</FuseSvgIcon>
										</Box>
										<Typography className="text-15 font-bold" sx={{ color: 'white' }}>
											{feature.label}
										</Typography>
									</Box>
								</motion.div>
							))}
						</Box>

						{/* Stats Section */}
						<Box
							className="p-24 rounded-xl mb-32"
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(10px)'
							}}
						>
							<Typography className="text-14 font-bold mb-16" sx={{ color: 'white' }}>
								Trusted by Merchants Across Africa
							</Typography>
							<Box className="grid grid-cols-3 gap-16">
								{[
									{ value: '1,000+', label: 'Merchants' },
									{ value: '10K+', label: 'Products' },
									{ value: '50K+', label: 'Orders' }
								].map((stat, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.5 + index * 0.1 }}
									>
										<Typography className="text-28 font-black mb-4" sx={{ color: 'white' }}>
											{stat.value}
										</Typography>
										<Typography className="text-12 font-medium" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
											{stat.label}
										</Typography>
									</motion.div>
								))}
							</Box>
						</Box>

						{/* Social Proof */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="flex items-center gap-16"
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
								<Typography className="text-15 font-bold mb-4" sx={{ color: 'white' }}>
									Join 1,000+ Merchants
								</Typography>
								<Typography className="text-13" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
									Growing their business with AfricanShops
								</Typography>
							</div>
						</motion.div>

						{/* Testimonial */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
						>
							<Box
								className="mt-32 p-20 rounded-xl"
								sx={{
									backgroundColor: 'rgba(255, 255, 255, 0.15)',
									backdropFilter: 'blur(10px)',
									borderLeft: '4px solid white'
								}}
							>
								<Typography className="text-14 italic leading-relaxed mb-12" sx={{ color: 'white' }}>
									"AfricanShops has transformed how I manage my business. The dashboard is intuitive,
									and I can track everything in real-time!"
								</Typography>
								<Box className="flex items-center gap-12">
									<Avatar
										src="assets/images/avatars/female-18.jpg"
										sx={{ width: 32, height: 32 }}
									/>
									<div>
										<Typography className="text-13 font-bold" sx={{ color: 'white' }}>
											Amara O.
										</Typography>
										<Typography className="text-11" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
											Fashion Merchant, Lagos
										</Typography>
									</div>
								</Box>
							</Box>
						</motion.div>
					</motion.div>
				</div>
			</Box>
		</div>
	);
}

export default SignInPage;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CardContent from '@mui/material/CardContent';
import _ from '@lodash';
import Alert from '@mui/material/Alert';
import JwtLoginTab from './tabs/JwtSignInTab';

const tabs = [
	{
		id: 'jwt',
		title: 'JWT',
		logo: 'assets/images/logo/jwt.svg',
		logoClass: 'h-40 p-4 bg-black rounded-12'
	},
	{
		id: 'firebase',
		title: 'Firebase',
		logo: 'assets/images/logo/firebase.svg',
		logoClass: 'h-40'
	},
	{
		id: 'aws',
		title: 'AWS',
		logo: 'assets/images/logo/aws-amplify.svg',
		logoClass: 'h-40'
	}
];

function SignInPage() {
	const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);

	function handleSelectTab(id) {
		setSelectedTabId(id);
	}

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-40"
						src="assets/images/afslogo/afslogo.png"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>
					<div className="mt-2 flex items-baseline font-medium">
						<Typography>Don't have an account? </Typography>
						<Link
							className="ml-4"
							to="/home"
						>
							Sign up
						</Link>
					</div>

					<Alert
						icon={false}
						severity="info"
						className="mt-24 px-16 text-13 leading-relaxed"
					>
						You are on <b>Africanshops merchants portal</b>. Click on the "Sign in" you attest to comply with our
						terms of compliance.
					</Alert>

					{selectedTabId === 'jwt' && <JwtLoginTab />}
				</CardContent>
			</Paper>
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
						Our merchant portal avails you the power to drive your business in a highly productive and scallable manner, driven by our well built out dashboards full of beautiful and rich
						interface to keep you active and eefctive while at work. Join us and start building your business with us today!.
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
							More than 1k merchants joined us, it's your turn
						</div>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SignInPage;
*/
