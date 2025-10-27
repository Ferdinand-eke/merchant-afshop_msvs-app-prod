import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, LinearProgress } from "@mui/material";

/**
 * The IssuesWidget widget - Displays active reservations count
 */
function IssuesWidget(props) {
	const {reservationsCount} = props;
	const count = reservationsCount || 0;

  return (
    <Paper className="flex flex-col flex-auto h-full shadow rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800">
      <div className="flex items-center justify-between px-16 pt-16">
        <Box className="flex items-center gap-8">
          <Box className="flex items-center justify-center w-40 h-40 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <FuseSvgIcon className="text-blue-600 dark:text-blue-400" size={20}>
              heroicons-outline:calendar
            </FuseSvgIcon>
          </Box>
          <Typography
            className="text-sm font-semibold tracking-tight"
            color="text.secondary"
          >
            Active Reservations
          </Typography>
        </Box>
        <IconButton aria-label="more" size="small">
          <FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton>
      </div>

      <div className="text-center mt-16 px-16">
        <Typography className="text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          {count}
        </Typography>
        <Typography className="text-xs mt-4" color="text.secondary">
          Current bookings
        </Typography>
      </div>

      <Box className="px-16 mt-16 mb-16">
        <Box className="flex items-center justify-between mb-8">
          <Typography className="text-xs font-medium" color="text.secondary">
            Occupancy Rate
          </Typography>
          <Typography className="text-xs font-bold text-blue-600">
            {count > 0 ? '75%' : '0%'}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={count > 0 ? 75 : 0}
          className="h-6 rounded-full"
          sx={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#3b82f6',
              borderRadius: '9999px'
            }
          }}
        />
      </Box>
    </Paper>
  );
}

export default memo(IssuesWidget);
