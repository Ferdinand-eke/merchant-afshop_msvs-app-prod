/* eslint-disable react/no-unstable-nested-components */
import { motion } from "framer-motion";
import { useMemo } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Chip, ListItemIcon, MenuItem, Paper } from "@mui/material";
import _ from "@lodash";
import Typography from "@mui/material/Typography";
import MerchantErrorPage from "src/app/main/hotelsandapartments/MerchantErrorPage";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";

function RoomsTable(props) {
  
  const { rooms, roomsIsLoading, roomsIsError, setRoomId } = props;



  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Room Title",
        Cell: ({ row }) => (
          <>
            <div className="flex flex-wrap space-x-2">
              <Chip
                className="text-11"
                size="small"
                color="default"
                label={row?.original?.title}
              />
            </div>
          </>
        ),
      },

      {
        accessorKey: "roomNumber",
        header: "Room Number",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              // component={Link}
              // to={`/bookings/list-reservation/${row.original.id}/manage`}
              onClick={() => setRoomId(row.original.id)}
              className="text-11 cursor-pointer  bg-orange-300"
              size="small"
              color="default"
              label="Manage room"
            />
          </div>
        ),
      },
      {
				accessorKey: 'priceTaxIncl',
				header: 'Price',
				accessorFn: (row) => `NGN ${formatCurrency(row?.price)}`
			},
     
    ],
    []
  );

  if (roomsIsLoading) {
    return <FuseLoading />;
  }

  if (roomsIsError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <MerchantErrorPage
          message={" Error occurred while retriving rooms"}
        />
      </motion.div>
    );
  }

  if (!rooms) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no rooms currently!
        </Typography>
      </div>
    );
  }

  return (
    <Paper
      elevation={0}
    >
      <DataTable data={rooms} columns={columns} />
     </Paper>
  );
}

export default RoomsTable;
