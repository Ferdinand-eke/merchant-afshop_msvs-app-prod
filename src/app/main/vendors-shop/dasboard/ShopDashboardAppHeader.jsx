import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import _ from '@lodash';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { darken } from '@mui/material/styles';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

/**
 * The ProjectDashboardAppHeader page.
 */
function ShopDashboardAppHeader() {
	const user = useAppSelector(selectUser);
	

	return (
		<div className="flex flex-col w-full px-24 sm:px-32">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
				<div className="flex flex-auto items-center min-w-0">
					<Avatar
						sx={{
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: (theme) => theme.palette.text.secondary
						}}
						className="flex-0 w-64 h-64"
						alt="user photo"
						src={user?.data?.photoURL}
					>
						{user?.name?.[0]}

					</Avatar>
					<div className="flex flex-col min-w-0 mx-16">
						<Typography className="text-2xl md:text-2xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
							{`Welcome back, ${user?.name}! to your africanshops!`}
						</Typography>

						<div className="flex items-center">
							<FuseSvgIcon
								size={20}
								color="action"
							>
								heroicons-solid:bell
							</FuseSvgIcon>
							<Typography
							component={NavLinkAdapter}
							to="/merchants/mailbox/inbox"
								className="mx-6 leading-6 truncate"
								color="text.secondary"
							>
								You have 2 new messages and 15 new tasks
							</Typography>
						</div>
					</div>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
					component={NavLinkAdapter}
					to="/merchants/mailbox/inbox"
						className="whitespace-nowrap"
						variant="contained"
						color="primary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>}
					>
						Messages
					</Button>
					
					<Button
						component={NavLinkAdapter}
						to="/africanshops/settings/account"
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
					>
						Settings
					</Button>
				</div>
			</div>
			
		</div>
	);
}

export default ShopDashboardAppHeader;
