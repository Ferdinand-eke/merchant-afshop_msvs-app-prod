import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ModernPricingPage from '../modern/ModernPricingPage';

/**
 * AfricanShops Merchant Landing Page - Redesigned for Production
 * Modern, professional, and engaging merchant onboarding experience
 */
function LandingCenterHome() {
	// Merchant onboarding steps data
	const stepsToOnboard = [
		{
			id: 1,
			title: 'Register & Setup Your Shop',
			icon: 'heroicons-outline:user-circle',
			features: [
				'Register your business for free in minutes',
				'Create a comprehensive product catalogue',
				'Get free training on running your online business',
				'Dedicated AfricanShop Advisors to guide you at every step'
			]
		},
		{
			id: 2,
			title: 'Receive Orders & Sell',
			icon: 'heroicons-outline:shopping-cart',
			features: [
				'Receive orders from millions of ready-to-buy customers',
				'Package products with our guided process',
				'Drop off at convenient order collection points',
				'Real-time order tracking and management'
			]
		},
		{
			id: 3,
			title: 'We Handle Delivery',
			icon: 'heroicons-outline:truck',
			features: [
				'Professional packaging and shipping services',
				'Nationwide delivery network coverage',
				'Track every shipment on your dashboard',
				'Automated customer delivery notifications'
			]
		},
		{
			id: 4,
			title: 'Get Paid Instantly',
			icon: 'heroicons-outline:credit-card',
			features: [
				'Secure payment processing for all orders',
				'Monitor earnings in real-time on your dashboard',
				'Instant transfer to your shop wallet',
				'Withdraw to your bank account within 1-2 business days'
			]
		}
	];

	// Value proposition cards
	const valueProps = [
		{
			icon: 'heroicons-outline:currency-dollar',
			title: 'Ultra-Low Fees',
			description:
				'Start listing for free. Pay only 5% transaction fee when you make a sale. No hidden charges, no surprises.',
			stat: '5% Fee',
			gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)'
		},
		{
			icon: 'heroicons-outline:chart-bar',
			title: 'Powerful Analytics',
			description:
				'Advanced tools and insights to manage, promote, and scale your business. Data-driven decisions made easy.',
			stat: '1000+ Merchants',
			gradient: 'linear-gradient(135deg, #F77F00 0%, #FCBF49 100%)'
		},
		{
			icon: 'heroicons-outline:support',
			title: '24/7 Support',
			description:
				'Round-the-clock sales assistance and support team. Maximum visibility for your products and services.',
			stat: '10K+ Products',
			gradient: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)'
		}
	];

	return (
		<div className="flex flex-col flex-auto min-w-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			{/* Hero Section with Gradient Background */}
			<Box
				className="relative pt-64 pb-112 px-16 sm:pt-80 sm:pb-128 sm:px-64 overflow-hidden"
				sx={{
					background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 50%, #FCBF49 100%)',
					position: 'relative'
				}}
			>
				{/* Animated Background Elements */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						background:
							'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)'
					}}
				/>

				<div className="relative flex flex-col items-center justify-center mx-auto w-full max-w-7xl z-10">
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
					>
						<Chip
							label="TRUSTED BY 1000+ MERCHANTS"
							size="medium"
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								color: 'white',
								fontWeight: 700,
								fontSize: '0.75rem',
								letterSpacing: '0.5px',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(255, 255, 255, 0.3)'
							}}
						/>
					</motion.div>

					{/* Main Headline */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						className="mt-24"
					>
						<Typography
							className="text-40 sm:text-56 md:text-64 font-black tracking-tight leading-tight text-center"
							sx={{ color: 'white' }}
						>
							Millions Of Shoppers
							<br />
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-50">
								Can't Wait To See What You Have
							</span>
						</Typography>
					</motion.div>

					{/* Subheadline */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
						className="mt-24"
					>
						<Typography
							className="text-18 sm:text-22 font-medium tracking-normal max-w-3xl text-center leading-relaxed"
							sx={{ color: 'rgba(255, 255, 255, 0.95)' }}
						>
							Join Africa's fastest-growing marketplace. Whether you're in retail, real estate, logistics,
							or hospitality - we've got the perfect merchant solution for you.
						</Typography>
					</motion.div>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
						className="mt-40 flex flex-col sm:flex-row gap-16 items-center"
					>
						<Button
							variant="contained"
							size="large"
							component={Link}
							to="/shop-dashboard"
							sx={{
								backgroundColor: 'white',
								color: '#FF6B35',
								px: 4,
								py: 1.5,
								fontSize: '1rem',
								fontWeight: 700,
								borderRadius: '12px',
								textTransform: 'none',
								boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.9)',
									transform: 'translateY(-2px)',
									boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
								},
								transition: 'all 0.3s ease'
							}}
							endIcon={<FuseSvgIcon size={20}>heroicons-outline:arrow-right</FuseSvgIcon>}
						>
							Get Started Now
						</Button>
						<Button
							variant="outlined"
							size="large"
							sx={{
								borderColor: 'white',
								color: 'white',
								px: 4,
								py: 1.5,
								fontSize: '1rem',
								fontWeight: 700,
								borderRadius: '12px',
								textTransform: 'none',
								borderWidth: 2,
								'&:hover': {
									borderWidth: 2,
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
									borderColor: 'white'
								}
							}}
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:play</FuseSvgIcon>}
						>
							Watch Demo
						</Button>
					</motion.div>

					{/* Trust Indicators */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.5 } }}
						className="mt-48 flex flex-wrap justify-center gap-32 sm:gap-64"
					>
						{[
							{ value: '1000+', label: 'Active Merchants' },
							{ value: '10K+', label: 'Products Listed' },
							{ value: '50K+', label: 'Orders Delivered' },
							{ value: '24/7', label: 'Support Available' }
						].map((stat, index) => (
							<div
								key={index}
								className="text-center"
							>
								<Typography
									className="text-32 sm:text-40 font-black"
									sx={{ color: 'white' }}
								>
									{stat.value}
								</Typography>
								<Typography
									className="text-14 font-medium mt-4"
									sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
								>
									{stat.label}
								</Typography>
							</div>
						))}
					</motion.div>
				</div>

				{/* Decorative Wave */}
				<Box
					sx={{
						position: 'absolute',
						bottom: -2,
						left: 0,
						right: 0,
						height: '100px'
					}}
				>
					<svg
						viewBox="0 0 1440 100"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-full"
					>
						<path
							d="M0 50L60 45C120 40 240 30 360 28.3C480 26.7 600 33.3 720 38.3C840 43.3 960 46.7 1080 45C1200 43.3 1320 36.7 1380 33.3L1440 30V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
							fill="currentColor"
							className="text-gray-50 dark:text-gray-900"
						/>
					</svg>
				</Box>
			</Box>

			{/* Value Proposition Cards - Floating Above */}
			<div className="flex flex-col items-center px-16 sm:px-40 -mt-64 relative z-20">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-24 w-full max-w-6xl">
					{valueProps.map((prop, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.6 + index * 0.1 } }}
						>
							<Card
								className="relative overflow-hidden transition-all duration-300 hover:scale-105"
								sx={{
									background: 'white',
									borderRadius: '20px',
									boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
									'&:hover': {
										boxShadow: '0 30px 80px rgba(0,0,0,0.15)'
									}
								}}
							>
								{/* Gradient Header */}
								<Box
									sx={{
										background: prop.gradient,
										height: '6px'
									}}
								/>

								<div className="p-32">
									{/* Icon */}
									<Box
										className="flex items-center justify-center mb-20"
										sx={{
											width: 64,
											height: 64,
											borderRadius: '16px',
											background: prop.gradient,
											boxShadow: '0 8px 24px rgba(255, 107, 53, 0.25)'
										}}
									>
										<FuseSvgIcon
											size={32}
											sx={{ color: 'white' }}
										>
											{prop.icon}
										</FuseSvgIcon>
									</Box>

									{/* Title */}
									<Typography className="text-24 font-bold mb-12">{prop.title}</Typography>

									{/* Description */}
									<Typography
										className="text-15 leading-relaxed mb-20"
										color="text.secondary"
									>
										{prop.description}
									</Typography>

									{/* Stat Badge */}
									<Chip
										label={prop.stat}
										size="small"
										sx={{
											background: prop.gradient,
											color: 'white',
											fontWeight: 700,
											fontSize: '0.875rem'
										}}
									/>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</div>

			{/* How It Works Section */}
			<Box
				className="mt-80 px-16 sm:px-40 py-64"
				sx={{ backgroundColor: 'transparent' }}
			>
				<div className="max-w-7xl mx-auto">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-64"
					>
						<Chip
							label="SIMPLE PROCESS"
							size="medium"
							sx={{
								backgroundColor: alpha('#FF6B35', 0.1),
								color: '#FF6B35',
								fontWeight: 700,
								fontSize: '0.75rem',
								letterSpacing: '0.5px',
								mb: 3
							}}
						/>
						<Typography className="text-40 sm:text-52 font-black tracking-tight leading-tight mt-16">
							How It Works
						</Typography>
						<Typography
							className="text-18 sm:text-20 mt-16 max-w-2xl mx-auto"
							color="text.secondary"
						>
							Start selling online in 4 simple steps. We've made it incredibly easy for you.
						</Typography>
					</motion.div>

					{/* Steps Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
						{stepsToOnboard.map((step, index) => (
							<motion.div
								key={step.id}
								initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<Card
									sx={{
										borderRadius: '20px',
										overflow: 'hidden',
										height: '100%',
										background: 'white',
										boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
											transform: 'translateY(-8px)'
										}
									}}
								>
									{/* Step Header with Gradient */}
									<Box
										sx={{
											background: `linear-gradient(135deg, ${['#FF6B35', '#F77F00', '#FCBF49', '#FF8C42'][index]} 0%, ${['#F77F00', '#FCBF49', '#FF8C42', '#FF6B35'][index]} 100%)`,
											padding: '32px',
											position: 'relative'
										}}
									>
										<div className="flex items-center gap-20">
											{/* Step Number */}
											<Box
												sx={{
													width: 56,
													height: 56,
													borderRadius: '14px',
													backgroundColor: 'rgba(255, 255, 255, 0.25)',
													backdropFilter: 'blur(10px)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													border: '2px solid rgba(255, 255, 255, 0.4)'
												}}
											>
												<Typography
													className="text-28 font-black"
													sx={{ color: 'white' }}
												>
													{step.id}
												</Typography>
											</Box>

											{/* Icon */}
											<Box
												sx={{
													width: 56,
													height: 56,
													borderRadius: '14px',
													backgroundColor: 'rgba(255, 255, 255, 0.95)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<FuseSvgIcon
													size={28}
													sx={{ color: '#FF6B35' }}
												>
													{step.icon}
												</FuseSvgIcon>
											</Box>
										</div>

										{/* Title */}
										<Typography
											className="text-26 font-black mt-20"
											sx={{ color: 'white' }}
										>
											{step.title}
										</Typography>
									</Box>

									{/* Features List */}
									<div className="p-32">
										<div className="space-y-16">
											{step.features.map((feature, fIndex) => (
												<div
													key={fIndex}
													className="flex items-start gap-12"
												>
													<Box
														sx={{
															width: 24,
															height: 24,
															borderRadius: '6px',
															background: `linear-gradient(135deg, ${['#FF6B35', '#F77F00', '#FCBF49', '#FF8C42'][index]} 0%, ${['#F77F00', '#FCBF49', '#FF8C42', '#FF6B35'][index]} 100%)`,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															flexShrink: 0,
															marginTop: '2px'
														}}
													>
														<FuseSvgIcon
															size={14}
															sx={{ color: 'white' }}
														>
															heroicons-solid:check
														</FuseSvgIcon>
													</Box>
													<Typography
														className="text-15 leading-relaxed"
														color="text.secondary"
													>
														{feature}
													</Typography>
												</div>
											))}
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</Box>

			{/* Pricing Section */}
			<Box className="mt-48">
				<ModernPricingPage />
			</Box>

			{/* Final CTA Section */}
			<Box
				className="mt-64 mb-64 mx-16 sm:mx-40 rounded-3xl overflow-hidden"
				sx={{
					background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 50%, #FCBF49 100%)',
					position: 'relative'
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						background: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%)'
					}}
				/>

				<div className="relative py-64 px-32 sm:px-64 text-center">
					<Typography
						className="text-36 sm:text-48 font-black mb-20"
						sx={{ color: 'white' }}
					>
						Ready to Start Selling?
					</Typography>
					<Typography
						className="text-18 sm:text-20 mb-40 max-w-2xl mx-auto"
						sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
					>
						Join thousands of successful merchants already growing their business with AfricanShops
					</Typography>
					<Button
						variant="contained"
						size="large"
						component={Link}
						to="/shop-dashboard"
						sx={{
							backgroundColor: 'white',
							color: '#FF6B35',
							px: 5,
							py: 2,
							fontSize: '1.125rem',
							fontWeight: 700,
							borderRadius: '12px',
							textTransform: 'none',
							boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								transform: 'translateY(-2px)',
								boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
							},
							transition: 'all 0.3s ease'
						}}
						endIcon={<FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>}
					>
						Create Your Shop Now
					</Button>
				</div>
			</Box>
		</div>
	);
}

