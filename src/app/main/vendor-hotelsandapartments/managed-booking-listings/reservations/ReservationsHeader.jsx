import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Box, Paper, Chip } from '@mui/material';

/**
 * The reservations header.
 */
function ReservationsHeader() {
	return (
		<Box className="px-24 pt-24 pb-16">
			<Paper
				elevation={0}
				component={motion.div}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
				sx={{
					p: 3,
					background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
					border: '1px solid rgba(234, 88, 12, 0.1)',
					borderRadius: 2,
				}}
			>
				<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
					{/* Title Section */}
					<Box className="flex items-center gap-16">
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: '14px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FuseSvgIcon className="text-white" size={28}>
								heroicons-outline:calendar
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h5"
								className="font-bold mb-4"
								sx={{ color: '#292524' }}
							>
								Manage Bookings & Reservations
							</Typography>
							<Box className="flex items-center gap-8">
								<Chip
									label="All Properties"
									size="small"
									sx={{
										background: 'rgba(249, 115, 22, 0.1)',
										color: '#ea580c',
										fontWeight: 600,
										height: 24,
									}}
								/>
								<Typography variant="caption" color="text.secondary">
									Track and manage all your property reservations
								</Typography>
							</Box>
						</Box>
					</Box>

					{/* Action Button */}
					{/* <motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
					>
						<Button
							variant="contained"
							component={NavLinkAdapter}
							to="/bookings/managed-listings/new"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
							sx={{
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								color: 'white',
								fontWeight: 700,
								height: 48,
								px: 3,
								'&:hover': {
									background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
									boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)',
								},
							}}
						>
							Add Property
						</Button>
					</motion.div> */}
				</Box>
			</Paper>
		</Box>
	);
}

export default ReservationsHeader;
