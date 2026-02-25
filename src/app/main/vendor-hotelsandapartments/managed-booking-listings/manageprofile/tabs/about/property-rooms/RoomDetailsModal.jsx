import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Box, Button } from '@mui/material';
import { Close, ChevronLeft, ChevronRight, CalendarMonth } from '@mui/icons-material';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
// import { formatCurrency } from 'src/app/main/vendors-shop/PosUtils';

/**
 * RoomDetailsModal - Minimal modal to view room images and details
 * Images on the right, scrollable details on the left
 */

const RoomDetailsModal = ({ open, onClose, room, onViewAvailableDates }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when modal opens/closes - MUST be before early return
  React.useEffect(() => {
    if (open) {
      setCurrentImageIndex(0);
    }
  }, [open]);

  // Early return AFTER all hooks
  if (!room) return null;

  const roomImages = room?.images || room?.imageSrcs || [];
  const hasImages = roomImages.length > 0;
  const currentImage = hasImages
    ? (roomImages[currentImageIndex]?.url || roomImages[currentImageIndex])
    : 'https://placehold.co/600x800';

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : roomImages.length - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev < roomImages.length - 1 ? prev + 1 : 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={(theme) => theme.breakpoints.down('md')} // Full screen on mobile
      PaperProps={{
        sx: {
          height: { xs: '100vh', md: '85vh' }, // Full height on mobile
          maxHeight: { xs: '100vh', md: '700px' },
          borderRadius: { xs: 0, md: '16px' }, // No border radius on mobile
          margin: { xs: 0, md: '32px' },
        }
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: { xs: 12, md: 8 },
          top: { xs: 12, md: 8 },
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: { xs: 44, md: 40 },
          height: { xs: 44, md: 40 },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }
        }}
      >
        <Close />
      </IconButton>

      <DialogContent
        sx={{
          padding: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on mobile
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Room Details Section - 40% on desktop, 100% on mobile, order-2 */}
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            padding: { xs: 2, sm: 2.5, md: 3 },
            overflowY: 'auto',
            backgroundColor: '#fafafa',
            borderRight: { xs: 'none', md: '1px solid #e5e7eb' },
            order: { xs: 2, md: 1 }, // Show after images on mobile
            maxHeight: { xs: 'none', md: '100%' },
          }}
        >
          {/* Room Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#111827',
              marginBottom: { xs: 1.5, md: 2 },
              fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
            }}
          >
            {room?.title}
          </Typography>

          {/* Room Price */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
              marginBottom: { xs: 2, md: 3 },
              padding: { xs: 1.5, md: 2 },
              backgroundColor: '#fff5f0',
              borderRadius: '8px',
              border: '1px solid #fed7aa',
            }}
          >
            <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: '#9a3412' }}>₦</Typography>
            <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 800, color: '#ea580c' }}>
              {formatCurrency(room?.price)}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: '#9a3412' }}>
              per night
            </Typography>
          </Box>

          {/* Room Description */}
          {room?.description && (
            <>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: 1,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Description
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  marginBottom: 3,
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                }}
              >
                {room?.description}
              </Typography>
            </>
          )}

          {/* Room Details */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#374151',
              marginBottom: 1.5,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Room Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, marginBottom: 3 }}>
            {room?.bedCount && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9375rem' }}>Beds</Typography>
                <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>
                  {room?.bedCount}
                </Typography>
              </Box>
            )}

            {room?.guestCount && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9375rem' }}>Max Guests</Typography>
                <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>
                  {room?.guestCount}
                </Typography>
              </Box>
            )}

            {room?.bathroomCount && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9375rem' }}>Bathrooms</Typography>
                <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>
                  {room?.bathroomCount}
                </Typography>
              </Box>
            )}

            {room?.roomSize && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.9375rem' }}>Room Size</Typography>
                <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>
                  {room?.roomSize} sq ft
                </Typography>
              </Box>
            )}
          </Box>

          {/* Amenities */}
          {room?.amenities && room?.amenities.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: 1.5,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 3 }}>
                {room?.amenities.map((amenity, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: '6px 12px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      color: '#4b5563',
                    }}
                  >
                    {amenity}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* View Available Dates Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CalendarMonth sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />}
            onClick={() => {
              onClose(); // Close the modal first
              onViewAvailableDates(); // Then open the booking calendar
            }}
            sx={{
              marginTop: { xs: 2, md: 'auto' },
              padding: { xs: '12px 20px', md: '14px 24px' },
              backgroundColor: '#ea580c',
              fontSize: { xs: '0.9375rem', md: '1rem' },
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: { xs: '10px', md: '12px' },
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
              '&:hover': {
                backgroundColor: '#c2410c',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(234, 88, 12, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            View Available Dates & Book
          </Button>
        </Box>

        {/* Image Gallery Section - 60% on desktop, 100% on mobile, order-1 */}
        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            height: { xs: '50vh', md: '100%' }, // Fixed height on mobile
            minHeight: { xs: '300px', sm: '400px', md: 'auto' },
            position: 'relative',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            order: { xs: 1, md: 2 }, // Show first on mobile
          }}
        >
          {/* Main Image */}
          <img
            src={currentImage}
            alt={`${room?.title} - Image ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {/* Navigation Arrows - Only show if there are multiple images */}
          {hasImages && roomImages.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: { xs: 8, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <ChevronLeft sx={{ fontSize: { xs: 28, md: 32 } }} />
              </IconButton>

              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <ChevronRight sx={{ fontSize: { xs: 28, md: 32 } }} />
              </IconButton>

              {/* Image Counter */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: 12, md: 16 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  color: 'white',
                  padding: { xs: '6px 12px', md: '8px 16px' },
                  borderRadius: '20px',
                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                  fontWeight: 600,
                }}
              >
                {currentImageIndex + 1} / {roomImages.length}
              </Box>
            </>
          )}

          {/* Placeholder Text when no images */}
          {!hasImages && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: '#9ca3af', fontSize: '1rem' }}>
                No images available
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;
