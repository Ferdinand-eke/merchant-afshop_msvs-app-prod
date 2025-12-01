import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import {
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	Paper,
	Typography,
	Alert,
	Chip,
	alpha,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from '@mui/material';
import { calculateShopEarnings } from 'app/configs/Calculus';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import { formatCurrency } from '../../../pos/PosUtils';
import { useParams } from 'react-router-dom';
import {
	useAddProductPriceTierMutation,
	useUpdateProductPriceTierMutation,
	useDeleteProductPriceTierMutation
} from 'app/configs/data/server-calls/products/useShopProducts';

/**
 * The enhanced pricing tab with tier-based pricing for bulk orders
 */
function PricingTab({ shopData, productDataId }) {
	const methods = useFormContext();
	const { control, watch } = methods;
	const routeParams = useParams();
	const { productId } = routeParams;

	// Check if we're in "new product" mode or "edit mode"
	const isNewProduct = productId === 'new';

	// Initialize priceTiers if not exists
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: 'priceTiers'
	});

	// Mutation hooks for price tier management (update mode only)
	const addPriceTierMutation = useAddProductPriceTierMutation();
	const updatePriceTierMutation = useUpdateProductPriceTierMutation();
	const deletePriceTierMutation = useDeleteProductPriceTierMutation();

	// DO NOT initialize with default tier for new products
	// Price tiers start empty and only show when user clicks "Add Tier"

	const basePrice = watch('price') || 0;
	const commissionRate = shopData?.merchantShopplan?.percetageCommissionCharge || 0;
	const commissionConversion = shopData?.merchantShopplan?.percetageCommissionChargeConversion || 0;

	// Modal states for price tier management
	const [openAddTierModal, setOpenAddTierModal] = useState(false);
	const [openEditTierModal, setOpenEditTierModal] = useState(false);
	const [openDeleteTierModal, setOpenDeleteTierModal] = useState(false);
	const [selectedTier, setSelectedTier] = useState(null);
	const [tierFormData, setTierFormData] = useState({
		minQuantity: '',
		maxQuantity: '',
		price: ''
	});

	// Handle opening edit modal
	const handleOpenEditModal = (tier) => {
		console.log('EDITING__TIER',tier)
		setSelectedTier(tier);
		setTierFormData({
			minQuantity: tier.minQuantity,
			maxQuantity: tier.maxQuantity,
			price: tier.price
		});
		setOpenEditTierModal(true);
	};

	// Handle opening add tier modal
	const handleOpenAddTierModal = () => {
		const lastTier = fields[fields.length - 1];
		const newMinQuantity = lastTier ? parseInt(lastTier.maxQuantity || 0) + 1 : 1;
		setTierFormData({
			minQuantity: newMinQuantity,
			maxQuantity: newMinQuantity + 9,
			price: ''
		});
		setOpenAddTierModal(true);
	};

	// Handle opening delete confirmation modal
	const handleOpenDeleteModal = (tier) => {
		setSelectedTier(tier);
		setOpenDeleteTierModal(true);
	};

	// Handle inline add tier for new products
	const handleAddTierInline = () => {
		const lastTier = fields[fields.length - 1];
		const newMinQuantity = lastTier ? parseInt(lastTier.maxQuantity || 0) + 1 : 1;
		append({
			minQuantity: newMinQuantity,
			maxQuantity: newMinQuantity + 9,
			price: 0
		});
	};

	// Save edited tier (calls API for existing products)
	const handleSaveEditedTier = async () => {
		if (!selectedTier) return;

		if (isNewProduct) {
			// For new products, update in form state only
			const index = fields.findIndex((f) => f.id === selectedTier.id);
			if (index !== -1) {
				update(index, {
					minQuantity: parseInt(tierFormData.minQuantity),
					maxQuantity: parseInt(tierFormData.maxQuantity),
					price: tierFormData.price
				});
			}
			handleCloseModals();
		} else {
			// For existing products, call API
			// Use productId from route params - this is the database ID of the product
			try {
				console.log('UPDATING__TIER__DATA', { productId, selectedTier, tierFormData });

				await updatePriceTierMutation.mutateAsync({
					productId:selectedTier.productId,
					tierId: selectedTier._id || selectedTier.id,
					minQuantity: parseInt(tierFormData.minQuantity),
					maxQuantity: parseInt(tierFormData.maxQuantity),
					price: tierFormData.price
				});
				handleCloseModals();
			} catch (error) {
				console.error('Error updating price tier:', error);
			}
		}
	};

	// Save new tier (calls API for existing products, adds to form for new products)
	const handleSaveNewTier = async () => {
		if (isNewProduct) {
			// For new products, add to form state
			append({
				minQuantity: parseInt(tierFormData.minQuantity),
				maxQuantity: parseInt(tierFormData.maxQuantity),
				price: tierFormData.price
			});
			handleCloseModals();
		} else {
			// For existing products, call API
			// Use productId from route params - this is the database ID of the product
			try {
				console.log('ADDING__TIER__DATA', { selectedTier, tierFormData });

				await addPriceTierMutation.mutateAsync({
					productId:productDataId,
					minQuantity: parseInt(tierFormData.minQuantity),
					maxQuantity: parseInt(tierFormData.maxQuantity),
					price: tierFormData.price
				});
				handleCloseModals();
			} catch (error) {
				console.error('Error adding price tier:', error);
			}
		}
	};

	// Delete tier (calls API for existing products, removes from form for new products)
	const handleConfirmDeleteTier = async () => {
		if (!selectedTier) return;

		if (isNewProduct) {
			// For new products, remove from form state
			const index = fields.findIndex((f) => f.id === selectedTier.id);
			if (index !== -1) {
				remove(index);
			}
			handleCloseModals();
		} else {
			// For existing products, call API
			try {
				await deletePriceTierMutation.mutateAsync({
					productId:productDataId,
					tierId: selectedTier._id || selectedTier.id
				});
				handleCloseModals();
			} catch (error) {
				console.error('Error deleting price tier:', error);
			}
		}
	};

	// Close all modals
	const handleCloseModals = () => {
		setOpenAddTierModal(false);
		setOpenEditTierModal(false);
		setOpenDeleteTierModal(false);
		setSelectedTier(null);
		setTierFormData({ minQuantity: '', maxQuantity: '', price: '' });
	};

	const calculateEarnings = (price) => {
		return calculateShopEarnings(price, commissionConversion);
	};
	

	return (
		<Box>
			{/* Header Section */}
			<Box className="mb-24">
				<Typography
					variant="h5"
					className="font-bold mb-12 text-2xl"
				>
					Product Pricing
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					className="text-lg"
				>
					Set your retail price and configure bulk pricing tiers to encourage wholesale purchases
				</Typography>
			</Box>

			{/* Base Retail Pricing Card */}
			<Card
				elevation={0}
				sx={{
					mb: 3,
					border: 1,
					borderColor: 'divider',
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? alpha(theme.palette.primary.main, 0.02)
							: alpha(theme.palette.background.paper, 0.4)
				}}
			>
				<CardContent>
					<Box className="flex items-center gap-12 mb-20">
						<FuseSvgIcon
							size={24}
							className="text-primary"
						>
							heroicons-outline:tag
						</FuseSvgIcon>
						<Typography
							variant="h6"
							className="font-semibold text-xl"
						>
							Retail Price (Single Unit)
						</Typography>
					</Box>

					<Box className="flex gap-16">
						<Controller
							name="price"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Retail Price"
									id="price"
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
									helperText="Price for customers buying 1 unit"
								/>
							)}
						/>

						<Controller
							name="listprice"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Compare at Price"
									id="listprice"
									InputProps={{
										startAdornment: <InputAdornment position="start">₦</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
									helperText="Original price (before discount)"
								/>
							)}
						/>
					</Box>

					{/* Earnings Information */}
					{basePrice > 0 && (
						<Alert
							severity="info"
							icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							sx={{ mt: 2 }}
						>
							<Box>
								<Typography
									variant="body1"
									className="text-base"
								>
									At <strong className="text-lg">₦{formatCurrency(basePrice)}</strong> with{' '}
									<Chip
										label={`${commissionRate}% commission`}
										size="medium"
										color="primary"
										sx={{ mx: 0.5, fontSize: '0.875rem' }}
									/>
									, your earnings per unit will be{' '}
									<Typography
										component="span"
										variant="h6"
										className="font-bold text-green-600 text-xl"
									>
										₦{formatCurrency(calculateEarnings(basePrice))}
									</Typography>
								</Typography>
							</Box>
						</Alert>
					)}
				</CardContent>
			</Card>

			{/* Bulk Pricing Tiers */}
			<Card
				elevation={0}
				sx={{
					border: 1,
					borderColor: 'divider',
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? alpha(theme.palette.secondary.main, 0.02)
							: alpha(theme.palette.background.paper, 0.4)
				}}
			>
				<CardContent>
					<Box className="flex items-center justify-between mb-20">
						<Box className="flex items-center gap-12">
							<FuseSvgIcon
								size={24}
								className="text-secondary"
							>
								heroicons-outline:scale
							</FuseSvgIcon>
							<Typography
								variant="h6"
								className="font-semibold text-xl"
							>
								Bulk Pricing Tiers {!isNewProduct && fields.length > 0 && `(${fields.length})`}
							</Typography>
						</Box>
						<Button
							variant="outlined"
							size="small"
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
							onClick={isNewProduct ? handleAddTierInline : handleOpenAddTierModal}
						>
							Add Tier
						</Button>
					</Box>

					<Typography
						variant="body1"
						color="text.secondary"
						className="mb-20 text-base"
					>
						Set discounted prices for bulk orders. Lower prices encourage wholesale buyers to purchase more
						units.
					</Typography>

					{fields.length === 0 ? (
						// Empty state when no price tiers exist
						<Box
							sx={{
								p: 4,
								textAlign: 'center',
								border: 1,
								borderStyle: 'dashed',
								borderColor: 'divider',
								borderRadius: 2,
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? alpha(theme.palette.grey[100], 0.5)
										: alpha(theme.palette.background.paper, 0.3)
							}}
						>
							<FuseSvgIcon
								size={48}
								color="disabled"
								className="mb-8"
							>
								heroicons-outline:scale
							</FuseSvgIcon>
							<Typography
								variant="h6"
								color="text.secondary"
								className="mb-8"
							>
								No bulk pricing tiers yet
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								className="mb-16"
							>
								Click "Add Tier" to create discounted pricing for wholesale buyers
							</Typography>
						</Box>
					) : (
						<Box className="space-y-12">
							{fields.map((field, index) => {
							const tierPrice = watch(`priceTiers.${index}.price`) || 0;
							const minQty = watch(`priceTiers.${index}.minQuantity`) || 0;
							const maxQty = watch(`priceTiers.${index}.maxQuantity`) || 0;

							// Get the actual tier data (with database _id)
							const tierData = watch(`priceTiers.${index}`);

							return (
								<Paper
									key={field.id}
									elevation={0}
									sx={{
										p: 2,
										border: 1,
										borderColor: 'divider',
										backgroundColor: (theme) =>
											theme.palette.mode === 'light'
												? theme.palette.background.default
												: alpha(theme.palette.background.paper, 0.6)
									}}
								>
									{isNewProduct ? (
										// NEW PRODUCT MODE: Editable inline fields
										<>
											<Box className="flex items-start gap-12">
												<Box className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12">
													{/* Min Quantity */}
													<Controller
														name={`priceTiers.${index}.minQuantity`}
														control={control}
														render={({ field }) => (
															<TextField
																{...field}
																label="Min Quantity"
																type="number"
																variant="outlined"
																size="small"
																InputProps={{
																	startAdornment: (
																		<InputAdornment position="start">
																			<FuseSvgIcon size={16}>
																				heroicons-outline:arrow-sm-down
																			</FuseSvgIcon>
																		</InputAdornment>
																	)
																}}
																fullWidth
															/>
														)}
													/>

													{/* Max Quantity */}
													<Controller
														name={`priceTiers.${index}.maxQuantity`}
														control={control}
														render={({ field }) => (
															<TextField
																{...field}
																label="Max Quantity"
																type="number"
																variant="outlined"
																size="small"
																InputProps={{
																	startAdornment: (
																		<InputAdornment position="start">
																			<FuseSvgIcon size={16}>
																				heroicons-outline:arrow-sm-up
																			</FuseSvgIcon>
																		</InputAdornment>
																	)
																}}
																fullWidth
															/>
														)}
													/>

													{/* Tier Price */}
													<Controller
														name={`priceTiers.${index}.price`}
														control={control}
														render={({ field }) => (
															<TextField
																{...field}
																label="Price per Unit"
																type="number"
																variant="outlined"
																size="small"
																InputProps={{
																	startAdornment: (
																		<InputAdornment position="start">₦</InputAdornment>
																	)
																}}
																fullWidth
															/>
														)}
													/>
												</Box>

												{/* Remove Button */}
												<IconButton
													onClick={() => remove(index)}
													size="small"
													color="error"
													disabled={fields.length === 1}
													sx={{ mt: 0.5 }}
												>
													<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
												</IconButton>
											</Box>
										</>
									) : (
										// UPDATE MODE: Read-only display with edit button
										<>
											<Box className="flex items-start gap-12">
												<Box className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12">
													{/* Min Quantity - Read Only */}
													<Box>
														<Typography
															variant="caption"
															color="text.secondary"
															className="mb-4 block"
														>
															Min Quantity
														</Typography>
														<Box className="flex items-center gap-8 p-10 bg-gray-50 rounded-8">
															<FuseSvgIcon
																size={16}
																color="action"
															>
																heroicons-outline:arrow-sm-down
															</FuseSvgIcon>
															<Typography
																variant="body1"
																className="font-semibold"
															>
																{minQty}
															</Typography>
														</Box>
													</Box>

													{/* Max Quantity - Read Only */}
													<Box>
														<Typography
															variant="caption"
															color="text.secondary"
															className="mb-4 block"
														>
															Max Quantity
														</Typography>
														<Box className="flex items-center gap-8 p-10 bg-gray-50 rounded-8">
															<FuseSvgIcon
																size={16}
																color="action"
															>
																heroicons-outline:arrow-sm-up
															</FuseSvgIcon>
															<Typography
																variant="body1"
																className="font-semibold"
															>
																{maxQty || '∞'}
															</Typography>
														</Box>
													</Box>

													{/* Price - Read Only */}
													<Box>
														<Typography
															variant="caption"
															color="text.secondary"
															className="mb-4 block"
														>
															Price per Unit
														</Typography>
														<Box className="flex items-center gap-8 p-10 bg-gray-50 rounded-8">
															<Typography
																variant="body1"
																color="text.secondary"
															>
																₦
															</Typography>
															<Typography
																variant="body1"
																className="font-semibold text-primary"
															>
																{formatCurrency(tierPrice)}
															</Typography>
														</Box>
													</Box>
												</Box>

												{/* Action Buttons */}
												<Box className="flex flex-col gap-8">
													<IconButton
														onClick={() => handleOpenEditModal(tierData)}
														size="small"
														color="secondary"
														sx={{ mt: 0.5 }}
													>
														<FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
													</IconButton>
													<IconButton
														onClick={() => handleOpenDeleteModal(tierData)}
														size="small"
														color="error"
														sx={{ mt: 0.5 }}
													>
														<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
													</IconButton>
												</Box>
											</Box>
										</>
									)}

									{/* Tier Earnings Info */}
									{tierPrice > 0 && minQty > 0 && (
										<Box className="mt-16 pt-16 border-t">
											<Box className="flex flex-wrap gap-16 items-center">
												<Chip
													label={`${minQty} - ${maxQty || '∞'} units`}
													size="medium"
													variant="outlined"
													sx={{ fontSize: '0.875rem', fontWeight: 500 }}
												/>
												<Typography
													variant="body1"
													color="text.secondary"
													className="text-base"
												>
													Unit Price:{' '}
													<strong className="text-primary text-lg">
														₦{formatCurrency(tierPrice)}
													</strong>
												</Typography>
												<Typography
													variant="body1"
													color="text.secondary"
													className="text-base"
												>
													Your Earnings:{' '}
													<strong className="text-green-600 text-lg">
														₦{formatCurrency(calculateEarnings(tierPrice))}
													</strong>{' '}
													per unit
												</Typography>
												{basePrice > tierPrice && (
													<Chip
														label={`${(((basePrice - tierPrice) / basePrice) * 100).toFixed(1)}% discount`}
														size="medium"
														color="success"
														sx={{ fontSize: '0.875rem', fontWeight: 500 }}
													/>
												)}
											</Box>
										</Box>
									)}
								</Paper>
							);
						})}
						</Box>
					)}

					{/* Bulk Pricing Benefits */}
					<Alert
						severity="success"
						icon={<FuseSvgIcon size={24}>heroicons-outline:light-bulb</FuseSvgIcon>}
						sx={{ mt: 3 }}
					>
						<Typography
							variant="body1"
							className="font-semibold mb-8 text-lg"
						>
							Why use bulk pricing?
						</Typography>
						<ul className="list-disc list-inside space-y-2 text-base">
							<li>Encourage wholesale buyers to order larger quantities</li>
							<li>Increase your sales volume and total revenue</li>
							<li>Build relationships with bulk purchasers</li>
							<li>Stay competitive in the wholesale market</li>
						</ul>
					</Alert>
				</CardContent>
			</Card>

			{/* Edit Tier Modal (for existing products) */}
			<Dialog
				open={openEditTierModal}
				onClose={handleCloseModals}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					<Box className="flex items-center justify-between">
						<Typography
							variant="h6"
							className="font-semibold"
						>
							Edit Bulk Price Tier
						</Typography>
						<IconButton
							onClick={handleCloseModals}
							size="small"
						>
							<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="flex flex-col gap-16 mt-8">
						{/* Min Quantity */}
						<TextField
							label="Min Quantity"
							type="number"
							variant="outlined"
							value={tierFormData.minQuantity}
							onChange={(e) => setTierFormData({ ...tierFormData, minQuantity: e.target.value })}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={16}>heroicons-outline:arrow-sm-down</FuseSvgIcon>
									</InputAdornment>
								)
							}}
							fullWidth
						/>

						{/* Max Quantity */}
						<TextField
							label="Max Quantity"
							type="number"
							variant="outlined"
							value={tierFormData.maxQuantity}
							onChange={(e) => setTierFormData({ ...tierFormData, maxQuantity: e.target.value })}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={16}>heroicons-outline:arrow-sm-up</FuseSvgIcon>
									</InputAdornment>
								)
							}}
							fullWidth
						/>

						{/* Price */}
						<TextField
							label="Price per Unit"
							type="number"
							variant="outlined"
							value={tierFormData.price}
							onChange={(e) => setTierFormData({ ...tierFormData, price: e.target.value })}
							InputProps={{
								startAdornment: <InputAdornment position="start">₦</InputAdornment>
							}}
							fullWidth
						/>

						{/* Preview Earnings */}
						{tierFormData.price > 0 && (
							<Alert
								severity="info"
								icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							>
								<Typography
									variant="body2"
									className="text-sm"
								>
									Your earnings:{' '}
									<strong className="text-green-600">
										₦{formatCurrency(calculateEarnings(tierFormData.price || 0))}
									</strong>{' '}
									per unit
								</Typography>
							</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseModals}
						variant="outlined"
						disabled={updatePriceTierMutation.isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSaveEditedTier}
						variant="contained"
						color="secondary"
						disabled={
							!tierFormData.minQuantity ||
							!tierFormData.maxQuantity ||
							!tierFormData.price ||
							updatePriceTierMutation.isLoading
						}
						startIcon={
							updatePriceTierMutation.isLoading ? (
								<FuseSvgIcon className="animate-spin">heroicons-outline:refresh</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>
							)
						}
					>
						{updatePriceTierMutation.isLoading ? 'Saving...' : 'Save Changes'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add Tier Modal (for existing products) */}
			<Dialog
				open={openAddTierModal}
				onClose={handleCloseModals}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					<Box className="flex items-center justify-between">
						<Typography
							variant="h6"
							className="font-semibold"
						>
							Add New Bulk Price Tier
						</Typography>
						<IconButton
							onClick={handleCloseModals}
							size="small"
						>
							<FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="flex flex-col gap-16 mt-8">
						{/* Min Quantity */}
						<TextField
							label="Min Quantity"
							type="number"
							variant="outlined"
							value={tierFormData.minQuantity}
							onChange={(e) => setTierFormData({ ...tierFormData, minQuantity: e.target.value })}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={16}>heroicons-outline:arrow-sm-down</FuseSvgIcon>
									</InputAdornment>
								)
							}}
							fullWidth
							helperText="Starting quantity for this tier"
						/>

						{/* Max Quantity */}
						<TextField
							label="Max Quantity"
							type="number"
							variant="outlined"
							value={tierFormData.maxQuantity}
							onChange={(e) => setTierFormData({ ...tierFormData, maxQuantity: e.target.value })}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={16}>heroicons-outline:arrow-sm-up</FuseSvgIcon>
									</InputAdornment>
								)
							}}
							fullWidth
							helperText="Maximum quantity for this tier"
						/>

						{/* Price */}
						<TextField
							label="Price per Unit"
							type="number"
							variant="outlined"
							value={tierFormData.price}
							onChange={(e) => setTierFormData({ ...tierFormData, price: e.target.value })}
							InputProps={{
								startAdornment: <InputAdornment position="start">₦</InputAdornment>
							}}
							fullWidth
							helperText="Discounted price for this quantity range"
						/>

						{/* Preview Earnings */}
						{tierFormData.price > 0 && (
							<Alert
								severity="info"
								icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
							>
								<Box>
									<Typography
										variant="body2"
										className="text-sm mb-4"
									>
										<strong>
											{tierFormData.minQuantity} - {tierFormData.maxQuantity || '∞'} units
										</strong>
									</Typography>
									<Typography
										variant="body2"
										className="text-sm"
									>
										Your earnings:{' '}
										<strong className="text-green-600">
											₦{formatCurrency(calculateEarnings(tierFormData.price || 0))}
										</strong>{' '}
										per unit
									</Typography>
									{basePrice > tierFormData.price && (
										<Typography
											variant="body2"
											className="text-sm mt-4"
											color="success.main"
										>
											{(((basePrice - tierFormData.price) / basePrice) * 100).toFixed(1)}%
											discount from retail price
										</Typography>
									)}
								</Box>
							</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseModals}
						variant="outlined"
						disabled={addPriceTierMutation.isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSaveNewTier}
						variant="contained"
						color="secondary"
						disabled={
							!tierFormData.minQuantity ||
							!tierFormData.maxQuantity ||
							!tierFormData.price ||
							addPriceTierMutation.isLoading
						}
						startIcon={
							addPriceTierMutation.isLoading ? (
								<FuseSvgIcon className="animate-spin">heroicons-outline:refresh</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>
							)
						}
					>
						{addPriceTierMutation.isLoading ? 'Adding...' : 'Add Tier'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Tier Confirmation Modal */}
			<Dialog
				open={openDeleteTierModal}
				onClose={handleCloseModals}
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
							Delete Price Tier?
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="flex flex-col gap-16">
						{selectedTier && (
							<Box className="p-16 rounded-8 bg-gray-50">
								<Typography
									variant="body2"
									className="mb-8"
								>
									<strong>Tier Details:</strong>
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Quantity Range: {selectedTier.minQuantity} - {selectedTier.maxQuantity || '∞'} units
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Price per Unit: ₦{formatCurrency(selectedTier.price)}
								</Typography>
							</Box>
						)}
						<Alert severity="warning">
							Are you sure you want to delete this price tier? This action cannot be undone.
						</Alert>
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseModals}
						variant="outlined"
						disabled={deletePriceTierMutation.isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDeleteTier}
						variant="contained"
						color="error"
						disabled={deletePriceTierMutation.isLoading}
						startIcon={
							deletePriceTierMutation.isLoading ? (
								<FuseSvgIcon className="animate-spin">heroicons-outline:refresh</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
					>
						{deletePriceTierMutation.isLoading ? 'Deleting...' : 'Delete Tier'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default PricingTab;
