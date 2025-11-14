import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
import { Box, Chip } from '@mui/material';

/**
 * The SummaryWidget widget - Displays merchant earnings with clear visual hierarchy
 */

function SummaryWidget({ shopData, isLoading }) {
	console.log('SummaryWidget shopData', shopData);

	if (isLoading) {
		return <FuseLoading />;
	}

	// if (!shopData) {
	// 	return null;
	// }

	const balance = shopData?.shopaccount?.accountbalance || 0;

	return (
		<Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800">
			<div className="flex items-center justify-between px-16 pt-16">
				<Box className="flex items-center gap-8">
					<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-green-100 dark:bg-green-900/30">
						<FuseSvgIcon
							className="text-green-600 dark:text-green-400"
							size={20}
						>
							heroicons-outline:currency-dollar
						</FuseSvgIcon>
					</Box>
					<Typography
						className="text-sm font-semibold tracking-tight"
						color="text.secondary"
					>
						Total Earnings
					</Typography>
				</Box>
				<IconButton
					aria-label="more"
					size="small"
				>
					<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>

			<div className="text-center mt-16 px-16">
				<Typography className="text-4xl font-bold tracking-tight text-green-600 dark:text-green-400">
					₦{formatCurrency(balance)}
				</Typography>
				<Typography
					className="text-xs mt-4"
					color="text.secondary"
				>
					Available Balance
				</Typography>
			</div>

			<Box className="flex flex-col gap-8 px-16 mt-16 mb-16">
				<Button
					variant="contained"
					color="success"
					size="small"
					startIcon={<FuseSvgIcon size={16}>heroicons-outline:cash</FuseSvgIcon>}
					className="rounded-lg"
				>
					Withdraw to Wallet
				</Button>
				<Box className="flex items-center justify-center gap-8">
					<Chip
						label="Active"
						size="small"
						color="success"
						variant="outlined"
						className="text-xs"
					/>
					<Typography
						className="text-xs"
						color="text.secondary"
					>
						Last updated: Today
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}

export default memo(SummaryWidget);
