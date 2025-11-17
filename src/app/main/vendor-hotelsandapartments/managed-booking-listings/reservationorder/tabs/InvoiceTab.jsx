import { Box, Paper, Chip, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { memo, useState } from 'react';
import { calculateCompanyEarnings, calculateShopEarnings } from 'app/configs/Calculus';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useThemeMediaQuery } from '@fuse/hooks';
import { toast } from 'react-toastify';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
import { useCashoutMerchantReservationEarnings } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';

/**
 * The invoice tab.
 */

function InvoiceTab(props) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { order, myshopData } = props;

	const [cashOutDialogOpen, setCashOutDialogOpen] = useState(false);

	const {
		mutate: cashingOutOrderItemSales,
		isLoading: cashingOutLoading,
		error: cashingOutError
	} = useCashoutMerchantReservationEarnings();

	if (cashingOutError) {
		toast.success(cashingOutError);
	}

	const handleEarningsCashOut = async () => {
		setCashOutDialogOpen(false);
		try {
			cashingOutOrderItemSales(order?.id);
		} catch (error) {
			toast.error(error);
		}
	};

	/** *Calculations for earnings starts */

	const shopEarning = calculateShopEarnings(
		order?.totalPrice,
		myshopData?.merchantShopplan?.percetageCommissionChargeConversion
	);
	const companyEarnings = calculateCompanyEarnings(
		order?.totalPrice,
		myshopData?.merchantShopplan?.percetageCommissionChargeConversion
	);
	/** *Calculations for earnings ends */

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 2
	});

	return (
		<Box className="space-y-24">
			{order && (
				<>
					{/* Invoice Header Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 2
							}}
						>
							<Box className="flex items-center gap-12 mb-24">
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: '10px',
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<FuseSvgIcon
										className="text-white"
										size={20}
									>
										heroicons-outline:document-text
									</FuseSvgIcon>
								</Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524' }}
								>
									Invoice
								</Typography>
							</Box>

							<Box className="grid grid-cols-1 md:grid-cols-2 gap-24">
								<Box>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 1 }}
									>
										Invoice Number
									</Typography>
									<Typography
										variant="body1"
										className="font-semibold"
										sx={{ color: '#292524', mb: 3 }}
									>
										{order?.paymentResult?.reference || 'N/A'}
									</Typography>

									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Guest Information
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: '#292524', mb: 0.5 }}
									>
										{order?.paymentdatas?.bookingName}
									</Typography>
									{order?.paymentdatas?.bookingAddress && (
										<Typography
											variant="body2"
											sx={{ color: '#78716c', fontSize: '0.813rem' }}
										>
											{order?.paymentdatas?.bookingAddress}
										</Typography>
									)}
									{order?.paymentdatas?.bookingPhone && (
										<Typography
											variant="body2"
											sx={{ color: '#78716c', fontSize: '0.813rem' }}
										>
											{order?.paymentdatas?.bookingPhone}
										</Typography>
									)}
								</Box>

								<Box
									className="flex items-center p-16"
									sx={{
										background:
											'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.15) 100%)',
										border: '1px solid rgba(234, 88, 12, 0.3)',
										borderRadius: 2
									}}
								>
									<img
										className="w-60"
										src="assets/images/afslogo/afslogo.png"
										alt="logo"
									/>

									<Box
										sx={{
											width: 1,
											backgroundColor: 'rgba(234, 88, 12, 0.2)',
											height: 96,
											mx: 2
										}}
									/>

									<Box className="px-8">
										<Typography sx={{ color: '#292524' }}>AFRICANSHOPS LTD.</Typography>

										<Typography sx={{ color: '#57534e' }}>
											The Paradise Court, Idu, Abuja, 900288
										</Typography>
										<Typography sx={{ color: '#57534e' }}>+234 708 720 0297</Typography>
										<Typography sx={{ color: '#57534e' }}>africanshops.africanshops.org</Typography>
										<Typography sx={{ color: '#57534e' }}>www.africanshops.org</Typography>
									</Box>
								</Box>
							</Box>
						</Paper>
					</motion.div>

					{/* Payment Details Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 2
							}}
						>
							<Box className="flex items-center gap-12 mb-24">
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: '10px',
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<FuseSvgIcon
										className="text-white"
										size={20}
									>
										heroicons-outline:currency-dollar
									</FuseSvgIcon>
								</Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524' }}
								>
									Payment Details
								</Typography>
							</Box>

							<Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 mb-24">
								<Box>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Transaction ID
									</Typography>
									<Typography
										variant="body2"
										className="font-semibold truncate"
										sx={{ color: '#292524' }}
									>
										{order?.paymentResult?.reference || 'N/A'}
									</Typography>
								</Box>

								<Box>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Payment Method
									</Typography>
									<Chip
										label={order?.paymentdatas?.paymentMethod || 'N/A'}
										size="small"
										sx={{
											background: 'rgba(249, 115, 22, 0.1)',
											color: '#ea580c',
											fontWeight: 600,
											border: '1px solid rgba(234, 88, 12, 0.2)'
										}}
									/>
								</Box>

								<Box>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Total Amount
									</Typography>
									<Typography
										variant="h6"
										className="font-bold"
										sx={{ color: '#ea580c' }}
									>
										₦{formatCurrency(order?.totalPrice)}
									</Typography>
								</Box>

								<Box>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Paid On
									</Typography>
									<Typography
										variant="body2"
										className="font-semibold"
										sx={{ color: '#292524' }}
									>
										{order?.PaidAt ? new Date(order?.PaidAt)?.toDateString() : 'N/A'}
									</Typography>
								</Box>
							</Box>

							<Box
								sx={{
									p: 2,
									background: 'rgba(249, 115, 22, 0.05)',
									borderRadius: 1.5,
									border: '1px solid rgba(234, 88, 12, 0.1)'
								}}
							>
								<Typography
									variant="body2"
									sx={{ color: '#78716c', mb: 1 }}
								>
									At <strong>{myshopData?.merchantShopplan?.percetageCommissionCharge}%</strong>{' '}
									commission you earn{' '}
									<strong style={{ color: '#ea580c' }}>₦{formatCurrency(shopEarning)}</strong> while
									commission is{' '}
									<strong style={{ color: '#ea580c' }}>₦{formatCurrency(companyEarnings)}</strong>
								</Typography>
							</Box>
						</Paper>
					</motion.div>

					{/* Earnings Breakdown Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 2
							}}
						>
							<Box className="flex items-center gap-12 mb-24">
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: '10px',
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<FuseSvgIcon
										className="text-white"
										size={20}
									>
										heroicons-outline:chart-bar
									</FuseSvgIcon>
								</Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524' }}
								>
									Earnings Breakdown
								</Typography>
							</Box>

							<Box className="space-y-12">
								<Box
									className="flex items-center justify-between py-12"
									sx={{ borderBottom: '1px solid rgba(234, 88, 12, 0.08)' }}
								>
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										Total Reservation Cost
									</Typography>
									<Typography
										variant="body1"
										className="font-semibold"
										sx={{ color: '#292524' }}
									>
										₦{formatCurrency(order?.totalPrice)}
									</Typography>
								</Box>

								<Box
									className="flex items-center justify-between py-12"
									sx={{ borderBottom: '1px solid rgba(234, 88, 12, 0.08)' }}
								>
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										You Earn
									</Typography>
									<Typography
										variant="body1"
										className="font-semibold"
										sx={{ color: '#16a34a' }}
									>
										{formatter.format(+shopEarning)}
									</Typography>
								</Box>

								<Box
									className="flex items-center justify-between py-12"
									sx={{ borderBottom: '1px solid rgba(234, 88, 12, 0.08)' }}
								>
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										Commission Cost
									</Typography>
									<Typography
										variant="body1"
										className="font-semibold"
										sx={{ color: '#dc2626' }}
									>
										{formatter.format(+companyEarnings)}
									</Typography>
								</Box>

								<Box
									className="flex items-center justify-between py-12"
									sx={{ borderBottom: '1px solid rgba(234, 88, 12, 0.08)' }}
								>
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										V.A.T
									</Typography>
									<Typography
										variant="body1"
										className="font-semibold"
										sx={{ color: '#292524' }}
									>
										-
									</Typography>
								</Box>

								<Box
									className="flex items-center justify-between py-16"
									sx={{
										background: 'rgba(249, 115, 22, 0.08)',
										px: 2,
										borderRadius: 1.5,
										mt: 2
									}}
								>
									<Typography
										variant="h6"
										className="font-bold"
										sx={{ color: '#292524' }}
									>
										MY TOTAL EARNINGS
									</Typography>
									<Typography
										variant="h5"
										className="font-bold"
										sx={{ color: '#ea580c' }}
									>
										{formatter.format(+shopEarning)}
									</Typography>
								</Box>
							</Box>
						</Paper>
					</motion.div>

					{/* Thank You Section */}
					{order?.isPaid && order?.isCheckOut && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
									border: '1px solid rgba(234, 88, 12, 0.1)',
									borderRadius: 2
								}}
							>
								<Typography
									variant="body1"
									className="font-semibold mb-16"
									sx={{ color: '#292524' }}
								>
									Thank you for your business.
								</Typography>

								<Box className="flex items-start gap-16">
									<img
										className="h-60"
										src="assets/images/afslogo/afslogo.png"
										alt="logo"
									/>
									<Typography
										variant="body2"
										sx={{ color: '#78716c', lineHeight: 1.7 }}
									>
										In honor of {order?.bookingPropertyId?.title}, We at Africanshops consider this
										Transaction as having fulfilled the purpose for which it was intended and having
										satisfied our consumers, duly consent the repatriation of funds to this
										merchant. Warmest Regards!
									</Typography>
								</Box>
							</Paper>
						</motion.div>
					)}

					{/* Cash Out Button */}
					{order?.isPaid && order?.isCheckOut && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<Box className="flex justify-end">
								<Button
									onClick={() => setCashOutDialogOpen(true)}
									disabled={cashingOutLoading}
									variant="contained"
									size={isMobile ? 'medium' : 'large'}
									startIcon={<FuseSvgIcon size={20}>heroicons-outline:cash</FuseSvgIcon>}
									sx={{
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										color: 'white',
										fontWeight: 600,
										textTransform: 'none',
										px: 3,
										py: 1.5,
										'&:hover': {
											background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
										},
										'&:disabled': {
											background: 'rgba(249, 115, 22, 0.3)',
											color: 'white'
										}
									}}
								>
									{cashingOutLoading
										? `Processing ${formatter.format(+shopEarning)} Cash Out...`
										: `Cash Out ${formatter.format(+shopEarning)} Reservation Earnings`}
								</Button>
							</Box>
						</motion.div>
					)}
				</>
			)}

			{/* Cash Out Confirmation Dialog */}
			<Dialog
				open={cashOutDialogOpen}
				onClose={() => setCashOutDialogOpen(false)}
				PaperProps={{
					sx: {
						borderRadius: 2,
						minWidth: { xs: '90%', sm: 500 },
						maxWidth: 600
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: '14px',
								background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={28}
							>
								heroicons-outline:cash
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-bold"
								sx={{ color: '#292524', mb: 0.5 }}
							>
								Cash Out Reservation Earnings
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: '#78716c' }}
							>
								Transfer earnings to your account
							</Typography>
						</Box>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ pt: 3 }}>
					<Box className="space-y-20">
						{/* Earnings Summary Card */}
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(21, 128, 61, 0.08) 100%)',
								border: '2px solid rgba(22, 163, 74, 0.2)',
								borderRadius: 2
							}}
						>
							<Box className="flex items-center justify-between mb-16">
								<Typography
									variant="body2"
									sx={{ color: '#78716c', fontWeight: 500 }}
								>
									You're about to receive
								</Typography>
								<Chip
									icon={<FuseSvgIcon size={14}>heroicons-solid:check-circle</FuseSvgIcon>}
									label="Verified Earnings"
									size="small"
									sx={{
										background: 'rgba(22, 163, 74, 0.15)',
										color: '#16a34a',
										fontWeight: 600,
										border: '1px solid rgba(22, 163, 74, 0.3)'
									}}
								/>
							</Box>

							<Typography
								variant="h3"
								className="font-bold"
								sx={{
									color: '#16a34a',
									mb: 2,
									fontSize: { xs: '2rem', sm: '2.5rem' }
								}}
							>
								{formatter.format(+shopEarning)}
							</Typography>

							<Divider sx={{ my: 2, borderColor: 'rgba(22, 163, 74, 0.15)' }} />

							<Box className="space-y-8">
								<Box className="flex items-center justify-between">
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'flex', alignItems: 'center', gap: 1 }}
									>
										<FuseSvgIcon size={14} sx={{ color: '#78716c' }}>
											heroicons-outline:document-text
										</FuseSvgIcon>
										Reservation Total
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: '#57534e', fontWeight: 600 }}
									>
										₦{formatCurrency(order?.totalPrice)}
									</Typography>
								</Box>

								<Box className="flex items-center justify-between">
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'flex', alignItems: 'center', gap: 1 }}
									>
										<FuseSvgIcon size={14} sx={{ color: '#78716c' }}>
											heroicons-outline:calculator
										</FuseSvgIcon>
										Platform Fee ({myshopData?.merchantShopplan?.percetageCommissionCharge}%)
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: '#dc2626', fontWeight: 600 }}
									>
										-₦{formatCurrency(companyEarnings)}
									</Typography>
								</Box>

								<Box className="flex items-center justify-between">
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'flex', alignItems: 'center', gap: 1 }}
									>
										<FuseSvgIcon size={14} sx={{ color: '#16a34a' }}>
											heroicons-outline:badge-check
										</FuseSvgIcon>
										Your Net Earnings
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: '#16a34a', fontWeight: 700 }}
									>
										₦{formatCurrency(shopEarning)}
									</Typography>
								</Box>
							</Box>
						</Paper>

						{/* Reservation Details */}
						<Paper
							elevation={0}
							sx={{
								p: 2.5,
								background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
								border: '1px solid rgba(234, 88, 12, 0.15)',
								borderRadius: 1.5
							}}
						>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mb: 1.5, fontWeight: 600 }}
							>
								Reservation Details
							</Typography>

							<Box className="space-y-8">
								<Box className="flex items-center gap-8">
									<FuseSvgIcon size={16} sx={{ color: '#ea580c' }}>
										heroicons-solid:user
									</FuseSvgIcon>
									<Typography
										variant="body2"
										sx={{ color: '#292524' }}
									>
										<strong>{order?.paymentdatas?.bookingName}</strong>
									</Typography>
								</Box>

								<Box className="flex items-center gap-8">
									<FuseSvgIcon size={16} sx={{ color: '#ea580c' }}>
										heroicons-solid:home
									</FuseSvgIcon>
									<Typography
										variant="body2"
										sx={{ color: '#57534e' }}
									>
										{order?.bookingPropertyId?.title}
									</Typography>
								</Box>

								<Box className="flex items-center gap-8">
									<FuseSvgIcon size={16} sx={{ color: '#ea580c' }}>
										heroicons-solid:receipt-refund
									</FuseSvgIcon>
									<Typography
										variant="body2"
										sx={{ color: '#57534e' }}
									>
										Ref: {order?.paymentResult?.reference}
									</Typography>
								</Box>
							</Box>
						</Paper>

						{/* Important Notice */}
						<Paper
							elevation={0}
							sx={{
								p: 2,
								background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
								border: '1px solid rgba(59, 130, 246, 0.2)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-start gap-12">
								<FuseSvgIcon size={18} sx={{ color: '#3b82f6', mt: 0.25 }}>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Box>
									<Typography
										variant="body2"
										sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
									>
										What happens next?
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#57534e', lineHeight: 1.6 }}
									>
										Your earnings will be transferred to your registered bank account within 24-48 hours.
										You'll receive a confirmation email once the transfer is complete.
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Box>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 2 }}>
					<Button
						onClick={() => setCashOutDialogOpen(false)}
						sx={{
							color: '#78716c',
							fontWeight: 600,
							textTransform: 'none',
							px: 2,
							'&:hover': {
								background: 'rgba(120, 113, 108, 0.08)'
							}
						}}
					>
						Not Now
					</Button>
					<Button
						onClick={handleEarningsCashOut}
						disabled={cashingOutLoading}
						variant="contained"
						startIcon={
							cashingOutLoading ? (
								<FuseSvgIcon size={18} className="animate-spin">
									heroicons-outline:refresh
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={18}>heroicons-outline:check-circle</FuseSvgIcon>
							)
						}
						sx={{
							background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
							color: 'white',
							fontWeight: 700,
							textTransform: 'none',
							px: 4,
							py: 1.25,
							fontSize: '0.9375rem',
							boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
							'&:hover': {
								background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
								boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)'
							},
							'&:disabled': {
								background: 'rgba(120, 113, 108, 0.12)',
								color: 'rgba(120, 113, 108, 0.38)',
								boxShadow: 'none'
							}
						}}
					>
						{cashingOutLoading ? 'Processing...' : `Confirm & Cash Out ${formatter.format(+shopEarning)}`}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default memo(InvoiceTab);
