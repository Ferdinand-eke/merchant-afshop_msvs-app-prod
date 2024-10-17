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
import ProductHeader from './ProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import InventoryTab from './tabs/InventoryTab';
import PricingTab from './tabs/PricingTab';
import ProductImagesTab from './tabs/ProductImagesTab';
import ShippingTab from './tabs/ShippingTab';
import { useGetECommerceProductQuery } from '../ECommerceApi';
import ProductModel from './models/ProductModel';
import useGetMyShopDetails from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import { useSingleShopEstateProperty } from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a property name').min(5, 'The property title must be at least 5 characters'),
	propertyCountry: z.string().nonempty("Country is required"),
	propertyState: z.string().nonempty("State is required"),
	propertyLga: z.string().nonempty("L.G.A/County is required"),
	// price: z.number(),
	// z.number().safe(),

});

/**
 * The product page.
 */
function PropertyListing() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const { data: shopData, isLoading: shopDataLoading } = useGetMyShopDetails();

	const {
		data: product,
		isLoading,
		isError
	} = useSingleShopEstateProperty(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			category: '',
            // location: null,
            guestCount: 0,
            roomCount: 0,
            sittingroomCount: 0,
            // imageSrc: '',
            // imageSrcTwo: '',
            // imageSrcThree: '',
            // imageSrcFour: '',
            // images:'',
            price: 0,
           
            description: '',
            // servicetypeId: '',
            // proptypeId: '',
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
		if (product?.data) {
			reset({ ...product?.data });
		}
	}, [product, reset]);

	console.log("EstatePropertyData", product?.data)

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
					to="/property/managed-listings"
					color="inherit"
				>
					Go to properties Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (product?.data && routeParams.productId !== product?.data?.slug && routeParams.productId !== 'new')) {
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
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTab />
							</div>

							<div className={tabValue !== 2 ? 'hidden' : ''}>
								<PricingTab shopData={shopData}/>
							</div>

							{/* <div className={tabValue !== 3 ? 'hidden' : ''}>
								<InventoryTab />
							</div> */}

							<div className={tabValue !== 3 ? 'hidden' : ''}>
								<ShippingTab />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
		
	);
}

export default PropertyListing;
