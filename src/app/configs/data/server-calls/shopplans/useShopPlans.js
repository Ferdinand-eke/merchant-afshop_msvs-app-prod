import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  getShopPlanById,
  getShopPlans,
} from '../../client/clientToApiRoutes';
// import {
//   createMarket,
//   createShopPlan,
//   getMarketById,
//   getMarkets,
//   getShopPlanById,
//   getShopPlans,
//   updateMarketById,
//   updateShopPlanById,
// } from '../../store-redux/api/apiRoutes';

export default function useShopplans() {
  return useQuery(['shopplans'], getShopPlans);
}

//get single shop plan
export function useSingleShopplans(shopplanId) {
  return useQuery(
    ['__shopplan', shopplanId],
    () => getShopPlanById(shopplanId),
    {
      enabled: Boolean(shopplanId),
      staleTime: 2000,
    }
  );
}

//create single shop plan
// export function useAddShopPlanMutation() {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newShopPlan) => {
//       console.log('Run shop plan : ', newShopPlan);
//       return createShopPlan(newShopPlan);
//     },

//     {
//       onSuccess: (data) => {
//         if (data) {
//           console.log('New plan  Data', data);
//           toast.success('shop plan  added successfully!');
//           queryClient.invalidateQueries(['shopplans']);
//           queryClient.refetchQueries('shopplans', { force: true });
//         }
//       },
//     },
//     {
//       onError: (error, values, rollback) => {
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

//update single shop plan
// export function useShopPlanUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateShopPlanById, {
//     onSuccess: (data) => {
//       console.log('Updated plan  Data', data);
//       toast.success('shop plan  updated successfully!!');
//       queryClient.invalidateQueries('shopplans');
//       // queryClient.refetchQueries('shopplans', { force: true });

//       // navigate('/transaction-list');
//     },
//     onError: (err) => {
//       // toast.error('Oops!, an error occured', err);
//       toast.error(
//         err.response && err.response.data.message
//           ? err.response.data.message
//           : err.message
//       );
//       // queryClient.invalidateQueries('__myshop_orders');
//     },
//   });
// }
