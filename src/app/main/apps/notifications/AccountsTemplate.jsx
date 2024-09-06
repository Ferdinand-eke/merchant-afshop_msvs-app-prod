import { forwardRef } from 'react';
import { SnackbarContent } from 'notistack';
// import NotificationCard from './NotificationCard';
import AccountsCard from './AccountsCard';
/**
 * The notification template.
 */
const AccountsTemplate = forwardRef((props, ref) => {
	const { item } = props;
	return (
		<SnackbarContent
			ref={ref}
			className="pointer-events-auto relative mx-auto w-full max-w-320 py-4"
		>
			<AccountsCard
				item={item}
				onClose={props.onClose}
			/>
		</SnackbarContent>
	);
});
export default AccountsTemplate;
