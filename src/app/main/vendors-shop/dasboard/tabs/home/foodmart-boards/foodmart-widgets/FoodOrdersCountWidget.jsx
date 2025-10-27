import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import useMerchantFoodOrders from 'app/configs/data/server-calls/foodmartmenuitems/useMerchantFoodOrder';
import { Box, LinearProgress } from '@mui/material';

/**
 * The FoodOrdersCountWidget widget - Displays active food orders
 */

function FoodOrdersCountWidget() {

	const {
		data: foodOrders,
		isLoading: foodOrdersIsLoading,
	} = useMerchantFoodOrders();

	if (foodOrdersIsLoading) {
		return <FuseLoading />;
	}

	if (!foodOrders?.data?.data) {
		return null;
	}

	const count = foodOrders?.data?.data?.length || 0;
	const deliveryRate = count > 0 ? 92 : 0;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800">
			<div className="flex items-center justify-between px-16 pt-16">
				<Box className="flex items-center gap-8">
					<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-blue-100 dark:bg-blue-900/30">
						<FuseSvgIcon className="text-blue-600 dark:text-blue-400" size={20}>
							heroicons-outline:shopping-cart
						</FuseSvgIcon>
					</Box>
					<Typography
						className="text-sm font-semibold tracking-tight"
						color="text.secondary"
					>
						Active Orders
					</Typography>
				</Box>
				<IconButton aria-label="more" size="small">
					<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>

			<div className="text-center mt-16 px-16">
				<Typography className="text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
					{count}
				</Typography>
				<Typography className="text-xs mt-4" color="text.secondary">
					Pending food orders
				</Typography>
			</div>

			<Box className="px-16 mt-16 mb-16">
				<Box className="flex items-center justify-between mb-8">
					<Typography className="text-xs font-medium" color="text.secondary">
						Delivery Success Rate
					</Typography>
					<Typography className="text-xs font-bold text-blue-600">
						{deliveryRate}%
					</Typography>
				</Box>
				<LinearProgress
					variant="determinate"
					value={deliveryRate}
					className="h-6 rounded-full"
					sx={{
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						'& .MuiLinearProgress-bar': {
							backgroundColor: '#3b82f6',
							borderRadius: '9999px'
						}
					}}
				/>
			</Box>
		</Paper>
	);
}

export default memo(FoodOrdersCountWidget);
