/* eslint-disable react/no-unstable-nested-components */
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import MerchantErrorPage from 'src/app/main/vendor-hotelsandapartments/MerchantErrorPage';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';

function RoomsTable(props) {

	const { rooms, roomsIsLoading, roomsIsError, toggleNewEntryDrawer, setRoomId } = props;

	const initiateUpdate = (roomId) => {
		// console.log("Room__ID", roomId)
		toggleNewEntryDrawer();
		setRoomId(roomId);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'title',
				header: 'Room Title',
				Cell: ({ row }) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.original?.title}
						/>
					</div>
				)
			},
			{
				accessorKey: 'roomNumber',
				header: 'Room Number',
				Cell: ({ row }) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.original?.roomNumber}
						/>
					</div>
				)
			},

			{
				accessorKey: 'priceTaxIncl',
				header: 'Price',
				accessorFn: (row) => `NGN ${formatCurrency(row?.price)}`
			},

			{
				accessorKey: 'id',
				header: 'Update Room',
				Cell: ({ row }) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							onClick={() => initiateUpdate(row.original.id)}
							className="text-11 cursor-pointer  bg-orange-300"
							size="small"
							color="default"
							label="Update room"
						/>
					</div>
				)
			}
		],
		[]
	);

	if (roomsIsLoading) {
		return <FuseLoading />;
	}

	if (roomsIsError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full w-full"
			>
				<MerchantErrorPage message=" Error occurred while retriving rooms" />
			</motion.div>
		);
	}

	if (!rooms) {
		return (
			<div className="flex flex-1 items-center justify-center h-full w-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no rooms currently!
				</Typography>
			</div>
		);
	}

	return (
		<Paper elevation={0}>
			<DataTable
				data={rooms}
				columns={columns}
			/>
		</Paper>
	);
}

export default RoomsTable;
