import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { toast } from 'react-toastify';
// import { storeShopProduct } from '../../store-redux/api/apiRoutes';
// import { message } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	getMyShopEstatePropertyBySlug,
	// getMyShopProductById,
	getShopEstateProperties,
	// getShopProducts,
	// pullMyShopProductByIdFromExport,
	// pushMyShopProductByIdToExport,
	storeShopEstateProperty,
	// storeShopProduct,
	updateMyShopEstatePropertyById
	// updateMyShopProductById,
} from '../../client/clientToApiRoutes';

// get all Specific user shop-estate property
export default function useMyShopEstateProperties() {
	return useQuery(['__myshop_estateproperties'], getShopEstateProperties);
}

// get single estate property details
export function useSingleShopEstateProperty(slug) {
	return useQuery(['singleestateproperty', slug], () => getMyShopEstatePropertyBySlug(slug), {
		enabled: Boolean(slug) && slug !== 'new'
		// staleTime: 5000,
	});
}

// create new property
export function useAddShopEstatePropertyMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newEstateProperty) => {
			// console.log('Run Product : ', newEstateProperty);

			// return;
			return storeShopEstateProperty(newEstateProperty);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success && data?.data?.savedEstateProperty) {
					console.log('New ESTATEPROPERTY  Data', data);

					toast.success('property  added successfully!');
					queryClient.invalidateQueries(['__myshop_estateproperties']);
					queryClient.refetchQueries('__myshop_estateproperties', { force: true });
					navigate('/property/managed-listings');
				}
			}
		},
		{
			onError: (error, rollback) => {
				// return;
				toast.error(
					error.response && error.response.data.message ? error.response.data.message : error.message
				);
				console.log('MutationError', error.response.data);
				console.log('MutationError', error.data);
				rollback();
			}
		}
	);
}

// update existing property
export function useEstatePropertyUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopEstatePropertyById, {
		onSuccess: (data) => {
			console.log('Updated Producr clientController', data);

			if (data?.data?.success) {
				toast.success('product updated successfully!!');

				queryClient.invalidateQueries('__myshop_estateproperties');
				// queryClient.refetchQueries('__myshop_estateproperties', { force: true });
			}

			// navigate('/transaction-list');
		},
		onError: (error) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
			// queryClient.invalidateQueries('__myshop_orders');
		}
	});
}


// update existing product: Pushing it for export
// export function usePushProductForExportMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(pushMyShopProductByIdToExport, {
//     onSuccess: (data) => {
//       console.log('push Product clientController', data);

//       if (data) {
//        toast.success('product pushed to export successfully!!');

//         queryClient.invalidateQueries('__myshop_estateproperties');
//         queryClient.invalidateQueries([
//           '__myshop_estateproperties',
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

// update existing product: Pulling it from export
// export function usePullProductFromExportMutation() {
//   const queryClient = useQueryClient();

//   return useMutation(pullMyShopProductByIdFromExport, {
//     onSuccess: (data) => {
//       console.log('Pull Product clientController', data);

//       if (data) {
//        toast.success('product pulled successfully!!');

//         // queryClient.invalidateQueries('__myshop_estateproperties');
//         queryClient.invalidateQueries([
//           '__myshop_estateproperties',
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
