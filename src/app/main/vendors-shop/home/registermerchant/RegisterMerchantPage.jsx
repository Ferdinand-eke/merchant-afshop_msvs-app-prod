import MerchantModernReversedSignUpPage from './MerchantModernReversedSignUpPage';

/**
 * AfricanShops Merchant Registration Page - Production Ready
 * Container component for the merchant sign-up flow
 */
function RegisterMerchantPage() {
	return (
		<div className="flex flex-col flex-auto min-w-0">
			<MerchantModernReversedSignUpPage />
		</div>
	);
}

export default RegisterMerchantPage;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
import {  ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { useAppSelector } from 'app/store/hooks';
import MerchantModernReversedSignUpPage from './MerchantModernReversedSignUpPage';

function RegisterMerchantPage() {
	const mainThemeDark = useAppSelector(selectMainThemeDark);

	return (
		<div className="flex flex-col flex-auto min-w-0">


			<MerchantModernReversedSignUpPage />

		</div>
	);
}

export default RegisterMerchantPage;
*/
