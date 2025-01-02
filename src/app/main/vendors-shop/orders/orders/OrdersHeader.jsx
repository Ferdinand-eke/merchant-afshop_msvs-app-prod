import { useThemeMediaQuery } from '@fuse/hooks';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import useGetMyShopDetails from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../pos/PosUtils';

/**
 * The orders header.
 */

function OrdersHeader() {
	
	const { data:shopData, isLoading, isError } = useGetMyShopDetails();
	
	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
			<motion.span
				initial={{ x: -20 }}
				animate={{
					x: 0,
					transition: { delay: 0.2 }
				}}
			>
				<Typography className="flex text-24 md:text-32 font-extrabold tracking-tight">My Shop Orders</Typography>
			</motion.span>

			{/* <div className="flex w-full sm:w-auto flex-1 items-center justify-end space-x-8" /> */}
			<div className="flex flex-1 sm:w-auto  items-center justify-end space-x-8">
				<motion.div
					className="flex flex-grow-0 gap-4"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<EarningsTab 
					shopDataProps={shopData?.data?.data}
					/>
				
				</motion.div>
			</div>
		</div>
	);
}

export default OrdersHeader;


const EarningsTab = ({shopDataProps}) => {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (<>
	
	<Button
						className={` ${"bg-orange-500 hover:bg-orange-800"}`}
						variant="contained"
						size={isMobile ? 'small' : 'small'}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
						</svg>
						{shopDataProps?.shopaccount?.accountbalance && <span className="mx-4 sm:mx-8">Earnings: NGN {formatCurrency(shopDataProps?.shopaccount?.accountbalance) }   </span>}
						
					</Button>
	</>)
}