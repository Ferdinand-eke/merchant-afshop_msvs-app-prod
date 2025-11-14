import GlobalStyles from '@mui/material/GlobalStyles';
import FoodOrdersHeader from './FoodOrdersHeader';
import ReservationsTable from './FoodOrdersTable';

/**
 * The products page.
 */
function FoodOrdersPlaced() {
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
				<FoodOrdersHeader />

				<ReservationsTable />
			</div>
		</>
	);
}

export default FoodOrdersPlaced;
