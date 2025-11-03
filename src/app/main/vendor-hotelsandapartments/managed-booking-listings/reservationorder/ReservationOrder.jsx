import FusePageCarded from '@fuse/core/FusePageCarded';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { Box, Paper, Chip, Button } from '@mui/material';
import ContentLoadingPlaceholder from 'app/shared-components/ContentLoadingPlaceholder';
import InvoiceTab from './tabs/InvoiceTab';
import OrderDetailsTab from './tabs/OrderDetailsTab';
import { getJustMyShopDetailsAndPlan } from 'app/configs/data/client/clientToApiRoutes';
import { useFindMerchantSingleReservation } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';
import MerchantErrorPage from '../../MerchantErrorPage';

/**
 * The order.
 */
function ReservationOrder() {
  const routeParams = useParams();
  const { reservationId } = routeParams;

  const [loading, setLoading] = useState(false);
  const [myshopData, setMyshopData] = useState({});

  const {
    data: reservationItem,
    isLoading: reservationIsLoading,
    isError: reservationIsError,
  } = useFindMerchantSingleReservation(reservationId, {
    skip: !reservationId,
  });

  useEffect(() => {
    if (reservationId) {
      getSingleApiShopDetails();
    }
  }, [reservationId]);

  async function getSingleApiShopDetails() {
    setLoading(true);
    const responseData = await getJustMyShopDetailsAndPlan();

    if (responseData) {
      setMyshopData(responseData?.data);

      setTimeout(
        function () {
          setLoading(false);
        }.bind(this),
        250
      );
    }
  }

	const theme = useTheme();
	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));

	// Load saved tab from localStorage or default to 0
	const [tabValue, setTabValue] = useState(() => {
		const savedTab = localStorage.getItem(`reservationOrder_tab_${reservationId}`);
		return savedTab !== null ? parseInt(savedTab, 10) : 0;
	});

	function handleTabChange(_event, value) {
		setTabValue(value);
		// Save selected tab to localStorage with reservation-specific key
		localStorage.setItem(`reservationOrder_tab_${reservationId}`, value.toString());
	}

	if (reservationIsLoading || loading) {
		return (
			<ContentLoadingPlaceholder
				title="Loading Reservation Details..."
				subtitle="Fetching booking information and guest details"
				cardCount={4}
			/>
		);
	}

	if (reservationIsError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<MerchantErrorPage message="Error occurred while retrieving reservation data" />
			</motion.div>
		);
	}

  return (
    <FusePageCarded
      headerContainerSx={{ px: 0 }}
      header={
        reservationItem?.data && (
          <Paper
            elevation={0}
            className="w-full"
            sx={{
              background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
              borderBottom: '1px solid rgba(234, 88, 12, 0.1)',
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <Box className="py-16 px-24 md:px-32">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
              >
                <Button
                  component={Link}
                  to="/bookings/list-reservations"
                  startIcon={
                    <FuseSvgIcon size={20}>
                      {theme.direction === "ltr"
                        ? "heroicons-outline:arrow-left"
                        : "heroicons-outline:arrow-right"}
                    </FuseSvgIcon>
                  }
                  sx={{
                    color: '#ea580c',
                    fontWeight: 600,
                    mb: 2,
                    '&:hover': {
                      background: 'rgba(249, 115, 22, 0.08)',
                    },
                  }}
                >
                  Back to Reservations
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
              >
                <Box className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-16">
                  <Box className="flex-1 min-w-0">
                    <Box className="flex items-center gap-12 mb-8">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FuseSvgIcon className="text-white" size={24}>
                          heroicons-outline:calendar
                        </FuseSvgIcon>
                      </Box>
                      <Box className="flex-1 min-w-0">
                        <Typography variant="h6" className="font-bold truncate" sx={{ color: '#292524' }}>
                          {reservationItem?.data?.reservationBooked?.reservation?.paymentResult?.reference || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#78716c' }}>
                          Reservation Reference
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="flex items-center gap-8 mt-12">
                      <Chip
                        icon={<FuseSvgIcon size={16}>heroicons-solid:user</FuseSvgIcon>}
                        label={reservationItem?.data?.userInReservedBooking?.user?.name || 'Guest'}
                        size="small"
                        sx={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          color: '#ea580c',
                          fontWeight: 600,
                          border: '1px solid rgba(234, 88, 12, 0.2)',
                        }}
                      />
                      {reservationItem?.data?.reservationBooked?.reservation?.isPaid && (
                        <Chip
                          icon={<FuseSvgIcon size={16}>heroicons-solid:check-circle</FuseSvgIcon>}
                          label="Paid"
                          size="small"
                          sx={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#16a34a',
                            fontWeight: 600,
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        )
      }
      content={
        <>
          <Paper
            elevation={0}
            sx={{
              borderBottom: '1px solid rgba(234, 88, 12, 0.1)',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.875rem',
                  color: '#78716c',
                  '&.Mui-selected': {
                    color: '#ea580c',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#f97316',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab label="Reservation Details" />
              <Tab label="Invoice" />
            </Tabs>
          </Paper>

          {reservationItem?.data && (
            <Box
              className="p-16 sm:p-24"
              sx={{
                maxWidth: '1200px',
                mx: 'auto',
                width: '100%',
              }}
            >
              {tabValue === 0 && (
                <OrderDetailsTab
                  reservation={
                    reservationItem?.data?.reservationBooked?.reservation
                  }
                  isError={reservationIsError}
                />
              )}
              {tabValue === 1 && (
                <InvoiceTab
                  order={reservationItem?.data?.reservationBooked?.reservation}
                  myshopData={myshopData?.merchant}
                />
              )}
            </Box>
          )}
        </>
      }
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default ReservationOrder;
