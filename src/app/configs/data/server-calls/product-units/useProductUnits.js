import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getProdShippingWeightUnit,
  // createProdUnit,
  getProdUnitById,
  getProdUnitByShopPlan,
  getProdUnits,
  // updateProdUnitById,
} from '../../client/clientToApiRoutes';

export default function useProductUnits() {
  return useQuery(['__productunits'], getProdUnits);
}

//Product Units By Shop_plan
export function useProductUnitsByShopPlan(prodUnitId) {
  return useQuery(
    ['__productUnitById', prodUnitId],

    () => getProdUnitByShopPlan(prodUnitId),
    {
      enabled: Boolean(prodUnitId),
      staleTime: 5000,
    }
  );
}

//get single product units
export function useSingleProductUnit(prodUnitId) {
  return useQuery(
    ['__productUnitById', prodUnitId],
    () => getProdUnitById(prodUnitId),
    {
      enabled: Boolean(prodUnitId),
      // staleTime: 5000,
    }
  );
}

// //create new product unit
// export function useAddProductUnitMutation() {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (newProdUnit) => {
//       console.log('Run Product unit: ', newProdUnit);
//       return createProdUnit(newProdUnit);
//     },

//     {
//       onSuccess: (data) => {
//         if (data) {
//           console.log('New product unit Data', data);
//           toast.success('product unit added successfully!');
//           queryClient.invalidateQueries(['__productunits']);
//           queryClient.refetchQueries('__productunits', { force: true });
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

// //update new product unit
// export function useProductUnitUpdateMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(updateProdUnitById, {
//     onSuccess: (data) => {
//       console.log('Updated Product Category Data', data);
//       toast.success('product unit updated successfully!!');
//       queryClient.invalidateQueries('__productunits');
//       // queryClient.refetchQueries('__productunits', { force: true });

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
export function useProductShippingWeightUnit() {
  return useQuery(['__shippingweigjt'], getProdShippingWeightUnit);
}

