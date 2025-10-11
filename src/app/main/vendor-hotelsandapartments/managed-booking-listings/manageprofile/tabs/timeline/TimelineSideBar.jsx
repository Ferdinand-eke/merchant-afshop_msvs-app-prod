import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * TimelineSideBar Component
 * Displays user profile information, stats, and quick links
 */
function TimelineSideBar({
	userDetails = {},
	stats = {},
	quickLinks = [],
	showPremiumCTA = false,
	onViewAnalytics,
	onGrowNetwork
}) {
	const {
		name = 'User Name',
		avatar = '',
		title = '',
		subtitle = '',
		location = '',
		company = ''
	} = userDetails;

	const {
		followers = 0,
		following = 0,
		connections = 0,
		views = 0
	} = stats;

	const defaultQuickLinks = [
		{ icon: 'heroicons-outline:bookmark', label: 'Saved items', path: '/saved' },
		{ icon: 'heroicons-outline:user-group', label: 'Groups', path: '/groups' },
		{ icon: 'heroicons-outline:newspaper', label: 'Newsletters', path: '/newsletters' },
		{ icon: 'heroicons-outline:calendar', label: 'Events', path: '/events' }
	];

	const links = quickLinks.length > 0 ? quickLinks : defaultQuickLinks;

	return (
		<Card
			component={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full overflow-hidden"
		>
			{/* Header with background banner */}
			<Box
				sx={{
					height: 64,
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					position: 'relative'
				}}
			/>

			{/* Avatar */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: '-40px',
					marginBottom: '8px'
				}}
			>
				<Avatar
					src={avatar}
					alt={name}
					sx={{
						width: 80,
						height: 80,
						border: '4px solid white',
						boxShadow: 1
					}}
				>
					{!avatar && name.charAt(0).toUpperCase()}
				</Avatar>
			</Box>

			<CardContent className="text-center px-24 pb-8">
				{/* User Info */}
				<Typography className="text-lg font-semibold mb-4">
					{name}
				</Typography>

				{title && (
					<Typography className="text-13 text-grey-600 mb-4">
						{title}
					</Typography>
				)}

				{subtitle && (
					<Typography className="text-12 text-grey-500 mb-4">
						{subtitle}
					</Typography>
				)}

				{location && (
					<Typography className="text-12 text-grey-500 mb-8">
						{location}
					</Typography>
				)}

				{company && (
					<Box className="flex items-center justify-center gap-8 mb-12">
						<FuseSvgIcon size={16} className="text-grey-500">
							heroicons-outline:building-office-2
						</FuseSvgIcon>
						<Typography className="text-13 font-medium text-blue-600">
							{company}
						</Typography>
					</Box>
				)}
			</CardContent>

			<Divider />

			{/* Stats Section */}
			<Box className="px-24 py-16">
				{/* Analytics Link */}
				{onViewAnalytics && (
					<Box
						className="flex items-center justify-between mb-12 cursor-pointer hover:bg-gray-100 -mx-12 px-12 py-8 rounded-md transition-colors"
						onClick={onViewAnalytics}
					>
						<Typography className="text-12 text-grey-600">
							View all analytics
						</Typography>
						<FuseSvgIcon size={16} className="text-grey-400">
							heroicons-outline:arrow-right
						</FuseSvgIcon>
					</Box>
				)}

				{/* Connections/Network */}
				{(connections > 0 || onGrowNetwork) && (
					<Box
						className="flex items-center justify-between cursor-pointer hover:bg-gray-100 -mx-12 px-12 py-8 rounded-md transition-colors"
						onClick={onGrowNetwork}
					>
						<Box>
							<Typography className="text-12 font-semibold">
								Connections
							</Typography>
							<Typography className="text-11 text-grey-600">
								Grow your network
							</Typography>
						</Box>
						<Typography className="text-14 font-semibold">
							{connections}
						</Typography>
					</Box>
				)}

				{/* Followers/Following */}
				{(followers > 0 || following > 0) && (
					<Box className="flex items-center justify-between mt-8">
						<Box className="flex gap-16">
							{followers > 0 && (
								<Box>
									<Typography className="text-13 font-semibold">
										{followers > 1000 ? `${(followers / 1000).toFixed(1)}k` : followers}
									</Typography>
									<Typography className="text-11 text-grey-600">
										Followers
									</Typography>
								</Box>
							)}
							{following > 0 && (
								<Box>
									<Typography className="text-13 font-semibold">
										{following > 1000 ? `${(following / 1000).toFixed(1)}k` : following}
									</Typography>
									<Typography className="text-11 text-grey-600">
										Following
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
				)}

				{/* Profile Views */}
				{views > 0 && (
					<Box className="flex items-center justify-between mt-12 pt-12 border-t">
						<Typography className="text-12 text-grey-600">
							Profile views
						</Typography>
						<Typography className="text-13 font-semibold text-blue-600">
							{views}
						</Typography>
					</Box>
				)}
			</Box>

			{showPremiumCTA && (
				<>
					<Divider />
					<Box className="px-24 py-16 bg-grey-50">
						<Typography className="text-11 text-grey-600 mb-8">
							Access exclusive tools & insights
						</Typography>
						<Button
							variant="outlined"
							size="small"
							startIcon={<FuseSvgIcon size={16}>heroicons-outline:star</FuseSvgIcon>}
							className="w-full text-12"
							sx={{
								borderColor: 'warning.main',
								color: 'warning.main',
								'&:hover': {
									borderColor: 'warning.dark',
									backgroundColor: 'warning.light'
								}
							}}
						>
							Try Premium
						</Button>
					</Box>
				</>
			)}

			<Divider />

			{/* Quick Links */}
			<Box className="px-24 py-12">
				{links.map((link, index) => (
					<Box
						key={index}
						className="flex items-center gap-12 py-10 cursor-pointer hover:bg-gray-100 -mx-12 px-12 rounded-md transition-colors"
						onClick={() => link.onClick && link.onClick()}
					>
						<FuseSvgIcon size={20} className="text-grey-600">
							{link.icon}
						</FuseSvgIcon>
						<Typography className="text-13 text-grey-700">
							{link.label}
						</Typography>
						{link.badge && (
							<Box
								className="ml-auto px-8 py-2 rounded-full bg-blue-100"
							>
								<Typography className="text-11 font-semibold text-blue-800">
									{link.badge}
								</Typography>
							</Box>
						)}
					</Box>
				))}
			</Box>
		</Card>
	);
}

export default TimelineSideBar;
