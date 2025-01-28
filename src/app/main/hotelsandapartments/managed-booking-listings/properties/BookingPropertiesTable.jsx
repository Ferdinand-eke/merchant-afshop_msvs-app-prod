/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
// import useMyShopEstateProperties from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
import useMyShopBookingsProperties from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';

function BookingPropertiesTable() {
	

	const {data:listingData, isLoading:listingIsLoading, isError} = useMyShopBookingsProperties()

	

	const columns = useMemo(
		() => [
			// {
			// 	accessorFn: (row) => row.featuredImageId,
			// 	id: 'featuredImageId',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	size: 64,
			// 	enableSorting: false,
			// 	Cell: ({ row }) => (
			// 		<div className="flex items-center justify-center">
			// 			{row.original?.images?.length > 0 && row.original.featuredImageId ? (
			// 				<img
			// 					className="w-full max-h-40 max-w-40 block rounded"
			// 					src={_.find(row.original.images, { id: row.original.featuredImageId })?.url}
			// 					alt={row.original.name}
			// 				/>
			// 			) : (
			// 				<img
			// 					className="w-full max-h-40 max-w-40 block rounded"
			// 					src="assets/images/apps/ecommerce/product-image-placeholder.png"
			// 					alt={row.original.name}
			// 				/>
			// 			)}
			// 		</div>
			// 	)
			// },
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/bookings/managed-listings/${row.original.slug}/${row.original.title}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.title}
					</Typography>
				)
			},
			
			{
				accessorKey: 'categories',
				header: 'Category',
				accessorFn: (row) => (
					<div className="flex flex-wrap space-x-2">
					
						 <Chip
								className="text-11"
								size="small"
								color="default"
								label={row?.category}
							/>
					</div>
				)
			},
			{
				accessorKey: 'management',
				header: 'Management Console',
				Cell: ({ row }) => (
					<div className="flex flex-wrap space-x-2">
					
						 <Chip
								component={Link}
						to={`/bookings/managed-listings/${row.original._id}/manage`}
								className="text-11 cursor-pointer"
								size="small"
								color="default"
								label="Manage this listing"
							/>
					</div>
				)

			},
			{
				accessorKey: 'priceTaxIncl',
				header: 'Price',
				accessorFn: (row) => `NGN ${row?.price}`
			},
			{
				accessorKey: 'quantity',
				header: 'Room Count',
				accessorFn: (row) => (
					<div className="flex items-center space-x-8">
						<span>{row?.roomCount} rooms</span>
				
					</div>
				)
			},
			{
				accessorKey: 'active',
				header: 'Active',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.isApproved ? (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			},

			
		],
		[]
	);

	if (listingIsLoading) {
		return <FuseLoading />;
	}
	

	if (!listingData?.data?.data) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
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
			<DataTable
				data={listingData?.data?.data}
				columns={columns}
			
			/>
		</Paper>
	);
}

export default BookingPropertiesTable;
