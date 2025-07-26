import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import AboutManageRoomsTab from "./tabs/about/AboutManageRoomsTab";
import PhotosVideosTab from "./tabs/photos-videos/PhotosVideosTab";
import TimelineTab from "./tabs/timeline/TimelineTab";
import { useSingleShopBookingsProperty } from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties";
import { useNavigate, useParams } from "react-router";
import ManageReservationPage from "./tabs/photos-videos/ManageReservationPage";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
// const Root = styled(FusePageSimple)(({ theme }) => ({
//   "& .FusePageSimple-header": {
//     backgroundColor: theme.palette.background.paper,
//     borderBottomWidth: 1,
//     borderStyle: "solid",
//     borderColor: theme.palette.divider,
//     "& > .container": {
//       maxWidth: "100%",
//     },
//   },
// }));

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
  },
}));

/**
 * The profile page.
 */
function BookingProfileApp() {
  const theme = useTheme();
  const routeParams = useParams();
  const {productId, reservationId} = routeParams;
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const {
    data: propertyList,
    isLoading,
    isError,
  } = useSingleShopBookingsProperty(productId, {
    skip: !productId 
  });
  //|| productId === "new",

  function handleTabChange(event, value) {
    setSelectedTab(value);

    /***Set selected tab on locked-On with local storage once tab is selected so as to remain on same tab when reloaded */
  }

  //   console.log("PROPERTY_LIST", propertyList);
  const navigate = useNavigate();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  useEffect(() => {
    setRightSidebarOpen(Boolean(reservationId));
  }, [reservationId]);

  const handleRightSidebarToggle = () => {
	setRightSidebarOpen(false)
	navigate(`/bookings/managed-listings/${productId}/manage`);
  }

  //   console.log("RIGHT_SIDEBAR_OPEN", rightSidebarOpen, routeParams?.reservationId);

  return (
    <Root
      header={
        <div className="flex flex-col w-full">
          <div className="mt-20 flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
             
			<div className="-mt-96 lg:-mt-88 rounded-full">
             
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.1 } }}
              >
				
                <Avatar
                  sx={{ borderColor: "background.paper" }}
                  className="w-128 h-128 border-4 mt-40"
                  src="assets/images/avatars/male-04.jpg"
                  alt="User avatar"
                />
              </motion.div>
            </div>

            <div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
              <Typography className="text-lg font-bold leading-none">
                {propertyList?.data?.bookingList?.title}
              </Typography>
              {/* <Typography color="text.secondary">London, UK</Typography> */}
			  <Typography
                className="flex items-center sm:mb-12"
                component={Link}
                role="button"
                to="/bookings/managed-listings"
                color="inherit"
              >
                <FuseSvgIcon size={20}>
                  {theme.direction === "ltr"
                    ? "heroicons-outline:arrow-sm-left"
                    : "heroicons-outline:arrow-sm-right"}
                </FuseSvgIcon>
                <span className="flex mx-4 font-medium">Property Listings</span>
              </Typography>
            </div>

            <div className="hidden lg:flex h-32 mx-32 border-l-2" />

            <div className="flex items-center mt-24 lg:mt-0 space-x-24">
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
            </div>

            <div className="flex flex-1 justify-end my-16 lg:my-0">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{
                  indicator: "flex justify-center bg-transparent w-full h-full",
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: "text.disabled" }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Timeline"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Manage Rooms"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Reservations"
                />
              </Tabs>
            </div>
          </div>
        </div>
      }


      content={
        <div className="flex flex-auto justify-center w-full max-w-5xl mx-auto p-24 sm:p-32">
          {selectedTab === 0 && <TimelineTab />}

          {selectedTab === 1 && (
            <AboutManageRoomsTab Listing={propertyList?.data?.bookingList} />
          )}

          {selectedTab === 2 && (
            <PhotosVideosTab Listing={propertyList?.data?.bookingList} />
          )}
        </div>
      }
	
      ref={pageLayout}
      rightSidebarContent={<ManageReservationPage />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
	// rightSidebarOnClose={() => handleRightSidebarToggle()}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      //   scroll={isMobile ? "normal" : "page"}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default BookingProfileApp;
