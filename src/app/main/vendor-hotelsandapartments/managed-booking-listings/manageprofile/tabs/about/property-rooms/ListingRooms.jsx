import * as React from "react";
import { Box, Button, Drawer, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { formatCurrency } from "src/app/main/vendors-shop/PosUtils";
import RoomAvailableDatesPage from "./RoomAvailableDatesPage";
import RoomDetailsModal from "./RoomDetailsModal";


export const ListingRooms = ({ rooms, propertyId, merchantId }) => {
    const [open, setOpen] = React.useState(false);
    const [roomId, setRoomId] = React.useState('');
    const [roomPrice, setRoomPrice] = React.useState('');

    // State to track current image index for each room
    const [currentImageIndexes, setCurrentImageIndexes] = React.useState({});

    // State for room details modal
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedRoom, setSelectedRoom] = React.useState(null);

    const toggleDrawer = (newOpen, idOfRoom, priceOfRoom) => () => {
        setOpen(newOpen);
        setRoomId(idOfRoom);
        setRoomPrice(priceOfRoom);
    };

    // Handler to open room details modal
    const handleOpenRoomModal = (room) => {
        setSelectedRoom(room);
        setModalOpen(true);
    };

    const handleCloseRoomModal = () => {
        setModalOpen(false);
        setSelectedRoom(null);
    };

    // Handle image navigation
    const handlePrevImage = (roomId, images) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [roomId]: prev[roomId] > 0 ? prev[roomId] - 1 : images.length - 1
        }));
    };

    const handleNextImage = (roomId, images) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [roomId]: prev[roomId] < images.length - 1 ? prev[roomId] + 1 : 0
        }));
    };

    // Get current image index for a room (default to 0)
    const getCurrentImageIndex = (roomId) => {
        return currentImageIndexes[roomId] || 0;
    };

   const AvailableDates = (
    <Box
      sx={{ width: 350 }}
      sm={{ width: 250 }}
      role="presentation"
    >
      <RoomAvailableDatesPage
        roomId={roomId}
        roomPrice={roomPrice}
        propertyId={propertyId}
        merchantId={merchantId}
        onClose={() => setOpen(false)}
      />
    </Box>
  );

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
      {rooms?.map((room) => {
        const roomImages = room?.images || room?.imageSrcs || [];
        const currentIndex = getCurrentImageIndex(room?.id);
        const hasImages = roomImages.length > 0;
        const currentImage = hasImages ? (roomImages[currentIndex]?.url || roomImages[currentIndex]) : 'https://placehold.co/400x300';

        return (
          <div key={room?.id}>
            <div className="flex flex-row items-center gap-4 p-4">
              {/* Left Side - Room Title and Price */}
              <div className="flex-1 flex flex-col justify-center px-2">
                <div className="flex flex-col gap-1">
                  {/* Room Title */}
                  <Typography
                    variant="h6"
                    className="text-gray-800 dark:text-white/90 text-base font-semibold"
                  >
                    {room?.title}
                  </Typography>

                  {/* Room Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-600 dark:text-white/60">₦</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(room?.price)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-white/40">
                      per night
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Image Slider */}
              <div className="flex-1">
                <div className="relative w-full h-40 md:h-52 rounded-lg overflow-hidden bg-gray-100">
                  {/* Room Image - Clickable */}
                  <img
                    src={currentImage}
                    alt={`${room?.title} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleOpenRoomModal(room)}
                    style={{ transition: 'transform 0.3s ease' }}
                  />

                  {/* Navigation Arrows - Only show if there are multiple images */}
                  {hasImages && roomImages.length > 1 && (
                    <>
                      <IconButton
                        onClick={() => handlePrevImage(room?.id, roomImages)}
                        sx={{
                          position: 'absolute',
                          left: 4,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          }
                        }}
                      >
                        <ChevronLeft fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() => handleNextImage(room?.id, roomImages)}
                        sx={{
                          position: 'absolute',
                          right: 4,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                          }
                        }}
                      >
                        <ChevronRight fontSize="small" />
                      </IconButton>

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded">
                        {currentIndex + 1}/{roomImages.length}
                      </div>
                    </>
                  )}

                  {/* Placeholder Text when no images */}
                  {!hasImages && (
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                      <Typography variant="caption" className="text-gray-400 text-xs">
                        No images
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <Button
                size="small"
                type="primary"
                className="w-full bg-orange-800 hover:bg-orange-500 text-white px-4 py-2 rounded-lg bottom-0 h-[30px]"
                onClick={toggleDrawer(true, room?.id, room?.price)}
                sx={{
                  backgroundColor: '#9a3412',
                  '&:hover': {
                    backgroundColor: '#f97316',
                  }
                }}
              >
                View Available Dates
              </Button>
              <hr className="mt-4"/>
            </div>
          </div>
        );
      })}

      <Drawer
        open={open}
        onClose={() => {}} // Prevent closing on backdrop click
        disableEscapeKeyDown // Prevent closing on ESC key
      >
        {AvailableDates}
      </Drawer>


      {/* Room Details Modal */}
      <RoomDetailsModal
        open={modalOpen}
        onClose={handleCloseRoomModal}
        room={selectedRoom}
        onViewAvailableDates={() => {
          // Open the booking calendar drawer for the selected room
          if (selectedRoom) {
            toggleDrawer(true, selectedRoom.id, selectedRoom.price)();
          }
        }}
      />
    </div>
  );
};
