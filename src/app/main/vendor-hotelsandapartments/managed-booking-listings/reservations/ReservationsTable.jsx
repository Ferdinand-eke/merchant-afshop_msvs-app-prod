/* eslint-disable react/no-unstable-nested-components */
import { motion } from "framer-motion";
import { useMemo, useState, useCallback } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import { Chip, Paper, Box, Skeleton, CircularProgress } from "@mui/material";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import useMyPropertiesReservations from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";
import MerchantErrorPage from "../../MerchantErrorPage";

function ReservationsTable() {
  // Pagination state (no search in API params)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  // Prepare API params - NO SEARCH, only pagination
  const apiParams = useMemo(
    () => ({
      limit: 1000, // Fetch more records for client-side filtering
      offset: 0,
    }),
    []
  ); // Only fetch once, no dependencies

  // Fetch data with params
  const {
    data: reservations,
    isLoading: reservationsIsLoading,
    isError,
  } = useMyPropertiesReservations(apiParams);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Booking Reference",
        Cell: ({ row }) => (
          <>
            <div className="flex flex-wrap space-x-2">
              <Chip
                className="text-11"
                size="small"
                color="default"
                label={row?.original?.paymentResult?.reference}
              />
            </div>
          </>
        ),
      },

      {
        accessorKey: "management",
        header: "Management Console",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              component={Link}
              to={`/bookings/list-reservation/${row.original.id}/manage`}
              className="text-11 cursor-pointer  bg-orange-300"
              size="small"
              color="default"
              label="Manage reservation"
            />
          </div>
        ),
      },
      {
        accessorKey: "isPaid",
        header: "Status",
        size: 32,
        accessorFn: (row) => (
          <div className="flex items-center">
            {row.isPaid ? (
              <FuseSvgIcon className="text-green" size={20}>
                heroicons-outline:check-circle
              </FuseSvgIcon>
            ) : (
              <FuseSvgIcon className="text-red" size={20}>
                heroicons-outline:minus-circle
              </FuseSvgIcon>
            )}
          </div>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Check In",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              className={clsx(
                "text-11 cursor-pointer",
                `${row?.original?.isCheckIn ? "bg-green text-white" : "bg-yellow-500 text-black"}`
              )}
              size="small"
              color="default"
              label={new Date(row?.original?.startDate)?.toDateString()}
            />
            {/* <p>{JSON.stringify(Boolean(row?.original?.isCheckIn))}...</p> */}
          </div>
        ),
      },

      {
        accessorKey: "endDate",
        header: "Check Out",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              className={clsx(
                "text-11 cursor-pointer",
                `${row?.original?.isCheckOut ? "bg-green text-white" : "bg-teal-500 text-black"}`
              )}
              size="small"
              color="default"
              label={new Date(row?.original?.endDate)?.toDateString()}
            />
          </div>
        ),
      },
    ],
    []
  );

  // No longer needed - client-side pagination handles this automatically

  // Beautiful loading skeleton placeholder
  if (reservationsIsLoading) {
    return (
      <Paper
        className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
        elevation={0}
      >
        {/* Header Skeleton */}
        <Box className="p-16 border-b">
          <Box className="flex items-center justify-between mb-16">
            <Skeleton
              variant="rectangular"
              width={300}
              height={40}
              className="rounded-lg"
            />
            <Box className="flex gap-8">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Box>
        </Box>

        {/* Table Header Skeleton */}
        <Box className="px-16 py-12 bg-gray-50 dark:bg-gray-800/50">
          <Box className="flex items-center gap-16">
            <Skeleton variant="rectangular" width={150} height={20} />
            <Skeleton variant="rectangular" width={180} height={20} />
            <Skeleton variant="rectangular" width={80} height={20} />
            <Skeleton variant="rectangular" width={120} height={20} />
            <Skeleton variant="rectangular" width={120} height={20} />
          </Box>
        </Box>

        {/* Table Rows Skeleton with fading effect */}
        <Box className="flex-1 p-16">
          <Box className="flex flex-col items-center justify-center py-32">
            <CircularProgress size={48} thickness={4} className="mb-16" />
            <Typography className="text-sm text-gray-500 dark:text-gray-400">
              Loading reservations...
            </Typography>
          </Box>
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              className="flex items-center gap-16 py-16 border-b"
              sx={{
                opacity: 1 - index * 0.15,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Skeleton
                variant="rectangular"
                width={150}
                height={32}
                className="rounded-full"
              />
              <Skeleton
                variant="rectangular"
                width={180}
                height={32}
                className="rounded-full"
              />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton
                variant="rectangular"
                width={120}
                height={32}
                className="rounded-full"
              />
              <Skeleton
                variant="rectangular"
                width={120}
                height={32}
                className="rounded-full"
              />
            </Box>
          ))}
        </Box>

        {/* Pagination Skeleton */}
        <Box className="flex items-center justify-between p-16 border-t">
          <Skeleton
            variant="rectangular"
            width={200}
            height={32}
            className="rounded-lg"
          />
          <Box className="flex gap-8">
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="rounded"
            />
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="rounded"
            />
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="rounded"
            />
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="rounded"
            />
          </Box>
        </Box>
      </Paper>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <MerchantErrorPage
          message={" Error occurred while retriving reservations"}
        />
      </motion.div>
    );
  }

  if (!reservations?.data?.reservations) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no listings!
        </Typography>
      </div>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable
        data={reservations?.data?.reservations || []}
        columns={columns}
        // Client-side pagination and filtering
        enablePagination={true}
        enableGlobalFilter={true}
        enableColumnFilters={false}
        enableSorting={true}
        initialState={{
          density: "comfortable",
          showColumnFilters: false,
          showGlobalFilter: true,
          pagination: {
            pageIndex: 0,
            pageSize: 20,
          },
        }}
        muiPaginationProps={{
          color: "secondary",
          rowsPerPageOptions: [10, 20, 30, 50],
          shape: "rounded",
          variant: "outlined",
          showRowsPerPage: true,
        }}
        muiSearchTextFieldProps={{
          placeholder: "Search by booking reference...",
          sx: { minWidth: "350px" },
          variant: "outlined",
          size: "small",
          InputProps: {
            startAdornment: (
              <FuseSvgIcon size={20} className="mr-8">
                heroicons-outline:search
              </FuseSvgIcon>
            ),
          },
        }}
        positionGlobalFilter="left"
        globalFilterFn="contains" // Filter rows that contain the search term
      />
    </Paper>
  );
}

export default ReservationsTable;
