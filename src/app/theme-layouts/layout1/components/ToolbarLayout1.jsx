import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import NavbarToggleButton from 'app/theme-layouts/shared-components/navbar/NavbarToggleButton';
import { selectFuseNavbar } from 'app/theme-layouts/shared-components/navbar/navbarSlice';
import { useAppSelector } from 'app/store/hooks';
import LogoHome from 'app/theme-layouts/shared-components/LogoHome';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import UserMenu from '../../shared-components/UserMenu';

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props) {
	const { className } = props;
	const config = useAppSelector(selectFuseCurrentLayoutConfig);
	const navbar = useAppSelector(selectFuseNavbar);
	const toolbarTheme = useAppSelector(selectToolbarTheme);
	const user = useAppSelector(selectUser);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx('relative z-20 flex shadow', className)}
				color="default"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? toolbarTheme.palette.background.paper
							: toolbarTheme.palette.background.default
				}}
				position="static"
				elevation={0}
			>
				<Toolbar className="min-h-48 p-0 md:min-h-64">
					<div className="flex flex-1 px-16">
						{config.navbar.display && config.navbar.position === 'left' && (
							<>
								<Hidden lgDown>
									{(config.navbar.style === 'style-3' || config.navbar.style === 'style-3-dense') && (
										<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
									)}

									{config.navbar.style === 'style-1' && !navbar.open && (
										<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
									)}
								</Hidden>

								<Hidden lgUp>
									<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
								</Hidden>
							</>
						)}

						<Hidden lgDown>
							{(!user?.role || (Array.isArray(user?.role) && user?.role?.length === 0)) && <LogoHome />}
							{/* <Logo /> */}
						</Hidden>
					</div>

					<div className="flex h-full items-center overflow-x-auto px-8">
						{/* <LinkPanelButton /> */}
						{/* <LinkPanelButton /> */}
						{/* <LinkPanelButton /> */}
						<LanguageSwitcher />
						{/* <AdjustFontSize /> */}
						{/* <FullScreenToggle /> */}
						{/* <NavigationSearch /> */}
						{/* <QuickPanelToggleButton /> */}

						{/* <NotificationPanelToggleButton /> */}

						<UserMenu />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<>
							<Hidden lgDown>
								{!navbar.open && <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />}
							</Hidden>

							<Hidden lgUp>
								<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
							</Hidden>
						</>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(ToolbarLayout1);
