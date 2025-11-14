import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import _ from '@lodash';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import {
	InputAdornment,
	MenuItem,
	Select,
	TextField,
	Paper,
	Chip,
	Tooltip,
	Badge,
	FormControl,
	FormLabel,
	Grid,
	Card,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress
} from '@mui/material';
import Box from '@mui/material/Box';
import FuseUtils from '@fuse/utils';
import FusePageSimple from '@fuse/core/FusePageSimple';
import {
	useAddRoomPropertyMutation,
	useGetSingleRoomOfProperty,
	useRoomOnPropertyUpdateMutation,
	useUpdateRoomImageMutation,
	useDeleteRoomImageMutation,
	useDeleteRoomMutation
} from 'app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps';
import { motion } from 'framer-motion';
import { closeRoomMenuPanel, selectRoomMenuPanelState } from './roomMenuPanelSlice';

export const statuses = ['AVAILABLE', 'BOOKED', 'MAINTENANCE'];

// Status color mapping
const getStatusColor = (status) => {
	switch (status) {
		case 'AVAILABLE':
			return { bg: '#10B981', text: '#ECFDF5' };
		case 'BOOKED':
			return { bg: '#F59E0B', text: '#FFFBEB' };
		case 'MAINTENANCE':
			return { bg: '#EF4444', text: '#FEF2F2' };
		default:
			return { bg: '#6B7280', text: '#F3F4F6' };
	}
};

// Styled Image Card Component
const ImageCard = styled(Card)(({ theme, isNew }) => ({
	position: 'relative',
	width: 160,
	height: 160,
	margin: theme.spacing(1.5),
	borderRadius: 12,
	overflow: 'hidden',
	border: isNew ? `2px solid ${theme.palette.success.main}` : 'none',
	transition: 'all 0.3s ease',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: theme.shadows[8]
	}
}));

// Local Storage Keys
const STORAGE_KEYS = {
	SLIDER_OPEN: 'roomPanel_sliderOpen',
	ROOM_ID: 'roomPanel_roomId',
	APARTMENT_ID: 'roomPanel_apartmentId'
};

/**
 * Production-Ready Room Management Panel
 * Features: Persistent state, modal image replacement with Cloudinary cleanup
 */

