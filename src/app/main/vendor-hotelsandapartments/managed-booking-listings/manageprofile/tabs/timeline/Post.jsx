import { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Collapse from '@mui/material/Collapse';
import { motion, AnimatePresence } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * Post Component
 * LinkedIn-style post with full functionality
 */
function Post({ post, currentUserAvatar = '', onDelete }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post?.likes || 0);
	const [comments, setComments] = useState(post?.comments || []);
	const [isClosed, setIsClosed] = useState(false);
	const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);

	// Reply states for each comment
	const [replyStates, setReplyStates] = useState({});

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLike = () => {
		setLiked(!liked);
		setLikeCount(liked ? likeCount - 1 : likeCount + 1);
	};

	const handleCommentSubmit = () => {
		if (commentText.trim()) {
			const newComment = {
				id: Date.now(),
				author: {
					name: 'Current User',
					avatar: currentUserAvatar
				},
				content: commentText,
				timestamp: 'Just now',
				likes: 0,
				replies: []
			};
			setComments([...comments, newComment]);
			setCommentText('');
			setShowComments(true);
		}
	};

	const handleReplyToggle = (commentId) => {
		setReplyStates((prev) => ({
			...prev,
			[commentId]: {
				...prev[commentId],
				showReplyInput: !prev[commentId]?.showReplyInput
			}
		}));
	};

	const handleReplySubmit = (commentId) => {
		const replyText = replyStates[commentId]?.replyText;
		if (replyText?.trim()) {
			const updatedComments = comments.map((comment) => {
				if (comment.id === commentId) {
					const newReply = {
						id: Date.now(),
						author: {
							name: 'Current User',
							avatar: currentUserAvatar
						},
						content: replyText,
						timestamp: 'Just now'
					};
					return {
						...comment,
						replies: [...(comment.replies || []), newReply]
					};
				}
				return comment;
			});
			setComments(updatedComments);
			setReplyStates((prev) => ({
				...prev,
				[commentId]: { showReplyInput: false, replyText: '' }
			}));
		}
	};

	const handleClose = () => {
		setIsClosed(true);
		setShowUndoSnackbar(true);
	};

	const handleUndo = () => {
		setIsClosed(false);
		setShowUndoSnackbar(false);
	};

	const handleSnackbarClose = () => {
		setShowUndoSnackbar(false);
		if (isClosed && onDelete) {
			onDelete(post?.id);
		}
	};

	if (isClosed && !showUndoSnackbar) {
		return null;
	}

	return (
		<>
			<AnimatePresence>
				{!isClosed && (
					<Card
						component={motion.div}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0, marginBottom: 0 }}
						transition={{ duration: 0.3 }}
						className="w-full mb-16"
					>
						{/* Post Header */}
						<Box className="flex items-start justify-between px-16 pt-16 pb-12">
							<Box className="flex gap-12">
								<Avatar
									src={post?.author?.avatar}
									alt={post?.author?.name}
									sx={{ width: 48, height: 48 }}
								>
									{post?.author?.name?.charAt(0).toUpperCase()}
								</Avatar>
								<Box>
									<Box className="flex items-center gap-8">
										<Typography className="text-14 font-semibold">
											{post?.author?.name}
										</Typography>
										{post?.author?.badge && (
											<Box className="px-8 py-2 bg-grey-200 rounded text-11 font-semibold">
												{post?.author?.badge}
											</Box>
										)}
										{post?.author?.verified && (
											<FuseSvgIcon size={16} className="text-blue-600">
												heroicons-solid:check-badge
											</FuseSvgIcon>
										)}
									</Box>
									<Typography className="text-12 text-grey-600">
										{post?.author?.title}
									</Typography>
									<Box className="flex items-center gap-4 text-11 text-grey-500">
										<Typography className="text-11">{post?.timestamp}</Typography>
										<span>•</span>
										<FuseSvgIcon size={12}>heroicons-outline:globe-alt</FuseSvgIcon>
									</Box>
								</Box>
							</Box>

							<Box className="flex items-center gap-8">
								{post?.author?.following ? (
									<Button
										variant="outlined"
										size="small"
										startIcon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
										sx={{
											textTransform: 'none',
											fontSize: '13px',
											fontWeight: 600,
											borderRadius: '16px'
										}}
									>
										Following
									</Button>
								) : (
									<Button
										variant="text"
										size="small"
										startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
										sx={{
											textTransform: 'none',
											fontSize: '13px',
											fontWeight: 600,
											color: 'primary.main'
										}}
									>
										Follow
									</Button>
								)}
								<IconButton size="small" onClick={handleMenuOpen}>
									<FuseSvgIcon size={20}>heroicons-outline:ellipsis-horizontal</FuseSvgIcon>
								</IconButton>
								<IconButton size="small" onClick={handleClose}>
									<FuseSvgIcon size={20}>heroicons-outline:x-mark</FuseSvgIcon>
								</IconButton>
							</Box>
						</Box>

						{/* Post Menu */}
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem onClick={handleMenuClose}>
								<FuseSvgIcon size={20} className="mr-12">heroicons-outline:bookmark</FuseSvgIcon>
								Save post
							</MenuItem>
							<MenuItem onClick={handleMenuClose}>
								<FuseSvgIcon size={20} className="mr-12">heroicons-outline:link</FuseSvgIcon>
								Copy link
							</MenuItem>
							<MenuItem onClick={handleMenuClose}>
								<FuseSvgIcon size={20} className="mr-12">heroicons-outline:flag</FuseSvgIcon>
								Report post
							</MenuItem>
							<MenuItem onClick={handleMenuClose}>
								<FuseSvgIcon size={20} className="mr-12">heroicons-outline:bell-slash</FuseSvgIcon>
								Unfollow {post?.author?.name}
							</MenuItem>
						</Menu>

						{/* Post Content */}
						<Box className="px-16 pb-12">
							<Typography className="text-14 whitespace-pre-wrap">
								{post?.content}
							</Typography>
							{post?.readMore && (
								<Button
									size="small"
									sx={{
										textTransform: 'none',
										fontSize: '14px',
										padding: 0,
										minWidth: 'auto',
										fontWeight: 600
									}}
								>
									...more
								</Button>
							)}
						</Box>

						{/* Post Media */}
						{post?.image && (
							<Box>
								<img
									src={post?.image}
									alt="Post content"
									className="w-full object-cover"
									style={{ maxHeight: '500px' }}
								/>
							</Box>
						)}

						{post?.video && (
							<Box>
								<video
									src={post?.video}
									controls
									className="w-full object-cover"
									style={{ maxHeight: '500px' }}
								/>
							</Box>
						)}

						{/* Post Stats */}
						<Box className="flex items-center justify-between px-16 py-8">
							<Box className="flex items-center gap-8">
								{likeCount > 0 && (
									<Box className="flex items-center gap-4 cursor-pointer hover:underline">
										<Box className="flex -space-x-4">
											<Box className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-10">
												👍
											</Box>
											<Box className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-10">
												❤️
											</Box>
											<Box className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-10">
												💡
											</Box>
										</Box>
										<Typography className="text-12 text-grey-600">
											{likeCount}
										</Typography>
									</Box>
								)}
							</Box>
							<Box className="flex items-center gap-12 text-12 text-grey-600">
								{comments?.length > 0 && (
									<Typography
										className="hover:underline cursor-pointer"
										onClick={() => setShowComments(!showComments)}
									>
										{comments?.length} comment{comments?.length > 1 ? 's' : ''}
									</Typography>
								)}
								{post?.reposts > 0 && (
									<Typography className="hover:underline cursor-pointer">
										{post?.reposts} repost{post?.reposts > 1 ? 's' : ''}
									</Typography>
								)}
							</Box>
						</Box>

						<Divider />

						{/* Post Actions */}
						<Box className="flex items-center justify-around px-8 py-8">
							<Button
								startIcon={
									<FuseSvgIcon size={20} className={liked ? 'text-blue-600' : ''}>
										{liked ? 'heroicons-solid:hand-thumb-up' : 'heroicons-outline:hand-thumb-up'}
									</FuseSvgIcon>
								}
								onClick={handleLike}
								sx={{
									textTransform: 'none',
									color: liked ? 'primary.main' : 'text.secondary',
									fontWeight: 600,
									fontSize: '14px',
									'&:hover': {
										backgroundColor: 'action.hover'
									}
								}}
							>
								Like
							</Button>

							<Button
								startIcon={
									<FuseSvgIcon size={20}>
										heroicons-outline:chat-bubble-left-right
									</FuseSvgIcon>
								}
								onClick={() => setShowComments(!showComments)}
								sx={{
									textTransform: 'none',
									color: 'text.secondary',
									fontWeight: 600,
									fontSize: '14px',
									'&:hover': {
										backgroundColor: 'action.hover'
									}
								}}
							>
								Comment
							</Button>

							<Button
								startIcon={
									<FuseSvgIcon size={20}>
										heroicons-outline:arrow-path-rounded-square
									</FuseSvgIcon>
								}
								sx={{
									textTransform: 'none',
									color: 'text.secondary',
									fontWeight: 600,
									fontSize: '14px',
									'&:hover': {
										backgroundColor: 'action.hover'
									}
								}}
							>
								Repost
							</Button>

							<Button
								startIcon={
									<FuseSvgIcon size={20}>
										heroicons-outline:paper-airplane
									</FuseSvgIcon>
								}
								sx={{
									textTransform: 'none',
									color: 'text.secondary',
									fontWeight: 600,
									fontSize: '14px',
									'&:hover': {
										backgroundColor: 'action.hover'
									}
								}}
							>
								Send
							</Button>
						</Box>

						{/* Comments Section */}
						<Collapse in={showComments}>
							<Divider />
							<Box className="px-16 py-12">
								{/* Add Comment */}
								<Box className="flex gap-12 mb-16">
									<Avatar
										src={currentUserAvatar}
										sx={{ width: 32, height: 32 }}
									/>
									<Box className="flex-1 flex gap-8 items-center">
										<TextField
											placeholder="Add a comment..."
											variant="outlined"
											size="small"
											fullWidth
											value={commentText}
											onChange={(e) => setCommentText(e.target.value)}
											onKeyPress={(e) => {
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													handleCommentSubmit();
												}
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: '20px',
													fontSize: '14px'
												}
											}}
										/>
										<IconButton size="small">
											<FuseSvgIcon size={20}>heroicons-outline:face-smile</FuseSvgIcon>
										</IconButton>
										<IconButton size="small">
											<FuseSvgIcon size={20}>heroicons-outline:photo</FuseSvgIcon>
										</IconButton>
									</Box>
								</Box>

								{/* Existing Comments */}
								{comments?.map((comment) => (
									<Box key={comment?.id} className="mb-16">
										<Box className="flex gap-12">
											<Avatar
												src={comment?.author?.avatar}
												sx={{ width: 32, height: 32 }}
											>
												{comment?.author?.name?.charAt(0).toUpperCase()}
											</Avatar>
											<Box className="flex-1">
												<Box className="bg-grey-100 rounded-lg px-12 py-8">
													<Typography className="text-13 font-semibold mb-2">
														{comment?.author?.name}
													</Typography>
													<Typography className="text-13 text-grey-700">
														{comment?.content}
													</Typography>
												</Box>
												<Box className="flex items-center gap-12 px-12 mt-4">
													<Button
														size="small"
														sx={{
															textTransform: 'none',
															fontSize: '12px',
															minWidth: 'auto',
															padding: '2px 8px',
															color: 'text.secondary'
														}}
													>
														Like
													</Button>
													{comment?.likes > 0 && (
														<Typography className="text-11 text-grey-500">
															👍 {comment?.likes}
														</Typography>
													)}
													<Button
														size="small"
														onClick={() => handleReplyToggle(comment?.id)}
														sx={{
															textTransform: 'none',
															fontSize: '12px',
															minWidth: 'auto',
															padding: '2px 8px',
															color: 'text.secondary'
														}}
													>
														Reply
													</Button>
													<Typography className="text-11 text-grey-500">
														{comment?.timestamp}
													</Typography>
												</Box>

												{/* Reply Input */}
												{replyStates[comment?.id]?.showReplyInput && (
													<Box className="flex gap-8 mt-8 ml-16">
														<Avatar
															src={currentUserAvatar}
															sx={{ width: 28, height: 28 }}
														/>
														<TextField
															placeholder="Write a reply..."
															variant="outlined"
															size="small"
															fullWidth
															value={replyStates[comment?.id]?.replyText || ''}
															onChange={(e) => {
																setReplyStates((prev) => ({
																	...prev,
																	[comment?.id]: {
																		...prev[comment?.id],
																		replyText: e.target.value
																	}
																}));
															}}
															onKeyPress={(e) => {
																if (e.key === 'Enter' && !e.shiftKey) {
																	e.preventDefault();
																	handleReplySubmit(comment?.id);
																}
															}}
															sx={{
																'& .MuiOutlinedInput-root': {
																	borderRadius: '16px',
																	fontSize: '13px'
																}
															}}
														/>
													</Box>
												)}

												{/* Nested Replies */}
												{comment?.replies?.map((reply) => (
													<Box key={reply?.id} className="flex gap-12 mt-12 ml-16">
														<Avatar
															src={reply?.author?.avatar}
															sx={{ width: 28, height: 28 }}
														>
															{reply?.author?.name?.charAt(0).toUpperCase()}
														</Avatar>
														<Box className="flex-1">
															<Box className="bg-grey-100 rounded-lg px-12 py-8">
																<Typography className="text-12 font-semibold mb-2">
																	{reply?.author?.name}
																</Typography>
																<Typography className="text-12 text-grey-700">
																	{reply?.content}
																</Typography>
															</Box>
															<Box className="flex items-center gap-12 px-12 mt-4">
																<Button
																	size="small"
																	sx={{
																		textTransform: 'none',
																		fontSize: '11px',
																		minWidth: 'auto',
																		padding: '2px 8px',
																		color: 'text.secondary'
																	}}
																>
																	Like
																</Button>
																<Button
																	size="small"
																	sx={{
																		textTransform: 'none',
																		fontSize: '11px',
																		minWidth: 'auto',
																		padding: '2px 8px',
																		color: 'text.secondary'
																	}}
																>
																	Reply
																</Button>
																<Typography className="text-10 text-grey-500">
																	{reply?.timestamp}
																</Typography>
															</Box>
														</Box>
													</Box>
												))}
											</Box>
										</Box>
									</Box>
								))}
							</Box>
						</Collapse>
					</Card>
				)}
			</AnimatePresence>

			{/* Undo Snackbar */}
			<Snackbar
				open={showUndoSnackbar}
				autoHideDuration={5000}
				onClose={handleSnackbarClose}
				message="Post hidden"
				action={
					<Button color="primary" size="small" onClick={handleUndo}>
						Undo
					</Button>
				}
				sx={{
					'& .MuiSnackbarContent-root': {
						backgroundColor: 'grey.800',
						color: 'white'
					}
				}}
			/>
		</>
	);
}

export default Post;
