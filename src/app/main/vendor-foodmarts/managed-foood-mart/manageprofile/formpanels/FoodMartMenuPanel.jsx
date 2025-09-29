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
  closeFoodMartMenuPanel,
  selectFoodMartMenuPanelState,
  toggleFoodMartMenuPanel,
} from "./foodmartMenuPanelSlice";
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
import { useAddShopFoodMartMenuMutation } from "app/configs/data/server-calls/foodmartmenuitems/useShopFoodMartMenu";
import FusePageSimple from "@fuse/core/FusePageSimple";

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
/**
 * The notification panel.
 */
function FoodMartMenuPanel(props) {
  const { toggleNewEntryDrawer } = props;
  const generateSingleOptions = () => {
    return categoryset.map((option, index) => {
      return (
        <MenuItem key={index} value={option.label}>
          {option.label}
        </MenuItem>
      );
    });
  };

  const generateUnitOptions = () => {
    return unitset.map((option, index) => {
      return (
        <MenuItem key={index} value={option.label}>
          {option.label}
        </MenuItem>
      );
    });
  };

  const routeParams = useParams();
  const { foodMartId } = routeParams;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectFoodMartMenuPanelState);
  const addMyFoodMartMenu = useAddShopFoodMartMenuMutation();

  // const { data: notifications, isLoading } = useGetAllNotificationsQuery();
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    if (state) {
      dispatch(closeFoodMartMenuPanel());
    }
  }, [location, dispatch]);

  function handleClose() {
    toggleNewEntryDrawer(false);
  }

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      images: [],
      category: "",
      quantity: "",
      quantityUnit: "",
      martId: "",
    },
    resolver: zodResolver(schema),
  });

  const { reset, watch, control, formState, getValues, setValue } = methods;
  const { isValid, dirtyFields, errors } = formState;
  const images = watch("images");
  const imageSrcs = watch("imageSrcs");

  console.log("Menu-IMAGES", images);

  // function handleDismiss(id) {
  // 	deleteNotification(id);
  // }

  // function handleDismissAll() {
  // 	deleteAllNotifications();
  // }

  function createNewMenu() {
    setValue("martId", foodMartId);

    addMyFoodMartMenu.mutate(getValues());
  }

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageSimple
      content={
        <>
          <div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
            <div className="flex flex-auto justify-between items-center">
              <Typography className="text-2xl font-extrabold leading-none tracking-tight mb-20">
                Manage shipping route.
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
                      className="mt-40 mb-16"
                      required
                      label="Menu Title"
                      autoFocus
                      id="title"
                      variant="outlined"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors?.title?.message}
                    />
                  )}
                />

                <>
                  <Typography>Food Menu category</Typography>

                  <Controller
                    name="category"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="mt-8 mb-16"
                        id="category"
                        label="Category"
                        variant="outlined"
                        placeholder="Select a category"
                        fullWidth
                        defaultValue=""
                        onChange={onChange}
                        value={value === undefined || null ? "" : value}
                        error={!!errors.category}
                        helpertext={errors?.category?.message}
                      >
                        {generateSingleOptions()}
                      </Select>
                    )}
                  />
                </>

                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16 mx-4"
                      label=" Price"
                      id="price"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-8 mb-16"
                      label="Quantity"
                      id="quantity"
                      variant="outlined"
                      type="number"
                      fullWidth
                    />
                  )}
                />

                <>
                  <Typography>Quantity Unit</Typography>

                  <Controller
                    name="unitPerQuantity"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="mt-8 mb-16"
                        id="unitPerQuantity"
                        label="Category"
                        variant="outlined"
                        placeholder="Select a category"
                        fullWidth
                        defaultValue=""
                        onChange={onChange}
                        value={value === undefined || null ? "" : value}
                        error={!!errors.unitPerQuantity}
                        helpertext={errors?.unitPerQuantity?.message}
                      >
                        {generateUnitOptions()}
                      </Select>
                    )}
                  />
                </>

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
              </div>
              <div className="flex items-center justify-center py-16">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={createNewMenu}
                  disabled={
                    _.isEmpty(dirtyFields) ||
                    !isValid ||
                    addMyFoodMartMenu.isLoading
                  }
                  // disabled={_.isEmpty(dirtyFields) || !isValid
                >
                  Create a meal menu
                </Button>
              </div>
            </FuseScrollbars>
          </div>
        </>
      }
      //   scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default FoodMartMenuPanel;
