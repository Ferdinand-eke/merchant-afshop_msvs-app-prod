import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { handleApiError } from '../../../utils/errorHandler';
import {
	getMyShopFoodMartBySlug,
	getShopFoodMarts,
	storeShopFoodMart,
	updateMyShopFoodMartById
} from '../../client/clientToApiRoutes';

/** **1) get all Specific user shop-food mart */
export default function useMyShopFoodMarts() {
	return useQuery(['__myshop_foodmarts'], getShopFoodMarts);
} // (Mcsvsn => Done)

/** 2) get single food mart details */
export function useSingleShopFoodMart(slug) {
	return useQuery(['singlefoodmart', slug], () => getMyShopFoodMartBySlug(slug), {
		enabled: Boolean(slug) && slug !== 'new'
	});
} // (Mcsvsn => Done)

/** **3) create new food mart storeShopFoodMart */
export function useAddShopFoodMartMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newFoodMart) => {
			return storeShopFoodMart(newFoodMart);
		},
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success(`${data?.data?.message ? data?.data?.message : 'Food mart created successfully!!'}`);
					queryClient.invalidateQueries(['__myshop_foodmarts']);
					queryClient.refetchQueries('__myshop_foodmarts', { force: true });
					navigate('/foodmarts/managed-foodmerchants');
				}
			}
		},
		{
			onError: (error, rollback) => {
				handleApiError(error, 'Failed to create food mart');
				rollback();
			}
		}
	);
} // (Mcsvsn => Done)

/** *4) update existing property */
export function useFoodMartUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopFoodMartById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Food mart updated successfully!!'}`);
				queryClient.invalidateQueries('__myshop_foodmarts');
			}
		},
		onError: (error, rollback) => {
			handleApiError(error, 'Failed to update food mart');

			if (rollback) rollback();
		}
	});
} // (Mcsvsn => Done)
