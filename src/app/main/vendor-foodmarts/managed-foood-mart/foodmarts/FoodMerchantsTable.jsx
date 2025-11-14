/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
// import clsx from 'clsx';
// import Button from '@mui/material/Button';
import useMyShopFoodMarts from 'app/configs/data/server-calls/foodmart/useShopFoodMarts';

function FoodMerchantsTable() {
	const { data: foodMartData, isLoading: foodMartIsLoading } = useMyShopFoodMarts();

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.featuredImageId,
				id: 'featuredImageId',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original?.imageSrcs?.length > 0 ? (
							<img
								className="w-full max-h-60 max-w-40 block rounded"
								src={row.original?.imageSrcs[0]?.url}
								alt={row.original.title}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.title}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/foodmarts/managed-foodmerchants/${row.original.slug}/${row.original.title}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.title}
					</Typography>
				)
			},

			{
				accessorKey: 'foodMartCategory',
				header: 'Category',
				accessorFn: (row) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.foodMartCategory}
						/>
					</div>
				)
			},
			//   {
			//     accessorKey: "active",
			//     header: "Active",
			//     accessorFn: (row) => (
			//       <div className="flex items-center">
			//         {row.isApproved ? (
			//           <FuseSvgIcon className="text-green" size={20}>
			//             heroicons-outline:check-circle
			//           </FuseSvgIcon>
			//         ) : (
			//           <FuseSvgIcon className="text-red" size={20}>
			//             heroicons-outline:minus-circle
			//           </FuseSvgIcon>
			//         )}
			//       </div>
			//     ),
			//   },

			{
				accessorKey: 'busniessOpenPeriod',
				header: 'Open From',
				accessorFn: (row) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.busniessOpenPeriod}
						/>
					</div>
				)
			},
			{
				accessorKey: 'busniessClosePeriod',
				header: 'Close By',
				accessorFn: (row) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.busniessClosePeriod}
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
							to={`/foodmarts/management-portal/${row.original.slug}/manage`}
							className="text-11 cursor-pointer"
							size="small"
							color="default"
							label="Manage this food mart listing"
						/>
					</div>
				)
			}
		],
		[]
	);

	if (foodMartIsLoading) {
		return <FuseLoading />;
	}

	if (!foodMartData?.data?.foodmarts) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no food marts listed on this account!
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
				data={foodMartData?.data?.foodmarts}
				columns={columns}
			/>
		</Paper>
	);
}

export default FoodMerchantsTable;
