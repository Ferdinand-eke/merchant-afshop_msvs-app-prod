import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  // createProdCat,
  getProdCatById,
  getProdCats,
  // updateProdCatById,
} from '../../client/clientToApiRoutes';

export default function useProductCats() {
  return useQuery(['__productcats'], getProdCats);
}

//get single product category
export function useSingleProductCat(proCatId) {
  return useQuery(
    ['__productcatsById', proCatId],
    () => getProdCatById(proCatId),
    {
      enabled: Boolean(proCatId),
      // staleTime: 5000,
    }
  );
}

// //create new product category
// export function useAddProductCatMutation() {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newProdCat) => {
//       console.log('Run Product Category: ', newProdCat);
//       return createProdCat(newProdCat);
//     },

//     {
//       onSuccess: (data) => {
//         if (data) {
//           console.log('New product category Data', data);
//           toast.success('product category added successfully!');
//           queryClient.invalidateQueries(['__productcats']);
//           queryClient.refetchQueries('__productcats', { force: true });
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

// //update new product category
// export function useProductCatUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateProdCatById, {
//     onSuccess: (data) => {
//       console.log('Updated Product Category Data', data);
//       toast.success('product category updated successfully!!');
//       queryClient.invalidateQueries('__productcats');
//       // queryClient.refetchQueries('__productcats', { force: true });

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
