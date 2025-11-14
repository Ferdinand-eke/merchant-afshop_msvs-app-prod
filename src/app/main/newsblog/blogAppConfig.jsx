import { lazy } from 'react';
import { authRoles } from 'src/app/auth';
import SingleBlogPost from './SingleBlogPost';
// import authRoles from 'src/app/auth/authRoles';
// import authRoles from '../../auth/authRoles';

const BlogApp = lazy(() => import('./BlogApp'));
/**
 * The Profile app config.
 */
const blogAppConfig = {
	// settings: {
	// 	layout: {
	// 		config: {}
	// 	}
	// },
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: true
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'news-blog',
			element: <BlogApp />
		},
		{
			path: 'news-blog/:slug',
			element: <SingleBlogPost />
		}
	]
};
export default blogAppConfig;
