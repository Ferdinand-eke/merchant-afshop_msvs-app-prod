import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography
} from '@mui/material';
import {
	useAddProductImagesMutation,
	useChangeProductImageMutation,
	useDeleteProductSingleImage
} from 'app/configs/data/server-calls/products/useShopProducts';
import { useParams } from 'react-router';
import { useState } from 'react';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	'& .productImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	'& .productImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .productImageFeaturedStar': {
				opacity: 0.8
			},
			'& .imageActionButton': {
				opacity: 1
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover .productImageFeaturedStar': {
				opacity: 1
			}
		}
	},
	'& .imageActionButton': {
		opacity: 0,
		transition: 'opacity 0.2s ease-in-out'
	}
}));

const MAX_IMAGES = 8;

/**
 * The product images tab.
 */
function ProductImagesTab({productDataId}) {
	const methods = useFormContext();
	const routeParams = useParams();
	const { productId } = routeParams;

	const { control, watch } = methods;
	const images = watch('images') || [];
	const imageLinks = watch('imageLinks') || [];
	const deleteSingleImage = useDeleteProductSingleImage();
	const addProductImages = useAddProductImagesMutation();
	const changeProductImage = useChangeProductImageMutation();

	const [openAddModal, setOpenAddModal] = useState(false);
	const [newImages, setNewImages] = useState([]);
	const [isUploading, setIsUploading] = useState(false);

	// Change image modal state
	const [openChangeModal, setOpenChangeModal] = useState(false);
	const [selectedImageToChange, setSelectedImageToChange] = useState(null);
	const [newReplacementImage, setNewReplacementImage] = useState(null);
	const [isChanging, setIsChanging] = useState(false);

	// Delete confirmation modal state
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedImageToDelete, setSelectedImageToDelete] = useState(null);

	// Menu state for existing product images
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);

	// Check if we're in "new product" mode or "edit mode"
	const isNewProduct = productId === 'new';

	// For new products, count images from 'images' field (form uploads)
	// For existing products, count from 'imageLinks' (database images)
	const existingImageCount = isNewProduct ? (images?.length || 0) : (imageLinks?.length || 0);
	const canAddMoreImages = existingImageCount < MAX_IMAGES;
	const remainingSlots = MAX_IMAGES - existingImageCount;

	// Handle file selection for new product
	async function handleNewProductImageUpload(e, onChange, value) {
		const file = e?.target?.files?.[0];
		if (!file) return;

		if (existingImageCount >= MAX_IMAGES) {
			alert(`Maximum ${MAX_IMAGES} images allowed`);
			return;
		}

		const newImage = await readFileAsync(file);
		onChange([...(value || []), newImage]);
		e.target.value = ''; // Reset input
	}

	// Handle file selection for modal (existing product)
	async function handleModalImageSelection(e) {
		const files = Array.from(e?.target?.files || []);
		if (files.length === 0) return;

		// Calculate how many more images can be added
		const availableSlots = remainingSlots - newImages.length;

		if (availableSlots <= 0) {
			alert(`Maximum ${MAX_IMAGES} images allowed. You currently have ${existingImageCount} existing images.`);
			e.target.value = '';
			return;
		}

		// Check if selected files exceed available slots
		if (files.length > availableSlots) {
			alert(
				`You can only add ${availableSlots} more image${availableSlots !== 1 ? 's' : ''}.\n\n` +
					`Existing images (in database): ${existingImageCount}\n` +
					`Images queued to upload: ${newImages.length}\n` +
					`Available slots: ${availableSlots}\n` +
					`You selected: ${files.length} image${files.length !== 1 ? 's' : ''}\n\n` +
					`Total after selection would be: ${existingImageCount + newImages.length + files.length} (Max: ${MAX_IMAGES})`
			);
			e.target.value = '';
			return;
		}

		const imagePromises = files.map((file) => readFileAsync(file));
		const uploadedImages = await Promise.all(imagePromises);
		setNewImages([...newImages, ...uploadedImages]);
		e.target.value = ''; // Reset input
	}

	// Helper function to read file as base64
	function readFileAsync(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve({
					id: FuseUtils.generateGUID(),
					url: `data:${file.type};base64,${btoa(reader.result)}`,
					type: 'image',
					file // Store original file for upload
				});
			};
			reader.onerror = reject;
			reader.readAsBinaryString(file);
		});
	}

	// Remove image from modal preview
	function handleRemoveNewImage(imageId) {
		setNewImages(newImages.filter((img) => img.id !== imageId));
	}

	// Upload images to server and close modal
	async function handleUploadImages() {
		if (newImages.length === 0) return;

		setIsUploading(true);

		try {
			const formData = {
				productId:productDataId,
				images: newImages
			};

			await addProductImages.mutateAsync(formData);
			setNewImages([]);
			setOpenAddModal(false);
		} catch (error) {
			console.error('Error uploading images:', error);
		} finally {
			setIsUploading(false);
		}
	}

	function handleCloseAddModal() {
		setNewImages([]);
		setOpenAddModal(false);
	}

	// Handle menu open for existing product images
	function handleImageMenuClick(event, image) {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
		setSelectedImage(image);
	}

	function handleMenuClose() {
		setAnchorEl(null);
		setSelectedImage(null);
	}

	// Open change image modal
	function handleOpenChangeModal() {
		setSelectedImageToChange(selectedImage);
		setOpenChangeModal(true);
		handleMenuClose();
	}

	// Open delete confirmation modal
	function handleOpenDeleteModal() {
		setSelectedImageToDelete(selectedImage);
		setOpenDeleteModal(true);
		handleMenuClose();
	}

	// Handle replacement image selection
	async function handleReplacementImageSelect(e) {
		const file = e?.target?.files?.[0];
		if (!file) return;

		const newImage = await readFileAsync(file);
		setNewReplacementImage(newImage);
		e.target.value = ''; // Reset input
	}

	// Change/Replace image
	async function handleChangeImage() {
		if (!newReplacementImage || !selectedImageToChange) return;

		setIsChanging(true);

		try {
			const changeData = {
				productId: productDataId,
				oldImagePublicId: selectedImageToChange.public_id,
				newImage: newReplacementImage
			};

			const changeImageData = {
				productId: productDataId,
				cloudinaryPublicId: selectedImageToChange.public_id, // Old Cloudinary public_id for deletion
      imageId: selectedImageToChange.id || selectedImageToChange._id, // Database ID of image to replace
      type: newReplacementImage?.type, // MIME type (e.g., "image/jpeg")
      url: newReplacementImage?.url // Base64 data URL
			}

			console.log("IMAGE__TO___CHANGE", changeData)
			console.log("IMAGE__TO___CHANGE___222", changeImageData)
			// return

			await changeProductImage.mutateAsync(changeImageData);

			// Reset state and close modal
			setNewReplacementImage(null);
			setSelectedImageToChange(null);
			setOpenChangeModal(false);
		} catch (error) {
			console.error('Error changing image:', error);
		} finally {
			setIsChanging(false);
		}
	}

	function handleCloseChangeModal() {
		setNewReplacementImage(null);
		setSelectedImageToChange(null);
		setOpenChangeModal(false);
	}

	// Delete image with confirmation
	async function handleConfirmDelete() {
		if (!selectedImageToDelete) return;

		const imageData = {
			productId:productDataId,
			imageId: selectedImageToDelete?.id || selectedImageToDelete?._id,
			cloudinaryPublicId: selectedImageToDelete.public_id
		};

		console.log('IMAGE__TO___DELETE', imageData);
		// return

		try {
			await deleteSingleImage.mutateAsync(imageData);
			setOpenDeleteModal(false);
			setSelectedImageToDelete(null);
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	}

	function handleCloseDeleteModal() {
		setOpenDeleteModal(false);
		setSelectedImageToDelete(null);
	}

	return (
		<Root>
			{/* Header with image count and limit info */}
			<Box className="mb-24">
				<Box className="flex items-center justify-between mb-12">
					<Box>
						<Typography
							variant="h5"
							className="font-bold text-2xl"
						>
							Product Images
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							className="mt-4"
						>
							Upload up to {MAX_IMAGES} high-quality images of your product
						</Typography>
					</Box>
					<Box className="flex items-center gap-8">
						<Typography
							variant="body2"
							color={existingImageCount >= MAX_IMAGES ? 'error' : 'text.secondary'}
							className="font-semibold"
						>
							{existingImageCount} / {MAX_IMAGES} images
						</Typography>
						{!isNewProduct && (
							<Button
								variant="contained"
								color="secondary"
								size="small"
								startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
								onClick={() => setOpenAddModal(true)}
								disabled={!canAddMoreImages}
							>
								Add More Images
							</Button>
						)}
					</Box>
				</Box>

				{existingImageCount >= MAX_IMAGES && (
					<Alert
						severity="warning"
						className="mb-16"
					>
						You have reached the maximum limit of {MAX_IMAGES} images. Delete some images to add new ones.
					</Alert>
				)}

				{!isNewProduct && remainingSlots > 0 && remainingSlots <= 3 && (
					<Alert
						severity="info"
						className="mb-16"
					>
						You can add {remainingSlots} more image{remainingSlots !== 1 ? 's' : ''}.
					</Alert>
				)}
			</Box>

			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				{/* Upload button - Only show for new products */}
				{isNewProduct && (
					<Controller
						name="images"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value } }) => (
							<Tooltip
								title={
									!canAddMoreImages ? `Maximum ${MAX_IMAGES} images allowed` : 'Click to upload product image'
								}
							>
								<Box
									sx={{
										backgroundColor: (theme) =>
											theme.palette.mode === 'light'
												? lighten(theme.palette.background.default, 0.4)
												: lighten(theme.palette.background.default, 0.02),
										opacity: !canAddMoreImages ? 0.5 : 1,
										cursor: !canAddMoreImages ? 'not-allowed' : 'pointer'
									}}
									component="label"
									htmlFor="button-file"
									className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden shadow hover:shadow-lg"
								>
									<input
										accept="image/*"
										className="hidden"
										id="button-file"
										type="file"
										disabled={!canAddMoreImages}
										onChange={(e) => handleNewProductImageUpload(e, onChange, value)}
									/>
									<Box className="flex flex-col items-center gap-8">
										<FuseSvgIcon
											size={32}
											color="action"
										>
											heroicons-outline:upload
										</FuseSvgIcon>
										<Typography
											variant="caption"
											color="text.secondary"
											className="text-center"
										>
											Upload Image
										</Typography>
									</Box>
								</Box>
							</Tooltip>
						)}
					/>
				)}

				{/* Display images based on mode */}
				{isNewProduct ? (
					// New Product Mode: Show images with remove capability from form state
					<Controller
						name="images"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange: onChangeImages, value: currentImages } }) => (
							<>
								{currentImages?.map((media, index) => (
									<div
										role="button"
										tabIndex={0}
										className="productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden outline-none shadow hover:shadow-lg"
										key={media.id || index}
									>
										<IconButton
											size="small"
											className="imageActionButton"
											onClick={(e) => {
												e.stopPropagation();
												// Remove image from array
												const updatedImages = currentImages.filter((img) => img.id !== media.id);
												onChangeImages(updatedImages);
											}}
											sx={{
												position: 'absolute',
												top: 4,
												right: 4,
												backgroundColor: 'rgba(255, 255, 255, 0.9)',
												'&:hover': {
													backgroundColor: 'rgba(255, 255, 255, 1)'
												}
											}}
										>
											<FuseSvgIcon size={16}>heroicons-solid:trash</FuseSvgIcon>
										</IconButton>
										<img
											className="max-w-none w-auto h-full"
											src={media.url}
											alt="product"
										/>
									</div>
								))}
							</>
						)}
					/>
				) : (
					// Existing Product Mode: Show database images with menu for change/delete
					<Controller
						name="featuredImageId"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => {
							return (
								<>
									{imageLinks?.map((media) => (
										<div
											onClick={() => onChange(media.public_id)}
											onKeyDown={() => onChange(media.public_id)}
											role="button"
											tabIndex={0}
											className={clsx(
												'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg',
												media.public_id === value && 'featured'
											)}
											key={media.public_id}
										>
											<IconButton
												size="small"
												className="imageActionButton"
												onClick={(e) => handleImageMenuClick(e, media)}
												sx={{
													position: 'absolute',
													top: 4,
													right: 4,
													backgroundColor: 'rgba(255, 255, 255, 0.9)',
													'&:hover': {
														backgroundColor: 'rgba(255, 255, 255, 1)'
													}
												}}
											>
												<FuseSvgIcon size={16}>heroicons-outline:dots-vertical</FuseSvgIcon>
											</IconButton>
											<img
												className="max-w-none w-auto h-full"
												src={media.url}
												alt="product"
											/>
										</div>
									))}
								</>
							);
						}}
					/>
				)}
			</div>

			{/* Context Menu for existing product images */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
			>
				<MenuItem
					onClick={handleOpenChangeModal}
					sx={{ gap: 1 }}
				>
					<FuseSvgIcon size={16}>heroicons-outline:refresh</FuseSvgIcon>
					Change Image
				</MenuItem>
				<MenuItem
					onClick={handleOpenDeleteModal}
					sx={{ gap: 1, color: 'error.main' }}
				>
					<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
					Delete Image
				</MenuItem>
			</Menu>

			{/* Modal for adding more images (Update mode only) */}
			<Dialog
				open={openAddModal}
				onClose={handleCloseAddModal}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					<Box className="flex items-center justify-between">
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								Add More Product Images
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Existing: {existingImageCount} • Available: {remainingSlots} • Max: {MAX_IMAGES}
							</Typography>
						</Box>
						<IconButton
							onClick={handleCloseAddModal}
							size="small"
						>
							<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="flex flex-col gap-16">
						{/* Upload button in modal */}
						<Box
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02),
								opacity: newImages.length + existingImageCount >= MAX_IMAGES ? 0.5 : 1
							}}
							component="label"
							htmlFor="modal-file-upload"
							className="flex items-center justify-center w-full h-160 rounded-16 cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors"
						>
							<input
								accept="image/*"
								className="hidden"
								id="modal-file-upload"
								type="file"
								multiple
								disabled={newImages.length + existingImageCount >= MAX_IMAGES}
								onChange={handleModalImageSelection}
							/>
							<Box className="flex flex-col items-center gap-8">
								<FuseSvgIcon
									size={48}
									color="action"
								>
									heroicons-outline:photograph
								</FuseSvgIcon>
								<Typography
									variant="body1"
									color="text.secondary"
									className="text-center font-semibold"
								>
									Click to select images
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									className="text-center"
								>
									{newImages.length} selected • {remainingSlots - newImages.length} remaining
								</Typography>
							</Box>
						</Box>

						{/* Preview selected images */}
						{newImages.length > 0 && (
							<Box>
								<Typography
									variant="subtitle2"
									className="mb-12 font-semibold"
								>
									Selected Images ({newImages.length})
								</Typography>
								<div className="flex flex-wrap gap-12">
									{newImages.map((image) => (
										<div
											key={image.id}
											className="relative w-96 h-96 rounded-8 overflow-hidden shadow hover:shadow-lg transition-shadow"
										>
											<img
												src={image.url}
												alt="preview"
												className="w-full h-full object-cover"
											/>
											<IconButton
												size="small"
												onClick={() => handleRemoveNewImage(image.id)}
												sx={{
													position: 'absolute',
													top: 4,
													right: 4,
													backgroundColor: 'rgba(255, 255, 255, 0.9)',
													'&:hover': {
														backgroundColor: 'rgba(255, 255, 255, 1)'
													}
												}}
											>
												<FuseSvgIcon size={16}>heroicons-solid:x</FuseSvgIcon>
											</IconButton>
										</div>
									))}
								</div>
							</Box>
						)}

						{/* Info/Warning based on selection state */}
						{newImages.length === 0 && (
							<Alert severity="info">
								No images selected yet. Click the upload area to select up to {remainingSlots} image
								{remainingSlots !== 1 ? 's' : ''}.
							</Alert>
						)}

						{newImages.length > 0 && existingImageCount + newImages.length === MAX_IMAGES && (
							<Alert severity="warning">
								You will reach the maximum limit of {MAX_IMAGES} images after uploading. No more images can
								be added.
							</Alert>
						)}

						{newImages.length > 0 && existingImageCount + newImages.length < MAX_IMAGES && (
							<Alert severity="success">
								After uploading, you will have {existingImageCount + newImages.length} of {MAX_IMAGES}{' '}
								images ({MAX_IMAGES - (existingImageCount + newImages.length)} slot
								{MAX_IMAGES - (existingImageCount + newImages.length) !== 1 ? 's' : ''} remaining).
							</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseAddModal}
						variant="outlined"
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleUploadImages}
						variant="contained"
						color="secondary"
						disabled={newImages.length === 0 || isUploading}
						startIcon={
							isUploading ? (
								<FuseSvgIcon
									size={16}
									className="animate-spin"
								>
									heroicons-outline:refresh
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>heroicons-outline:upload</FuseSvgIcon>
							)
						}
					>
						{isUploading ? 'Uploading...' : `Upload ${newImages.length} Image${newImages.length !== 1 ? 's' : ''}`}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Change Image Modal */}
			<Dialog
				open={openChangeModal}
				onClose={handleCloseChangeModal}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					<Box className="flex items-center justify-between">
						<Typography
							variant="h6"
							className="font-semibold"
						>
							Change Product Image
						</Typography>
						<IconButton
							onClick={handleCloseChangeModal}
							size="small"
						>
							<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="flex flex-col gap-16">
						{/* Current Image */}
						{selectedImageToChange && (
							<Box>
								<Typography
									variant="subtitle2"
									className="mb-8 font-semibold"
								>
									Current Image
								</Typography>
								<Box className="w-full h-200 rounded-8 overflow-hidden border border-gray-200">
									<img
										src={selectedImageToChange.url}
										alt="current"
										className="w-full h-full object-contain"
									/>
								</Box>
							</Box>
						)}

						{/* New Image Selection */}
						<Box>
							<Typography
								variant="subtitle2"
								className="mb-8 font-semibold"
							>
								Select New Image
							</Typography>
							<Box
								sx={{
									backgroundColor: (theme) =>
										theme.palette.mode === 'light'
											? lighten(theme.palette.background.default, 0.4)
											: lighten(theme.palette.background.default, 0.02)
								}}
								component="label"
								htmlFor="replacement-file"
								className="flex items-center justify-center w-full h-160 rounded-8 cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors"
							>
								<input
									accept="image/*"
									className="hidden"
									id="replacement-file"
									type="file"
									onChange={handleReplacementImageSelect}
								/>
								{newReplacementImage ? (
									<img
										src={newReplacementImage.url}
										alt="new"
										className="w-full h-full object-contain"
									/>
								) : (
									<Box className="flex flex-col items-center gap-8">
										<FuseSvgIcon
											size={32}
											color="action"
										>
											heroicons-outline:photograph
										</FuseSvgIcon>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Click to select replacement image
										</Typography>
									</Box>
								)}
							</Box>
						</Box>

						{newReplacementImage && (
							<Alert severity="info">
								The current image will be replaced with the new one when you click "Change Image".
							</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseChangeModal}
						variant="outlined"
						disabled={isChanging}
					>
						Cancel
					</Button>
					<Button
						onClick={handleChangeImage}
						variant="contained"
						color="secondary"
						disabled={!newReplacementImage || isChanging}
						startIcon={
							isChanging ? (
								<FuseSvgIcon
									size={16}
									className="animate-spin"
								>
									heroicons-outline:refresh
								</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>heroicons-outline:refresh</FuseSvgIcon>
							)
						}
					>
						{isChanging ? 'Changing...' : 'Change Image'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Modal */}
			<Dialog
				open={openDeleteModal}
				onClose={handleCloseDeleteModal}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>
					<Box className="flex items-center gap-8">
						<FuseSvgIcon
							size={24}
							className="text-error"
						>
							heroicons-outline:exclamation
						</FuseSvgIcon>
						<Typography
							variant="h6"
							className="font-semibold"
						>
							Delete Image?
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="flex flex-col gap-16">
						{selectedImageToDelete && (
							<Box className="w-full h-200 rounded-8 overflow-hidden border border-gray-200">
								<img
									src={selectedImageToDelete.url}
									alt="to delete"
									className="w-full h-full object-contain"
								/>
							</Box>
						)}
						<Alert severity="warning">
							Are you sure you want to delete this image? This action cannot be undone.
						</Alert>
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseDeleteModal}
						variant="outlined"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						variant="contained"
						color="error"
						startIcon={<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>}
					>
						Delete Image
					</Button>
				</DialogActions>
			</Dialog>
		</Root>
	);
}

export default ProductImagesTab;
