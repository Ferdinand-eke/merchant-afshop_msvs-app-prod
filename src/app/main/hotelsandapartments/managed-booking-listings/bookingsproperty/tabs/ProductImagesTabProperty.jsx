import { orange } from "@mui/material/colors";
import { lighten, styled } from "@mui/material/styles";
import clsx from "clsx";
import FuseUtils from "@fuse/utils";
import { Controller, useFormContext } from "react-hook-form";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import { Divider, Tab } from "@mui/material";
import { useParams } from "react-router";
import Resizer from "src/Resizer";
import { useState } from "react";

const Root = styled("div")(({ theme }) => ({
  "& .productImageFeaturedStar": {
    position: "absolute",
    top: 0,
    right: 0,
    color: orange[400],
    opacity: 0,
  },
  "& .productImageUpload": {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  "& .productImageItem": {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& .productImageFeaturedStar": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      pointerEvents: "none",
      boxShadow: theme.shadows[3],
      "& .productImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover .productImageFeaturedStar": {
        opacity: 1,
      },
    },
  },
}));

/**
 * The product images tab.
 */
function ProductImagesTabProperty() {
  const methods = useFormContext();
  const routeParams = useParams();
  const { productId } = routeParams;
  const { control, watch, set, setValue } = methods;

  const images = watch("images");
  const imageSrcs = watch("imageSrcs");
//   const [formImages, setFormImages] = useState([]);

// console.log("FORM_IMAGES", images)
  const fileUploadAndResize = (e) => {
    let files = e.target.files; // 3
    let allUploadedFiles = [];
    if (files) {
      //   setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer?.imageFileResizer(
          files[i],
          720,
          720,
          'JPEG PNG',
          100,
          0,
          (uri) => {
            if (uri) {
              allUploadedFiles.push(uri);
              //   formik?.setValues({
              //     ...formik?.values,
              //     images: allUploadedFiles,
              //   });
			  images.push(uri)
            //   setFormImages(allUploadedFiles);
			//   setValue(images, allUploadedFiles)
			
            } else {
              return allUploadedFiles;
            }
          },
          'base64'
        );
      }
    }
  };

  const deleteAnArrayImage = (item) => {

    var filtered = images.filter(function (el) {
      return el != item;
    });
    setValue('images', filtered);
  };

  return (
    <Root>
      <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
        {productId === "new" && (
          <>
            {/* for new listings only */}


            <div className="px-4 pb-4 mt-5 flex items-center justify-center cursor-pointer relative">
              {/* <FuseSvgIcon className="w-4 h-4 mr-2">
				heroicons-solid:upload
			</FuseSvgIcon> */}

			{/* <Controller
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
                id="horizontal-form-1"
                type="file"
                className="w-full h-full top-0 left-0 absolute opacity-0"
                multiple
                accept="images/*"

				  onChange={async (e) =>  {
					 fileUploadAndResize
					setValue(images, formImages)
				  }}
              />
              <FuseSvgIcon size={32} color="action">
                heroicons-outline:upload
              </FuseSvgIcon>
            </Box>
          )}
        /> */}

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
                id="horizontal-form-1"
                type="file"
                className="w-full h-full top-0 left-0 absolute opacity-0"
                multiple
                accept="images/*"

				//   onChange={async (e) =>  {
				// 	 fileUploadAndResize
				// 	setValue(images, formImages)
				//   }}
				onChange={fileUploadAndResize}
              />
              <FuseSvgIcon size={32} color="action">
                heroicons-outline:upload
              </FuseSvgIcon>
            </Box>
            

              {/* <span className="text-primary mr-1 cursor-pointer">
                Upload images
              </span> */}
            
            </div>

            <Controller
              name="featuredImageId"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    {images?.map((media, index) => (
                      <div
                        role="button"
                        tabIndex={0}
                        className={clsx(
                          "productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg",
                          media=== value && "featured"
                        )}
                        key={index}
                      >
                        <FuseSvgIcon className="productImageFeaturedStar"
						onClick={() => deleteAnArrayImage(media)}
						>
                          heroicons-solid:trash
                        </FuseSvgIcon>
                        <img
                          className="max-w-none w-auto h-full"
                          src={media}
                          alt="product"
                        />
                      </div>
                    ))}
                  </>
                );
              }}
            />

          </>
        )}

        <Divider />

        <Controller
          name="featuredImageId"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => {
            return (
              <>
                {imageSrcs?.map((media,) => (
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
                    <FuseSvgIcon className="productImageFeaturedStar"
					onClick={() => {}}
					>
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
    </Root>
  );
}

export default ProductImagesTabProperty;
