import GlobalStyles from '@mui/material/GlobalStyles';
import BookingPropertiesHeader from './BookingPropertiesHeader';
import BookingPropertiesTable from './BookingPropertiesTable';

/**
 * The products page.
 */
function BookingProperties() {
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
				<BookingPropertiesHeader />
				
				<BookingPropertiesTable />
				
				
			</div>
		</>
	);
}



export default BookingProperties;
