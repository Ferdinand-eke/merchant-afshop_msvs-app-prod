import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";

/**
 * The OverdueWidget widget.
 */
function OverdueWidget(props) {
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        <Typography
          className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
          color="text.secondary"
        >
          STATS:
        </Typography>
        <IconButton aria-label="more" size="large">
          <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton>
      </div>
      <div className="flex items-center justify-start mx-8 gap-4 text-center mt-8">
        <Typography className="text-sm sm:text-sm font-bold tracking-tight leading-none text-red-500">
          Reservations
        </Typography>
        <Typography className="text-lg font-medium text-red-600">**</Typography>
      </div>
      <div className="flex items-center justify-start mx-8 gap-4 text-center mt-8">
        <Typography className="text-sm sm:text-sm font-bold tracking-tight leading-none text-red-500">
          Sealed Reservations
        </Typography>
        <Typography className="text-lg font-medium text-red-600">**</Typography>
      </div>
      <div className="flex items-center justify-start mx-8 gap-4 text-center mt-8">
        <Typography className="text-sm sm:text-sm font-bold tracking-tight leading-none text-red-500">
          Ready Cashouts
        </Typography>
        <Typography className="text-lg font-medium text-red-600">**</Typography>
      </div>
    </Paper>
  );
}

export default memo(OverdueWidget);
