/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import ContentLoadingPlaceholder from 'app/shared-components/ContentLoadingPlaceholder';
import { Chip, Paper, Box, Avatar, Tooltip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMyShopEstateProperties from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';

function PropertiesTable() {
	

	const {data:listingData, isLoading:listingIsLoading} = useMyShopEstateProperties()


	const columns = useMemo(
		() => [
			{
				accessorKey: 'title',
				header: 'Property Details',
				Cell: ({ row }) => (
					<Box className="flex items-center gap-12 py-8">
						<Avatar
							sx={{
								width: 56,
								height: 56,
								background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
							}}
						>
							<FuseSvgIcon className="text-white" size={24}>
								heroicons-outline:home
							</FuseSvgIcon>
						</Avatar>
						<Box>
							<Typography
								component={Link}
								to={`/property/managed-listings/${row.original.slug}/${row.original.title}`}
								className="font-semibold text-16 hover:underline"
								sx={{
									color: "#ea580c",
									transition: "all 0.2s",
									"&:hover": {
										color: "#c2410c"
									}
								}}
							>
								{row?.original?.title}
							</Typography>
							<Typography variant="caption" color="text.secondary" className="flex items-center gap-4 mt-4">
								<FuseSvgIcon size={14}>heroicons-outline:location-marker</FuseSvgIcon>
								{row?.original?.address || "Location not specified"}
							</Typography>
						</Box>
					</Box>
				),
				size: 300
			},
			{
				accessorKey: 'price',
				header: 'Price',
				Cell: ({ row }) => (
					<Box>
						<Typography className="font-bold text-16" sx={{ color: "#ea580c" }}>
							₦{formatCurrency(row?.original?.price)}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Per {row?.original?.priceUnit || "month"}
						</Typography>
					</Box>
				),
				size: 150
			},
			{
				accessorKey: 'roomCount',
				header: 'Specifications',
				Cell: ({ row }) => (
					<Box className="flex flex-wrap gap-8">
						<Tooltip title="Bedrooms">
							<Chip
								icon={<FuseSvgIcon size={16}>heroicons-outline:home</FuseSvgIcon>}
								label={`${row?.original?.roomCount || 0} rooms`}
								size="small"
								sx={{
									backgroundColor: "rgba(234, 88, 12, 0.1)",
									color: "#ea580c",
									fontWeight: 600
								}}
							/>
						</Tooltip>
						{row?.original?.bathrooms && (
							<Tooltip title="Bathrooms">
								<Chip
									icon={<FuseSvgIcon size={16}>heroicons-outline:sparkles</FuseSvgIcon>}
									label={`${row?.original?.bathrooms} baths`}
									size="small"
									sx={{
										backgroundColor: "rgba(59, 130, 246, 0.1)",
										color: "#3b82f6",
										fontWeight: 600
									}}
								/>
							</Tooltip>
						)}
					</Box>
				),
				size: 200
			},
			{
				accessorKey: 'isApproved',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip
						icon={
							row.original.isApproved ? (
								<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>
							)
						}
						label={row.original.isApproved ? "Active" : "Pending"}
						size="small"
						sx={{
							backgroundColor: row.original.isApproved
								? "rgba(34, 197, 94, 0.1)"
								: "rgba(251, 191, 36, 0.1)",
							color: row.original.isApproved ? "#22c55e" : "#fbbf24",
							fontWeight: 700,
							borderRadius: "8px",
							height: "28px"
						}}
					/>
				),
				size: 120
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				Cell: ({ row }) => (
					<Box className="flex gap-8">
						<Button
							component={Link}
							to={`/property/managed-listings/${row.original.id}/manage`}
							variant="contained"
							size="small"
							sx={{
								background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
								color: "white",
								fontWeight: 600,
								textTransform: "none",
								"&:hover": {
									background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
								}
							}}
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:cog</FuseSvgIcon>}
						>
							Manage
						</Button>
						<Tooltip title="View Property">
							<Button
								component={Link}
								to={`/property/managed-listings/${row.original.slug}/${row.original.title}`}
								variant="outlined"
								size="small"
								sx={{
									borderColor: "#ea580c",
									color: "#ea580c",
									"&:hover": {
										borderColor: "#c2410c",
										backgroundColor: "rgba(234, 88, 12, 0.05)"
									}
								}}
							>
								<FuseSvgIcon size={16}>heroicons-outline:eye</FuseSvgIcon>
							</Button>
						</Tooltip>
					</Box>
				),
				size: 200
			},
		],
		[]
	);

	if (listingIsLoading) {
		return (
			<ContentLoadingPlaceholder
				title="Loading Properties..."
				subtitle="Finding the best accommodations for you"
				cardCount={4}
			/>
		);
	}

	if (!listingData?.data?.properties || listingData.data.properties.length === 0) {
		return (
			<Box className="flex flex-col items-center justify-center h-full p-48">
				<Paper
					className="p-48 rounded-2xl text-center max-w-md"
					sx={{
						background: "linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)",
					}}
				>
					<Box
						className="flex items-center justify-center w-96 h-96 rounded-full mx-auto mb-24"
						sx={{
							background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
						}}
					>
						<FuseSvgIcon className="text-white" size={48}>
							heroicons-outline:office-building
						</FuseSvgIcon>
					</Box>
					<Typography variant="h5" className="font-bold mb-12" sx={{ color: "#ea580c" }}>
						No Properties Yet
					</Typography>
					<Typography variant="body1" color="text.secondary" className="mb-24">
						Start building your property portfolio by adding your first listing
					</Typography>
					<Button
						component={Link}
						to="/property/managed-listings/new"
						variant="contained"
						size="large"
						sx={{
							background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
							color: "white",
							fontWeight: 700,
							textTransform: "none",
							"&:hover": {
								background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
							}
						}}
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
					>
						Add Your First Property
					</Button>
				</Paper>
			</Box>
		);
	}

	return (
		<Box className="px-16 md:px-24 pb-24">
			<Paper
				className="flex flex-col flex-auto shadow-lg rounded-2xl overflow-hidden w-full"
				elevation={0}
				sx={{
					border: "1px solid rgba(234, 88, 12, 0.1)",
				}}
			>
				<DataTable
					data={listingData?.data?.properties}
					columns={columns}
					enableRowSelection={false}
					enableColumnResizing
					enableStickyHeader
					muiTablePaperProps={{
						elevation: 0,
						sx: {
							borderRadius: "16px",
							overflow: "hidden"
						}
					}}
					muiTableHeadCellProps={{
						sx: {
							backgroundColor: "rgba(234, 88, 12, 0.05)",
							color: "#ea580c",
							fontWeight: 700,
							fontSize: "14px",
							borderBottom: "2px solid rgba(234, 88, 12, 0.2)",
						}
					}}
					muiTableBodyRowProps={() => ({
						sx: {
							'&:hover': {
								backgroundColor: "rgba(234, 88, 12, 0.02)",
							},
							borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
						}
					})}
				/>
			</Paper>
		</Box>
	);
}

export default PropertiesTable;
