import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { memo, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";

/**
 * The SummaryWidget widget.
 */

function SummaryWidget({ shopData, isLoading }) {
  if (isLoading) {
    return <FuseLoading />;
  }

  if (!shopData) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        <Select
          className="mx-16"
          classes={{ select: "py-0 flex items-center" }}
          inputProps={{
            name: "currentRange",
          }}
          variant="filled"
          size="small"
        >
          <MenuItem>Move to Wallet</MenuItem>
        </Select>
        <IconButton aria-label="more" size="large">
          <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton>
      </div>
      <div className="text-center mt-8">
        <Typography className="text-lg font-medium text-green-600 dark:text-green-500">
          NGN {formatCurrency(shopData?.shopaccount?.accountbalance)}
        </Typography>
      </div>
      <Typography
        className="flex items-baseline justify-center w-full mt-20 mb-24 text-sm"
        color="text.secondary"
      >
        <span className="truncate">Merchant Earnings</span>
        <b className="px-8">
          NGN {formatCurrency(shopData?.shopaccount?.accountbalance)}
        </b>
      </Typography>
    </Paper>
  );
}

export default memo(SummaryWidget);
