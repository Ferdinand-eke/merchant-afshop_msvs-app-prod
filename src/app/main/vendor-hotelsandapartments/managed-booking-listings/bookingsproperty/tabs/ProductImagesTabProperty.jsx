import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { Divider, Typography, Paper, IconButton, Chip, Grid } from '@mui/material';
import { useParams } from 'react-router';
import Resizer from 'src/Resizer';

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
	const imageSrcs = watch('imageSrcs');

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
				{imageSrcs && imageSrcs?.length > 0 && (
					<>
						<Divider sx={{ my: 3 }} />
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524', mb: 3 }}>
							Existing Images
						</Typography>
						<Grid container spacing={3}>
							<Controller
								name="featuredImageId"
								control={control}
								defaultValue=""
								render={({ field: { onChange, value } }) => {
									return (
										<>
											{imageSrcs?.map((media) => (
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
																Click to set as featured
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
		</Root>
	);
}

export default ProductImagesTabProperty;
