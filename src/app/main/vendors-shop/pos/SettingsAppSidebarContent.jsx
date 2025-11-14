import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import DisplayCart from './posframes/DisplayCart';

const Root = styled('div')(({ theme }) => ({
	'&  .navigation': {
		padding: 0,
		borderTop: `1px solid ${theme.palette.divider}`
	},
	'&  .fuse-list-item': {
		padding: '20px 32px',
		margin: 0,
		borderRadius: 0,
		alignItems: 'start',
		borderBottom: `1px solid ${theme.palette.divider}`,
		'&.active': {
			backgroundColor: `${alpha(theme.palette.secondary.main, 0.1)}!important`,
			'&  .fuse-list-item-icon': {
				color: `${theme.palette.secondary.main}!important`
			},
			'&  .fuse-list-item-text-primary': {
				color: `${theme.palette.secondary.main}!important`
			}
		}
	},
	'&  .fuse-list-item-text-primary': {
		fontSize: 14,
		fontWeight: '500'
	},
	'&  .fuse-list-item-text-secondary': {
		fontSize: 14,
		whiteSpace: 'normal',
		fontWeight: '400'
	}
}));

function SettingsAppSidebarContent(props) {
	const { className, onSetSidebarOpen } = props;
	return (
		<Root>
			<div className={clsx('m-32 mr-24 flex items-center justify-between sm:my-40', className)}>
				<Typography className="text-4xl font-extrabold leading-none tracking-tight"> POS Platform</Typography>
				<Hidden lgUp>
					<IconButton
						onClick={() => onSetSidebarOpen(false)}
						aria-label="close left sidebar"
						size="small"
					>
						<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
					</IconButton>
				</Hidden>
			</div>

			{/* <FuseNavigation navigation={SettingsAppNavigation.children} /> */}

			<>
				<DisplayCart />
			</>
		</Root>
	);
}

export default SettingsAppSidebarContent;
