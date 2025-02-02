import _ from '@lodash';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoogleMap from 'google-map-react';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router-dom';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
// import { useGetECommerceOrderQuery } from '../../ECommerceApi';
import OrdersStatus from '../OrdersStatus';
import OrdersPackedStatus from '../OrdersPackedStatus';
import OrdersShipmentStatus from '../OrdersShipmentStatus';
import OrdersArrivalStatus from '../OrdersArrivalStatus';
import OrdersDeliveryStatus from '../OrdersDeliveryStatus';
import OrdersCreatedAndPaymentStatus from '../OrdersCreatedAndPaymentStatus';
import { useMerchantDeliverFoodOrder, useMerchantPackFoodOrder, useMerchantShipFoodOrder } from 'app/configs/data/server-calls/foodmartmenuitems/useMerchantFoodOrder';


const mapKey = import.meta.env.VITE_MAP_KEY;

/**
 * The marker.
 */
function Marker(props) {
	const { text, lat, lng } = props;
	return (
		<Tooltip
			title={
				<div>
					{text}
					<br />
					{lat}, {lng}
				</div>
			}
			placement="top"
		>
			<FuseSvgIcon className="text-red">heroicons-outline:location-marker</FuseSvgIcon>
		</Tooltip>
	);
}

/**
 * The order details tab.
 */
