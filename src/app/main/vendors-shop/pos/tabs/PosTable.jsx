/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState } from 'react';
import {motion} from "framer-motion"
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
// import { useDeleteECommerceProductsMutation, useGetECommerceProductsQuery } from '../ECommerceApi';
import useMyShopProducts from 'app/configs/data/server-calls/products/useShopProducts';
import useEcomerce from '../UsePos';

function PosTable() {

	const { data: myshop_products, isLoading: shopProductdIsLoading, isError } =
    useMyShopProducts();

    const { addItem, cartItems, removeItem } = useEcomerce();
    const [qty, setQty] = useState(1);
  
    const addItemToInvoice = (cartItem) => {
        console.log("AddClicked", cartItem)

        // return
      addItem(
        {
          id: cartItem._id,
          quantity: 1,
          // quantity : +qty,
          price: cartItem.price,
          name: cartItem.name,
          image: cartItem.images[0]?.url,
        },
        cartItems,
        'cart'
      );
    };
	
	// const { data: products, isLoading } = useGetECommerceProductsQuery();
	// const [removeProducts] = useDeleteECommerceProductsMutation();
	// const columns = useMemo(
	// 	() => [
	// 		{
	// 			accessorFn: (row) => row.featuredImageId,
	// 			id: 'featuredImageId',
	// 			header: '',
	// 			enableColumnFilter: false,
	// 			enableColumnDragging: false,
	// 			size: 64,
	// 			enableSorting: false,
	// 			Cell: ({ row }) => (
	// 				<div className="flex items-center justify-center">
	// 					{row.original?.images?.length > 0 && row.original.featuredImageId ? (
	// 						<img
	// 							className="w-full max-h-40 max-w-40 block rounded"
	// 							src={_.find(row.original.images, { id: row.original.featuredImageId })?.url}
	// 							alt={row.original.name}
	// 						/>
	// 					) : (
	// 						<img
	// 							className="w-full max-h-40 max-w-40 block rounded"
	// 							src="assets/images/apps/ecommerce/product-image-placeholder.png"
	// 							alt={row.original.name}
	// 						/>
	// 					)}
	// 				</div>
	// 			)
	// 		},
	// 		{
	// 			accessorKey: 'name',
	// 			header: 'Name',
	// 			Cell: ({ row }) => (
	// 				<Typography
	// 					component={Link}
	// 					to={`/apps/e-commerce/products/${row.original.id}/${row.original.handle}`}
	// 					className="underline"
	// 					color="secondary"
	// 					role="button"
	// 				>
	// 					{row.original.name}
	// 				</Typography>
	// 			)
	// 		},
	// 		{
	// 			accessorKey: 'categories',
	// 			header: 'Category',
	// 			accessorFn: (row) => (
	// 				<div className="flex flex-wrap space-x-2">
	// 					{row.categories.map((item) => (
	// 						<Chip
	// 							key={item}
	// 							className="text-11"
	// 							size="small"
	// 							color="default"
	// 							label={item}
	// 						/>
	// 					))}
	// 				</div>
	// 			)
	// 		},
	// 		{
	// 			accessorKey: 'priceTaxIncl',
	// 			header: 'Price',
	// 			accessorFn: (row) => `$${row.priceTaxIncl}`
	// 		},
	// 		{
	// 			accessorKey: 'quantity',
	// 			header: 'Quantity',
	// 			accessorFn: (row) => (
	// 				<div className="flex items-center space-x-8">
	// 					<span>{row.quantity}</span>
	// 					<i
	// 						className={clsx(
	// 							'inline-block w-8 h-8 rounded',
	// 							row.quantity <= 5 && 'bg-red',
	// 							row.quantity > 5 && row.quantity <= 25 && 'bg-orange',
	// 							row.quantity > 25 && 'bg-green'
	// 						)}
	// 					/>
	// 				</div>
	// 			)
	// 		},
	// 		{
	// 			accessorKey: 'active',
	// 			header: 'Active',
	// 			accessorFn: (row) => (
	// 				<div className="flex items-center">
	// 					{row.active ? (
	// 						<FuseSvgIcon
	// 							className="text-green"
	// 							size={20}
	// 						>
	// 							heroicons-outline:check-circle
	// 						</FuseSvgIcon>
	// 					) : (
	// 						<FuseSvgIcon
	// 							className="text-red"
	// 							size={20}
	// 						>
	// 							heroicons-outline:minus-circle
	// 						</FuseSvgIcon>
	// 					)}
	// 				</div>
	// 			)
	// 		}
	// 	],
	// 	[]
	// );

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
			header: "Action",
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
        <div className="w-full max-w-3xl">
		 {/* <Paper
		 	className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
		 	elevation={0}
		 > */}

      
			<DataTable
				data={myshop_products?.data?.data}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {;
							closeMenu();
							table.resetRowSelection();
						}}
					>
						 <ListItemIcon
                         onClick={()=> addItemToInvoice(row?.original) }
                         >
						 	<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
                             Add To Invoice
						 </ListItemIcon>
						
					 </MenuItem>
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
          
		{/* </Paper> */}
        </div>
	);
}

export default PosTable;

