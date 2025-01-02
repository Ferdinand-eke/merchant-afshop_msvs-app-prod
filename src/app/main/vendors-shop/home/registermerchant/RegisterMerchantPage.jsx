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

	return (
		<div className="flex flex-col flex-auto min-w-0">
			

			<MerchantModernReversedSignUpPage />
		</div>
	);
}

export default RegisterMerchantPage;
