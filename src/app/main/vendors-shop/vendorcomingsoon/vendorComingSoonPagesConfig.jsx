import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ClassicComingSoonPage = lazy(() => import('./ClassicComingSoonPage'));
const ModernComingSoonPage = lazy(() => import('./ModernComingSoonPage'));
const ModernReversedComingSoonPage = lazy(() => import('./VendorModernReversedComingSoonPage'));
const SplitScreenComingSoonPage = lazy(() => import('./SplitScreenComingSoonPage'));
const SplitScreenReversedComingSoonPage = lazy(() => import('./SplitScreenReversedComingSoonPage'));
const FullScreenComingSoonPage = lazy(() => import('./FullScreenComingSoonPage'));
const FullScreenReversedComingSoonPage = lazy(() => import('./FullScreenReversedComingSoonPage'));
/**
 * The coming soon pages config.
 */
const vendorComingSoonPagesConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'vendor/inprogress',
			children: [
				{
					path: '',
					element: <Navigate to="coming-soon" />
				},

				{
					path: 'coming-soon',
					element: <ModernReversedComingSoonPage />
				}
			]
		}
	]
};
export default vendorComingSoonPagesConfig;
