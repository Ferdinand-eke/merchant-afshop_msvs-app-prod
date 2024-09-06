import GlobalStyles from '@mui/material/GlobalStyles';
import ShopProductsHeader from './ShopProductsHeader';
import ShopProductsTable from './ShopProductsTable';

/**
 * The products page.
 */
function ShopProducts() {
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
				<ShopProductsHeader />
				<ShopProductsTable />
				
			</div>
		</>
	);
}

export default ShopProducts;
