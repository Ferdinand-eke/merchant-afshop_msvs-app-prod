import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCountries } from '../../client/clientToApiRoutes';
// import { getCountries } from '../../utils';
// import {
//   createCountry,
//   getCountries,
//   getCountryById,
//   updateCountryById,
// } from '../../store-redux/api/apiRoutes';

export default function useSellerCountries() {
  return useQuery(['__countries'], getCountries);
}

//get single country
// export function useSingleCountry(countryId) {
//   return useQuery(['__countries', countryId], () => getCountryById(countryId), {
//     enabled: Boolean(countryId),
//     staleTime: 5000,
//   });
// }

// //create new country
// export function useAddCountryMutation() {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newCountry) => {
//       console.log('Run: ', newCountry);
//       return createCountry(newCountry);
//     },

//     {
//       onSuccess: (data) => {
//         if (data) {
//           console.log('New Country Data', data);
//           toast.success('Country added successfully!');
//           queryClient.invalidateQueries(['__countries']);
//           queryClient.refetchQueries('__countries', { force: true });
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

//update new country
// export function useCountryUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateCountryById, {
//     onSuccess: (data) => {
//       console.log('Updated Country Data', data);
//       toast.success('country updated successfully!!');
//       queryClient.invalidateQueries('__countries');

//       // navigate('/transaction-list');
//     },
//     onError: () => {
//       toast.success('Oops!, an error occured');
//       // queryClient.invalidateQueries('__myshop_orders');
//     },
//   });
// }
