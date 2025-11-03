import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { Box, LinearProgress } from '@mui/material';

/**
 * The OverdueWidget widget - Displays products inventory
 */
function OverdueWidget({productsCount, isLoading}) {

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }


	// const count = merchantProducts?.length || 0;
	const activeProducts = productsCount;
	const lowStockItems = Math.floor(productsCount * 0.15); // Simulate 15% low stock

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800">
			<div className="flex items-center justify-between px-16 pt-16">
				<Box className="flex items-center gap-8">
					<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-orange-100 dark:bg-orange-900/30">
						<FuseSvgIcon className="text-orange-600 dark:text-orange-400" size={20}>
							heroicons-outline:shopping-bag
						</FuseSvgIcon>
					</Box>
					<Typography
						className="text-sm font-semibold tracking-tight"
						color="text.secondary"
					>
						Products Inventory
					</Typography>
				</Box>
				<IconButton aria-label="more" size="small">
					<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>

			<div className="text-center mt-16 px-16">
				<Typography className="text-5xl font-bold tracking-tight text-orange-600 dark:text-orange-400">
					{productsCount}
				</Typography>
				<Typography className="text-xs mt-4" color="text.secondary">
					Total products
				</Typography>
			</div>

			<Box className="px-16 mt-16 mb-16">
				<Box className="flex items-center justify-between mb-8">
					<Typography className="text-xs font-medium" color="text.secondary">
						Active Products
					</Typography>
					<Typography className="text-xs font-bold text-orange-600">
						{activeProducts}
					</Typography>
				</Box>
				<Box className="flex items-center justify-between mb-8">
					<Typography className="text-xs font-medium" color="text.secondary">
						Low Stock Alert
					</Typography>
					<Typography className="text-xs font-bold text-red-600">
						{lowStockItems} items
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}

export default memo(OverdueWidget);
