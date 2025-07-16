import { orange } from "@mui/material/colors";
import { lighten, styled } from "@mui/material/styles";
import clsx from "clsx";
import FuseUtils from "@fuse/utils";
import { Controller, useFormContext } from "react-hook-form";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import { Chip, Divider } from "@mui/material";
import { useDeleteProductSingleImage } from "app/configs/data/server-calls/products/useShopProducts";
import { useParams } from "react-router";

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
function ProductImagesTab() {
  const methods = useFormContext();
  const routeParams = useParams();
	const { productId } = routeParams;

  const { control, watch } = methods;
  const images = watch("images");
  const imageLinks = watch("imageLinks")
  const deleteSingleImage = useDeleteProductSingleImage()

  
  function handleRemoveProductImage(image_id) {

    const imageData = {
      id:productId,
      public_id:image_id
    }

		if (window.confirm("Comfirm delete of this image?")) {
			// deleteDepartment.mutate(productId)
			console.log("deleting product image...", imageData)
      deleteSingleImage.mutate(imageData)
		}
		
	}
  
  return (
    <Root>
      <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
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
                {images.map((media) => (
                  <div
                    onClick={() => onChange(media.public_id)}
                    onKeyDown={() => onChange(media.public_id)}
                    role="button"
                    tabIndex={0}
                    className={clsx(
                      "productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg",
                      media.public_id === value && "featured"
                    )}
                    key={media.public_id}
                  >
                   <div className="flex items-center justify-between">
                   {/* <FuseSvgIcon 
                   className="productImageFeaturedStar"
                   >
                      heroicons-solid:star
                    </FuseSvgIcon> */}

                    <FuseSvgIcon
                     className="ml-5 productImageFeaturedStar cursor-pointer"
                     onClick={() => handleRemoveProductImage(media.public_id)}
                     >
                      heroicons-solid:trash
                    </FuseSvgIcon>
                   </div>
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

      <Divider/>

        <div className="mt-4 flex flex-row">
        <Controller
          name="dbImages"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => {
            return (
              <>
                {imageLinks?.map((media) => (
                  <div
                    onClick={() => onChange(media.public_id)}
                    onKeyDown={() => onChange(media.public_id)}
                    role="button"
                    tabIndex={0}
                    className={clsx(
                      "productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg",
                      media.public_id === value && "featured"
                    )}
                    key={media.public_id}
                  >
                    <FuseSvgIcon className="productImageFeaturedStar"
                    
                    >
                      heroicons-solid:star
                    </FuseSvgIcon>
                    {/* <Chip
								className="text-11"
								size="small"
								color="default"
								label="delete"
							/> */}
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

export default ProductImagesTab;
