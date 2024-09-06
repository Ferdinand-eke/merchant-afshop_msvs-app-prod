import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { memo, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
// import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

/**
 * The SummaryWidget widget.
 */

function AccountSummaryWidget({ shopData, isLoading }) {
  // const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();
  // const widget = widgets?.summary;

  if (isLoading) {
    return <FuseLoading />;
  }

  if (!shopData) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        <Typography
          className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
          color="text.secondary"
        >
          Shop Account Balance
        </Typography>
        <IconButton aria-label="more" size="large">
          <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton>
      </div>
      <div className="text-center mt-8">
        <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
          {shopData?.shopaccount?.accountbalance?.toLocaleString("en-US", {
            style: "currency",
            currency: "NGN",
          })}
        </Typography>
      </div>
    </Paper>
  );
}

export default memo(AccountSummaryWidget);
