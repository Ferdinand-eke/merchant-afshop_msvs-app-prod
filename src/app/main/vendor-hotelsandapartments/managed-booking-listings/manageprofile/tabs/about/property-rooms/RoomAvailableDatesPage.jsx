import { motion } from "framer-motion";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { format } from "date-fns/format";
import { Button, Card, InputAdornment, TextField, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   useCreateWalkinGuestReservationOnRoom,
//   useGetReservationsOnRoom,
// } from "app/configs/data/server-calls/auth/userapp/a_bookings/use-reservations";
import {
  differenceInCalendarDays,
  differenceInDays,
  eachDayOfInterval,
} from "date-fns";
import { toDate } from "date-fns-tz";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useNavigate } from "react-router";
import { Calender } from "../calender";
// import { formatCurrency } from "src/app/main/vendors-shop/PosUtils";
import { useCreateWalkinGuestReservationOnRoom, useGetReservationsOnRoom } from "app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations";
import { formatCurrency } from "src/app/main/vendors-shop/pos/PosUtils";
/**
 * The activities page.
 */

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const parseDateString = (dateString) => {
  const dateTimeRegex =
    /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]|60))?(\.[0-9]{1,9})?)?)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/;

  if (dateTimeRegex.test(dateString)) {
    return toDate(dateString);
  }
  return new Date(dateString);
};

function RoomAvailableDatesPage(props) {
  
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);
  const { roomId, roomPrice, propertyId, merchantId, onClose } = props;
  const [drawerError, setDrawerError] = useState("");
  const { mutate: createReservationMutation, isLoading: reservationLoading } =
    useCreateWalkinGuestReservationOnRoom();

  /****For Calender Here */

  const { data: reservatons, isLoading } = useGetReservationsOnRoom(roomId);

  const disabledDates = useMemo(() => {
    let dates = [];

    reservatons?.data?.reservationsOnRoom?.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation?.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservatons?.data?.reservationsOnRoom]);

  const [totalPrice, setTotalPrice] = useState(roomPrice);
  const [dateRange, setDateRange] = useState(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser?.name) {
      navigate("/sign-in");
      return;
    }

    const formData = {
      totalPrice,
      startDate: parseDateString(dateRange?.startDate),
      endDate: parseDateString(dateRange?.endDate),
      listingId: propertyId,
      roomOnPropertyId: roomId,
      merchantId: merchantId,
    };

    // return createReservationMutation(formData);
  }, [totalPrice, dateRange, roomId, currentUser?.id]);

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange?.endDate,
        dateRange?.startDate
      );
      if (dayCount && roomPrice) {
        setTotalPrice(dayCount * roomPrice);
      } else {
        setTotalPrice(roomPrice);
      }
    }
  }, [dateRange, roomPrice]);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageSimple
      content={
        <>
          <div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72 relative">
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <Close />
            </IconButton>

            <Typography className="text-2xl font-extrabold leading-none tracking-tight">
              View available dates to book here.
              <br />
              <br />
            </Typography>

            <div
              className="
                    bg-white
                    rounded-xl
                    border-[1px]
                    border-neutral-200
                    overflow-hidden
                    "
            >
              <div
                className="
                        flex flex-row items-center 
                        "
              >
                <Typography
                  className="text-dark dark:text-white/[.87] mt-[18px] mb-2 text-[22px] font-medium"
                  as="h3"
                >
                  <span className="text-sm text-light dark:text-white/60">
                    ₦
                  </span>

                  <span>
                    {formatCurrency(roomPrice)}{" "}
                    <span className="text-sm ltr:ml-1.5 rtl:mr-1.5 text-light dark:text-white/30 font-normal">
                      {" "}
                      per night
                    </span>
                  </span>
                </Typography>
              </div>

              <hr />
              <Calender
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => setDateRange(value?.selection)}
              />
              <hr />
              <div className="p-4">
                <Button
                  size="small"
                  type="primary"
                  className="bg-orange-500 hover:bg-orange-800 h-[34px] w-full px-[30px] bg-primary text-black dark:text-white/[.87] text-sm font-semibold border-primary rounded-[6px]"
                  onClick={onCreateReservation}
                  disabled={reservationLoading}
                >
                  Reserve
                </Button>
              </div>

              <div
                className="
                            p-4
                            flex
                            flex-row
                            items-center
                            justify-between
                            font-semibold
                            text-lg
                            "
              >
                <div>Total</div>
                <div>₦ {formatCurrency(totalPrice)}</div>
              </div>
            </div>
          </div>
        </>
      }
      scroll={isMobile ? "normal" : "page"}
    />
  );
}

export default RoomAvailableDatesPage;
