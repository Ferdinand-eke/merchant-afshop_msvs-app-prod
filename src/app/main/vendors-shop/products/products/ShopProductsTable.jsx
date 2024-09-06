/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from "react";
import {motion} from "framer-motion"
import DataTable from "app/shared-components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Chip, ListItemIcon, MenuItem, Paper } from "@mui/material";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import Button from "@mui/material/Button";
import {
  useDeleteECommerceProductsMutation,
  useGetECommerceProductsQuery,
} from "../ECommerceApi";
import useMyShopProducts from "app/configs/data/server-calls/products/useShopProducts";

function ShopProductsTable() {
  const { data: myshop_products, isLoading: shopProductdIsLoading, isError } =
    useMyShopProducts();

  // console.log("MyShop-Products:", myshop_products?.data?.data);

  // const { data: products, isLoading } = useGetECommerceProductsQuery();
  const [removeProducts] = useDeleteECommerceProductsMutation();
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.featuredImageId,
        id: "featuredImageId",
        header: "",
        enableColumnFilter: false,
        enableColumnDragging: false,
        size: 64,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            {/* {row?.original?.images?.length > 0 && row?.original?.featuredImageId ? (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src={_.find(row?.original.images, { id: row?.original?.featuredImageId })?.url}
								alt={row?.original?.name}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.name}
							/>
						)} */}

            {row?.original?.images?.length ? (
              <img
                className="w-full max-h-40 max-w-40 block rounded"
                src={row?.original.images[0]?.url}
                alt={row?.original?.name}
              />
            ) : (
              <img
                className="w-full max-h-40 max-w-40 block rounded"
                src="assets/images/apps/ecommerce/product-image-placeholder.png"
                alt={row.original.name}
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Typography
            component={Link}
            to={`/shopproducts-list/products/${row?.original?.slug}/${row?.original?.slug}`}
            className="underline"
            color="secondary"
            role="button"
          >
            {row?.original?.name}
          </Typography>
        ),
      },
      
      {
        accessorKey: "quantity",
        header: "Quantity",
        accessorFn: (row) => (
          <div className="flex items-center space-x-8">
            <span>{row?.quantityInStock}</span>
            <i
              className={clsx(
                "inline-block w-8 h-8 rounded",
                row.quantityInStock <= 5 && "bg-red",
                row.quantityInStock > 5 &&
                  row.quantityInStock <= 25 &&
                  "bg-orange",
                row.quantityInStock > 25 && "bg-green"
              )}
            />
          </div>
        ),
      },

      {
        accessorKey: "price",
        header: "Price",
        // accessorFn: (row) => `$${row?.priceTaxIncl}`
        accessorFn: (row) => {
          // console.log("row-DATA", row?.price)
          return `NGN ${row?.price}`;
        },
      },
      // {
      // 	accessorKey: 'active',
      // 	header: 'Active',
      // 	accessorFn: (row) => (
      // 		<div className="flex items-center">
      // 			{row.active ? (
      // 				<FuseSvgIcon
      // 					className="text-green"
      // 					size={20}
      // 				>
      // 					heroicons-outline:check-circle
      // 				</FuseSvgIcon>
      // 			) : (
      // 				<FuseSvgIcon
      // 					className="text-red"
      // 					size={20}
      // 				>
      // 					heroicons-outline:minus-circle
      // 				</FuseSvgIcon>
      // 			)}
      // 		</div>
      // 	)
      // }

      {
        accessorKey: "active",
        header: "Active",
        accessorFn: (row) => (
          <div className="flex items-center">
            {!row?.isBlocked || !row?.isSuspended ? (
              <FuseSvgIcon className="text-green" size={20}>
                heroicons-outline:check-circle
              </FuseSvgIcon>
            ) : (
              <FuseSvgIcon className="text-red" size={20}>
                heroicons-outline:minus-circle
              </FuseSvgIcon>
            )}
          </div>
        ),
      },
    ],
    []
  );

  
  if (shopProductdIsLoading) {
    return <FuseLoading />;
  }

  if (isError ) {
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
				Nework Error While Retrieving products!
				</Typography>
			
			</motion.div>
		);
	}

// console.log("STATES=DATA", states?.data?.data)
if (!myshop_products?.data?.data) {
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
				No products found!
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
        // data={products}
        data={myshop_products?.data?.data}
        columns={columns}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            onClick={() => {
              removeProducts([row.original.id]);
              closeMenu();
              table.resetRowSelection();
            }}
          >
            <ListItemIcon>
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </ListItemIcon>
            Delete
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
                removeProducts(selectedRows.map((row) => row.original.id));
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

export default ShopProductsTable;
