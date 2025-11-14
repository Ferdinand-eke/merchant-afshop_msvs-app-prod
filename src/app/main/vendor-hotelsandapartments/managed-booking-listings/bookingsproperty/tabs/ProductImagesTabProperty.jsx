import { useState } from 'react';
import { orange } from '@mui/material/colors';
import { lighten, styled, alpha } from '@mui/material/styles';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import {
	Divider,
	Typography,
	Paper,
	IconButton,
	Chip,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	CircularProgress,
	Tooltip
} from '@mui/material';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Resizer from 'src/Resizer';
import {
	useUpdatePropertyListingImageMutation,
	useDeletePropertyListingImageMutation,
	useBookingsPropertyUpdateMutation
} from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 8,
		right: 8,
		color: orange[400],
		opacity: 0,
		transition: 'opacity 0.2s ease-in-out',
		zIndex: 2,
	},
	'& .productImageUpload': {
		transitionProperty: 'box-shadow, transform',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			transform: 'translateY(-4px)',
			boxShadow: '0 12px 24px rgba(234, 88, 12, 0.15)',
		}
	},
	'& .productImageItem': {
		transitionProperty: 'box-shadow, transform',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			transform: 'translateY(-4px)',
			boxShadow: '0 12px 24px rgba(234, 88, 12, 0.15)',
			'& .productImageFeaturedStar': {
				opacity: 1,
			},
			'& .imageOverlay': {
				opacity: 1,
			}
		},
		'&.featured': {
			boxShadow: '0 8px 16px rgba(234, 88, 12, 0.2)',
			border: '2px solid #f97316',
			'& .productImageFeaturedStar': {
				opacity: 1,
			},
			'& .featuredBadge': {
				opacity: 1,
			}
		},
	},
}));

/**
 * The product images tab.
 */
