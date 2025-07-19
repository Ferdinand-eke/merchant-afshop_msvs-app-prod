import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
// import { useGetProfilePhotosVideosQuery } from '../../ProfileApi';
import { Box, Drawer } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { toggleFoodMartMenuPanel } from '../../formpanels/foodmartMenuPanelSlice';
import { useAppDispatch } from 'app/store/hooks';
import { lighten } from '@mui/material/styles';
import FoodMartMenuPanel from '../../formpanels/FoodMartMenuPanel';
import React from 'react';
import useMyShopFoodMartMenus from 'app/configs/data/server-calls/foodmartmenuitems/useShopFoodMartMenu';
import { useParams } from 'react-router';
import MerchantShopClientErrorPage from 'src/app/main/MerchantClientErrorPage';

/**
 * The photos videos tab.
 */
function PhotosVideosTab(props) {
	const {merchantData} = props;
	const routeParams = useParams();
  const { foodMartId } = routeParams;

//   console.log("Merchant in photos videos tab", merchantData)

	const { data: martMenu, isLoading: martMenuLoading, error } = useMyShopFoodMartMenus(foodMartId)
	const [openNewEntry, setOpenNewEntry] = React.useState(false);

	const toggleNewEntryDrawer = (newOpen) => () => {
		setOpenNewEntry(newOpen);
	  };

	  const addFoodMartMenu = (
		<Box sx={{ width: 350 }} sm={{ width: 250 }} role="presentation">
		  <FoodMartMenuPanel 
		  toggleNewEntryDrawer={toggleNewEntryDrawer}
		  />
		</Box>
	  );

	if (martMenuLoading) {
		return <FuseLoading />;
	}

	if(error){
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				{/* <Typography
					color="text.secondary"
					variant="h5"
				>
					Netork Error!
				</Typography> */}
				<MerchantShopClientErrorPage  message={`Error occured while retrieving menu`}/>
			</div>
		);
	}

	if (!martMenu?.data?.data) {
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
						{/* <Input
							className="p-24 w-full"
							classes={{ root: 'text-14' }}
							placeholder="Write something.."
							multiline
							rows="6"
							margin="none"
							disableUnderline
						/> */}
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
									// onClick={() => dispatch(toggleFoodMartMenuPanel())}
									onClick={toggleNewEntryDrawer(true)}

								>
									Post Menu
								</Button>
							</div>
						</Box>
					</Card>
					

					{/* {martMenu?.data?.data.map((menu) => ( */}
						<div
							// key={menu._id}
							className="mb-48"
						>
							

							<div className="overflow-hidden flex flex-row flex-wrap -m-8">
							
						
								{martMenu?.data?.data.map((menu) => (
									<div
										className="w-full sm:w-1/2 md:w-1/4 p-8"
										key={menu._id}
									>
										<ImageListItem
											component={motion.div}
											variants={item}
											className="w-full h-100 rounded-16 shadow overflow-hidden"
										>
											{menu.imageSrc ? <img
												src={menu.imageSrc}
												alt={menu.title}
												// height={60}
												// className='max-height-[100px]'
											/> : <img
											// src={menu.imageSrc}
											// height={60}
											src="assets/images/apps/ecommerce/product-image-placeholder.png"
											alt={menu.title}
										/>
											
										}
											{/* <img
												src={menu.imageSrc}
												alt={menu.title}
											/> */}
											<ImageListItemBar
											className='cursor-pointer'
											onClick={() => {}}
												title={menu.title}
												actionIcon={
													<IconButton size="large">
														{/* <FuseSvgIcon className="text-white opacity-75">
															heroicons-outline:information-circle
														</FuseSvgIcon> */}
														<Typography className='text-white'>{menu.price}</Typography>
													</IconButton>
												}
											/>
										</ImageListItem>
									</div>
								))}
							</div>
						</div>
					{/* // ))} */}

					{/* {photosVideos.map((period) => (
						<div
							key={period.id}
							className="mb-48"
						>
							<ListSubheader
								component={motion.div}
								variants={item}
								className="flex items-center px-0 mb-24 bg-transparent"
							>
								<Typography className="text-2xl font-semibold leading-tight">{period.name}</Typography>
								<Typography
									className="mx-12 font-medium leading-tight"
									color="text.secondary"
								>
									{period.info}
								</Typography>
							</ListSubheader>

							<div className="overflow-hidden flex flex-wrap -m-8">
							
						
								{period.media.map((media) => (
									<div
										className="w-full sm:w-1/2 md:w-1/4 p-8"
										key={media.preview}
									>
										<ImageListItem
											component={motion.div}
											variants={item}
											className="w-full rounded-16 shadow overflow-hidden"
										>
											<img
												src={media.preview}
												alt={media.title}
											/>
											<ImageListItemBar
												title={media.title}
												actionIcon={
													<IconButton size="large">
														<FuseSvgIcon className="text-white opacity-75">
															heroicons-outline:information-circle
														</FuseSvgIcon>
													</IconButton>
												}
											/>
										</ImageListItem>
									</div>
								))}
							</div>
						</div>
					))} */}
				</div>
			</div>





	
		</motion.div>


		<Drawer
        open={openNewEntry}
      >
        {addFoodMartMenu}
      </Drawer>
		</>
	);
}

export default PhotosVideosTab;
