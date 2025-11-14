import GlobalStyles from '@mui/material/GlobalStyles';
import Box from '@mui/material/Box';
import PropertiesHeader from './PropertiesHeader';
import PropertiesTable from './PropertiesTable';

/**
 * The Properties page - Professional real estate listings management
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

			<Box
				className="w-full h-full flex flex-col"
				sx={{
					background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fef3e2 100%)',
					minHeight: '100vh'
				}}
			>
				<PropertiesHeader />
				<PropertiesTable />
			</Box>
		</>
	);
}

export default Properties;