function ProductImagesTabProperty() {
	const methods = useFormContext();
	const routeParams = useParams();
	const { productId } = routeParams;
	const { control, watch, setValue } = methods;

	const images = watch('images');
	const listingImages = watch('listingImages');
	const listingId = watch('id');

	// State for replace image modal
	const [replaceModalOpen, setReplaceModalOpen] = useState(false);
	const [imageToReplace, setImageToReplace] = useState(null);
	const [newImageFile, setNewImageFile] = useState(null);
	const [newImagePreview, setNewImagePreview] = useState(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	// State for delete confirmation modal
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [imageToDelete, setImageToDelete] = useState(null);

	// State for add more images modal
	const [addImagesModalOpen, setAddImagesModalOpen] = useState(false);
	const [newImages, setNewImages] = useState([]);
	const [isUploadingNewImages, setIsUploadingNewImages] = useState(false);

	// Mutation hooks
	const updatePropertyImage = useUpdatePropertyListingImageMutation();
	const deletePropertyImage = useDeletePropertyListingImageMutation();
	const updateProperty = useBookingsPropertyUpdateMutation();

	const fileUploadAndResize = (e) => {
		const files = e.target.files;
		const allUploadedFiles = [];
		if (files) {
			for (let i = 0; i < files.length; i++) {
				Resizer?.imageFileResizer(
					files[i],
					720,
					720,
					'JPEG PNG',
					100,
					0,
					(uri) => {
						if (uri) {
							allUploadedFiles.push(uri);
							images.push(uri);
						} else {
							return allUploadedFiles;
						}
					},
					'base64'
				);
			}
		}
	};

	const deleteAnArrayImage = (item) => {
		const filtered = images.filter((el) => {
			return el !== item;
		});
		setValue('images', filtered);
	};

	// Handler for opening replace image modal
	const handleOpenReplaceModal = (media) => {
		setImageToReplace(media);
		setReplaceModalOpen(true);
	};

	// Handler for file selection in replace modal
	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (file) {
			setNewImageFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Handler for confirming image replacement
	const handleConfirmReplacement = async () => {
		if (!newImageFile || !listingId) {
			toast.error('Please select an image to upload');
			return;
		}

		setIsUploadingImage(true);

		try {
			// Resize and convert image to base64
			Resizer?.imageFileResizer(
				newImageFile,
				720,
				720,
				'JPEG',
				100,
				0,
				async (uri) => {
					try {
						console.log('Sending update with data:', {
							propertyId: listingId,
							cloudinaryPublicId: imageToReplace?.public_id,
							imageId: imageToReplace?.id,
							type: imageToReplace.type || 'image',
							url: uri
						});

						// Call the mutation to update the image
						await updatePropertyImage.mutateAsync({
							propertyId: listingId,
							cloudinaryPublicId: imageToReplace?.public_id,
							imageId: imageToReplace?.id,
							type: imageToReplace.type || 'image',
							url: uri
						});

						// Close modal and reset state
						handleCancelReplacement();
					} catch (error) {
						console.error('Error replacing image:', error);
						setIsUploadingImage(false);
					}
				},
				'base64'
			);
		} catch (error) {
			console.error('Error processing image:', error);
			toast.error('Failed to process image');
			setIsUploadingImage(false);
		}
	};

	// Handler for canceling image replacement
	const handleCancelReplacement = () => {
		setReplaceModalOpen(false);
		setImageToReplace(null);
		setNewImageFile(null);
		setNewImagePreview(null);
		setIsUploadingImage(false);
	};

	// Handler for opening delete confirmation modal
	const handleOpenDeleteModal = (media) => {
		setImageToDelete(media);
		setDeleteConfirmOpen(true);
	};

	// Handler for confirming image deletion
	const handleConfirmDelete = async () => {
		if (!imageToDelete) return;

		try {
			await deletePropertyImage.mutateAsync({
				propertyId: listingId,
				cloudinaryPublicId: imageToDelete.public_id,
				imageId: imageToDelete.id
			});

			handleCancelDelete();
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	// Handler for canceling image deletion
	const handleCancelDelete = () => {
		setDeleteConfirmOpen(false);
		setImageToDelete(null);
	};

	// Handler for opening add images modal
	const handleOpenAddImagesModal = () => {
		setAddImagesModalOpen(true);
	};

	// Handler for adding new images in the modal
	const handleAddNewImages = (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const processedImages = [];
		let processedCount = 0;

		Array.from(files).forEach((file) => {
			Resizer?.imageFileResizer(
				file,
				720,
				720,
				'JPEG',
				100,
				0,
				(uri) => {
					if (uri) {
						processedImages.push({
							base64: uri,
							name: file.name,
							preview: uri
						});
					}
					processedCount++;

					// When all images are processed, update state
					if (processedCount === files.length) {
						setNewImages((prev) => [...prev, ...processedImages]);
					}
				},
				'base64'
			);
		});
	};

	// Handler for removing an image from the new images array
	const handleRemoveNewImage = (index) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index));
	};

	// Handler for submitting new images
	const handleSubmitNewImages = async () => {
		if (newImages.length === 0) {
			toast.error('Please select at least one image to upload');
			return;
		}

		if (!listingId) {
			toast.error('Property ID is missing');
			return;
		}

		setIsUploadingNewImages(true);

		try {
			// Prepare the payload with just the new images
			const payload = {
				id: listingId,
				images: newImages.map((img) => img.base64)
			};

			// Call the update mutation
			await updateProperty.mutateAsync(payload);

			// Close modal and reset state
			handleCancelAddImages();
			toast.success('Images added successfully!');
		} catch (error) {
			console.error('Error adding images:', error);
			setIsUploadingNewImages(false);
		}
	};

	// Handler for canceling add images
	const handleCancelAddImages = () => {
		setAddImagesModalOpen(false);
		setNewImages([]);
		setIsUploadingNewImages(false);
	};

	return (
		<Root>
			<Box>
				{/* Header Section */}
				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
						border: '1px solid rgba(234, 88, 12, 0.1)',
						borderRadius: 2,
					}}
				>
					<Box className="flex items-center gap-12 mb-16">
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FuseSvgIcon className="text-white" size={20}>
								heroicons-outline:photograph
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524' }}>
								Property Images
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Upload high-quality images of your property
							</Typography>
						</Box>
					</Box>

					<Box
						sx={{
							display: 'flex',
							gap: 1,
							flexWrap: 'wrap',
							alignItems: 'center',
						}}
					>
						<Chip
							icon={<FuseSvgIcon size={16}>heroicons-outline:information-circle</FuseSvgIcon>}
							label="Recommended: 1200x800px"
							size="small"
							sx={{
								background: 'rgba(249, 115, 22, 0.1)',
								color: '#ea580c',
								fontWeight: 600,
							}}
						/>
						<Chip
							icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
							label="High Quality JPG/PNG"
							size="small"
							sx={{
								background: 'rgba(249, 115, 22, 0.1)',
								color: '#ea580c',
								fontWeight: 600,
							}}
						/>
						<Chip
							icon={<FuseSvgIcon size={16}>heroicons-outline:star</FuseSvgIcon>}
							label="Click trash to remove"
							size="small"
							sx={{
								background: 'rgba(249, 115, 22, 0.1)',
								color: '#ea580c',
								fontWeight: 600,
							}}
						/>
					</Box>
				</Paper>

				{/* Upload Section */}
				{productId === 'new' && (
					<Grid container spacing={3}>
						{/* Upload Button */}
						<Grid item xs={12} sm={6} md={4} lg={3}>
							<Box
								sx={{
									backgroundColor: (theme) =>
										theme.palette.mode === 'light'
											? lighten(theme.palette.background.default, 0.4)
											: lighten(theme.palette.background.default, 0.02),
									background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
									border: '2px dashed rgba(234, 88, 12, 0.3)',
								}}
								component="label"
								htmlFor="button-file"
								className="productImageUpload flex flex-col items-center justify-center relative w-full h-200 rounded-16 overflow-hidden cursor-pointer"
							>
								<input
									id="button-file"
									type="file"
									className="w-full h-full top-0 left-0 absolute opacity-0"
									multiple
									accept="image/*"
									onChange={fileUploadAndResize}
								/>
								<Box
									sx={{
										width: 64,
										height: 64,
										borderRadius: '50%',
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										mb: 2,
									}}
								>
									<FuseSvgIcon size={32} className="text-white">
										heroicons-outline:upload
									</FuseSvgIcon>
								</Box>
								<Typography variant="body2" sx={{ fontWeight: 600, color: '#ea580c', mb: 1 }}>
									Upload Images
								</Typography>
								<Typography variant="caption" color="text.secondary" className="text-center px-16">
									Click to browse or drag & drop
								</Typography>
							</Box>
						</Grid>

						{/* Uploaded Images */}
						<Controller
							name="featuredImageId"
							control={control}
							defaultValue=""
							render={({ field: { onChange, value } }) => {
								return (
									<>
										{images?.map((media, index) => (
											<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
												<Box
													role="button"
													tabIndex={0}
													className={clsx(
														'productImageItem flex items-center justify-center relative w-full h-200 rounded-16 overflow-hidden cursor-pointer outline-none',
														media === value && 'featured'
													)}
													sx={{
														background: '#f5f5f4',
														border: '1px solid rgba(234, 88, 12, 0.1)',
													}}
												>
													{/* Delete Button */}
													<IconButton
														className="productImageFeaturedStar"
														onClick={() => deleteAnArrayImage(media)}
														sx={{
															background: 'rgba(220, 38, 38, 0.9)',
															'&:hover': {
																background: 'rgba(185, 28, 28, 1)',
															},
															width: 40,
															height: 40,
														}}
													>
														<FuseSvgIcon className="text-white" size={20}>
															heroicons-outline:trash
														</FuseSvgIcon>
													</IconButton>

													{/* Featured Badge */}
													{media === value && (
														<Chip
															icon={<FuseSvgIcon size={16}>heroicons-solid:star</FuseSvgIcon>}
															label="Featured"
															size="small"
															className="featuredBadge"
															sx={{
																position: 'absolute',
																top: 8,
																left: 8,
																background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
																color: 'white',
																fontWeight: 700,
																zIndex: 2,
															}}
														/>
													)}

													{/* Image */}
													<img
														className="max-w-none w-auto h-full object-cover"
														src={media}
														alt={`property-${index}`}
													/>

													{/* Overlay */}
													<Box
														className="imageOverlay"
														sx={{
															position: 'absolute',
															bottom: 0,
															left: 0,
															right: 0,
															background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
															padding: 2,
															opacity: 0,
															transition: 'opacity 0.2s ease-in-out',
														}}
													>
														<Typography variant="caption" className="text-white font-semibold">
															Image {index + 1}
														</Typography>
													</Box>
												</Box>
											</Grid>
										))}
									</>
								);
							}}
						/>
					</Grid>
				)}

				{/* Existing Images from Server */}
				{listingImages && listingImages?.length > 0 && (
					<>
						<Divider sx={{ my: 3 }} />
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524' }}>
								Existing Images
							</Typography>
							<Button
								variant="contained"
								startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
								onClick={handleOpenAddImagesModal}
								sx={{
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									'&:hover': {
										background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
									},
								}}
							>
								Add More Images
							</Button>
						</Box>
						<Grid container spacing={3}>
							<Controller
								name="featuredImageId"
								control={control}
								defaultValue=""
								render={({ field: { onChange, value } }) => {
									return (
										<>
											{listingImages?.map((media) => (
												<Grid item xs={12} sm={6} md={4} lg={3} key={media.public_id}>
													<Box
														onClick={() => onChange(media.public_id)}
														onKeyDown={() => onChange(media.public_id)}
														role="button"
														tabIndex={0}
														className={clsx(
															'productImageItem flex items-center justify-center relative w-full h-200 rounded-16 overflow-hidden cursor-pointer outline-none',
															media.id === value && 'featured'
														)}
														sx={{
															background: '#f5f5f4',
															border: '1px solid rgba(234, 88, 12, 0.1)',
														}}
													>
														{/* Featured Star */}
														<IconButton
															className="productImageFeaturedStar"
															sx={{
																background: 'rgba(249, 115, 22, 0.9)',
																'&:hover': {
																	background: 'rgba(234, 88, 12, 1)',
																},
																width: 40,
																height: 40,
															}}
														>
															<FuseSvgIcon className="text-white" size={20}>
																heroicons-solid:star
															</FuseSvgIcon>
														</IconButton>

														{/* Featured Badge */}
														{media.id === value && (
															<Chip
																icon={<FuseSvgIcon size={16}>heroicons-solid:star</FuseSvgIcon>}
																label="Featured"
																size="small"
																className="featuredBadge"
																sx={{
																	position: 'absolute',
																	top: 8,
																	left: 8,
																	background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
																	color: 'white',
																	fontWeight: 700,
																	zIndex: 2,
																}}
															/>
														)}

														{/* Image */}
														<img
															className="max-w-none w-auto h-full object-cover"
															src={media.url}
															alt="property"
														/>

														{/* Overlay with Action Buttons */}
														<Box
															className="imageOverlay"
															sx={{
																position: 'absolute',
																bottom: 0,
																left: 0,
																right: 0,
																background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
																padding: 2,
																opacity: 0,
																transition: 'opacity 0.2s ease-in-out',
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
															}}
														>
															<Typography variant="caption" className="text-white font-semibold">
																Click to set as featured
															</Typography>
															<Box sx={{ display: 'flex', gap: 1 }}>
																<Tooltip title="Replace Image">
																	<IconButton
																		size="small"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleOpenReplaceModal(media);
																		}}
																		sx={{
																			background: alpha('#f97316', 0.9),
																			color: 'white',
																			'&:hover': {
																				background: alpha('#ea580c', 1),
																			},
																		}}
																	>
																		<FuseSvgIcon size={16}>heroicons-outline:refresh</FuseSvgIcon>
																	</IconButton>
																</Tooltip>
																<Tooltip title="Delete Image">
																	<IconButton
																		size="small"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleOpenDeleteModal(media);
																		}}
																		sx={{
																			background: alpha('#dc2626', 0.9),
																			color: 'white',
																			'&:hover': {
																				background: alpha('#b91c1c', 1),
																			},
																		}}
																	>
																		<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
																	</IconButton>
																</Tooltip>
															</Box>
														</Box>
													</Box>
												</Grid>
											))}
										</>
									);
								}}
							/>
						</Grid>
					</>
				)}

				{/* Empty State */}
				{productId === 'new' && (!images || images?.length === 0) && (
					<Box
						sx={{
							textAlign: 'center',
							py: 8,
							px: 3,
						}}
					>
						<Box
							sx={{
								width: 120,
								height: 120,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto',
								mb: 3,
							}}
						>
							<FuseSvgIcon size={48} sx={{ color: '#f97316' }}>
								heroicons-outline:photograph
							</FuseSvgIcon>
						</Box>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524', mb: 1 }}>
							No images uploaded yet
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Upload your first property image to get started
						</Typography>
					</Box>
				)}
			</Box>

			{/* Replace Image Modal */}
			<Dialog
				open={replaceModalOpen}
				onClose={handleCancelReplacement}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2,
						border: '1px solid rgba(234, 88, 12, 0.2)',
					},
				}}
			>
				<DialogTitle
					sx={{
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
						borderBottom: '1px solid rgba(234, 88, 12, 0.1)',
					}}
				>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FuseSvgIcon className="text-white" size={20}>
								heroicons-outline:refresh
							</FuseSvgIcon>
						</Box>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524' }}>
							Replace Property Image
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ pt: 3 }}>
					<Grid container spacing={3}>
						{/* Current Image */}
						<Grid item xs={12} md={6}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#292524' }}>
								Current Image
							</Typography>
							<Box
								sx={{
									width: '100%',
									height: 200,
									borderRadius: 2,
									overflow: 'hidden',
									border: '2px solid rgba(234, 88, 12, 0.2)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: '#f5f5f4',
								}}
							>
								{imageToReplace && (
									<img
										src={imageToReplace.url}
										alt="Current"
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain',
										}}
									/>
								)}
							</Box>
						</Grid>

						{/* New Image Preview */}
						<Grid item xs={12} md={6}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#292524' }}>
								New Image
							</Typography>
							<Box
								sx={{
									width: '100%',
									height: 200,
									borderRadius: 2,
									overflow: 'hidden',
									border: '2px dashed rgba(234, 88, 12, 0.3)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: newImagePreview
										? '#f5f5f4'
										: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
									cursor: 'pointer',
									position: 'relative',
								}}
								component="label"
							>
								<input
									type="file"
									accept="image/*"
									style={{ display: 'none' }}
									onChange={handleFileSelect}
									disabled={isUploadingImage}
								/>
								{newImagePreview ? (
									<img
										src={newImagePreview}
										alt="New preview"
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain',
										}}
									/>
								) : (
									<Box sx={{ textAlign: 'center' }}>
										<FuseSvgIcon size={48} sx={{ color: '#f97316', mb: 1 }}>
											heroicons-outline:upload
										</FuseSvgIcon>
										<Typography variant="body2" sx={{ color: '#ea580c', fontWeight: 600 }}>
											Click to select new image
										</Typography>
									</Box>
								)}
							</Box>
						</Grid>
					</Grid>

					{newImageFile && (
						<Box
							sx={{
								mt: 2,
								p: 2,
								background: 'rgba(249, 115, 22, 0.1)',
								borderRadius: 1,
								border: '1px solid rgba(234, 88, 12, 0.2)',
							}}
						>
							<Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 600 }}>
								Selected: {newImageFile.name} ({(newImageFile.size / 1024).toFixed(2)} KB)
							</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions
					sx={{
						p: 2,
						borderTop: '1px solid rgba(234, 88, 12, 0.1)',
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
					}}
				>
					<Button onClick={handleCancelReplacement} disabled={isUploadingImage} sx={{ color: '#6b7280' }}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmReplacement}
						disabled={!newImageFile || isUploadingImage}
						variant="contained"
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
							},
							'&:disabled': {
								background: '#e5e7eb',
							},
						}}
					>
						{isUploadingImage ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
								Replacing...
							</>
						) : (
							'Replace Image'
						)}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Modal */}
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
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FuseSvgIcon className="text-white" size={20}>
								heroicons-outline:exclamation
							</FuseSvgIcon>
						</Box>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524' }}>
							Delete Property Image
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ pt: 3 }}>
					<Typography variant="body1" sx={{ mb: 3, color: '#374151' }}>
						Are you sure you want to delete this image? This action cannot be undone and the image will be
						permanently removed from Cloudinary.
					</Typography>
					{imageToDelete && (
						<Box
							sx={{
								width: '100%',
								height: 200,
								borderRadius: 2,
								overflow: 'hidden',
								border: '2px solid rgba(220, 38, 38, 0.2)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								background: '#f5f5f4',
							}}
						>
							<img
								src={imageToDelete.url}
								alt="To delete"
								style={{
									maxWidth: '100%',
									maxHeight: '100%',
									objectFit: 'contain',
								}}
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions
					sx={{
						p: 2,
						borderTop: '1px solid rgba(220, 38, 38, 0.1)',
						background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
					}}
				>
					<Button onClick={handleCancelDelete} sx={{ color: '#6b7280' }}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						variant="contained"
						sx={{
							background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
							},
						}}
					>
						Delete Image
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add More Images Modal */}
			<Dialog
				open={addImagesModalOpen}
				onClose={handleCancelAddImages}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2,
						border: '1px solid rgba(234, 88, 12, 0.2)',
					},
				}}
			>
				<DialogTitle
					sx={{
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
						borderBottom: '1px solid rgba(234, 88, 12, 0.1)',
					}}
				>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<FuseSvgIcon className="text-white" size={20}>
								heroicons-outline:photograph
							</FuseSvgIcon>
						</Box>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524' }}>
							Add More Property Images
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ pt: 3 }}>
					{/* Upload Area */}
					<Box
						sx={{
							mb: 3,
							p: 4,
							border: '2px dashed rgba(234, 88, 12, 0.3)',
							borderRadius: 2,
							background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
							textAlign: 'center',
							cursor: 'pointer',
							transition: 'all 0.3s ease',
							'&:hover': {
								borderColor: 'rgba(234, 88, 12, 0.5)',
								transform: 'translateY(-2px)',
							},
						}}
						component="label"
					>
						<input
							type="file"
							multiple
							accept="image/*"
							style={{ display: 'none' }}
							onChange={handleAddNewImages}
							disabled={isUploadingNewImages}
						/>
						<Box
							sx={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto',
								mb: 2,
							}}
						>
							<FuseSvgIcon size={32} className="text-white">
								heroicons-outline:upload
							</FuseSvgIcon>
						</Box>
						<Typography variant="body1" sx={{ fontWeight: 600, color: '#ea580c', mb: 1 }}>
							Click to browse or drag & drop
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Select multiple images to upload (JPG, PNG)
						</Typography>
					</Box>

					{/* Preview Selected Images */}
					{newImages.length > 0 && (
						<>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#292524' }}>
								Selected Images ({newImages.length})
							</Typography>
							<Grid container spacing={2}>
								{newImages.map((image, index) => (
									<Grid item xs={6} sm={4} md={3} key={index}>
										<Box
											sx={{
												position: 'relative',
												width: '100%',
												height: 150,
												borderRadius: 2,
												overflow: 'hidden',
												border: '1px solid rgba(234, 88, 12, 0.2)',
												background: '#f5f5f4',
											}}
										>
											{/* Remove Button */}
											<IconButton
												onClick={() => handleRemoveNewImage(index)}
												sx={{
													position: 'absolute',
													top: 4,
													right: 4,
													background: 'rgba(220, 38, 38, 0.9)',
													'&:hover': {
														background: 'rgba(185, 28, 28, 1)',
													},
													width: 32,
													height: 32,
													zIndex: 2,
												}}
											>
												<FuseSvgIcon className="text-white" size={16}>
													heroicons-outline:x
												</FuseSvgIcon>
											</IconButton>

											{/* Image Preview */}
											<img
												src={image.preview}
												alt={`Preview ${index + 1}`}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover',
												}}
											/>

											{/* Image Name Overlay */}
											<Box
												sx={{
													position: 'absolute',
													bottom: 0,
													left: 0,
													right: 0,
													background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
													padding: 1,
												}}
											>
												<Typography
													variant="caption"
													className="text-white font-semibold"
													sx={{
														display: 'block',
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{image.name}
												</Typography>
											</Box>
										</Box>
									</Grid>
								))}
							</Grid>
						</>
					)}

					{/* Empty State */}
					{newImages.length === 0 && (
						<Box
							sx={{
								textAlign: 'center',
								py: 4,
								px: 3,
							}}
						>
							<Typography variant="body2" color="text.secondary">
								No images selected yet. Click the upload area above to select images.
							</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions
					sx={{
						p: 2,
						borderTop: '1px solid rgba(234, 88, 12, 0.1)',
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
					}}
				>
					<Button onClick={handleCancelAddImages} disabled={isUploadingNewImages} sx={{ color: '#6b7280' }}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmitNewImages}
						disabled={newImages.length === 0 || isUploadingNewImages}
						variant="contained"
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
							},
							'&:disabled': {
								background: '#e5e7eb',
							},
						}}
					>
						{isUploadingNewImages ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
								Uploading...
							</>
						) : (
							`Add ${newImages.length} Image${newImages.length !== 1 ? 's' : ''}`
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</Root>
	);
}

export default ProductImagesTabProperty;
