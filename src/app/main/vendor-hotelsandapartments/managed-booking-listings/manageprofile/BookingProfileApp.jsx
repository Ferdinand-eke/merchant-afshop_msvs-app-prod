import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useSingleShopBookingsProperty } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';
import { useNavigate, useParams } from 'react-router';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import { Button, Chip, IconButton } from '@mui/material';
import ManageReservationPage from './tabs/photos-videos/ManageReservationPage';
import TimelineTab from './tabs/timeline/TimelineTab';
import PhotosVideosTab from './tabs/photos-videos/PhotosVideosTab';
import AboutManageRoomsTab from './tabs/about/AboutManageRoomsTab';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: 'transparent'
	}
}));

const TABS = {
	timeline: 0,
	rooms: 1,
	reservations: 2
};

/**
 * The profile page.
 */
function BookingProfileApp() {
	const theme = useTheme();
	const routeParams = useParams();
	const { productId, reservationId } = routeParams;

	// Load tab from localStorage with property-specific key
	const getStoredTab = () => {
		const stored = localStorage.getItem(`propertyProfileTab_${productId}`);
		return stored ? parseInt(stored, 10) : TABS.timeline;
	};

	const [selectedTab, setSelectedTab] = useState(getStoredTab);

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { data: propertyList, isLoading, isError } = useSingleShopBookingsProperty(productId);

	function handleTabChange(event, value) {
		setSelectedTab(value);
		// Save to localStorage with property-specific key
		localStorage.setItem(`propertyProfileTab_${productId}`, value.toString());
	}

	const navigate = useNavigate();
	const pageLayout = useRef(null);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const handleRightSidebarToggle = () => {
		setRightSidebarOpen(false);
		navigate(`/bookings/managed-listings/${productId}/manage`);
	};

	useEffect(() => {
		setRightSidebarOpen(Boolean(reservationId));
	}, [reservationId]);

	// Restore tab on productId change
	useEffect(() => {
		setSelectedTab(getStoredTab());
	}, [productId]);

	const property = propertyList?.data?.bookingList;
	const featuredImage = property?.imageSrcs?.[0]?.url || 'assets/images/apps/ecommerce/product-image-placeholder.png';

	return (
		<Root
			header={
				<Box
					sx={{
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
						borderBottom: '1px solid rgba(234, 88, 12, 0.1)'
					}}
				>
					{/* Compact Profile Section */}
					<Box className="px-24 md:px-32 py-12">
						<Box className="max-w-6xl mx-auto">
							{/* Header Row: Back Button + Profile + Actions + Stats */}
							<Box className="flex items-center gap-16 mb-12">
								{/* Back Button */}
								<Button
									component={Link}
									to="/bookings/managed-listings"
									startIcon={
										<FuseSvgIcon size={16}>
											{theme.direction === 'ltr'
												? 'heroicons-outline:arrow-left'
												: 'heroicons-outline:arrow-right'}
										</FuseSvgIcon>
									}
									sx={{
										color: '#292524',
										fontWeight: 600,
										minWidth: 'auto',
										px: 2,
										py: 1,
										fontSize: '14px',
										'&:hover': {
											background: 'rgba(249, 115, 22, 0.08)'
										}
									}}
								>
									Back
								</Button>

								{/* Avatar + Title */}
								<Box className="flex items-center gap-12 flex-1">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1, transition: { delay: 0.1 } }}
									>
										<Avatar
											sx={{
												width: 56,
												height: 56,
												border: '2px solid white',
												boxShadow: '0 2px 8px rgba(234, 88, 12, 0.15)'
											}}
											src={featuredImage}
											alt="Property"
										/>
									</motion.div>

									<Box className="flex-1 min-w-0">
										<Typography
											variant="h6"
											className="font-bold mb-4 truncate"
											sx={{ color: '#292524' }}
										>
											{property?.title || 'Property'}
										</Typography>
										<Box className="flex flex-wrap items-center gap-6">
											<Chip
												icon={
													<FuseSvgIcon size={12}>
														heroicons-outline:location-marker
													</FuseSvgIcon>
												}
												label="Abuja, FCT"
												size="small"
												sx={{
													background: 'rgba(249, 115, 22, 0.1)',
													color: '#ea580c',
													fontWeight: 600,
													height: 20,
													fontSize: '11px',
													'& .MuiChip-icon': { marginLeft: '4px' }
												}}
											/>
											<Chip
												icon={<FuseSvgIcon size={12}>heroicons-outline:star</FuseSvgIcon>}
												label="Top Rated"
												size="small"
												sx={{
													background: 'rgba(251, 191, 36, 0.15)',
													color: '#d97706',
													fontWeight: 600,
													height: 20,
													fontSize: '11px',
													'& .MuiChip-icon': { marginLeft: '4px' }
												}}
											/>
											<Chip
												icon={
													<FuseSvgIcon size={12}>heroicons-outline:check-circle</FuseSvgIcon>
												}
												label="Verified"
												size="small"
												sx={{
													background: 'rgba(34, 197, 94, 0.1)',
													color: '#16a34a',
													fontWeight: 600,
													height: 20,
													fontSize: '11px',
													'& .MuiChip-icon': { marginLeft: '4px' }
												}}
											/>
										</Box>
									</Box>
								</Box>

								{/* Stats - Compact */}
								<Box className="hidden md:flex items-center gap-20">
									<Box className="text-center">
										<Typography
											className="text-16 font-bold"
											sx={{ color: '#ea580c', lineHeight: 1.2 }}
										>
											200K
										</Typography>
										<Typography
											className="text-9 font-medium"
											color="text.secondary"
										>
											VIEWS
										</Typography>
									</Box>
									<Box className="text-center">
										<Typography
											className="text-16 font-bold"
											sx={{ color: '#ea580c', lineHeight: 1.2 }}
										>
											1.2K
										</Typography>
										<Typography
											className="text-9 font-medium"
											color="text.secondary"
										>
											BOOKINGS
										</Typography>
									</Box>
									<Box className="text-center">
										<Typography
											className="text-16 font-bold"
											sx={{ color: '#ea580c', lineHeight: 1.2 }}
										>
											4.9
										</Typography>
										<Typography
											className="text-9 font-medium"
											color="text.secondary"
										>
											RATING
										</Typography>
									</Box>
								</Box>

								{/* Action Buttons */}
								<Box className="flex items-center gap-8">
									<IconButton
										sx={{
											width: 32,
											height: 32,
											border: '1px solid rgba(234, 88, 12, 0.2)',
											'&:hover': {
												background: 'rgba(249, 115, 22, 0.08)',
												borderColor: '#ea580c'
											}
										}}
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: '#ea580c' }}
										>
											heroicons-outline:share
										</FuseSvgIcon>
									</IconButton>
									<IconButton
										sx={{
											width: 32,
											height: 32,
											border: '1px solid rgba(234, 88, 12, 0.2)',
											'&:hover': {
												background: 'rgba(249, 115, 22, 0.08)',
												borderColor: '#ea580c'
											}
										}}
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: '#ea580c' }}
										>
											heroicons-outline:dots-vertical
										</FuseSvgIcon>
									</IconButton>
								</Box>
							</Box>

							{/* Tabs */}
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								textColor="inherit"
								variant="scrollable"
								scrollButtons="auto"
								sx={{
									minHeight: 'auto',
									'& .MuiTab-root': {
										minHeight: 40,
										textTransform: 'none',
										fontSize: '14px',
										fontWeight: 600,
										px: 2,
										py: 1,
										color: '#78716c',
										'&.Mui-selected': {
											color: '#ea580c'
										}
									},
									'& .MuiTabs-indicator': {
										backgroundColor: '#ea580c',
										height: 2,
										borderRadius: '2px 2px 0 0'
									}
								}}
							>
								<Tab
									icon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>}
									iconPosition="start"
									label="Timeline"
								/>
								<Tab
									icon={<FuseSvgIcon size={16}>heroicons-outline:home</FuseSvgIcon>}
									iconPosition="start"
									label="Manage Rooms"
								/>
								<Tab
									icon={<FuseSvgIcon size={16}>heroicons-outline:calendar</FuseSvgIcon>}
									iconPosition="start"
									label="Reservations"
								/>
							</Tabs>
						</Box>
					</Box>
				</Box>
			}
			content={
				<Box
					sx={{
						background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fef3e2 100%)',
						minHeight: 'calc(100vh - 400px)'
					}}
				>
					<div className="flex flex-auto justify-center w-full max-w-6xl mx-auto p-24 sm:p-32">
						{selectedTab === TABS.timeline && <TimelineTab />}

						{selectedTab === TABS.rooms && <AboutManageRoomsTab Listing={property} />}

						{selectedTab === TABS.reservations && <PhotosVideosTab Listing={property} />}
					</div>
				</Box>
			}
			ref={pageLayout}
			rightSidebarContent={<ManageReservationPage />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default BookingProfileApp;
