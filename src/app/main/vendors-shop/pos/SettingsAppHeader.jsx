import { useLocation } from 'react-router-dom';
import _ from '@lodash';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import SettingsAppNavigation from './SettingsAppNavigation';

function SettingsAppHeader(props) {
	const { className, onSetSidebarOpen } = props;
	const { pathname } = useLocation();
	const currentNavigation = _.find(SettingsAppNavigation.children, { url: pathname });
	return (
		<div className={clsx('flex items-center -mx-12 md:mx-0', className)}>
			<Hidden lgUp>
				<IconButton
					onClick={() => onSetSidebarOpen(true)}
					aria-label="open left sidebar"
					size="large"
				>
					<FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
				</IconButton>
			</Hidden>
			<Typography className=" text-3xl font-bold leading-none tracking-tight lg:ml-0">
				{currentNavigation?.title}
			</Typography>
		</div>
	);
}

export default SettingsAppHeader;
