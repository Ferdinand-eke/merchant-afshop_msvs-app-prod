/* eslint-disable react/no-unstable-nested-components */
import { motion } from "framer-motion";
import { useMemo } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Chip, ListItemIcon, MenuItem, Paper } from "@mui/material";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import Button from "@mui/material/Button";
// import useMyShopEstateProperties from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
// import useMyShopBookingsProperties from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';
import useMyPropertiesReservations from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";
import MerchantErrorPage from "../FoodMerchantErrorPage";
import useMerchantFoodOrders from "app/configs/data/server-calls/foodmartmenuitems/useMerchantFoodOrder";
// import OrdersCreatedAndPaymentStatus from "../../vendors-shop/orders/order/OrdersCreatedAndPaymentStatus";
// import FoodOrdersCreatedAndPaymentStatus from "../foodorder/FoodOrdersCreatedAndPaymentStatus";
import { formatCurrency } from "../../vendors-shop/pos/PosUtils";
import FoodOrdersCreatedAndPaymentStatus from "../foodorder/FoodOrdersCreatedAndPaymentStatus";
// import MerchantErrorPage from "../../MerchantErrorPage";

function FoodOrdersTable() {
  const {
    data: foorOrders,
    isLoading: foorOrdersIsLoading,
    isError,
  } = useMerchantFoodOrders();



  const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'id',
			// 	header: 'Id',
			// 	size: 64
			// },
			{
				accessorKey: 'refOrderId',
				header: 'Reference',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/foodmarts/list/food-orders/${row?.original?._id}/view`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.refOrderId}
					</Typography>
				)
			},
			{
				id: 'name',
				accessorFn: (row) => `${row?.shippingAddress?.fullName}`,
				header: 'Customer'
			},
			{
				id: 'total',
				accessorFn: (row) => ` ₦ ${formatCurrency(row?.totalPrice)}`,
				header: 'Total',
				size: 64
			},
			// { id: 'payment', accessorFn: (row) => row.payment.method, header: 'Payment', size: 128 },
			{
				id: 'isPaid',
				accessorFn: (row) => <FoodOrdersCreatedAndPaymentStatus 
				createdAt={row?.createdAt}
				isPaid={row?.isPaid} />,
				accessorKey: 'isPaid',
				header: 'Payment Status'
			},
			{
				accessorKey: 'createdAt',
				header: 'Date'
			}
		],
		[]
	);

  if (foorOrdersIsLoading) {
    return <FuseLoading />;
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <MerchantErrorPage message={" Error occurred while retriving food orders"}/>
      </motion.div>
    );
  }

  if (!foorOrders?.data?.data) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no listings!
        </Typography>
      </div>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable data={foorOrders?.data?.data} columns={columns} />
    </Paper>
  );
}

export default FoodOrdersTable;
