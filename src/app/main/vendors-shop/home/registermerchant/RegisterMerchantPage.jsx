
import {  ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { useAppSelector } from 'app/store/hooks';
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
