import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import {
	Box,
	Button,
	Chip,
	Divider,
	Skeleton,
	Tooltip,
	useTheme,
	alpha
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import CreateAccountDialog from './CreateAccountDialog';

/**
 * The PreviousStatementWidget widget.
 */
function PreviousStatementWidget({
	account,
	hasAccount,
	accountLoading,
	accountError,
	refetchAccount,
	shopData
}) {
	const theme = useTheme();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	if (accountLoading) {
		return (
			<Paper className="relative flex flex-col flex-auto p-24 pr-12 pb-12 rounded-2xl shadow overflow-hidden">
				<Box className="space-y-16">
					<Skeleton
						variant="text"
						width="60%"
						height={32}
					/>
					<Skeleton
						variant="text"
						width="80%"
						height={24}
					/>
					<Box className="flex gap-24 mt-24">
						<Skeleton
							variant="rectangular"
							width={120}
							height={60}
						/>
						<Skeleton
							variant="rectangular"
							width={120}
							height={60}
						/>
					</Box>
				</Box>
			</Paper>
		);
	}

	if (!hasAccount || !account) {
		return (
			<>
				<NoAccountView
					onCreateAccount={() => setOpenCreateDialog(true)}
					accountError={accountError}
				/>
				<CreateAccountDialog
					open={openCreateDialog}
					onClose={() => setOpenCreateDialog(false)}
					onSuccess={refetchAccount}
					shopData={shopData}
				/>
			</>
		);
	}

	return (
		<Paper
			className="relative flex flex-col flex-auto p-24 pr-12 pb-12 rounded-2xl shadow-lg overflow-hidden"
			sx={{
				background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
			}}
		>
			<Box className="flex items-center justify-between mb-16">
				<Box className="flex items-center gap-12">
					<Box
						className="flex items-center justify-center w-40 h-40 rounded-lg"
						sx={{
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
						}}
					>
						<FuseSvgIcon
							className="text-white"
							size={20}
						>
							heroicons-outline:credit-card
						</FuseSvgIcon>
					</Box>
					<Box>
						<Typography className="text-lg font-semibold tracking-tight leading-6 truncate">
							{account?.accountName || 'Account Statement'}
						</Typography>
						<Box className="flex items-center gap-8 mt-4">
							<Chip
								label={account?.accountNumber || 'N/A'}
								size="small"
								color="primary"
								variant="outlined"
								sx={{ height: 20, fontSize: '0.7rem' }}
							/>
							<Chip
								label={account?.accountTier || 'CURRENT'}
								size="small"
								color="secondary"
								sx={{ height: 20, fontSize: '0.7rem' }}
							/>
							{account?.isVerified && (
								<Tooltip title="Verified Account">
									<FuseSvgIcon
										size={16}
										className="text-green-600"
									>
										heroicons-solid:check-badge
									</FuseSvgIcon>
								</Tooltip>
							)}
						</Box>
					</Box>
				</Box>
				<Tooltip title="More options">
					<IconButton
						aria-label="more"
						size="small"
					>
						<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
					</IconButton>
				</Tooltip>
			</Box>

			<Divider className="my-12" />

			<Box className="flex flex-col gap-16 mt-16">
				<Box className="flex flex-col">
					<Typography
						color="text.secondary"
						className="text-xs font-medium uppercase tracking-wider mb-8"
					>
						Current Balance
					</Typography>
					<Typography
						className="font-bold text-4xl leading-none"
						sx={{
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent'
						}}
					>
						{account?.accountBalance?.toLocaleString('en-NG', {
							style: 'currency',
							currency: 'NGN'
						})}
					</Typography>
				</Box>

				<Box className="grid grid-cols-2 gap-16">
					<Box
						className="p-12 rounded-lg"
						sx={{ backgroundColor: alpha(theme.palette.success.main, 0.1) }}
					>
						<Box className="flex items-center gap-8 mb-4">
							<FuseSvgIcon
								size={16}
								className="text-green-600"
							>
								heroicons-outline:arrow-trending-up
							</FuseSvgIcon>
							<Typography
								variant="caption"
								className="font-medium text-green-800 dark:text-green-400"
							>
								Received
							</Typography>
						</Box>
						<Typography
							variant="body2"
							className="font-semibold"
						>
							{account?.receivedTransactions?.length || 0} transactions
						</Typography>
					</Box>

					<Box
						className="p-12 rounded-lg"
						sx={{ backgroundColor: alpha(theme.palette.error.main, 0.1) }}
					>
						<Box className="flex items-center gap-8 mb-4">
							<FuseSvgIcon
								size={16}
								className="text-red-600"
							>
								heroicons-outline:arrow-trending-down
							</FuseSvgIcon>
							<Typography
								variant="caption"
								className="font-medium text-red-800 dark:text-red-400"
							>
								Sent
							</Typography>
						</Box>
						<Typography
							variant="body2"
							className="font-semibold"
						>
							{account?.sentTransactions?.length || 0} transactions
						</Typography>
					</Box>
				</Box>

				{account?.previousBalance !== undefined && account?.previousBalance !== account?.accountBalance && (
					<Box className="flex items-center gap-8 p-12 rounded-lg bg-gray-100 dark:bg-gray-800 mt-8">
						<FuseSvgIcon
							size={16}
							className="text-gray-600"
						>
							heroicons-outline:clock
						</FuseSvgIcon>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Previous Balance:{' '}
							{account?.previousBalance?.toLocaleString('en-NG', {
								style: 'currency',
								currency: 'NGN'
							})}
						</Typography>
					</Box>
				)}
			</Box>

			<Box className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24 opacity-10">
				<FuseSvgIcon
					size={96}
					className="text-primary"
				>
					heroicons-outline:check-circle
				</FuseSvgIcon>
			</Box>
		</Paper>
	);
}

/**
 * No Account View Component
 */
function NoAccountView({ onCreateAccount, accountError }) {
	const theme = useTheme();

	return (
		<Paper
			className="relative flex flex-col flex-auto p-24 rounded-2xl shadow-lg overflow-hidden"
			sx={{
				background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
			}}
		>
			<Box className="flex flex-col items-center justify-center text-center py-24">
				<Box
					className="flex items-center justify-center w-80 h-80 rounded-full mb-24"
					sx={{
						background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
					}}
				>
					<FuseSvgIcon
						size={48}
						className="text-primary"
					>
						heroicons-outline:wallet
					</FuseSvgIcon>
				</Box>

				<Typography
					variant="h5"
					className="font-bold mb-8"
				>
					Welcome to AfricanShops Finance
				</Typography>

				<Typography
					variant="body2"
					color="text.secondary"
					className="max-w-sm mb-24"
				>
					Create your merchant finance account to start accepting payments, managing transactions, and tracking
					your business finances in real-time.
				</Typography>

				{accountError && (
					<Box
						className="w-full max-w-md p-12 rounded-lg mb-16"
						sx={{ backgroundColor: alpha(theme.palette.error.main, 0.1) }}
					>
						<Box className="flex items-center gap-8">
							<FuseSvgIcon
								size={20}
								className="text-red-600"
							>
								heroicons-outline:exclamation-circle
							</FuseSvgIcon>
							<Typography
								variant="caption"
								className="text-red-600"
							>
								Unable to fetch account. Please try again.
							</Typography>
						</Box>
					</Box>
				)}

				<Button
					variant="contained"
					color="secondary"
					size="large"
					onClick={onCreateAccount}
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
					className="font-semibold"
					sx={{
						background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
						'&:hover': {
							background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
						}
					}}
				>
					Create Finance Account
				</Button>

				<Box className="grid grid-cols-3 gap-16 mt-32 w-full max-w-lg">
					{[
						{ icon: 'heroicons-outline:shield-check', label: 'Secure' },
						{ icon: 'heroicons-outline:lightning-bolt', label: 'Fast' },
						{ icon: 'heroicons-outline:chart-bar', label: 'Analytics' }
					].map((feature, index) => (
						<Box
							key={index}
							className="flex flex-col items-center p-12 rounded-lg"
							sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.5) }}
						>
							<FuseSvgIcon
								size={24}
								className="text-primary mb-8"
							>
								{feature.icon}
							</FuseSvgIcon>
							<Typography
								variant="caption"
								className="font-medium"
							>
								{feature.label}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>
		</Paper>
	);
}

export default memo(PreviousStatementWidget);
