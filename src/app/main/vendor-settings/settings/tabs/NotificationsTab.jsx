import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import _ from '@lodash';
import { Box, Paper, IconButton, Tooltip, Divider } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from '../SettingsApi';

const defaultValues = {
	communication: false,
	security: false,
	meetups: false,
	comments: false,
	mention: false,
	follow: false,
	inquiry: false
};
/**
 * Form Validation Schema
 */
const schema = z.object({
	communication: z.boolean(),
	security: z.boolean(),
	meetups: z.boolean(),
	comments: z.boolean(),
	mention: z.boolean(),
	follow: z.boolean(),
	inquiry: z.boolean()
});

function NotificationsTab() {
	const { data: notificationSettings } = useGetNotificationSettingsQuery();
	const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();
	const { control, watch, reset, handleSubmit, formState, setValue, getValues } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	// useEffect(() => {
	// 	reset(notificationSettings);
	// }, [notificationSettings, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData) {
		// return
		// updateNotificationSettings(formData);
	}

	const handleEnableAll = () => {
		Object.keys(defaultValues).forEach((key) => {
			setValue(key, true, { shouldDirty: true });
		});
	};

	const handleDisableAll = () => {
		Object.keys(defaultValues).forEach((key) => {
			setValue(key, false, { shouldDirty: true });
		});
	};

	const notificationCategories = [
		{
			title: 'System Alerts',
			description: 'Important updates about your account and platform',
			icon: 'heroicons-outline:bell',
			color: '#3b82f6',
			notifications: [
				{
					key: 'communication',
					label: 'Platform Communications',
					description: 'Get news, announcements, product updates, and feature releases',
					icon: 'heroicons-outline:megaphone'
				},
				{
					key: 'security',
					label: 'Security Alerts',
					description: 'Critical notifications about account security and suspicious activity',
					icon: 'heroicons-outline:shield-check',
					recommended: true
				},
				{
					key: 'meetups',
					label: 'Nearby Meetups',
					description: 'Get notified when merchant meetups or events are happening near you',
					icon: 'heroicons-outline:map'
				}
			]
		},
		{
			title: 'Business Activity',
			description: 'Stay updated on customer interactions and engagement',
			icon: 'heroicons-outline:chart-bar',
			color: '#f97316',
			notifications: [
				{
					key: 'inquiry',
					label: 'Customer Inquiries',
					description: 'Instant alerts when customers ask about your products or services',
					icon: 'heroicons-outline:chat-bubble-left-right',
					recommended: true
				},
				{
					key: 'comments',
					label: 'Product Comments',
					description: 'Get notified when customers leave comments or reviews on your products',
					icon: 'heroicons-outline:chat-bubble-bottom-center-text'
				},
				{
					key: 'mention',
					label: 'Mentions',
					description: 'Know when someone mentions your shop in comments or discussions',
					icon: 'heroicons-outline:at-symbol'
				},
				{
					key: 'follow',
					label: 'New Followers',
					description: 'Celebrate when customers follow your shop for updates',
					icon: 'heroicons-outline:user-plus'
				}
			]
		}
	];

	return (
		<Box className="w-full max-w-4xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							mb: 3,
							background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
							border: '1px solid rgba(234, 88, 12, 0.1)',
							borderRadius: 2
						}}
					>
						<Box className="flex items-center justify-between">
							<Box className="flex items-center gap-12">
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: '12px',
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
									}}
								>
									<FuseSvgIcon
										className="text-white"
										size={24}
									>
										heroicons-outline:bell
									</FuseSvgIcon>
								</Box>
								<Box>
									<Typography
										variant="h6"
										className="font-bold"
										sx={{ color: '#292524', mb: 0.5 }}
									>
										Notification Preferences
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#78716c' }}
									>
										Manage how and when you receive notifications
									</Typography>
								</Box>
							</Box>

							{/* Quick Actions */}
							<Box className="flex items-center gap-8">
								<Tooltip title="Enable all notifications">
									<IconButton
										size="small"
										onClick={handleEnableAll}
										sx={{
											color: '#16a34a',
											'&:hover': {
												background: 'rgba(22, 163, 74, 0.08)'
											}
										}}
									>
										<FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>
									</IconButton>
								</Tooltip>
								<Tooltip title="Disable all notifications">
									<IconButton
										size="small"
										onClick={handleDisableAll}
										sx={{
											color: '#dc2626',
											'&:hover': {
												background: 'rgba(220, 38, 38, 0.08)'
											}
										}}
									>
										<FuseSvgIcon size={20}>heroicons-outline:x-circle</FuseSvgIcon>
									</IconButton>
								</Tooltip>
							</Box>
						</Box>

						{/* Info Alert */}
						<Paper
							elevation={0}
							sx={{
								p: 2,
								mt: 3,
								background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
								border: '1px solid rgba(59, 130, 246, 0.2)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-start gap-12">
								<FuseSvgIcon
									size={18}
									sx={{ color: '#3b82f6', mt: 0.25 }}
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Box>
									<Typography
										variant="body2"
										sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
									>
										Notification Delivery
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#57534e', lineHeight: 1.6 }}
									>
										Notifications are sent via email and displayed in your dashboard. We recommend keeping
										Security Alerts and Customer Inquiries enabled for optimal business management.
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Paper>
				</motion.div>

				{/* Notification Categories */}
				<Box className="grid gap-24">
					{notificationCategories.map((category, categoryIndex) => (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 + categoryIndex * 0.1 }}
						>
							<Paper
								elevation={0}
								sx={{
									p: 4,
									background: 'linear-gradient(135deg, #ffffff 0%, #fafaf9 100%)',
									border: '1px solid rgba(120, 113, 108, 0.1)',
									borderRadius: 2,
									overflow: 'hidden'
								}}
							>
								{/* Category Header */}
								<Box className="flex items-center gap-12 mb-24">
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: '10px',
											background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}25 100%)`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											border: `1px solid ${category.color}30`
										}}
									>
										<FuseSvgIcon
											size={20}
											sx={{ color: category.color }}
										>
											{category.icon}
										</FuseSvgIcon>
									</Box>
									<Box>
										<Typography
											variant="h6"
											sx={{ color: '#292524', fontWeight: 700, mb: 0.25 }}
										>
											{category.title}
										</Typography>
										<Typography
											variant="caption"
											sx={{ color: '#78716c' }}
										>
											{category.description}
										</Typography>
									</Box>
								</Box>

								<Divider sx={{ mb: 3 }} />

								{/* Notification Items */}
								<Box className="grid gap-16">
									{category.notifications.map((notification, index) => (
										<Controller
											key={notification.key}
											name={notification.key}
											control={control}
											render={({ field: { onChange, value } }) => (
												<Box
													sx={{
														p: 2,
														borderRadius: 1.5,
														background: 'rgba(249, 115, 22, 0.02)',
														border: '1px solid rgba(234, 88, 12, 0.06)',
														transition: 'all 0.2s',
														'&:hover': {
															background: 'rgba(249, 115, 22, 0.04)',
															border: '1px solid rgba(234, 88, 12, 0.12)'
														}
													}}
												>
													<Box className="flex items-center justify-between">
														<Box className="flex items-start gap-12 flex-1">
															<Box
																sx={{
																	width: 36,
																	height: 36,
																	borderRadius: '8px',
																	background: value
																		? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
																		: 'rgba(120, 113, 108, 0.08)',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	transition: 'all 0.3s',
																	mt: 0.5
																}}
															>
																<FuseSvgIcon
																	size={18}
																	sx={{
																		color: value ? 'white' : '#78716c'
																	}}
																>
																	{notification.icon}
																</FuseSvgIcon>
															</Box>
															<Box className="flex-1">
																<Box className="flex items-center gap-8">
																	<Typography
																		variant="body2"
																		sx={{ color: '#292524', fontWeight: 600 }}
																	>
																		{notification.label}
																	</Typography>
																	{notification.recommended && (
																		<Box
																			sx={{
																				px: 1,
																				py: 0.25,
																				borderRadius: 0.75,
																				background: 'linear-gradient(135deg, #16a34a15 0%, #16a34a25 100%)',
																				border: '1px solid #16a34a40'
																			}}
																		>
																			<Typography
																				variant="caption"
																				sx={{
																					color: '#16a34a',
																					fontWeight: 700,
																					fontSize: '0.65rem'
																				}}
																			>
																				RECOMMENDED
																			</Typography>
																		</Box>
																	)}
																</Box>
																<Typography
																	variant="caption"
																	sx={{
																		color: '#78716c',
																		display: 'block',
																		mt: 0.5,
																		lineHeight: 1.5
																	}}
																>
																	{notification.description}
																</Typography>
															</Box>
														</Box>

														<FormControlLabel
															control={
																<Switch
																	checked={value}
																	onChange={(ev) => {
																		onChange(ev.target.checked);
																	}}
																	sx={{
																		'& .MuiSwitch-switchBase.Mui-checked': {
																			color: '#f97316'
																		},
																		'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
																			backgroundColor: '#ea580c'
																		}
																	}}
																/>
															}
															label=""
															sx={{ m: 0 }}
														/>
													</Box>
												</Box>
											)}
										/>
									))}
								</Box>
							</Paper>
						</motion.div>
					))}
				</Box>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							mt: 3,
							background: 'rgba(249, 115, 22, 0.03)',
							border: '1px solid rgba(234, 88, 12, 0.1)',
							borderRadius: 2
						}}
					>
						<Box className="flex flex-col sm:flex-row items-center justify-between gap-16">
							<Box className="flex items-center gap-12">
								<FuseSvgIcon
									size={20}
									sx={{ color: '#78716c' }}
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Typography
									variant="body2"
									sx={{ color: '#78716c' }}
								>
									{_.isEmpty(dirtyFields)
										? 'No changes made yet'
										: `${Object.keys(dirtyFields).length} notification preference${
												Object.keys(dirtyFields).length > 1 ? 's' : ''
										  } updated`}
								</Typography>
							</Box>

							<Box className="flex items-center gap-12">
								<Button
									variant="outlined"
									disabled={_.isEmpty(dirtyFields)}
									onClick={() => reset()}
									sx={{
										color: '#78716c',
										borderColor: 'rgba(120, 113, 108, 0.3)',
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#78716c',
											background: 'rgba(120, 113, 108, 0.04)'
										}
									}}
								>
									Reset
								</Button>
								<Button
									variant="contained"
									disabled={_.isEmpty(dirtyFields) || !isValid}
									type="submit"
									startIcon={<FuseSvgIcon size={18}>heroicons-outline:check-circle</FuseSvgIcon>}
									sx={{
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										color: 'white',
										fontWeight: 700,
										textTransform: 'none',
										px: 4,
										py: 1.25,
										boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
										'&:hover': {
											background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
											boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)'
										},
										'&:disabled': {
											background: 'rgba(120, 113, 108, 0.12)',
											color: 'rgba(120, 113, 108, 0.38)',
											boxShadow: 'none'
										}
									}}
								>
									Save Preferences
								</Button>
							</Box>
						</Box>
					</Paper>
				</motion.div>
			</form>
		</Box>
	);
}

export default NotificationsTab;
