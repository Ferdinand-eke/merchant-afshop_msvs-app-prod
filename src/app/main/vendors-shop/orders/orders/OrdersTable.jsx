/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useEffect, useCallback } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper, Chip, Box, Avatar } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import ContentLoadingPlaceholder from 'app/shared-components/ContentLoadingPlaceholder';
import { useShopItemsInOrders } from 'app/configs/data/server-calls/orders/useShopOrders';
import MerchantClientErrorPage from 'src/app/main/MerchantClientErrorPage';
import OrdersCreatedAndPaymentStatus from '../order/OrdersCreatedAndPaymentStatus';

function OrdersTable() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Initialize pagination from URL params or use defaults
	const initialPage = parseInt(searchParams.get('page') || '1', 10);
	const initialLimit = parseInt(searchParams.get('limit') || '10', 10);

	const [pagination, setPagination] = useState({
		pageIndex: initialPage - 1, // Material Table uses 0-based index
		pageSize: initialLimit
	});

	// Sync URL params when pagination changes
	useEffect(() => {
		const currentPage = pagination.pageIndex + 1;
		const currentLimit = pagination.pageSize;

		// Only update URL if values have changed
		if (
			parseInt(searchParams.get('page') || '1', 10) !== currentPage ||
			parseInt(searchParams.get('limit') || '10', 10) !== currentLimit
		) {
			setSearchParams(
				{
					page: currentPage.toString(),
					limit: currentLimit.toString()
				},
				{ replace: true } // Replace instead of push to avoid polluting history
			);
		}
	}, [pagination, searchParams, setSearchParams]);

	// Update pagination state when URL params change (e.g., back button)
	useEffect(() => {
		const urlPage = parseInt(searchParams.get('page') || '1', 10);
		const urlLimit = parseInt(searchParams.get('limit') || '10', 10);

		if (pagination.pageIndex !== urlPage - 1 || pagination.pageSize !== urlLimit) {
			setPagination({
				pageIndex: urlPage - 1,
				pageSize: urlLimit
			});
		}
	}, [searchParams]); // Only depend on searchParams to avoid infinite loop

	// Fetch data - MUST be declared before useEffect that depends on isLoading
	const {
		data: shopOrderItems,
		isLoading: shopOrderItemsIsLoading,
		isError
	} = useShopItemsInOrders(pagination.pageIndex + 1, pagination.pageSize);

	// Save scroll position before navigating away
	useEffect(() => {
		const handleBeforeUnload = () => {
			const scrollPosition = window.scrollY;
			sessionStorage.setItem('ordersTableScrollPosition', scrollPosition.toString());
			sessionStorage.setItem(
				'ordersTablePagination',
				JSON.stringify({
					page: pagination.pageIndex + 1,
					limit: pagination.pageSize
				})
			);
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [pagination]);

	// Restore scroll position when component mounts
	useEffect(() => {
		const savedScrollPosition = sessionStorage.getItem('ordersTableScrollPosition');
		const savedPagination = sessionStorage.getItem('ordersTablePagination');

		if (savedScrollPosition && !shopOrderItemsIsLoading) {
			// Delay scroll restoration to ensure content is rendered
			setTimeout(() => {
				window.scrollTo(0, parseInt(savedScrollPosition, 10));
				sessionStorage.removeItem('ordersTableScrollPosition');
			}, 100);
		}

		if (savedPagination && !searchParams.get('page')) {
			const { page, limit } = JSON.parse(savedPagination);
			setPagination({
				pageIndex: page - 1,
				pageSize: limit
			});
			sessionStorage.removeItem('ordersTablePagination');
		}
	}, [shopOrderItemsIsLoading, searchParams, setPagination]); // Run when data loading completes

	// Save state before navigation
	const handleNavigateToOrder = useCallback(() => {
		const scrollPosition = window.scrollY;
		sessionStorage.setItem('ordersTableScrollPosition', scrollPosition.toString());
		sessionStorage.setItem(
			'ordersTablePagination',
			JSON.stringify({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
		);
	}, [pagination.pageIndex, pagination.pageSize]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'product',
				header: 'Product',
				accessorFn: (row) => row.featuredImageId,
				id: 'featuredImageId',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 120,
				enableSorting: false,
				Cell: ({ row }) => (
					<Box className="flex items-center gap-3">
						<Avatar
							src={row?.original?.image || 'assets/images/apps/ecommerce/product-image-placeholder.png'}
							alt={row?.original?.name}
							variant="rounded"
							sx={{ width: 56, height: 56 }}
						/>
						<Box>
							<Typography
								variant="body2"
								fontWeight={600}
								className="line-clamp-2"
							>
								{row?.original?.name || 'Unnamed Product'}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								ID: {row?.original?.id}
							</Typography>
						</Box>
					</Box>
				)
			},
			{
				id: 'customer',
				accessorFn: (row) => row?.order?.shippingAddress?.fullName || 'N/A',
				header: 'Customer',
				size: 160,
				Cell: ({ row }) => (
					<Box>
						<Typography
							variant="body2"
							fontWeight={500}
						>
							{row?.original?.order?.shippingAddress?.fullName || 'N/A'}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{row?.original?.order?.shippingAddress?.email || ''}
						</Typography>
					</Box>
				)
			},
			{
				id: 'quantity',
				accessorFn: (row) => row?.quantity || 0,
				header: 'Qty',
				size: 80,
				Cell: ({ row }) => (
					<Chip
						label={row?.original?.quantity || 0}
						size="small"
						color="primary"
						variant="outlined"
					/>
				)
			},
			{
				id: 'price',
				accessorFn: (row) => row?.price || 0,
				header: 'Unit Price',
				size: 120,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						fontWeight={500}
					>
						₦{(row?.original?.price || 0).toLocaleString()}
					</Typography>
				)
			},
			{
				id: 'total',
				accessorFn: (row) => (row?.quantity || 0) * (row?.price || 0),
				header: 'Total',
				size: 120,
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						fontWeight={700}
						color="primary"
					>
						₦{((row?.original?.quantity || 0) * (row?.original?.price || 0)).toLocaleString()}
					</Typography>
				)
			},
			{
				id: 'payment',
				accessorFn: (row) => row?.order?.isPaid,
				accessorKey: 'isPaid',
				header: 'Status',
				size: 150,
				Cell: ({ row }) => (
					<OrdersCreatedAndPaymentStatus
						createdAt={row?.original?.createdAt}
						isPaid={row?.original?.order?.isPaid}
					/>
				)
			},
			{
				accessorKey: 'createdAt',
				accessorFn: (row) => new Date(row?.createdAt).toLocaleDateString(),
				header: 'Order Date',
				size: 130,
				Cell: ({ row }) => (
					<Box>
						<Typography variant="body2">
							{new Date(row?.original?.createdAt).toLocaleDateString()}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{new Date(row?.original?.createdAt).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit'
							})}
						</Typography>
					</Box>
				)
			}
		],
		[handleNavigateToOrder]
	);

	// Extract pagination data from API response
	const paginationData = shopOrderItems?.data?.pagination || {
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0
	};

	if (shopOrderItemsIsLoading) {
		return (
			<ContentLoadingPlaceholder
				title="Loading Orders..."
				subtitle="Fetching your merchant orders"
				cardCount={3}
			/>
		);
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<MerchantClientErrorPage message="Error occurred retrieving orders!" />
			</motion.div>
		);
	}

	if (!shopOrderItems?.data?.merchantOrders || shopOrderItems?.data?.merchantOrders?.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full p-24"
			>
				<Box className="text-center max-w-md">
					<FuseSvgIcon
						className="mb-16"
						size={120}
						color="disabled"
					>
						heroicons-outline:shopping-bag
					</FuseSvgIcon>
					<Typography
						variant="h5"
						className="mb-8"
						color="text.secondary"
					>
						No Orders Yet
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
					>
						When customers place orders, they will appear here for you to manage and fulfill.
					</Typography>
				</Box>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Paper
				className="flex flex-col flex-auto shadow-3 rounded-16 overflow-hidden w-full h-full"
				elevation={3}
			>
				{/* Header Stats Bar */}
				<Box className="bg-gradient-to-r from-orange-600 to-orange-500 px-24 py-16">
					<Box className="flex items-center justify-between">
						<Box className="flex items-center gap-16">
							<FuseSvgIcon
								className="text-white"
								size={32}
							>
								heroicons-outline:shopping-cart
							</FuseSvgIcon>
							<Box>
								<Typography
									variant="h6"
									className="text-white font-bold"
								>
									Order Management
								</Typography>
								<Typography
									variant="caption"
									className="text-orange-100"
								>
									Total: {paginationData.total} orders • Page {paginationData.page} of{' '}
									{paginationData.totalPages}
								</Typography>
							</Box>
						</Box>
						<Chip
							label={`${shopOrderItems?.data?.merchantOrders?.length || 0} items on this page`}
							size="small"
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								color: 'white',
								fontWeight: 600
							}}
						/>
					</Box>
				</Box>

				<DataTable
					manualPagination
					rowCount={paginationData.total}
					onPaginationChange={setPagination}
					state={{
						pagination,
						isLoading: shopOrderItemsIsLoading
					}}
					initialState={{
						density: 'comfortable',
						showColumnFilters: false,
						showGlobalFilter: true,
						columnPinning: {
							left: ['mrt-row-expand', 'mrt-row-select'],
							right: ['mrt-row-actions']
						}
					}}
					data={shopOrderItems?.data?.merchantOrders || []}
					columns={columns}
					enableRowSelection
					enableStickyHeader
					muiTableContainerProps={{
						sx: { maxHeight: 'calc(100vh - 400px)' }
					}}
					muiTablePaperProps={{
						elevation: 0,
						sx: {
							borderRadius: 0
						}
					}}
					renderRowActionMenuItems={({ closeMenu, row }) => [
						<MenuItem
							key="view"
							component={Link}
							to={`/shoporders-list/orders/${row.original.id}/item`}
							onClick={() => {
								handleNavigateToOrder();
								closeMenu();
							}}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
							</ListItemIcon>
							View Details
						</MenuItem>,
						<MenuItem
							key="edit"
							onClick={() => {
								closeMenu();
							}}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
							</ListItemIcon>
							Edit Order
						</MenuItem>
					]}
					renderTopToolbarCustomActions={({ table }) => {
						const { rowSelection } = table.getState();
						const selectedCount = Object.keys(rowSelection).length;

						if (selectedCount === 0) {
							return (
								<Box className="flex items-center gap-8">
									<Chip
										icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
										label="Select orders to take bulk actions"
										size="small"
										variant="outlined"
										color="default"
									/>
								</Box>
							);
						}

						return (
							<Box className="flex items-center gap-8">
								<Chip
									label={`${selectedCount} selected`}
									size="small"
									color="primary"
								/>
								<Button
									variant="contained"
									size="small"
									onClick={() => {
										const selectedRows = table.getSelectedRowModel().rows;
										console.log(
											'Process selected orders:',
											selectedRows.map((row) => row.original.id)
										);
										table.resetRowSelection();
									}}
									className="flex shrink min-w-40"
									color="primary"
								>
									<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>
									<span className="hidden sm:flex mx-8">Process Orders</span>
								</Button>
								<Button
									variant="outlined"
									size="small"
									onClick={() => {
										table.resetRowSelection();
									}}
									className="flex shrink min-w-40"
									color="secondary"
								>
									<FuseSvgIcon size={16}>heroicons-outline:x</FuseSvgIcon>
									<span className="hidden sm:flex mx-8">Clear Selection</span>
								</Button>
							</Box>
						);
					}}
				/>
			</Paper>
		</motion.div>
	);
}

export default OrdersTable;
