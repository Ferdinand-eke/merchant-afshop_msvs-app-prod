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

/**
 * The help center home.
 */
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
							Millions Of Shoppers Can’t Wait To See What You Have In Store 
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
						{/* <motion.div
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<OutlinedInput
								className="flex flex-1 items-center px-16 mx-8 rounded-full h-44 w-full max-w-320 sm:max-w-480 mt-40 sm:mt-80"
								placeholder="Enter a question, topic or keyword"
								fullWidth
								startAdornment={
									<InputAdornment position="start">
										<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
									</InputAdornment>
								}
								inputProps={{
									'aria-label': 'Search'
								}}
							/>
						</motion.div> */}
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
						// component={Link}
						// to="faqs"
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">Low fees</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								It doesn’t take much to list your items and once you make a sale,
								 AfricanShop’s transaction fee is just 5% on items listed.
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
								color="secondary"
								className="mx-8"
							>
								Multiple Kinds of accounts
							</Typography>
							{/* <FuseSvgIcon
								size={20}
								color="secondary"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon> */}
						</Box>
					</Card>

					<Card
						// component={Link}
						// to="guides"
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
								color="secondary"
								className="mx-8"
							>
								Over 1000 verified merchants
							</Typography>
							{/* <FuseSvgIcon
								size={20}
								color="secondary"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon> */}
						</Box>
					</Card>

					<Card
						// component={Link}
						// to="support"
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
								color="secondary"
								className="mx-8"
							>
								Over 10,000 products
							</Typography>
							{/* <FuseSvgIcon
								size={20}
								color="secondary"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon> */}
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
