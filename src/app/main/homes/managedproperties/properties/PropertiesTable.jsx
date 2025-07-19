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
import { useDeleteECommerceProductsMutation, useGetECommerceProductsQuery } from '../ECommerceApi';
import useGetAllListings from 'src/app/aaqueryhooks/listingssHandlingQuery';
import useMyShopEstateProperties from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';

function PropertiesTable() {
	
	// const { data: products, isLoading } = useGetECommerceProductsQuery();
	// const [removeProducts] = useDeleteECommerceProductsMutation();

	const {data:listingData, isLoading:listingIsLoading} = useMyShopEstateProperties()

	// console.log("The listing data is here: ", listingData?.data);

	


	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/property/managed-listings/${row.original.slug}/${row.original.title}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.title}
					</Typography>
				)
			},
			
			// {
			// 	accessorKey: 'categories',
			// 	header: 'Category',
			// 	accessorFn: (row) => (
			// 		<div className="flex flex-wrap space-x-2">
						
			// 			 <Chip
			// 					className="text-11"
			// 					size="small"
			// 					color="default"
			// 					label={row?.category}
			// 				/>
			// 		</div>
			// 	)
			// },
			{
				accessorKey: 'priceTaxIncl',
				header: 'Price',
				accessorFn: (row) => `N${formatCurrency(row?.price)}`
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

			{
				accessorKey: 'management',
				header: 'Management Console',
				Cell: ({ row }) => (
					<div className="flex flex-wrap space-x-2">
					
						 <Chip
								component={Link}
						to={`/property/managed-listings/${row.original.id}/manage`}
								className="text-11 cursor-pointer"
								size="small"
								color="default"
								label="Manage this listing"
							/>
					</div>
				)

			},
		],
		[]
	);

	if (listingIsLoading) {
		return <FuseLoading />;
	}
	

	if (!listingData?.data?.properties) {
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
				data={listingData?.data?.properties}
				columns={columns}
				
			/>
		</Paper>
	);
}

export default PropertiesTable;
