import { memo } from 'react';
import { Drawer, Typography, Box, IconButton, Chip, Avatar, Divider, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * InspectionDetailsSlider - Slider showing inspection details for a selected date
 */
function InspectionDetailsSlider({ open, onClose, selectedDate, inspections }) {
	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '90%', sm: '70%', md: '50%', lg: '40%' },
					maxWidth: '600px'
				}
			}}
		>
			<Box className="h-full flex flex-col">
				{/* Header */}
				<Box className="p-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
					<Box className="flex items-center justify-between mb-12">
						<Typography className="text-xl font-bold">Inspection Details</Typography>
						<IconButton onClick={onClose} size="small" className="text-white">
							<FuseSvgIcon size={24}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Box>
					{selectedDate && (
						<Box className="flex items-center gap-12">
							<Box className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
								<FuseSvgIcon className="text-white" size={24}>heroicons-outline:calendar</FuseSvgIcon>
							</Box>
							<Box>
								<Typography className="text-sm opacity-90">Selected Date</Typography>
								<Typography className="text-lg font-semibold">
									{selectedDate.toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</Typography>
							</Box>
						</Box>
					)}
				</Box>

				{/* Content */}
				<Box className="flex-1 overflow-y-auto p-20 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-gray-800">
					{inspections.length === 0 ? (
						<Box className="flex flex-col items-center justify-center h-full text-center">
							<FuseSvgIcon className="text-gray-400" size={64}>heroicons-outline:calendar</FuseSvgIcon>
							<Typography className="text-gray-500 mt-16 text-lg">
								No inspections scheduled for this date
							</Typography>
						</Box>
					) : (
						<Box className="flex flex-col gap-16">
							<Box className="mb-12">
								<Typography className="text-lg font-semibold mb-8">
									{inspections.length} Inspection{inspections.length !== 1 ? 's' : ''} Scheduled
								</Typography>
								<Divider />
							</Box>

							{inspections.map((inspection, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.1 }}
								>
									<Paper className="p-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-lg transition-shadow">
										{/* Time Slot */}
										<Box className="flex items-center gap-12 mb-16">
											<Box className="w-48 h-48 rounded-full bg-blue-600 flex items-center justify-center">
												<FuseSvgIcon className="text-white" size={24}>heroicons-outline:clock</FuseSvgIcon>
											</Box>
											<Box>
												<Typography className="text-xs text-gray-500">Time Slot</Typography>
												<Typography className="text-lg font-semibold">
													{inspection.timeSlot || new Date(inspection.scheduledDate).toLocaleTimeString('en-US', {
														hour: '2-digit',
														minute: '2-digit'
													})}
												</Typography>
											</Box>
										</Box>

										<Divider className="my-12" />

										{/* Customer Information */}
										<Box className="mb-16">
											<Typography className="text-sm font-semibold text-gray-600 mb-8">Customer Details</Typography>
											<Box className="flex items-center gap-12 mb-12">
												<Avatar className="w-40 h-40 bg-purple-600">
													<FuseSvgIcon className="text-white" size={20}>heroicons-outline:user</FuseSvgIcon>
												</Avatar>
												<Box>
													<Typography className="text-base font-medium">
														{inspection.customerName || 'N/A'}
													</Typography>
													<Typography className="text-sm text-gray-500">
														{inspection.customerEmail || 'No email provided'}
													</Typography>
												</Box>
											</Box>
											{inspection.customerPhone && (
												<Box className="flex items-center gap-8 ml-52">
													<FuseSvgIcon size={16} className="text-gray-500">heroicons-outline:phone</FuseSvgIcon>
													<Typography className="text-sm">{inspection.customerPhone}</Typography>
												</Box>
											)}
										</Box>

										<Divider className="my-12" />

										{/* Property Information */}
										{inspection.propertyId && (
											<>
												<Box className="mb-16">
													<Typography className="text-sm font-semibold text-gray-600 mb-8">Property</Typography>
													<Box className="flex items-center gap-8">
														<FuseSvgIcon size={16} className="text-gray-500">heroicons-outline:home</FuseSvgIcon>
														<Typography className="text-sm">{inspection.propertyTitle || inspection.propertyId}</Typography>
													</Box>
												</Box>
												<Divider className="my-12" />
											</>
										)}

										{/* Status */}
										<Box className="mb-16">
											<Typography className="text-sm font-semibold text-gray-600 mb-8">Status</Typography>
											<Chip
												label={inspection.status || 'PENDING'}
												color={
													inspection.status === 'COMPLETED' ? 'success' :
													inspection.status === 'CANCELLED' ? 'error' :
													inspection.status === 'CONFIRMED' ? 'info' :
													'warning'
												}
												size="small"
											/>
										</Box>

										{/* Notes */}
										{inspection.notes && (
											<>
												<Divider className="my-12" />
												<Box>
													<Typography className="text-sm font-semibold text-gray-600 mb-8">Notes</Typography>
													<Typography className="text-sm text-gray-700 bg-white dark:bg-gray-800 p-12 rounded-lg">
														{inspection.notes}
													</Typography>
												</Box>
											</>
										)}

										{/* Metadata */}
										<Box className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
											<Box className="flex items-center justify-between text-xs text-gray-500">
												<Box className="flex items-center gap-4">
													<FuseSvgIcon size={12}>heroicons-outline:information-circle</FuseSvgIcon>
													<Typography className="text-xs">
														Created: {new Date(inspection.createdAt || inspection.scheduledDate).toLocaleDateString()}
													</Typography>
												</Box>
												{inspection.id && (
													<Typography className="text-xs">ID: {inspection.id.slice(0, 8)}</Typography>
												)}
											</Box>
										</Box>
									</Paper>
								</motion.div>
							))}
						</Box>
					)}
				</Box>
			</Box>
		</Drawer>
	);
}

export default memo(InspectionDetailsSlider);
