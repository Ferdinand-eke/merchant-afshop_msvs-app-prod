import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Box, Paper, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSingleShopProduct } from 'app/configs/data/server-calls/products/useShopProducts';
import useGetMyShopDetails from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import ProductHeader from './ShopProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import InventoryTab from './tabs/InventoryTab';
import PricingTab from './tabs/PricingTab';
import ProductImagesTab from './tabs/ProductImagesTab';
import ShippingTab from './tabs/ShippingTab';
import ProductPageLoading from './components/ProductPageLoading';
import ProductModel from './models/ProductModel';
/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */
function ShopProduct() {
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
	const { data: shopData, isLoading: shopDataLoading } = useGetMyShopDetails();
	const {
		data: products,
		isLoading,
		isError
	} = useSingleShopProduct(productId, {
		skip: !productId || productId === 'new'
	});

	console.log('AUT_SHOP_DATA', shopData?.data);

	// Persistent tab state using localStorage
	const TAB_STORAGE_KEY = `product_tab_${productId}`;
	const [tabValue, setTabValue] = useState(() => {
		const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
		return savedTab ? parseInt(savedTab, 10) : 0;
	});

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
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
		if (products?.data?.product) {
			reset({ ...products?.data?.product });
		}
	}, [products?.data?.product, reset]);

	/**
	 * Tab Change with localStorage persistence
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
		localStorage.setItem(TAB_STORAGE_KEY, value.toString());
	}

	if (isLoading || shopDataLoading) {
		return (
			<ProductPageLoading
				message={productId === 'new' ? 'Preparing new product form...' : 'Loading product details...'}
			/>
		);
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
					There is no such product!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/shopproducts-list/products"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(products?.data?.product &&
			routeParams.productId !== products?.data?.product.slug &&
			routeParams.productId !== 'new')
	) {
		return <ProductPageLoading message="Setting up product form..." />;
	}

	const tabConfig = [
		{ label: 'Basic Info', icon: 'heroicons-outline:information-circle' },
		{ label: 'Product Images', icon: 'heroicons-outline:photograph' },
		{ label: 'Pricing', icon: 'heroicons-outline:currency-dollar' },
		{ label: 'Inventory', icon: 'heroicons-outline:cube' },
		{ label: 'Shipping', icon: 'heroicons-outline:truck' }
	];

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
				content={
					<>
						<Paper
							elevation={0}
							sx={{
								borderBottom: 1,
								borderColor: 'divider',
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? alpha(theme.palette.background.default, 0.4)
										: alpha(theme.palette.background.paper, 0.6)
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
										minHeight: 72,
										textTransform: 'none',
										fontSize: '1.475rem',
										fontWeight: 500,
										transition: 'all 0.2s',
										'&:hover': {
											backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08)
										},
										'&.Mui-selected': {
											color: 'secondary.main',
											fontWeight: 600
										}
									}
								}}
							>
								{tabConfig.map((tab, index) => (
									<Tab
										key={index}
										className="h-72"
										icon={<FuseSvgIcon size={20}>{tab.icon}</FuseSvgIcon>}
										iconPosition="start"
										label={tab.label}
									/>
								))}
							</Tabs>
						</Paper>
						<Box className="p-16 sm:p-24 lg:p-32 max-w-5xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className={tabValue !== 0 ? 'hidden' : ''}>
									<BasicInfoTab />
								</div>

								<div className={tabValue !== 1 ? 'hidden' : ''}>
									<ProductImagesTab />
								</div>

								<div className={tabValue !== 2 ? 'hidden' : ''}>
									<PricingTab shopData={shopData?.data?.merchant} />
								</div>

								<div className={tabValue !== 3 ? 'hidden' : ''}>
									<InventoryTab shopData={shopData?.data?.merchant} />
								</div>

								<div className={tabValue !== 4 ? 'hidden' : ''}>
									<ShippingTab />
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

export default ShopProduct;
