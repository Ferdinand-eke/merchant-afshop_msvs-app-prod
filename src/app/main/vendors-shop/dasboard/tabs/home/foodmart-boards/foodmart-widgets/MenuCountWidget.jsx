import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAuthMerchantMenus } from 'app/configs/data/server-calls/foodmartmenuitems/useShopFoodMartMenu';
import { Box } from '@mui/material';

/**
 * The MenuCountWidget widget - Displays food menu items count
 */
function MenuCountWidget() {
	const {data:merchantOwnedMenu, isLoading} = useAuthMerchantMenus();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!merchantOwnedMenu?.data?.data) {
		return null;
	}

	const count = merchantOwnedMenu?.data?.data?.length || 0;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800">
			<div className="flex items-center justify-between px-16 pt-16">
				<Box className="flex items-center gap-8">
					<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-orange-100 dark:bg-orange-900/30">
						<FuseSvgIcon className="text-orange-600 dark:text-orange-400" size={20}>
							heroicons-outline:clipboard-list
						</FuseSvgIcon>
					</Box>
					<Typography
						className="text-sm font-semibold tracking-tight"
						color="text.secondary"
					>
						Food Menu
					</Typography>
				</Box>
				<IconButton aria-label="more" size="small">
					<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>

			<div className="text-center mt-16 px-16">
				<Typography className="text-5xl font-bold tracking-tight text-orange-600 dark:text-orange-400">
					{count}
				</Typography>
				<Typography className="text-xs mt-4" color="text.secondary">
					Menu items
				</Typography>
			</div>

			<Box className="px-16 mt-16 mb-16">
				<Box className="flex items-center justify-between mb-8">
					<Typography className="text-xs font-medium" color="text.secondary">
						Active Items
					</Typography>
					<Typography className="text-xs font-bold text-orange-600">
						{count}
					</Typography>
				</Box>
				<Box className="flex items-center justify-between">
					<Typography className="text-xs font-medium" color="text.secondary">
						Categories
					</Typography>
					<Typography className="text-xs font-bold text-orange-600">
						{Math.min(count, 12)}
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}

export default memo(MenuCountWidget);
