import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * The CurrentStatementWidget widget.
 */
function CurrentStatementWidget({ shopData, shopDataLoading, isError }) {
	// const [animate, setAnimate] = useState(false);
	// const dispatch = useAppDispatch();
	// const controls = useAnimation();

	// const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();

	if (shopDataLoading) {
		return <FuseLoading />;
	}

	// const widget = widgets?.currentStatement;

	if (!shopData) {
		return null;
	}

	console.log('ShopDATAAA', shopData);
	// const { status, date, limit, spent, minimum } = widget;

	// useEffect(() => {
	// 	if (animate) {
	// 		controls.start({
	// 			rotate: [0, 20, -20, 0],
	// 			color: [theme.palette.secondary.main],
	// 			transition: { duration: 0.2, repeat: 5 }
	// 		});
	// 	} else {
	// 		controls.start({ rotate: 0, scale: 1, color: theme.palette.text.secondary });
	// 	}
	// }, [animate, controls]);
	return (
		<Paper className="relative flex flex-col flex-auto p-24 pr-12 pb-12 rounded-2xl shadow overflow-hidden">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
						Current Statement
					</Typography>
					<Typography className="text-orange-600 font-medium text-sm">Merchant's Earnings </Typography>
					{/* {status === 'paid' && (
						<Typography className="text-green-600 font-medium text-sm">Paid on {date}</Typography>
					)}
					{status === 'pending' && (
						<Typography className="text-red-600 font-medium text-sm">Must be paid before {date}</Typography>
					)} */}
				</div>
				{/* <div className="-mt-8">
					<IconButton
						aria-label="more"
						size="large"
					>
						<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
					</IconButton>
				</div> */}
			</div>
			<div className="flex flex-row flex-wrap mt-16 -mx-24">
				<div className="flex flex-col mx-24 my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Shop Merchant
					</Typography>
					<Typography className="mt-8 font-medium text-3xl leading-none">
						{shopData?.shopaccount?.accountbalance.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
				</div>
				{/* <div className="flex flex-col mx-24 my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Logistics Merchant 
					</Typography>
					<Typography className="mt-8 font-medium text-3xl leading-none">
						{shopData?.logisticsAccount?.accountbalance.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
				</div> */}
				{/* <div className="flex flex-col mx-24 my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Estate Merchant
					</Typography>
					<Typography className="mt-8 font-medium text-3xl leading-none">
						{shopData?.realEstateAccount?.accountbalance.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
				</div> */}

				{/* <div className="flex flex-col mx-24 my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Food Producers/Farmers
					</Typography>
					<Typography className="mt-8 font-medium text-3xl leading-none">
						{shopData?.realEstateAccount?.accountbalance.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
				</div> */}
			</div>

			<div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24">
				<FuseSvgIcon
					size={96}
					className="opacity-25 text-green-500 dark:text-green-400"
				>
					heroicons-outline:check-circle
				</FuseSvgIcon>
				{/* {status === 'paid' && (
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				)} */}

				{/* {status === 'pending' && (
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-red-500 dark:text-red-400"
					>
						heroicons-outline:exclamation-circle
					</FuseSvgIcon>
				)} */}
			</div>
		</Paper>
	);
}

export default memo(CurrentStatementWidget);
