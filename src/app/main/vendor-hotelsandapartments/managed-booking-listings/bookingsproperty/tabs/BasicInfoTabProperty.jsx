import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputAdornment, FormControl, InputLabel, FormHelperText } from "@mui/material";
// import useCountries from "src/app/hooks/useCountries";
import { useEffect, useState } from "react";
import useSellerCountries from "app/configs/data/server-calls/countries/useCountries";
import {
  getLgaByStateId,
  getStateByCountryId,
} from "app/configs/data/client/clientToApiRoutes";

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
 


function BasicInfoTabProperty() {
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
  }, [getValues()?.propertyCountry, getValues()?.propertyState]);


  async function getStateDFromCountryId(pid) {
    setLoading(true);

    const responseData = await getStateByCountryId(pid);

    if (responseData) {
      setBstates(responseData?.data?.states);
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
    const responseData = await getLgaByStateId(sid);

    if (responseData?.data) {
      setBlgas(responseData?.data?.lgas || []);
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

      <Controller
        name="category"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <FormControl
            fullWidth
            className="mt-8 mb-16"
            error={!!errors.category}
          >
            <InputLabel id="category-label">Property Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              label="Property Category"
              onChange={onChange}
              value={value || ""}
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {generateSingleOptions()}
            </Select>
            {errors?.category && (
              <FormHelperText>{errors.category.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name={`roomCount`}
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
        name={`bathroomCount`}
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
        name={`sittingroomCount`}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Number of Sitting rooms"
            id="sittingroomCount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  sitting Room(s)
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
        name={`guestCount`}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Number of guest"
            id="guestCount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  Guest(s)
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
        name="propertyCountry"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <FormControl
            fullWidth
            className="mt-8 mb-16"
            error={!!errors.propertyCountry}
          >
            <InputLabel id="propertyCountry-label">Country of Location</InputLabel>
            <Select
              labelId="propertyCountry-label"
              id="propertyCountry"
              label="Country of Location"
              onChange={onChange}
              value={value || ""}
            >
              <MenuItem value="">
                <em>Select a country</em>
              </MenuItem>
              {countries?.data?.countries &&
                countries?.data?.countries?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </Select>
            {errors?.propertyCountry && (
              <FormHelperText>{errors.propertyCountry.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="propertyState"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <FormControl
            fullWidth
            className="mt-8 mb-16"
            error={!!errors.propertyState}
          >
            <InputLabel id="propertyState-label">State/Province Location</InputLabel>
            <Select
              labelId="propertyState-label"
              id="propertyState"
              label="State/Province Location"
              onChange={onChange}
              value={value || ""}
            >
              <MenuItem value="">
                <em>Select a state</em>
              </MenuItem>
              {bstates &&
                bstates?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </Select>
            {errors?.propertyState && (
              <FormHelperText>{errors.propertyState.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="propertyLga"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <FormControl
            fullWidth
            className="mt-8 mb-16"
            error={!!errors.propertyLga}
          >
            <InputLabel id="propertyLga-label">L.G.A/County Location</InputLabel>
            <Select
              labelId="propertyLga-label"
              id="propertyLga"
              label="L.G.A/County Location"
              onChange={onChange}
              value={value || ""}
            >
              <MenuItem value="">
                <em>Select L.G.A/County</em>
              </MenuItem>
              {blgas.length > 0 ? (
                blgas?.map((lga, index) => (
                  <MenuItem key={index} value={lga?.id}>
                    {lga?.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No L.G.As found
                </MenuItem>
              )}
            </Select>
            {errors?.propertyLga && (
              <FormHelperText>{errors.propertyLga.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      {/* Add districts */}
      {/* <div className="sm:col-span-2">
        <Typography style={{ fontSize: "12px", fontWeight: "800" }}>
          District location
        </Typography>
        <Controller
          name={`propertyLga`}
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Select
              className="mt-8 mb-16"
              id="propertyLga"
              label="District of Listing"
              placeholder="District of Listing"
              fullWidth
              defaultValue=""
              onChange={onChange}
              value={value === undefined || null ? "" : value}
              error={!!errors.propertyLga}
              helperText={errors?.propertyLga?.message}
            >
              {blgas.length > 0 ? (
                blgas?.map((lga, index) => (
                  <MenuItem key={index} value={lga?._id}>
                    {lga?.name}
                  </MenuItem>
                ))
              ) : (
                <span>No District(s) found</span>
              )}
            </Select>
          )}
        />
      </div> */}

      <Controller
        name="latitude"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Latitudinal location of this listing, please use a geo location camera to get on premise geo location readings"
            id="latitude"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Latitude</InputAdornment>
              ),
            }}
            type="text"
            variant="outlined"
            fullWidth
          />
        )}
      />

<Controller
        name="longitude"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 mx-4"
            label="Longitudinal location of this listing, please use a geo location camera to get on premise geo location readings"
            id="longitude"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Longitude</InputAdornment>
              ),
            }}
            type="text"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default BasicInfoTabProperty;
