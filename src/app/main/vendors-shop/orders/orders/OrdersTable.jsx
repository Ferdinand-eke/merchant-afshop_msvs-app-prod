/* eslint-disable react/no-unstable-nested-components */
import _ from '@lodash';
import clsx from 'clsx';
import { useMemo } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import { ListItemIcon, MenuItem, Paper } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import {
  useDeleteECommerceOrdersMutation,
  useGetECommerceOrdersQuery,
} from "../ECommerceApi";
import OrdersStatus from "../order/OrdersStatus";
import { useShopItemsInOrders } from "app/configs/data/server-calls/orders/useShopOrders";
// import { useShopItemsInOrders } from 'app/configs/data/server-calls/orders/useShopOrders';

function OrdersTable() {
  const { data: shopOrderItems, isLoading: shopOrderItemsIsLoading, isError } =
    useShopItemsInOrders();
  console.log("My-SHop-OrderItems", shopOrderItems?.data?.MDbItemsInOrders);

//   const { data: orders, isLoading } = useGetECommerceOrdersQuery();
//   const [removeOrders] = useDeleteECommerceOrdersMutation();
  

  const columns = useMemo(
    () => [
      // {
      // 	accessorKey: 'id',
      // 	header: 'Id',
      // 	size: 64
      // },
      {
        accessorKey: "reference",
        header: "Reference",
        size: 25,
        Cell: ({ row }) => (
          <Typography
            component={Link}
            to={`/shoporders-list/orders/${row.original._id}`}
            className="underline"
            color="secondary"
            role="button"
          >
            {row.original._id}
          </Typography>
        ),
      },
      {
		accessorKey: "product",
        header: "Product",
        accessorFn: (row) => row.featuredImageId,
        id: "featuredImageId",
        // header: "",
        enableColumnFilter: false,
        enableColumnDragging: false,
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <>
              {row?.original?.image ? (
                <img
                  className="w-full max-h-40 max-w-40 block rounded"
                  src={row?.original?.image}
                  alt={row?.original?.name}
                />
              ) : (
                <img
                  className="w-full max-h-40 max-w-40 block rounded"
                  src="assets/images/apps/ecommerce/product-image-placeholder.png"
                  alt={row?.original?.name}
                />
              )}
            </>
          </div>
        ),
      },
	  {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Typography
            className="underline"
            color="secondary"
            role="button"
          >
            {row?.original?.name}
          </Typography>
        ),
      },
      {
        id: "customer",
        accessorFn: (row) => `${row?.orderId?.shippingAddress?.fullName} `,
        header: "Customer",
      },
    //   {
    //     id: "price",
    //     accessorFn: (row) => `$${row?.price}`,
    //     header: "Unit Price",
    //     size: 64,
    //   },
      {
        id: "quantity",
        accessorFn: (row) => `${row?.quantity}`,
        header: "Quantity",
        size: 64,
      },

      {
        id: "total",
        accessorFn: (row) => `N${row.quantity * row.price}`,
        header: "Total Price",
        size: 64,
      },

      {
        id: "payment",
        accessorFn: (row) => row?.orderId?.paymentMethod,
        header: "Payment",
        size: 64,
      },
    //   {
    //   	id: 'status',
    //   	accessorFn: (row) => {
	// 		<>
			
	// 		<OrdersStatus name={row?.status[0]?.name} />
	// 		</>
	// 	},
    //   	accessorKey: 'status',
    //   	header: 'Status'
    //   },
      {
        accessorKey: "date",
        header: "Date",
      },
    ],
    []
  );

  if (shopOrderItemsIsLoading) {
    return <FuseLoading />;
  }


  // if (!shopOrderItems?.data?.MDbItemsInOrders) {
	// 	return (
	// 		<div className="flex flex-1 items-center justify-center h-full">
	// 			<Typography
	// 				color="text.secondary"
	// 				variant="h5"
	// 			>
	// 				There are no orders!
	// 			</Typography>
	// 		</div>
	// 	);
	// }

  if (!shopOrderItems?.data?.MDbItemsInOrders) {
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
					Error occured retrieving orders!
				</Typography>
			
			</motion.div>
		);
	}

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable
        initialState={{
          density: "spacious",
          showColumnFilters: false,
          showGlobalFilter: true,
          columnPinning: {
            left: ["mrt-row-expand", "mrt-row-select"],
            right: ["mrt-row-actions"],
          },
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
        }}
        // data={orders}
        data={shopOrderItems?.data?.MDbItemsInOrders}
        columns={columns}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            // onClick={() => {
            // 	removeOrders([row.original.id]);
            // 	closeMenu();
            // 	table.resetRowSelection();
            // }}
            component={Link}
            to={`/shoporders-list/orders/${row.original._id}`}
          >
            <ListItemIcon>
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </ListItemIcon>
            View more
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => {
          const { rowSelection } = table.getState();

          if (Object.keys(rowSelection).length === 0) {
            return null;
          }

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().rows;
                removeOrders(selectedRows.map((row) => row.original.id));
                table.resetRowSelection();
              }}
              className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
              color="secondary"
            >
              <FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
              <span className="hidden sm:flex mx-8">Delete selected items</span>
            </Button>
          );
        }}
      />
    </Paper>
  );
}

export default OrdersTable;
