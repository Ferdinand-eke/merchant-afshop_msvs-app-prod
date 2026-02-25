import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import {
	Paper,
	Typography,
	Box,
	Divider,
	Alert,
	Chip,
	Skeleton,
	Tooltip,
	Badge
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Icon from '@mui/material/Icon';
import { useEffect, useState, useMemo } from 'react';
import { useGetAmenities } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';

/**
 * The amenities & property measurements tab
 */

// Category display config
const CATEGORY_CONFIG = {
	GeneralAmenities: {
		label: 'General Amenities',
		color: '#10b981',
		bgColor: 'rgba(16, 185, 129, 0.08)',
		borderColor: 'rgba(16, 185, 129, 0.2)',
		icon: 'heroicons-outline:sparkles'
	},
	ParkingTransportation: {
		label: 'Parking & Transportation',
		color: '#3b82f6',
		bgColor: 'rgba(59, 130, 246, 0.08)',
		borderColor: 'rgba(59, 130, 246, 0.2)',
		icon: 'heroicons-outline:truck'
	},
	SafetyAndSecurity: {
		label: 'Safety & Security',
		color: '#8b5cf6',
		bgColor: 'rgba(139, 92, 246, 0.08)',
		borderColor: 'rgba(139, 92, 246, 0.2)',
		icon: 'heroicons-outline:shield-check'
	},
	FoodAndDining: {
		label: 'Food & Dining',
		color: '#f59e0b',
		bgColor: 'rgba(245, 158, 11, 0.08)',
		borderColor: 'rgba(245, 158, 11, 0.2)',
		icon: 'heroicons-outline:cake'
	},
	EntertainmentAndLeisure: {
		label: 'Entertainment & Leisure',
		color: '#ec4899',
		bgColor: 'rgba(236, 72, 153, 0.08)',
		borderColor: 'rgba(236, 72, 153, 0.2)',
		icon: 'heroicons-outline:film'
	},
	BusinessServices: {
		label: 'Business Services',
		color: '#6366f1',
		bgColor: 'rgba(99, 102, 241, 0.08)',
		borderColor: 'rgba(99, 102, 241, 0.2)',
		icon: 'heroicons-outline:briefcase'
	}
};

// Fallback config for unknown categories
const DEFAULT_CATEGORY_CONFIG = {
	label: 'Other Amenities',
	color: '#78716c',
	bgColor: 'rgba(120, 113, 108, 0.08)',
	borderColor: 'rgba(120, 113, 108, 0.2)',
	icon: 'heroicons-outline:collection'
};

function AmenityCard({ amenity, isSelected, onToggle }) {
	const { label, icon, description } = amenity;

	return (
		<Tooltip
			title={description || label}
			placement="top"
			arrow
		>
			<Box
				onClick={onToggle}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '6px',
					p: '12px 8px',
					borderRadius: '12px',
					border: '2px solid',
					borderColor: isSelected ? '#ea580c' : 'rgba(0,0,0,0.08)',
					background: isSelected
						? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'
						: 'rgba(250,250,249,0.8)',
					cursor: 'pointer',
					transition: 'all 0.2s ease',
					position: 'relative',
					minHeight: '88px',
					'&:hover': {
						borderColor: isSelected ? '#c2410c' : '#ea580c',
						background: isSelected
							? 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)'
							: 'rgba(249, 115, 22, 0.04)',
						transform: 'translateY(-1px)',
						boxShadow: isSelected
							? '0 4px 12px rgba(234, 88, 12, 0.2)'
							: '0 2px 8px rgba(0,0,0,0.08)'
					},
					'&:active': {
						transform: 'translateY(0px)'
					}
				}}
			>
				{isSelected && (
					<Box
						sx={{
							position: 'absolute',
							top: 6,
							right: 6,
							width: 18,
							height: 18,
							borderRadius: '50%',
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Icon sx={{ fontSize: 11, color: 'white' }}>check</Icon>
					</Box>
				)}
				<Icon
					sx={{
						fontSize: 26,
						color: isSelected ? '#ea580c' : '#78716c',
						transition: 'color 0.2s ease'
					}}
				>
					{icon}
				</Icon>
				<Typography
					variant="caption"
					sx={{
						fontWeight: isSelected ? 700 : 500,
						color: isSelected ? '#c2410c' : '#44403c',
						textAlign: 'center',
						lineHeight: 1.2,
						fontSize: '11px'
					}}
				>
					{label}
				</Typography>
			</Box>
		</Tooltip>
	);
}

