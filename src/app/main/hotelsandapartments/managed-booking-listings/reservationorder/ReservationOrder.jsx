import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import InvoiceTab from './tabs/InvoiceTab';
import OrderDetailsTab from './tabs/OrderDetailsTab';
import ProductsTab from './tabs/ProductsTab';
import { useGetECommerceOrderQuery } from '../ECommerceApi';
import { useFindShopItemsInOrders } from 'app/configs/data/server-calls/orders/useShopOrders';
import { getJustMyShopDetailsAndPlan } from 'app/configs/data/client/clientToApiRoutes';
import { useFindMerchantSingleReservation } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';
import MerchantErrorPage from '../../MerchantErrorPage';

/**
 * The order.
 */
function ReservationOrder() {
	const routeParams = useParams();
	const { reservationId } = routeParams;


	const [loading, setLoading] = useState(false);
	const [myshopData, setMyshopData] = useState({});


	const {data:reservationItem, isLoading:reservationIsLoading, isError:reservationIsError} = useFindMerchantSingleReservation(reservationId, {
		skip: !reservationId
	});

	
	useEffect(() => {
	  if (reservationId) {
		getSingleApiShopDetails();
	  }
	}, [reservationId]);
  
	async function getSingleApiShopDetails() {
	  setLoading(true);
	  const responseData = await getJustMyShopDetailsAndPlan();
	  if (responseData) {
		setMyshopData(responseData?.data);
  
		setTimeout(
		  function () {
			setLoading(false);
		  }.bind(this),
		  250
		);
	  }
	}

console.log("MyShop", myshopData)

	const theme = useTheme();
	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));
	const [tabValue, setTabValue] = useState(0);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (reservationIsLoading) {
		return <FuseLoading />;
	}

	if (reservationIsError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
			
				 <MerchantErrorPage message={" Error occurred while retriving reservation data"}/>
				{/* <Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/shoporders-list/orders"
					color="inherit"
				>
					Go to reservations Page
				</Button> */}
			</motion.div>
		);
	}

	// console.log("RESERVATION-ITEM", reservationItem?.data?.reservationBooked);

	// console.log("USER-IN-RESERVATION", reservationItem?.data?.userInReservedBooking?.user);

	
	return (
		<FusePageCarded
			header={
				reservationItem?.data && (
					<div className="flex flex-1 flex-col py-32 px-24 md:px-32">
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								className="flex items-center sm:mb-12"
								component={Link}
								role="button"
								to="/bookings/list-reservations"
								color="inherit"
							>
								<FuseSvgIcon size={20}>
									{theme.direction === 'ltr'
										? 'heroicons-outline:arrow-sm-left'
										: 'heroicons-outline:arrow-sm-right'}
								</FuseSvgIcon>
								<span className="mx-4 font-medium">Reservations</span>
							</Typography>
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
							className="flex flex-col min-w-0"
						>
							<Typography className="text-20 truncate font-semibold">
								{`Reservation Reference: ${reservationItem?.data?.reservationBooked?.reservation?.paymentResult?.reference}`}
							</Typography>
							<Typography
								variant="caption"
								className="font-medium"
							>
								{`Expectant Guest:  ${reservationItem?.data?.userInReservedBooking?.user?.name} `}
							</Typography>
						</motion.div>
					</div>
				)
			}
			content={
				<>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="secondary"
						textColor="secondary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64 border-b-1' }}
					>
						<Tab
							className="h-64"
							label="Reservation Details"
						/>
						{/* <Tab
							className="h-64"
							label="Products"
						/> */}
						<Tab
							className="h-64"
							label="Invoice"
						/>
					</Tabs>
					{reservationItem?.data && (
						<div className="p-16 sm:p-24 max-w-3xl w-full">
							{tabValue === 0 && <OrderDetailsTab reservation={reservationItem?.data?.reservationBooked?.reservation} isError={reservationIsError}/>}
							{/* {tabValue === 1 && <ProductsTab order={reservationItem?.data} isError={reservationIsError}/>} */}
							{tabValue === 1 && <InvoiceTab order={reservationItem?.data?.reservationBooked?.reservation} myshopData={myshopData?.merchant}/>}
						</div>
					)}
				</>
			}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}


export default ReservationOrder;
