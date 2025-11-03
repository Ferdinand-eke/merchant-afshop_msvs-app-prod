import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Typography,
  Alert,
  Chip,
  alpha
} from "@mui/material";
import {
  calculateShopEarnings,
} from "app/configs/Calculus";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { formatCurrency } from "../../../pos/PosUtils";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useEffect } from "react";

/**
 * The enhanced pricing tab with tier-based pricing for bulk orders
 */
function PricingTab({ shopData }) {
  const methods = useFormContext();
  const { control, watch } = methods;

  // Initialize priceTiers if not exists
  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceTiers"
  });

  // Initialize with default tier if empty
  useEffect(() => {
    if (!fields || fields.length === 0) {
      append({ minQuantity: 1, maxQuantity: 9, price: 0 });
    }
  }, []);
  

  const basePrice = watch("price") || 0;
  const commissionRate = shopData?.merchantShopplan?.percetageCommissionCharge || 0;
  const commissionConversion = shopData?.merchantShopplan?.percetageCommissionChargeConversion || 0;

  const handleAddTier = () => {
    const lastTier = fields[fields.length - 1];
    const newMinQuantity = lastTier ? parseInt(lastTier.maxQuantity || 0) + 1 : 10;
    append({
      minQuantity: newMinQuantity,
      maxQuantity: newMinQuantity + 9,
      price: 0
    });
  };

  const calculateEarnings = (price) => {
    return calculateShopEarnings(price, commissionConversion);
  };

  return (
    <Box>
      {/* Header Section */}
      <Box className="mb-24">
        <Typography variant="h5" className="font-bold mb-12 text-2xl">
          Product Pricing
        </Typography>
        <Typography variant="body1" color="text.secondary" className="text-lg">
          Set your retail price and configure bulk pricing tiers to encourage wholesale purchases
        </Typography>
      </Box>

      {/* Base Retail Pricing Card */}
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
          <Box className="flex items-center gap-12 mb-20">
            <FuseSvgIcon size={24} className="text-primary">
              heroicons-outline:tag
            </FuseSvgIcon>
            <Typography variant="h6" className="font-semibold text-xl">
              Retail Price (Single Unit)
            </Typography>
          </Box>

          <Box className="flex gap-16">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Retail Price"
                  id="price"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₦</InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  helperText="Price for customers buying 1 unit"
                />
              )}
            />

            <Controller
              name="listprice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Compare at Price"
                  id="listprice"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₦</InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  helperText="Original price (before discount)"
                />
              )}
            />
          </Box>

          {/* Earnings Information */}
          {basePrice > 0 && (
            <Alert
              severity="info"
              icon={<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>}
              sx={{ mt: 2 }}
            >
              <Box>
                <Typography variant="body1" className="text-base">
                  At <strong className="text-lg">₦{formatCurrency(basePrice)}</strong> with{" "}
                  <Chip
                    label={`${commissionRate}% commission`}
                    size="medium"
                    color="primary"
                    sx={{ mx: 0.5, fontSize: '0.875rem' }}
                  />
                  , your earnings per unit will be{" "}
                  <Typography
                    component="span"
                    variant="h6"
                    className="font-bold text-green-600 text-xl"
                  >
                    ₦{formatCurrency(calculateEarnings(basePrice))}
                  </Typography>
                </Typography>
              </Box>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bulk Pricing Tiers */}
      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? alpha(theme.palette.secondary.main, 0.02)
              : alpha(theme.palette.background.paper, 0.4)
        }}
      >
        <CardContent>
          <Box className="flex items-center justify-between mb-20">
            <Box className="flex items-center gap-12">
              <FuseSvgIcon size={24} className="text-secondary">
                heroicons-outline:scale
              </FuseSvgIcon>
              <Typography variant="h6" className="font-semibold text-xl">
                Bulk Pricing Tiers
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
              onClick={handleAddTier}
            >
              Add Tier
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary" className="mb-20 text-base">
            Set discounted prices for bulk orders. Lower prices encourage wholesale buyers to purchase more units.
          </Typography>

          <Box className="space-y-12">
            {fields.map((field, index) => {
              const tierPrice = watch(`priceTiers.${index}.price`) || 0;
              const minQty = watch(`priceTiers.${index}.minQuantity`) || 0;
              const maxQty = watch(`priceTiers.${index}.maxQuantity`) || 0;

              return (
                <Paper
                  key={field.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.background.default
                        : alpha(theme.palette.background.paper, 0.6)
                  }}
                >
                  <Box className="flex items-start gap-12">
                    <Box className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12">
                      {/* Min Quantity */}
                      <Controller
                        name={`priceTiers.${index}.minQuantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Min Quantity"
                            type="number"
                            variant="outlined"
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FuseSvgIcon size={16}>heroicons-outline:arrow-sm-down</FuseSvgIcon>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        )}
                      />

                      {/* Max Quantity */}
                      <Controller
                        name={`priceTiers.${index}.maxQuantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Max Quantity"
                            type="number"
                            variant="outlined"
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FuseSvgIcon size={16}>heroicons-outline:arrow-sm-up</FuseSvgIcon>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        )}
                      />

                      {/* Tier Price */}
                      <Controller
                        name={`priceTiers.${index}.price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Price per Unit"
                            type="number"
                            variant="outlined"
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">₦</InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </Box>

                    {/* Remove Button */}
                    <IconButton
                      onClick={() => remove(index)}
                      size="small"
                      color="error"
                      disabled={fields.length === 1}
                      sx={{ mt: 0.5 }}
                    >
                      <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
                    </IconButton>
                  </Box>

                  {/* Tier Earnings Info */}
                  {tierPrice > 0 && minQty > 0 && (
                    <Box className="mt-16 pt-16 border-t">
                      <Box className="flex flex-wrap gap-16 items-center">
                        <Chip
                          label={`${minQty} - ${maxQty || '∞'} units`}
                          size="medium"
                          variant="outlined"
                          sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                        />
                        <Typography variant="body1" color="text.secondary" className="text-base">
                          Unit Price: <strong className="text-primary text-lg">₦{formatCurrency(tierPrice)}</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" className="text-base">
                          Your Earnings: <strong className="text-green-600 text-lg">₦{formatCurrency(calculateEarnings(tierPrice))}</strong> per unit
                        </Typography>
                        {basePrice > tierPrice && (
                          <Chip
                            label={`${(((basePrice - tierPrice) / basePrice) * 100).toFixed(1)}% discount`}
                            size="medium"
                            color="success"
                            sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>

          {/* Bulk Pricing Benefits */}
          <Alert severity="success" icon={<FuseSvgIcon size={24}>heroicons-outline:light-bulb</FuseSvgIcon>} sx={{ mt: 3 }}>
            <Typography variant="body1" className="font-semibold mb-8 text-lg">
              Why use bulk pricing?
            </Typography>
            <ul className="list-disc list-inside space-y-2 text-base">
              <li>Encourage wholesale buyers to order larger quantities</li>
              <li>Increase your sales volume and total revenue</li>
              <li>Build relationships with bulk purchasers</li>
              <li>Stay competitive in the wholesale market</li>
            </ul>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PricingTab;
