import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import FuseLoading from '@fuse/core/FuseLoading';
import { Paper, Chip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TimelineSideBar from './TimelineSideBar';
import { useGetProfileTimelineQuery } from '../../ProfileApi';
import NewsFeed from './NewsFeed';
import Post from './Post';

/**
 * The timeline tab.
 */
function TimelineTab() {
	const { data: timeline, isLoading } = useGetProfileTimelineQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	// Sample posts data
	const samplePosts = [
		{
			id: 1,
			author: {
				name: 'Olufemi Faleye PharmD(in view), MBA, PgD',
				title: 'Pharmacy Intern @ CVS Health | Certified Pharmaceutical Sales Profes...',
				avatar: '',
				badge: '1st',
				verified: true,
				following: false
			},
			content: `As a PharmD student, I have the opportunity to join a Pharmaceutical research led by Dr. Pedinamalini Baskaran, an assistant Professor of Pharmacology at Howard University, Washington DC`,
			readMore: true,
			image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1058333690581577707/original/b50c575d-33e4-4988-8fd1-b9f0b3da5f9a.jpeg?im_w=720',
			timestamp: '1d',
			likes: 31,
			reposts: 0,
			comments: [
				{
					id: 1,
					author: {
						name: 'Sarah Johnson',
						avatar: ''
					},
					content:
						'Congratulations! This is an amazing opportunity. Looking forward to hearing about your research findings.',
					timestamp: '1d',
					likes: 3,
					replies: [
						{
							id: 1,
							author: {
								name: 'Olufemi Faleye',
								avatar: ''
							},
							content: "Thank you so much! I'm really excited about this journey.",
							timestamp: '23h'
						}
					]
				}
			]
		},
		{
			id: 2,
			author: {
				name: 'Clinton Phillips',
				title: 'Full-stack developer skilled in React, React Native, Node.js, Express',
				avatar: '',
				badge: 'Author',
				verified: false,
				following: true
			},
			content: `Authentication Complete - Moving On to the Dashboard! 🎉

After a long grind, I finally wrapped up the authentication system for Resumify ✅. This was my first time working with Better Auth, so the learning curve was steep.

Now it\'s time to dive into building out the dashboard experience! Looking forward to applying what I learned here to make the user experience seamless.`,
			readMore: false,
			image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1058333690581577707/original/d0de362c-7f8b-4838-a174-c43739532596.jpeg?im_w=720',
			timestamp: '2d',
			likes: 45,
			reposts: 9,
			comments: [
				{
					id: 1,
					author: {
						name: 'IfeOluwa Olajubaje',
						avatar: ''
					},
					content:
						"This looks great, my friend!! It's great that you're documenting your daily journey while building Resumify.",
					timestamp: '2d',
					likes: 5,
					replies: []
				},
				{
					id: 2,
					author: {
						name: 'Michael Chen',
						avatar: ''
					},
					content: 'Better Auth is amazing once you get the hang of it. Great work!',
					timestamp: '1d',
					likes: 2,
					replies: []
				}
			]
		},
		{
			id: 3,
			author: {
				name: 'Shirley Idu',
				title: 'Property Manager | Real Estate Professional | Africanshops Hotels',
				avatar: '',
				verified: true,
				following: false
			},
			content: `Exciting News! 🏨

We're thrilled to announce that Shirleys Home Idu has been recognized as one of the top-rated properties in Abuja for 2024!

Thank you to all our amazing guests for your continued support and wonderful reviews. We're committed to providing exceptional hospitality and unforgettable experiences.

Book your stay today and experience luxury accommodation in the heart of Abuja!`,
			readMore: false,
			image: 'https://a0.muscache.com/im/pictures/589fe117-e2d2-4f67-92cc-ff0fd49de227.jpg?im_w=720',
			timestamp: '3d',
			likes: 127,
			reposts: 15,
			comments: []
		},
		{
			id: 4,
			author: {
				name: 'Daniel Onyema',
				title: 'Software Engineer | React Developer | Building scalable applications',
				avatar: '',
				badge: '2nd',
				verified: false,
				following: true
			},
			content: `Just completed a major refactor of our component library! 🎉

Key improvements:
✅ Better TypeScript support
✅ Improved accessibility (WCAG 2.1 AA compliant)
✅ 30% smaller bundle size
✅ Comprehensive documentation with Storybook
✅ New theming system

Sometimes taking a step back to improve the foundation pays off big time. Excited to see how this speeds up our development cycle!

#React #TypeScript #WebDev`,
			readMore: false,
			image: 'https://media.licdn.com/dms/image/sync/v2/D5627AQEU1u_o5FsSrA/articleshare-shrink_800/B56Zm_qiDpIsAI-/0/1759857224735?e=1760814000&v=beta&t=6oIfMsBMfqMOXTm3gzN88urBHzRMAiRkfchmVubWrJ4',
			timestamp: '5h',
			likes: 89,
			reposts: 23,
			comments: [
				{
					id: 1,
					author: {
						name: 'Alex Rodriguez',
						avatar: ''
					},
					content:
						'The bundle size reduction alone is impressive! Would love to hear more about how you achieved that.',
					timestamp: '4h',
					likes: 7,
					replies: [
						{
							id: 1,
							author: {
								name: 'Daniel Onyema',
								avatar: ''
							},
							content:
								'Thanks! We moved to tree-shakeable imports and lazy-loaded some heavy dependencies. Happy to share more details if interested!',
							timestamp: '3h'
						}
					]
				}
			]
		}
	];

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex gap-24">
				{/* Sidebar */}
				<div className="flex flex-col w-full md:w-320">
					<Box
						sx={{
							position: { xs: 'relative', md: 'sticky' },
							top: { md: 16 },
							alignSelf: 'flex-start'
						}}
					>
						<TimelineSideBar
							userDetails={{
								name: 'Shirleys Home Idu',
								avatar: '',
								title: 'Property Listings',
								subtitle: 'Hotels & Apartments',
								location: 'Abuja, Federal Capital Territory',
								company: 'Africanshops'
							}}
							stats={{
								followers: 200000,
								following: 1200,
								connections: 94,
								views: 156
							}}
							quickLinks={[
								{ icon: 'heroicons-outline:bookmark', label: 'Saved items' },
								{ icon: 'heroicons-outline:user-group', label: 'Groups' },
								{ icon: 'heroicons-outline:newspaper', label: 'Newsletters' },
								{ icon: 'heroicons-outline:calendar', label: 'Events' }
							]}
							showPremiumCTA={false}
							onViewAnalytics={() => console.log('View analytics')}
							onGrowNetwork={() => console.log('Grow network')}
						/>
					</Box>
				</div>

				{/* Main Feed */}
				<div className="flex flex-col flex-1 min-w-0">
					{/* Header Section */}
					<Paper
						elevation={0}
						component={motion.div}
						variants={item}
						sx={{
							p: 3,
							mb: 3,
							background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
							border: '1px solid rgba(234, 88, 12, 0.1)',
							borderRadius: 2
						}}
					>
						<Box className="flex items-center gap-16">
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: '12px',
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={24}
								>
									heroicons-outline:clock
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									sx={{ fontWeight: 700, color: '#292524', mb: 0.5 }}
								>
									Activity Timeline
								</Typography>
								<Box className="flex items-center gap-8">
									<Chip
										label="Latest Updates"
										size="small"
										sx={{
											background: 'rgba(249, 115, 22, 0.1)',
											color: '#ea580c',
											fontWeight: 600,
											height: 24
										}}
									/>
									<Typography
										variant="caption"
										color="text.secondary"
									>
										Property updates and social activity
									</Typography>
								</Box>
							</Box>
						</Box>
					</Paper>

					{/* News Feed */}
					<NewsFeed />

					{/* Posts */}
					{samplePosts.map((post) => (
						<Post
							key={post.id}
							post={post}
							currentUserAvatar=""
							onDelete={(postId) => console.log('Post deleted:', postId)}
						/>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default TimelineTab;
