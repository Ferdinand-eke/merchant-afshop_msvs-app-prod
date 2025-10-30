import { memo, useState, useEffect } from 'react';
import { Paper, Typography, Box, Chip, IconButton, Avatar, Grid, Card, CardContent, Skeleton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import useInspectionSchedules from 'app/configs/data/server-calls/propertyprofile/useInspectionSchedules';
import InspectionDetailsSlider from './InspectionDetailsSlider';

/**
 * InspectionSchedulesTab - Shows inspection schedules with stats and calendar
 */
function InspectionSchedulesTab() {
	const { data: schedulesData, isLoading } = useInspectionSchedules();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(null);
	const [isSliderOpen, setIsSliderOpen] = useState(false);

	// Load slider state from localStorage on mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedDate = window.localStorage.getItem('inspectionSelectedDate');
			const savedSliderState = window.localStorage.getItem('inspectionSliderOpen');

			if (savedDate && savedSliderState === 'true') {
				setSelectedDate(new Date(savedDate));
				setIsSliderOpen(true);
			}
		}
	}, []);

	// Persist slider state to localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (selectedDate && isSliderOpen) {
				window.localStorage.setItem('inspectionSelectedDate', selectedDate.toISOString());
				window.localStorage.setItem('inspectionSliderOpen', 'true');
			} else if (!isSliderOpen) {
				window.localStorage.removeItem('inspectionSelectedDate');
				window.localStorage.removeItem('inspectionSliderOpen');
			}
		}
	}, [selectedDate, isSliderOpen]);

	const schedules = schedulesData?.data?.payload || [];

	// Calculate stats
	const totalInspections = schedules.length;
	const upcomingInspections = schedules.filter(s => new Date(s.scheduledDate) >= new Date()).length;
	const completedInspections = schedules.filter(s => s.status === 'COMPLETED').length;
	const pendingInspections = schedules.filter(s => s.status === 'PENDING').length;

	// Get calendar data
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const today = new Date();
	today.setHours(0, 0, 0, 0);

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
		setCurrentDate(new Date());
	};

	// Get inspections for a specific date
	const getInspectionsForDate = (date) => {
		return schedules.filter(schedule => {
			const scheduleDate = new Date(schedule.scheduledDate);
			scheduleDate.setHours(0, 0, 0, 0);
			date.setHours(0, 0, 0, 0);
			return scheduleDate.getTime() === date.getTime();
		});
	};

	// Generate calendar days
	const calendarDays = [];
	for (let i = 0; i < startingDayOfWeek; i++) {
		calendarDays.push(null);
	}
	for (let day = 1; day <= daysInMonth; day++) {
		calendarDays.push(day);
	}

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Recent activity notifications
	const recentActivities = schedules
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 10);

	const handleDateClick = (date) => {
		const inspections = getInspectionsForDate(date);
		if (inspections.length > 0) {
			setSelectedDate(date);
			setIsSliderOpen(true);
		}
	};

	const handleCloseSlider = () => {
		setIsSliderOpen(false);
		setSelectedDate(null);
	};

	if (isLoading) {
		return (
			<Box className="w-full">
				<Grid container spacing={2} className="mb-24">
					{[1, 2, 3, 4].map((i) => (
						<Grid item xs={12} sm={6} md={3} key={i}>
							<Skeleton variant="rectangular" height={120} className="rounded-xl" />
						</Grid>
					))}
				</Grid>
				<Skeleton variant="rectangular" height={600} className="rounded-2xl" />
			</Box>
		);
	}

	return (
		<Box className="w-full">
			{/* Stats Section */}
			<Grid container spacing={2} className="mb-24">
				<Grid item xs={12} sm={6} md={3}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Total Inspections</Typography>
										<Typography className="text-3xl font-bold mt-8">{totalInspections}</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon className="text-white" size={24}>heroicons-outline:calendar</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Upcoming</Typography>
										<Typography className="text-3xl font-bold mt-8">{upcomingInspections}</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon className="text-white" size={24}>heroicons-outline:clock</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Completed</Typography>
										<Typography className="text-3xl font-bold mt-8">{completedInspections}</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon className="text-white" size={24}>heroicons-outline:check-circle</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
							<CardContent>
								<Box className="flex items-center justify-between">
									<Box>
										<Typography className="text-sm opacity-90">Pending</Typography>
										<Typography className="text-3xl font-bold mt-8">{pendingInspections}</Typography>
									</Box>
									<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
										<FuseSvgIcon className="text-white" size={24}>heroicons-outline:exclamation</FuseSvgIcon>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>
			</Grid>

			{/* Calendar and Activity Section */}
			<Box className="flex flex-col lg:flex-row gap-16">
				{/* Calendar - 70% width */}
				<Paper className="flex-1 lg:w-[70%] shadow rounded-2xl overflow-hidden" sx={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
					{/* Calendar Header */}
					<Box className="flex items-center justify-between p-16 bg-gradient-to-r from-blue-500 to-purple-600">
						<Box className="flex items-center gap-12">
							<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-white/20">
								<FuseSvgIcon className="text-white" size={24}>heroicons-outline:calendar</FuseSvgIcon>
							</Box>
							<Typography className="text-white font-bold text-lg">Inspection Calendar</Typography>
						</Box>
						<Box className="flex items-center gap-8">
							<IconButton onClick={goToPreviousMonth} size="small" className="text-white">
								<FuseSvgIcon size={20}>heroicons-outline:chevron-left</FuseSvgIcon>
							</IconButton>
							<Typography className="text-white font-semibold min-w-[150px] text-center">
								{monthNames[month]} {year}
							</Typography>
							<IconButton onClick={goToNextMonth} size="small" className="text-white">
								<FuseSvgIcon size={20}>heroicons-outline:chevron-right</FuseSvgIcon>
							</IconButton>
						</Box>
						<Chip
							label="Today"
							onClick={goToToday}
							size="small"
							className="bg-white text-blue-600 hover:bg-white/90 cursor-pointer"
						/>
					</Box>

					<Box className="flex-1 overflow-y-auto p-16">
						{/* Day Names */}
						<Box className="grid grid-cols-7 gap-4 mb-8">
							{dayNames.map(day => (
								<Box key={day} className="text-center">
									<Typography className="text-xs font-semibold text-gray-500">{day}</Typography>
								</Box>
							))}
						</Box>

						{/* Calendar Grid */}
						<Box className="grid grid-cols-7 gap-4">
							{calendarDays.map((day, index) => {
								if (!day) return <Box key={`empty-${index}`} />;

								const date = new Date(year, month, day);
								const isToday = date.toDateString() === today.toDateString();
								const isPast = date < today;
								const dayInspections = getInspectionsForDate(date);
								const hasInspections = dayInspections.length > 0;

								return (
									<motion.div
										key={day}
										whileHover={{ scale: hasInspections ? 1.05 : 1 }}
										whileTap={{ scale: hasInspections ? 0.95 : 1 }}
									>
										<Box
											onClick={() => handleDateClick(date)}
											className={`
												relative p-8 rounded-lg transition-all min-h-[70px]
												${hasInspections ? 'cursor-pointer' : ''}
												${isToday ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' : ''}
												${!isToday && hasInspections ? 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30' : ''}
												${!isToday && !hasInspections ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
												${isPast && !isToday ? 'opacity-60' : ''}
											`}
										>
											<Typography className={`text-center text-sm font-medium ${isToday ? 'text-blue-600 font-bold' : ''}`}>
												{day}
											</Typography>
											{hasInspections && (
												<Box className="flex justify-center mt-4">
													<Box className="w-20 h-20 rounded-full flex items-center justify-center text-[10px] font-bold bg-purple-600 text-white">
														{dayInspections.length}
													</Box>
												</Box>
											)}
										</Box>
									</motion.div>
								);
							})}
						</Box>
					</Box>
				</Paper>

				{/* Activity Notifications - 30% width */}
				<Paper className="lg:w-[30%] shadow rounded-2xl overflow-hidden" sx={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
					<Box className="p-16 bg-gradient-to-r from-purple-500 to-pink-600">
						<Box className="flex items-center gap-12">
							<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-white/20">
								<FuseSvgIcon className="text-white" size={24}>heroicons-outline:bell</FuseSvgIcon>
							</Box>
							<Typography className="text-white font-bold text-lg">Recent Activity</Typography>
						</Box>
					</Box>

					<Box className="overflow-y-auto p-16 h-full scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-gray-800">
						{recentActivities.length === 0 ? (
							<Box className="flex flex-col items-center justify-center h-full text-center">
								<FuseSvgIcon className="text-gray-400" size={48}>heroicons-outline:calendar</FuseSvgIcon>
								<Typography className="text-gray-500 mt-16">No recent activities</Typography>
							</Box>
						) : (
							<Box className="flex flex-col gap-12">
								{recentActivities.map((activity, idx) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.05 }}
									>
										<Box className="p-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg hover:shadow-md transition-shadow">
											<Box className="flex items-start gap-12">
												<Avatar className="w-32 h-32 bg-purple-600">
													<FuseSvgIcon className="text-white" size={20}>heroicons-outline:user</FuseSvgIcon>
												</Avatar>
												<Box className="flex-1">
													<Typography className="text-sm font-medium">
														{activity.customerName || 'Customer'}
													</Typography>
													<Typography className="text-xs text-gray-500 mt-4">
														{new Date(activity.scheduledDate).toLocaleDateString('en-US', {
															month: 'short',
															day: 'numeric',
															hour: '2-digit',
															minute: '2-digit'
														})}
													</Typography>
													<Chip
														size="small"
														label={activity.status}
														className="mt-8"
														color={activity.status === 'COMPLETED' ? 'success' : activity.status === 'PENDING' ? 'warning' : 'default'}
													/>
												</Box>
											</Box>
										</Box>
									</motion.div>
								))}
							</Box>
						)}
					</Box>
				</Paper>
			</Box>

			{/* Inspection Details Slider */}
			<InspectionDetailsSlider
				open={isSliderOpen}
				onClose={handleCloseSlider}
				selectedDate={selectedDate}
				inspections={selectedDate ? getInspectionsForDate(selectedDate) : []}
			/>
		</Box>
	);
}

export default memo(InspectionSchedulesTab);