export default LandingCenterHome;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import { lighten, ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store/hooks';
import FaqList from '../faqs/FaqList';
import { useGetHelpCenterMostlyFaqsQuery } from '../HelpCenterApi';
import ModernPricingPage from '../modern/ModernPricingPage';

function LandingCenterHome() {

	const mainThemeDark = useAppSelector(selectMainThemeDark);
	const { data: faqsMost } = useGetHelpCenterMostlyFaqsQuery();

	const stepsToUnboard = [
		{
			id:1,
			hint:'Register, setup a shop and list your products',
			description:`* Register your business for free and create a product catalogue.
			 Get free training on how to run your online business.
			 * Our AfricanShop Advisors will help you at every step and fully assist you in taking your business online`
		},
		{
			id:2,
			hint:`Receive orders and sell your product`,
			description:`* Receive orders from intending buyers,
			 package products ordered and make available at our order collation units within your market,
			 then sit back and monitor the process as we handle delivery from here.`
		},
		{
			id:3,
			hint:`Package and ship with ease`,
			description:`* Sit back and monitor the process on your seller dashboard as we handle delivery from packaging,
			 shipping and delivery.`
		},
		{
			id:4,
			hint:`Receive Payments and Withdraw.`,
			description:`* Receive Payments and on your shop dashboard and then cash out on delivered orders into your shop wallet.
			* Withdraw from your Shop wallet and receive payment into your local bank account within 1-2 working day(s)`
		},
	]
	return (
		<div className="flex flex-col flex-auto min-w-0">
			<ThemeProvider theme={mainThemeDark}>
				<Box
					className="relative pt-32 pb-112 px-16 sm:pt-80 sm:pb-192 sm:px-64 overflow-hidden"
					sx={{
						backgroundColor: 'primary.dark',
						color: (theme) => theme.palette.getContrastText(theme.palette.primary.main)
					}}
				>
					<div className="flex flex-col items-center justify-center  mx-auto w-full">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography
								color="inherit"
								className="text-18 font-semibold"
							>
								WHY BECOMEN AN AFRICANSHOPS MERCHANT
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography className="mt-4 text-32 sm:text-48 font-extrabold tracking-tight leading-tight text-center">
							Millions Of Shoppers Can't Wait To See What You Have In Store
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								color="text.secondary"
								className="text-16 sm:text-20 mt-16 sm:mt-24 opacity-75 tracking-tight max-w-md text-center"
							>
								Our merchant account packages got you covered for businesses in real estate, sales, logistics and
     					 will step you through the process of unboarding and managing your business.
							</Typography>
						</motion.div>

					</div>


					<svg
						className="absolute inset-0 pointer-events-none"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g
							className="text-gray-700 opacity-25"
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
						</g>
					</svg>
				</Box>
			</ThemeProvider>

			<div className="flex flex-col items-center px-24 sm:px-40">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-32 md:gap-y-0 md:gap-x-24 w-full max-w-sm md:max-w-4xl -mt-64 sm:-mt-96">
					<Card
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">Low fees</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								It doesn't take much to list your items and once you make a sale,
								 AfricanShop's transaction fee is just 5% on items listed.
							</div>
						</div>
						<Box
							className="flex items-center justify-center py-16 px-32"
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
						>
							<Typography
								color="orange"
								className="mx-8"
							>
								Multiple Kinds of accounts
							</Typography>
							<FuseSvgIcon
								size={20}
								color="orange"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon>
						</Box>
					</Card>

					<Card
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">Powerful Tools</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								Our tools and services make it easy to manage,
								promote and grow your business.
							</div>
						</div>
						<Box
							className="flex items-center justify-center py-16 px-32"
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
						>
							<Typography
								color="orange"
								className="mx-8"
							>
								Over 1000 verified merchants
							</Typography>
							<FuseSvgIcon
								size={20}
								color="orange"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon>
						</Box>
					</Card>

					<Card
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">Support 24/7</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								Wide visibility for merchant products and services.Our 24/7 sales assistants are available
								 to ensure you have a seamless experience while managing your business.
							</div>
						</div>
						<Box
							className="flex items-center justify-center py-16 px-32"
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
						>
							<Typography
								color="orange"
								className="mx-8"
							>
								Over 10,000 products
							</Typography>
							<FuseSvgIcon
								size={20}
								color="orange"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon>
						</Box>
					</Card>
				</div>
			</div>

			<Typography className="mt-96 px-16 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-center">
			HOW IT WORKS
			</Typography>
			<Typography
				className="mt-8 px-16 text-xl text-center"
				color="text.secondary"
			>
				Easy to start selling online on AfricanShops, just 4 simple steps
			</Typography>

			<div className="flex flex-col w-full px-16 items-center my-48">
				<FaqList
					className="w-full max-w-4xl"
					list={stepsToUnboard}
				/>
			</div>

			<ModernPricingPage />
		</div>
	);
}

export default LandingCenterHome;
*/
