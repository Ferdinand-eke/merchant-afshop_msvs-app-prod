import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	getAllMerchantOwnedMartMenus,
	getMyShopFoodMartMenuBySlug,
	getShopFoodMartMenus,
	storeShopFoodMartMenu,
	updateMyShopFoodMartById
} from '../../client/clientToApiRoutes';

/** **1) get all food-menu for a Specific merchant-FOOD_MART=> shop-food mart */
export default function useMyShopFoodMartMenus(foodMartId) {
	return useQuery(['__myshop_foodmart_menu', foodMartId], () => getShopFoodMartMenus(foodMartId), {
		enabled: Boolean(foodMartId)
	});
} // (Mcsvs => Done)

/** *##########################################################################################################
 * *1.1) get all food-menu for a Specific merchant
 * (Note: All menu items irrespective of which "foodMart" ite belongs) so long as it belongs to merchant
 * ###########################################################################################################
 *  */
export function useAuthMerchantMenus() {
	return useQuery(['__myshop_foodmart_menu'], () => getAllMerchantOwnedMartMenus(), {
		// enabled: Boolean(),
	});
}

/** *2) get single food-menu details */
export function useSingleShopFoodMartMenu(slug) {
	return useQuery(['singlefoodmartmenu', slug], () => getMyShopFoodMartMenuBySlug(slug), {
		enabled: Boolean(slug) && slug !== 'new'
	});
}

/** **3) create new food mart menu || store Shop FoodMart Menu */
export function useAddShopFoodMartMenuMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newFoodMart) => {
			return storeShopFoodMartMenu(newFoodMart);
		},
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('food mart added successfully!');
					queryClient.invalidateQueries(['__myshop_foodmart_menu']);
					queryClient.refetchQueries('__myshop_foodmart_menu', { force: true });
					navigate('/foodmarts/managed-foodmerchants');
				}
			}
		},
		{
			onError: (error, rollback) => {
				// toast.error(
				//   error.response && error.response.data.message
				//     ? error.response.data.message
				//     : error.message
				// );
				// rollback();
				const {
					response: { data }
				} = error ?? {};
				Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);
				rollback();
			}
		}
	);
} // (Mcsvs => Done)

/** **4) update a food-menu item */
export function useFoodMartMenUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopFoodMartById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('food mart updated successfully!!');

				queryClient.invalidateQueries('__myshop_foodmart_menu');
			}
		},
		onError: (error) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
		}
	});
}
