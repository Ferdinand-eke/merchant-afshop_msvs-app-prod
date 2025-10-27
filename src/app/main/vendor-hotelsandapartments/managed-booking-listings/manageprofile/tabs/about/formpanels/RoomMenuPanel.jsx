import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks";
import { useLocation, useParams } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import { toast } from "react-toastify";
import {
  closeRoomMenuPanel,
  selectRoomMenuPanelState,
  toggleRoomMenuPanel,
} from "./roomMenuPanelSlice";
import { useGetAllNotificationsQuery } from "src/app/main/apps/notifications/NotificationApi";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import { lighten } from "@mui/material/styles";
import FuseUtils from "@fuse/utils";
import clsx from "clsx";
import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  useAddRoomPropertyMutation,
  useGetSingleRoomOfProperty,
  useRoomOnPropertyUpdateMutation,
} from "app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps";
import { motion } from "framer-motion";

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.background.default,
    width: 320,
  },
}));

const schema = z.object({
  title: z
    .string()
    .nonempty("You must enter a property name")
    .min(5, "The property title must be at least 5 characters"),
  // foodMartCountry: z.string().nonempty("Country is required"),
  // foodMartState: z.string().nonempty("State is required"),
  // foodMartLga: z.string().nonempty("L.G.A/County is required"),
  // price: z.number(),
  // z.number().safe(),
});

export const categoryset = [
  {
    label: "african dish",
  },
  {
    label: "continental",
  },
  {
    label: "drink",
  },
  {
    label: "pasta",
  },
  {
    label: "pastry",
  },
];

export const unitset = [
  {
    label: "units",
  },
  {
    label: "plates",
  },
  {
    label: "litres",
  },
  {
    label: "pieces",
  },
  // {
  // 	label: "pastry",
  //   },
];

export const statuses = ["AVAILABLE", "BOOKED", "MAINTENANCE"];

/**
 * The notification panel.
 */