function RoomMenuPanel(props) {
	const { roomId, setRoomId, apartmentId, toggleNewEntryDrawer } = props;

	const location = useLocation();
	const dispatch = useAppDispatch();
	const state = useAppSelector(selectRoomMenuPanelState);

	// Persistent slider state
	const [isSliderOpen, setIsSliderOpen] = useState(() => {
		const stored = localStorage.getItem(STORAGE_KEYS.SLIDER_OPEN);
		return stored === 'true';
	});

	// Track images to be deleted
	const [imagesToDelete, setImagesToDelete] = useState([]);

	// Image replacement modal state
	const [replaceModalOpen, setReplaceModalOpen] = useState(false);
	const [imageToReplace, setImageToReplace] = useState(null);
	const [newImageFile, setNewImageFile] = useState(null);
	const [newImagePreview, setNewImagePreview] = useState(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	// Image deletion confirmation modal state
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [imageToDelete, setImageToDelete] = useState(null);

	// Room deletion confirmation modal state
	const [deleteRoomConfirmOpen, setDeleteRoomConfirmOpen] = useState(false);

	// Track if we've already loaded initial room data
	const hasLoadedInitialData = useRef(false);

	// Persist slider state on change
	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.SLIDER_OPEN, isSliderOpen);

		if (isSliderOpen && roomId) {
			localStorage.setItem(STORAGE_KEYS.ROOM_ID, roomId);
			localStorage.setItem(STORAGE_KEYS.APARTMENT_ID, apartmentId);
		}
	}, [isSliderOpen, roomId, apartmentId]);

	// Restore slider state on page load
	useEffect(() => {
		const storedOpen = localStorage.getItem(STORAGE_KEYS.SLIDER_OPEN) === 'true';
		const storedRoomId = localStorage.getItem(STORAGE_KEYS.ROOM_ID);
		const storedApartmentId = localStorage.getItem(STORAGE_KEYS.APARTMENT_ID);

		if (storedOpen && storedRoomId && !roomId) {
			setRoomId(storedRoomId);
			toggleNewEntryDrawer(true);
		}
	}, []);

	useEffect(() => {
		if (state) {
			dispatch(closeRoomMenuPanel());
		}
	}, [location, dispatch]);

	function handleClose() {
		toggleNewEntryDrawer(false);
		setIsSliderOpen(false);
		setRoomId(null);
		setImagesToDelete([]);
		setReplaceModalOpen(false);
		setImageToReplace(null);
		setNewImageFile(null);
		setNewImagePreview(null);
		hasLoadedInitialData.current = false;

		// Clear persistent storage
		localStorage.removeItem(STORAGE_KEYS.SLIDER_OPEN);
		localStorage.removeItem(STORAGE_KEYS.ROOM_ID);
		localStorage.removeItem(STORAGE_KEYS.APARTMENT_ID);
	}

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			roomNumber: '',
			roomStatus: '',
			price: '',
			title: '',
			description: '',
			bookingPropertyId: apartmentId,
			images: []
		}
	});
	const { reset, watch } = methods;

	const { control, formState, getValues } = methods;
	const { isValid, dirtyFields, errors } = formState;

	const addRoomProperty = useAddRoomPropertyMutation();
	const updateRoomOnBookingsProperty = useRoomOnPropertyUpdateMutation();
	const updateRoomImage = useUpdateRoomImageMutation();
	const deleteRoomImage = useDeleteRoomImageMutation();
	const deleteRoom = useDeleteRoomMutation();

	const { data: room } = useGetSingleRoomOfProperty(roomId, {
		skip: !roomId
	});

	const images = watch('images');
	const imageSrcs = watch('imageSrcs');

	useEffect(() => {
		setIsSliderOpen(true);
	}, [roomId, apartmentId]);

	/**
	 * Open delete confirmation modal
	 */
	const handleRemoveExistingImage = (imageId) => {
		const currentImageSrcs = getValues('imageSrcs') || [];
		const imageToRemove = currentImageSrcs.find((img) => img.id === imageId);

		if (!imageToRemove || !roomId) {
			toast.error('Unable to delete image. Missing image or room information.');
			return;
		}

		setImageToDelete(imageToRemove);
		setDeleteConfirmOpen(true);
	};

	/**
	 * Confirm and execute image deletion
	 */
	const handleConfirmDelete = () => {
		if (!imageToDelete || !roomId) return;

		// Call the API to delete the image immediately
		deleteRoomImage.mutate(
			{
				roomImageId: imageToDelete.id,
				cloudinaryPublicId: imageToDelete.public_id,
				roomId
			},
			{
				onSuccess: () => {
					// Update local state to remove the deleted image
					const currentImageSrcs = getValues('imageSrcs') || [];
					const updatedImageSrcs = currentImageSrcs.filter((img) => img.id !== imageToDelete.id);
					methods.setValue('imageSrcs', updatedImageSrcs, { shouldDirty: false });

					// Close modal and reset state
					setDeleteConfirmOpen(false);
					setImageToDelete(null);
				},
				onError: () => {
					setDeleteConfirmOpen(false);
					setImageToDelete(null);
				}
			}
		);
	};

	/**
	 * Cancel image deletion
	 */
	const handleCancelDelete = () => {
		setDeleteConfirmOpen(false);
		setImageToDelete(null);
	};

	/**
	 * Remove a newly uploaded image (from images array)
	 */
	const handleRemoveNewImage = (imageId) => {
		const currentImages = getValues('images') || [];
		const updatedImages = currentImages.filter((img) => img.id !== imageId);
		methods.setValue('images', updatedImages, { shouldDirty: true });
		toast.success('New image removed');
	};

	/**
	 * Open replace modal
	 */
	const handleOpenReplaceModal = (media) => {
		setImageToReplace(media);
		setReplaceModalOpen(true);
		setNewImageFile(null);
		setNewImagePreview(null);
	};

	/**
	 * Handle file selection in modal
	 */
	const handleFileSelect = (event) => {
		const file = event.target.files?.[0];

		if (!file) return;

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setNewImagePreview(e.target.result);
		};
		reader.readAsDataURL(file);
		setNewImageFile(file);
	};

	/**
	 * Confirm image replacement - uploads to Cloudinary and marks old for deletion
	 * This function now calls the API immediately to replace the image
	 * Matches backend UpdateRoomImageDto structure
	 */
	const handleConfirmReplacement = async () => {
		if (!newImageFile || !imageToReplace || !roomId) return;

		setIsUploadingImage(true);

		try {
			// Convert file to base64 for backend processing
			const reader = new FileReader();
			reader.onload = () => {
				const base64Image = btoa(reader.result);

				// console.log("Uploading new image to replace:", imageToReplace.id);

				// Call the API mutation with DTO-compliant structure
				updateRoomImage.mutate(
					{
						roomId,
						cloudinaryPublicId: imageToReplace.public_id, // Old Cloudinary public_id for deletion
						replacesId: imageToReplace.id, // Database ID of image to replace
						type: newImageFile.type, // MIME type (e.g., "image/jpeg")
						url: `data:${newImageFile.type};base64,${base64Image}` // Base64 data URL
					},
					{
						onSuccess: (response) => {
							console.log('Image replacement successful:', response);

							// Update local state to reflect the change
							const currentImageSrcs = getValues('imageSrcs') || [];
							const updatedImageSrcs = currentImageSrcs.map((img) =>
								img.id === imageToReplace.id ? { ...img, ...response.data.image } : img
							);
							methods.setValue('imageSrcs', updatedImageSrcs, { shouldDirty: false });

							setIsUploadingImage(false);
							setReplaceModalOpen(false);
							setImageToReplace(null);
							setNewImageFile(null);
							setNewImagePreview(null);

							toast.success('Image replaced successfully! Old image removed from Storage.');
						},
						onError: (error) => {
							console.error('Image replacement failed:', error);
							setIsUploadingImage(false);
							toast.error('Failed to replace image. Please try again.');
						}
					}
				);
			};
			reader.onerror = () => {
				toast.error('Failed to process image file');
				setIsUploadingImage(false);
			};
			reader.readAsBinaryString(newImageFile);
		} catch (error) {
			toast.error('Error processing image replacement');
			console.error(error);
			setIsUploadingImage(false);
		}
	};

	/**
	 * Cancel replacement
	 */
	const handleCancelReplacement = () => {
		setReplaceModalOpen(false);
		setImageToReplace(null);
		setNewImageFile(null);
		setNewImagePreview(null);
	};

	function handleCreateRoomOnApartmentCall() {
		const formattedData = {
			...getValues(),
			price: parseInt(getValues().price),
			images: getValues().images || []
		};
		addRoomProperty.mutate(formattedData);
	}

	function handleSaveRoomOnApartment() {
		const formattedData = {
			...getValues(),
			price: parseInt(getValues().price),
			images: getValues().images || [],
			imagesToDelete: imagesToDelete.map((img) => ({
				id: img.id,
				public_id: img.public_id // Send Cloudinary public_id for deletion
			})),
			imageSrcs: getValues('imageSrcs') || []
		};

		updateRoomOnBookingsProperty.mutate(formattedData);
	}

	// Open delete room confirmation dialog
	function handleRemoveRoomOnApartment() {
		setDeleteRoomConfirmOpen(true);
	}

	// Confirm and execute room deletion
	function handleConfirmRoomDelete() {
		if (roomId) {
			deleteRoom.mutate(roomId, {
				onSuccess: () => {
					// Close the panel after successful deletion
					handleClose();
					setDeleteRoomConfirmOpen(false);
				}
			});
		}
	}

	// Cancel room deletion
	function handleCancelRoomDelete() {
		setDeleteRoomConfirmOpen(false);
	}

	useEffect(() => {
		if (addRoomProperty.isSuccess) {
			reset({});
			methods.clearErrors();
			setImagesToDelete([]);
			hasLoadedInitialData.current = false;
		}
	}, [addRoomProperty.isSuccess, methods, reset]);

	useEffect(() => {
		if (updateRoomOnBookingsProperty.isSuccess) {
			setImagesToDelete([]);
			toast.success('Room updated successfully! Images uploaded and old images cleaned up.');
		}
	}, [updateRoomOnBookingsProperty.isSuccess]);

	useEffect(() => {
		hasLoadedInitialData.current = false;
		setImagesToDelete([]);

		if (!roomId) {
			reset({
				roomNumber: '',
				roomStatus: '',
				price: '',
				title: '',
				description: '',
				bookingPropertyId: apartmentId,
				images: [],
				imageSrcs: []
			});
		}
	}, [roomId, reset, apartmentId]);

	useEffect(() => {
		if (roomId && room?.data?.room && !hasLoadedInitialData.current) {
			reset({ ...room?.data?.room });
			setImagesToDelete([]);
			hasLoadedInitialData.current = true;
		}
	}, [room, reset, roomId]);

	return (
		<>
			<FusePageSimple
				content={
					<div className="flex flex-auto flex-col px-24 py-32 sm:px-32 sm:pb-80 sm:pt-48">
						{/* Header Section */}
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex items-center justify-between mb-32"
						>
							<div>
								<Typography className="text-32 font-black leading-none tracking-tight">
									{roomId ? 'Edit Room' : 'Add New Room'}
								</Typography>
								<Typography
									className="text-14 mt-8"
									color="text.secondary"
								>
									{roomId
										? 'Update room details and manage images'
										: 'Fill in the details to create a new room'}
								</Typography>
							</div>

							<Tooltip title="Close">
								<IconButton
									onClick={handleClose}
									size="large"
									sx={{
										backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
										'&:hover': {
											backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2)
										}
									}}
								>
									<FuseSvgIcon color="error">heroicons-outline:x</FuseSvgIcon>
								</IconButton>
							</Tooltip>
						</motion.div>

						<FuseScrollbars className="flex-1">
							<div className="flex flex-col gap-24">
								{/* Room Information Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
								>
									<Paper
										elevation={0}
										className="p-24 rounded-xl"
										sx={{
											border: (theme) => `1px solid ${theme.palette.divider}`
										}}
									>
										<div className="flex items-center gap-12 mb-24">
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: '10px',
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<FuseSvgIcon
													size={20}
													className="text-white"
												>
													heroicons-outline:home
												</FuseSvgIcon>
											</Box>
											<div>
												<Typography className="text-18 font-bold">Room Information</Typography>
												<Typography
													className="text-12"
													color="text.secondary"
												>
													Basic details about this room
												</Typography>
											</div>
										</div>

										<Grid
											container
											spacing={2}
										>
											<Grid
												item
												xs={12}
											>
												<Controller
													name="title"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															required
															label="Room Name"
															placeholder="e.g., Deluxe Ocean View Suite"
															autoFocus
															variant="outlined"
															fullWidth
															error={!!errors.title}
															helperText={
																errors?.title?.message ||
																'Give this room a descriptive name'
															}
															InputProps={{
																startAdornment: (
																	<InputAdornment position="start">
																		<FuseSvgIcon
																			size={20}
																			color="action"
																		>
																			heroicons-outline:identification
																		</FuseSvgIcon>
																	</InputAdornment>
																)
															}}
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												sm={6}
											>
												<Controller
													name="roomNumber"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="Room Number"
															placeholder="e.g., 101"
															type="number"
															variant="outlined"
															fullWidth
															InputProps={{
																startAdornment: (
																	<InputAdornment position="start">
																		<FuseSvgIcon
																			size={20}
																			color="action"
																		>
																			heroicons-outline:hashtag
																		</FuseSvgIcon>
																	</InputAdornment>
																)
															}}
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												sm={6}
											>
												<Controller
													name="price"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="Price per Night"
															placeholder="e.g., 150"
															type="number"
															variant="outlined"
															fullWidth
															InputProps={{
																startAdornment: (
																	<InputAdornment position="start">
																		<FuseSvgIcon
																			size={20}
																			color="action"
																		>
																			heroicons-outline:currency-dollar
																		</FuseSvgIcon>
																	</InputAdornment>
																)
															}}
														/>
													)}
												/>
											</Grid>

											<Grid
												item
												xs={12}
											>
												<FormControl fullWidth>
													<FormLabel
														sx={{
															fontSize: '14px',
															fontWeight: 600,
															mb: 1,
															color: 'text.primary'
														}}
													>
														Room Status
													</FormLabel>
													<Controller
														name="roomStatus"
														control={control}
														render={({ field: { onChange, value } }) => (
															<Select
																onChange={onChange}
																value={value || ''}
																displayEmpty
																sx={{
																	'& .MuiSelect-select': {
																		display: 'flex',
																		alignItems: 'center',
																		gap: 1
																	}
																}}
																startAdornment={
																	<InputAdornment position="start">
																		<FuseSvgIcon
																			size={20}
																			color="action"
																		>
																			heroicons-outline:status-online
																		</FuseSvgIcon>
																	</InputAdornment>
																}
															>
																<MenuItem value="">
																	<em>Select status</em>
																</MenuItem>
																{statuses.map((status) => {
																	const colors = getStatusColor(status);
																	return (
																		<MenuItem
																			key={status}
																			value={status}
																		>
																			<Chip
																				label={status}
																				size="small"
																				sx={{
																					backgroundColor: colors.bg,
																					color: 'white',
																					fontWeight: 700,
																					fontSize: '11px'
																				}}
																			/>
																		</MenuItem>
																	);
																})}
															</Select>
														)}
													/>
												</FormControl>
											</Grid>

											<Grid
												item
												xs={12}
											>
												<Controller
													name="description"
													control={control}
													render={({ field }) => (
														<TextField
															{...field}
															label="Description"
															placeholder="Describe the room amenities, features, and highlights..."
															multiline
															rows={4}
															variant="outlined"
															fullWidth
															helperText="Provide a detailed description to attract guests"
															InputProps={{
																startAdornment: (
																	<InputAdornment
																		position="start"
																		sx={{ alignSelf: 'flex-start', mt: 2 }}
																	>
																		<FuseSvgIcon
																			size={20}
																			color="action"
																		>
																			heroicons-outline:document-text
																		</FuseSvgIcon>
																	</InputAdornment>
																)
															}}
														/>
													)}
												/>
											</Grid>
										</Grid>
									</Paper>
								</motion.div>

								{/* Image Management Card */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<Paper
										elevation={0}
										className="p-24 rounded-xl"
										sx={{
											border: (theme) => `1px solid ${theme.palette.divider}`
										}}
									>
										<div className="flex items-center gap-12 mb-24">
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: '10px',
													background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<FuseSvgIcon
													size={20}
													className="text-white"
												>
													heroicons-outline:photograph
												</FuseSvgIcon>
											</Box>
											<div>
												<Typography className="text-18 font-bold">Room Images</Typography>
												<Typography
													className="text-12"
													color="text.secondary"
												>
													Upload, replace, or remove images • Cloudinary managed
												</Typography>
											</div>
										</div>

										<div className="flex flex-wrap gap-16">
											{/* Upload Button */}
											<Controller
												name="images"
												control={control}
												render={({ field: { onChange, value } }) => (
													<Tooltip title="Upload new image">
														<Box
															component="label"
															htmlFor="button-file"
															sx={{
																width: 160,
																height: 160,
																borderRadius: 3,
																border: (theme) =>
																	`2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
																backgroundColor: (theme) =>
																	alpha(theme.palette.primary.main, 0.05),
																display: 'flex',
																flexDirection: 'column',
																alignItems: 'center',
																justifyContent: 'center',
																cursor: 'pointer',
																transition: 'all 0.3s ease',
																'&:hover': {
																	borderColor: (theme) => theme.palette.primary.main,
																	backgroundColor: (theme) =>
																		alpha(theme.palette.primary.main, 0.1),
																	transform: 'scale(1.05)'
																}
															}}
														>
															<input
																accept="image/*"
																className="hidden"
																id="button-file"
																type="file"
																onChange={async (e) => {
																	const file = e?.target?.files?.[0];

																	if (!file) return;

																	const reader = new FileReader();
																	reader.onload = () => {
																		const newImage = {
																			id: FuseUtils.generateGUID(),
																			url: `data:${file.type};base64,${btoa(reader.result)}`,
																			type: 'image'
																		};
																		onChange([...(value || []), newImage]);
																		toast.success('Image added successfully');
																	};
																	reader.onerror = () =>
																		toast.error('Failed to read file');
																	reader.readAsBinaryString(file);
																}}
															/>
															<FuseSvgIcon
																size={32}
																color="primary"
															>
																heroicons-outline:cloud-upload
															</FuseSvgIcon>
															<Typography
																className="text-12 font-bold mt-8"
																color="primary"
															>
																Upload Image
															</Typography>
														</Box>
													</Tooltip>
												)}
											/>

											{/* Existing Images from Server */}
											{imageSrcs?.map((media, index) => (
												<motion.div
													key={media.id || media.public_id}
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
													transition={{ delay: index * 0.05 }}
												>
													<ImageCard elevation={3}>
														<Badge
															badgeContent="Current"
															sx={{
																'& .MuiBadge-badge': {
																	backgroundColor: '#3B82F6',
																	color: 'white',
																	fontWeight: 700,
																	fontSize: '10px'
																}
															}}
														>
															<img
																src={media.url}
																alt="room"
																style={{
																	width: '100%',
																	height: '100%',
																	objectFit: 'cover'
																}}
															/>
														</Badge>

														{/* Image Actions Overlay */}
														<Box
															className="image-actions"
															sx={{
																position: 'absolute',
																top: 0,
																left: 0,
																right: 0,
																bottom: 0,
																background: 'rgba(0, 0, 0, 0.7)',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																gap: 1,
																opacity: 0,
																transition: 'opacity 0.3s ease',
																'&:hover': {
																	opacity: 1
																}
															}}
														>
															{/* Replace Button - Opens Modal */}
															<Tooltip title="Replace image">
																<IconButton
																	onClick={() => handleOpenReplaceModal(media)}
																	size="medium"
																	sx={{
																		backgroundColor: 'rgba(59, 130, 246, 0.9)',
																		color: 'white',
																		'&:hover': {
																			backgroundColor: '#3B82F6'
																		}
																	}}
																>
																	<FuseSvgIcon size={18}>
																		heroicons-outline:refresh
																	</FuseSvgIcon>
																</IconButton>
															</Tooltip>

															{/* Delete Button */}
															<Tooltip title="Delete image">
																<IconButton
																	onClick={() => handleRemoveExistingImage(media.id)}
																	size="medium"
																	sx={{
																		backgroundColor: 'rgba(239, 68, 68, 0.9)',
																		color: 'white',
																		'&:hover': {
																			backgroundColor: '#EF4444'
																		}
																	}}
																>
																	<FuseSvgIcon size={18}>
																		heroicons-outline:trash
																	</FuseSvgIcon>
																</IconButton>
															</Tooltip>
														</Box>
													</ImageCard>
												</motion.div>
											))}

											{/* New Uploaded Images */}
											{images?.map((media, index) => (
												<motion.div
													key={media.id}
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
													transition={{ delay: index * 0.05 }}
												>
													<ImageCard
														elevation={3}
														isNew
													>
														<Badge
															badgeContent="New"
															sx={{
																'& .MuiBadge-badge': {
																	backgroundColor: '#10B981',
																	color: 'white',
																	fontWeight: 700,
																	fontSize: '10px'
																}
															}}
														>
															<img
																src={media.url}
																alt="new upload"
																style={{
																	width: '100%',
																	height: '100%',
																	objectFit: 'cover'
																}}
															/>
														</Badge>

														{/* Remove Button for New Images */}
														<Tooltip title="Remove">
															<IconButton
																onClick={() => handleRemoveNewImage(media.id)}
																size="small"
																sx={{
																	position: 'absolute',
																	top: 8,
																	right: 8,
																	backgroundColor: 'rgba(239, 68, 68, 0.9)',
																	color: 'white',
																	'&:hover': {
																		backgroundColor: '#EF4444'
																	}
																}}
															>
																<FuseSvgIcon size={16}>heroicons-outline:x</FuseSvgIcon>
															</IconButton>
														</Tooltip>
													</ImageCard>
												</motion.div>
											))}

											{/* Empty State */}
											{(!imageSrcs || imageSrcs.length === 0) &&
												(!images || images.length === 0) && (
													<Box
														className="w-full"
														sx={{
															py: 6,
															textAlign: 'center',
															backgroundColor: (theme) =>
																alpha(theme.palette.action.hover, 0.3),
															borderRadius: 2
														}}
													>
														<FuseSvgIcon
															size={48}
															color="disabled"
														>
															heroicons-outline:photograph
														</FuseSvgIcon>
														<Typography
															className="text-14 mt-12"
															color="text.secondary"
														>
															No images yet. Upload images to showcase this room
														</Typography>
													</Box>
												)}
										</div>

										{/* Image Count Info */}
										{((imageSrcs && imageSrcs.length > 0) || (images && images.length > 0)) && (
											<Box className="mt-16 flex items-center justify-between flex-wrap gap-8">
												<div className="flex items-center gap-8">
													<Chip
														label={`${imageSrcs?.length || 0} Current`}
														size="small"
														color="primary"
														variant="outlined"
													/>
													{images && images.length > 0 && (
														<Chip
															label={`${images.length} New`}
															size="small"
															sx={{
																backgroundColor: '#10B981',
																color: 'white'
															}}
														/>
													)}
													{imagesToDelete && imagesToDelete.length > 0 && (
														<Chip
															label={`${imagesToDelete.length} To Delete`}
															size="small"
															sx={{
																backgroundColor: '#EF4444',
																color: 'white'
															}}
														/>
													)}
												</div>
												<Typography
													className="text-12"
													color="text.secondary"
												>
													Click replace to open modal • Changes saved to Cloudinary
												</Typography>
											</Box>
										)}
									</Paper>
								</motion.div>

								{/* Action Buttons */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="flex items-center gap-12 justify-end pb-24"
								>
									{roomId ? (
										<>
											<Button
												variant="outlined"
												color="error"
												size="large"
												onClick={handleRemoveRoomOnApartment}
												startIcon={<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>}
												sx={{
													fontWeight: 700,
													borderWidth: 2,
													'&:hover': {
														borderWidth: 2
													}
												}}
											>
												Delete Room
											</Button>
											<Button
												variant="contained"
												size="large"
												disabled={
													_.isEmpty(dirtyFields) ||
													!isValid ||
													updateRoomOnBookingsProperty.isLoading
												}
												onClick={handleSaveRoomOnApartment}
												startIcon={
													updateRoomOnBookingsProperty.isLoading ? (
														<FuseSvgIcon className="animate-spin">
															heroicons-outline:refresh
														</FuseSvgIcon>
													) : (
														<FuseSvgIcon>heroicons-outline:check</FuseSvgIcon>
													)
												}
												sx={{
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
													fontWeight: 700,
													px: 4,
													'&:hover': {
														background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
													}
												}}
											>
												{updateRoomOnBookingsProperty.isLoading ? 'Saving...' : 'Save Changes'}
											</Button>
										</>
									) : (
										<Button
											variant="contained"
											size="large"
											disabled={_.isEmpty(dirtyFields) || !isValid || addRoomProperty.isLoading}
											onClick={handleCreateRoomOnApartmentCall}
											startIcon={
												addRoomProperty.isLoading ? (
													<FuseSvgIcon className="animate-spin">
														heroicons-outline:refresh
													</FuseSvgIcon>
												) : (
													<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
												)
											}
											sx={{
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												fontWeight: 700,
												px: 4,
												'&:hover': {
													background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
												}
											}}
										>
											{addRoomProperty.isLoading ? 'Creating...' : 'Create Room'}
										</Button>
									)}
								</motion.div>
							</div>
						</FuseScrollbars>
					</div>
				}
			/>

			{/* Image Replacement Modal */}
			<Dialog
				open={replaceModalOpen}
				onClose={handleCancelReplacement}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 3
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<FuseSvgIcon
								size={20}
								className="text-white"
							>
								heroicons-outline:photograph
							</FuseSvgIcon>
						</Box>
						<div>
							<Typography className="text-20 font-bold">Replace Room Image</Typography>
							<Typography
								className="text-12"
								color="text.secondary"
							>
								Upload new image • Automatic Cloudinary cleanup
							</Typography>
						</div>
					</Box>
				</DialogTitle>

				<DialogContent>
					<Box className="flex flex-col gap-24 pt-16">
						{/* Current Image */}
						{imageToReplace && (
							<Box>
								<Typography className="text-14 font-bold mb-12">Current Image</Typography>
								<Box
									sx={{
										width: '100%',
										height: 200,
										borderRadius: 2,
										overflow: 'hidden',
										border: (theme) => `2px solid ${theme.palette.divider}`
									}}
								>
									<img
										src={imageToReplace.url}
										alt="current"
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}}
									/>
								</Box>
							</Box>
						)}

						{/* New Image Upload */}
						<Box>
							<Typography className="text-14 font-bold mb-12">New Image</Typography>
							{newImagePreview ? (
								<Box
									sx={{
										width: '100%',
										height: 200,
										borderRadius: 2,
										overflow: 'hidden',
										border: '2px solid #10B981'
									}}
								>
									<img
										src={newImagePreview}
										alt="new preview"
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}}
									/>
								</Box>
							) : (
								<Box
									component="label"
									htmlFor="replace-modal-file"
									sx={{
										width: '100%',
										height: 200,
										borderRadius: 2,
										border: (theme) => `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
										backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
										'&:hover': {
											borderColor: (theme) => theme.palette.primary.main,
											backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1)
										}
									}}
								>
									<input
										accept="image/*"
										className="hidden"
										id="replace-modal-file"
										type="file"
										onChange={handleFileSelect}
									/>
									<FuseSvgIcon
										size={48}
										color="primary"
									>
										heroicons-outline:cloud-upload
									</FuseSvgIcon>
									<Typography
										className="text-14 font-bold mt-12"
										color="primary"
									>
										Click to select new image
									</Typography>
								</Box>
							)}
						</Box>

						{/* Info Alert */}
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								backgroundColor: alpha('#3B82F6', 0.1),
								border: `1px solid ${alpha('#3B82F6', 0.2)}`
							}}
						>
							<Box className="flex items-start gap-8">
								<FuseSvgIcon
									size={20}
									sx={{ color: '#3B82F6', mt: '2px' }}
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<div>
									<Typography
										className="text-12 font-bold"
										sx={{ color: '#3B82F6' }}
									>
										Immediate Upload & Cleanup
									</Typography>
									<Typography
										className="text-11 mt-4"
										color="text.secondary"
									>
										Clicking "Confirm Replacement" will immediately upload the new image to
										Cloudinary and permanently delete the old image from storage. This action cannot
										be undone.
									</Typography>
								</div>
							</Box>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button
						onClick={handleCancelReplacement}
						variant="outlined"
						color="inherit"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmReplacement}
						variant="contained"
						disabled={!newImageFile || isUploadingImage}
						startIcon={
							isUploadingImage ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
							)
						}
						sx={{
							background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
							}
						}}
					>
						{isUploadingImage ? 'Processing...' : 'Confirm Replacement'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Image Deletion Confirmation Modal */}
			<Dialog
				open={deleteConfirmOpen}
				onClose={handleCancelDelete}
				maxWidth="xs"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 3,
						overflow: 'visible'
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: '12px',
								background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<FuseSvgIcon
								size={24}
								sx={{ color: '#EF4444' }}
							>
								heroicons-outline:exclamation
							</FuseSvgIcon>
						</Box>
						<div>
							<Typography
								className="text-20 font-bold"
								sx={{ color: '#1F2937' }}
							>
								Delete Room Image?
							</Typography>
							<Typography
								className="text-12 mt-4"
								color="text.secondary"
							>
								This action is permanent and cannot be undone
							</Typography>
						</div>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ pt: 2 }}>
					<Box className="flex flex-col gap-20">
						{/* Image Preview */}
						{imageToDelete && (
							<Box
								sx={{
									position: 'relative',
									width: '100%',
									height: 180,
									borderRadius: 2,
									overflow: 'hidden',
									border: '2px solid #FCA5A5'
								}}
							>
								<img
									src={imageToDelete.url}
									alt="to delete"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover'
									}}
								/>
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'rgba(239, 68, 68, 0.15)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<Box
										sx={{
											width: 64,
											height: 64,
											borderRadius: '50%',
											backgroundColor: 'rgba(255, 255, 255, 0.95)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
										}}
									>
										<FuseSvgIcon
											size={32}
											sx={{ color: '#EF4444' }}
										>
											heroicons-outline:trash
										</FuseSvgIcon>
									</Box>
								</Box>
							</Box>
						)}

						{/* Warning Message */}
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								backgroundColor: alpha('#FEF2F2', 0.8),
								border: `1px solid ${alpha('#FCA5A5', 0.4)}`
							}}
						>
							<Box className="flex items-start gap-8">
								<FuseSvgIcon
									size={20}
									sx={{ color: '#DC2626', mt: '2px' }}
								>
									heroicons-outline:shield-exclamation
								</FuseSvgIcon>
								<div>
									<Typography
										className="text-13 font-bold"
										sx={{ color: '#991B1B' }}
									>
										Permanent Deletion
									</Typography>
									<Typography
										className="text-12 mt-4"
										sx={{ color: '#7F1D1D', lineHeight: 1.5 }}
									>
										This image will be immediately removed from both your room listing and cloud
										storage. Your guests will no longer see this image.
									</Typography>
								</div>
							</Box>
						</Box>

						{/* Confirmation Text */}
						<Typography
							className="text-14 text-center"
							sx={{ color: '#6B7280', px: 2 }}
						>
							Are you sure you want to proceed with this deletion?
						</Typography>
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
					<Button
						onClick={handleCancelDelete}
						variant="outlined"
						size="large"
						fullWidth
						sx={{
							fontWeight: 600,
							borderWidth: 2,
							borderColor: '#E5E7EB',
							color: '#6B7280',
							'&:hover': {
								borderWidth: 2,
								borderColor: '#D1D5DB',
								backgroundColor: '#F9FAFB'
							}
						}}
					>
						Keep Image
					</Button>
					<Button
						onClick={handleConfirmDelete}
						variant="contained"
						size="large"
						fullWidth
						disabled={deleteRoomImage.isLoading}
						startIcon={
							deleteRoomImage.isLoading ? (
								<CircularProgress
									size={18}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
							color: 'white',
							'&:hover': {
								background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
							},
							'&:disabled': {
								background: '#FCA5A5',
								color: 'white'
							}
						}}
					>
						{deleteRoomImage.isLoading ? 'Deleting...' : 'Yes, Delete Image'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Room Confirmation Dialog */}
			<Dialog
				open={deleteRoomConfirmOpen}
				onClose={handleCancelRoomDelete}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 3,
						overflow: 'visible',
						background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF3F2 100%)'
					}
				}}
			>
				<DialogTitle sx={{ pb: 2 }}>
					<Box className="flex items-center gap-16">
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: '16px',
								background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
								'&::before': {
									content: '""',
									position: 'absolute',
									inset: -4,
									borderRadius: '18px',
									padding: '2px',
									background: 'linear-gradient(135deg, #EF4444, #DC2626)',
									WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
									WebkitMaskComposite: 'xor',
									maskComposite: 'exclude',
									opacity: 0.3
								}
							}}
						>
							<FuseSvgIcon
								size={28}
								sx={{ color: '#DC2626' }}
							>
								heroicons-outline:exclamation-triangle
							</FuseSvgIcon>
						</Box>
						<div className="flex-1">
							<Typography
								className="text-22 font-black"
								sx={{
									background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text'
								}}
							>
								Delete This Room?
							</Typography>
							<Typography
								className="text-13 mt-4"
								sx={{ color: '#991B1B', fontWeight: 600 }}
							>
								This action is permanent and cannot be reversed
							</Typography>
						</div>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ pt: 2, pb: 3 }}>
					<Box className="flex flex-col gap-24">
						{/* Room Preview Card */}
						{getValues('title') && (
							<Box
								sx={{
									position: 'relative',
									borderRadius: 3,
									overflow: 'hidden',
									border: '2px solid #FCA5A5',
									background: '#FEF2F2'
								}}
							>
								{/* Room Image */}
								<Box
									sx={{
										position: 'relative',
										height: 160,
										background: 'linear-gradient(135deg, #FCA5A5 0%, #F87171 100%)',
										overflow: 'hidden'
									}}
								>
									{imageSrcs?.[0]?.url ? (
										<>
											<img
												src={imageSrcs[0].url}
												alt={getValues('title')}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover'
												}}
											/>
											<Box
												sx={{
													position: 'absolute',
													inset: 0,
													background: 'rgba(239, 68, 68, 0.25)'
												}}
											/>
										</>
									) : (
										<Box
											sx={{
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<FuseSvgIcon
												size={64}
												sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
											>
												heroicons-outline:home
											</FuseSvgIcon>
										</Box>
									)}

									{/* Delete Icon Overlay */}
									<Box
										sx={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											width: 80,
											height: 80,
											borderRadius: '50%',
											background: 'rgba(255, 255, 255, 0.95)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4)',
											animation: 'pulse 2s ease-in-out infinite'
										}}
									>
										<FuseSvgIcon
											size={40}
											sx={{ color: '#DC2626' }}
										>
											heroicons-outline:trash
										</FuseSvgIcon>
									</Box>
								</Box>

								{/* Room Details */}
								<Box sx={{ p: 3 }}>
									<Typography
										className="text-18 font-bold mb-8"
										sx={{ color: '#7F1D1D' }}
									>
										{getValues('title')}
									</Typography>
									<Box className="flex items-center gap-12 flex-wrap">
										{getValues('roomNumber') && (
											<Chip
												label={`Room #${getValues('roomNumber')}`}
												size="small"
												sx={{
													background: '#FEE2E2',
													color: '#991B1B',
													fontWeight: 700,
													fontSize: '11px'
												}}
											/>
										)}
										{getValues('price') && (
											<Chip
												label={`$${getValues('price')}/night`}
												size="small"
												sx={{
													background: '#FEE2E2',
													color: '#991B1B',
													fontWeight: 700,
													fontSize: '11px'
												}}
											/>
										)}
										{getValues('roomStatus') && (
											<Chip
												label={getValues('roomStatus')}
												size="small"
												sx={{
													background: '#FEE2E2',
													color: '#991B1B',
													fontWeight: 700,
													fontSize: '11px'
												}}
											/>
										)}
									</Box>
								</Box>
							</Box>
						)}

						{/* Warning Message */}
						<Box
							sx={{
								p: 3,
								borderRadius: 2,
								background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(254, 226, 226, 0.8) 100%)',
								border: '2px solid #FECACA'
							}}
						>
							<Box className="flex items-start gap-12">
								<Box
									sx={{
										flexShrink: 0,
										width: 36,
										height: 36,
										borderRadius: '8px',
										background: '#DC2626',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<FuseSvgIcon
										size={20}
										sx={{ color: 'white' }}
									>
										heroicons-outline:shield-exclamation
									</FuseSvgIcon>
								</Box>
								<div className="flex-1">
									<Typography
										className="text-14 font-bold mb-8"
										sx={{ color: '#7F1D1D' }}
									>
										⚠️ Complete Room Deletion
									</Typography>
									<Typography
										className="text-13 mb-12"
										sx={{ color: '#991B1B', lineHeight: 1.6 }}
									>
										Deleting this room will permanently remove:
									</Typography>
									<Box
										component="ul"
										sx={{
											m: 0,
											pl: 2.5,
											color: '#991B1B',
											'& li': {
												mb: 0.5,
												fontSize: '13px',
												lineHeight: 1.6
											}
										}}
									>
										<li>All room details and configuration</li>
										<li>All uploaded images from cloud storage</li>
										<li>Booking history and reservation data</li>
										<li>Guest reviews and ratings</li>
									</Box>
								</div>
							</Box>
						</Box>

						{/* Final Confirmation Text */}
						<Box
							sx={{
								p: 3,
								borderRadius: 2,
								background: '#FFFBEB',
								border: '1px dashed #FCD34D',
								textAlign: 'center'
							}}
						>
							<Typography
								className="text-15 font-bold"
								sx={{ color: '#92400E', mb: 1 }}
							>
								💡 Think Twice Before Proceeding
							</Typography>
							<Typography
								className="text-13"
								sx={{ color: '#78350F', lineHeight: 1.5 }}
							>
								This room and all its data will be gone forever. Make sure you really want to do this!
							</Typography>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions
					sx={{
						px: 3,
						pb: 3,
						pt: 2,
						gap: 2,
						background: 'linear-gradient(135deg, #FAFAFA 0%, #FEF3F2 100%)',
						borderTop: '1px solid #FECACA'
					}}
				>
					<Button
						onClick={handleCancelRoomDelete}
						variant="outlined"
						size="large"
						fullWidth
						sx={{
							fontWeight: 700,
							borderWidth: 2,
							borderColor: '#D1D5DB',
							color: '#6B7280',
							height: 48,
							'&:hover': {
								borderWidth: 2,
								borderColor: '#9CA3AF',
								background: '#F9FAFB'
							}
						}}
					>
						<FuseSvgIcon
							size={20}
							sx={{ mr: 1 }}
						>
							heroicons-outline:x
						</FuseSvgIcon>
						No, Keep Room
					</Button>
					<Button
						onClick={handleConfirmRoomDelete}
						variant="contained"
						size="large"
						fullWidth
						disabled={deleteRoom.isLoading}
						startIcon={
							deleteRoom.isLoading ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
						sx={{
							fontWeight: 700,
							height: 48,
							background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
							color: 'white',
							boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
							'&:hover': {
								background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
								boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
								transform: 'translateY(-1px)'
							},
							'&:disabled': {
								background: '#FCA5A5',
								color: 'white',
								boxShadow: 'none'
							},
							transition: 'all 0.3s ease'
						}}
					>
						{deleteRoom.isLoading ? 'Deleting Room...' : 'Yes, Delete Permanently'}
					</Button>
				</DialogActions>

				{/* Pulse Animation */}
				<style>
					{`
						@keyframes pulse {
							0%, 100% {
								transform: translate(-50%, -50%) scale(1);
								opacity: 1;
							}
							50% {
								transform: translate(-50%, -50%) scale(1.05);
								opacity: 0.9;
							}
						}
					`}
				</style>
			</Dialog>
		</>
	);
}

export default RoomMenuPanel;
