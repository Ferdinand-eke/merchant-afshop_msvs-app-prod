import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';

/**
 * The contact list item.
 */
function ContactListItem(props) {
	const { contact } = props;

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/properties/listings/${contact?.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={contact?.title}
						src={contact?.imageSrc}
					/>
				</ListItemAvatar>

				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={contact?.title}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							<span className="font-[6px]">Category:</span> {contact?.category}
						</Typography>
					}
				/>

				<Typography
					className="inline p-4 pl-4, border-[1px] bg-gray-300 rounded-2"
					//   classes={{  root: "m-0", primary: "font-medium leading-5 truncate" }}
					component="span"
					variant="body2"
					color="text.secondary"
				>
					{contact?.isApproved ? 'Approved' : 'Un-Approved'}
				</Typography>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ContactListItem;
