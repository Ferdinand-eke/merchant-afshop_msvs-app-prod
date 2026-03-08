import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Grid, Divider, alpha, useTheme } from '@mui/material';
import { memo, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { StatementWidgetSkeleton } from './FinanceLoadingSkeleton';
import LinkBankAccountDialog from './LinkBankAccountDialog';
import WithdrawFundsDialog from './WithdrawFundsDialog';
import RemittancePlatformChargeDialog from './RemittancePlatformChargeDialog';

/**
 * The CurrentStatementWidget widget.
 */
function CurrentStatementWidget({ shopData, shopDataLoading }) {
	const theme = useTheme();
	const [linkBankDialogOpen, setLinkBankDialogOpen] = useState(false);
	const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
	const [remittanceDialogOpen, setRemittanceDialogOpen] = useState(false);

	if (shopDataLoading) {
		return <StatementWidgetSkeleton />;
	}

	if (!shopData) {
		return null;
	}

	// Extract account balances
	const accountBalance = shopData?.shopaccount?.accountbalance || 0;
	const deskBalance = shopData?.shopdeskaccount?.deskbalance || 0;
	const platformChargeBalance = shopData?.platformChargeAccount?.servicechargebalance || 0;
	const hasLinkedBank = shopData?.linkedBankName && shopData?.linkedBankAccountNumber;

	const handleWithdrawClick = () => {
		if (!hasLinkedBank) {
			setLinkBankDialogOpen(true);
		} else {
			setWithdrawDialogOpen(true);
		}
	};

	const handleRemittanceSuccess = () => {
		// Here you can call an API to update the backend with the remittance info

		// Close dialog
		setRemittanceDialogOpen(false);

		// You might want to refresh the shop data here
		// refetchShopData();
	};

	return (
		<>
			{/* Main Header */}
			<Box className="flex items-center justify-between mb-24">
				<Box>
					<Typography
						variant="h5"
						className="font-bold"
					>
						Account Overview
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Monitor all your account balances and transactions
					</Typography>
				</Box>
				<Tooltip title="Refresh all balances">
					<IconButton>
						<FuseSvgIcon size={20}>heroicons-outline:arrow-path</FuseSvgIcon>
					</IconButton>
				</Tooltip>
			</Box>

			{/* Three Account Cards Grid */}
			<Grid
				container
				spacing={3}
			>
				{/* 1. Platform Earnings Account (Main Shop Account) */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Paper
						className="relative flex flex-col p-24 rounded-2xl shadow-lg overflow-hidden h-full"
						sx={{
							background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
							border: '1px solid',
							borderColor: 'divider'
						}}
					>
						{/* Account Icon & Title */}
						<Box className="flex items-start gap-12 mb-16">
							<Box
								className="flex items-center justify-center w-48 h-48 rounded-xl"
								sx={{
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									boxShadow: '0 4px 12px 0 rgba(102, 126, 234, 0.4)'
								}}
							>
								<FuseSvgIcon
									size={24}
									className="text-white"
								>
									heroicons-outline:currency-dollar
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography className="font-semibold">Platform Earnings</Typography>
								<Chip
									label="Withdrawable"
									size="small"
									sx={{
										height: 18,
										fontSize: '0.65rem',
										background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
										color: 'white',
										fontWeight: 600,
										mt: 0.5
									}}
								/>
							</Box>
						</Box>

						{/* Balance */}
						<Typography
							className="font-bold text-3xl mb-4"
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							{accountBalance.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN',
								minimumFractionDigits: 0
							})}
						</Typography>

						<Typography
							variant="caption"
							color="text.secondary"
							className="mb-16"
						>
							From platform-tracked trades
						</Typography>

						<Divider className="mb-16" />

						{/* Bank Status */}
						<Box
							className="p-12 rounded-lg mb-16"
							sx={{
								backgroundColor: alpha(
									hasLinkedBank ? theme.palette.success.main : theme.palette.warning.main,
									0.1
								)
							}}
						>
							<Box className="flex items-center gap-8">
								<FuseSvgIcon
									size={16}
									className={hasLinkedBank ? 'text-green-600' : 'text-orange-600'}
								>
									{hasLinkedBank
										? 'heroicons-solid:check-badge'
										: 'heroicons-outline:exclamation-triangle'}
								</FuseSvgIcon>
								<Typography variant="caption">{hasLinkedBank ? 'Bank Linked' : 'Link Bank'}</Typography>
							</Box>
						</Box>

						{/* Action Button */}
						<Button
							variant="contained"
							fullWidth
							disabled={accountBalance <= 0}
							onClick={handleWithdrawClick}
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								'&:hover': {
									background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)'
								}
							}}
							startIcon={<FuseSvgIcon size={18}>heroicons-outline:arrow-down-tray</FuseSvgIcon>}
						>
							Withdraw
						</Button>

						{/* Decoration */}
						<Box
							className="absolute -bottom-12 -right-12 opacity-10"
							sx={{
								width: 100,
								height: 100,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '50%',
								filter: 'blur(30px)'
							}}
						/>
					</Paper>
				</Grid>

				{/* 2. Desk Account (Walk-in/POS Transactions) */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Paper
						className="relative flex flex-col p-24 rounded-2xl shadow-lg overflow-hidden h-full"
						sx={{
							background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
							border: '1px solid',
							borderColor: 'divider'
						}}
					>
						{/* Account Icon & Title */}
						<Box className="flex items-start gap-12 mb-16">
							<Box
								className="flex items-center justify-center w-48 h-48 rounded-xl"
								sx={{
									background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									boxShadow: '0 4px 12px 0 rgba(16, 185, 129, 0.4)'
								}}
							>
								<FuseSvgIcon
									size={24}
									className="text-white"
								>
									heroicons-outline:building-storefront
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography className="font-semibold">Desk Account</Typography>
								<Chip
									label="Direct Sales"
									size="small"
									sx={{
										height: 18,
										fontSize: '0.65rem',
										background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
										color: 'white',
										fontWeight: 600,
										mt: 0.5
									}}
								/>
							</Box>
						</Box>

						{/* Balance */}
						<Typography
							className="font-bold text-3xl mb-4"
							sx={{
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							{deskBalance.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN',
								minimumFractionDigits: 0
							})}
						</Typography>

						<Typography
							variant="caption"
							color="text.secondary"
							className="mb-16"
						>
							Walk-in, POS & cash transactions
						</Typography>

						<Divider className="mb-16" />

						{/* Info Box */}
						<Box
							className="p-12 rounded-lg mb-16"
							sx={{
								backgroundColor: alpha(theme.palette.info.main, 0.1)
							}}
						>
							<Box className="flex items-start gap-8">
								<FuseSvgIcon
									size={16}
									className="text-info"
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									These are direct payments to your business not tracked by the platform
								</Typography>
							</Box>
						</Box>

						{/* Action Button */}
						<Button
							variant="contained"
							fullWidth
							color="success"
							disabled
							sx={{
								opacity: 0.6
							}}
							startIcon={<FuseSvgIcon size={18}>heroicons-outline:eye</FuseSvgIcon>}
						>
							View Only
						</Button>

						{/* Decoration */}
						<Box
							className="absolute -bottom-12 -right-12 opacity-10"
							sx={{
								width: 100,
								height: 100,
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								borderRadius: '50%',
								filter: 'blur(30px)'
							}}
						/>
					</Paper>
				</Grid>

				{/* 3. Platform Charges (Service Fees Owed) */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Paper
						className="relative flex flex-col p-24 rounded-2xl shadow-lg overflow-hidden h-full"
						sx={{
							background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
							border: '1px solid',
							borderColor: 'divider'
						}}
					>
						{/* Account Icon & Title */}
						<Box className="flex items-start gap-12 mb-16">
							<Box
								className="flex items-center justify-center w-48 h-48 rounded-xl"
								sx={{
									background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
									boxShadow: '0 4px 12px 0 rgba(239, 68, 68, 0.4)'
								}}
							>
								<FuseSvgIcon
									size={24}
									className="text-white"
								>
									heroicons-outline:receipt-percent
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography className="font-semibold">Platform Charges</Typography>
								<Chip
									label={platformChargeBalance > 0 ? 'Payment Due' : 'Paid'}
									size="small"
									sx={{
										height: 18,
										fontSize: '0.65rem',
										background:
											platformChargeBalance > 0
												? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
												: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
										color: 'white',
										fontWeight: 600,
										mt: 0.5
									}}
								/>
							</Box>
						</Box>

						{/* Balance */}
						<Typography
							className="font-bold text-3xl mb-4"
							sx={{
								background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							{platformChargeBalance.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN',
								minimumFractionDigits: 0
							})}
						</Typography>

						<Typography
							variant="caption"
							color="text.secondary"
							className="mb-16"
						>
							Service charges from desk transactions
						</Typography>

						<Divider className="mb-16" />

						{/* Warning Box */}
						{platformChargeBalance > 0 && (
							<Box
								className="p-12 rounded-lg mb-16"
								sx={{
									backgroundColor: alpha(theme.palette.warning.main, 0.1)
								}}
							>
								<Box className="flex items-start gap-8">
									<FuseSvgIcon
										size={16}
										className="text-warning"
									>
										heroicons-outline:exclamation-triangle
									</FuseSvgIcon>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Please remit service charges to continue operations
									</Typography>
								</Box>
							</Box>
						)}

						{/* Action Button */}
						<Button
							variant="contained"
							fullWidth
							color="error"
							disabled={platformChargeBalance <= 0}
							onClick={() => setRemittanceDialogOpen(true)}
							sx={{
								background:
									platformChargeBalance > 0
										? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
										: undefined,
								'&:hover':
									platformChargeBalance > 0
										? {
												background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
											}
										: undefined
							}}
							startIcon={<FuseSvgIcon size={18}>heroicons-outline:credit-card</FuseSvgIcon>}
						>
							{platformChargeBalance > 0 ? 'Pay Now' : 'No Charges'}
						</Button>

						{/* Decoration */}
						<Box
							className="absolute -bottom-12 -right-12 opacity-10"
							sx={{
								width: 100,
								height: 100,
								background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
								borderRadius: '50%',
								filter: 'blur(30px)'
							}}
						/>
					</Paper>
				</Grid>
			</Grid>

			{/* Dialogs */}
			<LinkBankAccountDialog
				open={linkBankDialogOpen}
				onClose={() => setLinkBankDialogOpen(false)}
				shopData={shopData}
			/>

			<WithdrawFundsDialog
				open={withdrawDialogOpen}
				onClose={() => setWithdrawDialogOpen(false)}
				shopData={shopData}
				availableBalance={accountBalance}
			/>

			<RemittancePlatformChargeDialog
				open={remittanceDialogOpen}
				onClose={() => setRemittanceDialogOpen(false)}
				shopData={shopData}
				onRemittanceSuccess={handleRemittanceSuccess}
			/>
		</>
	);
}

export default memo(CurrentStatementWidget);
