import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Chip, IconButton, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState } from 'react';
import { useGetMyShopAndPlan } from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import {
	useAddShopBookingsPropertyMutation,
	useBookingsPropertyUpdateMutation,
	useDeleteBookingPropertyMutation
} from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';

/**
 * The product header.
 */
function BookingPropertyHeader() {

	const routeParams = useParams();
	const { productId } = routeParams;
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	const { data: myshopData } = useGetMyShopAndPlan(false);

	const theme = useTheme();
	const { title, images, featuredImageId, imageSrcs, id } = watch();

	// State for delete confirmation dialog
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

	const addBookingsProperty = useAddShopBookingsPropertyMutation();
	const updateBookingsProperty = useBookingsPropertyUpdateMutation();
	const deleteBookingsProperty = useDeleteBookingPropertyMutation();

	function handleSaveApartment() {
		const values = getValues();
		const formData = {
			...values,
			price: parseInt(values?.price),
			listprice: parseInt(values?.listprice),
			guestCount: parseInt(values?.guestCount),
			sittingroomCount: parseInt(values?.sittingroomCount),
			bathroomCount: parseInt(values?.bathroomCount),
			roomCount: parseInt(values?.roomCount),
			height: parseInt(values?.height),
			length: parseInt(values?.length),
			width: parseInt(values?.width),
			isRentIndividualRoom: Boolean(values?.isRentIndividualRoom),
			// amenities: Array.isArray(values?.amenities) ? values.amenities : [],
			checkedAmenities: Array.isArray(values?.checkedAmenities) ? values.checkedAmenities : [],
			//checkedAmenities

			// extra properties added
			cleaningFee: parseInt(values?.cleaningFee),
			floorArea: parseInt(values?.floorArea),
			floorLevel: parseInt(values?.floorLevel),
			numberOfFloors: parseInt(values?.numberOfFloors),
			plotArea: parseInt(values?.plotArea),
			securityDeposit: parseInt(values?.securityDeposit)
		};
		updateBookingsProperty.mutate(formData);
	}

	function handleCreateApartment() {

		const values = getValues();
		const formData = {
			...values,
			price: parseInt(values?.price),
			listprice: parseInt(values?.listprice),
			guestCount: parseInt(values?.guestCount),
			sittingroomCount: parseInt(values?.sittingroomCount),
			bathroomCount: parseInt(values?.bathroomCount),
			roomCount: parseInt(values?.roomCount),
			height: parseInt(values?.height),
			length: parseInt(values?.length),
			width: parseInt(values?.width),
			isRentIndividualRoom: Boolean(values?.isRentIndividualRoom),
			checkedAmenities: Array.isArray(values?.checkedAmenities) ? values.checkedAmenities : [],
			propertyShopplan: myshopData?.data?.merchant?.merchantShopplan?.id,

			// extra properties added
			cleaningFee: parseInt(values?.cleaningFee),
			floorArea: parseInt(values?.floorArea),
			floorLevel: parseInt(values?.floorLevel),
			numberOfFloors: parseInt(values?.numberOfFloors),
			plotArea: parseInt(values?.plotArea),
			securityDeposit: parseInt(values?.securityDeposit)
		};
		console.log('Create__Booking__Apartment', formData?.checkedAmenities);
		return
		// addBookingsProperty.mutate(formData);
	}

	// Open delete confirmation dialog
	function handleRemoveListing() {
		setDeleteConfirmOpen(true);
	}

	// Confirm and execute delete
	function handleConfirmDelete() {
		if (id) {
			deleteBookingsProperty.mutate(id);
		}
	}

	// Cancel delete
	function handleCancelDelete() {
		setDeleteConfirmOpen(false);
	}

	// Get featured image
	const getFeaturedImage = () => {
		if (imageSrcs && imageSrcs.length > 0) {
			const featured = _.find(imageSrcs, { id: featuredImageId });
			return featured?.url || imageSrcs[0]?.url;
		}

		if (images && images.length > 0) {
			return images[0];
		}

		return 'assets/images/apps/ecommerce/product-image-placeholder.png';
	};

	const hasChanges = !_.isEmpty(dirtyFields);
	const canSave = hasChanges && isValid;

	return (
		<Box
			className="w-full"
			sx={{
				background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
				borderBottom: '1px solid rgba(234, 88, 12, 0.1)'
			}}
		>
			<Box
				className="flex flex-col sm:flex-row items-center justify-between gap-16 sm:gap-24 py-16 sm:py-24 px-24 md:px-32"
				sx={{ width: '100%', maxWidth: '100%' }}
			>
				{/* Left Section */}
				<div className="flex flex-col items-start space-y-8 sm:space-y-0 flex-1 min-w-0 w-full">
					{/* Back Button */}
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
					>
						<Button
							component={Link}
							to="/bookings/managed-listings"
							startIcon={
								<FuseSvgIcon size={20}>
									{theme.direction === 'ltr'
										? 'heroicons-outline:arrow-left'
										: 'heroicons-outline:arrow-right'}
								</FuseSvgIcon>
							}
							sx={{
								color: '#78716c',
								fontWeight: 600,
								'&:hover': {
									background: 'rgba(249, 115, 22, 0.08)',
									color: '#ea580c'
								}
							}}
						>
							Back to Listings
						</Button>
					</motion.div>

					{/* Property Info */}
					<Box className="flex items-center max-w-full w-full gap-16">
						{/* Property Image */}
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1, transition: { delay: 0.3 } }}
						>
							<Box
								sx={{
									position: 'relative',
									width: { xs: 64, sm: 80 },
									height: { xs: 64, sm: 80 },
									borderRadius: 2,
									overflow: 'hidden',
									border: '2px solid',
									borderColor: 'rgba(234, 88, 12, 0.2)',
									boxShadow: '0 4px 12px rgba(234, 88, 12, 0.1)'
								}}
							>
								<img
									className="w-full h-full object-cover"
									src={getFeaturedImage()}
									alt={title || 'Property'}
								/>
								{productId === 'new' && (
									<Chip
										label="NEW"
										size="small"
										sx={{
											position: 'absolute',
											top: 4,
											right: 4,
											height: 20,
											fontSize: '10px',
											fontWeight: 700,
											background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
											color: 'white'
										}}
									/>
								)}
							</Box>
						</motion.div>

						{/* Property Title & Details */}
						<motion.div
							className="flex flex-col min-w-0 flex-1"
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								className="text-20 sm:text-24 truncate font-bold"
								sx={{ color: '#292524', mb: 0.5 }}
							>
								{title || 'New Property Listing'}
							</Typography>

							<Box className="flex items-center gap-8 flex-wrap">
								<Chip
									icon={<FuseSvgIcon size={14}>heroicons-outline:home</FuseSvgIcon>}
									label={productId === 'new' ? 'Creating Property' : 'Edit Property'}
									size="small"
									sx={{
										background: 'rgba(249, 115, 22, 0.1)',
										color: '#ea580c',
										fontWeight: 600,
										height: 24
									}}
								/>

								{hasChanges && (
									<Chip
										icon={<FuseSvgIcon size={14}>heroicons-outline:pencil</FuseSvgIcon>}
										label="Unsaved Changes"
										size="small"
										sx={{
											background: 'rgba(251, 191, 36, 0.15)',
											color: '#d97706',
											fontWeight: 600,
											height: 24
										}}
									/>
								)}

								{!isValid && hasChanges && (
									<Chip
										icon={<FuseSvgIcon size={14}>heroicons-outline:exclamation</FuseSvgIcon>}
										label="Fix Errors"
										size="small"
										sx={{
											background: 'rgba(239, 68, 68, 0.1)',
											color: '#dc2626',
											fontWeight: 600,
											height: 24
										}}
									/>
								)}
							</Box>
						</motion.div>
					</Box>
				</div>

				{/* Right Section - Action Buttons */}
				<motion.div
					className="flex items-center gap-12 w-full sm:w-auto justify-end sm:flex-shrink-0"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					{productId !== 'new' ? (
						<>
							{/* Delete Button */}
							<Tooltip
								title="Delete Property"
								arrow
							>
								<IconButton
									onClick={handleRemoveListing}
									sx={{
										width: 48,
										height: 48,
										border: '1px solid rgba(239, 68, 68, 0.2)',
										color: '#dc2626',
										'&:hover': {
											background: 'rgba(239, 68, 68, 0.1)',
											borderColor: '#dc2626'
										}
									}}
								>
									<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
								</IconButton>
							</Tooltip>

							{/* Save Button */}
							<Button
								variant="contained"
								disabled={!canSave || updateBookingsProperty.isLoading}
								onClick={handleSaveApartment}
								startIcon={
									updateBookingsProperty.isLoading ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : (
										<FuseSvgIcon size={20}>heroicons-outline:save</FuseSvgIcon>
									)
								}
								sx={{
									background: canSave
										? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
										: 'rgba(120, 113, 108, 0.12)',
									color: canSave ? 'white' : 'rgba(120, 113, 108, 0.5)',
									fontWeight: 700,
									height: 48,
									px: 3,
									minWidth: 140,
									'&:hover': canSave
										? {
												background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
												boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)'
											}
										: {},
									'&.Mui-disabled': {
										background: 'rgba(120, 113, 108, 0.12)',
										color: 'rgba(120, 113, 108, 0.5)'
									}
								}}
							>
								{updateBookingsProperty.isLoading ? 'Saving...' : 'Save Changes'}
							</Button>
						</>
					) : (
						// Create Button
						<Button
							variant="contained"
							disabled={!canSave || addBookingsProperty.isLoading}
							onClick={handleCreateApartment}
							startIcon={
								addBookingsProperty.isLoading ? (
									<CircularProgress
										size={20}
										color="inherit"
									/>
								) : (
									<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
								)
							}
							sx={{
								background: canSave
									? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
									: 'rgba(120, 113, 108, 0.12)',
								color: canSave ? 'white' : 'rgba(120, 113, 108, 0.5)',
								fontWeight: 700,
								height: 48,
								px: 3,
								minWidth: 160,
								'&:hover': canSave
									? {
											background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
											boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)'
										}
									: {},
								'&.Mui-disabled': {
									background: 'rgba(120, 113, 108, 0.12)',
									color: 'rgba(120, 113, 108, 0.5)'
								}
							}}
						>
							{addBookingsProperty.isLoading ? 'Creating...' : 'Create Property'}
						</Button>
					)}
				</motion.div>
			</Box>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteConfirmOpen}
				onClose={handleCancelDelete}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2,
						border: '1px solid rgba(220, 38, 38, 0.2)',
					},
				}}
			>
				<DialogTitle
					sx={{
						background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
						borderBottom: '1px solid rgba(220, 38, 38, 0.1)',
					}}
				>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FuseSvgIcon className="text-white" size={24}>
								heroicons-outline:exclamation
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524' }}>
								Delete Property Listing
							</Typography>
							<Typography variant="caption" color="text.secondary">
								This action cannot be undone
							</Typography>
						</Box>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ pt: 3, pb: 2 }}>
					<Box sx={{ mb: 3 }}>
						<Typography variant="body1" sx={{ mb: 2, color: '#374151', fontWeight: 500 }}>
							Are you sure you want to delete this property listing?
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							This will permanently delete:
						</Typography>
						<Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
							<Typography component="li" variant="body2" sx={{ mb: 1 }}>
								Property details and description
							</Typography>
							<Typography component="li" variant="body2" sx={{ mb: 1 }}>
								All uploaded images
							</Typography>
							<Typography component="li" variant="body2" sx={{ mb: 1 }}>
								Room configurations (if any)
							</Typography>
							<Typography component="li" variant="body2">
								Associated booking history
							</Typography>
						</Box>
					</Box>

					{/* Property Info Card */}
					{title && (
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: 'rgba(220, 38, 38, 0.05)',
								border: '1px solid rgba(220, 38, 38, 0.2)',
							}}
						>
							<Box className="flex items-center gap-12">
								<Box
									sx={{
										width: 60,
										height: 60,
										borderRadius: 1.5,
										overflow: 'hidden',
										border: '1px solid rgba(220, 38, 38, 0.2)',
									}}
								>
									<img
										src={getFeaturedImage()}
										alt={title}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								</Box>
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										variant="subtitle1"
										sx={{
											fontWeight: 600,
											color: '#292524',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{title}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Property ID: {id || 'N/A'}
									</Typography>
								</Box>
							</Box>
						</Box>
					)}
				</DialogContent>
				<DialogActions
					sx={{
						p: 3,
						borderTop: '1px solid rgba(220, 38, 38, 0.1)',
						background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
						gap: 2,
					}}
				>
					<Button
						onClick={handleCancelDelete}
						disabled={deleteBookingsProperty.isLoading}
						sx={{
							color: '#6b7280',
							fontWeight: 600,
							px: 3,
							'&:hover': {
								background: 'rgba(107, 114, 128, 0.08)',
							},
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						disabled={deleteBookingsProperty.isLoading}
						variant="contained"
						startIcon={
							deleteBookingsProperty.isLoading ? (
								<CircularProgress size={18} sx={{ color: 'white' }} />
							) : (
								<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
						sx={{
							background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
							fontWeight: 700,
							px: 3,
							'&:hover': {
								background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
								boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
							},
							'&.Mui-disabled': {
								background: 'rgba(220, 38, 38, 0.3)',
								color: 'white',
							},
						}}
					>
						{deleteBookingsProperty.isLoading ? 'Deleting...' : 'Delete Property'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default BookingPropertyHeader;
