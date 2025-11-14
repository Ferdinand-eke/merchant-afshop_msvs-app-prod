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
import { useGetSingleServiveType } from 'src/app/aaqueryhooks/servicetypeHandlingQuery';
import ServiceTypeHeader from './ServiceTypeHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */

function ServiceType() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams();
	const { productId } = routeParams;
	// const {
	// 	data: product,
	// 	isLoading,
	// 	isError
	// } = useGetECommerceProductQuery(productId, {
	// 	skip: !productId || productId === 'new'
	// });

	const {
		data: serviceType,
		isLoading: serviceTypeLoading,
		isError: serviceTypeError
	} = useGetSingleServiveType(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			title: '',
			description: ''
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
	// useEffect(() => {
	// 	if (product) {
	// 		reset({ ...product });
	// 	}
	// }, [product, reset]);

	useEffect(() => {
		if (serviceType?.data) {
			reset({ ...serviceType?.data });
		}
	}, [serviceType?.data, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }
	if (serviceTypeLoading) {
		return <FuseLoading />;
	}
	/**
		isError: 
	 * Show Message if the requested products is not exists 
	 */

	if (
		// isError && productId !== 'new'
		serviceTypeError &&
		productId !== 'new'
	) {
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
					There is no such product!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/packages/servicetypes"
					color="inherit"
				>
					Go to Service Types Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	// if (_.isEmpty(form) || (product && routeParams.productId !== product.id && routeParams.productId !== 'new')) {
	// 	return <FuseLoading />;
	// }

	if (
		_.isEmpty(form) ||
		(serviceType?.data?.servicetype &&
			routeParams.productId !== serviceType?.data?.servicetype.id &&
			routeParams.productId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ServiceTypeHeader />}
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
							{/* <Tab
								className="h-64"
								label="Product Images"
							/> */}
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
								label="Shipping"
							/> */}
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							{/* <div className={tabValue !== 1 ? 'hidden' : ''}>
								<ProductImagesTab />
							</div>

							<div className={tabValue !== 2 ? 'hidden' : ''}>
								<PricingTab />
							</div>

							<div className={tabValue !== 3 ? 'hidden' : ''}>
								<InventoryTab />
							</div>

							<div className={tabValue !== 4 ? 'hidden' : ''}>
								<ShippingTab />
							</div> */}
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default ServiceType;
