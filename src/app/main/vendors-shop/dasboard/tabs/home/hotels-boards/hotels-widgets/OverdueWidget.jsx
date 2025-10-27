import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, Divider } from "@mui/material";
import useMyPropertiesReservations from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";
import { useGetMerchantSealedReservations } from "app/configs/data/server-calls/shopdetails/useShopDetails";

/**
 * The OverdueWidget widget - Displays quick stats overview
 */
function OverdueWidget(props) {
  const { data: reservations } = useMyPropertiesReservations();
  const { data: sealedReservation } = useGetMerchantSealedReservations();

  const stats = [
    {
      label: "Check-ins Today",
      value: 3,
      icon: "heroicons-outline:login",
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20"
    },
    {
      label: "Check-outs Today",
      value: 2,
      icon: "heroicons-outline:logout",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      label: "Ready for Cashout",
      value: sealedReservation?.data?.count || 0,
      icon: "heroicons-outline:cash",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    }
  ];

  return (
    <Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-800">
      <div className="flex items-center justify-between px-16 pt-16 pb-8">
        <Box className="flex items-center gap-8">
          <Box className="flex items-center justify-center w-40 h-40 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <FuseSvgIcon className="text-amber-600 dark:text-amber-400" size={20}>
              heroicons-outline:chart-bar
            </FuseSvgIcon>
          </Box>
          <Typography
            className="text-sm font-semibold tracking-tight"
            color="text.secondary"
          >
            Quick Stats
          </Typography>
        </Box>
        <IconButton aria-label="more" size="small">
          <FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton>
      </div>

      <Box className="flex flex-col px-16 pb-16">
        {stats.map((stat, index) => (
          <Box key={stat.label}>
            {index > 0 && <Divider className="my-8" />}
            <Box className="flex items-center justify-between py-8">
              <Box className="flex items-center gap-12">
                <Box className={`flex items-center justify-center w-32 h-32 rounded-lg ${stat.bgColor}`}>
                  <FuseSvgIcon className={stat.color} size={16}>
                    {stat.icon}
                  </FuseSvgIcon>
                </Box>
                <Typography className="text-xs font-medium" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
              <Typography className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default memo(OverdueWidget);
