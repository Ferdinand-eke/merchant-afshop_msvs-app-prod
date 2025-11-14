import {
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Paper,
	Typography,
	Box,
	Divider,
	Switch,
	FormControlLabel,
	Alert
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { calculateCompanyEarnings, calculateShopEarnings } from 'app/configs/Calculus';
import { Controller, useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';

/**
 * The pricing tab with VAT, advanced pricing, and professional UI
 */
function PricingTabProperty({ shopData }) {
	const methods = useFormContext();
	const { control, watch } = methods;

	const [vatEnabled, setVatEnabled] = useState(false);
	const [vatRate, setVatRate] = useState(7.5); // Default VAT rate for Nigeria
	const [priceWithoutVAT, setPriceWithoutVAT] = useState(0);
	const [priceWithVAT, setPriceWithVAT] = useState(0);
	const [vatAmount, setVatAmount] = useState(0);

	const currentPrice = watch('price') || 0;
	const commissionRate = shopData?.data?.merchant?.merchantShopplan?.percetageCommissionCharge || 0;
	const commissionConversion = shopData?.data?.merchant?.merchantShopplan?.percetageCommissionChargeConversion || 0;

	// Calculate VAT and prices
	useEffect(() => {
		if (vatEnabled && currentPrice > 0) {
			const basePrice = currentPrice / (1 + vatRate / 100);
			const vat = currentPrice - basePrice;
			setPriceWithoutVAT(basePrice);
			setVatAmount(vat);
			setPriceWithVAT(currentPrice);
		} else {
			setPriceWithoutVAT(currentPrice);
			setVatAmount(0);
			setPriceWithVAT(currentPrice);
		}
	}, [currentPrice, vatEnabled, vatRate]);

	const yourEarnings = calculateShopEarnings(currentPrice, commissionConversion);
	const platformCommission = calculateCompanyEarnings(currentPrice, commissionConversion);

	return (
		<div>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Box className="mb-24">
					<Typography
						variant="h6"
						className="font-bold mb-8"
						sx={{ color: '#ea580c' }}
					>
						<FuseSvgIcon
							size={24}
							className="mr-8"
						>
							heroicons-outline:currency-dollar
						</FuseSvgIcon>
						Pricing & Revenue Management
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Set your pricing strategy and manage taxes for your property
					</Typography>
				</Box>
			</motion.div>

			{/* Primary Pricing Section */}
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
							heroicons-outline:cash
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Base Pricing
					</Typography>
				</Box>

				<div className="flex gap-16">
					<Controller
						name="price"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="flex-1"
								label="Property Price"
								id="price"
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Enter the price guests will pay per booking period"
							/>
						)}
					/>

					<Controller
						name="listprice"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="flex-1"
								label="List Price (Optional)"
								id="listprice"
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Original price (for showing discounts)"
							/>
						)}
					/>
				</div>

				<Controller
					name="bookingPeriod"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<FormControl
							fullWidth
							className="mt-16"
						>
							<InputLabel id="bookingPeriod-label">Booking Period</InputLabel>
							<Select
								labelId="bookingPeriod-label"
								id="bookingPeriod"
								label="Booking Period"
								onChange={onChange}
								value={value || ''}
							>
								<MenuItem value="">
									<em>Select booking period</em>
								</MenuItem>
								<MenuItem value="NIGHT">Per Night</MenuItem>
								<MenuItem value="WEEK">Per Week</MenuItem>
								<MenuItem value="MONTH">Per Month</MenuItem>
							</Select>
						</FormControl>
					)}
				/>
			</Paper>

			{/* VAT & Tax Management */}
			<Paper
				className="p-24 mb-24 rounded-2xl"
				elevation={0}
				sx={{
					border: '1px solid rgba(234, 88, 12, 0.1)',
					background: vatEnabled ? 'linear-gradient(135deg, #fef3e2 0%, #ffffff 100%)' : '#ffffff'
				}}
			>
				<Box className="flex items-center justify-between mb-16">
					<Box className="flex items-center gap-12">
						<Box
							className="flex items-center justify-center w-40 h-40 rounded-lg"
							sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
						>
							<FuseSvgIcon
								className="text-white"
								size={20}
							>
								heroicons-outline:calculator
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-semibold"
							>
								VAT & Tax Management
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Manage tax calculations for your pricing
							</Typography>
						</Box>
					</Box>
					<FormControlLabel
						control={
							<Switch
								checked={vatEnabled}
								onChange={(e) => setVatEnabled(e.target.checked)}
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked': {
										color: '#ea580c'
									},
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
										backgroundColor: '#ea580c'
									}
								}}
							/>
						}
						label="Include VAT"
					/>
				</Box>

				{vatEnabled && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						transition={{ duration: 0.3 }}
					>
						<Alert
							severity="info"
							className="mb-16"
							icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
						>
							VAT will be calculated and displayed separately to guests
						</Alert>

						<TextField
							label="VAT Rate (%)"
							type="number"
							value={vatRate}
							onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>
							}}
							fullWidth
							className="mb-16"
							helperText="Default: 7.5% (Nigeria VAT rate)"
						/>

						<Divider className="my-16" />

						{/* VAT Breakdown */}
						<Box className="space-y-12">
							<Box className="flex justify-between items-center">
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Price (without VAT)
								</Typography>
								<Typography
									variant="body1"
									className="font-semibold"
								>
									₦{formatCurrency(priceWithoutVAT)}
								</Typography>
							</Box>
							<Box className="flex justify-between items-center">
								<Typography
									variant="body2"
									color="text.secondary"
								>
									VAT ({vatRate}%)
								</Typography>
								<Typography
									variant="body1"
									className="font-semibold"
									sx={{ color: '#10b981' }}
								>
									+₦{formatCurrency(vatAmount)}
								</Typography>
							</Box>
							<Divider />
							<Box className="flex justify-between items-center">
								<Typography
									variant="body1"
									className="font-bold"
								>
									Total Price (with VAT)
								</Typography>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#ea580c' }}
								>
									₦{formatCurrency(priceWithVAT)}
								</Typography>
							</Box>
						</Box>
					</motion.div>
				)}
			</Paper>

			{/* Additional Fees */}
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
							heroicons-outline:plus-circle
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Additional Fees
					</Typography>
				</Box>

				<div className="space-y-16">
					<Controller
						name="cleaningFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Cleaning Fee (Optional)"
								id="cleaningFee"
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="One-time fee charged per booking"
							/>
						)}
					/>

					<Controller
						name="securityDeposit"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Security Deposit (Optional)"
								id="securityDeposit"
								InputProps={{
									startAdornment: <InputAdornment position="start">₦</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
								helperText="Refundable deposit amount"
							/>
						)}
					/>
				</div>
			</Paper>

			{/* Rental Type */}
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
						sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
					>
						<FuseSvgIcon
							className="text-white"
							size={20}
						>
							heroicons-outline:home
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Rental Options
					</Typography>
				</Box>

				<Controller
					name="isRentIndividualRoom"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<FormControl fullWidth>
							<InputLabel id="isRentIndividualRoom-label">Rental Type</InputLabel>
							<Select
								labelId="isRentIndividualRoom-label"
								id="isRentIndividualRoom"
								label="Rental Type"
								onChange={onChange}
								value={value === '' || value === null || value === undefined ? '' : value}
							>
								<MenuItem value="">
									<em>Select rental type</em>
								</MenuItem>
								<MenuItem value>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon size={18}>heroicons-outline:key</FuseSvgIcon>
										<span>Individual Rooms - Rent rooms separately</span>
									</Box>
								</MenuItem>
								<MenuItem value={false}>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon size={18}>heroicons-outline:home</FuseSvgIcon>
										<span>Entire Property - Rent as a whole</span>
									</Box>
								</MenuItem>
							</Select>
						</FormControl>
					)}
				/>
			</Paper>

			{/* Revenue Calculator */}
			<Paper
				className="p-24 rounded-2xl"
				elevation={0}
				sx={{
					background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
					color: 'white'
				}}
			>
				<Box className="flex items-center gap-12 mb-16">
					<Box
						className="flex items-center justify-center w-40 h-40 rounded-lg"
						sx={{ background: 'rgba(255, 255, 255, 0.2)' }}
					>
						<FuseSvgIcon
							className="text-white"
							size={20}
						>
							heroicons-outline:chart-bar
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h6"
						className="font-bold"
					>
						Your Earnings Breakdown
					</Typography>
				</Box>

				<Box className="space-y-12 mb-16">
					<Box className="flex justify-between items-center">
						<Typography
							variant="body2"
							className="opacity-90"
						>
							Guest Payment
						</Typography>
						<Typography
							variant="h6"
							className="font-bold"
						>
							₦{formatCurrency(currentPrice || 0)}
						</Typography>
					</Box>
					<Box className="flex justify-between items-center">
						<Typography
							variant="body2"
							className="opacity-90"
						>
							Platform Commission ({commissionRate}%)
						</Typography>
						<Typography
							variant="body1"
							className="font-semibold opacity-80"
						>
							-₦{formatCurrency(platformCommission)}
						</Typography>
					</Box>
					<Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
					<Box className="flex justify-between items-center">
						<Typography
							variant="body1"
							className="font-bold"
						>
							Your Net Earnings
						</Typography>
						<Typography
							variant="h5"
							className="font-bold"
						>
							₦{formatCurrency(yourEarnings)}
						</Typography>
					</Box>
				</Box>

				<Alert
					severity="success"
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
						color: 'white',
						'& .MuiAlert-icon': {
							color: 'white'
						}
					}}
				>
					You keep {((yourEarnings / (currentPrice || 1)) * 100).toFixed(1)}% of each booking
				</Alert>
			</Paper>
		</div>
	);
}

export default PricingTabProperty;
