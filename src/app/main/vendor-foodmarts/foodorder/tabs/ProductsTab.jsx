import Typography from '@mui/material/Typography';
import { useGetMerchantFoodOrderItems } from 'app/configs/data/server-calls/foodmartmenuitems/useMerchantFoodOrder';
import { useParams } from 'react-router-dom';
import { formatCurrency } from 'src/app/main/vendors-shop/pos/PosUtils';
// import { useGetECommerceOrderQuery } from '../../ECommerceApi';
// import { useAdminOrderItems } from 'src/app/api/orders/useAdminGetShopOrders';

/**
 * The products tab.
 */
function ProductsTab() {
	const routeParams = useParams();
	const { orderId } = routeParams;
	const { data: orderItems } = useGetMerchantFoodOrderItems(orderId, {
		skip: !orderId
	});

	// console.log("Order-ITEMS", orderItems?.data)

	return (
		<div className="table-responsive">
			<table className="simple">
				<thead>
					<tr>
						<th>
							<Typography className="font-semibold">ID</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Image</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Name</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Price</Typography>
						</th>
						<th>
							<Typography className="font-semibold">Quantity</Typography>
						</th>
					</tr>
				</thead>
				<tbody>
					{orderItems?.data?.map((product) => (
						<tr key={product._id}>
							<td className="w-64">{product._id}</td>
							<td className="w-80">
								<img
									className="product-image rounded-8"
									src={product.image}
									alt="product"
								/>
							</td>
							<td>
								<Typography
									className="truncate"
									style={{
										color: 'inherit',
										textDecoration: 'underline'
									}}
								>
									{product.name}
								</Typography>
							</td>
							<td className="w-64 text-right">
								<span className="truncate">NGN {formatCurrency(product.price)}</span>
							</td>
							<td className="w-64 text-right">
								<span className="truncate">{product.quantity}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default ProductsTab;
