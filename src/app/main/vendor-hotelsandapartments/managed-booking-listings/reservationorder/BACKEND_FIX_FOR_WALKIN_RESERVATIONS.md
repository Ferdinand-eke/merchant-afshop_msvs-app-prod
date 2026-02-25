# Backend Fix Required for Walk-In Reservations 500 Error

## Problem Summary

**Error Message**: `{ "statusCode": 500, "message": "The invalid data or message pattern (undefined/null)" }`

**Root Cause**: The backend is trying to fetch `userInReservedBooking` data based on `userCreatorId`, but for walk-in reservations, `userCreatorId` is `null`. This causes the query to fail with a 500 error.

**Affected Reservations**: Only walk-in reservations (where `isWalkIn === true` and `userCreatorId === null`)

---

## Current Backend Code (Problematic)

```typescript
const myBookedReservation = await this.database.bookinglistreservations.findUnique({
  where: {
    id: propertyId,
  },
  select: {
    id: true,
    shop: true,
    startDate: true,
    endDate: true,
    isPaid: true,
    PaidAt: true,
    paymentResult: true,
    createdAt: true,
    updatedAt: true,
    bookingPropertyId: true,
    totalPrice: true,
    isCheckIn: true,
    isCheckOut: true,
    checkedInAt: true,
    checkedOutAt: true,
    isEntireProperty: true,
    isWalkIn: true,
    merchantDeskCreatorId: true,
    merchantStaffCreatorId: true,
    paymentdatas: true,
    isTripFullfiled: true,
    tripFullfiledAt: true,
    userCreatorId: true,
  },
});

console.log("My Booked Reservation:", myBookedReservation);

return {
  success: true,
  statusCode: 200,
  reservation: myBookedReservation,
};
```

**Issue**: This code doesn't handle the `userInReservedBooking` relation, but somewhere in your API pipeline, the code is trying to fetch user data unconditionally, causing the error.

---

## Required Backend Fix

### Option 1: Conditional User Data Fetching (RECOMMENDED)

Update your backend service to **conditionally** include user data only when `userCreatorId` exists:

```typescript
async findMerchantSingleReservation(reservationId: string) {
  // First, fetch the reservation to check if it's a walk-in
  const reservation = await this.database.bookinglistreservations.findUnique({
    where: { id: reservationId },
    select: {
      id: true,
      shop: true,
      startDate: true,
      endDate: true,
      isPaid: true,
      PaidAt: true,
      paymentResult: true,
      createdAt: true,
      updatedAt: true,
      bookingPropertyId: true,
      totalPrice: true,
      isCheckIn: true,
      isCheckOut: true,
      checkedInAt: true,
      checkedOutAt: true,
      isEntireProperty: true,
      isWalkIn: true,
      merchantDeskCreatorId: true,
      merchantStaffCreatorId: true,
      paymentdatas: true,
      isTripFullfiled: true,
      tripFullfiledAt: true,
      userCreatorId: true,
    },
  });

  if (!reservation) {
    throw new NotFoundException('Reservation not found');
  }

  // Conditionally fetch user data ONLY if userCreatorId exists
  let userInReservedBooking = null;

  if (reservation.userCreatorId) {
    userInReservedBooking = await this.database.user.findUnique({
      where: { id: reservation.userCreatorId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        // ... other user fields you need
      },
    });
  }

  return {
    success: true,
    statusCode: 200,
    reservationBooked: {
      reservation: reservation,
    },
    userInReservedBooking: userInReservedBooking, // Will be null for walk-in guests
  };
}
```

---

### Option 2: Use Prisma Include with Conditional Logic

Alternatively, use Prisma's `include` feature but handle null relations:

```typescript
async findMerchantSingleReservation(reservationId: string) {
  const reservationData = await this.database.bookinglistreservations.findUnique({
    where: { id: reservationId },
    select: {
      id: true,
      shop: true,
      startDate: true,
      endDate: true,
      isPaid: true,
      PaidAt: true,
      paymentResult: true,
      createdAt: true,
      updatedAt: true,
      bookingPropertyId: true,
      totalPrice: true,
      isCheckIn: true,
      isCheckOut: true,
      checkedInAt: true,
      checkedOutAt: true,
      isEntireProperty: true,
      isWalkIn: true,
      merchantDeskCreatorId: true,
      merchantStaffCreatorId: true,
      paymentdatas: true,
      isTripFullfiled: true,
      tripFullfiledAt: true,
      userCreatorId: true,
    },
  });

  if (!reservationData) {
    throw new NotFoundException('Reservation not found');
  }

  // Build response with conditional user data
  const response: any = {
    success: true,
    statusCode: 200,
    reservationBooked: {
      reservation: reservationData,
    },
  };

  // Only add user data if userCreatorId exists
  if (reservationData.userCreatorId) {
    const user = await this.database.user.findUnique({
      where: { id: reservationData.userCreatorId },
    });

    if (user) {
      response.userInReservedBooking = { user };
    }
  }

  return response;
}
```

---

## Response Structure

### For Walk-In Reservations (userCreatorId = null):

