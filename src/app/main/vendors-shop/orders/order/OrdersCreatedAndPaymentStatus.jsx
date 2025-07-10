import _ from '@lodash';
import clsx from 'clsx';

/**
 * The orders status component.
 */

function OrdersCreatedAndPaymentStatus(props) {
	const {createdAt, isPaid } = props;
	

	return (
		<>
		{
			createdAt && isPaid ?
			<div
			className={clsx(
				'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
				'bg-green text-white'
			)}
		>
			Order Created & Paid
		</div> : <div
			className={clsx(
				'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
				'bg-red-700 text-white'
			)}
		>
			Order Created & Not Paid
		</div>
		}
		</>
	);
}



export default OrdersCreatedAndPaymentStatus;
