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

/**
 * The order.
 */
function Order() {
	const routeParams = useParams();
	const { orderId } = routeParams;

	// const {
	// 	data: order,
	// 	isLoading,
	// 	isError
	// } = useGetECommerceOrderQuery(orderId, {
	// 	skip: !orderId
	// });
	const [loading, setLoading] = useState(false);
	const [myshopData, setMyshopData] = useState({});

	const {data:orderItem, isLoading:orderItemIsLoading, isError:itemIsError} = useFindShopItemsInOrders(orderId, {
		skip: !orderId
	});
	
	useEffect(() => {
	  if (orderId) {
		getSingleApiShopDetails();
	  }
	}, [orderId]);
  
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

	// console.log("SingleOrderItem", orderItem?.data?.data)

	const theme = useTheme();
	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));
	const [tabValue, setTabValue] = useState(0);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (orderItemIsLoading) {
		return <FuseLoading />;
	}

	if (itemIsError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such order!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/shoporders-list/orders"
					color="inherit"
				>
					Go to Orders Page
				</Button>
			</motion.div>
		);
	}

	
	return (
		<FusePageCarded
			header={
				orderItem?.data && (
					<div className="flex flex-1 flex-col py-32 px-24 md:px-32">
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								className="flex items-center sm:mb-12"
								component={Link}
								role="button"
								to="/shoporders-list/orders"
								color="inherit"
							>
								<FuseSvgIcon size={20}>
									{theme.direction === 'ltr'
										? 'heroicons-outline:arrow-sm-left'
										: 'heroicons-outline:arrow-sm-right'}
								</FuseSvgIcon>
								<span className="mx-4 font-medium">Orders</span>
							</Typography>
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
							className="flex flex-col min-w-0"
						>
							<Typography className="text-20 truncate font-semibold">
								{`Order Item ${orderItem?.data?._id}`}
							</Typography>
							<Typography
								variant="caption"
								className="font-medium"
							>
								{`From ${orderItem?.data.orderId?.shippingAddress?.fullName} `}
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
							label="Order Details"
						/>
						<Tab
							className="h-64"
							label="Products"
						/>
						<Tab
							className="h-64"
							label="Invoice"
						/>
					</Tabs>
					{orderItem?.data && (
						<div className="p-16 sm:p-24 max-w-3xl w-full">
							{tabValue === 0 && <OrderDetailsTab order={orderItem?.data} isError={itemIsError}/>}
							{tabValue === 1 && <ProductsTab order={orderItem?.data} isError={itemIsError}/>}
							{tabValue === 2 && <InvoiceTab order={orderItem?.data} myshopData={myshopData}/>}
						</div>
					)}
				</>
			}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Order;
