import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
  alpha
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useProductShippingWeightUnit } from "app/configs/data/server-calls/product-units/useProductUnits";
import { Controller, useFormContext } from "react-hook-form";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";

/**
 * The enhanced shipping tab with comprehensive logistics fields
 */
function ShippingTab() {
  const {
    data: shippingWeightUnit,
  } = useProductShippingWeightUnit();

  const methods = useFormContext();
  const { control, formState, watch } = methods;
  const { errors } = formState;

  
  const [freeShipping, setFreeShipping] = useState(false);
  const [fragileItem, setFragileItem] = useState(false);

  const length = watch("length") || 0;
  const breadth = watch("breadth") || 0;
  const height = watch("height") || 0;
  const weight = watch("productWeight") || 0;
  const selectedWeightUnit = watch("perUnitShippingWeight");

  // Calculate dimensional weight (used by most carriers)
  const dimensionalWeight = length && breadth && height
    ? ((length * breadth * height) / 5000).toFixed(2)
    : 0;

  // Calculate total package volume
  const packageVolume = length && breadth && height
    ? (length * breadth * height / 1000000).toFixed(4)
    : 0;

  return (
    <Box>
      {/* Header Section */}
      <Box className="mb-24">
        <Typography variant="h5" className="font-bold mb-12 text-2xl">
          Shipping & Logistics
        </Typography>
        <Typography variant="body1" color="text.secondary" className="text-lg">
          Provide accurate package dimensions and weight for precise shipping calculations
        </Typography>
      </Box>

      {/* Package Dimensions Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: 1,
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.main, 0.02)
              : alpha(theme.palette.background.paper, 0.4)
        }}
      >
        <CardContent>
          <Box className="flex items-center gap-12 mb-24">
            <FuseSvgIcon size={24} className="text-primary">
              heroicons-outline:cube
            </FuseSvgIcon>
            <Typography variant="h6" className="font-semibold text-xl">
              Package Dimensions
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" className="mb-20 text-base">
            Measure the package at its longest, widest, and tallest points
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Length"
                  id="length"
                  type="number"
                  variant="outlined"
                  fullWidth
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" className="font-semibold">
                          cm
                        </Typography>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:arrows-expand
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                    sx: { fontSize: '1.125rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '1rem' }
                  }}
                  helperText="Longest side"
                />
              )}
            />

            <Controller
              name="breadth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Width/Breadth"
                  id="breadth"
                  type="number"
                  variant="outlined"
                  fullWidth
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" className="font-semibold">
                          cm
                        </Typography>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:arrows-expand
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                    sx: { fontSize: '1.125rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '1rem' }
                  }}
                  helperText="Widest side"
                />
              )}
            />

            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Height"
                  id="height"
                  type="number"
                  variant="outlined"
                  fullWidth
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" className="font-semibold">
                          cm
                        </Typography>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:arrows-expand
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                    sx: { fontSize: '1.125rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '1rem' }
                  }}
                  helperText="Tallest side"
                />
              )}
            />
          </Box>

          {/* Calculated Values */}
          {(length > 0 && breadth > 0 && height > 0) && (
            <Box className="mt-24 p-16 rounded-lg bg-blue-50 border border-blue-200">
              <Typography variant="subtitle2" className="font-semibold mb-12 text-blue-900 text-base">
                Calculated Package Metrics
              </Typography>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Box className="flex items-center gap-8">
                  <FuseSvgIcon size={20} className="text-blue-700">
                    heroicons-outline:calculator
                  </FuseSvgIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary" className="text-sm">
                      Volume
                    </Typography>
                    <Typography variant="body1" className="font-semibold text-blue-900 text-base">
                      {packageVolume} m³
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex items-center gap-8">
                  <FuseSvgIcon size={20} className="text-blue-700">
                    heroicons-outline:scale
                  </FuseSvgIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary" className="text-sm">
                      Dimensional Weight
                    </Typography>
                    <Typography variant="body1" className="font-semibold text-blue-900 text-base">
                      {dimensionalWeight} kg
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" className="mt-8 block text-sm">
                * Carriers often use dimensional weight for pricing if it's greater than actual weight
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Weight Information Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: 1,
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? alpha(theme.palette.secondary.main, 0.02)
              : alpha(theme.palette.background.paper, 0.4)
        }}
      >
        <CardContent>
          <Box className="flex items-center gap-12 mb-24">
            <FuseSvgIcon size={24} className="text-secondary">
              heroicons-outline:scale
            </FuseSvgIcon>
            <Typography variant="h6" className="font-semibold text-xl">
              Weight Information
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <Controller
              name="perUnitShippingWeight"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <FormControl
                  fullWidth
                  error={!!errors.perUnitShippingWeight}
                  variant="outlined"
                >
                  <InputLabel id="perUnitShippingWeight-label" sx={{ fontSize: '1rem' }}>
                    Weight Unit
                  </InputLabel>
                  <Select
                    labelId="perUnitShippingWeight-label"
                    id="perUnitShippingWeight"
                    label="Weight Unit"
                    onChange={onChange}
                    value={value || ""}
                    startAdornment={
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:badge-check
                        </FuseSvgIcon>
                      </InputAdornment>
                    }
                    sx={{ fontSize: '1.125rem' }}
                  >
                    <MenuItem value="">
                      <em>Select weight unit</em>
                    </MenuItem>
                    {shippingWeightUnit?.data?.shippingweights &&
                      shippingWeightUnit?.data?.shippingweights?.map((option) => (
                        <MenuItem key={option.id} value={option.id} sx={{ fontSize: '1rem' }}>
                          <Box className="flex items-center gap-8">
                            <FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>
                            {option.weightname}
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText sx={{ fontSize: '0.875rem' }}>
                    {errors?.perUnitShippingWeight?.message || "Select the unit of measurement"}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="productWeight"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Weight"
                  id="productWeight"
                  type="number"
                  variant="outlined"
                  fullWidth
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:scale
                        </FuseSvgIcon>
                      </InputAdornment>
                    ),
                    sx: { fontSize: '1.125rem' }
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '1rem' }
                  }}
                  helperText="Actual weight of the product"
                />
              )}
            />
          </Box>

          {selectedWeightUnit && (
            <Box className="mt-20">
              <Chip
                icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
                label={`Weight: ${weight || 0} ${shippingWeightUnit?.data?.shippingweights?.find(u => u.id === selectedWeightUnit)?.weightname || ''}`}
                color="secondary"
                variant="outlined"
                size="medium"
                sx={{ fontSize: '0.875rem' }}
              />
            </Box>
          )}

          {/* Weight comparison */}
          {weight > 0 && dimensionalWeight > 0 && (
            <Alert
              severity={parseFloat(dimensionalWeight) > parseFloat(weight) ? "warning" : "info"}
              className="mt-20"
              sx={{ fontSize: '1rem' }}
            >
              <Typography variant="body1" className="font-semibold mb-4 text-base">
                {parseFloat(dimensionalWeight) > parseFloat(weight)
                  ? "⚠️ Dimensional weight is higher than actual weight"
                  : "✓ Actual weight will be used for shipping"
                }
              </Typography>
              <Typography variant="body2" className="text-sm">
                Most carriers will charge based on whichever is greater:
                <br />
                • Actual Weight: <strong>{weight} kg</strong>
                <br />
                • Dimensional Weight: <strong>{dimensionalWeight} kg</strong>
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Shipping Options Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: 1,
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? alpha(theme.palette.success.main, 0.02)
              : alpha(theme.palette.background.paper, 0.4)
        }}
      >
        <CardContent>
          <Box className="flex items-center gap-12 mb-24">
            <FuseSvgIcon size={24} className="text-success">
              heroicons-outline:truck
            </FuseSvgIcon>
            <Typography variant="h6" className="font-semibold text-xl">
              Shipping Options
            </Typography>
          </Box>

          <Box className="space-y-20">
            {/* Free Shipping Toggle */}
            <Box className="p-16 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
              <FormControlLabel
                control={
                  <Switch
                    checked={freeShipping}
                    onChange={(e) => setFreeShipping(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" className="font-semibold text-base">
                      Offer Free Shipping
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="text-sm">
                      Cover shipping costs to attract more buyers
                    </Typography>
                  </Box>
                }
              />
              {freeShipping && (
                <Chip
                  label="Free Shipping Enabled"
                  color="success"
                  size="small"
                  className="mt-8"
                  icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
                />
              )}
            </Box>

            {/* Fragile Item Toggle */}
            <Box className="p-16 rounded-lg border border-gray-200 hover:border-warning-300 transition-colors">
              <FormControlLabel
                control={
                  <Switch
                    checked={fragileItem}
                    onChange={(e) => setFragileItem(e.target.checked)}
                    color="warning"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" className="font-semibold text-base">
                      Fragile Item - Handle with Care
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="text-sm">
                      Requires special handling and packaging
                    </Typography>
                  </Box>
                }
              />
              {fragileItem && (
                <Box className="mt-12">
                  <Chip
                    label="Fragile - Extra Care Required"
                    color="warning"
                    size="small"
                    icon={<FuseSvgIcon size={16}>heroicons-outline:exclamation</FuseSvgIcon>}
                  />
                  <Typography variant="caption" color="text.secondary" className="mt-8 block text-sm">
                    * Fragile items may incur additional packaging and handling fees
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Processing Time */}
            <Controller
              name="processingTime"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="processingTime-label" sx={{ fontSize: '1rem' }}>
                    Processing Time
                  </InputLabel>
                  <Select
                    labelId="processingTime-label"
                    id="processingTime"
                    label="Processing Time"
                    onChange={onChange}
                    value={value || ""}
                    startAdornment={
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:clock
                        </FuseSvgIcon>
                      </InputAdornment>
                    }
                    sx={{ fontSize: '1.125rem' }}
                  >
                    <MenuItem value="" sx={{ fontSize: '1rem' }}>
                      <em>Select processing time</em>
                    </MenuItem>
                    <MenuItem value="same-day" sx={{ fontSize: '1rem' }}>
                      Same Day (0-1 business days)
                    </MenuItem>
                    <MenuItem value="1-2-days" sx={{ fontSize: '1rem' }}>
                      1-2 Business Days
                    </MenuItem>
                    <MenuItem value="3-5-days" sx={{ fontSize: '1rem' }}>
                      3-5 Business Days
                    </MenuItem>
                    <MenuItem value="1-week" sx={{ fontSize: '1rem' }}>
                      1 Week (5-7 business days)
                    </MenuItem>
                    <MenuItem value="2-weeks" sx={{ fontSize: '1rem' }}>
                      2 Weeks (10-14 business days)
                    </MenuItem>
                  </Select>
                  <FormHelperText sx={{ fontSize: '0.875rem' }}>
                    Time needed to prepare and pack the order before shipping
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Shipping Best Practices */}
      <Alert
        severity="success"
        icon={<FuseSvgIcon size={24}>heroicons-outline:light-bulb</FuseSvgIcon>}
        sx={{ fontSize: '1rem' }}
      >
        <Typography variant="body1" className="font-semibold mb-8 text-lg">
          Shipping Best Practices
        </Typography>
        <ul className="list-disc list-inside space-y-2 text-base">
          <li><strong>Measure accurately:</strong> Use the outer dimensions of the package, not just the product</li>
          <li><strong>Include packaging weight:</strong> Add the weight of boxes, bubble wrap, and padding</li>
          <li><strong>Use dimensional weight:</strong> Carriers charge based on package size and weight</li>
          <li><strong>Offer tracking:</strong> Always provide tracking information to reduce disputes</li>
          <li><strong>Fast processing:</strong> Quick handling times improve customer satisfaction</li>
          <li><strong>Proper packaging:</strong> Mark fragile items clearly to prevent damage</li>
        </ul>
      </Alert>

      {/* Quick Reference */}
      <Box className="mt-24 p-20 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <Box className="flex items-start gap-12">
          <FuseSvgIcon size={24} className="text-blue-700 mt-4">
            heroicons-outline:information-circle
          </FuseSvgIcon>
          <Box>
            <Typography variant="h6" className="font-semibold mb-12 text-blue-900 text-lg">
              Dimensional Weight Formula
            </Typography>
            <Typography variant="body1" className="text-base text-gray-700 mb-8">
              <strong>DIM Weight (kg)</strong> = (Length × Width × Height in cm) ÷ 5000
            </Typography>
            <Typography variant="caption" color="text.secondary" className="text-sm">
              Most carriers use a divisor of 5000 for domestic shipping and 6000 for international
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ShippingTab;
