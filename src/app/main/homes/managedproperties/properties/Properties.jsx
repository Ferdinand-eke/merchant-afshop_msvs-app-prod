import GlobalStyles from '@mui/material/GlobalStyles';
import PropertiesHeader from './PropertiesHeader';
import PropertiesTable from './PropertiesTable';

/**
 * The products page.
 */
function Properties() {
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
				<PropertiesHeader />
				
				<PropertiesTable />
				
				
			</div>
		</>
	);
}


export default Properties;
