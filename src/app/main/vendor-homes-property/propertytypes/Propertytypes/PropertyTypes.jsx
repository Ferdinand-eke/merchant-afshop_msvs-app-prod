import GlobalStyles from '@mui/material/GlobalStyles';
import PropertyTypesHeader from './PropertyTypesHeader';
import PropertyTypesTable from './PropertyTypesTable';

/**
 * The PropertyTypes page.
 */
function PropertyTypes() {
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
				<PropertyTypesHeader />
				<PropertyTypesTable />
				
			</div>
		</>
	);
}

export default PropertyTypes;
