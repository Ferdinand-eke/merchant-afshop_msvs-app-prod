import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getShopBookingsReservationsApi, getSingleMerchantReservationApi, merchantCheckInGuestReservations, merchantCheckOutGuestReservations } from '../../client/clientToApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

//get all Specific user shop-estate property   /myshop/merchant-homes/get-my-reservations
export default function useMyPropertiesReservations() {
  return useQuery(['__merchant_reservations'], getShopBookingsReservationsApi);
}

/****Get single Guest Bookded Reservation */
export function useFindMerchantSingleReservation(itemId) {
  return useQuery(['__merchant_reservations', itemId], () => {
    // console.log('ShopItemsBy-ORDER_ID', itemId)
    return getSingleMerchantReservationApi(itemId)
  }
  );
}

/***Check In Guest Users Reservations */
export function useCheckInGuest() {
  const queryClient = useQueryClient();
  return useMutation(merchantCheckInGuestReservations, {
    onSuccess: () => {
      toast.success('Reservation Checked In successfully!');
      queryClient.invalidateQueries('__merchant_reservations');
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured');
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

/***Check Out Guest Users Reservations */
export function useCheckOutGuest() {
  const queryClient = useQueryClient();
  return useMutation(merchantCheckOutGuestReservations, {
    onSuccess: () => {
      toast.success('Reservation Checked Out successfully!');
      queryClient.invalidateQueries('__merchant_reservations');
    },
    onError: (err) => {
      // toast.success('Oops!, an error occured');
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}

//get single estate property details
// export function useSingleShopBookingsProperty(slug) {
//   if (!slug || slug === "new") {
//     return {};
//   }
//   return useQuery(
//     ['singlebookingproperty', slug],
//     () => getMyShopBookingsPropertyBySlug(slug),
//     {
//       enabled: Boolean(slug),
//       // staleTime: 5000,
//     }
//   );
// }

// //create new property
// export function useAddShopBookingsPropertyMutation() {
//   const navigate = useNavigate()
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newEstateProperty) => {
//       // console.log('Run Product : ', newEstateProperty);

//       // return;
//       return storeShopBookingsProperty(newEstateProperty);
//     },

//     {
//       onSuccess: (data) => {
//         console.log('New BOOKINGS PROPERTY  Data', data);
//         //newMBookingProperty
//         if (data?.data?.success 
//           // && data?.data?.newMBookingProperty
//           ) {
//           console.log('New ESTATEPROPERTY  Data', data);

//           toast.success('property  added successfully!');
//           queryClient.invalidateQueries(['__myshop_bookingsproperties']);
//           queryClient.refetchQueries('__myshop_bookingsproperties', { force: true });
//           navigate('/bookings/managed-listings')
//         }
//       },
//     },
//     {
//       onError: (error, rollback) => {
//         // return;
//         toast.error(
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message
//         );
//         console.log('MutationError', error.response.data);
//         console.log('MutationError', error.data);
//         rollback();
//       },
//     }
//   );
// }

// //update existing property
// export function useBookingsPropertyUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateMyShopBookingsPropertyById, {
//     onSuccess: (data) => {
//       console.log('Updated Producr clientController', data);

//       if (data?.data?.success) {
//        toast.success('product updated successfully!!');

//         queryClient.invalidateQueries('__myshop_bookingsproperties');
//       }
//     },
//     onError: (error) => {
//       toast.error(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//       // queryClient.invalidateQueries('__myshop_orders');
//     },
//   });
// }

//update existing product: Pushing it for export
// export function usePushProductForExportMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(pushMyShopProductByIdToExport, {
//     onSuccess: (data) => {
//       console.log('push Product clientController', data);

//       if (data) {
//        toast.success('product pushed to export successfully!!');

//         queryClient.invalidateQueries('__myshop_bookingsproperties');
//         queryClient.invalidateQueries([
//           '__myshop_bookingsproperties',
//           '__myshop_details',
//         ]);
//       }
//     },
//     onError: (error) => {
//       console.log('PushingExportError', error);
//       toast.error('Error occured while pushing product!!');
//       // toast.error(
//       //   error.response && error.response.data.message
//       //     ? error.response.data.message
//       //     : error.message
//       // );
//     },
//   });
// }

//update existing product: Pulling it from export
// export function usePullProductFromExportMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(pullMyShopProductByIdFromExport, {
//     onSuccess: (data) => {
//       console.log('Pull Product clientController', data);

//       if (data) {
//        toast.success('product pulled successfully!!');

//         // queryClient.invalidateQueries('__myshop_bookingsproperties');
//         queryClient.invalidateQueries([
//           '__myshop_bookingsproperties',
//           '__myshop_details',
//         ]);
//       }
//     },
//     onError: (error) => {
//       toast.error(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//     },
//   });
// }
