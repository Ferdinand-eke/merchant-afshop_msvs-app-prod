// import ImageListItem from "@mui/material/ImageListItem";
// import ImageListItemBar from "@mui/material/ImageListItemBar";
// import IconButton from "@mui/material/IconButton";
// import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { useFetchReservationsOnProperty } from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";

import { Chip, Paper } from "@mui/material";
import DataTable from "app/shared-components/data-table/DataTable";
import { useMemo } from "react";
import clsx from "clsx";
import MerchantErrorPage from "src/app/main/vendor-hotelsandapartments/MerchantErrorPage";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";

/**
 * The photos videos tab.
 */
function PhotosVideosTab(props) {
	const { Listing } = props;


  const {
    data: reservationsOnProperty,
    isLoading: reservationsIsLoading,
    isError: reservationsIsError,
  } = useFetchReservationsOnProperty(Listing?.id);

//   console.log("RESERVATION__LIST", reservationsOnProperty?.data?.reservations)

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
                component={NavLinkAdapter}
                to={`/bookings/${row.original.id}/handle-arrival`}
				// to={`/${row.original.id}/handle-arrival`}
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

  if (reservationsIsError) {
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

  if (!reservationsOnProperty?.data?.reservations) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no reservations currently!
        </Typography>
      </div>
    );
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Paper
            className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-[85%] h-full"
            elevation={0}
          >
            <Typography color="text.secondary" variant="h5">
              Reservations on <span className="font-bold">{Listing?.title}</span>
            </Typography>
            <DataTable
              data={reservationsOnProperty?.data?.reservations}
              columns={columns}
            />
          </Paper>
        </div>
      </div>
    </motion.div>
  );
}

export default PhotosVideosTab;
