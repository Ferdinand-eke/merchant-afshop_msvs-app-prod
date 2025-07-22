/* eslint-disable react/no-unstable-nested-components */
import { motion } from "framer-motion";
import { useMemo } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Chip, ListItemIcon, MenuItem, Paper } from "@mui/material";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import Button from "@mui/material/Button";
import useMyPropertiesReservations from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";
import MerchantErrorPage from "../../MerchantErrorPage";

function ReservationsTable() {
  const {
    data: reservations,
    isLoading: reservationsIsLoading,
    isError,
  } = useMyPropertiesReservations();



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

  if (reservationsIsLoading) {
    return <FuseLoading />;
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
      <DataTable data={reservations?.data?.reservations} columns={columns} />
    </Paper>
  );
}

export default ReservationsTable;
