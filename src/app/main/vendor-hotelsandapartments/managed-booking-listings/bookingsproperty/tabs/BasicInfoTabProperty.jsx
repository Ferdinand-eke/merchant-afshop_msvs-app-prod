import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputAdornment, FormControl, InputLabel, FormHelperText, Typography, Box, Paper, Grid } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries';
import {
	getLgaByStateId,
	getStateByCountryId,
} from 'app/configs/data/client/clientToApiRoutes';

/**
 * The basic info tab.
 */

export const categoryset = [
	{
		label: 'Beach',
		description: 'This property is close to the beach',
	},
	{
		label: 'Windmills',
		description: 'This property has windmills',
	},
	{
		label: 'Modern',
		description: 'This property is modern',
	},
	{
		label: 'Countryside',
		description: 'This property is in the countryside',
	},
	{
		label: 'Skiing',
		description: 'This property has skiing activities',
	},
	{
		label: 'Castle',
		description: 'This property is in a castle',
	},
	{
		label: 'Camping',
		description: 'This property has camping activities',
	},
	{
		label: 'Cave',
		description: 'This property is in a cave',
	},
	{
		label: 'Luxury',
		description: 'This property is luxurious',
	},
	{
		label: 'Lake',
		description: 'This property is close to a lake',
	},
	{
		label: 'Island',
		description: 'This property is on an island',
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
    <Box>
      {/* Property Details Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)",
          border: "1px solid rgba(234, 88, 12, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box className="flex items-center gap-12 mb-24">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FuseSvgIcon className="text-white" size={20}>
              heroicons-outline:home
            </FuseSvgIcon>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524" }}>
            Property Details
          </Typography>
        </Box>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              required
              label="Property Name"
              autoFocus
              id="title"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors?.title?.message}
              placeholder="e.g., Luxury Beachfront Villa"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                }
              }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              id="description"
              label="Description"
              type="text"
              multiline
              rows={5}
              variant="outlined"
              fullWidth
              placeholder="Describe your property in detail..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                }
              }}
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
              className="mb-16"
              error={!!errors.category}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                }
              }}
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
      </Paper>

      {/* Property Capacity Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)",
          border: "1px solid rgba(234, 88, 12, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box className="flex items-center gap-12 mb-24">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FuseSvgIcon className="text-white" size={20}>
              heroicons-outline:users
            </FuseSvgIcon>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524" }}>
            Capacity & Rooms
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="roomCount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bedrooms"
                  id="roomCount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">heroicons-outline:home</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ea580c',
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="bathroomCount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bathrooms"
                  id="bathroomCount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">heroicons-outline:sparkles</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ea580c',
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="sittingroomCount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Living Rooms"
                  id="sittingroomCount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">heroicons-outline:view-grid</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ea580c',
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="guestCount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Max Guests"
                  id="guestCount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">heroicons-outline:user-group</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ea580c',
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Location Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)",
          border: "1px solid rgba(234, 88, 12, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box className="flex items-center gap-12 mb-24">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FuseSvgIcon className="text-white" size={20}>
              heroicons-outline:location-marker
            </FuseSvgIcon>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524" }}>
            Location Details
          </Typography>
        </Box>

        <Controller
          name="propertyCountry"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <FormControl
              fullWidth
              className="mb-24"
              error={!!errors.propertyCountry}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                }
              }}
            >
              <InputLabel id="propertyCountry-label">Country</InputLabel>
              <Select
                labelId="propertyCountry-label"
                id="propertyCountry"
                label="Country"
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
              className="mb-24"
              error={!!errors.propertyState}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                }
              }}
            >
              <InputLabel id="propertyState-label">State/Province</InputLabel>
              <Select
                labelId="propertyState-label"
                id="propertyState"
                label="State/Province"
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
              className="mb-16"
              error={!!errors.propertyLga}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                }
              }}
            >
              <InputLabel id="propertyLga-label">L.G.A/County</InputLabel>
              <Select
                labelId="propertyLga-label"
                id="propertyLga"
                label="L.G.A/County"
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
      </Paper>

      {/* Geo Coordinates Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)",
          border: "1px solid rgba(234, 88, 12, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box className="flex items-center gap-12 mb-24">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FuseSvgIcon className="text-white" size={20}>
              heroicons-outline:globe
            </FuseSvgIcon>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524" }}>
            Geo Coordinates
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" className="mb-24">
          Use a geo-location device to capture precise coordinates of your property
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="latitude"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Latitude"
                  id="latitude"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">heroicons-outline:arrows-expand</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  variant="outlined"
                  fullWidth
                  placeholder="e.g., 40.7128"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ea580c',
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="longitude"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Longitude"
                  id="longitude"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">heroicons-outline:arrows-expand</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  variant="outlined"
                  fullWidth
                  placeholder="e.g., -74.0060"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f97316',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ea580c',
                      }
                    }
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default BasicInfoTabProperty;
