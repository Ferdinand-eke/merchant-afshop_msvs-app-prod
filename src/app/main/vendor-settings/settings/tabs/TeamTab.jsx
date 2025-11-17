import { useState, useCallback, useMemo } from 'react';
import {
	Box,
	Paper,
	Typography,
	Button,
	Avatar,
	Chip,
	IconButton,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Divider,
	InputAdornment,
	Tooltip,
	Checkbox,
	FormControlLabel,
	Alert,
	Card,
	CardContent,
	Grid,
	Tab,
	Tabs,
	CircularProgress,
	Snackbar
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from '@lodash';

// Staff roles with detailed permissions
const staffRoles = [
	{
		value: 'owner',
		label: 'Owner',
		color: '#7c3aed',
		icon: 'heroicons-outline:shield-check',
		description: 'Full access to all features and settings',
		permissions: [
			'Manage all products and inventory',
			'Process orders and refunds',
			'Manage staff and roles',
			'Access financial reports',
			'Modify account settings',
			'Delete account'
		]
	},
	{
		value: 'manager',
		label: 'Manager',
		color: '#f97316',
		icon: 'heroicons-outline:user-group',
		description: 'Can manage operations and staff',
		permissions: [
			'Manage products and inventory',
			'Process orders and refunds',
			'View staff members',
			'Access sales reports',
			'Manage branch operations'
		]
	},
	{
		value: 'sales',
		label: 'Sales Associate',
		color: '#3b82f6',
		icon: 'heroicons-outline:shopping-cart',
		description: 'Can handle sales and customer service',
		permissions: [
			'Process sales via POS',
			'View product inventory',
			'Handle customer inquiries',
			'View order history',
			'Generate sales receipts'
		]
	},
	{
		value: 'inventory',
		label: 'Inventory Manager',
		color: '#10b981',
		icon: 'heroicons-outline:cube',
		description: 'Can manage products and stock',
		permissions: [
			'Add and edit products',
			'Manage inventory levels',
			'Track stock movements',
			'Generate inventory reports',
			'Receive shipments'
		]
	},
	{
		value: 'viewer',
		label: 'Viewer',
		color: '#78716c',
		icon: 'heroicons-outline:eye',
		description: 'Read-only access to data',
		permissions: ['View products', 'View orders', 'View basic reports', 'View customer information']
	}
];

// Placeholder data for staff members
const mockStaffMembers = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john.doe@example.com',
		avatar: null,
		role: 'manager',
		status: 'active',
		locations: ['main-branch', 'west-branch'],
		invitedAt: '2024-01-15',
		acceptedAt: '2024-01-16',
		lastActive: '2024-03-10'
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		avatar: null,
		role: 'sales',
		status: 'active',
		locations: ['main-branch'],
		invitedAt: '2024-02-01',
		acceptedAt: '2024-02-01',
		lastActive: '2024-03-11'
	},
	{
		id: '3',
		name: 'Mike Johnson',
		email: 'mike.johnson@example.com',
		avatar: null,
		role: 'inventory',
		status: 'pending',
		locations: ['east-branch'],
		invitedAt: '2024-03-05',
		acceptedAt: null,
		lastActive: null
	}
];

// Placeholder locations (branches)
const mockLocations = [
	{
		id: 'main-branch',
		name: 'Main Store',
		country: 'Nigeria',
		state: 'Lagos',
		county: 'Ikeja',
		district: 'Allen Avenue',
		isHeadquarters: true
	},
	{
		id: 'west-branch',
		name: 'West Branch',
		country: 'Nigeria',
		state: 'Lagos',
		county: 'Victoria Island',
		district: 'Lekki Phase 1',
		isHeadquarters: false
	},
	{
		id: 'east-branch',
		name: 'East Branch',
		country: 'Nigeria',
		state: 'Lagos',
		county: 'Ajah',
		district: 'Abraham Adesanya',
		isHeadquarters: false
	},
	{
		id: 'north-branch',
		name: 'North Outlet',
		country: 'Nigeria',
		state: 'Abuja',
		county: 'FCT',
		district: 'Wuse 2',
		isHeadquarters: false
	}
];

// Validation schema for invite form
const inviteSchema = z.object({
	email: z.string().email('Enter a valid email address').min(1, 'Email is required'),
	name: z.string().min(2, 'Name must be at least 2 characters'),
	role: z.string().min(1, 'Select a role'),
	locations: z.array(z.string()).min(1, 'Select at least one location')
});

