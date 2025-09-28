import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { useGetProfileAboutQuery } from "../../ProfileApi";
import { Box, Drawer, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import RoomsTable from "./RoomsTable";
import BasicInfoRoomTabProperty from "./BasicInfoRoomProperty";
import { useGetRoomsFromBookingProperty } from "app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps";
import { useState } from "react";
import RoomMenuPanel from "./formpanels/RoomMenuPanel";

/**
 * The about tab.
 */
function AboutManageRoomsTab(props) {
  const {Listing} = props
  const routeParams = useParams();
  const { productId } = routeParams;
  const [roomId, setRoomId] = useState("");
  const {
    data: rooms,
    isLoading: roomsIsLoading,
    isError: roomsIsError,
  } = useGetRoomsFromBookingProperty(productId, {
    skip: !productId,
  });

  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const [openNewEntry, setOpenNewEntry] = React.useState(false);
  const toggleNewEntryDrawer = (newOpen) => () => {
    setOpenNewEntry(newOpen);
  };

  const addRoomMenu = (
    <Box sx={{ width: 350 }} sm={{ width: 250 }} role="presentation">
      <RoomMenuPanel
        toggleNewEntryDrawer={toggleNewEntryDrawer}
        roomId={roomId}
        apartmentId={Listing?.id}
      />
    </Box>
  );

  // console.log("ROOMS-ON-PROPERTY", rooms?.data?.rooms)

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <div className="md:flex">
          <div className="mr-16">
            <RoomsTable
              rooms={rooms?.data?.rooms}
              roomsIsLoading={roomsIsLoading}
              roomsIsError={roomsIsError}
              setRoomId={setRoomId}
            />
          </div>

          <div className="flex flex-col md:w-320 ">
            <Card
              component={motion.div}
              variants={item}
              className="w-full mb-32 px-8"
            >
              <Button
                className="whitespace-nowrap mx-4"
                variant="contained"
                color="primary"
                onClick={toggleNewEntryDrawer(true)}
              >
                Add Room Drawer
              </Button>
              <div className="flex items-center px-32 pt-24">
                <Typography className="flex flex-1 text-2xl font-semibold leading-tight">
                  Room Details
                </Typography>

                {/* <Button className="-mx-8" size="small">
                Add images
              </Button> */}
              </div>

              {/* <BasicInfoRoomTabProperty roomId={roomId} apartmentId={productId} /> */}
            </Card>
          </div>
        </div>
      </motion.div>

      <Drawer open={openNewEntry}>{addRoomMenu}</Drawer>
    </>
  );
}

export default AboutManageRoomsTab;
