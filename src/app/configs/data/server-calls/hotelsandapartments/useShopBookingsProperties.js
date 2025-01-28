import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { toast } from 'react-toastify';
// import { storeShopProduct } from '../../store-redux/api/apiRoutes';
import {
  getMyShopBookingsPropertyBySlug,
  // getMyShopProductById,
  getShopBookingsProperties,
  // getShopProducts,
  // pullMyShopProductByIdFromExport,
  // pushMyShopProductByIdToExport,
  storeShopBookingsProperty,
  // storeShopProduct, 
  updateMyShopBookingsPropertyById,
  // updateMyShopProductById,
} from '../../client/clientToApiRoutes';
// import { message } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

//get all Specific user shop-estate property   /myshop/merchant-homes/get-my-reservations
export default function useMyShopBookingsProperties() {
  return useQuery(['__myshop_bookingsproperties'], getShopBookingsProperties);
}

//get single estate property details
export function useSingleShopBookingsProperty(slug) {
  if (!slug || slug === "new") {
    return {};
  }
  return useQuery(
    ['singlebookingproperty', slug],
    () => getMyShopBookingsPropertyBySlug(slug),
    {
      enabled: Boolean(slug),
      // staleTime: 5000,
    }
  );
}

//create new property
export function useAddShopBookingsPropertyMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  return useMutation(
    (newEstateProperty) => {
      // console.log('Run Product : ', newEstateProperty);

      // return;
      return storeShopBookingsProperty(newEstateProperty);
    },

    {
      onSuccess: (data) => {
        console.log('New BOOKINGS PROPERTY  Data', data);
        //newMBookingProperty
        if (data?.data?.success 
          // && data?.data?.newMBookingProperty
          ) {
          console.log('New ESTATEPROPERTY  Data', data);

          toast.success('property  added successfully!');
          queryClient.invalidateQueries(['__myshop_bookingsproperties']);
          queryClient.refetchQueries('__myshop_bookingsproperties', { force: true });
          navigate('/bookings/managed-listings')
        }
      },
    },
    {
      onError: (error, rollback) => {
        // return;
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        console.log('MutationError', error.response.data);
        console.log('MutationError', error.data);
        rollback();
      },
    }
  );
}

//update existing property
export function useBookingsPropertyUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopBookingsPropertyById, {
    onSuccess: (data) => {
      console.log('Updated Producr clientController', data);

      if (data?.data?.success) {
       toast.success('product updated successfully!!');

        queryClient.invalidateQueries('__myshop_bookingsproperties');
      }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      // queryClient.invalidateQueries('__myshop_orders');
    },
  });
}

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
