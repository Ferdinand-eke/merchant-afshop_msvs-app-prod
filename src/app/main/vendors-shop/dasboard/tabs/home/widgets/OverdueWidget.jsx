import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The OverdueWidget widget.
 */
function OverdueWidget({merchantProducts, isLoading,}) {
	// const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();
	// const widget = widgets?.overdue;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!merchantProducts) {
		return null;
	}

	// const { data, title } = widget;
	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-8 pt-12">
				<Typography
					className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
					color="text.secondary"
				>
					Prodcuts
				</Typography>
				<IconButton
					aria-label="more"
					size="large"
				>
					<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
				</IconButton>
			</div>
			<div className="text-center mt-8">
				<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-red-500">
					{/* {String(data.count)} */}
					{/* {merchantProducts?.length} */}
				</Typography>
				<Typography className="text-lg font-medium text-red-600">
					{/* {data.name} */}
					{merchantProducts?.length}
					</Typography>
			</div>
			<Typography
				className="flex items-baseline justify-center w-full mt-20 mb-24"
				color="text.secondary"
			>
				<span className="truncate">Products Count</span>:<b className="px-8">
					{/* {String(data.extra.count)} */}
					{merchantProducts?.length}
					</b>
			</Typography>
		</Paper>
	);
}

export default memo(OverdueWidget);
