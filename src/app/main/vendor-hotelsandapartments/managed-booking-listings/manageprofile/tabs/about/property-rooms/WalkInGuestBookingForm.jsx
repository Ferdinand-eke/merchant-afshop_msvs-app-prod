import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	IconButton,
	Divider,
	Paper,
	InputAdornment,
	Alert,
	CircularProgress,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	FormHelperText,
	Chip,
	Checkbox,
	FormControlLabel
} from '@mui/material';
import { Close, Person, Phone, Email, CalendarMonth, Home, CameraAlt, Payment, CreditCard, CheckCircle } from '@mui/icons-material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
import { Calender } from '../calender';
import { useGetReservationsOnRoom } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';

/**
 * WalkInGuestBookingForm - Component for merchants to book rooms for walk-in guests
 * Features:
 * - Guest information collection
 * - Date selection with calendar
 * - Price calculation
 * - Payment method selection
 * - Identity card capture
 * - Booking submission
 */

// Payment Method Enum
const PaymentMethod = {
	PAYSTACK: 'PAYSTACK',
	FLUTTERWAVE: 'FLUTTERWAVE',
	PAYPAL: 'PAYPAL',
	STRIPE: 'STRIPE',
	CASH: 'CASH',
	BANK_TRANSFER: 'BANK_TRANSFER',
	MOBILE_MONEY: 'MOBILE_MONEY'
};

