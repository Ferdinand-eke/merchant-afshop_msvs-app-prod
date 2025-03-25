import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import withSlices from 'app/store/withSlices';
import { bookingsNavigationSlice, selectNavigation } from '../store/bookingsNavigationSlice';
import { navbarCloseMobile } from '../../navbar/navbarSlice';
import { useNavigate } from 'react-router';
const AFS_HOTELHOMES = import.meta.env.VITE_AFS_HOTELHOMES;


function HotelsApartmentsNavigation(props) {
	const { className = '', layout = 'vertical', dense, active, merchantPlanKey } = props;
	const navigation = useAppSelector(selectNavigation);
	
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const dispatch = useAppDispatch();
	const navigate = useNavigate()

	const checkTruthy = (merchantPlanKey === "HOTELSANDAPARTMENTS")

	console.log
	console.log("merchant_Ket_Truthy", checkTruthy)

	
	useEffect(()=>{
		if(!(merchantPlanKey === "HOTELSANDAPARTMENTS")){
			navigate('/')
		}
	},[
		merchantPlanKey,
		"HOTELSANDAPARTMENTS",
		navigate,
	])

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


export default withSlices([bookingsNavigationSlice])(HotelsApartmentsNavigation);
