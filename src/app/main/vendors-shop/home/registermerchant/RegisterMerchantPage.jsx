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
// import { useGetHelpCenterMostlyFaqsQuery } from '../HelpCenterApi';
import ModernPricingPage from '../modern/ModernPricingPage';
import MerchantModernReversedSignUpPage from './MerchantModernReversedSignUpPage';

/**
 * The help center home.
 */

function RegisterMerchantPage() {
	const mainThemeDark = useAppSelector(selectMainThemeDark);
	// const { data: faqsMost } = useGetHelpCenterMostlyFaqsQuery();

	// const stepsToUnboard = [
	// 	{
	// 		id:1,
	// 		hint:'Register, setup a shop and list your products',
	// 		description:`* Register your business for free and create a product catalogue.
	// 		 Get free training on how to run your online business.
	// 		 * Our AfricanShop Advisors will help you at every step and fully assist you in taking your business online`
	// 	},
	// 	{
	// 		id:2,
	// 		hint:`Receive orders and sell your product`,
	// 		description:`* Receive orders from intending buyers,
	// 		 package products ordered and make available at our order collation units within your market,
	// 		 then sit back and monitor the process as we handle delivery from here.`
	// 	},
	// 	{
	// 		id:3,
	// 		hint:`Package and ship with ease`,
	// 		description:`* Sit back and monitor the process on your seller dashboard as we handle delivery from packaging,
	// 		 shipping and delivery.`
	// 	},
	// 	{
	// 		id:4,
	// 		hint:`Receive Payments and Withdraw.`,
	// 		description:`* Receive Payments and on your shop dashboard and then cash out on delivered orders into your shop wallet.
	// 		* Withdraw from your Shop wallet and receive payment into your local bank account within 1-2 working day(s)`
	// 	},
	// ]
	return (
		<div className="flex flex-col flex-auto min-w-0">
			

			<MerchantModernReversedSignUpPage />
		</div>
	);
}

export default RegisterMerchantPage;
