/* eslint-disable react/no-unstable-nested-components */
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import useMerchantFoodOrders from 'app/configs/data/server-calls/foodmartmenuitems/useMerchantFoodOrder';
import MerchantErrorPage from '../FoodMerchantErrorPage';
import { formatCurrency } from '../../vendors-shop/pos/PosUtils';
import FoodOrdersCreatedAndPaymentStatus from '../foodorder/FoodOrdersCreatedAndPaymentStatus';

function FoodOrdersTable() {
	const { data: foorOrders, isLoading: foorOrdersIsLoading, isError } = useMerchantFoodOrders();

	const columns = useMemo(
		() => [
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
			{
				id: 'isPaid',
				accessorFn: (row) => (
					<FoodOrdersCreatedAndPaymentStatus
						createdAt={row?.createdAt}
						isPaid={row?.isPaid}
					/>
				),
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
				<MerchantErrorPage message=" Error occurred while retriving food orders" />
			</motion.div>
		);
	}

	if (!foorOrders?.data?.data) {
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
				data={foorOrders?.data?.data}
				columns={columns}
			/>
		</Paper>
	);
}

export default FoodOrdersTable;
