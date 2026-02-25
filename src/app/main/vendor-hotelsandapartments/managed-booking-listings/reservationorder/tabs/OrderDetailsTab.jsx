import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
	useCheckInGuest,
	useCheckOutGuest
} from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
import ReservationCheckInStatus from '../ReservationCheckInStatus';
import ReservationCreatedAndPaymentStatus from '../ReservationCreatedAndPaymentStatus';
import ReservationCheckOustStatus from '../ReservationCheckOustStatus';

/**
 * The order details tab.
 */

function OrderDetailsTab({ reservation }) {

	const checkInGuest = useCheckInGuest();
	const checkOutGuestReservation = useCheckOutGuest();

	const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
	const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
	const [checkInCode, setCheckInCode] = useState('');
	const [checkOutCode, setCheckOutCode] = useState('');

	// Helper function to close check-in dialog and reset code
	const handleCloseCheckInDialog = () => {
		setCheckInDialogOpen(false);
		setCheckInCode('');
	};

	// Helper function to close check-out dialog and reset code
	const handleCloseCheckOutDialog = () => {
		setCheckOutDialogOpen(false);
		setCheckOutCode('');
	};

	//checkInCode
	const handleCheckIn = async () => {
		// Validate check-in code
		if (!checkInCode || checkInCode.trim() === '') {
			toast.error('Please enter the check-in code');
			return;
		}

		setCheckInDialogOpen(false);
		try {
			checkInGuest.mutate({
				reservationId: reservation?.id,
				checkInCode: checkInCode.trim()
			});
			setCheckInCode(''); // Reset the code after submission
		} catch (error) {
			toast.error(error);
		}
	};

	const handleCheckOutGuest = async () => {
		// Validate check-out code
		if (!checkOutCode || checkOutCode.trim() === '') {
			toast.error('Please enter the check-out code');
			return;
		}

		setCheckOutDialogOpen(false);
		try {
			checkOutGuestReservation.mutate({
				reservationId: reservation?.id,
				checkOutCode: checkOutCode.trim()
			});
			setCheckOutCode(''); // Reset the code after submission
		} catch (error) {
			toast.error(error);
		}
	};

	// if (!isError && !reservation) {
	//   return null;
	// }

	return (
		<Box className="space-y-24">
			{/* Guest Information Section */}
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
								heroicons-outline:user-circle
							</FuseSvgIcon>
						</Box>
						<Typography
							variant="h6"
							className="font-bold"
							sx={{ color: '#292524' }}
						>
							Guest Information
						</Typography>
					</Box>

					<Box className="grid grid-cols-1 md:grid-cols-3 gap-16">
						<Box>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
							>
								Name
							</Typography>
							<Box className="flex items-center gap-8">
								<Avatar
									sx={{
										width: 32,
										height: 32,
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										fontSize: '0.875rem',
										fontWeight: 600
									}}
								>
									{reservation?.paymentdatas?.bookingName?.charAt(0) || 'G'}
								</Avatar>
								<Typography
									variant="body2"
									className="font-semibold"
									sx={{ color: '#292524' }}
								>
									{reservation?.paymentdatas?.bookingName || 'N/A'}
								</Typography>
							</Box>
						</Box>

						<Box>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
							>
								Email
							</Typography>
							<Typography
								variant="body2"
								className="font-semibold truncate"
								sx={{ color: '#292524' }}
							>
								{reservation?.paymentdatas?.guestEmail || 'N/A'}
							</Typography>
						</Box>

						<Box>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
							>
								Phone
							</Typography>
							<Typography
								variant="body2"
								className="font-semibold"
								sx={{ color: '#292524' }}
							>
								{reservation?.paymentdatas?.bookingPhone || 'N/A'}
							</Typography>
						</Box>
					</Box>

					{reservation?.paymentdatas?.bookingAddress && (
						<Box
							className="mt-16 pt-16"
							sx={{ borderTop: '1px solid rgba(234, 88, 12, 0.1)' }}
						>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mb: 1 }}
							>
								Address
							</Typography>
							<Typography
								variant="body2"
								sx={{ color: '#292524' }}
							>
								{reservation?.paymentdatas?.bookingAddress}
							</Typography>
						</Box>
					)}
				</Paper>
			</motion.div>
			{/* Guest Stay Status Section */}
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
								heroicons-outline:clock
							</FuseSvgIcon>
						</Box>
						<Typography
							variant="h6"
							className="font-bold"
							sx={{ color: '#292524' }}
						>
							Guest Stay Status
						</Typography>
					</Box>

					<Box className="space-y-16">
						{/* Reservation Created & Payment */}
						<Box
							sx={{
								p: 2,
								background: 'white',
								borderRadius: 1.5,
								border: '1px solid rgba(234, 88, 12, 0.08)'
							}}
						>
							<Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12">
								<Box className="flex-1">
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Status
									</Typography>
									<ReservationCreatedAndPaymentStatus
										createdAt={reservation?.createdAt}
										isPaid={reservation?.isPaid}
									/>
								</Box>
								<Box>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
									>
										Created On
									</Typography>
									<Typography
										variant="body2"
										className="font-semibold"
										sx={{ color: '#292524' }}
									>
										{reservation?.orderId?.createdAt || 'N/A'}
									</Typography>
								</Box>
							</Box>
						</Box>

						{/* Check-In Status */}
						{reservation?.isPaid && (
							<Box
								sx={{
									p: 2,
									background: 'white',
									borderRadius: 1.5,
									border: '1px solid rgba(234, 88, 12, 0.08)'
								}}
							>
								<Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12">
									<Box className="flex-1">
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
										>
											Check-In Status
										</Typography>
										<ReservationCheckInStatus isCheckIn={reservation?.isCheckIn} />
									</Box>
									<Box>
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
										>
											Scheduled Date
										</Typography>
										<Chip
											label={new Date(reservation?.startDate)?.toDateString()}
											size="small"
											sx={{
												background: 'rgba(120, 113, 108, 0.1)',
												color: '#78716c',
												fontWeight: 600
											}}
										/>
									</Box>
									<Box>
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
										>
											Action
										</Typography>
										{reservation?.isCheckIn ? (
											<Chip
												icon={<FuseSvgIcon size={14}>heroicons-solid:check-circle</FuseSvgIcon>}
												label={new Date(reservation?.checkedInAt)?.toDateString()}
												size="small"
												sx={{
													background: 'rgba(34, 197, 94, 0.1)',
													color: '#16a34a',
													fontWeight: 600
												}}
											/>
										) : (
											<Button
												onClick={() => setCheckInDialogOpen(true)}
												disabled={checkInGuest.isLoading}
												size="small"
												variant="contained"
												sx={{
													background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
													color: 'white',
													fontWeight: 600,
													textTransform: 'none',
													'&:hover': {
														background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
													}
												}}
											>
												{checkInGuest.isLoading ? 'Checking In...' : 'Check In Guest'}
											</Button>
										)}
									</Box>
								</Box>
							</Box>
						)}

						{/* Check-Out Status */}
						{reservation?.isCheckIn && (
							<Box
								sx={{
									p: 2,
									background: 'white',
									borderRadius: 1.5,
									border: '1px solid rgba(234, 88, 12, 0.08)'
								}}
							>
								<Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12">
									<Box className="flex-1">
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
										>
											Check-Out Status
										</Typography>
										<ReservationCheckOustStatus isCheckOut={reservation?.isCheckOut} />
									</Box>
									<Box>
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
										>
											Scheduled Date
										</Typography>
										<Chip
											label={new Date(reservation?.endDate)?.toDateString()}
											size="small"
											sx={{
												background: 'rgba(120, 113, 108, 0.1)',
												color: '#78716c',
												fontWeight: 600
											}}
										/>
									</Box>
									<Box>
										<Typography
											variant="caption"
											sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
										>
											Action
										</Typography>
										{reservation?.isCheckOut ? (
											<Chip
												icon={<FuseSvgIcon size={14}>heroicons-solid:check-circle</FuseSvgIcon>}
												label={new Date(reservation?.checkedOutAt)?.toDateString()}
												size="small"
												sx={{
													background: 'rgba(34, 197, 94, 0.1)',
													color: '#16a34a',
													fontWeight: 600
												}}
											/>
										) : (
											<Button
												onClick={() => setCheckOutDialogOpen(true)}
												disabled={checkOutGuestReservation.isLoading}
												size="small"
												variant="contained"
												sx={{
													background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
													color: 'white',
													fontWeight: 600,
													textTransform: 'none',
													'&:hover': {
														background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
													}
												}}
											>
												{checkOutGuestReservation.isLoading
													? 'Checking Out...'
													: 'Check Out Guest'}
											</Button>
										)}
									</Box>
								</Box>
							</Box>
						)}
					</Box>
				</Paper>
			</motion.div>

			{/* Payment Information Section */}
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

					<Box className="grid grid-cols-1 sm:grid-cols-2 gap-16">
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
								{reservation?.paymentResult?.reference || 'N/A'}
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
								label={reservation?.paymentdatas?.paymentMethod || 'N/A'}
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
								₦{formatCurrency(reservation?.totalPrice)}
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
								{reservation?.PaidAt ? new Date(reservation?.PaidAt)?.toDateString() : 'N/A'}
							</Typography>
						</Box>
					</Box>
				</Paper>
			</motion.div>

			{/* Check-In Confirmation Dialog */}
			<Dialog
				open={checkInDialogOpen}
				onClose={handleCloseCheckInDialog}
				PaperProps={{
					sx: {
						borderRadius: 2,
						minWidth: { xs: '90%', sm: 400 }
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={24}
							>
								heroicons-outline:login
							</FuseSvgIcon>
						</Box>
						<Typography
							variant="h6"
							className="font-bold"
							sx={{ color: '#292524' }}
						>
							Confirm Guest Check-In
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="space-y-12 pt-8">
						<Typography
							variant="body1"
							sx={{ color: '#57534e', mb: 2 }}
						>
							Are you sure you want to check in this guest?
						</Typography>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								background:
									'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-center gap-8 mb-8">
								<FuseSvgIcon
									size={16}
									sx={{ color: '#ea580c' }}
								>
									heroicons-solid:user
								</FuseSvgIcon>
								<Typography
									variant="body2"
									className="font-semibold"
									sx={{ color: '#292524' }}
								>
									{reservation?.paymentdatas?.bookingName || 'Guest'}
								</Typography>
							</Box>
							<Box className="flex items-center gap-8">
								<FuseSvgIcon
									size={16}
									sx={{ color: '#ea580c' }}
								>
									heroicons-solid:calendar
								</FuseSvgIcon>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Check-in Date: {new Date(reservation?.startDate)?.toDateString()}
								</Typography>
							</Box>
						</Paper>

						<Box className="mt-16">
							<TextField
								fullWidth
								label="Check-In Code"
								placeholder="Enter guest's check-in code"
								value={checkInCode}
								onChange={(e) => setCheckInCode(e.target.value)}
								required
								variant="outlined"
								size="small"
								InputProps={{
									startAdornment: (
										<FuseSvgIcon size={18} sx={{ color: '#ea580c', mr: 1 }}>
											heroicons-outline:shield-check
										</FuseSvgIcon>
									)
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										'&:hover fieldset': {
											borderColor: '#f97316'
										},
										'&.Mui-focused fieldset': {
											borderColor: '#ea580c'
										}
									},
									'& .MuiInputLabel-root.Mui-focused': {
										color: '#ea580c'
									}
								}}
							/>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mt: 1, fontStyle: 'italic' }}
							>
								Request the check-in code from the guest to verify their identity
							</Typography>
						</Box>

						<Typography
							variant="caption"
							sx={{ color: '#78716c', display: 'block', fontStyle: 'italic' }}
						>
							This action will mark the guest as checked in and update the reservation status.
						</Typography>
					</Box>
				</DialogContent>
				<DialogActions sx={{ p: 3, pt: 0 }}>
					<Button
						onClick={handleCloseCheckInDialog}
						sx={{
							color: '#78716c',
							fontWeight: 600,
							textTransform: 'none',
							'&:hover': {
								background: 'rgba(120, 113, 108, 0.08)'
							}
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={handleCheckIn}
						disabled={!checkInCode.trim() || checkInGuest.isLoading}
						variant="contained"
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							color: 'white',
							fontWeight: 600,
							textTransform: 'none',
							px: 3,
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
							},
							'&:disabled': {
								background: 'rgba(120, 113, 108, 0.12)',
								color: 'rgba(120, 113, 108, 0.38)'
							}
						}}
					>
						Confirm Check-In
					</Button>
				</DialogActions>
			</Dialog>

			{/* Check-Out Confirmation Dialog */}
			<Dialog
				open={checkOutDialogOpen}
				onClose={handleCloseCheckOutDialog}
				PaperProps={{
					sx: {
						borderRadius: 2,
						minWidth: { xs: '90%', sm: 400 }
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={24}
							>
								heroicons-outline:logout
							</FuseSvgIcon>
						</Box>
						<Typography
							variant="h6"
							className="font-bold"
							sx={{ color: '#292524' }}
						>
							Confirm Guest Check-Out
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="space-y-12 pt-8">
						<Typography
							variant="body1"
							sx={{ color: '#57534e', mb: 2 }}
						>
							Are you sure you want to check out this guest?
						</Typography>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								background:
									'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-center gap-8 mb-8">
								<FuseSvgIcon
									size={16}
									sx={{ color: '#ea580c' }}
								>
									heroicons-solid:user
								</FuseSvgIcon>
								<Typography
									variant="body2"
									className="font-semibold"
									sx={{ color: '#292524' }}
								>
									{reservation?.paymentdatas?.bookingName || 'Guest'}
								</Typography>
							</Box>
							<Box className="flex items-center gap-8">
								<FuseSvgIcon
									size={16}
									sx={{ color: '#ea580c' }}
								>
									heroicons-solid:calendar
								</FuseSvgIcon>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Check-out Date: {new Date(reservation?.endDate)?.toDateString()}
								</Typography>
							</Box>
						</Paper>

						<Box className="mt-16">
							<TextField
								fullWidth
								label="Check-Out Code"
								placeholder="Enter guest's check-out code"
								value={checkOutCode}
								onChange={(e) => setCheckOutCode(e.target.value)}
								required
								variant="outlined"
								size="small"
								InputProps={{
									startAdornment: (
										<FuseSvgIcon size={18} sx={{ color: '#ea580c', mr: 1 }}>
											heroicons-outline:shield-check
										</FuseSvgIcon>
									)
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										'&:hover fieldset': {
											borderColor: '#f97316'
										},
										'&.Mui-focused fieldset': {
											borderColor: '#ea580c'
										}
									},
									'& .MuiInputLabel-root.Mui-focused': {
										color: '#ea580c'
									}
								}}
							/>
							<Typography
								variant="caption"
								sx={{ color: '#78716c', display: 'block', mt: 1, fontStyle: 'italic' }}
							>
								Request the check-out code from the guest to verify their identity
							</Typography>
						</Box>

						<Typography
							variant="caption"
							sx={{ color: '#78716c', display: 'block', fontStyle: 'italic' }}
						>
							This action will mark the guest as checked out and complete the reservation.
						</Typography>
					</Box>
				</DialogContent>
				<DialogActions sx={{ p: 3, pt: 0 }}>
					<Button
						onClick={handleCloseCheckOutDialog}
						sx={{
							color: '#78716c',
							fontWeight: 600,
							textTransform: 'none',
							'&:hover': {
								background: 'rgba(120, 113, 108, 0.08)'
							}
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={handleCheckOutGuest}
						disabled={!checkOutCode.trim() || checkOutGuestReservation.isLoading}
						variant="contained"
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							color: 'white',
							fontWeight: 600,
							textTransform: 'none',
							px: 3,
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
							},
							'&:disabled': {
								background: 'rgba(120, 113, 108, 0.12)',
								color: 'rgba(120, 113, 108, 0.38)'
							}
						}}
					>
						Confirm Check-Out
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default OrderDetailsTab;