```json
{
  "success": true,
  "statusCode": 200,
  "reservationBooked": {
    "reservation": {
      "id": "699d767728ae0bc96587ece5",
      "shop": "6911a507575686d8ec7bc3b8",
      "isWalkIn": true,
      "userCreatorId": null,
      "paymentdatas": {
        "bookingName": "Eke Ferdinand",
        "bookingPhone": "08035868983",
        "bookingAddress": "Paradise, Idu",
        "guestEmail": "ninoferazi@gmail.com",
        "paymentMethod": "BANK_TRANSFER"
      },
      // ... other fields
    }
  },
  "userInReservedBooking": null  // ← NULL for walk-in guests
}
```

### For User-Created Reservations (userCreatorId exists):

```json
{
  "success": true,
  "statusCode": 200,
  "reservationBooked": {
    "reservation": {
      "id": "abc123...",
      "shop": "6911a507575686d8ec7bc3b8",
      "isWalkIn": false,
      "userCreatorId": "user_abc_123",
      // ... other fields
    }
  },
  "userInReservedBooking": {
    "user": {
      "id": "user_abc_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }
}
```

---

## Frontend Changes (Already Applied)

The frontend has been updated to handle both cases:

### In `ReservationOrder.jsx` (line 183):

```javascript
label={
  reservationItem?.data?.reservationBooked?.reservation?.isWalkIn
    ? reservationItem?.data?.reservationBooked?.reservation?.paymentdatas?.bookingName || 'Walk-In Guest'
    : reservationItem?.data?.userInReservedBooking?.user?.name || 'Guest'
}
```

**Logic**:
- If `isWalkIn === true`: Display `paymentdatas.bookingName` (walk-in guest name)
- If `isWalkIn === false`: Display `userInReservedBooking.user.name` (registered user name)

### Added Walk-In Badge:

```javascript
{reservationItem?.data?.reservationBooked?.reservation?.isWalkIn && (
  <Chip
    icon={<FuseSvgIcon size={16}>heroicons-outline:user-add</FuseSvgIcon>}
    label="Walk-In"
    size="small"
    sx={{
      background: 'rgba(168, 85, 247, 0.1)',
      color: '#9333ea',
      fontWeight: 600,
      border: '1px solid rgba(168, 85, 247, 0.2)'
    }}
  />
)}
```

---

## Testing Checklist

After applying the backend fix:

### 1. Test Walk-In Reservations:
- [ ] Create a walk-in reservation from merchant dashboard
- [ ] Navigate to the reservation detail page
- [ ] Verify no 500 error occurs
- [ ] Verify guest name displays from `paymentdatas.bookingName`
- [ ] Verify "Walk-In" badge is displayed
- [ ] Verify payment method displays correctly
- [ ] Verify check-in/check-out functionality works

### 2. Test User-Created Reservations:
- [ ] Create a reservation from user platform
- [ ] Navigate to the reservation detail page
- [ ] Verify user name displays from `userInReservedBooking.user.name`
- [ ] Verify "Walk-In" badge is NOT displayed
- [ ] Verify all user data displays correctly

### 3. Test Both Types Together:
- [ ] View reservation list page with both walk-in and user reservations
- [ ] Verify both types render correctly
- [ ] Switch between different reservation types
- [ ] Verify no errors in console

---

## Key Data Fields for Walk-In Guests

Walk-in reservations store guest data in the `paymentdatas` JSON field:

```typescript
interface PaymentDatas {
  bookingName: string;        // Guest full name
  bookingPhone: string;       // Guest phone number
  bookingAddress: string;     // Guest residential address
  guestEmail?: string;        // Optional guest email
  paymentMethod: string;      // Payment method (CASH, BANK_TRANSFER, etc.)
  notes?: string;             // Optional notes
  identityType?: string;      // Identity card type (if needed)
  identityImageUrl?: string;  // Base64 or URL of identity card image
}
```

---

## Error Prevention

### Backend Validation:

Add this check before attempting to query user data:

```typescript
// SAFE: Check if userCreatorId exists before querying
if (reservation.userCreatorId && reservation.userCreatorId !== null) {
  // Query user data
}

// UNSAFE: Direct query without null check
const user = await this.database.user.findUnique({
  where: { id: reservation.userCreatorId } // ❌ Fails if null
});
```

### Frontend Validation:

Always use optional chaining and fallbacks:

```javascript
// SAFE: Optional chaining with fallback
reservation?.paymentdatas?.bookingName || 'Guest'

// UNSAFE: Direct access
reservation.paymentdatas.bookingName // ❌ Throws error if undefined
```

---

## Summary

### Backend Changes Required:
1. ✅ Conditionally fetch `userInReservedBooking` only when `userCreatorId` exists
2. ✅ Return `null` for `userInReservedBooking` field when dealing with walk-in guests
3. ✅ Ensure response structure is consistent for both types

### Frontend Changes Applied:
1. ✅ Updated `ReservationOrder.jsx` to display walk-in guest name from `paymentdatas`
2. ✅ Added conditional logic to show correct guest name based on `isWalkIn` flag
3. ✅ Added "Walk-In" badge for walk-in reservations
4. ✅ All components use safe navigation with fallbacks

### Expected Outcome:
- ✅ No more 500 errors for walk-in reservations
- ✅ Guest names display correctly for both types
- ✅ Payment methods display correctly
- ✅ Check-in/check-out works for both types

---

**Implementation Date**: 2026-02-24
**Status**: Frontend ✅ Complete | Backend ⏳ Pending
**Files Modified**: `ReservationOrder.jsx`
**Backend Files to Modify**: Your reservation service file (likely `BookingReservationService.ts` or similar)
