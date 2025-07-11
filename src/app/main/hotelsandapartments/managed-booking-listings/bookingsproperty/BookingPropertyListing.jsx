import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductHeader from './BookingPropertyHeader';
import BasicInfoTabProperty from './tabs/BasicInfoTabProperty';
import InventoryTabProperty from './tabs/InventoryTabProperty';
import PricingTabProperty from './tabs/PricingTabProperty';
import ProductImagesTabProperty from './tabs/ProductImagesTabProperty';
import ShippingTabProperty from './tabs/ShippingTabProperty';
import { useGetECommerceProductQuery } from '../ECommerceApi';
import ProductModel from './models/ProductModel';
import useGetMyShopDetails from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { useSingleShopEstateProperty } from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
import { useSingleShopBookingsProperty } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';
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
	longitude: z.string(),
	
	// z.number().safe(),

	// roomCount: z.string(),
	// guestCount: z.string(),
	// bathroomCount: z.string(),
	// sittingroomCount: z.string().optional(),
	

	
	// images: z.string().array(),

	// price: z.string(),
	// listprice: z.number(),
	// bookingPeriod: z.string(),
	// isRentIndividualRoom: z.boolean()


	

});

/**
 * The propertyList page.
 */
function BookingPropertyListing() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const { data: shopData, isLoading: shopDataLoading } = useGetMyShopDetails();

	const {
		data: propertyList,
		isLoading,
		isError
	} = useSingleShopBookingsProperty(productId, {
		skip: !productId || productId === 'new'
	});

	console.log("PropertyList", propertyList?.data?.bookingList?.bookingList);

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
            roomCount: 0,
            sittingroomCount: 0,
            price: 0,
           
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


	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	
	if (isError && productId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such property!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/bookings/managed-listings"
					color="inherit"
				>
					Go to properties Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while propertyList data is loading and form is setted 
	 */
	if (_.isEmpty(form) || (propertyList?.data?.bookingList && routeParams.productId !== propertyList?.data?.bookingList?.slug && routeParams.productId !== 'new')) {
		return <FuseLoading />;
	}


	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label="Basic Info"
							/>
							<Tab
								className="h-64"
								label="Product Images"
							/>
							<Tab
								className="h-64"
								label="Pricing"
							/>
							{/* <Tab
								className="h-64"
								label="Inventory"
							/> */}
							<Tab
								className="h-64"
								label="Property measurement"
							/>
						</Tabs>
						
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTabProperty />
							</div>

							<div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTabProperty />
							</div>

							<div className={tabValue !== 2 ? 'hidden' : ''}>
								<PricingTabProperty shopData={shopData}/>
							</div>

							{/* <div className={tabValue !== 3 ? 'hidden' : ''}>
								<InventoryTabProperty />
							</div> */}

							<div className={tabValue !== 3 ? 'hidden' : ''}>
								<ShippingTabProperty />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
		
	);
}

export default BookingPropertyListing;
