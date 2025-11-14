import { lazy, memo, Suspense } from 'react';
// import FoodMartMenuPanel from 'src/app/main/vendor-foodmarts/managed-foood-mart/manageprofile/formpanels/FoodMartMenuPanel';

const QuickPanel = lazy(() => import('app/theme-layouts/shared-components/quickPanel/QuickPanel'));
const MessengerPanel = lazy(() => import('src/app/main/apps/messenger/messengerPanel/MessengerPanel'));
const NotificationPanel = lazy(() => import('src/app/main/apps/notifications/NotificationPanel'));
const FoodMartMenuPanel = lazy(
	() => import('src/app/main/vendor-foodmarts/managed-foood-mart/manageprofile/formpanels/FoodMartMenuPanel')
);

/**
 * The right side layout 1.
 */

function RightSideLayout1() {
	return (
		<Suspense>
			{/* <QuickPanel /> */}

			{/* <MessengerPanel /> */}

			<NotificationPanel />

			{/* <FoodMartMenuPanel /> */}
		</Suspense>
	);
}

export default memo(RightSideLayout1);