const paymentMethodLabels = {
	[PaymentMethod.PAYSTACK]: 'Paystack',
	[PaymentMethod.FLUTTERWAVE]: 'Flutterwave',
	[PaymentMethod.PAYPAL]: 'PayPal',
	[PaymentMethod.STRIPE]: 'Stripe',
	[PaymentMethod.CASH]: 'Cash',
	[PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
	[PaymentMethod.MOBILE_MONEY]: 'Mobile Money'
};

const initialDateRange = {
	startDate: new Date(),
	endDate: new Date(),
	key: 'selection'
};

const WalkInGuestBookingForm = ({ roomId, roomPrice, roomTitle, propertyId, propertyTitle, propertyAddress, merchantId, createReservation, isCreatingReservation = false, onClose }) => {
	const [formData, setFormData] = useState({
		guestName: '',
		guestEmail: '',
		guestPhone: '',
		guestAddress: '',
		notes: '',
		paymentMethod: PaymentMethod.CASH,
		isCheckingInNow: false
	});
	const [dateRange, setDateRange] = useState(initialDateRange);
	const [totalPrice, setTotalPrice] = useState(roomPrice);
	const [errors, setErrors] = useState({});
	const [identityCardImage, setIdentityCardImage] = useState(null);
	const [identityCardPreview, setIdentityCardPreview] = useState(null);
	const fileInputRef = useRef(null);
	const cameraInputRef = useRef(null);

	// Fetch existing reservations for the room
	const { data: reservationsData, isLoading: reservationsLoading } = useGetReservationsOnRoom(roomId);

	// Calculate disabled dates from existing reservations
	const disabledDates = useMemo(() => {
		let dates = [];
		reservationsData?.data?.reservationsOnRoom?.forEach((reservation) => {
			const range = eachDayOfInterval({
				start: new Date(reservation?.startDate),
				end: new Date(reservation?.endDate)
			});
			dates = [...dates, ...range];
		});
		return dates;
	}, [reservationsData?.data?.reservationsOnRoom]);

	// Calculate total price based on selected dates
	useEffect(() => {
		if (dateRange?.startDate && dateRange?.endDate) {
			const dayCount = differenceInCalendarDays(dateRange?.endDate, dateRange?.startDate);
			if (dayCount && roomPrice) {
				setTotalPrice(dayCount * roomPrice);
			} else {
				setTotalPrice(roomPrice);
			}
		}
	}, [dateRange, roomPrice]);

	// Handle form field changes
	const handleChange = (field) => (event) => {
		setFormData((prev) => ({
			...prev,
			[field]: event.target.value
		}));
		// Clear error for this field
		setErrors((prev) => ({
			...prev,
			[field]: ''
		}));
	};

	// Handle checkbox changes
	const handleCheckboxChange = (field) => (event) => {
		setFormData((prev) => ({
			...prev,
			[field]: event.target.checked
		}));
	};

	// Handle date range changes
	const handleDateChange = (value) => {
		setDateRange(value?.selection);
	};

	// Handle identity card image capture/upload
	const handleIdentityCardCapture = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				setErrors((prev) => ({
					...prev,
					identityCard: 'Please select a valid image file'
				}));
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setErrors((prev) => ({
					...prev,
					identityCard: 'Image size should be less than 5MB'
				}));
				return;
			}

			setIdentityCardImage(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setIdentityCardPreview(reader.result);
			};
			reader.readAsDataURL(file);

			// Clear error
			setErrors((prev) => ({
				...prev,
				identityCard: ''
			}));
		}
	};

	// Handle remove identity card
	const handleRemoveIdentityCard = () => {
		setIdentityCardImage(null);
		setIdentityCardPreview(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
		if (cameraInputRef.current) cameraInputRef.current.value = '';
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		if (!formData.guestName.trim()) {
			newErrors.guestName = 'Guest name is required';
		}

		if (!formData.guestPhone.trim()) {
			newErrors.guestPhone = 'Phone number is required';
		} else if (!/^\+?[\d\s-()]+$/.test(formData.guestPhone)) {
			newErrors.guestPhone = 'Invalid phone number format';
		}

		if (formData.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
			newErrors.guestEmail = 'Invalid email format';
		}

		if (!formData.guestAddress.trim()) {
			newErrors.guestAddress = 'Guest address is required';
		}

		if (!formData.paymentMethod) {
			newErrors.paymentMethod = 'Please select a payment method';
		}

		if (!identityCardImage) {
			newErrors.identityCard = 'Identity card photo is required for security verification';
		}

		if (!dateRange?.startDate || !dateRange?.endDate) {
			newErrors.dates = 'Please select check-in and check-out dates';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Convert image to base64
	const convertImageToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result); // This will be "data:image/jpeg;base64,..."
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	// Handle form submission
	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		try {
			// Convert identity card image to base64
			let identityCardBase64 = null;
			if (identityCardImage) {
				identityCardBase64 = await convertImageToBase64(identityCardImage);
			}

			const bookingData = {
				guestName: formData.guestName,
				guestEmail: formData.guestEmail || null,
				guestPhone: formData.guestPhone,
				guestAddress: formData.guestAddress,
				notes: formData.notes || null,
				paymentMethod: formData.paymentMethod,
				totalPrice,
				startDate: dateRange?.startDate,
				endDate: dateRange?.endDate,
				listingId: propertyId,
				listedPropertyName: propertyTitle,
				listedPropertyAddress:propertyAddress,
				roomOnPropertyId: roomId,
				merchantId: merchantId,
				isWalkIn: true, // Flag to indicate this is a walk-in booking
				identityCardImage: identityCardBase64, // Base64 string with data:image/...;base64,... format
				isCheckingInNow: formData.isCheckingInNow
			};

			console.log('Walk-in booking data:', bookingData);

			// Call the mutation to create reservation
			createReservation(bookingData);
		} catch (error) {
			console.error('Error creating walk-in booking:', error);
			alert('Failed to create booking. Please try again.');
		}
	}, [formData, dateRange, totalPrice, roomId, propertyId, merchantId, identityCardImage, createReservation]);

	return (
		<FusePageSimple
			content={
				<Box sx={{ p: 3, maxWidth: 500 }}>
					{/* Header */}
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
						<Box>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
								Book for Walk-In Guest
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{roomTitle}
							</Typography>
						</Box>
						<IconButton
							onClick={onClose}
							sx={{
								backgroundColor: 'rgba(0, 0, 0, 0.05)',
								'&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' }
							}}
						>
							<Close />
						</IconButton>
					</Box>

					<Divider sx={{ mb: 3 }} />

					{/* Guest Information Form */}
					<Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
						<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#374151' }}>
							Guest Information
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<TextField
								fullWidth
								label="Guest Name"
								placeholder="Enter guest full name"
								value={formData.guestName}
								onChange={handleChange('guestName')}
								error={!!errors.guestName}
								helperText={errors.guestName}
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Person sx={{ color: '#9ca3af' }} />
										</InputAdornment>
									)
								}}
							/>

							<TextField
								fullWidth
								label="Phone Number"
								placeholder="+234 XXX XXX XXXX"
								value={formData.guestPhone}
								onChange={handleChange('guestPhone')}
								error={!!errors.guestPhone}
								helperText={errors.guestPhone}
								required
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Phone sx={{ color: '#9ca3af' }} />
										</InputAdornment>
									)
								}}
							/>

							<TextField
								fullWidth
								label="Email Address (Optional)"
								placeholder="guest@example.com"
								value={formData.guestEmail}
								onChange={handleChange('guestEmail')}
								error={!!errors.guestEmail}
								helperText={errors.guestEmail}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Email sx={{ color: '#9ca3af' }} />
										</InputAdornment>
									)
								}}
							/>

							<TextField
								fullWidth
								label="Guest Address"
								placeholder="Enter full residential address"
								value={formData.guestAddress}
								onChange={handleChange('guestAddress')}
								error={!!errors.guestAddress}
								helperText={errors.guestAddress}
								required
								multiline
								rows={2}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
											<Home sx={{ color: '#9ca3af' }} />
										</InputAdornment>
									)
								}}
							/>

							<TextField
								fullWidth
								label="Notes (Optional)"
								placeholder="Special requests, preferences, etc."
								value={formData.notes}
								onChange={handleChange('notes')}
								multiline
								rows={3}
							/>
						</Box>
					</Paper>

					{/* Payment Method Selection */}
					<Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
						<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#374151' }}>
							Payment Method
						</Typography>

						<FormControl fullWidth error={!!errors.paymentMethod}>
							<InputLabel id="payment-method-label">Select Payment Method</InputLabel>
							<Select
								labelId="payment-method-label"
								value={formData.paymentMethod}
								onChange={handleChange('paymentMethod')}
								label="Select Payment Method"
								startAdornment={
									<InputAdornment position="start">
										<Payment sx={{ color: '#9ca3af' }} />
									</InputAdornment>
								}
							>
								{Object.values(PaymentMethod).map((method) => (
									<MenuItem key={method} value={method}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<CreditCard sx={{ fontSize: 20, color: '#9ca3af' }} />
											{paymentMethodLabels[method]}
										</Box>
									</MenuItem>
								))}
							</Select>
							{errors.paymentMethod && (
								<FormHelperText>{errors.paymentMethod}</FormHelperText>
							)}
						</FormControl>
					</Paper>

					{/* Identity Card Capture */}
					<Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
						<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
							Guest Identity Verification
						</Typography>
						<Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#6b7280' }}>
							Required by law for hospitality security checks. Please capture or upload a photo of the guest's valid ID card.
						</Typography>

						{/* Hidden file inputs */}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleIdentityCardCapture}
							style={{ display: 'none' }}
						/>
						<input
							ref={cameraInputRef}
							type="file"
							accept="image/*"
							capture="environment"
							onChange={handleIdentityCardCapture}
							style={{ display: 'none' }}
						/>

						{identityCardPreview ? (
							// Preview section
							<Box
								sx={{
									position: 'relative',
									border: '2px solid #10b981',
									borderRadius: '12px',
									overflow: 'hidden',
									backgroundColor: '#f0fdf4'
								}}
							>
								<Box
									sx={{
										position: 'relative',
										width: '100%',
										height: 200,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<img
										src={identityCardPreview}
										alt="Identity Card"
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain'
										}}
									/>
									<IconButton
										onClick={handleRemoveIdentityCard}
										sx={{
											position: 'absolute',
											top: 8,
											right: 8,
											backgroundColor: 'rgba(0, 0, 0, 0.7)',
											color: 'white',
											'&:hover': {
												backgroundColor: 'rgba(0, 0, 0, 0.9)'
											}
										}}
									>
										<Close />
									</IconButton>
								</Box>
								<Box
									sx={{
										p: 2,
										backgroundColor: '#dcfce7',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between'
									}}
								>
									<Chip
										label="Identity Card Captured"
										color="success"
										size="small"
										sx={{ fontWeight: 600 }}
									/>
									<Typography variant="caption" sx={{ color: '#166534' }}>
										{identityCardImage?.name || 'Captured Image'}
									</Typography>
								</Box>
							</Box>
						) : (
							// Capture buttons
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
								<Button
									fullWidth
									variant="contained"
									startIcon={<CameraAlt />}
									onClick={() => cameraInputRef.current?.click()}
									sx={{
										py: 2,
										backgroundColor: '#ea580c',
										color: 'white',
										fontWeight: 700,
										textTransform: 'none',
										borderRadius: '10px',
										'&:hover': {
											backgroundColor: '#c2410c'
										}
									}}
								>
									Capture ID with Camera
								</Button>
								<Button
									fullWidth
									variant="outlined"
									startIcon={<FuseSvgIcon size={20}>heroicons-outline:photograph</FuseSvgIcon>}
									onClick={() => fileInputRef.current?.click()}
									sx={{
										py: 2,
										borderColor: '#ea580c',
										color: '#ea580c',
										fontWeight: 600,
										textTransform: 'none',
										borderRadius: '10px',
										'&:hover': {
											borderColor: '#c2410c',
											backgroundColor: '#fff5f0'
										}
									}}
								>
									Upload ID from Gallery
								</Button>
								{errors.identityCard && (
									<Alert severity="error" sx={{ mt: 1 }}>
										{errors.identityCard}
									</Alert>
								)}
							</Box>
						)}
					</Paper>

					{/* Check-in Now Option */}
					<Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={formData.isCheckingInNow}
									onChange={handleCheckboxChange('isCheckingInNow')}
									icon={<CheckCircle sx={{ color: '#d1d5db' }} />}
									checkedIcon={<CheckCircle sx={{ color: '#10b981' }} />}
								/>
							}
							label={
								<Box>
									<Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151' }}>
										Check-in Guest Now
									</Typography>
									<Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
										Enable this if the guest wants to check in immediately. Otherwise, check-in will be on the selected date.
									</Typography>
								</Box>
							}
						/>
					</Paper>

					{/* Date Selection */}
					<Paper elevation={0} sx={{ mb: 3, border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
						<Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
							<Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151' }}>
								Select Check-in & Check-out Dates
							</Typography>
						</Box>

						{errors.dates && (
							<Alert severity="error" sx={{ m: 2 }}>
								{errors.dates}
							</Alert>
						)}

						{reservationsLoading ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
								<CircularProgress size={32} />
							</Box>
						) : (
							<Calender
								value={dateRange}
								disabledDates={disabledDates}
								onChange={handleDateChange}
							/>
						)}
					</Paper>

					{/* Price Summary */}
					<Paper
						elevation={0}
						sx={{
							p: 3,
							mb: 3,
							backgroundColor: '#fff5f0',
							border: '2px solid #fed7aa',
							borderRadius: 2
						}}
					>
						<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#9a3412' }}>
							Booking Summary
						</Typography>

						<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
							<Typography variant="body2" color="text.secondary">
								Price per night
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								₦{formatCurrency(roomPrice)}
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
							<Typography variant="body2" color="text.secondary">
								Number of nights
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{differenceInCalendarDays(dateRange?.endDate, dateRange?.startDate) || 0}
							</Typography>
						</Box>

						<Divider sx={{ mb: 2 }} />

						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
								Total Amount
							</Typography>
							<Typography variant="h5" sx={{ fontWeight: 800, color: '#ea580c' }}>
								₦{formatCurrency(totalPrice)}
							</Typography>
						</Box>
					</Paper>

					{/* Action Buttons */}
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button
							fullWidth
							variant="outlined"
							onClick={onClose}
							disabled={isCreatingReservation}
							sx={{
								py: 1.5,
								borderColor: '#d1d5db',
								color: '#6b7280',
								fontWeight: 600,
								textTransform: 'none',
								'&:hover': {
									borderColor: '#9ca3af',
									backgroundColor: '#f9fafb'
								}
							}}
						>
							Cancel
						</Button>
						<Button
							fullWidth
							variant="contained"
							onClick={handleSubmit}
							disabled={isCreatingReservation}
							startIcon={
								isCreatingReservation ? (
									<CircularProgress size={20} color="inherit" />
								) : (
									<CalendarMonth />
								)
							}
							sx={{
								py: 1.5,
								backgroundColor: '#ea580c',
								color: 'white',
								fontWeight: 700,
								textTransform: 'none',
								'&:hover': {
									backgroundColor: '#c2410c',
									boxShadow: '0 6px 16px rgba(234, 88, 12, 0.3)'
								},
								'&:disabled': {
									backgroundColor: '#fed7aa',
									color: '#9a3412'
								}
							}}
						>
							{isCreatingReservation ? 'Creating Booking...' : 'Confirm Booking'}
						</Button>
					</Box>

					{/* Security & Payment Alerts */}
					<Alert severity="info" icon={<CreditCard />} sx={{ mt: 3, mb: 2 }}>
						<strong>Payment Method:</strong> {paymentMethodLabels[formData.paymentMethod]}
						<br />
						Ensure payment is collected via the selected method before confirming the booking.
					</Alert>

					<Alert severity="warning" sx={{ mb: 2 }}>
						This booking will be created for a walk-in guest. The guest identity card has been captured for security verification as required by hospitality regulations.
					</Alert>
				</Box>
			}
		/>
	);
};

export default WalkInGuestBookingForm;
