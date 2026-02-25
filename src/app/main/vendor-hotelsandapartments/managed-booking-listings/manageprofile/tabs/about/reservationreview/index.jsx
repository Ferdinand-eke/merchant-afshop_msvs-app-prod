import { Button, Typography, Box, Chip, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { Range } from "react-date-range";
import { Calender } from "../calender";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { differenceInCalendarDays } from 'date-fns';



export const ListingReservation = ({
  price,
  totalPrice,
  onChangeDate,
  dateRange,
  onSubmit,
  disabled,
  disabledDates,
  isMerchantView = false,
  onBookForGuest,
}) => {
  const nightsCount = differenceInCalendarDays(dateRange?.endDate, dateRange?.startDate) || 0;
  return (
    <div
      className="
        bg-white
        rounded-xl
        border-[1px]
        border-neutral-200
        overflow-hidden
        "
    >
      {/* Price Header */}
      <div className="px-4 py-4 border-b border-neutral-200 bg-gradient-to-r from-orange-50 to-white">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            className="text-dark dark:text-white/[.87] text-[24px] font-bold"
            as="h3"
          >
            <span className="text-base text-light dark:text-white/60">₦</span>
            <span>
              {formatCurrency(price)}{" "}
              <span className="text-base ltr:ml-1.5 rtl:mr-1.5 text-light dark:text-white/30 font-normal">
                per night
              </span>
            </span>
          </Typography>
          {isMerchantView && (
            <Chip
              label="Merchant View"
              size="small"
              sx={{
                backgroundColor: '#ea580c',
                color: 'white',
                fontWeight: 600
              }}
            />
          )}
        </Box>
        {nightsCount > 0 && (
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>
            {nightsCount} {nightsCount === 1 ? 'night' : 'nights'} selected
          </Typography>
        )}
      </div>

      {/* Calendar - Full Width */}
      <div className="w-full">
        <Calender
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => onChangeDate(value?.selection)}
        />
      </div>

      <hr />

      {/* Reserve Buttons */}
      <div className="p-4">
        {isMerchantView ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              className="h-[52px] px-[30px] text-white text-base font-bold rounded-lg"
              onClick={onBookForGuest}
              disabled={disabled || nightsCount === 0}
              startIcon={<FuseSvgIcon size={20}>heroicons-outline:user-add</FuseSvgIcon>}
              sx={{
                backgroundColor: '#ea580c',
                '&:hover': {
                  backgroundColor: '#c2410c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                  cursor: 'not-allowed',
                },
                textTransform: 'none',
              }}
            >
              Book for Walk-In Guest
            </Button>
            <Typography variant="caption" sx={{ textAlign: 'center', color: '#6b7280', px: 2 }}>
              Create a booking for a guest checking in at your property
            </Typography>
          </Box>
        ) : (
          <Button
            size="large"
            type="primary"
            className="h-[52px] w-full px-[30px] text-white text-base font-bold rounded-lg transition-all duration-300"
            onClick={onSubmit}
            disabled={disabled}
            sx={{
              backgroundColor: '#ea580c',
              '&:hover': {
                backgroundColor: '#c2410c',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)',
              },
              '&:disabled': {
                backgroundColor: '#9ca3af',
                cursor: 'not-allowed',
              },
              textTransform: 'none',
            }}
          >
            Reserve Now
          </Button>
        )}
      </div>

      {/* Total Price */}
      <div
        className="
                p-4
                flex
                flex-row
                items-center
                justify-between
                font-bold
                text-xl
                border-t
                border-neutral-200
                bg-orange-50
                "
      >
        <div className="text-gray-800">Total</div>
        <div className="text-orange-600">₦ {formatCurrency(totalPrice)}</div>
      </div>
    </div>
  );
};
