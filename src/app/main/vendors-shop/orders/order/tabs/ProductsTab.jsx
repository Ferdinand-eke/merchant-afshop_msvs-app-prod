import { memo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { formatCurrency } from '../../../pos/PosUtils';

/**
 * Products Tab - Enhanced with modern design and engaging UI
 * Displays order product information with visual appeal
 */
function ProductsTab({ order, isError }) {
	if (!isError && !order) {
		return null;
	}

	if (!order) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 8,
					textAlign: 'center',
					borderRadius: 2,
					bgcolor: 'background.default'
				}}
			>
				<FuseSvgIcon
					size={64}
					color="disabled"
				>
					heroicons-outline:inbox
				</FuseSvgIcon>
				<Typography
					variant="h6"
					color="text.secondary"
					mt={2}
				>
					No product found in this order
				</Typography>
				<Typography
					variant="body2"
					color="text.disabled"
					mt={1}
				>
					This order does not contain any items.
				</Typography>
			</Paper>
		);
	}

	const subtotal = (order?.price || 0) * (order?.quantity || 0);

	return (
		<Box>
			{/* Order Summary Card */}
			<Paper
				elevation={1}
				sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.default' }}
			>
				<Box
					display="flex"
					alignItems="center"
					gap={1}
					mb={2}
				>
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:clipboard-list
					</FuseSvgIcon>
					<Typography
						variant="h6"
						fontWeight={600}
						color="text.secondary"
					>
						Order Summary
					</Typography>
				</Box>
				<Box
					display="flex"
					gap={3}
					flexWrap="wrap"
				>
					<Paper
						elevation={0}
						sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}
					>
						<Typography
							variant="body2"
							color="primary.dark"
							gutterBottom
						>
							Product
						</Typography>
						<Typography
							variant="h4"
							fontWeight={700}
							color="primary.main"
						>
							1
						</Typography>
					</Paper>
					<Paper
						elevation={0}
						sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'success.light', borderRadius: 2 }}
					>
						<Typography
							variant="body2"
							color="success.dark"
							gutterBottom
						>
							Total Quantity
						</Typography>
						<Typography
							variant="h4"
							fontWeight={700}
							color="success.main"
						>
							{order?.quantity || 0}
						</Typography>
					</Paper>
					<Paper
						elevation={0}
						sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}
					>
						<Typography
							variant="body2"
							color="secondary.dark"
							gutterBottom
						>
							Total Value
						</Typography>
						<Typography
							variant="h4"
							fontWeight={700}
							color="secondary.main"
						>
							NGN {formatCurrency(subtotal)}
						</Typography>
					</Paper>
				</Box>
			</Paper>

			{/* Product Card */}
			<Box mb={4}>
				<Box
					display="flex"
					alignItems="center"
					gap={1}
					mb={3}
				>
					<FuseSvgIcon
						color="action"
						size={24}
					>
						heroicons-outline:shopping-bag
					</FuseSvgIcon>
					<Typography
						variant="h6"
						fontWeight={600}
						color="text.secondary"
					>
						Product Details
					</Typography>
				</Box>
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
					>
						<Card
							elevation={2}
							sx={{
								display: 'flex',
								flexDirection: { xs: 'column', md: 'row' },
								borderRadius: 2,
								transition: 'all 0.3s ease-in-out',
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: 6
								}
							}}
						>
							<Box sx={{ position: 'relative', width: { xs: '100%', md: 300 } }}>
								<CardMedia
									component="img"
									sx={{
										width: '100%',
										height: { xs: 250, md: '100%' },
										objectFit: 'cover',
										bgcolor: 'action.hover'
									}}
									image={order?.image || 'assets/images/placeholder.jpg'}
									alt={order?.name}
								/>
								<Chip
									label="#1"
									size="small"
									color="primary"
									sx={{
										position: 'absolute',
										top: 12,
										left: 12,
										fontWeight: 700,
										boxShadow: 2
									}}
								/>
							</Box>
							<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
								<Typography
									variant="h5"
									gutterBottom
									sx={{
										fontWeight: 600,
										mb: 2
									}}
								>
									{order?.name}
								</Typography>

								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mb: 3 }}
								>
									Product ID: {order?._id}
								</Typography>

								<Divider sx={{ my: 2 }} />

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
									>
										<Box
											display="flex"
											alignItems="center"
											gap={0.5}
										>
											<FuseSvgIcon
												size={16}
												color="action"
											>
												heroicons-outline:currency-dollar
											</FuseSvgIcon>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Unit Price
											</Typography>
										</Box>
										<Typography
											variant="h6"
											color="primary.main"
											fontWeight={700}
										>
											NGN {formatCurrency(order?.price)}
										</Typography>
									</Box>

									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
									>
										<Box
											display="flex"
											alignItems="center"
											gap={0.5}
										>
											<FuseSvgIcon
												size={16}
												color="action"
											>
												heroicons-outline:shopping-cart
											</FuseSvgIcon>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Quantity
											</Typography>
										</Box>
										<Chip
											label={`×${order?.quantity}`}
											size="small"
											color="success"
											variant="outlined"
											sx={{ fontWeight: 700, borderRadius: 1 }}
										/>
									</Box>

									<Divider />

									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										p={2}
										sx={{
											bgcolor: 'primary.main',
											borderRadius: 1.5,
											color: 'primary.contrastText'
										}}
									>
										<Typography
											variant="body1"
											fontWeight={600}
										>
											Subtotal
										</Typography>
										<Typography
											variant="h5"
											fontWeight={700}
										>
											NGN {formatCurrency(subtotal)}
										</Typography>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Box>

			{/* Detailed Information Paper */}
			<Paper
				elevation={1}
				sx={{ borderRadius: 2, overflow: 'hidden' }}
			>
				<Box sx={{ p: 2, bgcolor: 'action.hover' }}>
					<Box
						display="flex"
						alignItems="center"
						gap={1}
					>
						<FuseSvgIcon
							color="action"
							size={20}
						>
							heroicons-outline:document-text
						</FuseSvgIcon>
						<Typography
							variant="subtitle1"
							fontWeight={600}
						>
							Order Item Breakdown
						</Typography>
					</Box>
				</Box>
				<Box sx={{ p: 3 }}>
					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<Box
								sx={{
									p: 2,
									bgcolor: 'background.default',
									borderRadius: 1,
									border: 1,
									borderColor: 'divider'
								}}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									gutterBottom
									display="block"
								>
									Product Name
								</Typography>
								<Typography
									variant="body1"
									fontWeight={600}
								>
									{order?.name}
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<Box
								sx={{
									p: 2,
									bgcolor: 'background.default',
									borderRadius: 1,
									border: 1,
									borderColor: 'divider'
								}}
							>
								<Typography
									variant="caption"
									color="text.secondary"
									gutterBottom
									display="block"
								>
									Product ID
								</Typography>
								<Typography
									variant="body1"
									fontWeight={600}
									fontFamily="monospace"
								>
									{order?._id}
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={3}
						>
							<Box
								sx={{
									p: 2,
									bgcolor: 'primary.lighter',
									borderRadius: 1,
									border: 1,
									borderColor: 'primary.light'
								}}
							>
								<Typography
									variant="caption"
									color="primary.dark"
									gutterBottom
									display="block"
								>
									Unit Price
								</Typography>
								<Typography
									variant="body1"
									fontWeight={700}
									color="primary.main"
								>
									NGN {formatCurrency(order?.price)}
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={3}
						>
							<Box
								sx={{
									p: 2,
									bgcolor: 'success.lighter',
									borderRadius: 1,
									border: 1,
									borderColor: 'success.light'
								}}
							>
								<Typography
									variant="caption"
									color="success.dark"
									gutterBottom
									display="block"
								>
									Quantity
								</Typography>
								<Typography
									variant="body1"
									fontWeight={700}
									color="success.main"
								>
									×{order?.quantity}
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
						>
							<Box
								sx={{
									p: 2,
									bgcolor: 'secondary.lighter',
									borderRadius: 1,
									border: 2,
									borderColor: 'secondary.main'
								}}
							>
								<Typography
									variant="caption"
									color="secondary.dark"
									gutterBottom
									display="block"
								>
									Total Amount
								</Typography>
								<Typography
									variant="h6"
									fontWeight={700}
									color="secondary.main"
								>
									NGN {formatCurrency(subtotal)}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Box>
	);
}

export default memo(ProductsTab);
