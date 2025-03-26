import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getAllMerchantOwnedMartMenus,
  getMyShopFoodMartMenuBySlug,
  getShopFoodMartMenus,
  storeShopFoodMartMenu,
  updateMyShopFoodMartById,
} from "../../client/clientToApiRoutes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

/****1) get all food-menu for a Specific merchant-FOOD_MART=> shop-food mart */
export default function useMyShopFoodMartMenus(foodMartId) {
  return useQuery(
    ["__myshop_foodmart_menu", foodMartId],
    () => getShopFoodMartMenus(foodMartId),
    {
      enabled: Boolean(foodMartId),
    }
  );
}

/***##########################################################################################################
 * *1.1) get all food-menu for a Specific merchant
 * (Note: All menu items irrespective of which "foodMart" ite belongs) so long as it belongs to merchant
 * ###########################################################################################################
 *  */
export function useAuthMerchantMenus() {
  return useQuery(
    ["__myshop_foodmart_menu" ],
    () => getAllMerchantOwnedMartMenus(),
    {
      // enabled: Boolean(),
    }
  );
}

/***2) get single food-menu details */
export function useSingleShopFoodMartMenu(slug) {
  if (!slug || slug === "new") {
    return {};
  }
  return useQuery(
    ["singlefoodmartmenu", slug],
    () => getMyShopFoodMartMenuBySlug(slug),
    {
      enabled: Boolean(slug),
    }
  );
}

/****3) create new food mart menu || store Shop FoodMart Menu */
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
          toast.success("food mart added successfully!");
          queryClient.invalidateQueries(["__myshop_foodmart_menu"]);
          queryClient.refetchQueries("__myshop_foodmart_menu", { force: true });
          navigate("/foodmarts/managed-foodmerchants");
        }
      },
    },
    {
      onError: (error, rollback) => {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        rollback();
      },
    }
  );
}

/****4) update a food-menu property */
export function useFoodMartMenUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation(updateMyShopFoodMartById, {
    onSuccess: (data) => {

      if (data?.data?.success) {
        toast.success("food mart updated successfully!!");

        queryClient.invalidateQueries("__myshop_foodmart_menu");
      }
    },
    onError: (error) => {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    },
  });
}
