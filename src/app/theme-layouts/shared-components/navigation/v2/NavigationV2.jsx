/**
 * NavigationV2 — RETAIL plan navigation (v2 copy for refactored navbar)
 *
 * This is an isolated copy of Navigation.jsx used exclusively by
 * PlanNavigationResolver. The original Navigation.jsx is left untouched
 * so the legacy navbar block can be restored at any time.
 */
import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import withSlices from 'app/store/withSlices';
import { navigationSlice, selectNavigation } from '../store/navigationSlice';
import { navbarCloseMobile } from '../../navbar/navbarSlice';

function NavigationV2(props) {
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

export default withSlices([navigationSlice])(NavigationV2);
