import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
// import { useGetProfilePhotosVideosQuery } from '../../ProfileApi';
import { Box, Drawer } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { lighten } from '@mui/material/styles';
import React from 'react';
import useMyShopFoodMartMenus from 'app/configs/data/server-calls/foodmartmenuitems/useShopFoodMartMenu';
import MerchantShopClientErrorPage from 'src/app/main/MerchantClientErrorPage';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
import FoodMartMenuPanel from '../../formpanels/FoodMartMenuPanel';

/**
 * The photos videos tab.
 */
function PhotosVideosTab(props) {
	const { merchantData, foodMart } = props;

	const { data: martMenu, isLoading: martMenuLoading, error } = useMyShopFoodMartMenus(foodMart?.id);
	const [openNewEntry, setOpenNewEntry] = React.useState(false);

	console.log('MART__MENUS', martMenu?.data?.foodmartmenus);

	const toggleNewEntryDrawer = (newOpen) => () => {
		setOpenNewEntry(newOpen);
	};

	const addFoodMartMenu = (
		<Box
			sx={{ width: 350 }}
			sm={{ width: 250 }}
			role="presentation"
		>
			<FoodMartMenuPanel toggleNewEntryDrawer={toggleNewEntryDrawer} />
		</Box>
	);

	if (martMenuLoading) {
		return <FuseLoading />;
	}

	if (error) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<MerchantShopClientErrorPage message="Error occured while retrieving menu" />
			</div>
		);
	}

	if (!martMenu?.data?.foodmartmenus) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no food marts on your profile currently!
				</Typography>
			</div>
		);
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="w-full"
			>
				<div className="md:flex">
					<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
						<Card
							component={motion.div}
							variants={item}
							className="w-full overflow-hidden w-full mb-32"
						>
							<Box
								className="card-footer flex items-center flex-row border-t-1 px-24 py-12"
								sx={{
									backgroundColor: (theme) =>
										theme.palette.mode === 'light'
											? lighten(theme.palette.background.default, 0.4)
											: lighten(theme.palette.background.default, 0.02)
								}}
							>
								<div className="flex flex-1 items-center">
									<IconButton aria-label="Add photo">
										<FuseSvgIcon size={20}>heroicons-solid:photograph</FuseSvgIcon>
									</IconButton>
									<IconButton aria-label="Mention somebody">
										<FuseSvgIcon size={20}>heroicons-solid:user</FuseSvgIcon>
									</IconButton>
									<IconButton aria-label="Add location">
										<FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
									</IconButton>
								</div>

								<div>
									<Button
										variant="contained"
										color="secondary"
										size="small"
										aria-label="post"
										onClick={toggleNewEntryDrawer(true)}
									>
										Post Menu
									</Button>
								</div>
							</Box>
						</Card>

						<div className="mb-48">
							<div className="overflow-hidden flex flex-row flex-wrap -m-8">
								{martMenu?.data?.foodmartmenus?.map((menu) => (
									<div
										className="w-full sm:w-1/2 md:w-1/4 p-8"
										key={menu.id}
									>
										<ImageListItem
											component={motion.div}
											variants={item}
											className="w-full h-100 rounded-16 shadow overflow-hidden"
										>
											{menu.imageSrc ? (
												<img
													src={menu.imageSrc}
													alt={menu.title}
													height={60}
												/>
											) : (
												<img
													src="assets/images/apps/ecommerce/product-image-placeholder.png"
													alt={menu.title}
												/>
											)}
											<ImageListItemBar
												className="cursor-pointer"
												onClick={() => {}}
												title={menu.title}
												actionIcon={
													<IconButton
														size="large"
														onClick={() => {}}
													>
														<Typography className="text-white">
															{formatCurrency(menu.price)}
														</Typography>
													</IconButton>
												}
											/>
										</ImageListItem>
										<Button className="w-full">
											<Typography>Update</Typography>
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			<Drawer open={openNewEntry}>{addFoodMartMenu}</Drawer>
		</>
	);
}

export default PhotosVideosTab;
