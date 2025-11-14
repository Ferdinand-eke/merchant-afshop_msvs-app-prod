import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ContentLoadingPlaceholder from 'app/shared-components/ContentLoadingPlaceholder';
import useGetMyShopDetails from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { useSingleShopBookingsProperty } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';
import ProductHeader from './BookingPropertyHeader';
import BasicInfoTabProperty from './tabs/BasicInfoTabProperty';
import PricingTabProperty from './tabs/PricingTabProperty';
import ProductImagesTabProperty from './tabs/ProductImagesTabProperty';
import ShippingTabProperty from './tabs/ShippingTabProperty';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().min(5, 'The property title must be at least 5 characters'),
	propertyCountry: z.string(),
	propertyState: z.string(),
	propertyLga: z.string(),
	// images : z.array().nullable()
	latitude: z.string(),
	longitude: z.string()
});

/**
 * The propertyList page.
 */
function BookingPropertyListing() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const { data: shopData } = useGetMyShopDetails();

	const { data: propertyList, isLoading, isError } = useSingleShopBookingsProperty(productId);

	// Load tab from localStorage with property-specific key
	const getStoredTab = () => {
		const stored = localStorage.getItem(`bookingPropertyTab_${productId}`);
		return stored ? parseInt(stored, 10) : 0;
	};

	const [tabValue, setTabValue] = useState(getStoredTab);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			// roomCount: 0,
			// sittingroomCount: 0,
			// price: 0,
		},
		resolver: zodResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();

	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);

	useEffect(() => {
		if (propertyList?.data?.bookingList) {
			reset({ ...propertyList?.data?.bookingList });
		}
	}, [propertyList, reset]);

	// Restore tab on productId change
	useEffect(() => {
		setTabValue(getStoredTab());
	}, [productId]);

	// console.log('propertyList__AND___property-listImages', propertyList?.data?.bookingList);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
		// Save to localStorage with property-specific key
		localStorage.setItem(`bookingPropertyTab_${productId}`, value.toString());
	}

	if (isLoading) {
		return (
			<ContentLoadingPlaceholder
				title="Loading Property Details..."
				subtitle="Preparing your property management form"
				cardCount={4}
			/>
		);
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	if (isError && productId !== 'new') {
		return (
			<Box
				className="flex flex-col items-center justify-center h-full p-48"
				sx={{
					background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fef3e2 100%)',
					minHeight: '100vh'
				}}
			>
				<Paper
					className="p-48 rounded-2xl text-center max-w-md"
					sx={{
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)'
					}}
				>
					<Box
						className="flex items-center justify-center w-96 h-96 rounded-full mx-auto mb-24"
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
						}}
					>
						<FuseSvgIcon
							className="text-white"
							size={48}
						>
							heroicons-outline:exclamation
						</FuseSvgIcon>
					</Box>
					<Typography
						variant="h5"
						className="font-bold mb-12"
						sx={{ color: '#ea580c' }}
					>
						Property Not Found
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						className="mb-24"
					>
						The property you're looking for doesn't exist or has been removed
					</Typography>
					<Button
						component={Link}
						to="/bookings/managed-listings"
						variant="contained"
						size="large"
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							color: 'white',
							fontWeight: 700,
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
							}
						}}
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:arrow-left</FuseSvgIcon>}
					>
						Back to Properties
					</Button>
				</Paper>
			</Box>
		);
	}

	/**
	 * Wait while propertyList data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(propertyList?.data?.bookingList &&
			routeParams.productId !== propertyList?.data?.bookingList?.slug &&
			routeParams.productId !== 'new')
	) {
		return (
			<ContentLoadingPlaceholder
				title="Preparing Form..."
				subtitle="Setting up your property details"
				cardCount={4}
			/>
		);
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
				contentContainerSx={{
					px: 0
				}}
				content={
					<>
						<Paper
							elevation={0}
							sx={{
								borderBottom: '1px solid rgba(234, 88, 12, 0.1)'
							}}
						>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								indicatorColor="secondary"
								textColor="secondary"
								variant="scrollable"
								scrollButtons="auto"
								sx={{
									'& .MuiTab-root': {
										minHeight: 64,
										textTransform: 'none',
										fontSize: '15px',
										fontWeight: 600,
										'&.Mui-selected': {
											color: '#ea580c'
										}
									},
									'& .MuiTabs-indicator': {
										backgroundColor: '#ea580c',
										height: 3
									}
								}}
							>
								<Tab
									icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
									iconPosition="start"
									label="Basic Info"
								/>
								<Tab
									icon={<FuseSvgIcon size={20}>heroicons-outline:photograph</FuseSvgIcon>}
									iconPosition="start"
									label="Property Images"
								/>
								<Tab
									icon={<FuseSvgIcon size={20}>heroicons-outline:currency-dollar</FuseSvgIcon>}
									iconPosition="start"
									label="Pricing & VAT"
								/>
								<Tab
									icon={<FuseSvgIcon size={20}>heroicons-outline:cube</FuseSvgIcon>}
									iconPosition="start"
									label="Measurements"
								/>
							</Tabs>
						</Paper>

						<Box className="p-16 sm:p-24 max-w-4xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className={tabValue !== 0 ? 'hidden' : ''}>
									<BasicInfoTabProperty />
								</div>

								<div className={tabValue !== 1 ? 'hidden' : ''}>
									<ProductImagesTabProperty />
								</div>

								<div className={tabValue !== 2 ? 'hidden' : ''}>
									<PricingTabProperty shopData={shopData} />
								</div>

								<div className={tabValue !== 3 ? 'hidden' : ''}>
									<ShippingTabProperty />
								</div>
							</motion.div>
						</Box>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default BookingPropertyListing;
