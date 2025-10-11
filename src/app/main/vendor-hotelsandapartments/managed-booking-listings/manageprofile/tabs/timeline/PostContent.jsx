import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * PostContent Modal Component
 * LinkedIn-style post creation modal
 */
function PostContent({
	open = false,
	onClose,
	onPost,
	userDetails = {},
	postVisibility = 'Anyone'
}) {
	const {
		name = 'User Name',
		avatar = '',
		title = ''
	} = userDetails;

	const [postText, setPostText] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [visibility, setVisibility] = useState(postVisibility);

	const handleVisibilityClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleVisibilityClose = () => {
		setAnchorEl(null);
	};

	const handleVisibilitySelect = (option) => {
		setVisibility(option);
		setAnchorEl(null);
	};

	const handlePost = () => {
		if (postText.trim()) {
			onPost && onPost({
				content: postText,
				visibility,
				timestamp: new Date()
			});
			setPostText('');
			onClose && onClose();
		}
	};

	const handleClose = () => {
		setPostText('');
		onClose && onClose();
	};

	const isPostDisabled = !postText.trim();

	return (
		<Dialog
			open={open}
			onClose={(event, reason) => {
				// Only close on close button click, not on backdrop click or escape key
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
					return;
				}
				handleClose();
			}}
			maxWidth="sm"
			fullWidth
			disableEscapeKeyDown
			BackdropProps={{
				sx: {
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
					backdropFilter: 'blur(4px)'
				}
			}}
			PaperProps={{
				sx: {
					borderRadius: 2,
					minHeight: '400px'
				}
			}}
		>
			{/* Header */}
			<DialogTitle>
				<Box className="flex items-center justify-between">
					<Box className="flex items-center gap-12">
						<Avatar
							src={avatar}
							alt={name}
							sx={{ width: 48, height: 48 }}
						>
							{!avatar && name.charAt(0).toUpperCase()}
						</Avatar>
						<Box>
							<Typography className="text-16 font-semibold">
								{name}
							</Typography>
							<Button
								variant="text"
								size="small"
								onClick={handleVisibilityClick}
								endIcon={
									<FuseSvgIcon size={16}>
										heroicons-solid:chevron-down
									</FuseSvgIcon>
								}
								sx={{
									textTransform: 'none',
									padding: '2px 8px',
									minWidth: 'auto',
									fontSize: '13px',
									color: 'text.secondary',
									fontWeight: 500,
									'&:hover': {
										backgroundColor: 'action.hover'
									}
								}}
							>
								Post to {visibility}
							</Button>
						</Box>
					</Box>
					<IconButton
						onClick={handleClose}
						size="small"
						className="bg-orange-700 hover:bg-orange-800"
						sx={{
							color: 'white',
							'&:hover': {
								backgroundColor: '#c2410c'
							}
						}}
					>
						<FuseSvgIcon size={24}>heroicons-outline:x-mark</FuseSvgIcon>
					</IconButton>
				</Box>
			</DialogTitle>

			{/* Visibility Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleVisibilityClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
			>
				<MenuItem onClick={() => handleVisibilitySelect('Anyone')}>
					<Box className="flex items-center gap-12">
						<FuseSvgIcon size={20}>heroicons-outline:globe-alt</FuseSvgIcon>
						<Typography>Anyone</Typography>
					</Box>
				</MenuItem>
				<MenuItem onClick={() => handleVisibilitySelect('Connections')}>
					<Box className="flex items-center gap-12">
						<FuseSvgIcon size={20}>heroicons-outline:user-group</FuseSvgIcon>
						<Typography>Connections only</Typography>
					</Box>
				</MenuItem>
				<MenuItem onClick={() => handleVisibilitySelect('Only me')}>
					<Box className="flex items-center gap-12">
						<FuseSvgIcon size={20}>heroicons-outline:lock-closed</FuseSvgIcon>
						<Typography>Only me</Typography>
					</Box>
				</MenuItem>
			</Menu>

			<Divider />

			{/* Content */}
			<DialogContent sx={{ paddingTop: 2, paddingBottom: 2 }}>
				<TextField
					multiline
					fullWidth
					minRows={8}
					maxRows={12}
					placeholder="What do you want to talk about?"
					value={postText}
					onChange={(e) => setPostText(e.target.value)}
					variant="standard"
					autoFocus
					InputProps={{
						disableUnderline: true,
						sx: {
							fontSize: '16px',
							lineHeight: 1.5,
							'& textarea': {
								'&::placeholder': {
									color: 'text.secondary',
									opacity: 0.7
								}
							}
						}
					}}
				/>
			</DialogContent>

			{/* Footer Actions */}
			<Box className="px-24 pb-16">
				{/* Media Icons */}
				<Box className="flex items-center gap-8 mb-16">
					{/* Emoji */}
					<IconButton
						size="small"
						sx={{ color: 'text.secondary' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:face-smile</FuseSvgIcon>
					</IconButton>

					{/* Photo */}
					<IconButton
						size="small"
						sx={{ color: 'text.secondary' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:photo</FuseSvgIcon>
					</IconButton>

					{/* Calendar/Event */}
					<IconButton
						size="small"
						sx={{ color: 'text.secondary' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:calendar</FuseSvgIcon>
					</IconButton>

					{/* Document */}
					<IconButton
						size="small"
						sx={{ color: 'text.secondary' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:document-text</FuseSvgIcon>
					</IconButton>

					{/* More Options */}
					<IconButton
						size="small"
						sx={{ color: 'text.secondary' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:plus</FuseSvgIcon>
					</IconButton>
				</Box>

				<Divider className="mb-16" />

				{/* Bottom Actions */}
				<Box className="flex items-center justify-between">
					{/* Schedule Post */}
					<IconButton
						size="small"
						sx={{ color: 'text.secondary' }}
					>
						<FuseSvgIcon size={24}>heroicons-outline:clock</FuseSvgIcon>
					</IconButton>

					{/* Post Button */}
					<Button
						variant="contained"
						onClick={handlePost}
						disabled={isPostDisabled}
						className={isPostDisabled ? '' : 'bg-orange-700 hover:bg-orange-800'}
						sx={{
							borderRadius: '20px',
							textTransform: 'none',
							paddingX: 3,
							paddingY: 1,
							fontWeight: 600,
							backgroundColor: isPostDisabled ? 'action.disabledBackground' : '#c2410c',
							'&:hover': {
								backgroundColor: isPostDisabled ? 'action.disabledBackground' : '#9a3412'
							},
							'&.Mui-disabled': {
								backgroundColor: 'action.disabledBackground',
								color: 'action.disabled'
							}
						}}
					>
						Post
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}

export default PostContent;
