import Button from '@mui/material/Button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Drawer, Paper, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';
import { useParams } from 'react-router';
import { useGetRoomsFromBookingProperty } from 'app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps';
import RoomsTable from './RoomsTable';
import RoomMenuPanel from './formpanels/RoomMenuPanel';
import { useCreateWalkinGuestReservationOnRoom, useFetchReservationsOnProperty } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsReservations';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { toDate } from 'date-fns-tz';
import RoomCardRow from './property-rooms/RoomCardRow';
import RoomDetailsModal from './property-rooms/RoomDetailsModal';
import RoomAvailableDatesPage from './property-rooms/RoomAvailableDatesPage';
import WalkInGuestBookingForm from './property-rooms/WalkInGuestBookingForm';
import FuseLoading from '@fuse/core/FuseLoading';
import { ListingReservation } from './reservationreview';
import EntirePropertyBookingForm from './reservationreview/EntirePropertyBookingForm';

/**
 * The about tab - Manage Rooms
 */

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};


const parseDateString = (dateString) => {

  const dateTimeRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]|60))?(\.[0-9]{1,9})?)?)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/

  
  if (dateTimeRegex.test(dateString)) {
    return toDate(dateString)
  }
  return new Date(dateString)
}


function AboutManageRoomsTab(props) {

	const { Listing } = props;
	const routeParams = useParams();
	const { productId } = routeParams;
	const [roomId, setRoomId] = useState('');
	const [viewMode, setViewMode] = useState('cards'); // 'table' or 'cards'
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
	const [walkInBookingDrawerOpen, setWalkInBookingDrawerOpen] = useState(false);
	const [entirePropertyBookingDrawerOpen, setEntirePropertyBookingDrawerOpen] = useState(false);
	const [currentBookingRoom, setCurrentBookingRoom] = useState(null);
	const { data: rooms, isLoading: roomsIsLoading, isError: roomsIsError } = useGetRoomsFromBookingProperty(productId);
	const {data: reservatons} =useFetchReservationsOnProperty( Listing?.id)
	const createWalkInGuesrReservations = useCreateWalkinGuestReservationOnRoom()

	// Close drawers on successful reservation creation
	useEffect(() => {
		if (createWalkInGuesrReservations.isSuccess) {
			// Close both walk-in and entire property booking drawers
			setWalkInBookingDrawerOpen(false);
			setEntirePropertyBookingDrawerOpen(false);
			// Reset the mutation state to allow future submissions
			createWalkInGuesrReservations.reset();
		}
	}, [createWalkInGuesrReservations.isSuccess, createWalkInGuesrReservations.reset])

	// console.log("Reservations on property", reservatons?.data?.reservations)

	console.log("Listing", Listing)

	const disabledDates = useMemo(() => {
    let dates = [];

    reservatons?.data?.reservations?.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation?.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservatons?.data?.reservations]);


  const [totalPrice, setTotalPrice] = useState(Listing?.price);
  const [dateRange, setDateRange] = useState(initialDateRange);

  // Handler for creating a reservation (currently logs to console)
  const onCreateReservation = useCallback((bookingData) => {

	console.log("Form Data for Entire Property Reservation:", bookingData);

    // TODO: Implement API call to create reservation
    return createWalkInGuesrReservations.mutate(bookingData);
  }, [
    totalPrice,
    dateRange,
    Listing,
    createWalkInGuesrReservations
  ]);

  useEffect(() => {
    if (dateRange?.startDate && dateRange?.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange?.endDate,
        dateRange?.startDate,
        
      );
      if (dayCount && Listing?.price) {
        setTotalPrice(dayCount * Listing?.price );
        //* -1
      } else {
        setTotalPrice(Listing?.price);
      }
    }
  }, [dateRange, Listing?.price]);

	// console.log("Reservations on property", reservationsOnRoom?.data)



	// Handlers for room interactions
	const handleViewDetails = (room) => {
		setSelectedRoom(room);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedRoom(null);
	};

	const handleViewAvailableDates = (room) => {
		setCurrentBookingRoom(room);
		setRoomId(room?.id);
		setBookingDrawerOpen(true);
	};

	const handleBookForGuest = (room) => {
		setCurrentBookingRoom(room);
		setRoomId(room?.id);
		setWalkInBookingDrawerOpen(true);
	};

	const handleBookEntireProperty = () => {
		setEntirePropertyBookingDrawerOpen(true);
	};

	const handleDateChange = (value) => {
		setDateRange(value);
	};

	const handleViewModeChange = (_event, newMode) => {
		if (newMode !== null) {
			setViewMode(newMode);
		}
	};

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const [openNewEntry, setOpenNewEntry] = React.useState(false);
	const toggleNewEntryDrawer = (newOpen) => () => {
		setOpenNewEntry(newOpen);
	};

	const addRoomMenu = (
		<Box
			sx={{ width: 350 }}
			sm={{ width: 250 }}
			role="presentation"
		>
			<RoomMenuPanel
				toggleNewEntryDrawer={toggleNewEntryDrawer(false)}
				roomId={roomId}
				apartmentId={Listing?.id}
				setRoomId={setRoomId}
			/>
		</Box>
	);

	const roomCount = rooms?.data?.rooms?.length || 0;

	return (
		<>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="w-full"
			>
				{/* Conditional Rendering based on isRentIndividualRoom */}
				{Listing?.isRentIndividualRoom ? (
					<>
						{/* INDIVIDUAL ROOMS MODE - Show Room Management Interface */}
						{/* Header Section */}
						<Paper
							elevation={0}
							sx={{
								p: 3,
								mb: 3,
								background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
								border: '1px solid rgba(234, 88, 12, 0.1)',
								borderRadius: 2
							}}
						>
							<Box className="flex items-center justify-between flex-wrap gap-16">
								<Box className="flex items-center gap-16">
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: '12px',
											background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:home
										</FuseSvgIcon>
									</Box>
									<Box>
										<Typography
											variant="h6"
											sx={{ fontWeight: 700, color: '#292524', mb: 0.5 }}
										>
											Manage Rooms
										</Typography>
										<Box className="flex items-center gap-8">
											<Chip
												label={`${roomCount} ${roomCount === 1 ? 'Room' : 'Rooms'}`}
												size="small"
												sx={{
													background: 'rgba(249, 115, 22, 0.1)',
													color: '#ea580c',
													fontWeight: 600,
													height: 24
												}}
											/>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Configure available rooms in your property
											</Typography>
										</Box>
									</Box>
								</Box>

								<Box className="flex items-center gap-12">
									{/* View Mode Toggle */}
									<ToggleButtonGroup
										value={viewMode}
										exclusive
										onChange={handleViewModeChange}
										aria-label="view mode"
										size="small"
										sx={{
											'& .MuiToggleButton-root': {
												px: 2,
												py: 1,
												'&.Mui-selected': {
													backgroundColor: '#ea580c',
													color: 'white',
													'&:hover': {
														backgroundColor: '#c2410c'
													}
												}
											}
										}}
									>
										<ToggleButton value="cards" aria-label="card view">
											<ViewModule sx={{ fontSize: 20, mr: 0.5 }} />
											Cards
										</ToggleButton>
										<ToggleButton value="table" aria-label="table view">
											<ViewList sx={{ fontSize: 20, mr: 0.5 }} />
											Table
										</ToggleButton>
									</ToggleButtonGroup>

									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
									>
										<Button
											variant="contained"
											onClick={toggleNewEntryDrawer(true)}
											startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
											sx={{
												background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
												color: 'white',
												fontWeight: 700,
												height: 48,
												px: 3,
												'&:hover': {
													background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
													boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)'
												}
											}}
										>
											Add Room
										</Button>
									</motion.div>
								</Box>
							</Box>
						</Paper>

						{/* Rooms Display Section - Conditional rendering based on view mode */}
						<Box>
							{roomsIsLoading ? (
								<FuseLoading />
							) : viewMode === 'cards' ? (
								// Card View
								<Box>
									{rooms?.data?.rooms && rooms?.data?.rooms.length > 0 ? (
										rooms?.data?.rooms.map((room) => (
											<RoomCardRow
												key={room?.id}
												room={room}
												onViewDetails={handleViewDetails}
												onViewAvailableDates={handleViewAvailableDates}
												onBookForGuest={handleBookForGuest}
											/>
										))
									) : (
										<Paper
											elevation={0}
											sx={{
												p: 6,
												textAlign: 'center',
												border: '1px solid #e5e7eb',
												borderRadius: '16px'
											}}
										>
											<FuseSvgIcon
												size={64}
												sx={{ color: '#9ca3af', mb: 2 }}
											>
												heroicons-outline:home
											</FuseSvgIcon>
											<Typography variant="h6" color="text.secondary">
												No rooms available
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
												Click "Add Room" to create your first room
											</Typography>
										</Paper>
									)}
								</Box>
							) : (
								// Table View
								<RoomsTable
									rooms={rooms?.data?.rooms}
									roomsIsLoading={roomsIsLoading}
									roomsIsError={roomsIsError}
									setRoomId={setRoomId}
									toggleNewEntryDrawer={toggleNewEntryDrawer(true)}
								/>
							)}
						</Box>
					</>
				) : (
					<>
						{/* ENTIRE PROPERTY MODE - Show Property Booking Interface */}
						<Paper className="lg:mb-5 px-4 py-3">
							<Box className="flex items-center justify-between flex-wrap gap-16">
								<Box className="flex items-center gap-16">
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: '12px',
											background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}
									>
										<FuseSvgIcon
											className="text-white"
											size={24}
										>
											heroicons-outline:home
										</FuseSvgIcon>
									</Box>
									<Box>
										<Typography
											variant="h6"
											sx={{ fontWeight: 700, color: '#292524', mb: 0.5 }}
										>
											{Listing?.title}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Manage bookings for the entire property
										</Typography>
									</Box>
								</Box>
							</Box>
						</Paper>

						<Typography className="text-gray-600 mb-2 px-4 text-sm font-semibold" variant="body2" color="text.secondary">
							Create reservations for walk-in guests booking the entire property.
						</Typography>

						{/* Entire Property Booking Calendar */}
						<ListingReservation
							price={Listing?.price}
							totalPrice={totalPrice}
							onChangeDate={handleDateChange}
							dateRange={dateRange}
							onSubmit={onCreateReservation}
							disabled={false}
							disabledDates={disabledDates}
							isMerchantView={true}
							onBookForGuest={handleBookEntireProperty}
						/>
					</>
				)}
			</motion.div>

			{/* Add Room Drawer */}
			<Drawer
				open={openNewEntry}
				anchor="right"
			>
				{addRoomMenu}
			</Drawer>

			{/* Room Details Modal */}
			<RoomDetailsModal
				open={modalOpen}
				onClose={handleCloseModal}
				room={selectedRoom}
				onViewAvailableDates={() => {
					handleCloseModal();
					handleViewAvailableDates(selectedRoom);
				}}
			/>

			{/* Booking Drawer for Available Dates */}
			<Drawer
				open={bookingDrawerOpen}
				anchor="right"
				onClose={() => setBookingDrawerOpen(false)}
			>
				<Box
					sx={{ width: 350 }}
					role="presentation"
				>
					<RoomAvailableDatesPage
						roomId={roomId}
						roomPrice={currentBookingRoom?.price}
						propertyId={Listing?.id}
						merchantId={Listing?.shop}
						onClose={() => setBookingDrawerOpen(false)}
					/>
				</Box>
			</Drawer>

			{/* Walk-In Guest Booking Drawer (for individual rooms) */}
			<Drawer
				open={walkInBookingDrawerOpen}
				anchor="right"
				onClose={() => setWalkInBookingDrawerOpen(false)}
			>
				<Box
					sx={{ width: 450 }}
					role="presentation"
				>
					<WalkInGuestBookingForm
						roomId={roomId}
						roomPrice={currentBookingRoom?.price}
						roomTitle={currentBookingRoom?.title}
						propertyId={Listing?.id}
						propertyTitle={Listing?.title}
						propertyAddress={Listing?.propertyAddress}
						merchantId={Listing?.shop}
						createReservation={onCreateReservation}
						isCreatingReservation={createWalkInGuesrReservations.isLoading}
						onClose={() => setWalkInBookingDrawerOpen(false)}
					/>
				</Box>
			</Drawer>

			{/* Entire Property Booking Drawer (for entire property bookings) */}
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
						propertyId={Listing?.id}
						propertyPrice={Listing?.price}
						propertyTitle={Listing?.title}
						propertyAddress={Listing?.propertyAddress}
						merchantId={Listing?.shop}
						onCreateReservation={onCreateReservation}
						isCreatingReservation={createWalkInGuesrReservations.isLoading}
						onClose={() => setEntirePropertyBookingDrawerOpen(false)}
					/>
				</Box>
			</Drawer>
		</>
	);
}

export default AboutManageRoomsTab;
