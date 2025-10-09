import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/store/hooks";
import { useLocation, useParams } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
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
import {  useGetSingleRoomOfProperty, useRoomOnPropertyUpdateMutation } from "app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps";
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


export const statuses = ["AVAILABLE", "BOOKED", "MAINTENANCE"];

/**
 * The notification panel.
 */
function UpdateRoomMenuPanel(props) {

  const {roomId, apartmentId, toggleNewEntryDrawer } = props;
  

  const routeParams = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRoomMenuPanelState);

  useEffect(() => {
    if (state) {
      dispatch(closeRoomMenuPanel());
    }
  }, [location, dispatch]);

  function handleClose() {
    toggleNewEntryDrawer(false);
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
  
    const updateRoomOnBookingsProperty = useRoomOnPropertyUpdateMutation();
  
    const {
        data: room,
        isLoading,
        isError
      } = useGetSingleRoomOfProperty(roomId, {
        skip: !roomId 
        // || roomId === 'new'
      });


  const images = watch("images");
  const imageSrcs = watch("imageSrcs");

  function handleSaveRoomOnApartment() {
    parseInt(getValues().roomNumber);
    parseInt(getValues().price);
    const formattedData = {
      ...getValues(),
      price: parseInt(getValues().price),
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
        // methods.dirtyFields.
      }
    }, [addRoomProperty.isSuccess]);
  
    useEffect(() => {
      if (room?.data?.room) {
        reset({ ...room?.data?.room });
      }
    }, [room, reset]);
  // console.log("Menu-IMAGES", images);

 
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
              onClick={toggleNewEntryDrawer(false)}
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
                                <InputAdornment position="start">Room Number</InputAdornment>
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
                                <InputAdornment position="start">price</InputAdornment>
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
                  <>
                    <Controller
                      name="images"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Box
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === "light"
                                ? lighten(theme.palette.background.default, 0.4)
                                : lighten(
                                    theme.palette.background.default,
                                    0.02
                                  ),
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
                              onChange([newImage, ...value]);
                            }}
                          />
                          <FuseSvgIcon size={32} color="action">
                            heroicons-outline:upload
                          </FuseSvgIcon>
                        </Box>
                      )}
                    />
                    <Controller
                      name="featuredImageId"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => {
                        return (
                          <>
                            {images?.map((media) => (
                              <div
                                onClick={() => onChange(media.id)}
                                onKeyDown={() => onChange(media.id)}
                                role="button"
                                tabIndex={0}
                                className={clsx(
                                  "productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg",
                                  media.id === value && "featured"
                                )}
                                key={media.id}
                              >
                                <FuseSvgIcon className="productImageFeaturedStar">
                                  heroicons-solid:star
                                </FuseSvgIcon>
                                <img
                                  className="max-w-none w-auto h-full"
                                  src={media.url}
                                  alt="product"
                                />
                              </div>
                            ))}
                          </>
                        );
                      }}
                    />
                  </>

                  <Divider />

                  <Controller
                    name="featuredImageId"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          {imageSrcs?.map((media) => (
                            <div
                              onClick={() => onChange(media.public_id)}
                              onKeyDown={() => onChange(media.public_id)}
                              role="button"
                              tabIndex={0}
                              className={clsx(
                                "productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg",
                                media.id === value && "featured"
                              )}
                              key={media.public_id}
                            >
                              <FuseSvgIcon className="productImageFeaturedStar">
                                heroicons-solid:star
                              </FuseSvgIcon>
                              <img
                                className="max-w-none w-auto h-full"
                                src={media.url}
                                alt="product"
                              />
                            </div>
                          ))}
                        </>
                      );
                    }}
                  />
                </div>
              </div>
          <motion.div
                        className="flex flex-1 w-full pb-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                      >
                        {roomId && (
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
                              Save/Update Room
                            </Button>
                          </>
                        ) }
                      </motion.div>
            </FuseScrollbars>
          </div>
        </>
      }
      //   scroll={isMobile ? "normal" : "page"}
    />
  );
}

 export default UpdateRoomMenuPanel;
