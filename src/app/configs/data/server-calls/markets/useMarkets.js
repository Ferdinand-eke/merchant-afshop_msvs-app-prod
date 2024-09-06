import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAfMarkets } from '../../client/clientToApiRoutes';
// import {
//   createMarket,
//   getMarketById,
//   getMarkets,
//   updateMarketById,
// } from '../../store-redux/api/apiRoutes';
// import { getAfMarkets } from '../utils';

export default function useMarkets() {
  return useQuery(['__markets'], getAfMarkets);
}

// //get single market
// export function useSingleMarket(marketId) {
//   return useQuery(['__marketById', marketId], () => getMarketById(marketId), {
//     enabled: Boolean(marketId),
//     staleTime: 2000,
//   });
// }

// //create new  market
// export function useAddMarketMutation() {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newMarket) => {
//       console.log('Run market : ', newMarket);
//       return createMarket(newMarket);
//     },

//     {
//       onSuccess: (data) => {
//         if (data) {
//           console.log('New market  Data', data);
//           toast.success('market  added successfully!');
//           queryClient.invalidateQueries(['__markets']);
//           queryClient.refetchQueries('__markets', { force: true });
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

// //update new market
// export function useMarketUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateMarketById, {
//     onSuccess: (data) => {
//       console.log('Updated Product  Data', data);
//       toast.success('market  updated successfully!!');
//       queryClient.invalidateQueries('__markets');
//       // queryClient.refetchQueries('__markets', { force: true });

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
