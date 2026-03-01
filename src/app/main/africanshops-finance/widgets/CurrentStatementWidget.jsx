import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { memo, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import LinkBankAccountDialog from './LinkBankAccountDialog';
import WithdrawFundsDialog from './WithdrawFundsDialog';

/**
 * The CurrentStatementWidget widget.
 */
function CurrentStatementWidget({ shopData, shopDataLoading }) {
	const [linkBankDialogOpen, setLinkBankDialogOpen] = useState(false);
	const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

	if (shopDataLoading) {
		return <FuseLoading />;
	}

	if (!shopData) {
		return null;
	}

	const accountBalance = shopData?.shopaccount?.accountbalance || 0;
	const hasLinkedBank = shopData?.linkedBankName && shopData?.linkedBankAccountNumber;

	const handleWithdrawClick = () => {
		if (!hasLinkedBank) {
			setLinkBankDialogOpen(true);
		} else {
			setWithdrawDialogOpen(true);
		}
	};

	return (
		<>
			<Paper
				className="relative flex flex-col flex-auto p-32 rounded-2xl shadow-lg overflow-hidden"
				sx={{
					background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
					border: '1px solid',
					borderColor: 'divider'
				}}
			>
				{/* Header Section */}
				<Box className="flex items-start justify-between mb-24">
					<Box className="flex items-start gap-16">
						<Box
							className="flex items-center justify-center w-56 h-56 rounded-xl"
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								boxShadow: '0 8px 16px 0 rgba(102, 126, 234, 0.4)'
							}}
						>
							<FuseSvgIcon
								size={28}
								className="text-white"
							>
								heroicons-outline:currency-dollar
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography className="text-lg font-semibold tracking-tight leading-6">
								Available Balance
							</Typography>
							<Typography
								variant="caption"
								className="text-sm mt-4 flex items-center gap-8"
								color="text.secondary"
							>
								Merchant's Earnings
								<Chip
									label="Live"
									size="small"
									sx={{
										height: 20,
										fontSize: '0.7rem',
										background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
										color: 'white',
										fontWeight: 600
									}}
								/>
							</Typography>
						</Box>
					</Box>

					<Tooltip title="Refresh balance">
						<IconButton size="small">
							<FuseSvgIcon
								size={20}
								className="text-gray-600 dark:text-gray-400"
							>
								heroicons-outline:refresh
							</FuseSvgIcon>
						</IconButton>
					</Tooltip>
				</Box>

				{/* Balance Display */}
				<Box className="mb-32">
					<Typography
						className="font-bold text-5xl leading-none mb-8"
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text'
						}}
					>
						{accountBalance.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Total earnings from trades
					</Typography>
				</Box>

				{/* Bank Account Status */}
				<Box className="mb-24 p-16 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
					<Box className="flex items-center justify-between">
						<Box className="flex items-center gap-12">
							<FuseSvgIcon
								size={20}
								className={hasLinkedBank ? 'text-green-600' : 'text-orange-600'}
							>
								{hasLinkedBank ? 'heroicons-solid:check-badge' : 'heroicons-outline:exclamation-triangle'}
							</FuseSvgIcon>
							<Box>
								<Typography
									variant="body2"
									className="font-medium"
								>
									{hasLinkedBank ? 'Bank Account Linked' : 'No Bank Account Linked'}
								</Typography>
								{hasLinkedBank ? (
									<Typography
										variant="caption"
										color="text.secondary"
									>
										{shopData?.linkedBankName} - ****
										{shopData?.linkedBankAccountNumber?.slice(-4)}
									</Typography>
								) : (
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Link your bank account to enable withdrawals
									</Typography>
								)}
							</Box>
						</Box>
						{!hasLinkedBank && (
							<Button
								variant="text"
								size="small"
								color="secondary"
								onClick={() => setLinkBankDialogOpen(true)}
								startIcon={<FuseSvgIcon size={16}>heroicons-outline:link</FuseSvgIcon>}
							>
								Link Now
							</Button>
						)}
					</Box>
				</Box>

				{/* Action Buttons */}
				<Box className="flex gap-12">
					<Button
						variant="contained"
						fullWidth
						size="large"
						disabled={accountBalance <= 0}
						onClick={handleWithdrawClick}
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							boxShadow: '0 4px 12px 0 rgba(102, 126, 234, 0.4)',
							'&:hover': {
								background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
								boxShadow: '0 6px 16px 0 rgba(102, 126, 234, 0.6)'
							},
							'&:disabled': {
								background: 'rgba(0, 0, 0, 0.12)',
								boxShadow: 'none'
							}
						}}
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:arrow-down-tray</FuseSvgIcon>}
					>
						Withdraw Funds
					</Button>

					<Tooltip title="View transaction history">
						<IconButton
							size="large"
							sx={{
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 2
							}}
						>
							<FuseSvgIcon size={20}>heroicons-outline:document-text</FuseSvgIcon>
						</IconButton>
					</Tooltip>
				</Box>

				{/* Background Decoration */}
				<Box
					className="absolute -bottom-24 -right-24 opacity-10 dark:opacity-5"
					sx={{
						width: 200,
						height: 200,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						borderRadius: '50%',
						filter: 'blur(40px)'
					}}
				/>
			</Paper>

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
		</>
	);
}

export default memo(CurrentStatementWidget);
