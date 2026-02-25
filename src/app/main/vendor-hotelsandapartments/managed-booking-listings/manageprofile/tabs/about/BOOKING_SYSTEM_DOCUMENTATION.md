# Enhanced Booking System Documentation

## Overview

This documentation covers the enhanced booking system for the AfricanShops Hotels & Apartments merchant portal. The system now supports both individual room bookings and entire property bookings, with a professional merchant interface for managing walk-in guests.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [Features](#features)
4. [Component Details](#component-details)
5. [Usage Guide](#usage-guide)
6. [API Integration](#api-integration)
7. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

The booking system is built on a conditional rendering architecture that switches between:

### 1. **Individual Room Rental Mode** (`listing?.isRentIndividualRoom === true`)
- Displays a list of rooms with professional card layouts
- Each room can be booked independently
- Shows room-specific availability calendars
- Supports walk-in guest bookings per room

### 2. **Entire Property Rental Mode** (`listing?.isRentIndividualRoom === false`)
- Displays property-level booking calendar
- Books the entire property at once
- Shows property-wide availability
- Supports walk-in guest bookings for the entire property

---

## Component Structure

```
/about/
├── manage-reserve-room.md (DetailsRight) - Main orchestrator component
│
├── /property-rooms/
│   ├── RoomCardRow.jsx - Enhanced room card with image slider
│   ├── RoomDetailsModal.jsx - Full-screen room details modal
│   ├── RoomAvailableDatesPage.jsx - Room availability calendar
│   ├── WalkInGuestBookingForm.jsx - Walk-in booking form for rooms
│   └── ListingRooms.jsx - Room list container
│
├── /reservationreview/
│   ├── index.jsx (ListingReservation) - Entire property booking component
│   └── EntirePropertyBookingForm.jsx - Walk-in booking form for entire property
│
├── /calender/
│   └── index.jsx (Calender) - Reusable calendar component
│
└── AboutManageRoomsTab.jsx - Merchant room management interface
```

---

## Features

### 1. **Professional Room Card Display**
- **Image Slider**: Navigate through room images with left/right arrows
- **Quick View**: Click on room image to open full details modal
- **Room Features**: Display guest count, bed count, bathrooms, room size
- **Amenities Preview**: Show first 3 amenities with "+" indicator
- **Action Buttons**:
  - "View Availability" - Opens calendar drawer
  - "Book for Guest" - Opens walk-in booking form

### 2. **View Mode Toggle** (Merchant Interface)
- **Cards View**: Visual card layout with images and details
- **Table View**: Compact table format for quick scanning
- Persistent toggle state
- Responsive design for mobile/desktop

### 3. **Walk-In Guest Booking**
- **Guest Information Collection**:
  - Guest name (required)
  - Phone number (required)
  - Email address (optional)
  - Special notes (optional)
- **Date Selection**: Interactive calendar with disabled dates
- **Price Calculation**: Automatic total calculation based on nights
- **Validation**: Form validation with helpful error messages
- **Confirmation**: Submit booking with loading states

### 4. **Enhanced Calendar System**
- Shows disabled dates from existing reservations
- Visual date range selection
- Price breakdown per night
- Total price calculation
- Prevents double-booking

### 5. **Merchant View Indicators**
- "Merchant View" badge on booking interfaces
- Different CTAs for merchants vs guests
- Walk-in booking specific messaging
- Payment collection reminders

---

## Component Details

### RoomCardRow Component

**Location**: `property-rooms/RoomCardRow.jsx`

**Props**:
```javascript
{
  room: Object,              // Room data with images, price, amenities
  onViewDetails: Function,   // Handler to open room details modal
  onViewAvailableDates: Function, // Handler to open availability calendar
  onBookForGuest: Function   // Handler to open walk-in booking form
}
```

**Features**:
- Responsive grid layout (12 cols mobile, 4-5-3 desktop)
- Image carousel with navigation
- Feature icons (guests, beds, baths, size)
- Hover effects and animations
- Click-to-view image modal

**Key Styling**:
- Orange gradient theme (#ea580c, #c2410c)
- Smooth transitions
- Card elevation on hover
- Professional spacing and typography

---

### WalkInGuestBookingForm Component

**Location**: `property-rooms/WalkInGuestBookingForm.jsx`

**Props**:
```javascript
{
  roomId: String,           // Room ID for reservation
  roomPrice: Number,        // Price per night
  roomTitle: String,        // Room name/title
  propertyId: String,       // Parent property ID
  merchantId: String,       // Merchant ID
  onClose: Function         // Close handler
}
```

**Features**:
- Form validation with error states
- Real-time disabled dates from API
- Automatic price calculation
- Loading states during submission
- Cancel/Confirm actions

**Form Fields**:
- Guest Name: Text input with validation
- Phone Number: Tel input with format validation
- Email: Email input with optional validation
- Notes: Multiline text area
- Dates: Calendar component integration

**Validation Rules**:
- Guest name: Required, non-empty
- Phone: Required, matches phone pattern
- Email: Optional, valid email format if provided
- Dates: Both start and end dates required

---

### AboutManageRoomsTab Component

**Location**: `AboutManageRoomsTab.jsx`

**New Features**:
- View mode toggle (cards/table)
- Room details modal integration
- Booking drawer management
- Walk-in booking drawer
- Empty state handling

**State Management**:
```javascript
{
  viewMode: 'cards' | 'table',
  selectedRoom: Object | null,
  modalOpen: boolean,
  bookingDrawerOpen: boolean,
  walkInBookingDrawerOpen: boolean,
  currentBookingRoom: Object | null
}
```

**Key Handlers**:
- `handleViewDetails`: Opens room details modal
- `handleViewAvailableDates`: Opens availability calendar
- `handleBookForGuest`: Opens walk-in booking form
- `handleViewModeChange`: Switches between card/table view

---

### EntirePropertyBookingForm Component

**Location**: `reservationreview/EntirePropertyBookingForm.jsx`

**Props**:
```javascript
{
  propertyId: String,       // Property ID
  propertyPrice: Number,    // Price per night for entire property
  propertyTitle: String,    // Property name
  merchantId: String,       // Merchant ID
  onClose: Function         // Close handler
}
```

**Features**:
- Similar to WalkInGuestBookingForm but for entire property
- Warning alerts about booking entire property
- All rooms reserved message
- Property-wide calendar

---

### ListingReservation Component (Enhanced)

**Location**: `reservationreview/index.jsx`

**New Props**:
```javascript
{
  ...existingProps,
  isMerchantView: boolean,      // Flag for merchant view
  onBookForGuest: Function      // Walk-in booking handler
}
```

**Merchant View Features**:
- "Merchant View" badge indicator
- "Book for Walk-In Guest" button
- Helper text for merchants
- Nights count display

---

### DetailsRight Component (Enhanced)

**Location**: `manage-reserve-room.md`

**New Props**:
```javascript
{
  ...existingProps,
  isMerchantView: boolean  // Determines if merchant or guest view
}
```

**Conditional Rendering Logic**:
```javascript
if (listing?.isRentIndividualRoom) {
  // Show ListingRooms component
  // Each room has its own booking flow
} else {
  // Show ListingReservation component
  // Entire property booking flow
}
```

**New Features**:
- Entire property booking drawer
- Context-aware helper text
- Merchant-specific CTAs

---

## Usage Guide

### For Merchants - Managing Room Bookings

1. **Navigate to Property Management**
   - Go to managed booking listings
   - Select a property with `isRentIndividualRoom: true`

2. **View Rooms**
   - Toggle between Cards/Table view
   - Cards view shows visual layout with images
   - Table view shows compact data table

3. **Book for Walk-In Guest (Individual Room)**
   - Click "Book for Guest" on any room card
   - Fill in guest information
   - Select check-in/check-out dates
   - Review total price
   - Click "Confirm Booking"

4. **Book for Walk-In Guest (Entire Property)**
   - For properties with `isRentIndividualRoom: false`
   - Click "Book for Walk-In Guest" button
   - Fill in guest information
   - Select dates
   - Confirm booking (reserves entire property)

### For Guests - Viewing Available Dates

1. **Browse Rooms**
   - View room cards with images
   - Click on image for quick view
   - See amenities and features

2. **Check Availability**
   - Click "View Availability"
   - Calendar shows available dates
   - Disabled dates are already booked
   - Select date range
   - Click "Reserve"

---

## API Integration

### Required API Endpoints

#### 1. Get Rooms for Property
```javascript
useGetRoomsFromBookingProperty(propertyId)
```
**Returns**: List of rooms with images, price, amenities

#### 2. Get Reservations on Room
```javascript
useGetReservationsOnRoom(roomId)
```
**Returns**: List of reservations to calculate disabled dates

#### 3. Get Reservations on Property
```javascript
useFetchReservationsOnProperty(propertyId)
```
**Returns**: Property-wide reservations

#### 4. Create Walk-In Reservation (TO BE IMPLEMENTED)
```javascript
createWalkInReservation(bookingData)
```

**Request Body**:
```javascript
{
  guestName: String,
  guestEmail: String | null,
  guestPhone: String,
  notes: String | null,
  totalPrice: Number,
  startDate: Date,
  endDate: Date,
  listingId: String,
  roomOnPropertyId: String | null,  // null for entire property
  merchantId: String,
  isWalkIn: true,
  isEntireProperty: boolean  // true if entire property
}
```

---

## Styling Guidelines

### Color Palette
- Primary Orange: `#ea580c`
- Dark Orange: `#c2410c`
- Light Orange: `#f97316`
- Background Orange: `#fff5f0`
- Border Orange: `#fed7aa`

### Typography
- Headings: Font weight 700-800
- Body: Font weight 400-600
- Captions: Font size 0.75rem - 0.875rem

### Spacing
- Card padding: 16px - 24px
- Section gaps: 16px - 24px
- Button padding: 12px - 20px

### Responsive Breakpoints
- Mobile: xs (0px - 600px)
- Tablet: sm/md (600px - 900px)
- Desktop: lg/xl (900px+)

---

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Connect walk-in booking forms to API
- [ ] Add confirmation emails/SMS
- [ ] Implement booking history view
- [ ] Add payment processing integration

### Phase 2 (Short-term)
- [ ] Add bulk booking for multiple rooms
- [ ] Implement pricing rules (weekday/weekend)
- [ ] Add discount codes support
- [ ] Create booking reports and analytics

### Phase 3 (Long-term)
- [ ] Channel manager integration (Booking.com, Airbnb)
- [ ] Automated check-in/check-out
- [ ] Guest messaging system
- [ ] Review management system
- [ ] Dynamic pricing based on demand

---

## Testing Checklist

### Component Tests
- [ ] RoomCardRow renders correctly with all props
- [ ] Image slider navigation works
- [ ] Modal opens/closes properly
- [ ] Walk-in booking form validates correctly
- [ ] Calendar disables correct dates
- [ ] Price calculation is accurate
- [ ] View toggle switches correctly

### Integration Tests
- [ ] Room booking flow end-to-end
- [ ] Entire property booking flow end-to-end
- [ ] Drawer state management
- [ ] API calls trigger correctly
- [ ] Error handling works

### UI/UX Tests
- [ ] Responsive design on all screen sizes
- [ ] Loading states display properly
- [ ] Error messages are helpful
- [ ] Animations are smooth
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Troubleshooting

### Common Issues

**Issue**: Calendar doesn't show disabled dates
**Solution**: Ensure `useGetReservationsOnRoom` or `useFetchReservationsOnProperty` is returning data correctly

**Issue**: Images not loading
**Solution**: Check that room images have `url` property or are direct URLs

**Issue**: Walk-in booking form doesn't submit
**Solution**: Check console for validation errors and ensure all required fields are filled

**Issue**: View toggle doesn't work
**Solution**: Verify `viewMode` state is being updated and conditional rendering logic is correct

---

## Support

For questions or issues related to this booking system enhancement:

1. Check this documentation first
2. Review component prop types and required data
3. Check browser console for errors
4. Verify API endpoints are returning expected data
5. Contact the development team with specific error messages

---

## Version History

**v1.0.0** - Initial enhanced booking system
- Professional room card layout
- Walk-in guest booking forms
- View mode toggle
- Enhanced calendar integration
- Merchant-specific features

---

**Last Updated**: 2026-02-23
**Author**: Claude Code Enhancement Team
**Status**: Production Ready (pending API integration)
