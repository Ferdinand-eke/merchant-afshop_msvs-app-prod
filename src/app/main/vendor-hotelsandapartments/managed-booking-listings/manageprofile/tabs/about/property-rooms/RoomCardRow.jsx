import React, { useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	Chip,
	Button,
	Grid,
	Divider,
	Paper
} from '@mui/material';
import {
	ChevronLeft,
	ChevronRight,
	Visibility,
	CalendarMonth,
	People,
	KingBed,
	Bathtub,
	SquareFoot
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * Enhanced RoomCardRow - Professional card layout for displaying rooms
 * Features:
 * - Image slider on the left
 * - Room details in the center
 * - Action buttons on the right
 * - Responsive design
 */

const RoomCardRow = ({
	room,
	onViewDetails,
	onViewAvailableDates,
	onBookForGuest
}) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const roomImages = room?.images || room?.imageSrcs || [];
	const hasImages = roomImages.length > 0;
	const currentImage = hasImages
		? roomImages[currentImageIndex]?.url || roomImages[currentImageIndex]
		: 'https://placehold.co/400x300?text=No+Image';

	const handlePrevImage = (e) => {
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : roomImages.length - 1));
	};

	const handleNextImage = (e) => {
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev < roomImages.length - 1 ? prev + 1 : 0));
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card
				elevation={0}
				sx={{
					mb: 2,
					border: '1px solid #e5e7eb',
					borderRadius: '16px',
					overflow: 'hidden',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
						transform: 'translateY(-4px)'
					}
				}}
			>
				<CardContent sx={{ p: 0 }}>
					<Grid container>
						{/* Image Slider Section - Left Side */}
						<Grid item xs={12} md={4}>
							<Box
								sx={{
									position: 'relative',
									height: { xs: 250, md: 280 },
									backgroundColor: '#f3f4f6',
									overflow: 'hidden'
								}}
							>
								{/* Main Image */}
								<img
									src={currentImage}
									alt={`${room?.title} - Image ${currentImageIndex + 1}`}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										cursor: 'pointer'
									}}
									onClick={() => onViewDetails(room)}
								/>

								{/* Navigation Arrows */}
								{hasImages && roomImages.length > 1 && (
									<>
										<IconButton
											onClick={handlePrevImage}
											sx={{
												position: 'absolute',
												left: 8,
												top: '50%',
												transform: 'translateY(-50%)',
												backgroundColor: 'rgba(255, 255, 255, 0.95)',
												width: 36,
												height: 36,
												'&:hover': {
													backgroundColor: 'rgba(255, 255, 255, 1)'
												},
												boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
											}}
										>
											<ChevronLeft fontSize="small" />
										</IconButton>

										<IconButton
											onClick={handleNextImage}
											sx={{
												position: 'absolute',
												right: 8,
												top: '50%',
												transform: 'translateY(-50%)',
												backgroundColor: 'rgba(255, 255, 255, 0.95)',
												width: 36,
												height: 36,
												'&:hover': {
													backgroundColor: 'rgba(255, 255, 255, 1)'
												},
												boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
											}}
										>
											<ChevronRight fontSize="small" />
										</IconButton>

										{/* Image Counter */}
										<Box
											sx={{
												position: 'absolute',
												bottom: 12,
												right: 12,
												backgroundColor: 'rgba(0, 0, 0, 0.7)',
												color: 'white',
												px: 1.5,
												py: 0.5,
												borderRadius: '16px',
												fontSize: '0.75rem',
												fontWeight: 600
											}}
										>
											{currentImageIndex + 1} / {roomImages.length}
										</Box>
									</>
								)}

								{/* View Details Overlay */}
								<Box
									sx={{
										position: 'absolute',
										top: 12,
										left: 12,
										backgroundColor: 'rgba(234, 88, 12, 0.95)',
										color: 'white',
										px: 1.5,
										py: 0.5,
										borderRadius: '8px',
										fontSize: '0.75rem',
										fontWeight: 700,
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										gap: 0.5,
										'&:hover': {
											backgroundColor: 'rgba(234, 88, 12, 1)'
										}
									}}
									onClick={() => onViewDetails(room)}
								>
									<Visibility sx={{ fontSize: 14 }} />
									Quick View
								</Box>
							</Box>
						</Grid>

						{/* Room Details Section - Center */}
						<Grid item xs={12} md={5}>
							<Box sx={{ p: { xs: 2, md: 3 } }}>
								{/* Room Title */}
								<Typography
									variant="h6"
									sx={{
										fontWeight: 700,
										color: '#111827',
										mb: 1,
										fontSize: { xs: '1.125rem', md: '1.25rem' }
									}}
								>
									{room?.title}
								</Typography>

								{/* Room Number */}
								{room?.roomNumber && (
									<Chip
										label={`Room #${room?.roomNumber}`}
										size="small"
										sx={{
											mb: 2,
											backgroundColor: '#fef3e2',
											color: '#ea580c',
											fontWeight: 600,
											height: 24
										}}
									/>
								)}

								{/* Room Description - Truncated */}
								{room?.description && (
									<Typography
										variant="body2"
										sx={{
											color: '#6b7280',
											mb: 2,
											lineHeight: 1.6,
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden'
										}}
									>
										{room?.description}
									</Typography>
								)}

								{/* Room Features */}
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
									{room?.guestCount && (
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
											<People sx={{ fontSize: 18, color: '#9ca3af' }} />
											<Typography
												variant="caption"
												sx={{ color: '#6b7280', fontWeight: 500 }}
											>
												{room?.guestCount} Guests
											</Typography>
										</Box>
									)}

									{room?.bedCount && (
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
											<KingBed sx={{ fontSize: 18, color: '#9ca3af' }} />
											<Typography
												variant="caption"
												sx={{ color: '#6b7280', fontWeight: 500 }}
											>
												{room?.bedCount} {room?.bedCount === 1 ? 'Bed' : 'Beds'}
											</Typography>
										</Box>
									)}

									{room?.bathroomCount && (
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
											<Bathtub sx={{ fontSize: 18, color: '#9ca3af' }} />
											<Typography
												variant="caption"
												sx={{ color: '#6b7280', fontWeight: 500 }}
											>
												{room?.bathroomCount}{' '}
												{room?.bathroomCount === 1 ? 'Bath' : 'Baths'}
											</Typography>
										</Box>
									)}

									{room?.roomSize && (
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
											<SquareFoot sx={{ fontSize: 18, color: '#9ca3af' }} />
											<Typography
												variant="caption"
												sx={{ color: '#6b7280', fontWeight: 500 }}
											>
												{room?.roomSize} sq ft
											</Typography>
										</Box>
									)}
								</Box>

								{/* Amenities Preview */}
								{room?.amenities && room?.amenities.length > 0 && (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
										{room?.amenities.slice(0, 3).map((amenity, index) => (
											<Chip
												key={index}
												label={amenity}
												size="small"
												sx={{
													fontSize: '0.6875rem',
													height: 22,
													backgroundColor: '#f9fafb',
													border: '1px solid #e5e7eb'
												}}
											/>
										))}
										{room?.amenities.length > 3 && (
											<Chip
												label={`+${room?.amenities.length - 3} more`}
												size="small"
												sx={{
													fontSize: '0.6875rem',
													height: 22,
													backgroundColor: '#fef3e2',
													color: '#ea580c',
													border: '1px solid #fed7aa'
												}}
											/>
										)}
									</Box>
								)}
							</Box>
						</Grid>

						{/* Price & Actions Section - Right Side */}
						<Grid item xs={12} md={3}>
							<Box
								sx={{
									p: { xs: 2, md: 3 },
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									backgroundColor: { xs: 'transparent', md: '#fafafa' },
									borderLeft: { xs: 'none', md: '1px solid #e5e7eb' }
								}}
							>
								{/* Price Section */}
								<Box>
									<Paper
										elevation={0}
										sx={{
											p: 2,
											mb: 2,
											backgroundColor: '#fff5f0',
											border: '1px solid #fed7aa',
											borderRadius: '12px'
										}}
									>
										<Typography
											variant="caption"
											sx={{
												color: '#9a3412',
												fontWeight: 600,
												display: 'block',
												mb: 0.5
											}}
										>
											Price per night
										</Typography>
										<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
											<Typography sx={{ fontSize: '0.875rem', color: '#ea580c' }}>
												₦
											</Typography>
											<Typography
												sx={{
													fontSize: '1.75rem',
													fontWeight: 800,
													color: '#ea580c',
													lineHeight: 1
												}}
											>
												{formatCurrency(room?.price)}
											</Typography>
										</Box>
									</Paper>
								</Box>

								{/* Action Buttons */}
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
									<Button
										fullWidth
										variant="contained"
										startIcon={<CalendarMonth />}
										onClick={() => onViewAvailableDates(room)}
										sx={{
											backgroundColor: '#ea580c',
											color: 'white',
											fontWeight: 700,
											py: 1.25,
											borderRadius: '10px',
											textTransform: 'none',
											'&:hover': {
												backgroundColor: '#c2410c',
												transform: 'translateY(-2px)',
												boxShadow: '0 6px 16px rgba(234, 88, 12, 0.3)'
											},
											transition: 'all 0.3s ease'
										}}
									>
										View Availability
									</Button>

									<Button
										fullWidth
										variant="outlined"
										startIcon={<FuseSvgIcon size={18}>heroicons-outline:user-add</FuseSvgIcon>}
										onClick={() => onBookForGuest(room)}
										sx={{
											borderColor: '#ea580c',
											color: '#ea580c',
											fontWeight: 600,
											py: 1.25,
											borderRadius: '10px',
											textTransform: 'none',
											'&:hover': {
												borderColor: '#c2410c',
												backgroundColor: '#fff5f0',
												transform: 'translateY(-2px)'
											},
											transition: 'all 0.3s ease'
										}}
									>
										Book for Guest
									</Button>
								</Box>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default RoomCardRow;
