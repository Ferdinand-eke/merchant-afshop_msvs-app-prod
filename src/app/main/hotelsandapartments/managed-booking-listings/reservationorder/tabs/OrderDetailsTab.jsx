import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import clsx from "clsx";
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
// import OrdersPackedStatus from "../OrdersPackedStatus";
import ReservationCreatedAndPaymentStatus from "../ReservationCreatedAndPaymentStatus";
import OrdersShipmentStatus from "../OrdersShipmentStatus";
// import OrdersArrivalStatus from "../OrdersArrivalStatus";
// import OrdersDeliveryStatus from "../OrdersDeliveryStatus";
import ReservationCheckInStatus from "../ReservationCheckInStatus";
import { toast } from "react-toastify";
import {
  useCheckInGuest,
  useCheckOutGuest,
} from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";
import ReservationCheckOustStatus from "../ReservationCheckOustStatus";

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

function OrderDetailsTab({ reservation, isError }) {
  const routeParams = useParams();
  const { orderId } = routeParams;

  const [map, setMap] = useState("shipping");
  const checkInGuest = useCheckInGuest();
  const checkOutGuestReservation = useCheckOutGuest();

  // console.log("ENV_DATA", mapKey)

  const handleCheckIn = async () => {
    if (window.confirm("Check in reservation?")) {
      try {
        checkInGuest.mutate(reservation?.id);
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleCheckOutGuest = async () => {
    if (window.confirm("Check out this reservation?")) {
      try {
        checkOutGuestReservation.mutate(reservation?.id);
      } catch (error) {
        toast.error(error);
      }
    }
  };


  // if (!isError && !reservation) {
  //   return null;
  // }

  return (
    <div>
      <div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">
            heroicons-outline:user-circle
          </FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
            Guest
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
                  {/* <th>
										<Typography className="font-semibold">Company</Typography>
									</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center">
                      <Avatar
                        src={reservation?.paymentdatas?.bookingName.charAt(0)}
                      />
                      <Typography className="truncate mx-8">
                        {`${reservation?.paymentdatas?.bookingName} `}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <Typography className="truncate">
                      {reservation?.paymentdatas?.bookingAddress}
                    </Typography>
                  </td>
                  <td>
                    <Typography className="truncate">
                      {reservation?.paymentdatas?.bookingPhone}
                    </Typography>
                  </td>
                  {/* <td>
										<span className="truncate">{reservation?.customer?.company}</span>
									</td> */}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-12">
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
                <Typography className="font-semibold">Guest Address</Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col md:flex-row -mx-8">
                <Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
                  {/* {reservation?.customer?.invoiceAddress.address} */}
                  {reservation?.paymentdatas?.bookingAddress}
                </Typography>
                <div className="w-full h-320 rounded-16 overflow-hidden mx-8">
                  {/* <GoogleMap
										bootstrapURLKeys={{
											key: mapKey
										}}
										defaultZoom={15}
										defaultCenter={{
											lng: reservation?.customer?.invoiceAddress.lng,
											lat: reservation?.customer?.invoiceAddress.lat
										}}
									>
										<Marker
											text={reservation?.customer?.invoiceAddress.address}
											lat={reservation?.customer?.invoiceAddress.lat}
											lng={reservation?.customer?.invoiceAddress.lng}
										/>
									</GoogleMap> */}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      {/* https://admin.labtraca.com/ */}
      <div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">heroicons-outline:clock</FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
            Guest Stay Status
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
                  <Typography className="font-semibold">CheckIn-CheckOut Date</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="font-semibold">Processed On</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>
                  <ReservationCreatedAndPaymentStatus
                    createdAt={reservation?.createdAt}
                    isPaid={reservation?.isPaid}
                  />
                </TableCell>
                <TableCell>{reservation?.orderId?.createdAt}</TableCell>
              </TableRow>

              {reservation?.isPaid && (
                <>
                  <TableRow>
                    <TableCell>
                      <ReservationCheckInStatus
                        isCheckIn={reservation?.isCheckIn}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className={clsx(
                          "inline text-12 font-semibold py-4 px-12 rounded-full truncate",
                          "bg-gray-500 text-white"
                        )}
                      >
                        {new Date(reservation?.startDate)?.toDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      {reservation?.isCheckIn ? (
                        <div
                          className={clsx(
                            "inline text-12 font-semibold py-4 px-12 rounded-full truncate",
                            "bg-green text-white"
                          )}
                        >
                          {new Date(reservation?.checkedInAt)?.toDateString()}
                        </div>
                      ) : (
                        <div
                          onClick={() => handleCheckIn()}
                          className={clsx(
                            "cursor-pointer inline text-12 font-semibold py-4 px-12 rounded-full truncate",
                            "bg-orange-300 hover:bg-orange-500 text-black"
                          )}
                        >
                          {checkInGuest.isLoading
                            ? "Checking In Guest "
                            : "Check In Guest "}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>

                  {reservation?.isCheckIn && (
                    <TableRow>
                      <TableCell>
                        <ReservationCheckOustStatus
                          isCheckOut={reservation?.isCheckOut}
                        />
                      </TableCell>

                      <TableCell>
                      <div
                        className={clsx(
                          "inline text-12 font-semibold py-4 px-12 rounded-full truncate",
                          "bg-gray-500 text-white"
                        )}
                      >
                        {new Date(reservation?.endDate)?.toDateString()}
                      </div>
                    </TableCell>

                      <TableCell>
                        {reservation?.isCheckOut ? (
                          <div
                            className={clsx(
                              "inline text-12 font-semibold py-4 px-12 rounded-full truncate",
                              "bg-green text-white"
                            )}
                          >
                            {new Date(
                              reservation?.checkedOutAt
                            )?.toDateString()}
                          </div>
                        ) : (
                          <div
                            onClick={() => handleCheckOutGuest()}
                            className={clsx(
                              "cursor-pointer inline text-12 font-semibold py-4 px-12 rounded-full truncate",
                              "bg-orange-300 hover:bg-orange-500 text-black"
                            )}
                          >
                            {checkOutGuestReservation.isLoading
                              ? " Checking Out Guest "
                              : " Check Out Guest "}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}

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
                  <Typography className="font-semibold">
                    Total Amount
                  </Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Payed On</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="truncate">
                    {reservation?.paymentResult?.reference}
                  </span>
                </td>
                <td>
                  <span className="truncate">
                    {reservation?.paymentdatas?.paymentMethod}
                  </span>
                </td>
             
                <td>
                  <span className="truncate">
                  ₦ {formatCurrency(reservation?.totalPrice)}
                  </span>
                </td>
              
                <td>
                  <span className="truncate">
                    {new Date(reservation?.PaidAt)?.toDateString()}
           
                  </span>
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
