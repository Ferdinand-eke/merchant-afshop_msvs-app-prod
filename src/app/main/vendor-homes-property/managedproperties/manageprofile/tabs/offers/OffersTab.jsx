import { memo, useState } from 'react';
import {
	Paper,
	Typography,
	Box,
	Chip,
	Grid,
	Card,
	CardContent,
	CardActionArea,
	Skeleton,
	Pagination,
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import usePropertyOffers from 'app/configs/data/server-calls/propertyprofile/usePropertyOffers';
import OfferDetailsSlider from './OfferDetailsSlider';

/**
 * OffersTab - Shows property offers with filtering and pagination
 */
function OffersTab() {
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedOfferId, setSelectedOfferId] = useState(null);
	const [isSliderOpen, setIsSliderOpen] = useState(false);

	const { data: offersData, isLoading } = usePropertyOffers({
		page,
		limit: 12
	});

	const offers = offersData?.data?.payload?.offers || [];
	const pagination = offersData?.data?.payload?.pagination || {};

	// Filter offers based on search and status
	const filteredOffers = offers.filter(offer => {
		const matchesSearch = searchQuery === '' ||
			offer.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			offer.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const handleOfferClick = (offerId) => {
		setSelectedOfferId(offerId);
		setIsSliderOpen(true);
	};

	const handleCloseSlider = () => {
		setIsSliderOpen(false);
		setSelectedOfferId(null);
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const getStatusColor = (status) => {
		switch (status?.toUpperCase()) {
			case 'PENDING':
				return 'warning';
			case 'ACCEPTED':
			case 'APPROVED':
				return 'success';
			case 'REJECTED':
			case 'DECLINED':
				return 'error';
			case 'COUNTER_OFFERED':
				return 'info';
			default:
				return 'default';
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	};

	if (isLoading) {
		return (
			<Box className="w-full">
				<Box className="mb-24">
					<Skeleton variant="rectangular" height={60} className="rounded-xl mb-16" />
				</Box>
				<Grid container spacing={2}>
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Grid item xs={12} sm={6} md={4} key={i}>
							<Skeleton variant="rectangular" height={200} className="rounded-xl" />
						</Grid>
					))}
				</Grid>
			</Box>
		);
	}

	return (
		<Box className="w-full">
			{/* Header with Search and Filters */}
			<Paper className="p-20 mb-24 shadow rounded-xl">
				<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16 mb-16">
					<Box className="flex items-center gap-12">
						<Box className="w-48 h-48 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
							<FuseSvgIcon className="text-white" size={24}>heroicons-outline:currency-dollar</FuseSvgIcon>
						</Box>
						<Box>
							<Typography className="text-xl font-bold">Property Offers</Typography>
							<Typography className="text-sm text-gray-500">
								{pagination.total || 0} total offer{pagination.total !== 1 ? 's' : ''}
							</Typography>
						</Box>
					</Box>
				</Box>

				<Grid container spacing={2}>
					<Grid item xs={12} sm={8}>
						<TextField
							fullWidth
							placeholder="Search by buyer name or property..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>
									</InputAdornment>
								)
							}}
							size="small"
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth size="small">
							<InputLabel>Status</InputLabel>
							<Select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								label="Status"
							>
								<MenuItem value="all">All Status</MenuItem>
								<MenuItem value="PENDING">Pending</MenuItem>
								<MenuItem value="ACCEPTED">Accepted</MenuItem>
								<MenuItem value="REJECTED">Rejected</MenuItem>
								<MenuItem value="COUNTER_OFFERED">Counter Offered</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</Paper>

			{/* Offers Grid */}
			{filteredOffers.length === 0 ? (
				<Paper className="p-32 shadow rounded-xl">
					<Box className="flex flex-col items-center justify-center text-center">
						<FuseSvgIcon className="text-gray-400" size={64}>heroicons-outline:inbox</FuseSvgIcon>
						<Typography className="text-gray-500 mt-16 text-lg">
							{searchQuery || statusFilter !== 'all' ? 'No offers match your filters' : 'No offers received yet'}
						</Typography>
					</Box>
				</Paper>
			) : (
				<>
					<Grid container spacing={2}>
						{filteredOffers.map((offer, idx) => (
							<Grid item xs={12} sm={6} md={4} key={offer.id}>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.05 }}
								>
									<Card className="h-full hover:shadow-lg transition-shadow">
										<CardActionArea onClick={() => handleOfferClick(offer.id)} className="h-full">
											<CardContent className="h-full">
												{/* Offer Amount */}
												<Box className="mb-16">
													<Typography className="text-sm text-gray-500 mb-4">Offer Amount</Typography>
													<Typography className="text-2xl font-bold text-green-600">
														{formatCurrency(offer.offerAmount || 0)}
													</Typography>
												</Box>

												{/* Property Title */}
												<Box className="mb-12">
													<Typography className="text-sm text-gray-500 mb-4">Property</Typography>
													<Typography className="text-base font-semibold line-clamp-2">
														{offer.propertyTitle || 'N/A'}
													</Typography>
												</Box>

												{/* Buyer Info */}
												<Box className="mb-12">
													<Typography className="text-sm text-gray-500 mb-4">Buyer</Typography>
													<Box className="flex items-center gap-8">
														<Box className="w-32 h-32 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
															<FuseSvgIcon className="text-purple-600" size={16}>
																heroicons-outline:user
															</FuseSvgIcon>
														</Box>
														<Typography className="text-sm font-medium">
															{offer.buyerName || 'Unknown'}
														</Typography>
													</Box>
												</Box>

												{/* Status and Date */}
												<Box className="flex items-center justify-between mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
													<Chip
														label={offer.status || 'PENDING'}
														color={getStatusColor(offer.status)}
														size="small"
													/>
													<Typography className="text-xs text-gray-500">
														{new Date(offer.createdAt || offer.offerDate).toLocaleDateString('en-US', {
															month: 'short',
															day: 'numeric'
														})}
													</Typography>
												</Box>
											</CardContent>
										</CardActionArea>
									</Card>
								</motion.div>
							</Grid>
						))}
					</Grid>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<Box className="flex justify-center mt-32">
							<Pagination
								count={pagination.totalPages}
								page={page}
								onChange={handlePageChange}
								color="primary"
								size="large"
							/>
						</Box>
					)}
				</>
			)}

			{/* Offer Details Slider */}
			<OfferDetailsSlider
				open={isSliderOpen}
				onClose={handleCloseSlider}
				offerId={selectedOfferId}
			/>
		</Box>
	);
}

export default memo(OffersTab);