function TeamTab() {
	// State management
	const [staffList, setStaffList] = useState(mockStaffMembers);
	const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
	const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState(null);
	const [selectedRole, setSelectedRole] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [tabValue, setTabValue] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	// Form for inviting staff
	const {
		control: inviteControl,
		handleSubmit: handleInviteSubmit,
		formState: inviteFormState,
		reset: resetInviteForm,
		watch: watchInvite
	} = useForm({
		defaultValues: {
			email: '',
			name: '',
			role: '',
			locations: []
		},
		mode: 'all',
		resolver: zodResolver(inviteSchema)
	});

	// Form for editing staff
	const {
		control: editControl,
		handleSubmit: handleEditSubmit,
		formState: editFormState,
		reset: resetEditForm,
		setValue: setEditValue
	} = useForm({
		defaultValues: {
			role: '',
			locations: []
		},
		mode: 'all'
	});

	const selectedRoleWatch = watchInvite('role');
	const roleDetails = staffRoles.find((r) => r.value === selectedRoleWatch);

	// Show snackbar notification
	const showNotification = useCallback((message, severity = 'success') => {
		setSnackbar({ open: true, message, severity });
	}, []);

	// Close snackbar
	const handleCloseSnackbar = useCallback(() => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	}, []);

	// Invite new staff member
	const onInviteSubmit = useCallback(
		(data) => {
			setIsLoading(true);

			// Simulate API call with timeout
			setTimeout(() => {
				const newStaff = {
					id: Date.now().toString(),
					name: data.name,
					email: data.email,
					avatar: null,
					role: data.role,
					status: 'pending',
					locations: data.locations,
					invitedAt: new Date().toISOString().split('T')[0],
					acceptedAt: null,
					lastActive: null
				};

				setStaffList((prev) => [...prev, newStaff]);
				setInviteDialogOpen(false);
				resetInviteForm();
				setIsLoading(false);
				showNotification(`Invitation sent to ${data.email} successfully!`, 'success');
			}, 800);
		},
		[resetInviteForm, showNotification]
	);

	// Edit staff member
	const handleEditStaff = useCallback(
		(staff) => {
			setSelectedStaff(staff);
			setEditValue('role', staff.role);
			setEditValue('locations', staff.locations);
			setEditDialogOpen(true);
		},
		[setEditValue]
	);

	const onEditSubmit = useCallback(
		(data) => {
			setIsLoading(true);

			// Simulate API call
			setTimeout(() => {
				setStaffList((prevList) =>
					prevList.map((staff) =>
						staff.id === selectedStaff.id
							? {
									...staff,
									role: data.role,
									locations: data.locations
							  }
							: staff
					)
				);
				setEditDialogOpen(false);
				setSelectedStaff(null);
				setIsLoading(false);
				showNotification('Staff member updated successfully!', 'success');
			}, 600);
		},
		[selectedStaff, showNotification]
	);

	// Remove staff member
	const handleRemoveClick = useCallback((staff) => {
		setSelectedStaff(staff);
		setRemoveDialogOpen(true);
	}, []);

	const confirmRemoveStaff = useCallback(() => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setStaffList((prevList) => prevList.filter((staff) => staff.id !== selectedStaff.id));
			setRemoveDialogOpen(false);
			setIsLoading(false);
			showNotification(`${selectedStaff.name} has been removed from your team`, 'success');
			setSelectedStaff(null);
		}, 600);
	}, [selectedStaff, showNotification]);

	// Resend invitation
	const handleResendInvite = useCallback(
		(staff) => {
			setIsLoading(true);

			// Simulate API call
			setTimeout(() => {
				setIsLoading(false);
				showNotification(`Invitation resent to ${staff.email}`, 'info');
			}, 500);
		},
		[showNotification]
	);

	// View role permissions
	const handleViewPermissions = useCallback((role) => {
		setSelectedRole(staffRoles.find((r) => r.value === role));
		setPermissionsDialogOpen(true);
	}, []);

	// Filter staff by status and search - Memoized for performance
	const filteredStaff = useMemo(() => {
		return staffList.filter((staff) => {
			const matchesTab =
				tabValue === 0 ||
				(tabValue === 1 && staff.status === 'active') ||
				(tabValue === 2 && staff.status === 'pending');
			const matchesSearch =
				staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				staff.email.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesTab && matchesSearch;
		});
	}, [staffList, tabValue, searchQuery]);

	// Memoize counts for performance
	const { activeCount, pendingCount } = useMemo(() => {
		return {
			activeCount: staffList.filter((s) => s.status === 'active').length,
			pendingCount: staffList.filter((s) => s.status === 'pending').length
		};
	}, [staffList]);

	// Get role badge color - Memoized
	const getRoleBadge = useCallback((roleValue) => {
		return staffRoles.find((r) => r.value === roleValue);
	}, []);

	return (
		<Box className="w-full max-w-5xl">
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
					<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
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
									heroicons-outline:user-group
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Team Management
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Invite and manage staff members across your locations
								</Typography>
							</Box>
						</Box>

						<Button
							variant="contained"
							startIcon={<FuseSvgIcon size={18}>heroicons-outline:user-plus</FuseSvgIcon>}
							onClick={() => setInviteDialogOpen(true)}
							sx={{
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								color: 'white',
								fontWeight: 700,
								textTransform: 'none',
								px: 3,
								py: 1.25,
								boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
								'&:hover': {
									background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
									boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)'
								}
							}}
						>
							Invite Staff
						</Button>
					</Box>

					{/* Stats Cards */}
					<Grid
						container
						spacing={2}
						sx={{ mt: 2 }}
					>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Card
								elevation={0}
								sx={{
									background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
									border: '1px solid rgba(16, 185, 129, 0.2)'
								}}
							>
								<CardContent sx={{ p: 2 }}>
									<Box className="flex items-center justify-between">
										<Box>
											<Typography
												variant="caption"
												sx={{ color: '#78716c', fontWeight: 600 }}
											>
												Total Staff
											</Typography>
											<Typography
												variant="h4"
												sx={{ color: '#10b981', fontWeight: 700 }}
											>
												{staffList.length}
											</Typography>
										</Box>
										<FuseSvgIcon
											size={32}
											sx={{ color: '#10b981', opacity: 0.5 }}
										>
											heroicons-outline:users
										</FuseSvgIcon>
									</Box>
								</CardContent>
							</Card>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Card
								elevation={0}
								sx={{
									background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
									border: '1px solid rgba(59, 130, 246, 0.2)'
								}}
							>
								<CardContent sx={{ p: 2 }}>
									<Box className="flex items-center justify-between">
										<Box>
											<Typography
												variant="caption"
												sx={{ color: '#78716c', fontWeight: 600 }}
											>
												Active Members
											</Typography>
											<Typography
												variant="h4"
												sx={{ color: '#3b82f6', fontWeight: 700 }}
											>
												{activeCount}
											</Typography>
										</Box>
										<FuseSvgIcon
											size={32}
											sx={{ color: '#3b82f6', opacity: 0.5 }}
										>
											heroicons-outline:check-circle
										</FuseSvgIcon>
									</Box>
								</CardContent>
							</Card>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Card
								elevation={0}
								sx={{
									background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
									border: '1px solid rgba(245, 158, 11, 0.2)'
								}}
							>
								<CardContent sx={{ p: 2 }}>
									<Box className="flex items-center justify-between">
										<Box>
											<Typography
												variant="caption"
												sx={{ color: '#78716c', fontWeight: 600 }}
											>
												Pending Invites
											</Typography>
											<Typography
												variant="h4"
												sx={{ color: '#f59e0b', fontWeight: 700 }}
											>
												{pendingCount}
											</Typography>
										</Box>
										<FuseSvgIcon
											size={32}
											sx={{ color: '#f59e0b', opacity: 0.5 }}
										>
											heroicons-outline:clock
										</FuseSvgIcon>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Paper>
			</motion.div>

			{/* Search and Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						background: '#ffffff',
						border: '1px solid rgba(120, 113, 108, 0.1)',
						borderRadius: 2
					}}
				>
					<TextField
						fullWidth
						placeholder="Search by name or email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon
										size={20}
										sx={{ color: '#ea580c' }}
									>
										heroicons-outline:magnifying-glass
									</FuseSvgIcon>
								</InputAdornment>
							)
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								'&:hover fieldset': {
									borderColor: '#f97316'
								},
								'&.Mui-focused fieldset': {
									borderColor: '#ea580c'
								}
							}
						}}
					/>

					<Tabs
						value={tabValue}
						onChange={(e, newValue) => setTabValue(newValue)}
						sx={{
							mt: 2,
							'& .MuiTab-root': {
								textTransform: 'none',
								fontWeight: 600,
								minHeight: 40
							},
							'& .Mui-selected': {
								color: '#ea580c'
							},
							'& .MuiTabs-indicator': {
								backgroundColor: '#ea580c'
							}
						}}
					>
						<Tab
							label={`All Staff (${staffList.length})`}
							icon={<FuseSvgIcon size={16}>heroicons-outline:users</FuseSvgIcon>}
							iconPosition="start"
						/>
						<Tab
							label={`Active (${activeCount})`}
							icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
							iconPosition="start"
						/>
						<Tab
							label={`Pending (${pendingCount})`}
							icon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>}
							iconPosition="start"
						/>
					</Tabs>
				</Paper>
			</motion.div>

			{/* Staff List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<Paper
					elevation={0}
					sx={{
						background: '#ffffff',
						border: '1px solid rgba(120, 113, 108, 0.1)',
						borderRadius: 2,
						overflow: 'hidden'
					}}
				>
					{filteredStaff.length === 0 ? (
						<Box
							sx={{
								p: 8,
								textAlign: 'center'
							}}
						>
							<FuseSvgIcon
								size={64}
								sx={{ color: '#78716c', opacity: 0.3, mb: 2 }}
							>
								heroicons-outline:users
							</FuseSvgIcon>
							<Typography
								variant="h6"
								sx={{ color: '#78716c', mb: 1 }}
							>
								No staff members found
							</Typography>
							<Typography
								variant="body2"
								sx={{ color: '#a8a29e' }}
							>
								{searchQuery
									? 'Try adjusting your search criteria'
									: 'Start by inviting your first team member'}
							</Typography>
						</Box>
					) : (
						<List sx={{ p: 0 }}>
							{filteredStaff.map((staff, index) => {
								const role = getRoleBadge(staff.role);
								const assignedLocations = mockLocations.filter((loc) => staff.locations.includes(loc.id));

								return (
									<Box key={staff.id}>
										<ListItem
											sx={{
												p: 3,
												'&:hover': {
													background: 'rgba(249, 115, 22, 0.02)'
												}
											}}
										>
											<Box className="flex flex-col sm:flex-row items-start sm:items-center gap-16 w-full">
												{/* Avatar and Info */}
												<Box className="flex items-center gap-12 flex-1 min-w-0">
													<Avatar
														sx={{
															width: 48,
															height: 48,
															background: role?.color || '#78716c',
															fontWeight: 700
														}}
													>
														{staff.name
															.split(' ')
															.map((n) => n[0])
															.join('')
															.toUpperCase()}
													</Avatar>
													<Box className="flex-1 min-w-0">
														<Typography
															variant="body1"
															sx={{ color: '#292524', fontWeight: 600, mb: 0.25 }}
														>
															{staff.name}
														</Typography>
														<Typography
															variant="caption"
															sx={{ color: '#78716c', display: 'block', mb: 0.5 }}
														>
															{staff.email}
														</Typography>
														<Box className="flex items-center gap-8 flex-wrap">
															{/* Status Badge */}
															<Chip
																label={staff.status === 'active' ? 'Active' : 'Pending Invite'}
																size="small"
																icon={
																	<FuseSvgIcon size={14}>
																		{staff.status === 'active'
																			? 'heroicons-solid:check-circle'
																			: 'heroicons-solid:clock'}
																	</FuseSvgIcon>
																}
																sx={{
																	background:
																		staff.status === 'active'
																			? 'linear-gradient(135deg, #10b98115 0%, #10b98125 100%)'
																			: 'linear-gradient(135deg, #f59e0b15 0%, #f59e0b25 100%)',
																	border:
																		staff.status === 'active'
																			? '1px solid #10b98140'
																			: '1px solid #f59e0b40',
																	color: staff.status === 'active' ? '#10b981' : '#f59e0b',
																	fontWeight: 600,
																	height: 20,
																	fontSize: '0.7rem'
																}}
															/>
															{/* Role Badge */}
															<Chip
																label={role?.label}
																size="small"
																icon={<FuseSvgIcon size={14}>{role?.icon}</FuseSvgIcon>}
																onClick={() => handleViewPermissions(staff.role)}
																sx={{
																	background: `${role?.color}15`,
																	border: `1px solid ${role?.color}40`,
																	color: role?.color,
																	fontWeight: 600,
																	height: 20,
																	fontSize: '0.7rem',
																	cursor: 'pointer',
																	'&:hover': {
																		background: `${role?.color}25`
																	}
																}}
															/>
															{/* Locations */}
															<Tooltip
																title={assignedLocations.map((loc) => loc.name).join(', ')}
															>
																<Chip
																	label={`${assignedLocations.length} location${assignedLocations.length !== 1 ? 's' : ''}`}
																	size="small"
																	icon={
																		<FuseSvgIcon size={14}>heroicons-solid:map-pin</FuseSvgIcon>
																	}
																	sx={{
																		background: 'rgba(120, 113, 108, 0.08)',
																		border: '1px solid rgba(120, 113, 108, 0.2)',
																		color: '#78716c',
																		fontWeight: 600,
																		height: 20,
																		fontSize: '0.7rem'
																	}}
																/>
															</Tooltip>
														</Box>
													</Box>
												</Box>

												{/* Actions */}
												<Box className="flex items-center gap-8">
													{staff.status === 'pending' && (
														<Tooltip title="Resend invitation">
															<IconButton
																size="small"
																onClick={() => handleResendInvite(staff)}
																sx={{
																	color: '#3b82f6',
																	'&:hover': {
																		background: 'rgba(59, 130, 246, 0.08)'
																	}
																}}
															>
																<FuseSvgIcon size={20}>heroicons-outline:paper-airplane</FuseSvgIcon>
															</IconButton>
														</Tooltip>
													)}
													<Tooltip title="Edit staff">
														<IconButton
															size="small"
															onClick={() => handleEditStaff(staff)}
															sx={{
																color: '#f97316',
																'&:hover': {
																	background: 'rgba(249, 115, 22, 0.08)'
																}
															}}
														>
															<FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
														</IconButton>
													</Tooltip>
													<Tooltip title="Remove staff">
														<IconButton
															size="small"
															onClick={() => handleRemoveClick(staff)}
															sx={{
																color: '#dc2626',
																'&:hover': {
																	background: 'rgba(220, 38, 38, 0.08)'
																}
															}}
														>
															<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
														</IconButton>
													</Tooltip>
												</Box>
											</Box>
										</ListItem>
										{index < filteredStaff.length - 1 && <Divider />}
									</Box>
								);
							})}
						</List>
					)}
				</Paper>
			</motion.div>

			{/* Invite Staff Dialog */}
			<Dialog
				open={inviteDialogOpen}
				onClose={() => setInviteDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2
					}
				}}
			>
				<form onSubmit={handleInviteSubmit(onInviteSubmit)}>
					<DialogTitle sx={{ pb: 2 }}>
						<Box className="flex items-center gap-12">
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: '10px',
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={20}
								>
									heroicons-outline:user-plus
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									sx={{ color: '#292524', fontWeight: 700 }}
								>
									Invite Staff Member
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Send an invitation to join your team
								</Typography>
							</Box>
						</Box>
					</DialogTitle>

					<DialogContent sx={{ pt: 3 }}>
						<Box className="grid gap-24">
							{/* Name Field */}
							<Controller
								name="name"
								control={inviteControl}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Full Name"
										placeholder="Enter staff member's name"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:user
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#f97316'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ea580c'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#ea580c'
											}
										}}
									/>
								)}
							/>

							{/* Email Field */}
							<Controller
								name="email"
								control={inviteControl}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Email Address"
										placeholder="staff@example.com"
										type="email"
										error={!!fieldState.error}
										helperText={fieldState.error?.message || 'An invitation will be sent to this email'}
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:envelope
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#f97316'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ea580c'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#ea580c'
											}
										}}
									/>
								)}
							/>

							{/* Role Selection */}
							<Controller
								name="role"
								control={inviteControl}
								render={({ field, fieldState }) => (
									<FormControl
										fullWidth
										error={!!fieldState.error}
									>
										<InputLabel
											sx={{
												'&.Mui-focused': {
													color: '#ea580c'
												}
											}}
										>
											Role
										</InputLabel>
										<Select
											{...field}
											label="Role"
											sx={{
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#f97316'
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#ea580c'
												}
											}}
										>
											{staffRoles
												.filter((r) => r.value !== 'owner')
												.map((role) => (
													<MenuItem
														key={role.value}
														value={role.value}
													>
														<Box className="flex items-center gap-12">
															<FuseSvgIcon
																size={20}
																sx={{ color: role.color }}
															>
																{role.icon}
															</FuseSvgIcon>
															<Box>
																<Typography
																	variant="body2"
																	sx={{ fontWeight: 600 }}
																>
																	{role.label}
																</Typography>
																<Typography
																	variant="caption"
																	sx={{ color: '#78716c' }}
																>
																	{role.description}
																</Typography>
															</Box>
														</Box>
													</MenuItem>
												))}
										</Select>
										{fieldState.error && (
											<Typography
												variant="caption"
												sx={{ color: '#dc2626', mt: 0.5, ml: 1.75 }}
											>
												{fieldState.error.message}
											</Typography>
										)}
									</FormControl>
								)}
							/>

							{/* Role Permissions Preview */}
							{roleDetails && (
								<Alert
									severity="info"
									icon={<FuseSvgIcon size={20}>{roleDetails.icon}</FuseSvgIcon>}
									sx={{
										background: `${roleDetails.color}08`,
										border: `1px solid ${roleDetails.color}30`,
										'& .MuiAlert-icon': {
											color: roleDetails.color
										}
									}}
								>
									<Typography
										variant="body2"
										sx={{ fontWeight: 600, mb: 1 }}
									>
										{roleDetails.label} Permissions:
									</Typography>
									<Box
										component="ul"
										sx={{ m: 0, pl: 2 }}
									>
										{roleDetails.permissions.slice(0, 3).map((permission, idx) => (
											<Typography
												key={idx}
												component="li"
												variant="caption"
												sx={{ color: '#57534e' }}
											>
												{permission}
											</Typography>
										))}
										{roleDetails.permissions.length > 3 && (
											<Typography
												variant="caption"
												sx={{ color: '#78716c', fontStyle: 'italic' }}
											>
												+{roleDetails.permissions.length - 3} more permissions
											</Typography>
										)}
									</Box>
								</Alert>
							)}

							{/* Location Assignment */}
							<Controller
								name="locations"
								control={inviteControl}
								render={({ field, fieldState }) => (
									<Box>
										<Typography
											variant="body2"
											sx={{ color: '#292524', fontWeight: 600, mb: 1.5 }}
										>
											Assign to Locations *
										</Typography>
										<Box className="grid gap-8">
											{mockLocations.map((location) => (
												<FormControlLabel
													key={location.id}
													control={
														<Checkbox
															checked={field.value.includes(location.id)}
															onChange={(e) => {
																const newValue = e.target.checked
																	? [...field.value, location.id]
																	: field.value.filter((id) => id !== location.id);
																field.onChange(newValue);
															}}
															sx={{
																color: '#ea580c',
																'&.Mui-checked': {
																	color: '#ea580c'
																}
															}}
														/>
													}
													label={
														<Box>
															<Box className="flex items-center gap-8">
																<Typography
																	variant="body2"
																	sx={{ fontWeight: 600 }}
																>
																	{location.name}
																</Typography>
																{location.isHeadquarters && (
																	<Chip
																		label="HQ"
																		size="small"
																		sx={{
																			height: 16,
																			fontSize: '0.65rem',
																			background: '#7c3aed20',
																			color: '#7c3aed',
																			fontWeight: 700
																		}}
																	/>
																)}
															</Box>
															<Typography
																variant="caption"
																sx={{ color: '#78716c', display: 'block' }}
															>
																{location.district}, {location.county}, {location.state},{' '}
																{location.country}
															</Typography>
														</Box>
													}
													sx={{
														m: 0,
														p: 1.5,
														borderRadius: 1,
														border: '1px solid',
														borderColor: field.value.includes(location.id)
															? '#ea580c40'
															: 'rgba(120, 113, 108, 0.2)',
														background: field.value.includes(location.id)
															? 'rgba(249, 115, 22, 0.04)'
															: 'transparent',
														'&:hover': {
															background: 'rgba(249, 115, 22, 0.06)',
															borderColor: '#f9731640'
														}
													}}
												/>
											))}
										</Box>
										{fieldState.error && (
											<Typography
												variant="caption"
												sx={{ color: '#dc2626', mt: 1, display: 'block' }}
											>
												{fieldState.error.message}
											</Typography>
										)}
									</Box>
								)}
							/>
						</Box>
					</DialogContent>

					<DialogActions sx={{ p: 3, pt: 2 }}>
						<Button
							variant="outlined"
							onClick={() => {
								setInviteDialogOpen(false);
								resetInviteForm();
							}}
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
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={!inviteFormState.isValid || isLoading}
							startIcon={
								isLoading ? (
									<CircularProgress
										size={18}
										sx={{ color: 'white' }}
									/>
								) : (
									<FuseSvgIcon size={18}>heroicons-outline:paper-airplane</FuseSvgIcon>
								)
							}
							sx={{
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								color: 'white',
								fontWeight: 700,
								textTransform: 'none',
								px: 3,
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
							{isLoading ? 'Sending...' : 'Send Invitation'}
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			{/* Edit Staff Dialog */}
			<Dialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2
					}
				}}
			>
				<form onSubmit={handleEditSubmit(onEditSubmit)}>
					<DialogTitle sx={{ pb: 2 }}>
						<Box className="flex items-center gap-12">
							<Box
								sx={{
									width: 40,
									height: 40,
									borderRadius: '10px',
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={20}
								>
									heroicons-outline:pencil
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									sx={{ color: '#292524', fontWeight: 700 }}
								>
									Edit Staff Member
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									{selectedStaff?.name}
								</Typography>
							</Box>
						</Box>
					</DialogTitle>

					<DialogContent sx={{ pt: 3 }}>
						<Box className="grid gap-24">
							{/* Role Selection */}
							<Controller
								name="role"
								control={editControl}
								render={({ field }) => (
									<FormControl fullWidth>
										<InputLabel
											sx={{
												'&.Mui-focused': {
													color: '#ea580c'
												}
											}}
										>
											Role
										</InputLabel>
										<Select
											{...field}
											label="Role"
											sx={{
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#f97316'
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#ea580c'
												}
											}}
										>
											{staffRoles
												.filter((r) => r.value !== 'owner')
												.map((role) => (
													<MenuItem
														key={role.value}
														value={role.value}
													>
														<Box className="flex items-center gap-12">
															<FuseSvgIcon
																size={20}
																sx={{ color: role.color }}
															>
																{role.icon}
															</FuseSvgIcon>
															<Box>
																<Typography
																	variant="body2"
																	sx={{ fontWeight: 600 }}
																>
																	{role.label}
																</Typography>
																<Typography
																	variant="caption"
																	sx={{ color: '#78716c' }}
																>
																	{role.description}
																</Typography>
															</Box>
														</Box>
													</MenuItem>
												))}
										</Select>
									</FormControl>
								)}
							/>

							{/* Location Assignment */}
							<Controller
								name="locations"
								control={editControl}
								render={({ field }) => (
									<Box>
										<Typography
											variant="body2"
											sx={{ color: '#292524', fontWeight: 600, mb: 1.5 }}
										>
											Assigned Locations
										</Typography>
										<Box className="grid gap-8">
											{mockLocations.map((location) => (
												<FormControlLabel
													key={location.id}
													control={
														<Checkbox
															checked={field.value.includes(location.id)}
															onChange={(e) => {
																const newValue = e.target.checked
																	? [...field.value, location.id]
																	: field.value.filter((id) => id !== location.id);
																field.onChange(newValue);
															}}
															sx={{
																color: '#ea580c',
																'&.Mui-checked': {
																	color: '#ea580c'
																}
															}}
														/>
													}
													label={
														<Box>
															<Box className="flex items-center gap-8">
																<Typography
																	variant="body2"
																	sx={{ fontWeight: 600 }}
																>
																	{location.name}
																</Typography>
																{location.isHeadquarters && (
																	<Chip
																		label="HQ"
																		size="small"
																		sx={{
																			height: 16,
																			fontSize: '0.65rem',
																			background: '#7c3aed20',
																			color: '#7c3aed',
																			fontWeight: 700
																		}}
																	/>
																)}
															</Box>
															<Typography
																variant="caption"
																sx={{ color: '#78716c', display: 'block' }}
															>
																{location.district}, {location.county}, {location.state},{' '}
																{location.country}
															</Typography>
														</Box>
													}
													sx={{
														m: 0,
														p: 1.5,
														borderRadius: 1,
														border: '1px solid',
														borderColor: field.value.includes(location.id)
															? '#ea580c40'
															: 'rgba(120, 113, 108, 0.2)',
														background: field.value.includes(location.id)
															? 'rgba(249, 115, 22, 0.04)'
															: 'transparent',
														'&:hover': {
															background: 'rgba(249, 115, 22, 0.06)',
															borderColor: '#f9731640'
														}
													}}
												/>
											))}
										</Box>
									</Box>
								)}
							/>
						</Box>
					</DialogContent>

					<DialogActions sx={{ p: 3, pt: 2 }}>
						<Button
							variant="outlined"
							onClick={() => {
								setEditDialogOpen(false);
								setSelectedStaff(null);
							}}
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
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={isLoading}
							startIcon={
								isLoading ? (
									<CircularProgress
										size={18}
										sx={{ color: 'white' }}
									/>
								) : (
									<FuseSvgIcon size={18}>heroicons-outline:check-circle</FuseSvgIcon>
								)
							}
							sx={{
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								color: 'white',
								fontWeight: 700,
								textTransform: 'none',
								px: 3,
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
							{isLoading ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			{/* Permissions Dialog */}
			<Dialog
				open={permissionsDialogOpen}
				onClose={() => setPermissionsDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2
					}
				}}
			>
				<DialogTitle sx={{ pb: 2 }}>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: `${selectedRole?.color}20`,
								border: `1px solid ${selectedRole?.color}40`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<FuseSvgIcon
								size={20}
								sx={{ color: selectedRole?.color }}
							>
								{selectedRole?.icon}
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								sx={{ color: '#292524', fontWeight: 700 }}
							>
								{selectedRole?.label} Permissions
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: '#78716c' }}
							>
								{selectedRole?.description}
							</Typography>
						</Box>
					</Box>
				</DialogTitle>

				<DialogContent>
					<List sx={{ p: 0 }}>
						{selectedRole?.permissions.map((permission, index) => (
							<ListItem
								key={index}
								sx={{ px: 0 }}
							>
								<ListItemAvatar sx={{ minWidth: 40 }}>
									<Box
										sx={{
											width: 32,
											height: 32,
											borderRadius: '8px',
											background: `${selectedRole?.color}15`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: selectedRole?.color }}
										>
											heroicons-solid:check
										</FuseSvgIcon>
									</Box>
								</ListItemAvatar>
								<ListItemText
									primary={permission}
									primaryTypographyProps={{
										variant: 'body2',
										sx: { color: '#292524' }
									}}
								/>
							</ListItem>
						))}
					</List>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 0 }}>
					<Button
						variant="contained"
						onClick={() => setPermissionsDialogOpen(false)}
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							color: 'white',
							fontWeight: 700,
							textTransform: 'none',
							px: 3,
							boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
								boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)'
							}
						}}
					>
						Got it
					</Button>
				</DialogActions>
			</Dialog>

			{/* Remove Staff Confirmation Dialog */}
			<Dialog
				open={removeDialogOpen}
				onClose={() => setRemoveDialogOpen(false)}
				maxWidth="xs"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2
					}
				}}
			>
				<DialogTitle sx={{ pb: 2 }}>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '10px',
								background: 'linear-gradient(135deg, #dc262615 0%, #dc262625 100%)',
								border: '1px solid #dc262640',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<FuseSvgIcon
								size={20}
								sx={{ color: '#dc2626' }}
							>
								heroicons-outline:exclamation-triangle
							</FuseSvgIcon>
						</Box>
						<Typography
							variant="h6"
							sx={{ color: '#292524', fontWeight: 700 }}
						>
							Remove Staff Member?
						</Typography>
					</Box>
				</DialogTitle>

				<DialogContent>
					<Typography
						variant="body2"
						sx={{ color: '#57534e', mb: 2 }}
					>
						Are you sure you want to remove <strong>{selectedStaff?.name}</strong> from your team? This action
						cannot be undone.
					</Typography>

					<Alert
						severity="warning"
						sx={{
							background: 'rgba(245, 158, 11, 0.08)',
							border: '1px solid rgba(245, 158, 11, 0.3)'
						}}
					>
						<Typography
							variant="caption"
							sx={{ color: '#57534e' }}
						>
							This staff member will lose access to all assigned locations and will no longer be able to
							manage your account.
						</Typography>
					</Alert>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 2 }}>
					<Button
						variant="outlined"
						onClick={() => {
							setRemoveDialogOpen(false);
							setSelectedStaff(null);
						}}
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
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={confirmRemoveStaff}
						disabled={isLoading}
						startIcon={
							isLoading ? (
								<CircularProgress
									size={18}
									sx={{ color: 'white' }}
								/>
							) : (
								<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
							)
						}
						sx={{
							background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
							color: 'white',
							fontWeight: 700,
							textTransform: 'none',
							px: 3,
							boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
							'&:hover': {
								background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
								boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35)'
							},
							'&:disabled': {
								background: 'rgba(120, 113, 108, 0.12)',
								color: 'rgba(120, 113, 108, 0.38)',
								boxShadow: 'none'
							}
						}}
					>
						{isLoading ? 'Removing...' : 'Remove Staff'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar Notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{
						width: '100%',
						boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
						'& .MuiAlert-icon': {
							fontSize: 24
						}
					}}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default TeamTab;
