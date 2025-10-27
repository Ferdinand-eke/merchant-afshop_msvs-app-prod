/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useEffect } from "react";
import DataTable from "app/shared-components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Chip, ListItemIcon, MenuItem, Paper } from "@mui/material";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import useMyShopBookingsProperties from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties";

const DEFAULT_PAGE_SIZE = 10;

function BookingPropertiesTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(globalFilter);
      // Reset to first page when search changes
      if (globalFilter !== debouncedSearch) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [globalFilter]);

  // Calculate offset for the API call
  const offset = pagination.pageIndex * pagination.pageSize;
  const limit = pagination.pageSize;

  const {
    data: listingData,
    isLoading: listingIsLoading,
    isError,
    isFetching,
  } = useMyShopBookingsProperties({
    limit,
    offset,
    search: debouncedSearch || undefined, // Only include search if it has a value
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Typography
            component={Link}
            to={`/bookings/managed-listings/${row.original.slug}/${row.original.title}`}
            className="underline"
            color="secondary"
            role="button"
          >
            {row?.original?.title}
          </Typography>
        ),
      },

      {
        accessorKey: "categories",
        header: "Category",
        accessorFn: (row) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              className="text-11"
              size="small"
              color="default"
              label={row?.category}
            />
          </div>
        ),
      },
      {
        accessorKey: "management",
        header: "Management Console",
        Cell: ({ row }) => (
          <div className="flex flex-wrap space-x-2">
            <Chip
              component={Link}
              to={`/bookings/managed-listings/${row.original.slug}/manage`}
              className="text-11 cursor-pointer"
              size="small"
              color="default"
              label="Manage this listing"
            />
          </div>
        ),
      },
      {
        accessorKey: "priceTaxIncl",
        header: "Price",
        accessorFn: (row) => `NGN ${row?.price}`,
      },
      {
        accessorKey: "quantity",
        header: "Room Count",
        accessorFn: (row) => (
          <div className="flex items-center space-x-8">
            <span>{row?.roomCount} rooms</span>
          </div>
        ),
      },
      {
        accessorKey: "active",
        header: "Active",
        accessorFn: (row) => (
          <div className="flex items-center">
            {row.isApproved ? (
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
    ],
    []
  );

  if (listingIsLoading) {
    return <FuseLoading />;
  }

  if (!listingData?.data?.bookingLists) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no listings!
        </Typography>
      </div>
    );
  }

  // Extract total count from the API response for pagination
  const totalRowCount =
    listingData?.data?.totalCount ||
    listingData?.data?.bookingLists?.length ||
    0;

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable
        data={listingData?.data?.bookingLists || []}
        columns={columns}
        manualPagination
        manualFiltering
        rowCount={totalRowCount}
        state={{
          pagination,
          globalFilter,
          isLoading: listingIsLoading,
          showProgressBars: isFetching,
        }}
        onPaginationChange={setPagination}
        onGlobalFilterChange={setGlobalFilter}
        muiPaginationProps={{
          color: "secondary",
          rowsPerPageOptions: [10, 20, 30, 50],
          shape: "rounded",
          variant: "outlined",
          showRowsPerPage: true,
        }}
      />
    </Paper>
  );
}

export default BookingPropertiesTable;
