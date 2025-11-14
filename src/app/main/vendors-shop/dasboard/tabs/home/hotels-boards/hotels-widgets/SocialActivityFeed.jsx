import { memo } from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * SocialActivityFeed - Beautiful activity feed showing merchant social activities
 */
function SocialActivityFeed({ merchantData }) {
	// Sample activity data - this would come from your actual data source
	const activities = [
		{
			id: 1,
			type: 'booking',
			title: 'New Booking Received',
			description: 'Guest booked Suite 305 for 3 nights',
			time: '2 hours ago',
			icon: 'heroicons-outline:calendar',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50 dark:bg-blue-900/20'
		},
		{
			id: 2,
			type: 'review',
			title: 'New Review',
			description: '⭐⭐⭐⭐⭐ "Amazing stay! Highly recommended"',
			time: '5 hours ago',
			icon: 'heroicons-outline:star',
			color: 'text-yellow-600',
			bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
		},
		{
			id: 3,
			type: 'checkin',
			title: 'Guest Check-in',
			description: 'Room 202 - Family of 4',
			time: '8 hours ago',
			icon: 'heroicons-outline:login',
			color: 'text-green-600',
			bgColor: 'bg-green-50 dark:bg-green-900/20'
		},
		{
			id: 4,
			type: 'message',
			title: 'New Message',
			description: 'Guest inquiry about late checkout',
			time: '1 day ago',
			icon: 'heroicons-outline:chat-alt',
			color: 'text-purple-600',
			bgColor: 'bg-purple-50 dark:bg-purple-900/20'
		},
		{
			id: 5,
			type: 'payment',
			title: 'Payment Received',
			description: '₦45,000 for booking #BK2024001',
			time: '1 day ago',
			icon: 'heroicons-outline:cash',
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
		},
		{
			id: 6,
			type: 'checkout',
			title: 'Guest Check-out',
			description: 'Room 101 - Successful stay',
			time: '2 days ago',
			icon: 'heroicons-outline:logout',
			color: 'text-orange-600',
			bgColor: 'bg-orange-50 dark:bg-orange-900/20'
		},
		{
			id: 7,
			type: 'maintenance',
			title: 'Maintenance Complete',
			description: 'AC repair in Room 404',
			time: '2 days ago',
			icon: 'heroicons-outline:wrench',
			color: 'text-gray-600',
			bgColor: 'bg-gray-50 dark:bg-gray-900/20'
		},
		{
			id: 8,
			type: 'social',
			title: 'Instagram Post',
			description: 'New photo shared - Pool sunset view',
			time: '3 days ago',
			icon: 'heroicons-outline:photograph',
			color: 'text-pink-600',
			bgColor: 'bg-pink-50 dark:bg-pink-900/20'
		}
	];

	const container = {
		show: {
			transition: {
				staggerChildren: 0.05
			}
		}
	};

	const item = {
		hidden: { opacity: 0, x: 20 },
		show: { opacity: 1, x: 0 }
	};

	return (
		<Paper className="flex flex-col shadow rounded-2xl overflow-hidden h-full max-h-[800px]">
			{/* Header */}
			<Box className="p-16 bg-gradient-to-r from-purple-500 to-pink-600 flex-shrink-0">
				<Box className="flex items-center gap-12">
					<Box className="flex items-center justify-center w-40 h-40 rounded-full bg-white/20">
						<FuseSvgIcon
							className="text-white"
							size={24}
						>
							heroicons-outline:lightning-bolt
						</FuseSvgIcon>
					</Box>
					<Box>
						<Typography className="text-white font-bold text-lg">Activity Feed</Typography>
						<Typography className="text-white/80 text-xs">Recent merchant activities</Typography>
					</Box>
				</Box>
			</Box>

			{/* Activity List - Scrollable */}
			<Box className="flex-1 overflow-y-auto overflow-x-hidden p-16 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="flex flex-col gap-12"
				>
					{activities.map((activity, index) => (
						<motion.div
							key={activity.id}
							variants={item}
						>
							<Box className="flex gap-12">
								{/* Activity Icon */}
								<Box
									className={`flex-shrink-0 flex items-center justify-center w-40 h-40 rounded-full ${activity.bgColor}`}
								>
									<FuseSvgIcon
										className={activity.color}
										size={20}
									>
										{activity.icon}
									</FuseSvgIcon>
								</Box>

								{/* Activity Content */}
								<Box className="flex-1 min-w-0">
									<Typography className="text-sm font-semibold truncate">{activity.title}</Typography>
									<Typography className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
										{activity.description}
									</Typography>
									<Typography className="text-xs text-gray-400 mt-4">{activity.time}</Typography>
								</Box>
							</Box>
							{index < activities.length - 1 && <Divider className="mt-12" />}
						</motion.div>
					))}
				</motion.div>
			</Box>

			{/* Footer Stats */}
			<Box className="p-16 bg-gray-50 dark:bg-gray-800/50 border-t flex-shrink-0">
				<Box className="flex items-center justify-between">
					<Box className="text-center flex-1">
						<Typography className="text-lg font-bold text-blue-600">
							{activities.filter((a) => a.type === 'booking').length}
						</Typography>
						<Typography className="text-xs text-gray-500">Bookings</Typography>
					</Box>
					<Divider
						orientation="vertical"
						flexItem
					/>
					<Box className="text-center flex-1">
						<Typography className="text-lg font-bold text-green-600">
							{activities.filter((a) => a.type === 'checkin').length}
						</Typography>
						<Typography className="text-xs text-gray-500">Check-ins</Typography>
					</Box>
					<Divider
						orientation="vertical"
						flexItem
					/>
					<Box className="text-center flex-1">
						<Typography className="text-lg font-bold text-yellow-600">
							{activities.filter((a) => a.type === 'review').length}
						</Typography>
						<Typography className="text-xs text-gray-500">Reviews</Typography>
					</Box>
				</Box>
			</Box>
		</Paper>
	);
}

export default memo(SocialActivityFeed);
