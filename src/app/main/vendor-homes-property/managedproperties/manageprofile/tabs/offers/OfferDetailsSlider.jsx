import { memo, useState } from 'react';
import {
	Drawer,
	Typography,
	Box,
	IconButton,
	Chip,
	Divider,
	Paper,
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
	Grid
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useSingleOffer,
	useAcceptOfferMutation,
	useDeclineOfferMutation,
	useSendCounterOfferMutation,
	useRevokeOfferApprovalMutation
} from 'app/configs/data/server-calls/propertyprofile/usePropertyOffers';

/**
 * OfferDetailsSlider - Slider showing offer details with action buttons
 */
function OfferDetailsSlider({ open, onClose, offerId }) {
	const { data: offerData, isLoading } = useSingleOffer(offerId);

	const { mutate: acceptOffer, isLoading: isAccepting } = useAcceptOfferMutation();
	const { mutate: declineOffer, isLoading: isDeclining } = useDeclineOfferMutation();
	const { mutate: sendCounterOffer, isLoading: isSendingCounter } = useSendCounterOfferMutation();
	const { mutate: revokeApproval, isLoading: isRevoking } = useRevokeOfferApprovalMutation();

	// Dialog states
	const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
	const [isCounterDialogOpen, setIsCounterDialogOpen] = useState(false);
	const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

	// Form states
	const [rejectionReason, setRejectionReason] = useState('');
	const [counterOfferAmount, setCounterOfferAmount] = useState('');
	const [counterOfferMessage, setCounterOfferMessage] = useState('');
	const [revocationReason, setRevocationReason] = useState('');

	const offer = offerData?.data?.payload || offerData?.data?.offer || {};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	};

	const getStatusColor = (status) => {
		switch (status?.toUpperCase()) {
			case 'PENDING':
				return 'warning';
			case 'ACCEPTED':
			case 'APPROVED':
				return 'success';
			case 'REJECTED':
			case 'DECLINED':
				return 'error';
			case 'COUNTER_OFFERED':
				return 'info';
			default:
				return 'default';
		}
	};

	const handleAccept = () => {
		acceptOffer(offerId, {
			onSuccess: () => {
				onClose();
			}
		});
	};

	const handleDecline = () => {
		declineOffer(
			{ offerId, rejectionReason },
			{
				onSuccess: () => {
					setIsDeclineDialogOpen(false);
					setRejectionReason('');
					onClose();
				}
			}
		);
	};

	const handleCounterOffer = () => {
		sendCounterOffer(
			{
				offerId,
				counterOfferAmount: parseFloat(counterOfferAmount),
				counterOfferMessage
			},
			{
				onSuccess: () => {
					setIsCounterDialogOpen(false);
					setCounterOfferAmount('');
					setCounterOfferMessage('');
					onClose();
				}
			}
		);
	};

	const handleRevoke = () => {
		revokeApproval(
			{ offerId, revocationReason },
			{
				onSuccess: () => {
					setIsRevokeDialogOpen(false);
					setRevocationReason('');
					onClose();
				}
			}
		);
	};

	const canAccept = offer.status?.toUpperCase() === 'PENDING';
	const canDecline = ['PENDING', 'COUNTER_OFFERED'].includes(offer.status?.toUpperCase());
	const canCounter = offer.status?.toUpperCase() === 'PENDING';
	const canRevoke = ['ACCEPTED', 'APPROVED'].includes(offer.status?.toUpperCase());

	return (
		<>
			<Drawer
				anchor="right"
				open={open}
				onClose={onClose}
				PaperProps={{
					sx: {
						width: { xs: '90%', sm: '70%', md: '50%' },
						maxWidth: '700px'
					}
				}}
			>
				<Box className="h-full flex flex-col">
					{/* Header */}
					<Box className="p-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
						<Box className="flex items-center justify-between mb-12">
							<Typography className="text-xl font-bold">Offer Details</Typography>
							<IconButton
								onClick={onClose}
								size="small"
								className="text-white"
							>
								<FuseSvgIcon size={24}>heroicons-outline:x</FuseSvgIcon>
							</IconButton>
						</Box>
						{offer.offerAmount && (
							<Box className="flex items-center gap-12">
								<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
									<FuseSvgIcon
										className="text-white"
										size={24}
									>
										heroicons-outline:currency-dollar
									</FuseSvgIcon>
								</Box>
								<Box>
									<Typography className="text-sm opacity-90">Offer Amount</Typography>
									<Typography className="text-2xl font-bold">
										{formatCurrency(offer.offerAmount)}
									</Typography>
								</Box>
							</Box>
						)}
					</Box>

					{/* Content */}
					<Box className="flex-1 overflow-y-auto p-20 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 dark:scrollbar-thumb-green-600 dark:scrollbar-track-gray-800">
						{isLoading ? (
							<Box className="flex items-center justify-center h-full">
								<CircularProgress />
							</Box>
						) : !offer.id ? (
							<Box className="flex flex-col items-center justify-center h-full text-center">
								<FuseSvgIcon
									className="text-gray-400"
									size={64}
								>
									heroicons-outline:inbox
								</FuseSvgIcon>
								<Typography className="text-gray-500 mt-16 text-lg">Offer not found</Typography>
							</Box>
						) : (
							<Box className="flex flex-col gap-16">
								{/* Status */}
								<Paper className="p-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
									<Box className="flex items-center justify-between">
										<Typography className="text-sm font-semibold text-gray-600">Status</Typography>
										<Chip
											label={offer.status || 'PENDING'}
											color={getStatusColor(offer.status)}
											size="medium"
										/>
									</Box>
								</Paper>

								<Divider />

								{/* Property Information */}
								<Box>
									<Typography className="text-sm font-semibold text-gray-600 mb-12">
										Property Information
									</Typography>
									<Paper className="p-16">
										<Box className="flex items-start gap-12 mb-12">
											<FuseSvgIcon
												size={20}
												className="text-gray-500"
											>
												heroicons-outline:home
											</FuseSvgIcon>
											<Box className="flex-1">
												<Typography className="text-sm text-gray-500">
													Property Title
												</Typography>
												<Typography className="text-base font-medium">
													{offer.propertyTitle || 'N/A'}
												</Typography>
											</Box>
										</Box>
										{offer.propertyPrice && (
											<Box className="flex items-start gap-12">
												<FuseSvgIcon
													size={20}
													className="text-gray-500"
												>
													heroicons-outline:tag
												</FuseSvgIcon>
												<Box className="flex-1">
													<Typography className="text-sm text-gray-500">
														Listed Price
													</Typography>
													<Typography className="text-base font-medium">
														{formatCurrency(offer.propertyPrice)}
													</Typography>
												</Box>
											</Box>
										)}
									</Paper>
								</Box>

								<Divider />

								{/* Buyer Information */}
								<Box>
									<Typography className="text-sm font-semibold text-gray-600 mb-12">
										Buyer Information
									</Typography>
									<Paper className="p-16">
										<Box className="flex items-start gap-12 mb-12">
											<FuseSvgIcon
												size={20}
												className="text-gray-500"
											>
												heroicons-outline:user
											</FuseSvgIcon>
											<Box className="flex-1">
												<Typography className="text-sm text-gray-500">Name</Typography>
												<Typography className="text-base font-medium">
													{offer.buyerName || 'N/A'}
												</Typography>
											</Box>
										</Box>
										{offer.buyerEmail && (
											<Box className="flex items-start gap-12 mb-12">
												<FuseSvgIcon
													size={20}
													className="text-gray-500"
												>
													heroicons-outline:mail
												</FuseSvgIcon>
												<Box className="flex-1">
													<Typography className="text-sm text-gray-500">Email</Typography>
													<Typography className="text-base font-medium">
														{offer.buyerEmail}
													</Typography>
												</Box>
											</Box>
										)}
										{offer.buyerPhone && (
											<Box className="flex items-start gap-12">
												<FuseSvgIcon
													size={20}
													className="text-gray-500"
												>
													heroicons-outline:phone
												</FuseSvgIcon>
												<Box className="flex-1">
													<Typography className="text-sm text-gray-500">Phone</Typography>
													<Typography className="text-base font-medium">
														{offer.buyerPhone}
													</Typography>
												</Box>
											</Box>
										)}
									</Paper>
								</Box>

								<Divider />

								{/* Offer Message */}
								{offer.message && (
									<>
										<Box>
											<Typography className="text-sm font-semibold text-gray-600 mb-12">
												Message from Buyer
											</Typography>
											<Paper className="p-16 bg-gray-50 dark:bg-gray-800">
												<Typography className="text-sm">{offer.message}</Typography>
											</Paper>
										</Box>
										<Divider />
									</>
								)}

								{/* Counter Offer History */}
								{offer.counterOfferAmount && (
									<>
										<Box>
											<Typography className="text-sm font-semibold text-gray-600 mb-12">
												Counter Offer
											</Typography>
											<Paper className="p-16 bg-blue-50 dark:bg-blue-900/20">
												<Typography className="text-lg font-bold text-blue-600 mb-8">
													{formatCurrency(offer.counterOfferAmount)}
												</Typography>
												{offer.counterOfferMessage && (
													<Typography className="text-sm">
														{offer.counterOfferMessage}
													</Typography>
												)}
											</Paper>
										</Box>
										<Divider />
									</>
								)}

								{/* Metadata */}
								<Box className="text-xs text-gray-500">
									<Box className="flex items-center gap-8 mb-8">
										<FuseSvgIcon size={14}>heroicons-outline:calendar</FuseSvgIcon>
										<Typography className="text-xs">
											Created:{' '}
											{new Date(offer.createdAt || offer.offerDate).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</Typography>
									</Box>
									{offer.id && (
										<Box className="flex items-center gap-8">
											<FuseSvgIcon size={14}>heroicons-outline:identification</FuseSvgIcon>
											<Typography className="text-xs">Offer ID: {offer.id}</Typography>
										</Box>
									)}
								</Box>
							</Box>
						)}
					</Box>

					{/* Action Buttons */}
					{!isLoading && offer.id && (
						<Box className="p-20 border-t border-gray-200 dark:border-gray-700">
							<Grid
								container
								spacing={2}
							>
								{canAccept && (
									<Grid
										item
										xs={12}
										sm={6}
									>
										<Button
											fullWidth
											variant="contained"
											color="success"
											startIcon={<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>}
											onClick={handleAccept}
											disabled={isAccepting}
										>
											{isAccepting ? 'Accepting...' : 'Accept Offer'}
										</Button>
									</Grid>
								)}
								{canDecline && (
									<Grid
										item
										xs={12}
										sm={6}
									>
										<Button
											fullWidth
											variant="contained"
											color="error"
											startIcon={<FuseSvgIcon>heroicons-outline:x-circle</FuseSvgIcon>}
											onClick={() => setIsDeclineDialogOpen(true)}
										>
											Decline Offer
										</Button>
									</Grid>
								)}
								{canCounter && (
									<Grid
										item
										xs={12}
										sm={6}
									>
										<Button
											fullWidth
											variant="contained"
											color="info"
											startIcon={<FuseSvgIcon>heroicons-outline:arrow-path</FuseSvgIcon>}
											onClick={() => setIsCounterDialogOpen(true)}
										>
											Counter Offer
										</Button>
									</Grid>
								)}
								{canRevoke && (
									<Grid
										item
										xs={12}
									>
										<Button
											fullWidth
											variant="outlined"
											color="warning"
											startIcon={
												<FuseSvgIcon>heroicons-outline:exclamation-triangle</FuseSvgIcon>
											}
											onClick={() => setIsRevokeDialogOpen(true)}
										>
											Revoke Approval
										</Button>
									</Grid>
								)}
							</Grid>
						</Box>
					)}
				</Box>
			</Drawer>

			{/* Decline Offer Dialog */}
			<Dialog
				open={isDeclineDialogOpen}
				onClose={() => setIsDeclineDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Decline Offer</DialogTitle>
				<DialogContent>
					<Typography className="text-sm text-gray-600 mb-16">
						Are you sure you want to decline this offer? You can optionally provide a reason.
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Rejection Reason (Optional)"
						value={rejectionReason}
						onChange={(e) => setRejectionReason(e.target.value)}
						placeholder="Provide a reason for declining..."
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsDeclineDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleDecline}
						color="error"
						variant="contained"
						disabled={isDeclining}
					>
						{isDeclining ? 'Declining...' : 'Decline Offer'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Counter Offer Dialog */}
			<Dialog
				open={isCounterDialogOpen}
				onClose={() => setIsCounterDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Send Counter Offer</DialogTitle>
				<DialogContent>
					<Typography className="text-sm text-gray-600 mb-16">
						Current offer: {formatCurrency(offer.offerAmount || 0)}
					</Typography>
					<TextField
						fullWidth
						type="number"
						label="Counter Offer Amount"
						value={counterOfferAmount}
						onChange={(e) => setCounterOfferAmount(e.target.value)}
						placeholder="Enter your counter offer amount"
						className="mb-16"
						required
					/>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Message (Optional)"
						value={counterOfferMessage}
						onChange={(e) => setCounterOfferMessage(e.target.value)}
						placeholder="Add a message to your counter offer..."
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsCounterDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleCounterOffer}
						color="info"
						variant="contained"
						disabled={isSendingCounter || !counterOfferAmount}
					>
						{isSendingCounter ? 'Sending...' : 'Send Counter Offer'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Revoke Approval Dialog */}
			<Dialog
				open={isRevokeDialogOpen}
				onClose={() => setIsRevokeDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Revoke Offer Approval</DialogTitle>
				<DialogContent>
					<Typography className="text-sm text-gray-600 mb-16">
						Are you sure you want to revoke the approval for this offer? Please provide a reason.
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Revocation Reason"
						value={revocationReason}
						onChange={(e) => setRevocationReason(e.target.value)}
						placeholder="Provide a reason for revoking approval..."
						required
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsRevokeDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleRevoke}
						color="warning"
						variant="contained"
						disabled={isRevoking || !revocationReason}
					>
						{isRevoking ? 'Revoking...' : 'Revoke Approval'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default memo(OfferDetailsSlider);
