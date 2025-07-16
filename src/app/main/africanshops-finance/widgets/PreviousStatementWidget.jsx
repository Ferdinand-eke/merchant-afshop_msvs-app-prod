import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetFinanceDashboardWidgetsQuery } from '../FinanceDashboardApi';

/**
 * The PreviousStatementWidget widget.
 */
function PreviousStatementWidget({account, accountLoading, accounError}) {

	if (accountLoading) {
		return <FuseLoading />;
	}

	

	if (!account) {
		// return null;
		return <AccountComingSoon />
	}

	return (
		<Paper className="relative flex flex-col flex-auto p-24 pr-12 pb-12 rounded-2xl shadow overflow-hidden">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
						{account?.afshopAccountName} Statement
					</Typography>
					<Typography className="text-green-600 font-medium text-sm">Your account {`${account?.afshopAccountNumber}`} has balance </Typography>
				
				</div>
				<div className="-mt-8">
					<IconButton
						aria-label="more"
						size="large"
					>
						<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex flex-row flex-wrap mt-16 -mx-24">
				<div className="flex flex-col mx-24 my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Account Balance
					</Typography>
					<Typography className="mt-8 font-medium text-3xl leading-none">
						{account?.accountBalance?.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
				</div>
				<div className="flex flex-col mx-24 my-12">
					{/* <Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Spent
					</Typography> */}
					{/* <Typography className="mt-8 font-medium text-3xl leading-none">
						{spent.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography> */}
				</div>
				<div className="flex flex-col mx-24 my-12">
					{/* <Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Minimum
					</Typography> */}
					{/* <Typography className="mt-8 font-medium text-3xl leading-none">
						{minimum.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography> */}
				</div>
			</div>

			<div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24">
			<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				
			</div>
		</Paper>
	);
}


const AccountComingSoon = () => {
		return (
			<Paper className="relative flex flex-col flex-auto p-24 pr-12 pb-12 rounded-2xl shadow overflow-hidden">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
						Dear Valued Customer 
					</Typography>
					<Typography className="text-green-600 font-medium text-sm">Finance Platform Info:  </Typography>
				
				</div>
				<div className="-mt-8">
					<IconButton
						aria-label="more"
						size="large"
					>
						<FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex flex-row flex-wrap mt-16 -mx-24">
				<div className="flex flex-col mx-24 my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						Humble Appeal: <br/>
						We would love to inform you that our <br/>
						mobile banking functionality  <br/>
						will be available soon. Please bear with us.
					</Typography>
					{/* <Typography className="mt-8 font-medium text-3xl leading-none">
						
					</Typography> */}
				</div>
				
			</div>

			<div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24">
			<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				
			</div>
		</Paper>
		)
	}

export default memo(PreviousStatementWidget);