function RoomMenuPanel(props) {
  const { roomId,setRoomId, apartmentId, toggleNewEntryDrawer } = props;

  const routeParams = useParams();
  // const { foodMartId } = routeParams;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRoomMenuPanelState);

  // Track images to be deleted
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Track if we've already loaded initial room data (to prevent repeated resets)
  const hasLoadedInitialData = useRef(false);

  useEffect(() => {
    if (state) {
      dispatch(closeRoomMenuPanel());
    }
  }, [location, dispatch]);

  function handleClose() {
    toggleNewEntryDrawer(false);
    setRoomId(null);
    setImagesToDelete([]);
    hasLoadedInitialData.current = false; // Reset for next time
  }

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      roomNumber: "",
      roomStatus: "",
      price: "",
      title: "",
      description: "",
      bookingPropertyId: apartmentId,
      images: [],
    },
    // resolver: zodResolver(schema)
  });
  const { reset, watch } = methods;
  const form = watch();

  // const methods = useFormContext();
  const { control, formState, getValues } = methods;
  const { isValid, dirtyFields, errors } = formState;

  const addRoomProperty = useAddRoomPropertyMutation();
  const updateRoomOnBookingsProperty = useRoomOnPropertyUpdateMutation();

  const {
    data: room,
    isLoading,
    isError,
  } = useGetSingleRoomOfProperty(roomId, {
    skip: !roomId,
    // || roomId === 'new'
  });
  console.log("ROOM_DATA_FOR_EDITING", room?.data?.room);

  const images = watch("images");
  const imageSrcs = watch("imageSrcs");

  /**
   * Remove an existing image (from imageSrcs)
   * Marks it for deletion but doesn't delete immediately
   */
  const handleRemoveExistingImage = (imageId) => {
    const currentImageSrcs = getValues("imageSrcs") || [];
    const imageToRemove = currentImageSrcs.find(img => img.id === imageId);

    if (imageToRemove) {
      // Add to deletion list
      setImagesToDelete(prev => [...prev, imageToRemove]);

      // Remove from form imageSrcs
      const updatedImageSrcs = currentImageSrcs.filter(img => img.id !== imageId);
      methods.setValue("imageSrcs", updatedImageSrcs, { shouldDirty: true });

      toast.info("Image marked for deletion. Click Save to confirm.");
    }
  };

  /**
   * Remove a newly uploaded image (from images array)
   * This removes it immediately as it hasn't been saved yet
   */
  const handleRemoveNewImage = (imageId) => {
    const currentImages = getValues("images") || [];
    const updatedImages = currentImages.filter(img => img.id !== imageId);
    methods.setValue("images", updatedImages, { shouldDirty: true });
    toast.success("New image removed");
  };

  function handleCreateRoomOnApartmentCall() {
    parseInt(getValues().roomNumber);
    parseInt(getValues().price);
    const formattedData = {
      ...getValues(),
      price: parseInt(getValues().price),
      // Only send new images for creation
      images: getValues().images || [],
    };
    addRoomProperty.mutate(formattedData);
  }

  function handleSaveRoomOnApartment() {
    parseInt(getValues().roomNumber);
    parseInt(getValues().price);

    const formattedData = {
      ...getValues(),
      price: parseInt(getValues().price),
      // Send new images to be added
      images: getValues().images || [],
      // Send IDs of images to delete
      imagesToDelete: imagesToDelete.map(img => img.id),
      // Keep existing images that weren't deleted
      imageSrcs: getValues("imageSrcs") || [],
    };

    updateRoomOnBookingsProperty.mutate(formattedData);
  }

  function handleRemoveRoomOnApartment() {
    console.log("Deleting BookingProperty_List-Values", getValues());
  }

  useEffect(() => {
    if (addRoomProperty.isSuccess) {
      reset({});
      methods.clearErrors();
      setImagesToDelete([]);
      hasLoadedInitialData.current = false; // Reset for next room
    }
  }, [addRoomProperty.isSuccess]);

  useEffect(() => {
    if (updateRoomOnBookingsProperty.isSuccess) {
      // Clear deletion queue after successful update
      setImagesToDelete([]);
      toast.success("Room updated successfully with image changes!");
    }
  }, [updateRoomOnBookingsProperty.isSuccess]);

  // Reset the flag and form whenever roomId changes (switching rooms)
  useEffect(() => {
    hasLoadedInitialData.current = false;
    setImagesToDelete([]);

    // Reset form to empty state when switching rooms or opening new room form
    if (!roomId) {
      reset({
        roomNumber: "",
        roomStatus: "",
        price: "",
        title: "",
        description: "",
        bookingPropertyId: apartmentId,
        images: [],
        imageSrcs: []
      });
    }
  }, [roomId, reset, apartmentId]);

  // Load room data only once when it becomes available
  useEffect(() => {
    if (roomId && room?.data?.room && !hasLoadedInitialData.current) {
      reset({ ...room?.data?.room });
      setImagesToDelete([]);
      hasLoadedInitialData.current = true;
    }
  }, [room, reset, roomId]);
  // console.log("ROOM_DATA__&&__IMAGES", room?.data?.room);

  // if (isLoading) {
  //   return <FuseLoading />;
  // }

  return (
    <FusePageSimple
      content={
        <>
          <div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
            <div className="flex flex-auto justify-between items-center">
              <Typography className="text-2xl font-extrabold leading-none tracking-tight mb-20">
                Manage Room.
              </Typography>
            </div>

            <IconButton
              className="absolute right-0 top-0 z-999 m-4"
              // onClick={toggleNewEntryDrawer(false)}
              onClick={(e) => handleClose(e)}
              size="large"
            >
              <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
            </IconButton>

            <FuseScrollbars className="flex flex-col p-16 h-full">
              <div className="flex flex-auto flex-col">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16"
                      required
                      label="Name"
                      autoFocus
                      id="title"
                      variant="outlined"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors?.title?.message}
                    />
                  )}
                />

                <Controller
                  name={`roomNumber`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      label="Room Number"
                      id="roomNumber"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Room Number
                          </InputAdornment>
                        ),
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name={`price`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      label="Number of Sitting rooms"
                      id="price"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            price
                          </InputAdornment>
                        ),
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                <>
                  <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
                    Room Status
                  </Typography>
                  <Controller
                    name={`roomStatus`}
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="mt-8 mb-16"
                        id="roomStatus"
                        label="business country"
                        fullWidth
                        defaultValue=""
                        onChange={onChange}
                        value={value === undefined || null ? "" : value}
                        error={!!errors.roomStatus}
                        helpertext={errors?.roomStatus?.message}
                      >
                        <MenuItem value="">Select a status</MenuItem>
                        {statuses &&
                          statuses?.map((index) => (
                            <MenuItem key={index} value={index}>
                              {index}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16"
                      id="description"
                      label="Description"
                      type="text"
                      multiline
                      rows={5}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
                  {/* Upload Button */}
                  <Controller
                    name="images"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Box
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? lighten(theme.palette.background.default, 0.4)
                              : lighten(theme.palette.background.default, 0.02),
                        }}
                        component="label"
                        htmlFor="button-file"
                        className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-file"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e?.target?.files?.[0];
                                if (!file) {
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = () => {
                                  resolve({
                                    id: FuseUtils.generateGUID(),
                                    url: `data:${file.type};base64,${btoa(reader.result)}`,
                                    type: "image",
                                  });
                                };
                                reader.onerror = reject;
                                reader.readAsBinaryString(file);
                              });
                            }
                            const newImage = await readFileAsync();
                            onChange([...(value || []), newImage]);
                          }}
                        />
                        <FuseSvgIcon size={32} color="action">
                          heroicons-outline:upload
                        </FuseSvgIcon>
                      </Box>
                    )}
                  />

                  {/* Existing Images from Server (imageSrcs) */}
                  {imageSrcs && imageSrcs.length > 0 && (
                    <>
                      <Typography className="w-full text-sm font-semibold px-12 mb-8">
                        Existing Images ({imageSrcs.length})
                      </Typography>
                      {imageSrcs.map((media) => (
                        <div
                          className="productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden shadow hover:shadow-lg"
                          key={media.id || media.public_id}
                        >
                          <IconButton
                            className="absolute top-0 right-0 z-10"
                            onClick={() => handleRemoveExistingImage(media.id)}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.7)" },
                            }}
                          >
                            <FuseSvgIcon size={16} className="text-white">
                              heroicons-outline:trash
                            </FuseSvgIcon>
                          </IconButton>
                          <img
                            className="max-w-none w-auto h-full"
                            src={media.url}
                            alt="room"
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {/* New Uploaded Images (images) */}
                  {images && images.length > 0 && (
                    <>
                      <Typography className="w-full text-sm font-semibold px-12 mb-8 text-green-600">
                        New Images to Upload ({images.length})
                      </Typography>
                      {images.map((media) => (
                        <div
                          className="productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden shadow hover:shadow-lg border-2 border-green-500"
                          key={media.id}
                        >
                          <IconButton
                            className="absolute top-0 right-0 z-10"
                            onClick={() => handleRemoveNewImage(media.id)}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.7)" },
                            }}
                          >
                            <FuseSvgIcon size={16} className="text-white">
                              heroicons-outline:x
                            </FuseSvgIcon>
                          </IconButton>
                          <img
                            className="max-w-none w-auto h-full"
                            src={media.url}
                            alt="new upload"
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {/* Show message if no images */}
                  {(!imageSrcs || imageSrcs.length === 0) && (!images || images.length === 0) && (
                    <Typography className="w-full text-center text-gray-500 py-20">
                      No images uploaded. Click the upload button to add images.
                    </Typography>
                  )}
                </div>
              </div>
              <motion.div
                className="flex flex-1 w-full pb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              >
                {roomId ? (
                  <>
                    <Button
                      className="whitespace-nowrap mx-4"
                      variant="contained"
                      color="secondary"
                      onClick={handleRemoveRoomOnApartment}
                      startIcon={
                        <FuseSvgIcon className="hidden sm:flex">
                          heroicons-outline:trash
                        </FuseSvgIcon>
                      }
                    >
                      Remove
                    </Button>
                    <Button
                      className="whitespace-nowrap mx-4"
                      variant="contained"
                      color="secondary"
                      disabled={
                        _.isEmpty(dirtyFields) ||
                        !isValid ||
                        updateRoomOnBookingsProperty.isLoading
                      }
                      onClick={handleSaveRoomOnApartment}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    className="whitespace-nowrap mx-4"
                    variant="contained"
                    color="secondary"
                    disabled={
                      _.isEmpty(dirtyFields) ||
                      !isValid ||
                      addRoomProperty.isLoading
                    }
                    onClick={handleCreateRoomOnApartmentCall}
                  >
                    Add Room| On Property
                  </Button>
                )}
              </motion.div>
            </FuseScrollbars>
          </div>
        </>
      }
      //   scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default RoomMenuPanel;
