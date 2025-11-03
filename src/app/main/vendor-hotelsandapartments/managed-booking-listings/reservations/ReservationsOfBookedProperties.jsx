import { Box } from '@mui/material';
import ReservationsHeader from './ReservationsHeader';
import ReservationsTable from './ReservationsTable';

/**
 * The reservations page.
 */
function ReservationsOfBookedProperties() {
	return (
		<Box
			sx={{
				background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fef3e2 100%)',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			{/* Fixed Header */}
			<ReservationsHeader />

			{/* Scrollable Table Container */}
			<Box
				className="flex-1 px-24 pb-24"
				sx={{
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<ReservationsTable />
			</Box>
		</Box>
	);
}

export default ReservationsOfBookedProperties;
