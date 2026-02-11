/**
 * WholesaleRetailNavigationV2 — WHOLESALEANDRETAILERS plan navigation (v2 copy)
 *
 * Isolated copy of WholesaleRetailNavigation.jsx for use by PlanNavigationResolver.
 * The original is left untouched for legacy fallback.
 */
import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import withSlices from 'app/store/withSlices';
import { wholesaleretailNavigationSlice, selectNavigation } from '../store/wholesaleretailNavigationSlice';
import { navbarCloseMobile } from '../../navbar/navbarSlice';

function WholesaleRetailNavigationV2(props) {
	const { className = '', layout = 'vertical', dense, active } = props;
	const navigation = useAppSelector(selectNavigation);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const dispatch = useAppDispatch();

	return useMemo(() => {
		function handleItemClick() {
			if (isMobile) {
				dispatch(navbarCloseMobile());
			}
		}

		return (
			<FuseNavigation
				className={clsx('navigation flex-1', className)}
				navigation={navigation}
				layout={layout}
				dense={dense}
				active={active}
				onItemClick={handleItemClick}
				checkPermission
			/>
		);
	}, [dispatch, isMobile, navigation, active, className, dense, layout]);
}

export default withSlices([wholesaleretailNavigationSlice])(WholesaleRetailNavigationV2);
