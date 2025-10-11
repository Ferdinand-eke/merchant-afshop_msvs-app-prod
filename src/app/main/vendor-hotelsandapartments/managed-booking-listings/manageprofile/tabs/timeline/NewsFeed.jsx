import { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PostContent from './PostContent';

/**
 * NewsFeed Component
 * LinkedIn-style post creation interface
 */
function NewsFeed({
	userAvatar = '',
	userName = 'User',
	userDetails = {},
	onPostSubmit,
	onVideoClick,
	onPhotoClick,
	onWriteArticleClick,
	showSortBy = false
}) {
	const [postModalOpen, setPostModalOpen] = useState(false);

	const handleStartPost = () => {
		setPostModalOpen(true);
	};

	const handleCloseModal = () => {
		setPostModalOpen(false);
	};

	const handlePostSubmit = (postData) => {
		if (onPostSubmit) {
			onPostSubmit(postData);
		}
		setPostModalOpen(false);
	};

	// Merge userDetails with userName and userAvatar
	const mergedUserDetails = {
		name: userName,
		avatar: userAvatar,
		...userDetails
	};

	return (
		<>
			<Card
				component={motion.div}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full mb-16"
			>
				{/* Post Input Section */}
				<Box className="flex items-center gap-12 px-16 py-16">
					<Avatar
						src={userAvatar}
						alt={userName}
						sx={{ width: 48, height: 48 }}
					>
						{!userAvatar && userName.charAt(0).toUpperCase()}
					</Avatar>

					<Button
						variant="outlined"
						fullWidth
						onClick={handleStartPost}
						sx={{
							justifyContent: 'flex-start',
							borderRadius: '24px',
							textTransform: 'none',
							color: 'text.secondary',
							borderColor: 'divider',
							paddingX: 3,
							paddingY: 1.5,
							fontSize: '14px',
							fontWeight: 600,
							'&:hover': {
								backgroundColor: 'action.hover',
								borderColor: 'text.secondary'
							}
						}}
					>
						Start a post
					</Button>
				</Box>

				<Divider />

				{/* Action Buttons Section */}
				<Box className="flex items-center justify-around px-8 py-8">
					{/* Video Button */}
					<Button
						startIcon={
							<FuseSvgIcon size={20} className="text-blue-600">
								heroicons-solid:video-camera
							</FuseSvgIcon>
						}
						onClick={onVideoClick}
						sx={{
							textTransform: 'none',
							color: 'text.secondary',
							fontWeight: 600,
							fontSize: '14px',
							paddingX: 2,
							paddingY: 1,
							borderRadius: 1,
							'&:hover': {
								backgroundColor: 'action.hover'
							}
						}}
					>
						Video
					</Button>

					{/* Photo Button */}
					<Button
						startIcon={
							<FuseSvgIcon size={20} className="text-green-600">
								heroicons-solid:photograph
							</FuseSvgIcon>
						}
						onClick={onPhotoClick}
						sx={{
							textTransform: 'none',
							color: 'text.secondary',
							fontWeight: 600,
							fontSize: '14px',
							paddingX: 2,
							paddingY: 1,
							borderRadius: 1,
							'&:hover': {
								backgroundColor: 'action.hover'
							}
						}}
					>
						Photo
					</Button>

					{/* Write Article Button */}
					<Button
						startIcon={
							<FuseSvgIcon size={20} className="text-red-600">
								heroicons-solid:document-text
							</FuseSvgIcon>
						}
						onClick={onWriteArticleClick}
						sx={{
							textTransform: 'none',
							color: 'text.secondary',
							fontWeight: 600,
							fontSize: '14px',
							paddingX: 2,
							paddingY: 1,
							borderRadius: 1,
							'&:hover': {
								backgroundColor: 'action.hover'
							}
						}}
					>
						Write article
					</Button>
				</Box>

				{/* Sort By Section */}
				{showSortBy && (
					<>
						<Divider />
						<Box className="flex items-center justify-end px-16 py-8">
							<Box className="flex items-center gap-8">
								<Typography className="text-12 text-grey-600">
									Sort by:
								</Typography>
								<Button
									endIcon={
										<FuseSvgIcon size={16}>
											heroicons-outline:chevron-down
										</FuseSvgIcon>
									}
									sx={{
										textTransform: 'none',
										color: 'text.primary',
										fontWeight: 600,
										fontSize: '14px',
										minWidth: 'auto',
										paddingX: 1,
										paddingY: 0.5
									}}
								>
									Top
								</Button>
							</Box>
						</Box>
					</>
				)}
			</Card>

			{/* PostContent Modal */}
			<PostContent
				open={postModalOpen}
				onClose={handleCloseModal}
				onPost={handlePostSubmit}
				userDetails={mergedUserDetails}
				postVisibility="Anyone"
			/>
		</>
	);
}

export default NewsFeed;
