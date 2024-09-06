import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import _ from "@lodash";
import { useEffect, useState } from "react";
import {
  useGetAccountSettingsQuery,
  useUpdateAccountSettingsMutation,
} from "../SettingsApi";
import useHubs from "app/configs/data/server-calls/tradehubs/useTradeHubs";
import useSellerCountries from "app/configs/data/server-calls/countries/useCountries";
import {
  useGetJustMyShopDetails,
  useShopUpdateMutation,
} from "app/configs/data/server-calls/shopdetails/useShopDetails";
import useShopplans from "app/configs/data/server-calls/shopplans/useShopPlans";
import { Avatar, Box, IconButton, MenuItem, Select } from "@mui/material";
import {
  getLgaByStateId,
  getMarketsByLgaId,
  getStateByCountryId,
} from "app/configs/data/client/clientToApiRoutes";

const defaultValues = {


avatar:"",
  shopname: '',
  tradehub: "",
  userOwner: "",
  businessCountry: "",
  businezState: "",
  businezLga: "",
  market: "",
  usingParentId: "",
  coverimage: "",
  shoplogo: "",
  shopphone: "",
  address: "",
  shopbio: "",
  shopplan: "",
  instagram: "",
  twitter: "",
  facebook: "",
  linkedin: "",
};
/**
 * Form Validation Schema
 */
const schema = z.object({
  shopname: z.string().nonempty("Name is required"),
//   username: z.string().nonempty("Username is required"),
//   title: z.string().nonempty("Title is required"),
//   company: z.string().nonempty("Company is required"),
  shopbio: z.string().nonempty("Sho bio is required"),
  shopemail: z.string().email("Invalid email").nonempty("Email is required"),
  shopphone: z.string().nonempty("Phone is required"),


  businessCountry: z.string().nonempty("Country is required"),
  businezState: z.string().nonempty("State is required"),
  businezLga: z.string().nonempty("L.G.A/County is required"),
  market: z.string().nonempty("Market is required"),

  tradehub: z.string().nonempty("Trade Hub is required"),
  shopplan: z.string().nonempty("A shop plan is required"),
//   language: z.string().nonempty("Language is required"),
});

