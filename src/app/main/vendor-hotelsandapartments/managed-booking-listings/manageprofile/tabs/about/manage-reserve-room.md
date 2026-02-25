import { Box, Paper, Typography, Drawer } from "@mui/material";
import React, { lazy, useMemo, useState } from "react";
import { ListingReservation } from "./reservationreview";
import { ListingRooms } from "./property-rooms/ListingRooms";
import EntirePropertyBookingForm from "./reservationreview/EntirePropertyBookingForm";



const DetailsRight = React.memo(
  ({
    listing,
    locationValue,
    coordinates,
    price,
    totalPrice,
    onChangeDate,
    dateRange,
    onSubmit,
    disabled,
    disabledDates,
    isMerchantView = false, // Flag to determine if merchant or guest view
  }) => {
    const [entirePropertyBookingDrawerOpen, setEntirePropertyBookingDrawerOpen] = useState(false);

    // Handler for booking entire property for walk-in guests
    const handleBookEntireProperty = () => {
      setEntirePropertyBookingDrawerOpen(true);
    };

    return (
      <div>
        <Box>
          <Paper className="lg:mb-5 px-4 py-3">
            <Typography className="px-4 mb-[10px] text-dark dark:text-white/[.87] text-xl lg:text-[16px] sm:text-2xl font-semibold">
              {listing?.title}
            </Typography>
          </Paper>

          {listing?.isRentIndividualRoom ? (
            <>
              <Typography className="text-gray-600 mb-2 px-4 text-sm font-semibold" variant="body2" color="text.secondary">
                {isMerchantView
                  ? "Manage individual rooms and create bookings for walk-in guests."
                  : "View rooms and available dates."}
              </Typography>

              <ListingRooms
                rooms={listing?.rooms}
                propertyId={listing?.id}
                merchantId={listing?.shop}
              />
            </>
          ) : (
            <>
              {listing ? (
                <>
                  {/* Entire Property Reservation */}
                  <ListingReservation
                    price={price}
                    totalPrice={totalPrice}
                    onChangeDate={onChangeDate}
                    dateRange={dateRange}
                    onSubmit={onSubmit}
                    disabled={disabled}
                    disabledDates={disabledDates}
                    isMerchantView={isMerchantView}
                    onBookForGuest={handleBookEntireProperty}
                  />
                </>
              ) : (
                <Box className="px-4 py-3">
                  <Typography>Data Not Found</Typography>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Entire Property Booking Drawer for Merchants */}
        {isMerchantView && (
          <Drawer
            open={entirePropertyBookingDrawerOpen}
            anchor="right"
            onClose={() => setEntirePropertyBookingDrawerOpen(false)}
          >
            <Box
              sx={{ width: 450 }}
              role="presentation"
            >
              <EntirePropertyBookingForm
                propertyId={listing?.id}
                propertyPrice={price}
                propertyTitle={listing?.title}
                merchantId={listing?.shop}
                onClose={() => setEntirePropertyBookingDrawerOpen(false)}
              />
            </Box>
          </Drawer>
        )}
      </div>
    );
  }
);

export default DetailsRight;
