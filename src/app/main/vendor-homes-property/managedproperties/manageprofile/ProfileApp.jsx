import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import InspectionSchedulesTab from './tabs/inspection-schedules/InspectionSchedulesTab';
import OffersTab from './tabs/offers/OffersTab';
import AcquisitionsTab from './tabs/acquisitions/AcquisitionsTab';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		'& > .container': {
			maxWidth: '100%'
		}
	}
}));

const TAB_STORAGE_KEY = 'propertyProfileSelectedTab';

/**
 * The property profile page with inspection schedules, offers, and acquisitions.
 */
function ProfileApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	// Load selected tab from localStorage on mount
	const [selectedTab, setSelectedTab] = useState(() => {
		if (typeof window !== 'undefined') {
			const savedTab = window.localStorage.getItem(TAB_STORAGE_KEY);
			return savedTab ? parseInt(savedTab, 10) : 0;
		}

		return 0;
	});

	// Persist selected tab to localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(TAB_STORAGE_KEY, selectedTab.toString());
		}
	}, [selectedTab]);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	return (
		<Root
			header={
				<div className="flex flex-col w-full">
					<div className="mt-20 flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
						<div className="-mt-96 lg:-mt-88 rounded-full">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.1 } }}
							>
								<Avatar
									sx={{ borderColor: 'background.paper' }}
									className="w-128 h-128 border-4"
									src="assets/images/avatars/male-04.jpg"
									alt="User avatar"
								/>
							</motion.div>
						</div>

						<div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
							<Typography className="text-lg font-bold leading-none">Brian Hughes</Typography>
							<Typography color="text.secondary">London, UK</Typography>
						</div>

						<div className="hidden lg:flex h-32 mx-32 border-l-2" />

						<div className="flex items-center mt-24 lg:mt-0 space-x-24">
							<div className="flex flex-col items-center">
								<Typography className="font-bold">200k</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									FOLLOWERS
								</Typography>
							</div>
							<div className="flex flex-col items-center">
								<Typography className="font-bold">1.2k</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									FOLLOWING
								</Typography>
							</div>
						</div>

						<div className="flex flex-1 justify-end my-16 lg:my-0">
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								indicatorColor="primary"
								textColor="inherit"
								variant="scrollable"
								scrollButtons={false}
								className="-mx-4 min-h-40"
								classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
								TabIndicatorProps={{
									children: (
										<Box
											sx={{ bgcolor: 'text.disabled' }}
											className="w-full h-full rounded-full opacity-20"
										/>
									)
								}}
							>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="Inspection Schedules"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="Offers"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="Acquisitions"
								/>
							</Tabs>
						</div>
					</div>
				</div>
			}
			content={
				<div className="flex flex-auto justify-center w-full max-w-7xl mx-auto p-24 sm:p-32">
					{selectedTab === 0 && <InspectionSchedulesTab />}
					{selectedTab === 1 && <OffersTab />}
					{selectedTab === 2 && <AcquisitionsTab />}
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default ProfileApp;
