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
import { useSingleShopFoodMart } from 'app/configs/data/server-calls/foodmart/useShopFoodMarts';
import ProductHeader from './FoodMartHeader';
import BasicInfoTabFoodMart from './tabs/BasicInfoTabFoodMart';
import ProductImagesTabProperty from './tabs/ProductImagesTabProperty';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z
		.string()
		.nonempty('You must enter a property name')
		.min(5, 'The property title must be at least 5 characters'),
	foodMartCountry: z.string().nonempty('Country is required'),
	foodMartState: z.string().nonempty('State is required'),
	foodMartLga: z.string().nonempty('L.G.A/County is required')
	// price: z.number(),
	// z.number().safe(),
});

/**
 * The foodMartList page.
 */
function FoodMartListing() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;

	const {
		data: foodMartList,
		isLoading,
		isError
	} = useSingleShopFoodMart(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			description: '',

			foodMartCategory: '',
			foodMartCountry: '',
			foodMartState: '',
			foodMartLga: '',
			busniessOpenPeriod: '',
			busniessClosePeriod: '',
			address: ''
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
		if (foodMartList?.data?.foodMart) {
			reset({ ...foodMartList?.data?.foodMart });
		}
	}, [foodMartList, reset]);

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
					to="/foodmarts/managed-foodmerchants"
					color="inherit"
				>
					Go to properties Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while foodMartList data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(foodMartList?.data?.foodMart &&
			routeParams.productId !== foodMartList?.data?.foodMart?.slug &&
			routeParams.productId !== 'new')
	) {
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
							{/* <Tab
								className="h-64"
								label="Pricing"
							/> */}
							{/* <Tab
								className="h-64"
								label="Inventory"
							/> */}
							{/* <Tab
								className="h-64"
								label="Property measurement"
							/> */}
						</Tabs>

						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTabFoodMart />
							</div>

							<div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTabProperty />
							</div>

							{/* <div className={tabValue !== 2 ? 'hidden' : ''}>
								<PricingTabProperty shopData={shopData}/>
							</div> */}

							{/* <div className={tabValue !== 3 ? 'hidden' : ''}>
								<InventoryTabProperty />
							</div> */}

							{/* <div className={tabValue !== 3 ? 'hidden' : ''}>
								<ShippingTabProperty />
							</div> */}
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default FoodMartListing;
