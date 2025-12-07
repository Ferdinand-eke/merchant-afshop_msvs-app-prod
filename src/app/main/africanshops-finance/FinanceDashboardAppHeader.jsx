import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import { useAppDispatch } from 'app/store/hooks';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '@mui/material';

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import FundsMovementPage from './fundsmovementcards/FundsMovementPage';
import FundsWithdrawalPage from './fundsmovementcards/FundsWithdrawalPage';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

/**
 * The FinanceDashboardAppHeader component.
 */
function FinanceDashboardAppHeader(props) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {}
		// resolver: zodResolver(schema)
	});

	const { control, formState, watch, getValues } = methods;

	const { shopData, isLoading } = props;
	const [open, setOpen] = React.useState(false);
	const [withdarwopen, setWithdrawOpen] = React.useState(false);

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const toggleWithdrawDrawer = (newOpen) => () => {
		setWithdrawOpen(newOpen);
	};

	const { children = <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon> } = props;
	const [animate, setAnimate] = useState(false);
	const dispatch = useAppDispatch();
	const controls = useAnimation();
	const theme = useTheme();

	useEffect(() => {
		if (animate) {
			controls.start({
				rotate: [0, 20, -20, 0],
				color: [theme.palette.secondary.main],
				transition: { duration: 0.2, repeat: 5 }
			});
		} else {
			controls.start({
				rotate: 0,
				scale: 1,
				color: theme.palette.text.secondary
			});
		}
	}, [animate, controls]);
	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const DrawerMoveFunds = <FundsMovementPage onClose={toggleDrawer(false)} />;

	const DrawerWithdraw = <FundsWithdrawalPage onClose={toggleWithdrawDrawer(false)} />;

	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography
					 component={NavLinkAdapter}
	           to={`/africanshops/finance`}
					className="text-3xl font-semibold tracking-tight leading-8 cursor-pointer">
						Finance dashboard
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Keep track of your financial status
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
				// component={NavLinkAdapter}
				// africanshops/transaction-reports
				 component={NavLinkAdapter}
	           to={`/africanshops/transaction-reports`}
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:document-report</FuseSvgIcon>}
					>
						Reports
					</Button>
					<Button
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
						onClick={toggleWithdrawDrawer(true)}
					>
						Withdraw
					</Button>

					<Button
						className="bg-orange-500 whitespace-nowrap"
						variant="contained"
						color="secondary"
						// startIcon={
						//   <FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>
						// }
						// onClick={() => dispatch(toggleAccountsPanel())}
						onClick={toggleDrawer(true)}
					>
						<motion.div animate={controls}>{children}</motion.div>
						Cashout To Wallet
					</Button>

					{/* <div className="-mt-8">
            <Typography
              className="bg-orange-500 text-white rounded-full font-semibold py-4 px-4  text-11 font-medium capitalize cursor-pointer"
              color="text.secondary"
            >
              Move Funds To Wallet
            </Typography>
          </div> */}
				</div>

				<Drawer
					open={open}
					onClose={toggleDrawer(false)}
					anchor="right"
					disableEscapeKeyDown
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 600 },
							maxWidth: '100%'
						}
					}}
					ModalProps={{
						keepMounted: false
					}}
				>
					{DrawerMoveFunds}
				</Drawer>

				<Drawer
					open={withdarwopen}
					onClose={toggleWithdrawDrawer(false)}
					anchor="right"
					disableEscapeKeyDown
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 600 },
							maxWidth: '100%'
						}
					}}
					ModalProps={{
						keepMounted: false
					}}
				>
					{DrawerWithdraw}
				</Drawer>
			</div>
			
		</div>
	);
}

export default FinanceDashboardAppHeader;
