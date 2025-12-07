import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	changeShopProductImage,
	deleteShopProduct,
	deleteShopProductImage,
	getMyShopProductById,
	getShopProducts,
	pullMyShopProductByIdFromExport,
	pushMyShopProductByIdToExport,
	storeProductImages,
	storeShopProduct,
	updateMyShopProductById,
	addProductPriceTier,
	updateProductPriceTier,
	deleteProductPriceTier
} from '../../client/clientToApiRoutes';

// get all Specific user shop-products
export default function useMyShopProducts() {
	return useQuery(['__myshop_products'], getShopProducts);
} // (Msvs : 'Done)

// get single prooduct details
export function useSingleShopProduct(productId) {
	return useQuery(['singleproduct', productId], () => getMyShopProductById(productId), {
		enabled: Boolean(productId)
	});
} // (Msvs : 'Done)

// create new product
export function useAddShopProductMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newProduct) => {
			console.log('Run Product : ', newProduct);

			// return;
			return storeShopProduct(newProduct);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					console.log('New product  Data', data);

					// return;
					toast.success('product  added successfully!');
					queryClient.invalidateQueries(['__myshop_products']);
					queryClient.refetchQueries('__myshop_products', { force: true });
					navigate(`/shopproducts-list/products`);
				}
			}
		},
		{
			onError: (error, rollback) => {
				const errorData = error?.response?.data;

				if (errorData) {
					// Handle NestJS validation errors (array of messages)
					if (Array.isArray(errorData.message)) {
						errorData.message.forEach((msg) => toast.error(msg));
					}
					// Handle single error message
					else if (errorData.message) {
						toast.error(errorData.message);
					}
					// Fallback to error property or generic message
					else {
						toast.error(errorData.error || 'An error occurred while adding the product');
					}
				} else {
					// Network or unknown error
					toast.error(error?.message || 'Failed to add product. Please try again.');
				}

				if (rollback) rollback();
			}
		}
	);
} // (Msvs : 'Done)

// update existing product
export function useProductUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateMyShopProductById, {
		onSuccess: (data) => {
			console.log('Updated Product Data', data);

			if (data?.data?.success) {
				console.log('Updated Producr clientController', data);

				// return;
				toast.success(`${data?.data?.message ? data?.data?.message : 'product updated successfully!!'} `);

				queryClient.invalidateQueries('__myshop_products');
				// queryClient.refetchQueries('__myshop_products', { force: true });
				//  navigate('/shopproducts-list/products');
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'An error occurred while updating the product');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to update product. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

// update existing product: Pushing it for export
export function usePushProductForExportMutation() {
	const queryClient = useQueryClient();

	return useMutation(pushMyShopProductByIdToExport, {
		onSuccess: (data) => {
			console.log('push Product clientController', data);

			if (data) {
				toast.success('product pushed to export successfully!!');

				queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['__myshop_products', '__myshop_details']);
			}
		},
		onError: (error) => {
			console.log('PushingExportError', error);
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while pushing product for export');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to push product for export. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

// update existing product: Pulling it from export
export function usePullProductFromExportMutation() {
	const queryClient = useQueryClient();

	return useMutation(pullMyShopProductByIdFromExport, {
		onSuccess: (data) => {
			console.log('Pull Product clientController', data);

			if (data) {
				toast.success('product pulled successfully!!');

				// queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['__myshop_products', '__myshop_details']);
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while pulling product from export');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to pull product from export. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

/** *Delete a product single image */
export function useDeleteProductSingleImage() {
	const queryClient = useQueryClient();

	return useMutation(deleteShopProductImage, {
		onSuccess: (data) => {
			// console.log("productImageDeleted", data)
			// ?.success
			if (data?.data) {
				toast.success('product image deleted successfully!!');
				queryClient.invalidateQueries('__myshop_products');
				// navigate('/shopproducts-list/products');
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while deleting product image');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to delete product image. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

/** *Delete a product */
export function useDeleteSingleProduct() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteShopProduct, {
		onSuccess: (data) => {
			console.log('productDeleted', data);

			if (data?.data?.success) {
				toast.success('product deleted successfully!!');
				queryClient.invalidateQueries('__myshop_products');
				navigate('/shopproducts-list/products');
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while deleting product');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to delete product. Please try again.');
			}
		}
	});
}

/** *Add additional images to existing product */
export function useAddProductImagesMutation() {
	const queryClient = useQueryClient();

	return useMutation(storeProductImages, {
		onSuccess: (data) => {
			console.log('Product images uploaded', data);

			if (data?.data?.success || data?.data) {
				toast.success('Product images uploaded successfully!');
				queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['singleproduct']);
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while uploading product images');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to upload product images. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

/** *Change/Replace a single product image */
export function useChangeProductImageMutation() {
	const queryClient = useQueryClient();

	return useMutation(changeShopProductImage, {
		onSuccess: (data) => {
			console.log('Product image changed', data);

			if (data?.data?.success || data?.data) {
				toast.success('Product image changed successfully!');
				queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['singleproduct']);
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while changing product image');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to change product image. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

/** *Add a new price tier to existing product */
export function useAddProductPriceTierMutation() {
	const queryClient = useQueryClient();

	return useMutation(addProductPriceTier, {
		onSuccess: (data) => {
			console.log('Price tier added', data);

			if (data?.data?.success) {
				toast.success('Bulk price tier added successfully!');
				queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['singleproduct']);
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while adding price tier');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to add price tier. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

/** *Update a single price tier */
export function useUpdateProductPriceTierMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateProductPriceTier, {
		onSuccess: (data) => {
			console.log('Price tier updated', data);

			if (data?.data?.success || data?.data) {
				toast.success('Bulk price tier updated successfully!');
				queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['singleproduct']);
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while updating price tier');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to update price tier. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)

/** *Delete a single price tier */
export function useDeleteProductPriceTierMutation() {
	const queryClient = useQueryClient();

	return useMutation(deleteProductPriceTier, {
		onSuccess: (data) => {
			console.log('Price tier deleted', data);

			if (data?.data?.success || data?.data) {
				toast.success('Bulk price tier deleted successfully!');
				queryClient.invalidateQueries('__myshop_products');
				queryClient.invalidateQueries(['singleproduct']);
			}
		},
		onError: (error) => {
			const errorData = error?.response?.data;

			if (errorData) {
				// Handle NestJS validation errors (array of messages)
				if (Array.isArray(errorData.message)) {
					errorData.message.forEach((msg) => toast.error(msg));
				}
				// Handle single error message
				else if (errorData.message) {
					toast.error(errorData.message);
				}
				// Fallback to error property or generic message
				else {
					toast.error(errorData.error || 'Error occurred while deleting price tier');
				}
			} else {
				// Network or unknown error
				toast.error(error?.message || 'Failed to delete price tier. Please try again.');
			}
		}
	});
} // (Msvs : 'Done)
