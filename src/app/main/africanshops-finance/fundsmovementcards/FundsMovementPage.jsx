import { motion } from 'framer-motion';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns/format';
import { Button, InputAdornment, TextField } from '@mui/material';
import useGetMyShopDetails, {
	useGetShopAccountBalance
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { Controller, useForm } from 'react-hook-form';
import { useTransferToShopWalletMutation } from 'app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import PreviousStatementWidget from '../widgets/PreviousStatementWidget';
import AccountSummaryWidget from './sumarycard/AccountSummaryWidget';
/**
 * The activities page.
 */

const item = {
	image: '',
	name: 'John Doe',
	description:
		'Receive orders from intending buyers, package products ordered and make available at our order collation units within your market,'
};

function FundsMovementPage(props) {
	const tranferFunds = useTransferToShopWalletMutation();
	const [drawerError, setDrawerError] = useState('');

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			transferAmount: ''
		}
		// resolver: zodResolver(schema)
	});
	// const methods = useFormContext();
	const { control, formState, watch, getValues, reset } = methods;
	const { isValid, dirtyFields } = formState;
	// const methods = useFormContext();

	const { data: shopData, isLoading, isError } = useGetMyShopDetails();
	const { data: shopAccount, isLoading: accountLoading, isError: accountError } = useGetShopAccountBalance();
	// const fistFiveOrders = shopData?.data?.orderItems?.slice(0, 4);
	// console.log("ShopData", shopData?.data)

	function handleMoveFunds() {
		// saveProduct(getValues());
		console.log('move ammount', getValues());

		if (
			getValues()?.transferAmount === '' ||
			getValues()?.transferAmount === null ||
			parseInt(getValues()?.transferAmount) === 0
		) {
			setDrawerError('transfer amount required');
			return toast.error('transfer amount required');
		}

		if (shopData?.data?.merchant?.shopaccount?.accountbalance < getValues()?.transferAmount) {
			setDrawerError('insufficient balance to transfer');
			return toast.error('insufficient balance to transfer');
		}

		tranferFunds.mutate(getValues());
	}

	useEffect(() => {
		if (tranferFunds?.isSuccess) {
			setDrawerError('');
			reset();
		}
	}, [tranferFunds?.isSuccess]);

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (
		<FusePageSimple
			content={
				<div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
					<Typography className="text-2xl font-extrabold leading-none tracking-tight">
						Move your Earnings to wallet here.
					</Typography>
					<Typography
						className="mt-6 text-lg"
						color="text.secondary"
					>
						You can move your funds from merchant acounts to wallet for onward withdrawal.
					</Typography>
					<Timeline
						className="py-32"
						position="right"
						sx={{
							'& .MuiTimelineItem-root:before': {
								display: 'none'
							}
						}}
					>
						<TimelineItem>
							<TimelineSeparator>
								<TimelineDot
									color="primary"
									className="mt-0 flex h-40  w-40 items-center justify-center p-0"
								>
									<FuseSvgIcon>heroicons-solid:star</FuseSvgIcon>
								</TimelineDot>

								<TimelineConnector />
							</TimelineSeparator>

							<TimelineContent className="flex flex-col items-start pb-48 pt-0">
								{}
								<div
									dangerouslySetInnerHTML={{
										__html: 'Whole saller accounts'
									}}
								/>

								<div className="mt-8 flex flex-col text-md leading-5 sm:mt-4 sm:flex-row sm:items-center sm:space-x-8">
									<Typography
										className="text-13"
										color="text.secondary"
									>
										{format(new Date(Date.now()), 'MMM dd, h:mm a')}
									</Typography>
								</div>

								<motion.div variants={item}>
									<AccountSummaryWidget
										shopData={shopData?.data?.merchant}
										isLoading={isLoading}
									/>
								</motion.div>
							</TimelineContent>

							{/* Here is for the next timeline activity which is to move funds */}
						</TimelineItem>

						<TimelineItem>
							<TimelineSeparator>
								<TimelineDot
									color="primary"
									className="mt-0 flex h-40  w-40 items-center justify-center p-0"
								>
									<FuseSvgIcon>heroicons-solid:star</FuseSvgIcon>
								</TimelineDot>

								<TimelineConnector />
							</TimelineSeparator>
							<TimelineContent className="flex flex-col items-start pb-48 pt-0">
								<Controller
									name="transferAmount"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											className="mt-8 mb-16 mx-4"
											label=" Amount"
											id="transferAmount"
											InputProps={{
												startAdornment: <InputAdornment position="start">NGN</InputAdornment>
											}}
											type="number"
											variant="outlined"
											fullWidth
										/>
									)}
								/>
								{drawerError && <pan>{drawerError}</pan>}

								<Button
									className="whitespace-nowrap mx-4"
									variant="contained"
									color="secondary"
									disabled={_.isEmpty(dirtyFields) || !isValid || tranferFunds?.isLoading}
									onClick={handleMoveFunds}
								>
									Move funds to wallet
								</Button>
							</TimelineContent>
						</TimelineItem>
					</Timeline>

					<motion.div
						variants={item}
						className="flex flex-col flex-auto"
					>
						<PreviousStatementWidget
							account={shopAccount?.data}
							accountLoading={accountLoading}
							accountError={accountError}
						/>
					</motion.div>
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default FundsMovementPage;
