import GlobalStyles from '@mui/material/GlobalStyles';
import ReservationsHeader from './ReservationsHeader';
import ReservationsTable from './ReservationsTable';

/**
 * The products page.
 */
function ReservationsOfBookedProperties() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full container flex flex-col">
				<ReservationsHeader />
				
				
				<ReservationsTable />
				
				
			</div>
		</>
	);
}


export default ReservationsOfBookedProperties;
