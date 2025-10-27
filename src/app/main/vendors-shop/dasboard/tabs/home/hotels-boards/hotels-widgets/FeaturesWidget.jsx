import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { useGetMerchantSealedReservations } from "app/configs/data/server-calls/shopdetails/useShopDetails";
import { Box, Chip } from "@mui/material";

/**
 * The FeaturesWidget widget - Displays completed/sealed reservations
 */
function FeaturesWidget({}) {
  const { data: sealedReservation, isLoading } =
    useGetMerchantSealedReservations();

  if (isLoading) {
    return <FuseLoading />;
  }

  const count = sealedReservation?.data?.count || 0;

  return (
    <Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800">
      <div className="flex items-center justify-between px-16 pt-16">
        <Box className="flex items-center gap-8">
          <Box className="flex items-center justify-center w-40 h-40 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <FuseSvgIcon className="text-purple-600 dark:text-purple-400" size={20}>
              heroicons-outline:check-circle
            </FuseSvgIcon>
          </Box>
          <Typography
            className="text-sm font-semibold tracking-tight"
            color="text.secondary"
          >
            Completed Stays
          </Typography>
        </Box>
        <IconButton aria-label="more" size="small">
          <FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton>
      </div>

      <div className="text-center mt-16 px-16">
        <Typography className="text-5xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
          {count}
        </Typography>
        <Typography className="text-xs mt-4" color="text.secondary">
          Sealed reservations
        </Typography>
      </div>

      <Box className="flex flex-col gap-8 px-16 mt-16 mb-16">
        <Box className="flex items-center justify-between">
          <Typography className="text-xs" color="text.secondary">
            Status
          </Typography>
          <Chip
            label="Finalized"
            size="small"
            color="secondary"
            icon={<FuseSvgIcon size={14}>heroicons-outline:lock-closed</FuseSvgIcon>}
            className="text-xs h-20"
          />
        </Box>
        <Box className="flex items-center justify-between">
          <Typography className="text-xs" color="text.secondary">
            Success Rate
          </Typography>
          <Typography className="text-xs font-bold text-purple-600">
            {count > 0 ? '98%' : 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default memo(FeaturesWidget);
