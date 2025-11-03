import InputAdornment from "@mui/material/InputAdornment";
import TextField from '@mui/material/TextField';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
  Chip,
  alpha,
  Divider
} from "@mui/material";
import { Controller, useFormContext } from 'react-hook-form';
import { useProductUnitsByShopPlan } from "app/configs/data/server-calls/product-units/useProductUnits";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import { useParams } from "react-router-dom";

/**
 * The enhanced inventory tab with quantity update modal
 */
function InventoryTab({shopData}) {
	const { data: unitsByPlan } = useProductUnitsByShopPlan(shopData?.merchantShopplan?.id);
	const routeParams = useParams();
	const { productId } = routeParams;
	const isEditMode = productId !== 'new';

	const methods = useFormContext();
	const { control, formState, watch, setValue } = methods;
	const { errors } = formState;

	const currentQuantity = watch("quantityInStock") || 0;
	const selectedUnit = watch("quantityunitweight");

	// Modal state
	const [openQuantityModal, setOpenQuantityModal] = useState(false);
	const [quantityToAdd, setQuantityToAdd] = useState(0);
	const [quantityAction, setQuantityAction] = useState('add'); // 'add' or 'set'

	const handleOpenModal = () => setOpenQuantityModal(true);
	const handleCloseModal = () => {
		setOpenQuantityModal(false);
		setQuantityToAdd(0);
		setQuantityAction('add');
	};

	const handleUpdateQuantity = () => {
		if (quantityAction === 'add') {
			setValue('quantityInStock', parseInt(currentQuantity) + parseInt(quantityToAdd));
		} else {
			setValue('quantityInStock', parseInt(quantityToAdd));
		}
		handleCloseModal();
	};

	return (
		<Box>
			{/* Header Section */}
			<Box className="mb-24">
				<Typography variant="h5" className="font-bold mb-12 text-2xl">
					Inventory Management
				</Typography>
				<Typography variant="body1" color="text.secondary" className="text-lg">
					Track and manage your product stock levels
				</Typography>
			</Box>

			{/* Stock Level Card */}
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
					<Box className="flex items-center gap-12 mb-24">
						<FuseSvgIcon size={24} className="text-primary">
							heroicons-outline:cube
						</FuseSvgIcon>
						<Typography variant="h6" className="font-semibold text-xl">
							Stock Information
						</Typography>
					</Box>

					{/* Current Stock Display (for edit mode) */}
					{isEditMode && (
						<Box className="mb-24 p-20 rounded-lg border-2 border-dashed border-primary-200 bg-primary-50">
							<Box className="flex items-center justify-between">
								<Box>
									<Typography variant="caption" color="text.secondary" className="text-sm mb-4 block">
										Current Stock Level
									</Typography>
									<Box className="flex items-baseline gap-12">
										<Typography variant="h3" className="font-bold text-primary text-4xl">
											{currentQuantity}
										</Typography>
										<Typography variant="body1" color="text.secondary" className="text-base">
											{selectedUnit ? unitsByPlan?.data?.unitweight?.find(u => u.id === selectedUnit)?.unitname : 'units'}
										</Typography>
									</Box>
									{currentQuantity < 10 && (
										<Chip
											label="Low Stock"
											color="warning"
											size="small"
											icon={<FuseSvgIcon size={16}>heroicons-outline:exclamation</FuseSvgIcon>}
											className="mt-8"
										/>
									)}
								</Box>
								<Button
									variant="contained"
									color="primary"
									size="large"
									startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>}
									onClick={handleOpenModal}
									sx={{ fontSize: '1rem', py: 1.5, px: 3 }}
								>
									Update Stock
								</Button>
							</Box>
						</Box>
					)}

					<Box className="grid grid-cols-1 md:grid-cols-2 gap-20">
						{/* Quantity Field */}
						<Controller
							name="quantityInStock"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Quantity In Stock"
									id="quantityInStock"
									type="number"
									variant="outlined"
									fullWidth
									disabled={isEditMode}
									error={!!errors.quantityInStock}
									helperText={
										isEditMode
											? "Use 'Update Stock' button to modify quantity"
											: "Enter initial stock quantity"
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20} color="action">
													heroicons-outline:cube-transparent
												</FuseSvgIcon>
											</InputAdornment>
										),
										sx: { fontSize: '1.125rem' }
									}}
									InputLabelProps={{
										sx: { fontSize: '1rem' }
									}}
								/>
							)}
						/>

						{/* Unit Weight Select */}
						<Controller
							name="quantityunitweight"
							control={control}
							defaultValue=""
							render={({ field: { onChange, value } }) => (
								<FormControl
									fullWidth
									error={!!errors.quantityunitweight}
									variant="outlined"
								>
									<InputLabel id="quantityunitweight-label" sx={{ fontSize: '1rem' }}>
										Unit of Measurement
									</InputLabel>
									<Select
										labelId="quantityunitweight-label"
										id="quantityunitweight"
										label="Unit of Measurement"
										onChange={onChange}
										value={value || ""}
										startAdornment={
											<InputAdornment position="start">
												<FuseSvgIcon size={20} color="action">
													heroicons-outline:scale
												</FuseSvgIcon>
											</InputAdornment>
										}
										sx={{ fontSize: '1.125rem' }}
									>
										<MenuItem value="">
											<em>Select unit of measurement</em>
										</MenuItem>
										{unitsByPlan?.data?.unitweight &&
											unitsByPlan?.data?.unitweight?.map((option) => (
												<MenuItem key={option.id} value={option.id} sx={{ fontSize: '1rem' }}>
													<Box className="flex items-center gap-8">
														<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>
														{option.unitname}
													</Box>
												</MenuItem>
											))}
									</Select>
									<FormHelperText sx={{ fontSize: '0.875rem' }}>
										{errors?.quantityunitweight?.message || "Select how you measure this product (kg, liters, pieces, etc.)"}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Box>

					{selectedUnit && (
						<Box className="mt-20">
							<Chip
								icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
								label={`Unit: ${unitsByPlan?.data?.unitweight?.find(u => u.id === selectedUnit)?.unitname}`}
								color="primary"
								variant="outlined"
								size="medium"
								sx={{ fontSize: '0.875rem' }}
							/>
						</Box>
					)}
				</CardContent>
			</Card>

			{/* Stock Tips */}
			<Alert
				severity="info"
				icon={<FuseSvgIcon size={24}>heroicons-outline:information-circle</FuseSvgIcon>}
				sx={{ fontSize: '1rem' }}
			>
				<Typography variant="body1" className="font-semibold mb-8 text-base">
					Inventory Management Tips
				</Typography>
				<ul className="list-disc list-inside space-y-2 text-base">
					<li>Keep your stock levels updated to avoid overselling</li>
					<li>Set up low stock alerts to reorder in time</li>
					<li>Regular stock audits help maintain accuracy</li>
					{isEditMode && <li>Use the 'Update Stock' button whenever you receive new inventory</li>}
				</ul>
			</Alert>

			{/* Quantity Update Modal */}
			<Dialog
				open={openQuantityModal}
				onClose={handleCloseModal}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<FuseSvgIcon size={24} className="text-primary">
							heroicons-outline:refresh
						</FuseSvgIcon>
						<Typography variant="h6" className="font-semibold text-xl">
							Update Stock Quantity
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box className="pt-12">
						{/* Current Stock Display */}
						<Box className="mb-24 p-16 rounded-lg bg-gray-100">
							<Typography variant="caption" color="text.secondary" className="mb-8 block text-sm">
								Current Stock
							</Typography>
							<Typography variant="h4" className="font-bold text-primary text-3xl">
								{currentQuantity} {selectedUnit ? unitsByPlan?.data?.unitweight?.find(u => u.id === selectedUnit)?.unitname : 'units'}
							</Typography>
						</Box>

						<Divider className="mb-24" />

						{/* Action Selector */}
						<Typography variant="subtitle1" className="mb-12 font-semibold text-base">
							Choose Action
						</Typography>
						<Box className="flex gap-12 mb-24">
							<Button
								variant={quantityAction === 'add' ? 'contained' : 'outlined'}
								color="primary"
								onClick={() => setQuantityAction('add')}
								startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
								fullWidth
								sx={{ fontSize: '1rem', py: 1.5 }}
							>
								Add to Stock
							</Button>
							<Button
								variant={quantityAction === 'set' ? 'contained' : 'outlined'}
								color="secondary"
								onClick={() => setQuantityAction('set')}
								startIcon={<FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>}
								fullWidth
								sx={{ fontSize: '1rem', py: 1.5 }}
							>
								Set New Total
							</Button>
						</Box>

						{/* Quantity Input */}
						<TextField
							fullWidth
							type="number"
							label={quantityAction === 'add' ? 'Quantity to Add' : 'New Total Quantity'}
							value={quantityToAdd}
							onChange={(e) => setQuantityToAdd(e.target.value)}
							variant="outlined"
							autoFocus
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20} color="action">
											{quantityAction === 'add' ? 'heroicons-outline:plus-circle' : 'heroicons-outline:pencil-alt'}
										</FuseSvgIcon>
									</InputAdornment>
								),
								sx: { fontSize: '1.125rem' }
							}}
							InputLabelProps={{
								sx: { fontSize: '1rem' }
							}}
							helperText={
								quantityAction === 'add'
									? `New total will be: ${parseInt(currentQuantity) + parseInt(quantityToAdd || 0)}`
									: `Current: ${currentQuantity}`
							}
						/>

						{/* Preview */}
						{quantityToAdd > 0 && (
							<Alert severity="success" className="mt-20" sx={{ fontSize: '1rem' }}>
								<Typography variant="body1" className="font-semibold text-base">
									{quantityAction === 'add'
										? `Adding ${quantityToAdd} units. New total: ${parseInt(currentQuantity) + parseInt(quantityToAdd)}`
										: `Setting total to ${quantityToAdd} units`
									}
								</Typography>
							</Alert>
						)}
					</Box>
				</DialogContent>
				<DialogActions className="p-20">
					<Button onClick={handleCloseModal} variant="outlined" sx={{ fontSize: '1rem' }}>
						Cancel
					</Button>
					<Button
						onClick={handleUpdateQuantity}
						variant="contained"
						color="primary"
						disabled={!quantityToAdd || quantityToAdd <= 0}
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>}
						sx={{ fontSize: '1rem', px: 3 }}
					>
						Update Stock
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default InventoryTab;
