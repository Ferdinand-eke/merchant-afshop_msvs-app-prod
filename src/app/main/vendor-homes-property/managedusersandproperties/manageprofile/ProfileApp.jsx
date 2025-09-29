import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Box from '@mui/material/Box';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import AboutTab from './tabs/about/AboutTab';
import PhotosVideosTab from './tabs/photos-videos/PhotosVideosTab';
import TimelineTab from './tabs/timeline/TimelineTab';
import { useNavigate, useParams } from 'react-router';
import { useGetUserDataById } from 'src/app/aaqueryhooks/usersHandlingQuery';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useTheme } from "@mui/material/styles";

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		'& > .container': {
			maxWidth: '100%'
		}
	}
}));

/**
 * The profile page.
 */
function ProfileApp() {
	const theme = useTheme();
	const navigate = useNavigate();
	const routeParams = useParams();
	// const { id: contactId } = routeParams;
	const { userId } = routeParams;

	
	// console.log("User-Id to find DATA", userId)
	const {data:singleUser, isLoading:singleUserIsLoading} = useGetUserDataById(userId)

	// console.log("SINGLE-USER DATA", singleUser?.data)
	const [selectedTab, setSelectedTab] = useState(0);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	return (
		<Root
			header={
				<div className="flex flex-col w-full">
					
					<motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
          >
            <Typography
              className="flex items-center sm:mb-12"
              // component={Link}
              // to="/property/managed-listings"
              onClick={() => navigate(-1)}
              role="button"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Listings</span>
            </Typography>
          </motion.div>

					<div className="mt-20 flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
						<div className="-mt-96 lg:-mt-88 rounded-full">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.1 } }}
							>
								<Avatar
									sx={{ borderColor: 'background.paper' }}
									className="w-128 h-128 border-4"
									src="assets/images/avatars/male-04.jpg"
									alt="User avatar"
								/>
							</motion.div>
						</div>

						<div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
							<Typography className="text-lg font-bold leading-none">{singleUser?.data?.name}</Typography>
							{/* <Typography color="text.secondary">London, UK</Typography> */}
						</div>

						<div className="hidden lg:flex h-32 mx-32 border-l-2" />

						{/* <div className="flex items-center mt-24 lg:mt-0 space-x-24">
							<div className="flex flex-col items-center">
								<Typography className="font-bold">200k</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									FOLLOWERS
								</Typography>
							</div>
							<div className="flex flex-col items-center">
								<Typography className="font-bold">1.2k</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									FOLLOWING
								</Typography>
							</div>
						</div> */}

						<div className="flex flex-1 justify-end my-16 lg:my-0">
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								indicatorColor="primary"
								textColor="inherit"
								variant="scrollable"
								scrollButtons={false}
								className="-mx-4 min-h-40"
								classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
								TabIndicatorProps={{
									children: (
										<Box
											sx={{ bgcolor: 'text.disabled' }}
											className="w-full h-full rounded-full opacity-20"
										/>
									)
								}}
							>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="Approved"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="Un-Approved"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="Approvals On Appeal"
								/>
							</Tabs>
							{/* <Typography className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									
								>Timeline</Typography> */}
								{/* <Button
										component={Link}
										to={`/userlistings/managed-user-listings/${row.original.id}/manage`}
								variant="contained"
								color="secondary"
								size="small"
							>
								Add listings To User Profile
							</Button> */}

							<Button
						className=""
						variant="contained"
						color="secondary"
						component={NavLinkAdapter}
						to="/userlistings/managed-user-listings/new"
						size={isMobile ? 'small' : 'medium'}
					>
						<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
						<span className="mx-4 sm:mx-8">Add Property/Listing</span>
					</Button>
						</div>
					</div>
				</div>
			}
			
			content={
				<div className="flex flex-auto justify-center w-full max-w-5xl mx-auto p-24 sm:p-32">
					{/* <TimelineTab  listings={singleUser?.data?.listings} loading={singleUserIsLoading} /> */}
					{selectedTab === 0 && <TimelineTab  listings={singleUser?.data?.listings} loading={singleUserIsLoading} />}
					{/* {selectedTab === 1 && <AboutTab />} */}
					{selectedTab === 1 && <PhotosVideosTab />}
					{selectedTab === 2 && <PhotosVideosTab />}
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default ProfileApp;
