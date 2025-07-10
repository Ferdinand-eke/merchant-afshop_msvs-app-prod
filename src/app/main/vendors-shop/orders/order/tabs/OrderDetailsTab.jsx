import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GoogleMap from "google-map-react";
import { useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useParams } from "react-router-dom";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import { useGetECommerceOrderQuery } from "../../ECommerceApi";
import OrdersStatus from "../OrdersStatus";
import OrdersPackedStatus from "../OrdersPackedStatus";
import OrdersCreatedAndPaymentStatus from "../OrdersCreatedAndPaymentStatus";
import OrdersShipmentStatus from "../OrdersShipmentStatus";
import OrdersArrivalStatus from "../OrdersArrivalStatus";
import OrdersDeliveryStatus from "../OrdersDeliveryStatus";
import { formatCurrency } from "../../../pos/PosUtils";

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
      <FuseSvgIcon className="text-red">
        heroicons-outline:location-marker
      </FuseSvgIcon>
    </Tooltip>
  );
}

/**
 * The order details tab.
 */

function OrderDetailsTab({ order, isError }) {
  const routeParams = useParams();
  const { orderId } = routeParams;
  const [map, setMap] = useState("shipping");

  if (!isError && !order) {
    return null;
  }

  return (
    <div>
      <div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">
            heroicons-outline:user-circle
          </FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
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
                      <Avatar
                        src={order?.order?.shippingAddress?.fullName.charAt(
                          0
                        )}
                      />
                      <Typography className="truncate mx-8">
                        {`${order?.order?.shippingAddress?.fullName} `}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <Typography className="truncate">
                      {order?.order?.shippingAddress?.prefContact}
                    </Typography>
                  </td>
                  <td>
                    <Typography className="truncate">
                      {order?.order?.shippingAddress?.phone}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-12">
            <Accordion
              className="border-0 shadow-0 overflow-hidden"
              expanded={map === "shipping"}
              onChange={() => setMap(map !== "shipping" ? "shipping" : "")}
              sx={{
                backgroundColor: "background.default",
                borderRadius: "12px!important",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="font-semibold">
                  Shipping Address
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col md:flex-row">
                <Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
                  {order?.order?.shippingAddress?.address}
                </Typography>
                {/* <div className="w-full h-320 rounded-16 overflow-hidden mx-8">
									<GoogleMap
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
									</GoogleMap>
								</div> */}
              </AccordionDetails>
            </Accordion>

            <Accordion
              className="border-0 shadow-0 overflow-hidden"
              expanded={map === "invoice"}
              onChange={() => setMap(map !== "invoice" ? "invoice" : "")}
              sx={{
                backgroundColor: "background.default",
                borderRadius: "12px!important",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="font-semibold">
                  Invoice Address
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col md:flex-row -mx-8">
                <Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
             
                  {order?.order?.shippingAddress?.address}
                </Typography>
                {/* <div className="w-full h-320 rounded-16 overflow-hidden mx-8">
                  <GoogleMap
										bootstrapURLKeys={{
											key: mapKey
										}}
										defaultZoom={15}
										defaultCenter={{
											lng: order?.customer?.invoiceAddress.lng,
											lat: order?.customer?.invoiceAddress.lat
										}}
									>
										<Marker
											text={order?.customer?.invoiceAddress.address}
											lat={order?.customer?.invoiceAddress.lat}
											lng={order?.customer?.invoiceAddress.lng}
										/>
									</GoogleMap>
                </div> */}
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
                    <span className="truncate">{order?.order?._id}</span>
                  </td>
                  <td>
                    <span className="truncate">Africanshops Express,{order?.order?.shippingMethod}</span>
                  </td>
                  <td>
                    <span className="truncate">{order?.order?.shipmentWeight}</span>
                  </td>
                  <td>
                    <span className="truncate">NGN {formatCurrency(order?.order?.shippingfee || 2000)}</span>
                  </td>
                  <td>
                    <span className="truncate">{new Date(order?.order?.shippedAt)?.toDateString()} </span>
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
                    createdAt={order?.order?.createdAt}
                    isPaid={order?.order?.isPaid}
                  />
                </TableCell>
                <TableCell>
                  {/* {order?.order?.createdAt} */}
                  {new Date(order?.order?.createdAt)?.toDateString()}
                  </TableCell>
              </TableRow>

              {order?.order?.isPaid && (
                <>
                  <TableRow>
                    <TableCell>
                      <OrdersPackedStatus isPacked={order?.order?.isPacked} />
                    </TableCell>
                    <TableCell>
                      {/* {order?.order?.packedAt} */}
                      {new Date(order?.order?.packedAt)?.toDateString()}
                      </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <OrdersShipmentStatus
                        isShipped={order?.order?.isShipped}
                      />
                    </TableCell>
                    <TableCell>
                    {new Date(order?.order?.shippedAt)?.toDateString()}
                      {/* {order?.order?.shippedAt} */}
                      </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <OrdersArrivalStatus
                        hasArrivedWarehouse={
                          order?.order?.hasArrivedWarehouse
                        }
                      />
                    </TableCell>
                    <TableCell>
                    {new Date(order?.order?.arrivedWarehouseAt)?.toDateString()}
                      {/* {order?.order?.arrivedWarehouseAt} */}
                      </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <OrdersDeliveryStatus
                        isDelivered={order?.order?.isDelivered}
                      />
                    </TableCell>
                    <TableCell>{new Date(order?.order?.deliveredAt)?.toDateString()}</TableCell>
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
                  <Typography className="font-semibold">Quantity</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Unit Amount</Typography>
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
                    {order?.order?.id}
                  </span>
                </td>
                <td>
                  <span className="truncate">{order?.order?.paymentMethod}</span>
                </td>
				<td>
                  <span className="truncate">{order?.quantity}</span>
                </td>
                <td>
                  <span className="truncate">NGN {formatCurrency(order?.price)}</span>
                </td>
				<td>
                  <span className="truncate">NGN {formatCurrency(order?.price * order?.quantity)}</span>
                </td>
                <td>
                  <span className="truncate">{new Date(order?.createdAt)?.toDateString()}</span>
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
