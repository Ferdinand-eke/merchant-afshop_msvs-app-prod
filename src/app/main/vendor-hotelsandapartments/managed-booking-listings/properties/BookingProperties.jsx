import Box from '@mui/material/Box';
import BookingPropertiesHeader from './BookingPropertiesHeader';
import BookingPropertiesTable from './BookingPropertiesTable';

/**
 * The BookingProperties page - Professional accommodation listings management
 */
function BookingProperties() {
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
			<BookingPropertiesHeader />

			{/* Scrollable Table Container */}
			<Box
				className="flex-1"
				sx={{
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<BookingPropertiesTable />
			</Box>
		</Box>
	);
}

export default BookingProperties;