function ShippingTabProperty() {
	const { data: payload, isLoading: amenitiesLoading } = useGetAmenities();
	const amenitiesList = payload?.data?.amenities || [];

	const methods = useFormContext();
	const { control, watch, setValue } = methods;

	const [totalArea, setTotalArea] = useState(0);
	const [propertyCategory, setPropertyCategory] = useState('');

	// Watch dimension fields and amenities
	const width = watch('width') || 0;
	const length = watch('length') || 0;
	const selectedAmenities = watch('checkedAmenities') || [];

	// Calculate total square meters
	useEffect(() => {
		if (width && length) {
			const area = parseInt(width) * parseInt(length);
			setTotalArea(area);
			if (area < 50) {
				setPropertyCategory('Studio/Small Apartment');
			} else if (area >= 50 && area < 100) {
				setPropertyCategory('Medium Apartment (1-2 bedrooms)');
			} else if (area >= 100 && area < 150) {
				setPropertyCategory('Large Apartment (2-3 bedrooms)');
			} else if (area >= 150 && area < 250) {
				setPropertyCategory('House/Large Property');
			} else {
				setPropertyCategory('Villa/Estate');
			}
		}
	}, [width, length]);

	// Group amenities by category
	const groupedAmenities = useMemo(() => {
		if (!amenitiesList.length) return {};
		return amenitiesList.reduce((acc, amenity) => {
			const cat = amenity.category || 'Other';
			if (!acc[cat]) acc[cat] = [];
			acc[cat].push(amenity);
			return acc;
		}, {});
	}, [amenitiesList]);

	// Toggle a single amenity by id
	function handleToggleAmenity(amenityId) {
		const current = Array.isArray(selectedAmenities) ? selectedAmenities : [];
		const isSelected = current.includes(amenityId);
		const updated = isSelected
			? current.filter((id) => id !== amenityId)
			: [...current, amenityId];
		setValue('checkedAmenities', updated, { shouldDirty: true });
	}

	// Clear all
	function handleClearAll() {
		setValue('checkedAmenities', [], { shouldDirty: true });
	}

	const selectedCount = Array.isArray(selectedAmenities) ? selectedAmenities.length : 0;

	return (
		<div>
			{/* ─────────────────────────────────────────────────── */}
			{/* AMENITIES SECTION                                   */}
			{/* ─────────────────────────────────────────────────── */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Box className="mb-24">
					<Typography
						variant="h6"
						className="font-bold mb-8"
						sx={{ color: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:sparkles</FuseSvgIcon>
						Property Amenities
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Select all amenities available at your property so guests know exactly what to expect
					</Typography>
				</Box>
			</motion.div>

			{/* Amenities Selection Card */}
			<Paper
				className="p-24 mb-24 rounded-2xl"
				elevation={0}
				sx={{
					border: '1px solid rgba(234, 88, 12, 0.12)',
					background: 'linear-gradient(135deg, #fafaf9 0%, #ffffff 100%)'
				}}
			>
				{/* Card Header */}
				<Box className="flex items-center justify-between gap-12 mb-16 flex-wrap">
					<Box className="flex items-center gap-12">
						<Box
							className="flex items-center justify-center w-40 h-40 rounded-lg"
							sx={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
						>
							<FuseSvgIcon
								className="text-white"
								size={20}
							>
								heroicons-outline:clipboard-list
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								Available Amenities
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Click to select amenities your property offers
							</Typography>
						</Box>
					</Box>

					{/* Selection summary + clear */}
					<Box className="flex items-center gap-8">
						{selectedCount > 0 && (
							<>
								<Badge
									badgeContent={selectedCount}
									sx={{
										'& .MuiBadge-badge': {
											background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
											color: 'white',
											fontWeight: 700
										}
									}}
								>
									<Chip
										size="small"
										label="Selected"
										sx={{
											backgroundColor: 'rgba(234, 88, 12, 0.1)',
											color: '#ea580c',
											fontWeight: 600
										}}
									/>
								</Badge>
								<Chip
									size="small"
									label="Clear All"
									onClick={handleClearAll}
									sx={{
										backgroundColor: 'rgba(239, 68, 68, 0.08)',
										color: '#dc2626',
										fontWeight: 600,
										cursor: 'pointer',
										'&:hover': {
											backgroundColor: 'rgba(239, 68, 68, 0.15)'
										}
									}}
								/>
							</>
						)}
					</Box>
				</Box>

				{/* Loading skeleton */}
				{amenitiesLoading && (
					<Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
						{[...Array(8)].map((_, i) => (
							<Skeleton
								key={i}
								variant="rounded"
								height={88}
								sx={{ borderRadius: '12px' }}
							/>
						))}
					</Box>
				)}

				{/* No amenities state */}
				{!amenitiesLoading && amenitiesList.length === 0 && (
					<Alert
						severity="info"
						icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
					>
						No amenities found. Please check back later or contact support.
					</Alert>
				)}

				{/* Grouped amenities by category */}
				{!amenitiesLoading &&
					amenitiesList.length > 0 &&
					Object.entries(groupedAmenities).map(([category, items], catIdx) => {
						const config = CATEGORY_CONFIG[category] || DEFAULT_CATEGORY_CONFIG;
						const selectedInCategory = items.filter((a) =>
							(Array.isArray(selectedAmenities) ? selectedAmenities : []).includes(a.id)
						).length;

						return (
							<motion.div
								key={category}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25, delay: catIdx * 0.05 }}
							>
								{catIdx > 0 && <Divider className="my-20" />}

								{/* Category header */}
								<Box className="flex items-center gap-10 mb-14">
									<Box
										className="flex items-center justify-center w-32 h-32 rounded-lg"
										sx={{ background: config.bgColor, border: `1px solid ${config.borderColor}` }}
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: config.color }}
										>
											{config.icon}
										</FuseSvgIcon>
									</Box>
									<Typography
										variant="subtitle2"
										sx={{ fontWeight: 700, color: config.color }}
									>
										{config.label}
									</Typography>
									{selectedInCategory > 0 && (
										<Chip
											size="small"
											label={`${selectedInCategory} selected`}
											sx={{
												height: 20,
												fontSize: '10px',
												fontWeight: 700,
												backgroundColor: config.bgColor,
												color: config.color,
												border: `1px solid ${config.borderColor}`
											}}
										/>
									)}
								</Box>

								{/* Amenity cards grid */}
								<Box
									sx={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
										gap: '10px'
									}}
								>
									{items.map((amenity) => {
										const isSelected = (
											Array.isArray(selectedAmenities) ? selectedAmenities : []
										).includes(amenity.id);
										return (
											<AmenityCard
												key={amenity.id}
												amenity={amenity}
												isSelected={isSelected}
												onToggle={() => handleToggleAmenity(amenity.id)}
											/>
										);
									})}
								</Box>
							</motion.div>
						);
					})}

				{/* Bottom summary bar */}
				{!amenitiesLoading && selectedCount > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						transition={{ duration: 0.3 }}
					>
						<Divider className="my-20" />
						<Box
							className="p-16 rounded-xl"
							sx={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' }}
						>
							<Typography
								variant="body2"
								sx={{ fontWeight: 600, color: '#c2410c', mb: 1 }}
							>
								<FuseSvgIcon
									size={16}
									className="mr-6"
								>
									heroicons-outline:check-circle
								</FuseSvgIcon>
								{selectedCount} amenit{selectedCount === 1 ? 'y' : 'ies'} selected for this property
							</Typography>
							<Box
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: '6px',
									mt: '8px'
								}}
							>
								{amenitiesList
									.filter((a) =>
										(Array.isArray(selectedAmenities) ? selectedAmenities : []).includes(a.id)
									)
									.map((a) => (
										<Chip
											key={a.id}
											size="small"
											icon={
												<Icon sx={{ fontSize: '14px !important', color: '#ea580c' }}>
													{a.icon}
												</Icon>
											}
											label={a.label}
											onDelete={() => handleToggleAmenity(a.id)}
											sx={{
												backgroundColor: 'rgba(234, 88, 12, 0.08)',
												color: '#c2410c',
												fontWeight: 600,
												border: '1px solid rgba(234, 88, 12, 0.2)',
												'& .MuiChip-deleteIcon': {
													color: '#ea580c',
													'&:hover': { color: '#c2410c' }
												}
											}}
										/>
									))}
							</Box>
						</Box>
					</motion.div>
				)}
			</Paper>

			{/* ─────────────────────────────────────────────────── */}
			{/* MEASUREMENTS SECTION                                */}
			{/* ─────────────────────────────────────────────────── */}

			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				<Box className="mb-24">
					<Typography
						variant="h6"
						className="font-bold mb-8"
						sx={{ color: '#ea580c', display: 'flex', alignItems: 'center', gap: '8px' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:cube</FuseSvgIcon>
						Property Measurements
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Enter accurate property dimensions for better guest understanding
					</Typography>
				</Box>
			</motion.div>

			{/* Main Dimensions Card */}
			<Paper
				className="p-24 mb-24 rounded-2xl"
				elevation={0}
				sx={{
					border: '1px solid rgba(234, 88, 12, 0.1)',
					background: 'linear-gradient(135deg, #fafaf9 0%, #ffffff 100%)'
				}}
			>
				<Box className="flex items-center gap-12 mb-16">
					<Box
						className="flex items-center justify-center w-40 h-40 rounded-lg"
						sx={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
					>
						<FuseSvgIcon
							className="text-white"
							size={20}
						>
							heroicons-outline:view-grid
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Floor Plan Dimensions
					</Typography>
				</Box>

				<Alert
					severity="info"
					className="mb-16"
					icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
				>
					Provide dimensions in meters for accurate area calculations
				</Alert>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-16">
					<Controller
						name="width"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Property Width"
								id="width"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Box className="flex items-center gap-4">
												<FuseSvgIcon size={16}>heroicons-outline:arrows-expand</FuseSvgIcon>
												<span>m</span>
											</Box>
										</InputAdornment>
									)
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Width in meters"
							/>
						)}
					/>

					<Controller
						name="length"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Property Length"
								id="length"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Box className="flex items-center gap-4">
												<FuseSvgIcon size={16}>heroicons-outline:arrows-expand</FuseSvgIcon>
												<span>m</span>
											</Box>
										</InputAdornment>
									)
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Length in meters"
							/>
						)}
					/>

					<Controller
						name="height"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Ceiling Height"
								id="height"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Box className="flex items-center gap-4">
												<FuseSvgIcon size={16}>heroicons-outline:arrow-up</FuseSvgIcon>
												<span>m</span>
											</Box>
										</InputAdornment>
									)
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Height in meters"
							/>
						)}
					/>
				</div>

				{/* Auto-calculated Total Area */}
				{totalArea > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						transition={{ duration: 0.3 }}
					>
						<Divider className="my-24" />
						<Box
							className="p-16 rounded-xl"
							sx={{
								background: 'linear-gradient(135deg, #fef3e2 0%, #ffffff 100%)'
							}}
						>
							<Box className="flex justify-between items-center mb-12">
								<Typography
									variant="body2"
									color="text.secondary"
								>
									<FuseSvgIcon
										size={16}
										className="mr-4"
									>
										heroicons-outline:calculator
									</FuseSvgIcon>
									Calculated Total Floor Area
								</Typography>
								<Typography
									variant="h5"
									className="font-bold"
									sx={{ color: '#ea580c' }}
								>
									{totalArea.toFixed(2)} m²
								</Typography>
							</Box>
							<Box className="flex items-center gap-8">
								<Chip
									size="small"
									label={propertyCategory}
									sx={{
										backgroundColor: 'rgba(234, 88, 12, 0.1)',
										color: '#ea580c',
										fontWeight: 600
									}}
								/>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									≈ {(totalArea * 10.764).toFixed(0)} sq ft
								</Typography>
							</Box>
						</Box>
					</motion.div>
				)}
			</Paper>

			{/* Additional Measurements */}
			<Paper
				className="p-24 mb-24 rounded-2xl"
				elevation={0}
				sx={{
					border: '1px solid rgba(234, 88, 12, 0.1)'
				}}
			>
				<Box className="flex items-center gap-12 mb-16">
					<Box
						className="flex items-center justify-center w-40 h-40 rounded-lg"
						sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
					>
						<FuseSvgIcon
							className="text-white"
							size={20}
						>
							heroicons-outline:office-building
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Additional Details
					</Typography>
				</Box>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
					<Controller
						name="floorArea"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Built-up Area (Optional)"
								id="floorArea"
								InputProps={{
									endAdornment: <InputAdornment position="end">m²</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Total built-up area if different from calculated"
							/>
						)}
					/>

					<Controller
						name="plotArea"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Plot/Land Area (Optional)"
								id="plotArea"
								InputProps={{
									endAdornment: <InputAdornment position="end">m²</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Total land/plot size"
							/>
						)}
					/>

					<Controller
						name="numberOfFloors"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Number of Floors"
								id="numberOfFloors"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={16}>heroicons-outline:view-grid-add</FuseSvgIcon>
										</InputAdornment>
									)
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Total number of floors/stories"
							/>
						)}
					/>

					<Controller
						name="floorLevel"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Floor Level (Optional)"
								id="floorLevel"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={16}>heroicons-outline:location-marker</FuseSvgIcon>
										</InputAdornment>
									)
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Which floor is this unit on (for apartments)"
							/>
						)}
					/>
				</div>
			</Paper>

			{/* Measurement Reference Guide */}
			<Paper
				className="p-24 rounded-2xl"
				elevation={0}
				sx={{
					background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
					border: '1px solid rgba(59, 130, 246, 0.2)'
				}}
			>
				<Box className="flex items-center gap-12 mb-16">
					<Box
						className="flex items-center justify-center w-40 h-40 rounded-lg"
						sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
					>
						<FuseSvgIcon
							className="text-white"
							size={20}
						>
							heroicons-outline:book-open
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Measurement Guide
					</Typography>
				</Box>

				<Box className="grid grid-cols-1 md:grid-cols-2 gap-12">
					<Box>
						<Typography
							variant="subtitle2"
							className="font-semibold mb-8"
							sx={{ color: '#3b82f6' }}
						>
							Property Size Categories:
						</Typography>
						<Box className="space-y-4">
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<span>•</span> Studio/Small: &lt; 50 m² (~538 sq ft)
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<span>•</span> Medium: 50-100 m² (~538-1076 sq ft)
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<span>•</span> Large: 100-150 m² (~1076-1614 sq ft)
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<span>•</span> House: 150-250 m² (~1614-2691 sq ft)
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<span>•</span> Villa/Estate: &gt; 250 m² (~2691+ sq ft)
							</Typography>
						</Box>
					</Box>

					<Box>
						<Typography
							variant="subtitle2"
							className="font-semibold mb-8"
							sx={{ color: '#3b82f6' }}
						>
							Tips for Accurate Measurements:
						</Typography>
						<Box className="space-y-4">
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
								Measure from wall to wall (internal dimensions)
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
								Include all livable spaces in calculations
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
								Standard ceiling height is 2.4-3m
							</Typography>
							<Typography
								variant="caption"
								className="flex items-center gap-4"
							>
								<FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>1 m² = 10.764 square feet
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
		</div>
	);
}

export default ShippingTabProperty;
