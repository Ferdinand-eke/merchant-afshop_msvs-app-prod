import { memo, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import NavbarNavigationSkeleton from './NavbarNavigationSkeleton';

/**
 * Lazy-import the v2 navigation components so each plan's navigation
 * bundle is only loaded when that merchant is actually signed in.
 * React.lazy is intentionally NOT used here because Fuse's withSlices()
 * HOC relies on synchronous slice injection. Instead we import them
 * normally but keep them isolated in a dedicated "v2" folder so the
 * original working navigations are never touched during this refactor.
 */
import NavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/NavigationV2';
import WholesaleRetailNavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/WholesaleRetailNavigationV2';
import ManufacturersNavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/ManufacturersNavigationV2';
import RealEstateNavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/RealEstateNavigationV2';
import HotelsApartmentsNavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/HotelsApartmentsNavigationV2';
import FoodMartNavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/FoodMartNavigationV2';
import LogisticsNavigationV2 from 'app/theme-layouts/shared-components/navigation/v2/LogisticsNavigationV2';

/**
 * Maps every merchant plan key to its corresponding navigation component.
 * Adding a new plan type only requires a single entry here — no if/else chains.
 */
const PLAN_NAV_MAP = {
	RETAIL: NavigationV2,
	WHOLESALEANDRETAILERS: WholesaleRetailNavigationV2,
	MANUFACTURERS: ManufacturersNavigationV2,
	REALESTATE: RealEstateNavigationV2,
	HOTELSANDAPARTMENTS: HotelsApartmentsNavigationV2,
	FOODVENDORS: FoodMartNavigationV2,
	LOGISTICS: LogisticsNavigationV2,
};

/**
 * PlanNavigationResolver
 *
 * Resolves and renders the correct vertical navigation component for the
 * currently authenticated merchant based on their subscription plan key.
 *
 * Behaviour:
 *  - While `isLoading` is true → renders a skeleton that mirrors the
 *    expected nav structure so the layout is stable.
 *  - Once data arrives, looks up the component from PLAN_NAV_MAP using
 *    the planKey. Unknown / null plan keys fall back to a graceful message
 *    rather than a blank screen.
 *
 * @param {object}       props
 * @param {string|null}  props.planKey   - Merchant plan key from the API.
 * @param {boolean}      props.isLoading - True while the plan is being fetched.
 * @param {string}       [props.layout]  - Navigation layout (default: 'vertical').
 */
function PlanNavigationResolver({ planKey, isLoading, layout = 'vertical' }) {
	const NavComponent = useMemo(() => {
		if (!planKey) return null;
		return PLAN_NAV_MAP[planKey] ?? null;
	}, [planKey]);

	if (isLoading) {
		return <NavbarNavigationSkeleton itemCount={9} showSection />;
	}

	if (!NavComponent) {
		return (
			<Box
				className="flex flex-col items-center justify-center px-16 py-32 text-center"
				sx={{ opacity: 0.6 }}
			>
				<Typography variant="caption" color="text.secondary">
					{planKey
						? `Unrecognised plan: "${planKey}". Please contact support.`
						: 'Unable to load your navigation. Please refresh the page.'}
				</Typography>
			</Box>
		);
	}

	return <NavComponent layout={layout} />;
}

export default memo(PlanNavigationResolver);
