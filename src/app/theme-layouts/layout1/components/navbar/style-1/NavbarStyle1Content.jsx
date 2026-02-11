import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import NavbarToggleButton from 'app/theme-layouts/shared-components/navbar/NavbarToggleButton';
import { useGetMyShopAndPlan } from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import UserNavbarHeader from '../../../../shared-components/UserNavbarHeader';
import Logo from '../../../../shared-components/Logo';
import PlanNavigationResolver from './PlanNavigationResolver';

const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
	'& ::-webkit-scrollbar-thumb': {
		boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'}`
	},
	'& ::-webkit-scrollbar-thumb:active': {
		boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'}`
	}
}));
const StyledContent = styled(FuseScrollbars)(() => ({
	overscrollBehavior: 'contain',
	overflowX: 'hidden',
	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
	backgroundRepeat: 'no-repeat',
	backgroundSize: '100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll'
}));

/**
 * The navbar style 1 content.
 */
function NavbarStyle1Content(props) {
	const { data: myshopData, isLoading } = useGetMyShopAndPlan({ queryAllData: false });
	const { className = '' } = props;

	const planKey = myshopData?.data?.merchant?.merchantShopplan?.plankey ?? null;
	return (
		<Root className={clsx('flex h-full flex-auto flex-col overflow-hidden', className)}>
			<div className="flex h-48 shrink-0 flex-row items-center px-20 md:h-72">
				<div className="mx-4 flex flex-1">
					<Logo />
				</div>

				<NavbarToggleButton className="h-40 w-40 p-0" />
			</div>

			<StyledContent
				className="flex min-h-0 flex-1 flex-col"
				option={{ suppressScrollX: true, wheelPropagation: false }}
			>
				<UserNavbarHeader />

				{/* ============================================================
				  LEGACY NAVIGATION BLOCK — kept for reference/fallback.
				  Commented out in favour of the new <PlanNavigationResolver />
				  below. To revert, uncomment this block and remove the
				  PlanNavigationResolver import + usage further down.
				  ============================================================

				{isLoading ? (
					<Typography>loading...</Typography>
				) : (
					<>
						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'RETAIL' && (
							<Navigation layout="vertical" />
						)}

						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'WHOLESALEANDRETAILERS' && (
							<WholesaleRetailNavigation layout="vertical" />
						)}

						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'MANUFACTURERS' && (
							<ManufacturersNavigation layout="vertical" />
						)}

						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'REALESTATE' && (
							<RealEstateNavigation layout="vertical" />
						)}

						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'HOTELSANDAPARTMENTS' && (
							<HotelsApartmentsNavigation layout="vertical" />
						)}

						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'FOODVENDORS' && (
							<FoodMartNavigation layout="vertical" />
						)}

						{myshopData?.data?.merchant?.merchantShopplan?.plankey === 'LOGISTICS' && (
							<LogisticsNavigation layout="vertical" />
						)}
					</>
				)}
				============================================================ */}

				{/* ── REFACTORED: plan-aware navigation resolver ── */}
				<PlanNavigationResolver planKey={planKey} isLoading={isLoading} />

				<div className="flex-0 flex items-center justify-center py-48 opacity-20">
					<img
						className="w-full max-w-64"
						src="assets/images/afslogo/afslogo.png"
						alt="footer logo"
						width={45}
						height={45}
					/>
				</div>
			</StyledContent>
		</Root>
	);
}

export default memo(NavbarStyle1Content);
