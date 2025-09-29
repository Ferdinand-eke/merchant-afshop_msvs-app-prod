import GlobalStyles from '@mui/material/GlobalStyles';
import ServiceTypesHeader from './ServiceTypesHeader';
import ServiceTypesTable from './ServiceTypesTable';

/**
 * The ServiceTypes page.
 */
function ServiceTypes() {
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
				<ServiceTypesHeader />
				<ServiceTypesTable />
				
			</div>
		</>
	);
}

export default ServiceTypes;