function AccountTab() {
  const { data: accountSettings, isError } = useGetAccountSettingsQuery();

  const [updateAccountSettings] = useUpdateAccountSettingsMutation();
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      defaultValues,
      mode: "all",
      resolver: zodResolver(schema),
    }
  );
  const { isValid, dirtyFields, errors } = formState;
  const [loading, setLoading] = useState(false);
  const { data: justMyshop } = useGetJustMyShopDetails();
  const { data: hubData } = useHubs();
  const { data: countryData } = useSellerCountries();

  const { data: shopPlanData, isLoading: planIsLoading } = useShopplans();
  const updateShopDetails = useShopUpdateMutation();

  const [blgas, setBlgas] = useState([]);
  const [markets, setBMarkets] = useState([]);
  const [stateData, setStateData] = useState([]);

  // console.log("MySHOP-VALUES", justMyshop?.data)

  useEffect(() => {
    reset(justMyshop?.data);
  }, [justMyshop?.data, reset]);

  useEffect(() => {
    if (getValues()?.businessCountry) {
      findStatesByCountry(getValues()?.businessCountry);
    }

    if (getValues()?.businezState) {
      getLgasFromState(getValues()?.businezState);
    }

    if (getValues()?.businezLga) {
      getMarketsFromLgaId(getValues()?.businezLga);
    }
  }, [
    // transferData,
    getValues()?.businessCountry,
    getValues()?.businezState,
    // getValues()?.businezLga,
  ]);

  async function findStatesByCountry() {
    setLoading(true);
    const stateResponseData = await getStateByCountryId(
      getValues()?.businessCountry
    );

    if (stateResponseData) {
      setStateData(stateResponseData?.data);

      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  //**Get L.G.As from state_ID data */
  async function getLgasFromState(sid) {
    setLoading(true);
    // const responseData = await ProductRepository.getProductsById(pid);
    const responseData = await getLgaByStateId(sid);

    if (responseData) {
      // console.log('LGAs From State:', responseData);
      setBlgas(responseData?.data);
      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

  //**Get Marketss from lga_ID data */ getShopById

  async function getMarketsFromLgaId(lid) {
    if (lid) {
      setLoading(true);
      const responseData = await getMarketsByLgaId(lid);
      if (responseData) {
        setBMarkets(responseData?.data);
        setTimeout(
          function () {
            setLoading(false);
          }.bind(this),
          250
        );
      }
    }
  }

  /**
   * Form Submit
   */
  function onSubmit(formData) {
console.log("ShopData-DETAILS", formData)
	return
    updateAccountSettings(formData);
  }

//   console.log("Fuse-Account-AVATA", getValues()?.avatar)

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Typography className="text-xl">Profile</Typography>
          <Typography color="text.secondary">
            Following information is publicly displayed, be careful!
          </Typography>
        </div>
        
        <div className="mt-32 grid w-full gap-24 sm:grid-cols-4">
          <div className="sm:col-span-4">
            <Controller
              control={control}
              name="shopname"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  placeholder="Shop name"
                  id="shopname"
                  error={!!errors.shopname}
                  helperText={errors?.shopname?.message}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:user-circle
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          {/* <div className="grid w-full gap-24 sm:grid-cols-4 mt-32"> */}
            <div className="sm:col-span-2">
				<Typography>Trade Hub</Typography>
              <Controller
                control={control}
                name="tradehub"
                render={({ field }) => (
					<Select
					sx={{
					  "& .MuiSelect-select": {
						minHeight: "0!important",
					  },
					}}
					{...field}
					label="Trade Hub"
					placeholder="Trade Hub"
					variant="outlined"
					fullWidth
					error={!!errors.tradehub}
					helperText={errors?.tradehub?.message}
				  >
					{hubData?.data?.data?.map((buzcountry, index) => (
					  <MenuItem key={index} value={buzcountry?._id}>
						{buzcountry?.hubname}
					  </MenuItem>
					))}
				  </Select>
                )}
              />
            </div>
            <div className="sm:col-span-2">
			<Typography>Shop Plan</Typography>
              <Controller
                control={control}
                name="shopplan"
                render={({ field }) => (
					<Select
					sx={{
					  "& .MuiSelect-select": {
						minHeight: "0!important",
					  },
					}}
					{...field}
					label="Primary Shop Plan"
					placeholder="Primary Shop Plan"
					variant="outlined"
					fullWidth
					error={!!errors.shopplan}
					helperText={errors?.shopplan?.message}
				  >
					{shopPlanData?.data?.data?.map((plan, index) => (
					  <MenuItem key={index} value={plan?._id}>
						{plan?.plansname}
					  </MenuItem>
					))}
				  </Select>
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <Controller
                control={control}
                name="postalCode"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Postal Code"
                    placeholder="Postal Code"
                    variant="outlined"
                    fullWidth
                    error={!!errors.postalCode}
                    helperText={errors?.postalCode?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:flag
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

			<div className="sm:col-span-2">
					{/* <div className="flex flex-auto items-end -mt-64"> */}
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-100 h-100 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-8 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
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
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(reader.result)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};
																reader.onerror = reject;
																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();
														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										{/* <div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div> */}
									</div>
									
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-128 h-128 text-64 font-bold"
										src={getValues()?.avatar}
										alt={getValues()?.shopname}
										height={100}
										width={100}
									>
										{getValues()?.shopname?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					{/* </div> */}
				</div>
            
          {/* </div> */}

          

          <div className="sm:col-span-4">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  placeholder="Ahop address"
                  id="shop-address"
                  error={!!errors.address}
                  helperText={errors?.address?.message}
                  variant="outlined"
                  required
                  fullWidth
                  // InputProps={{
                  // 	startAdornment: (
                  // 		<InputAdornment position="start">
                  // 			<Typography
                  // 				color="text.secondary"
                  // 				className="italic"
                  // 			>
                  // 				fusetheme.com/
                  // 			</Typography>
                  // 		</InputAdornment>
                  // 	)
                  // }}
                />
              )}
            />
          </div>

          
          <div className="sm:col-span-4">
            <Controller
              control={control}
              name="shopbio"
              render={({ field }) => (
                <TextField
                  className=""
                  {...field}
                  label="Notes"
                  placeholder="Notes"
                  id="notes"
                  error={!!errors.shopbio}
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={10}
                  InputProps={{
                    className: "max-h-min h-min items-start",
                    startAdornment: (
                      <InputAdornment className="mt-16" position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:menu-alt-2
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    <span className="flex flex-col">
                      <span>
                        Brief description for your profile. Basic HTML and Emoji
                        are allowed.
                      </span>
                      <span>{errors?.shopbio?.message}</span>
                    </span>
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="my-40 border-t" />
        <div className="w-full">
          <Typography className="text-xl">Personal Information</Typography>
          <Typography color="text.secondary">
            Communication details in case we want to connect with you. These
            will be kept private.
          </Typography>
        </div>
        <div className="grid w-full gap-24 sm:grid-cols-4 mt-32">
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="shopemail"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Shop Email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.shopemail}
                  helperText={errors?.shopemail?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:mail
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  disabled
                />
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="shopphone"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  placeholder="Phone Number"
                  variant="outlined"
                  fullWidth
                  error={!!errors.shopphone}
                  helperText={errors?.shopphone?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:phone
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
          {/* <div className="sm:col-span-2">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Country"
                  placeholder="County"
                  variant="outlined"
                  fullWidth
                  error={!!errors.country}
                  helperText={errors?.country?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:flag
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Language"
                  placeholder="Language"
                  variant="outlined"
                  fullWidth
                  error={!!errors.language}
                  helperText={errors?.language?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:globe-alt
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div> */}
        </div>

        <div className="my-40 border-t" />
        <div className="w-full">
          <Typography className="text-xl">Geographic Location</Typography>
          <Typography color="text.secondary">
            Communication details of your merchant activity location. These will
            be kept private.
          </Typography>
        </div>
        <div className="grid w-full gap-24 sm:grid-cols-4 mt-32">
          <div className="sm:col-span-2">
            <Typography>Country location</Typography>
            <Controller
              control={control}
              name="businessCountry"
              render={({ field }) => (
                <Select
                  sx={{
                    "& .MuiSelect-select": {
                      minHeight: "0!important",
                    },
                  }}
                  // value={member.role}
                  // size="small"
                  {...field}
                  label="Country Location"
                  placeholder="County of location"
                  variant="outlined"
                  fullWidth
                  error={!!errors.businessCountry}
                  helperText={errors?.businessCountry?.message}
                >
                  {countryData?.data?.data?.map((buzcountry, index) => (
                    <MenuItem key={index} value={buzcountry?._id}>
                      {buzcountry?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <Typography>Sate location</Typography>
            <Controller
              control={control}
              name="businezState"
              render={({ field }) => (
                <Select
                  sx={{
                    "& .MuiSelect-select": {
                      minHeight: "0!important",
                    },
                  }}
                  // value={member.role}
                  // size="small"
                  {...field}
                  label="State Location"
                  placeholder="State of location"
                  variant="outlined"
                  fullWidth
                  error={!!errors.businezState}
                  helperText={errors?.businezState?.message}
                >
                  {stateData?.map((buzstate, index) => (
                    <MenuItem key={index} value={buzstate?._id}>
                      {buzstate?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <Typography>L.G.A/County location</Typography>
            <Controller
              control={control}
              name="businezLga"
              render={({ field }) => (
                <Select
                  sx={{
                    "& .MuiSelect-select": {
                      minHeight: "0!important",
                    },
                  }}
                  // value={member.role}
                  // size="small"
                  {...field}
                  label="L.G.A/County of Location"
                  placeholder="L.G.A/County of location"
                  variant="outlined"
                  fullWidth
                  error={!!errors.businezLga}
                  helperText={errors?.businezLga?.message}
                >
                  {blgas?.map((lga, index) => (
                    <MenuItem key={index} value={lga?._id}>
                      {lga?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <Typography>Market location</Typography>
            <Controller
              control={control}
              name="market"
              render={({ field }) => (
                <Select
                  sx={{
                    "& .MuiSelect-select": {
                      minHeight: "0!important",
                    },
                  }}
                  // value={member.role}
                  // size="small"
                  {...field}
                  label="Market Location"
                  placeholder="Market location"
                  variant="outlined"
                  fullWidth
                  error={!!errors.market}
                  helperText={errors?.market?.message}
                >
                  {markets?.map((market, index) => (
                    <MenuItem key={index} value={market?._id}>
                      {market?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>

        <div className="my-40 border-t" />
        <div className="w-full">
          <Typography className="text-xl">Socials</Typography>
          <Typography color="text.secondary">
            Communication details of your social media handles.
          </Typography>
        </div>
        <div className="grid w-full gap-24 sm:grid-cols-4 mt-32">
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="instagram"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Instagam"
                  placeholder="Instagram"
                  variant="outlined"
                  fullWidth
                  error={!!errors.instagram}
                  helperText={errors?.instagram?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:instagram
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="twitter"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Twitter"
                  placeholder="Twitter Handle"
                  variant="outlined"
                  fullWidth
                  error={!!errors.twitter}
                  helperText={errors?.twitter?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:twitter
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="facebook"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Facebook Handle"
                  placeholder="Facebook Handle"
                  variant="outlined"
                  fullWidth
                  error={!!errors.facebook}
                  helperText={errors?.facebook?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:flag
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="linkedin"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="LinkedIn"
                  placeholder="LinkedIn"
                  variant="outlined"
                  fullWidth
                  error={!!errors.linkedin}
                  helperText={errors?.linkedin?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>
                          heroicons-solid:globe-alt
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
        </div>

        <Divider className="mb-40 mt-44 border-t" />
        <div className="flex items-center justify-end space-x-16">
          <Button
            variant="outlined"
            disabled={_.isEmpty(dirtyFields)}
            onClick={() => reset(accountSettings)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AccountTab;
