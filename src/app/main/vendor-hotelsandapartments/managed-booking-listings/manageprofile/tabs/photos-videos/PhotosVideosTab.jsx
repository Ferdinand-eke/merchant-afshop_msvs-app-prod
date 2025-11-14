import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useFetchReservationsOnProperty } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';
import { Chip, Paper, Box } from '@mui/material';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import MerchantErrorPage from 'src/app/main/vendor-hotelsandapartments/MerchantErrorPage';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

/**
 * The reservations tab (formerly photos-videos tab).
 */
function PhotosVideosTab(props) {
	const { Listing } = props;

	const {
		data: reservationsOnProperty,
		isLoading: reservationsIsLoading,
		isError: reservationsIsError
	} = useFetchReservationsOnProperty(Listing?.id);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'reference',
				header: 'Booking Reference',
				Cell: ({ row }) => (
					<Box className="flex items-center gap-8">
						<FuseSvgIcon
							size={16}
							sx={{ color: '#ea580c' }}
						>
							heroicons-outline:ticket
						</FuseSvgIcon>
						<Chip
							className="text-11 font-semibold"
							size="small"
							label={row?.original?.paymentResult?.reference || 'N/A'}
							sx={{
								background: 'rgba(249, 115, 22, 0.1)',
								color: '#ea580c'
							}}
						/>
					</Box>
				)
			},
			{
				accessorKey: 'isPaid',
				header: 'Payment Status',
				size: 120,
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon size={14}>
								{row.original.isPaid ? 'heroicons-solid:check-circle' : 'heroicons-solid:x-circle'}
							</FuseSvgIcon>
						}
						label={row.original.isPaid ? 'Paid' : 'Pending'}
						size="small"
						sx={{
							background: row.original.isPaid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
							color: row.original.isPaid ? '#16a34a' : '#dc2626',
							fontWeight: 600
						}}
					/>
				)
			},
			{
				accessorKey: 'startDate',
				header: 'Check In',
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon size={14}>
								{row?.original?.isCheckIn ? 'heroicons-solid:check' : 'heroicons-outline:clock'}
							</FuseSvgIcon>
						}
						className="text-11 font-semibold"
						size="small"
						label={new Date(row?.original?.startDate)?.toDateString()}
						sx={{
							background: row?.original?.isCheckIn
								? 'rgba(34, 197, 94, 0.1)'
								: 'rgba(251, 191, 36, 0.15)',
							color: row?.original?.isCheckIn ? '#16a34a' : '#d97706'
						}}
					/>
				)
			},
			{
				accessorKey: 'endDate',
				header: 'Check Out',
				Cell: ({ row }) => (
					<Chip
						icon={
							<FuseSvgIcon size={14}>
								{row?.original?.isCheckOut ? 'heroicons-solid:check' : 'heroicons-outline:calendar'}
							</FuseSvgIcon>
						}
						className="text-11 font-semibold"
						size="small"
						label={new Date(row?.original?.endDate)?.toDateString()}
						sx={{
							background: row?.original?.isCheckOut
								? 'rgba(34, 197, 94, 0.1)'
								: 'rgba(6, 182, 212, 0.15)',
							color: row?.original?.isCheckOut ? '#16a34a' : '#0891b2'
						}}
					/>
				)
			},
			{
				accessorKey: 'management',
				header: 'Actions',
				Cell: ({ row }) => (
					<Chip
						component={NavLinkAdapter}
						to={`/bookings/${row.original.id}/handle-arrival`}
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
								boxShadow: '0 4px 8px rgba(234, 88, 12, 0.3)'
							}
						}}
					/>
				)
			}
		],
		[]
	);

	if (reservationsIsLoading) {
		return <FuseLoading />;
	}

	if (reservationsIsError) {
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

	if (!reservationsOnProperty?.data?.reservations || reservationsOnProperty?.data?.reservations?.length === 0) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 6,
					textAlign: 'center',
					background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
					border: '1px solid rgba(234, 88, 12, 0.1)',
					borderRadius: 2
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
						mb: 3
					}}
				>
					<FuseSvgIcon
						size={48}
						sx={{ color: '#f97316' }}
					>
						heroicons-outline:calendar
					</FuseSvgIcon>
				</Box>
				<Typography
					variant="h6"
					sx={{ fontWeight: 700, color: '#292524', mb: 1 }}
				>
					No Reservations Yet
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					There are no reservations for this property currently
				</Typography>
			</Paper>
		);
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const reservationCount = reservationsOnProperty?.data?.reservations?.length || 0;

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			{/* Header Section */}
			<Paper
				elevation={0}
				sx={{
					p: 3,
					mb: 3,
					background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
					border: '1px solid rgba(234, 88, 12, 0.1)',
					borderRadius: 2
				}}
			>
				<Box className="flex items-center gap-16">
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: '12px',
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<FuseSvgIcon
							className="text-white"
							size={24}
						>
							heroicons-outline:calendar
						</FuseSvgIcon>
					</Box>
					<Box>
						<Typography
							variant="h6"
							sx={{ fontWeight: 700, color: '#292524', mb: 0.5 }}
						>
							Reservations on <span style={{ color: '#ea580c' }}>{Listing?.title}</span>
						</Typography>
						<Box className="flex items-center gap-8">
							<Chip
								label={`${reservationCount} ${reservationCount === 1 ? 'Reservation' : 'Reservations'}`}
								size="small"
								sx={{
									background: 'rgba(249, 115, 22, 0.1)',
									color: '#ea580c',
									fontWeight: 600,
									height: 24
								}}
							/>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Manage bookings and guest arrivals
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>

			{/* Reservations Table */}
			<Paper
				className="flex flex-col flex-auto shadow-3 rounded-2xl overflow-hidden w-full"
				elevation={0}
				sx={{
					border: '1px solid rgba(234, 88, 12, 0.1)'
				}}
			>
				<DataTable
					data={reservationsOnProperty?.data?.reservations}
					columns={columns}
				/>
			</Paper>
		</motion.div>
	);
}

export default PhotosVideosTab;
