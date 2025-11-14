import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useMyShopBookingsProperties from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';

/**
 * The BookingPropertiesHeader - Enhanced header for booking listings management
 */
function BookingPropertiesHeader() {
	const { data: listingData, isLoading } = useMyShopBookingsProperties({ limit: 1000, offset: 0 });

	const totalProperties = listingData?.data?.bookingLists?.length || 0;
	const activeProperties = listingData?.data?.bookingLists?.filter((p) => p.isApproved)?.length || 0;
	const pendingProperties = totalProperties - activeProperties;

	return (
		<div className="w-full px-16 md:px-24 py-8">
			<Paper
				className="relative overflow-hidden rounded-xl shadow-lg"
				sx={{
					background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
					color: 'white'
				}}
			>
				<Box className="relative z-10 p-12 sm:p-16">
					{/* Compact Header Row */}
					<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-12">
						{/* Left Side - Title */}
						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
							className="flex items-center gap-12"
						>
							<Box
								className="flex items-center justify-center w-40 h-40 rounded-lg"
								sx={{
									backgroundColor: 'rgba(255, 255, 255, 0.2)',
									backdropFilter: 'blur(10px)'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={20}
								>
									heroicons-outline:home
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold mb-2"
								>
									Booking Listings
								</Typography>
								<Box className="flex items-center gap-12">
									{!isLoading && (
										<>
											<Typography
												variant="caption"
												className="opacity-90"
											>
												{totalProperties} Total
											</Typography>
											<Box
												sx={{
													width: 4,
													height: 4,
													borderRadius: '50%',
													backgroundColor: 'rgba(255, 255, 255, 0.5)'
												}}
											/>
											<Typography
												variant="caption"
												className="opacity-90"
											>
												{activeProperties} Active
											</Typography>
											<Box
												sx={{
													width: 4,
													height: 4,
													borderRadius: '50%',
													backgroundColor: 'rgba(255, 255, 255, 0.5)'
												}}
											/>
											<Typography
												variant="caption"
												className="opacity-90"
											>
												{pendingProperties} Pending
											</Typography>
										</>
									)}
								</Box>
							</Box>
						</motion.div>

						{/* Right Side - Action Button */}
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<Button
								variant="contained"
								component={NavLinkAdapter}
								to="/bookings/managed-listings/new"
								size="small"
								sx={{
									backgroundColor: 'rgba(255, 255, 255, 0.95)',
									color: '#ea580c',
									fontWeight: 700,
									height: 36,
									px: 2,
									'&:hover': {
										backgroundColor: 'white'
									}
								}}
								startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
							>
								Add Property
							</Button>
						</motion.div>
					</Box>
				</Box>

				{/* Decorative background pattern */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: '50%',
						height: '100%',
						opacity: 0.1,
						background: 'radial-gradient(circle at 100% 0%, white 0%, transparent 50%)'
					}}
				/>
			</Paper>
		</div>
	);
}

export default BookingPropertiesHeader;
