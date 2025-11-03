import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Paper, Typography, Box, Divider, Alert, Chip } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useEffect, useState } from "react";

/**
 * The property measurements tab - Professional square meter calculator
 */
function ShippingTabProperty() {
  const methods = useFormContext();
  const { control, watch } = methods;

  const [totalArea, setTotalArea] = useState(0);
  const [propertyCategory, setPropertyCategory] = useState("");

  // Watch dimension fields
  const width = watch("width") || 0;
  const length = watch("length") || 0;

  // Calculate total square meters
  useEffect(() => {
    if (width && length) {
      const area = parseFloat(width) * parseFloat(length);
      setTotalArea(area);

      // Categorize property size
      if (area < 50) {
        setPropertyCategory("Studio/Small Apartment");
      } else if (area >= 50 && area < 100) {
        setPropertyCategory("Medium Apartment (1-2 bedrooms)");
      } else if (area >= 100 && area < 150) {
        setPropertyCategory("Large Apartment (2-3 bedrooms)");
      } else if (area >= 150 && area < 250) {
        setPropertyCategory("House/Large Property");
      } else {
        setPropertyCategory("Villa/Estate");
      }
    }
  }, [width, length]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box className="mb-24">
          <Typography variant="h6" className="font-bold mb-8" sx={{ color: '#ea580c' }}>
            <FuseSvgIcon size={24} className="mr-8">heroicons-outline:cube</FuseSvgIcon>
            Property Measurements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter accurate property dimensions for better guest understanding
          </Typography>
        </Box>
      </motion.div>

      {/* Main Dimensions Card */}
      <Paper
        className="p-24 mb-24 rounded-2xl"
        elevation={0}
        sx={{
          border: '1px solid rgba(234, 88, 12, 0.1)',
          background: 'linear-gradient(135deg, #fafaf9 0%, #ffffff 100%)'
        }}
      >
        <Box className="flex items-center gap-12 mb-16">
          <Box
            className="flex items-center justify-center w-40 h-40 rounded-lg"
            sx={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
          >
            <FuseSvgIcon className="text-white" size={20}>heroicons-outline:view-grid</FuseSvgIcon>
          </Box>
          <Typography variant="h6" className="font-semibold">
            Floor Plan Dimensions
          </Typography>
        </Box>

        <Alert severity="info" className="mb-16" icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}>
          Provide dimensions in meters for accurate area calculations
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <Controller
            name="width"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Property Width"
                id="width"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box className="flex items-center gap-4">
                        <FuseSvgIcon size={16}>heroicons-outline:arrows-expand</FuseSvgIcon>
                        <span>m</span>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Width in meters"
              />
            )}
          />

          <Controller
            name="length"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Property Length"
                id="length"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box className="flex items-center gap-4">
                        <FuseSvgIcon size={16}>heroicons-outline:arrows-expand</FuseSvgIcon>
                        <span>m</span>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Length in meters"
              />
            )}
          />

          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ceiling Height"
                id="height"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box className="flex items-center gap-4">
                        <FuseSvgIcon size={16}>heroicons-outline:arrow-up</FuseSvgIcon>
                        <span>m</span>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Height in meters"
              />
            )}
          />
        </div>

        {/* Auto-calculated Total Area */}
        {totalArea > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Divider className="my-24" />
            <Box
              className="p-16 rounded-xl"
              sx={{
                background: 'linear-gradient(135deg, #fef3e2 0%, #ffffff 100%)',
              }}
            >
              <Box className="flex justify-between items-center mb-12">
                <Typography variant="body2" color="text.secondary">
                  <FuseSvgIcon size={16} className="mr-4">heroicons-outline:calculator</FuseSvgIcon>
                  Calculated Total Floor Area
                </Typography>
                <Typography variant="h5" className="font-bold" sx={{ color: '#ea580c' }}>
                  {totalArea.toFixed(2)} m²
                </Typography>
              </Box>
              <Box className="flex items-center gap-8">
                <Chip
                  size="small"
                  label={propertyCategory}
                  sx={{
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    color: '#ea580c',
                    fontWeight: 600
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  ≈ {(totalArea * 10.764).toFixed(0)} sq ft
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}
      </Paper>

      {/* Additional Measurements */}
      <Paper
        className="p-24 mb-24 rounded-2xl"
        elevation={0}
        sx={{
          border: '1px solid rgba(234, 88, 12, 0.1)',
        }}
      >
        <Box className="flex items-center gap-12 mb-16">
          <Box
            className="flex items-center justify-center w-40 h-40 rounded-lg"
            sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
          >
            <FuseSvgIcon className="text-white" size={20}>heroicons-outline:office-building</FuseSvgIcon>
          </Box>
          <Typography variant="h6" className="font-semibold">
            Additional Details
          </Typography>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Controller
            name="floorArea"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Built-up Area (Optional)"
                id="floorArea"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m²</InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Total built-up area if different from calculated"
              />
            )}
          />

          <Controller
            name="plotArea"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Plot/Land Area (Optional)"
                id="plotArea"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m²</InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Total land/plot size"
              />
            )}
          />

          <Controller
            name="numberOfFloors"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number of Floors"
                id="numberOfFloors"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={16}>heroicons-outline:view-grid-add</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Total number of floors/stories"
              />
            )}
          />

          <Controller
            name="floorLevel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Floor Level (Optional)"
                id="floorLevel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={16}>heroicons-outline:location-marker</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
                helperText="Which floor is this unit on (for apartments)"
              />
            )}
          />
        </div>
      </Paper>

      {/* Measurement Reference Guide */}
      <Paper
        className="p-24 rounded-2xl"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <Box className="flex items-center gap-12 mb-16">
          <Box
            className="flex items-center justify-center w-40 h-40 rounded-lg"
            sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
          >
            <FuseSvgIcon className="text-white" size={20}>heroicons-outline:book-open</FuseSvgIcon>
          </Box>
          <Typography variant="h6" className="font-semibold">
            Measurement Guide
          </Typography>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-8" sx={{ color: '#3b82f6' }}>
              Property Size Categories:
            </Typography>
            <Box className="space-y-4">
              <Typography variant="caption" className="flex items-center gap-4">
                <span>•</span> Studio/Small: &lt; 50 m² (~538 sq ft)
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <span>•</span> Medium: 50-100 m² (~538-1076 sq ft)
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <span>•</span> Large: 100-150 m² (~1076-1614 sq ft)
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <span>•</span> House: 150-250 m² (~1614-2691 sq ft)
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <span>•</span> Villa/Estate: &gt; 250 m² (~2691+ sq ft)
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" className="font-semibold mb-8" sx={{ color: '#3b82f6' }}>
              Tips for Accurate Measurements:
            </Typography>
            <Box className="space-y-4">
              <Typography variant="caption" className="flex items-center gap-4">
                <FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
                Measure from wall to wall (internal dimensions)
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
                Include all livable spaces in calculations
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
                Standard ceiling height is 2.4-3m
              </Typography>
              <Typography variant="caption" className="flex items-center gap-4">
                <FuseSvgIcon size={14}>heroicons-outline:check</FuseSvgIcon>
                1 m² = 10.764 square feet
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default ShippingTabProperty;
