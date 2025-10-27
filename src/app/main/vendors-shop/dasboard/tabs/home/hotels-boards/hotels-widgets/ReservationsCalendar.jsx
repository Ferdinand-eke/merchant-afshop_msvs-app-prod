import { memo, useState } from 'react';
import { Paper, Typography, Box, Chip, IconButton, Avatar, Button, Skeleton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * ReservationsCalendar - Beautiful calendar showing current and future reservations
 */
function ReservationsCalendar({ reservations, isLoading }) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Loading skeleton placeholder
	if (isLoading) {
		return (
			<Paper className="flex flex-col shadow rounded-2xl overflow-hidden h-full">
				{/* Header Skeleton */}
				<Box className="flex items-center justify-between p-16 bg-gradient-to-r from-blue-500 to-purple-600">
					<Box className="flex items-center gap-12">
						<Skeleton variant="circular" width={40} height={40} className="bg-white/20" />
						<Box>
							<Skeleton variant="text" width={180} height={24} className="bg-white/20" />
							<Skeleton variant="text" width={120} height={16} className="bg-white/20" />
						</Box>
					</Box>
					<Skeleton variant="rectangular" width={80} height={32} className="bg-white/20 rounded-lg" />
				</Box>

				{/* Month Navigation Skeleton */}
				<Box className="flex items-center justify-between p-16 border-b">
					<Skeleton variant="circular" width={32} height={32} />
					<Skeleton variant="text" width={150} height={28} />
					<Skeleton variant="circular" width={32} height={32} />
				</Box>

				{/* Calendar Grid Skeleton */}
				<Box className="flex-1 p-16">
					{/* Day Names */}
					<Box className="grid grid-cols-7 gap-4 mb-8">
						{[...Array(7)].map((_, i) => (
							<Box key={i} className="text-center">
								<Skeleton variant="text" width={30} height={16} className="mx-auto" />
							</Box>
						))}
					</Box>

					{/* Calendar Days */}
					<Box className="grid grid-cols-7 gap-4">
						{[...Array(35)].map((_, i) => (
							<Skeleton
								key={i}
								variant="rectangular"
								className="rounded-lg"
								height={60}
								sx={{
									animation: 'pulse 1.5s ease-in-out infinite',
									animationDelay: `${i * 0.02}s`
								}}
							/>
						))}
					</Box>

					{/* Selected Date Details Skeleton */}
					<Box className="mt-16 p-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
						<Box className="flex items-center gap-8 mb-12">
							<Skeleton variant="circular" width={20} height={20} />
							<Skeleton variant="text" width={250} height={20} />
						</Box>
						<Box className="flex flex-col gap-8">
							{[1, 2].map((idx) => (
								<Box key={idx} className="flex items-center gap-12 p-12 bg-white dark:bg-gray-800 rounded-lg">
									<Skeleton variant="circular" width={32} height={32} />
									<Box className="flex-1">
										<Skeleton variant="text" width="70%" height={16} />
										<Skeleton variant="text" width="50%" height={14} />
									</Box>
									<Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Paper>
		);
	}

	// Get calendar data
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Get first day of month and number of days
	const firstDayOfMonth = new Date(year, month, 1);
	const lastDayOfMonth = new Date(year, month + 1, 0);
	const daysInMonth = lastDayOfMonth.getDate();
	const startingDayOfWeek = firstDayOfMonth.getDay();

	// Month navigation
	const goToPreviousMonth = () => {
		setCurrentDate(new Date(year, month - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(year, month + 1, 1));
	};

	const goToToday = () => {
		const now = new Date();
		setCurrentDate(now);
		setSelectedDate(now);
	};

	// Get reservations for a specific date
	const getReservationsForDate = (date) => {
		if (!reservations?.data?.reservations) return [];

		return reservations?.data?.reservations?.filter(reservation => {
			const startDate = new Date(reservation.startDate);
			const endDate = new Date(reservation.endDate);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(0, 0, 0, 0);
			date.setHours(0, 0, 0, 0);

			return date >= startDate && date <= endDate;
		});
	};

	// Get reservations for selected date
	const selectedDateReservations = getReservationsForDate(selectedDate);

	// Generate calendar days
	const calendarDays = [];

	// Empty cells for days before month starts
	for (let i = 0; i < startingDayOfWeek; i++) {
		calendarDays.push(null);
	}

	// Days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		calendarDays.push(day);
	}

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return (
		<Paper className="flex flex-col shadow rounded-2xl overflow-hidden h-full max-h-[800px]">
			{/* Calendar Header */}
			<Box className="flex items-center justify-between p-16 bg-gradient-to-r from-blue-500 to-purple-600">
				<Box className="flex items-center gap-12">
					<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-white/20">
						<FuseSvgIcon className="text-white" size={24}>
							heroicons-outline:calendar
						</FuseSvgIcon>
					</Box>
					<Box>
						<Typography className="text-white font-bold text-lg">
							Reservations Calendar
						</Typography>
						<Typography className="text-white/80 text-xs">
							{reservations?.data?.data?.length || 0} total reservations
						</Typography>
					</Box>
				</Box>
				<Button
					variant="contained"
					size="small"
					onClick={goToToday}
					className="bg-white text-blue-600 hover:bg-white/90"
					startIcon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>}
				>
					Today
				</Button>
			</Box>

			{/* Month Navigation */}
			<Box className="flex items-center justify-between p-16 border-b">
				<IconButton onClick={goToPreviousMonth} size="small">
					<FuseSvgIcon size={20}>heroicons-outline:chevron-left</FuseSvgIcon>
				</IconButton>
				<Typography className="text-lg font-semibold">
					{monthNames[month]} {year}
				</Typography>
				<IconButton onClick={goToNextMonth} size="small">
					<FuseSvgIcon size={20}>heroicons-outline:chevron-right</FuseSvgIcon>
				</IconButton>
			</Box>

			<Box className="flex-1 overflow-y-auto overflow-x-hidden p-16 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-gray-800">
				{/* Day Names */}
				<Box className="grid grid-cols-7 gap-4 mb-8">
					{dayNames.map(day => (
						<Box key={day} className="text-center">
							<Typography className="text-xs font-semibold text-gray-500">
								{day}
							</Typography>
						</Box>
					))}
				</Box>

				{/* Calendar Grid */}
				<Box className="grid grid-cols-7 gap-4">
					{calendarDays.map((day, index) => {
						if (!day) {
							return <Box key={`empty-${index}`} />;
						}

						const date = new Date(year, month, day);
						const isToday = date.toDateString() === today.toDateString();
						const isSelected = date.toDateString() === selectedDate.toDateString();
						const isPast = date < today;
						const dayReservations = getReservationsForDate(date);
						const hasReservations = dayReservations.length > 0;

						return (
							<motion.div
								key={day}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Box
									onClick={() => setSelectedDate(date)}
									className={`
										relative p-8 rounded-lg cursor-pointer transition-all
										${isSelected ? 'bg-blue-600 text-white shadow-lg' : ''}
										${!isSelected && isToday ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' : ''}
										${!isSelected && !isToday && hasReservations ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
										${!isSelected && !isToday && !hasReservations ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
										${isPast && !isToday ? 'opacity-50' : ''}
									`}
								>
									<Typography
										className={`text-center text-sm font-medium ${isSelected ? 'text-white' : ''}`}
									>
										{day}
									</Typography>
									{hasReservations && (
										<Box className="flex justify-center mt-4">
											<Box
												className={`
													w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
													${isSelected ? 'bg-white text-blue-600' : 'bg-purple-600 text-white'}
												`}
											>
												{dayReservations.length}
											</Box>
										</Box>
									)}
								</Box>
							</motion.div>
						);
					})}
				</Box>

				{/* Selected Date Details */}
				{selectedDateReservations.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-16"
					>
						<Box className="p-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
							<Typography className="font-semibold mb-12 flex items-center gap-8">
								<FuseSvgIcon size={20} className="text-purple-600">
									heroicons-outline:calendar
								</FuseSvgIcon>
								{selectedDate.toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</Typography>
							<Box className="flex flex-col gap-8">
								{selectedDateReservations.map((reservation, idx) => (
									<Box
										key={idx}
										className="flex items-center gap-12 p-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
									>
										<Avatar className="w-32 h-32 bg-purple-600">
											<FuseSvgIcon className="text-white" size={20}>
												heroicons-outline:user
											</FuseSvgIcon>
										</Avatar>
										<Box className="flex-1">
											<Typography className="text-sm font-medium">
												Booking #{reservation.paymentResult?.reference || reservation.id}
											</Typography>
											<Typography className="text-xs text-gray-500">
												{new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
											</Typography>
										</Box>
										<Chip
											size="small"
											label={reservation.isPaid ? 'Paid' : 'Pending'}
											color={reservation.isPaid ? 'success' : 'warning'}
											className="text-xs"
										/>
									</Box>
								))}
							</Box>
						</Box>
					</motion.div>
				)}
			</Box>
		</Paper>
	);
}

export default memo(ReservationsCalendar);
