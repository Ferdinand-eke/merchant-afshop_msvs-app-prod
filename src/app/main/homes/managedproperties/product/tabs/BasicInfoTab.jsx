import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputAdornment, Typography } from "@mui/material";
// import useCountries from "src/app/hooks/useCountries";
import { useEffect, useState } from "react";
import useSellerCountries from "app/configs/data/server-calls/countries/useCountries";
import { getLgaByStateId, getStateByCountryId } from "app/configs/data/client/clientToApiRoutes";

/**
 * The basic info tab.
 */

export const categoryset = [
  {
    label: "Beach",
    // icon: TbBeach,
    description: "This property is close to the beach",
  },
  {
    label: "Windmills",
    // icon: GiWindmill,
    description: "This property has windmills",
  },
  {
    label: "Modern",
    // icon: MdOutlineVilla,
    description: "This property is modern",
  },
  {
    label: "Countryside",
    // icon: TbMountain,
    description: "This property is in the countryside",
  },
  {
    label: "Skiing",
    // icon: FaSkiing,
    description: "This property has skiing activities ",
  },
  {
    label: "Castle",
    // icon: GiCastle,
    description: "This property is in a castle",
  },

  {
    label: "Camping",
    // icon: GiForestCamp,
    description: "This property has camping activities",
  },
  {
    label: "Cave",
    // icon: GiCaveEntrance,
    description: "This property is jn a cave",
  },
  {
    label: "luxury",
    // icon: IoDiamond,
    description: "This property is luxirious",
  },

  {
    label: "lake",
    // icon: GiBoatFishing,
    description: "This property is close to ta lake",
  },
  {
    label: "Island",
    // icon: GiIsland,
    description: "This property is on an island",
  },
];

function BasicInfoTab() {
  const generateSingleOptions = () => {
    return categoryset.map((option, index) => {
      return (
        <MenuItem key={index} value={option.label}>
          {option.label}
        </MenuItem>
      );
    });
  };

  const methods = useFormContext();
  const { control, formState, getValues } = methods;
  const { errors } = formState;
  const {
    data: countries,
    isLoading: countriesLoading,
    refetch,
  } = useSellerCountries();
  const [loading, setLoading] = useState(false);
  const [bstates, setBstates] = useState([]);
  const [blgas, setBlgas] = useState([]);

  useEffect(() => {
    if (getValues()?.propertyCountry?.length > 0) {
      getStateDFromCountryId(getValues()?.propertyCountry);
    }
    if (getValues()?.propertyState?.length > 0) {
      getLgasFromState(getValues()?.propertyState);
    }
  }, [
    getValues()?.propertyCountry,
    getValues()?.propertyState
  ]);

  async function getStateDFromCountryId(pid) {
    setLoading(true);

    const responseData = await getStateByCountryId(pid);

    if (responseData) {
      setBstates(responseData?.data);
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



  return (
    <div>
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

      <>
      <Typography>Property category</Typography>
      {/* <Controller
        control={control}
        name="cat"
        render={({ field }) => (
          <Select
            className="mt-8 mb-16"
            id="cat"
            label="Cat"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            error={!!errors.cat}
            helperText={errors?.cat?.message}
          >
            <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
            {generateSingleOptions()}
          </Select>
        )}
      /> */}

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
            {/* <MenuItem value="">Select a product category</MenuItem>
            {hubs?.data?.data &&
              hubs?.data?.data?.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.hubname}
                </MenuItem>
              ))} */}
               {generateSingleOptions()}
          </Select>
        )}
      />
      </>

      {/* <Controller
        name="categories"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            freeSolo
            options={[]}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select multiple categories"
                label="Categories"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      /> */}

      {/* <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            freeSolo
            options={[]}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select multiple tags"
                label="Tags"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      /> */}

<Controller
          name="roomCount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Number of rooms"
              id="roomCount"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rooms</InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
          )}
        />

<Controller
          name="bathroomCount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Number of Bathrooms"
              id="bathroomCount"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">BathRooms</InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
          )}
        />

<Controller
          name="sittingroomCount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 mx-4"
              label="Number of Sitting rooms"
              id="sittingroomCount"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">sitting Room(s)</InputAdornment>
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
          Country of L.G.A/County?
        </Typography>
        <Controller
          name={`propertyCountry`}
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              // disabled
              className="mt-8 mb-16"
              id="propertyCountry"
              label="business country"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.propertyCountry}
              helpertext={errors?.propertyCountry?.message}
            >
              <MenuItem value="">Select a country</MenuItem>
              {countries?.data?.data &&
                countries?.data?.data?.map((option, id) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </>

      <>
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          State of L.G.A/County? (Dependent on country selected)
        </Typography>
        <Controller
          name={`propertyState`}
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              // disabled
              className="mt-8 mb-16"
              id="propertyState"
              label="business state"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.propertyState}
              helpertext={errors?.propertyState?.message}
            >
              <MenuItem value="">Select a state</MenuItem>
              {bstates &&
                bstates?.map((option, id) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
            </Select>
          )}
        />
      </>


      <div className="sm:col-span-2">
            <Typography>L.G.A/County location</Typography>
            <Controller
              control={control}
              name="propertyLga"
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
                  error={!!errors.propertyLga}
                  helperText={errors?.propertyLga?.message}
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

        
    </div>
  );
}

export default BasicInfoTab;
