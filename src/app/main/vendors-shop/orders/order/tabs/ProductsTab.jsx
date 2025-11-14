import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

/**
 * The products tab.
 */
function ProductsTab({ order, isError }) {
	const routeParams = useParams();
	const { orderId } = routeParams;

	if (!isError && !order) {
		return null;
	}

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
					<tr>
						<td className="w-64">{order._id}</td>
						<td className="w-80">
							<img
								className="product-image"
								src={order.image}
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
								{order.name}
							</Typography>
						</td>
						<td className="w-64 text-right">
							<span className="truncate">NGN {order.price}</span>
						</td>
						<td className="w-64 text-right">
							<span className="truncate">{order.quantity}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default ProductsTab;
