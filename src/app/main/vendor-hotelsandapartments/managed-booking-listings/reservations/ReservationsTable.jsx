/* eslint-disable react/no-unstable-nested-components */
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import { Chip, Paper, Box } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Typography from '@mui/material/Typography';
import useMyPropertiesReservations from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';
import MerchantErrorPage from '../../MerchantErrorPage';
import ContentLoadingPlaceholder from 'app/shared-components/ContentLoadingPlaceholder';

function ReservationsTable() {
	// Prepare API params - NO SEARCH, only pagination
	const apiParams = useMemo(
		() => ({
			limit: 1000, // Fetch more records for client-side filtering
			offset: 0,
		}),
		[]
	);

	// Fetch data with params
	const {
		data: reservations,
		isLoading: reservationsIsLoading,
		isError,
	} = useMyPropertiesReservations(apiParams);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'reference',
				header: 'Booking Reference',
				Cell: ({ row }) => (
					<Box className="flex items-center gap-8">
						<FuseSvgIcon size={16} sx={{ color: '#ea580c' }}>
							heroicons-outline:ticket
						</FuseSvgIcon>
						<Chip
							className="text-11 font-semibold"
							size="small"
							label={row?.original?.paymentResult?.reference || 'N/A'}
							sx={{
								background: 'rgba(249, 115, 22, 0.1)',
								color: '#ea580c',
							}}
						/>
					</Box>
				),
			},
			{
				accessorKey: 'isPaid',
				header: 'Payment Status',
				size: 120,
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon size={14}>
								{row.original.isPaid
									? 'heroicons-solid:check-circle'
									: 'heroicons-solid:x-circle'}
							</FuseSvgIcon>
						}
						label={row.original.isPaid ? 'Paid' : 'Pending'}
						size="small"
						sx={{
							background: row.original.isPaid
								? 'rgba(34, 197, 94, 0.1)'
								: 'rgba(239, 68, 68, 0.1)',
							color: row.original.isPaid ? '#16a34a' : '#dc2626',
							fontWeight: 600,
						}}
					/>
				),
			},
			{
				accessorKey: 'startDate',
				header: 'Check In',
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon size={14}>
								{row?.original?.isCheckIn
									? 'heroicons-solid:check'
									: 'heroicons-outline:clock'}
							</FuseSvgIcon>
						}
						className="text-11 font-semibold"
						size="small"
						label={new Date(row?.original?.startDate)?.toDateString()}
						sx={{
							background: row?.original?.isCheckIn
								? 'rgba(34, 197, 94, 0.1)'
								: 'rgba(251, 191, 36, 0.15)',
							color: row?.original?.isCheckIn ? '#16a34a' : '#d97706',
						}}
					/>
				),
			},
			{
				accessorKey: 'endDate',
				header: 'Check Out',
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon size={14}>
								{row?.original?.isCheckOut
									? 'heroicons-solid:check'
									: 'heroicons-outline:calendar'}
							</FuseSvgIcon>
						}
						className="text-11 font-semibold"
						size="small"
						label={new Date(row?.original?.endDate)?.toDateString()}
						sx={{
							background: row?.original?.isCheckOut
								? 'rgba(34, 197, 94, 0.1)'
								: 'rgba(6, 182, 212, 0.15)',
							color: row?.original?.isCheckOut ? '#16a34a' : '#0891b2',
						}}
					/>
				),
			},
			{
				accessorKey: 'management',
				header: 'Actions',
				Cell: ({ row }) => (
					<Chip
						component={NavLinkAdapter}
						to={`/bookings/list-reservation/${row.original.id}/manage`}
						icon={<FuseSvgIcon size={14}>heroicons-outline:cog</FuseSvgIcon>}
						className="text-11 font-semibold cursor-pointer"
						size="small"
						label="Manage"
						clickable
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							color: 'white',
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
								boxShadow: '0 4px 8px rgba(234, 88, 12, 0.3)',
							},
						}}
					/>
				),
			},
		],
		[]
	);

	if (reservationsIsLoading) {
		return (
			<ContentLoadingPlaceholder
				title="Loading Reservations..."
				subtitle="Fetching your property bookings and reservations"
				cardCount={5}
			/>
		);
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<MerchantErrorPage message="Error occurred while retrieving reservations" />
			</motion.div>
		);
	}

	if (!reservations?.data?.reservations || reservations?.data?.reservations?.length === 0) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 6,
					textAlign: 'center',
					background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
					border: '1px solid rgba(234, 88, 12, 0.1)',
					borderRadius: 2,
				}}
			>
				<Box
					sx={{
						width: 120,
						height: 120,
						borderRadius: '50%',
						background: 'linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						margin: '0 auto',
						mb: 3,
					}}
				>
					<FuseSvgIcon size={48} sx={{ color: '#f97316' }}>
						heroicons-outline:calendar
					</FuseSvgIcon>
				</Box>
				<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524', mb: 1 }}>
					No Reservations Yet
				</Typography>
				<Typography variant="body2" color="text.secondary">
					You don't have any bookings or reservations at the moment
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-2xl overflow-hidden w-full h-full"
			elevation={0}
			sx={{
				border: '1px solid rgba(234, 88, 12, 0.1)',
			}}
		>
			<DataTable
				data={reservations?.data?.reservations || []}
				columns={columns}
				enablePagination
				enableGlobalFilter
				enableColumnFilters={false}
				enableSorting
				initialState={{
					density: 'comfortable',
					showColumnFilters: false,
					showGlobalFilter: true,
					pagination: {
						pageIndex: 0,
						pageSize: 20,
					},
				}}
				muiPaginationProps={{
					color: 'secondary',
					rowsPerPageOptions: [10, 20, 30, 50],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: true,
				}}
				muiSearchTextFieldProps={{
					placeholder: 'Search by booking reference...',
					sx: { minWidth: '350px' },
					variant: 'outlined',
					size: 'small',
					InputProps: {
						startAdornment: (
							<FuseSvgIcon size={20} className="mr-8">
								heroicons-outline:search
							</FuseSvgIcon>
						),
					},
				}}
				positionGlobalFilter="left"
				globalFilterFn="contains"
			/>
		</Paper>
	);
}

export default ReservationsTable;
