import GlobalStyles from '@mui/material/GlobalStyles';
import FoodMerchantsHeader from './FoodMerchantsHeader';
import FoodMerchantsTable from './FoodMerchantsTable';

/**
 * The products page.
 */

function FoodMerchants() {
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
				<FoodMerchantsHeader />

				<FoodMerchantsTable />
			</div>
		</>
	);
}

export default FoodMerchants;
