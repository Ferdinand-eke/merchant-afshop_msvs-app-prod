import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import {
  calculateCompanyEarnings,
  calculateShopEarnings,
} from "app/configs/Calculus";
import { useCashoutShopOrderItemsEarnings } from "app/configs/data/server-calls/orders/useShopOrders";
import { Button } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { motion } from 'framer-motion';
import { useThemeMediaQuery } from "@fuse/hooks";
import { toast } from "react-toastify";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";

const Root = styled("div")(({ theme }) => ({
  "& table ": {
    "& th:first-of-type, & td:first-of-type": {
      paddingLeft: `${0}!important`,
    },
    "& th:last-child, & td:last-child": {
      paddingRight: `${0}!important`,
    },
  },
  "& .divider": {
    width: 1,
    backgroundColor: theme.palette.divider,
    height: 144,
  },
  "& .seller": {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    marginRight: -88,
    paddingRight: 66,
    width: 480,
    "& .divider": {
      backgroundColor: theme.palette.getContrastText(
        theme.palette.primary.dark
      ),
      opacity: 0.5,
    },
  },
}));

/**
 * The invoice tab.
 */
function InvoiceTab(props) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const {
    mutate: cashingOutOrderItemSales,
    isLoading: cashingOutLoading,
    error: cashingOutError,
  } = useCashoutShopOrderItemsEarnings();
  if (cashingOutError) {
    toast.success(cashingOutError);
  }

  /***Calculations for earnings starts */
  const { order, myshopData } = props;
  const shopEarning = calculateShopEarnings(
    order?.totalPrice,
    myshopData?.shopplan?.percetageCommissionChargeConversion
  );
  const companyEarnings = calculateCompanyEarnings(
    order?.totalPrice,
    myshopData?.shopplan?.percetageCommissionChargeConversion
  );
  /***Calculations for earnings ends */


  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  // console.log("SHOP_DATA", myshopData)

  // console.log("Reservation_DATA", order)


  return (
    <Root className="grow shrink-0 p-0">
      {order && (
        <Card className="w-xl mx-auto shadow-0">
          <CardContent className="p-88 print:p-0">
            <Typography color="text.secondary" className="mb-32">
              {order?.createddAt}
            </Typography>

            <div className="flex justify-between">
              <div>
                <table className="mb-16">
                  <tbody>
                    <tr>
                      <td className="pb-4">
                        <Typography
                          className="font-light"
                          variant="h6"
                          color="text.secondary"
                        >
                          INVOICE :
                        </Typography>
                      </td>
                      <td className="pb-4 px-8">
                        <Typography
                          className="font-light"
                          variant="h6"
                          color="inherit"
                        >
                          {order?.paymentResult?.reference}
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Typography color="text.secondary">
                  {`${order?.paymentdatas?.bookingName} `}
                </Typography>

                {order?.paymentdatas?.bookingAddress && (
                  <Typography color="text.secondary">
                    {order?.paymentdatas?.bookingAddress}
                  </Typography>
                )}
                {order?.paymentdatas?.bookingPhone && (
                  <Typography color="text.secondary">
                    {order?.paymentdatas?.bookingPhone}
                  </Typography>
                )}
                {/* {order?.orderId?.shippingAddress?.prefContact && (
                  <Typography color="text.secondary">
                    {order?.orderId?.shippingAddress?.prefContact}
                  </Typography>
                )} */}


              </div>

              <div className="seller flex items-center p-16">
                <img
                  className="w-80"
                  // src="assets/images/afslogo/afLogo.svg"
                  src="assets/images/afslogo/afslogo.png"
                  alt="logo"
                />

                <div className="divider mx-8 h-96" />

                <div className="px-8">
                  <Typography color="inherit">AFRICANSHOPS LTD.</Typography>

                  <Typography color="inherit">
                    The Paradise Court, Idu, Abuja, 900288
                  </Typography>
                  <Typography color="inherit">+234 803 586 8983</Typography>
                  <Typography color="inherit">
                    africanshops.africanshops.org
                  </Typography>
                  <Typography color="inherit">www.africanshops.org</Typography>
                </div>
              </div>
            </div>

            <div className="mt-64">
              {/* <Table className="simple">
                <TableHead>
                  <TableRow>
                    <TableCell>PRODUCT</TableCell>
                    <TableCell>PRICE</TableCell>
                    <TableCell align="right">QUANTITY</TableCell>
                    <TableCell align="right">TOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                  >
                    <TableCell>
                      <Typography variant="subtitle1">{order?.name}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {order?.totalPrice && formatter.format(+order?.totalPrice)}
                    </TableCell>
                    <TableCell align="right">{order?.quantity}</TableCell>
                 
                  </TableRow>
        
                </TableBody>
              </Table> */}

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
                {/* <th>
                  <Typography className="font-semibold">Quantity</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Unit Amount</Typography>
                </th> */}
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
                    {order?.paymentResult?.reference}
                  </span>
                </td>
                <td>
                  <span className="truncate">
                    {order?.paymentdatas?.paymentMethod}
                  </span>
                </td>
                {/* <td>
                  <span className="truncate">{order?.quantity}</span>
                </td> */}
                <td>
                  <span className="truncate">
                  ₦ {formatCurrency(order?.totalPrice)}
                  </span>
                </td>
                {/* <td>
                  <span className="truncate">
                    {order?.price * order?.quantity}
                  </span>
                </td> */}
                <td>
                  <span className="truncate">
                    {new Date(order?.PaidAt)?.toDateString()}
                    {/* {order?.PaidAt} */}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

              <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                <div className="font-medium text-base truncate">
                  Payment Details For Parent Order
                </div>
                At {myshopData?.shopplan?.percetageCommissionCharge}% commission
                you earn
                <span
                  className="text-primary font-medium"
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  {" "}
                  {/* <span>{myshopData?.shopplan?.percetageCommissionChargeConversion}</span> */}
                  ₦
                  {formatCurrency(calculateShopEarnings(
                    order?.totalPrice ,
                    myshopData?.shopplan?.percetageCommissionChargeConversion
                  ))}
                </span>{" "}
                while we earn{" "}
                <span
                  className="text-primary font-medium"
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                >
                  ₦
                  {formatCurrency(calculateCompanyEarnings(
                    order?.totalPrice ,
                    myshopData?.shopplan?.percetageCommissionChargeConversion
                  ))}
                </span>
              </div>

              <Table className="simple mt-32">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {/* SUBTOTAL */}
                        Total Item Price
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {/* {formatter.format(+order?.price * order?.quantity)} */}
                        ₦ {formatCurrency(order?.totalPrice)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {/* TAX */}
                        You earn
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {/* {formatter.format(+order?.tax)} */}

                        {formatter.format(+shopEarning)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {/* DISCOUNT */}
                        While Africanshops earns:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {formatter.format(+companyEarnings)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-light"
                        variant="h4"
                        color="text.secondary"
                      >
                        MY TOTAL EARNINGS
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-light"
                        variant="h4"
                        color="text.secondary"
                      >
                        {formatter.format(+shopEarning)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              
            </div>

{ order?.isPaid && order?.isCheckOut && <div className="mt-96">
              <Typography className="mb-24 print:mb-12" variant="body1">
                 Thank you for your business.
              </Typography>

              <div className="flex">
                <div className="shrink-0">
                  <img
                    className="w-80"
                    // src="assets/images/afslogo/afLogo.svg"
                    src="assets/images/afslogo/afslogo.png"
                    alt="logo"
                  />
                </div>

                <Typography
                  className="font-normal mb-64 px-24"
                  variant="caption"
                  color="text.secondary"
                >
                  In honor of {order?.bookingPropertyId?.title}, We at Africanshops consider this Transaction
                  as haven fulfilled the purpose for which it was intended and haven satisfied our consumers, duly
                  consent the repatriation of funds to this merchant. Warmest Regards!.
                </Typography>
              </div>
            </div>}
            

			{order?.isPaid && order?.isCheckOut && (
				<>
				<div className="flex flex-1 items-center justify-end space-x-8">
				<motion.div
					className="flex flex-grow-0"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<Button
						className=""
						// onClick={() => cashingOutOrderItemSales(order?._id)}
						disabled={cashingOutLoading}
						variant="contained"
						color="secondary"
						fullWidth
						size={isMobile ? 'small' : 'medium'}
					>
						<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
						<span className="mx-4 sm:mx-8"> {cashingOutLoading ? "Processing..." : "Cash Out Reservation Earnings"}</span>
					</Button>
				</motion.div>
			</div>
				</>
              )}
          </CardContent>
        </Card>
      )}
    </Root>
  );
}

export default memo(InvoiceTab);
