import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Chip, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { useGetMyShopAndPlan } from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import {
	useAddShopBookingsPropertyMutation,
	useBookingsPropertyUpdateMutation
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
	const { title, images, featuredImageId, imageSrcs } = watch();

	const addBookingsProperty = useAddShopBookingsPropertyMutation();
	const updateBookingsProperty = useBookingsPropertyUpdateMutation();

	function handleSaveApartment() {
		const formData = {
			...getValues(),
			price: parseInt(getValues()?.price),
			listprice: parseInt(getValues()?.listprice),
			guestCount: parseInt(getValues()?.guestCount),
			sittingroomCount: parseInt(getValues()?.sittingroomCount),
			bathroomCount: parseInt(getValues()?.bathroomCount),
			roomCount: parseInt(getValues()?.roomCount),
			height: parseInt(getValues()?.height),
			length: parseInt(getValues()?.length),
			width: parseInt(getValues()?.width),
			isRentIndividualRoom: Boolean(getValues()?.isRentIndividualRoom),

			// extra properties added
			cleaningFee: parseInt(getValues()?.cleaningFee),
			floorArea: parseInt(getValues()?.floorArea),
			floorLevel: parseInt(getValues()?.floorLevel),
			numberOfFloors: parseInt(getValues()?.numberOfFloors),
			plotArea: parseInt(getValues()?.plotArea),
			securityDeposit: parseInt(getValues()?.securityDeposit)
		};
		updateBookingsProperty.mutate(formData);
	}

	function handleCreateApartment() {
		const formData = {
			...getValues(),
			price: parseInt(getValues()?.price),
			listprice: parseInt(getValues()?.listprice),
			guestCount: parseInt(getValues()?.guestCount),
			sittingroomCount: parseInt(getValues()?.sittingroomCount),
			bathroomCount: parseInt(getValues()?.bathroomCount),
			roomCount: parseInt(getValues()?.roomCount),
			height: parseInt(getValues()?.height),
			length: parseInt(getValues()?.length),
			width: parseInt(getValues()?.width),
			isRentIndividualRoom: Boolean(getValues()?.isRentIndividualRoom),
			propertyShopplan: myshopData?.data?.merchant?.merchantShopplan?.id,

			// extra properties added
			cleaningFee: parseInt(getValues()?.cleaningFee),
			floorArea: parseInt(getValues()?.floorArea),
			floorLevel: parseInt(getValues()?.floorLevel),
			numberOfFloors: parseInt(getValues()?.numberOfFloors),
			plotArea: parseInt(getValues()?.plotArea),
			securityDeposit: parseInt(getValues()?.securityDeposit)
		};
		console.log('Create__Booking__Apartment', formData);
		// return
		addBookingsProperty.mutate(formData);
	}

	function handleRemoveListing() {
		// Handle delete functionality
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
		</Box>
	);
}

export default BookingPropertyHeader;
