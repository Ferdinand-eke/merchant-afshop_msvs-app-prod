import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useMyShopEstateProperties from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';

/**
 * The PropertiesHeader - Enhanced header for property listings management
 */
function PropertiesHeader() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { data: listingData, isLoading } = useMyShopEstateProperties();

	const totalProperties = listingData?.data?.properties?.length || 0;
	const activeProperties = listingData?.data?.properties?.filter((p) => p.isApproved)?.length || 0;
	const pendingProperties = totalProperties - activeProperties;

	return (
		<div className="w-full px-16 md:px-24 py-16">
			<Paper
				className="relative overflow-hidden rounded-2xl shadow-lg"
				sx={{
					background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
					color: 'white'
				}}
			>
				<Box className="relative z-10 p-24 sm:p-32">
					{/* Header Row */}
					<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16 mb-24">
						{/* Left Side - Title */}
						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
							className="flex items-center gap-16"
						>
							<Box
								className="flex items-center justify-center w-64 h-64 rounded-xl"
								sx={{
									backgroundColor: 'rgba(255, 255, 255, 0.2)',
									backdropFilter: 'blur(10px)'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={32}
								>
									heroicons-outline:office-building
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h4"
									className="font-bold mb-4"
								>
									Property Listings
								</Typography>
								<Typography
									variant="body2"
									className="opacity-90"
								>
									Manage and track all your real estate properties
								</Typography>
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
								to="/property/managed-listings/new"
								size={isMobile ? 'small' : 'large'}
								sx={{
									backgroundColor: 'rgba(255, 255, 255, 0.95)',
									color: '#ea580c',
									fontWeight: 700,
									'&:hover': {
										backgroundColor: 'white'
									}
								}}
								startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
							>
								Add New Property
							</Button>
						</motion.div>
					</Box>

					{/* Stats Row */}
					{!isLoading && (
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<Box className="grid grid-cols-1 sm:grid-cols-3 gap-12">
								{/* Total Properties */}
								<Box className="flex items-center gap-12 bg-white/10 backdrop-blur-sm rounded-xl p-16">
									<Box
										className="flex items-center justify-center w-48 h-48 rounded-lg"
										sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
									>
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:home
										</FuseSvgIcon>
									</Box>
									<Box>
										<Typography
											variant="h5"
											className="font-bold"
										>
											{totalProperties}
										</Typography>
										<Typography
											variant="caption"
											className="opacity-90"
										>
											Total Properties
										</Typography>
									</Box>
								</Box>

								{/* Active Listings */}
								<Box className="flex items-center gap-12 bg-white/10 backdrop-blur-sm rounded-xl p-16">
									<Box
										className="flex items-center justify-center w-48 h-48 rounded-lg"
										sx={{ backgroundColor: 'rgba(34, 197, 94, 0.3)' }}
									>
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:check-circle
										</FuseSvgIcon>
									</Box>
									<Box>
										<Typography
											variant="h5"
											className="font-bold"
										>
											{activeProperties}
										</Typography>
										<Typography
											variant="caption"
											className="opacity-90"
										>
											Active Listings
										</Typography>
									</Box>
								</Box>

								{/* Pending Approval */}
								<Box className="flex items-center gap-12 bg-white/10 backdrop-blur-sm rounded-xl p-16">
									<Box
										className="flex items-center justify-center w-48 h-48 rounded-lg"
										sx={{ backgroundColor: 'rgba(251, 191, 36, 0.3)' }}
									>
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:clock
										</FuseSvgIcon>
									</Box>
									<Box>
										<Typography
											variant="h5"
											className="font-bold"
										>
											{pendingProperties}
										</Typography>
										<Typography
											variant="caption"
											className="opacity-90"
										>
											Pending Approval
										</Typography>
									</Box>
								</Box>
							</Box>
						</motion.div>
					)}
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

export default PropertiesHeader;