function OrderDetailsTab({order, isError}) {
	const routeParams = useParams();
	const { orderId } = routeParams;

	const [map, setMap] = useState('shipping');
	const packOrder = useMerchantPackFoodOrder();
  const shipOrder = useMerchantShipFoodOrder();
  const deliverOrder = useMerchantDeliverFoodOrder();


// console.log("Order-To-PACK", order)

  const handlePack = async () => {
    if (window.confirm('Pack Order?')) {
      try {
        packOrder.mutate(order?._id);
      } catch (error) {
        console.log({ error: packOrder?.error });
        console.log({ error: JSON.stringify(error) });
      }
    }
  };

  const handleShip = async () => {
    
    if (window.confirm('Ship Order?')) {
      try {
        shipOrder.mutate(order?._id);
      } catch (error) {
        console.log({ error: shipOrder?.error });
      }
    }
  };

//   const handleArrival = async () => {
    
//     if (window.confirm('Comfirm Order Arrival to warehouse?')) {
//       try {
//         handleOrderArrival.mutate(order?._id);
//       } catch (error) {
//         console.log({ error: handleOrderArrival?.error });
//       }
//     }
//   };

  const handleDelivery = async () => {
    

    if (window.confirm('Deliver Order?')) {
      try {
        deliverOrder.mutate(order?._id);
      } catch (error) {
        console.log({ error: JSON.stringify(error) });
      }
    }
  };




  /****
   * Handle states below
   */
	if (!isError && !order) {
		return null;
	}

	return (
		<div>
			<div className="pb-48">
				<div className="pb-16 flex items-center">
					<FuseSvgIcon color="action">heroicons-outline:user-circle</FuseSvgIcon>
					<Typography
						className="h2 mx-12 font-medium"
						color="text.secondary"
					>
						Customer
					</Typography>
				</div>

				<div className="mb-24">
					<div className="table-responsive mb-48">
						<table className="simple">
							<thead>
								<tr>
									<th>
										<Typography className="font-semibold">Name</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Email</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Phone</Typography>
									</th>
								
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div className="flex items-center">
											{/* <Avatar src={order?.customer?.avatar} /> */}
											<Avatar
                        src={order?.shippingAddress?.fullName.charAt(
                          0
                        )}
                      />
											<Typography className="truncate mx-8">
												{`${order?.shippingAddress?.fullName}`}
											</Typography>
										</div>
									</td>
									<td>
										<Typography className="truncate">{order?.userOrderCreator?.email}</Typography>
									</td>
									<td>
										<Typography className="truncate">{order?.shippingAddress?.phone}</Typography>
									</td>
								
								</tr>
							</tbody>
						</table>
					</div>

					<div className="space-y-12">
						<Accordion
							className="border-0 shadow-0 overflow-hidden"
							expanded={map === 'shipping'}
							onChange={() => setMap(map !== 'shipping' ? 'shipping' : '')}
							sx={{ backgroundColor: 'background.default', borderRadius: '12px!important' }}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className="font-semibold">Shipping Address</Typography>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row">
								<Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
									{order?.shippingAddress?.address}
								</Typography>
								<div className="w-full h-320 rounded-16 overflow-hidden mx-8">
									{/* <GoogleMap
										bootstrapURLKeys={{
											key: mapKey
										}}
										defaultZoom={15}
										defaultCenter={{
											lng: order?.customer?.shippingAddress?.lng,
											lat: order?.customer?.shippingAddress?.lat
										}}
									>
										<Marker
											text={order?.customer?.shippingAddress?.address}
											lat={order?.customer?.shippingAddress?.lat}
											lng={order?.customer?.shippingAddress?.lng}
										/>
									</GoogleMap> */}
								</div>
							</AccordionDetails>
						</Accordion>

						<Accordion
							className="border-0 shadow-0 overflow-hidden"
							expanded={map === 'invoice'}
							onChange={() => setMap(map !== 'invoice' ? 'invoice' : '')}
							sx={{ backgroundColor: 'background.default', borderRadius: '12px!important' }}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className="font-semibold">Invoice Address</Typography>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row -mx-8">
								<Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
								
									{order?.shippingAddress?.address}
								</Typography>
								<div className="w-full h-320 rounded-16 overflow-hidden mx-8">
									{/* <GoogleMap
										bootstrapURLKeys={{
											key: mapKey
										}}
										defaultZoom={15}
										defaultCenter={{
											lng: order?.customer?.invoiceAddress?.lng,
											lat: order?.customer?.invoiceAddress?.lat
										}}
									>
										<Marker
											text={order?.customer?.invoiceAddress?.address}
											lat={order?.customer?.invoiceAddress?.lat}
											lng={order?.customer?.invoiceAddress?.lng}
										/>
									</GoogleMap> */}
								</div>
							</AccordionDetails>
						</Accordion>
					</div>
				</div>
			</div>

			<div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">heroicons-outline:truck</FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
            Shipping
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="simple">
            <thead>
              <tr>
                <th>
                  <Typography className="font-semibold">
                    Tracking Code
                  </Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Carrier</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Weight</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Fee</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Date</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>
                    <span className="truncate">{order?._id}</span>
                  </td>
                  <td>
                    <span className="truncate">Africanshops Express,{order?.shippingMethod}</span>
                  </td>
                  <td>
                    <span className="truncate">{order?.shipmentWeight}</span>
                  </td>
                  <td>
                    <span className="truncate">{order?.shippingfee || 2000}</span>
                  </td>
                  <td>
                    <span className="truncate">{order?.shippedAt}</span>
                  </td>
                </tr>
             
            </tbody>
          </table>
        </div>
      </div>


<div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">heroicons-outline:clock</FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
            Order Status
          </Typography>
        </div>

        <div className="table-responsive">
          <Table className="simple">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography className="font-semibold">Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Updated On</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {/* OrdersPackedStatus */}
            <TableBody>
              <TableRow>
                <TableCell>
                  <OrdersCreatedAndPaymentStatus
                    createdAt={order?.createdAt}
                    isPaid={order?.isPaid}
                  />
                </TableCell>
                <TableCell>{order?.createdAt}</TableCell>
              </TableRow>
            

              {order?.isPaid && (
                <>
                  <TableRow>
                    <TableCell>
                      <OrdersPackedStatus isPacked={order?.isPacked} />
                    </TableCell>
                    <TableCell>
						
						{
							order?.isPacked ?  <div
							className={clsx(
								'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
								'bg-green text-white'
							)}
						>
							{order?.packedAt}
						</div>  : <div
						   onClick={() => handlePack()}
							className={clsx(
								'cursor-pointer inline text-12 font-semibold py-4 px-12 rounded-full truncate',
								'bg-orange text-black'
							)}
						>
							{packOrder.isLoading ? 'Processing Packaging ' : 'Process Packaging '}
						</div>
						}
						</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <OrdersShipmentStatus
                        isShipped={order?.isShipped}
                      />
                    </TableCell>
                    <TableCell>
					{
							order?.isShipped ?  <div
							className={clsx(
								'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
								'bg-green text-white'
							)}
						>
							{order?.shippedAt}
						</div>  :  
						
						<>
						{
							order?.isPacked && (<div
								onClick={() => handleShip()}
		
								
									className={clsx(
										'cursor-pointer inline text-12 font-semibold py-4 px-12 rounded-full truncate',
										'bg-orange text-black'
									)}
								>
									{shipOrder.isLoading ? 'Processing Shipping ' : 'Process Shipping '}
								</div>)
						}
						</>
						
						}
					</TableCell>
                  </TableRow>

                  {/* <TableRow>
                    <TableCell>
                      <OrdersArrivalStatus
                        hasArrivedWarehouse={
                          order?.hasArrivedWarehouse
                        }
                      />
                    </TableCell>
                    <TableCell>
					{
							order?.hasArrivedWarehouse ?  <div
							className={clsx(
								'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
								'bg-green text-white'
							)}
						>
							{order?.arrivedWarehouseAt}
						</div>  :  
						
						<>
						{
							order?.isShipped && (<div
								onClick={() => handleArrival()}
		
								
									className={clsx(
										'cursor-pointer inline text-12 font-semibold py-4 px-12 rounded-full truncate',
										'bg-orange text-black'
									)}
								>
									{handleOrderArrival.isLoading ? 'Processing Order Arrival ' : 'Process Order Arrival '}
								</div>)
						}
						</>
						
						}
					</TableCell>
                  </TableRow> */}

                  <TableRow>
                    <TableCell>
                      <OrdersDeliveryStatus
                        isDelivered={order?.isDelivered}
                      />
                    </TableCell>
                    <TableCell>

						{
							order?.isPacked &&
							order?.isShipped && <>

						{
							order?.isDelivered ?  <div
							className={clsx(
								'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
								'bg-green text-white'
							)}
						>
							{order?.deliveredAt}
						</div>  :  
						
						<>
						{
							<div
								onClick={() => handleDelivery()}
		
								
									className={clsx(
										'cursor-pointer inline text-12 font-semibold py-4 px-12 rounded-full truncate',
										'bg-orange text-black'
									)}
								>
									{deliverOrder.isLoading ? 'Processing Order Delivery ' : 'Process Order Delivery '}
								</div>
						}
						</>
						
						}
							
							</>
						}
						
						
						</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

	  <div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">
            heroicons-outline:currency-dollar
          </FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
            Payment
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="simple">
            <thead>
              <tr>
                <th>
                  <Typography className="font-semibold">
                    TransactionID
                  </Typography>
                </th>
                <th>
                  <Typography className="font-semibold">
                    Payment Method
                  </Typography>
                </th>
				<th>
                  <Typography className="font-semibold">Item Price</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Shipping</Typography>
                </th>
				<th>
                  <Typography className="font-semibold">Tax</Typography>
                </th>
				<th>
                  <Typography className="font-semibold">Totak Amount</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Date</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="truncate">
                    {order?._id}
                  </span>
                </td>
                <td>
                  <span className="truncate">{order?.paymentMethod}</span>
                </td>
				<td>
                  <span className="truncate">NGN {order?.itemsPrice}</span>
                </td>
                <td>
                  <span className="truncate">NGN {order?.shippingPrice}</span>
                </td>
				<td>
                  <span className="truncate">NGN {order?.taxPrice}</span>
                </td>

				<td>
                  <span className="truncate">NGN {order?.totalPrice}</span>
                </td>
                <td>
                  <span className="truncate">{order?.createdAt}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

			
		</div>
	);
}

export default OrderDetailsTab;
