import {  useQuery } from 'react-query';
// import { getTradehubs } from '../../store-redux/api/apiRoutes';

import { getTradehubs } from '../../client/clientToApiRoutes';

export default function useHubs() {
  return useQuery(['tradeHubs'], getTradehubs);
}

//get single traade hub
// export function useSingleHub(hubId) {
//   return useQuery(['tradeHubs', hubId], () => getTradehubById(hubId), {
//     enabled: Boolean(hubId),
//     staleTime: 5000,
//   });
// }

// //create new trade hub
// export function useAddHubMutation() {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newTradehub) => {
//       console.log('RunHub: ', newTradehub);
//       return createTradehub(newTradehub);
//     },

//     {
//       onSuccess: (data) => {
//         if (data) {
//           console.log('New Hub Data', data);
//           toast.success('trade hub added successfully!');
//           queryClient.invalidateQueries(['tradeHubs']);
//           queryClient.refetchQueries('tradeHubs', { force: true });
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

// //update new trade hub
// export function useHubUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateTradehubById, {
//     onSuccess: (data) => {
//       console.log('Updated Tradehub Data', data);
//       toast.success('traded hub updated successfully!!');

//       queryClient.invalidateQueries('tradeHubs');
//       queryClient.refetchQueries('tradeHubs', { force: true });

//       // navigate('/transaction-list');
//     },
//     onError: () => {
//       toast.success('Oops!, an error occured');
//       // queryClient.invalidateQueries('__myshop_orders');
//     },
//   });
// }
