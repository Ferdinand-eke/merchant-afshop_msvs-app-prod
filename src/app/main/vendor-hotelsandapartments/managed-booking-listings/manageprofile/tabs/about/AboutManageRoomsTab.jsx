import Button from '@mui/material/Button';
import React from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Drawer, Paper, Chip } from '@mui/material';
import { useParams } from 'react-router';
import RoomsTable from './RoomsTable';
import { useGetRoomsFromBookingProperty } from 'app/configs/data/server-calls/hotelsandapartments/useRoomsOnProps';
import { useState } from 'react';
import RoomMenuPanel from './formpanels/RoomMenuPanel';

/**
 * The about tab - Manage Rooms
 */
function AboutManageRoomsTab(props) {
	const { Listing } = props;
	const routeParams = useParams();
	const { productId } = routeParams;
	const [roomId, setRoomId] = useState('');
	const {
		data: rooms,
		isLoading: roomsIsLoading,
		isError: roomsIsError,
	} = useGetRoomsFromBookingProperty(productId);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04,
			},
		},
	};

	const [openNewEntry, setOpenNewEntry] = React.useState(false);
	const toggleNewEntryDrawer = (newOpen) => () => {
		setOpenNewEntry(newOpen);
	};

	const addRoomMenu = (
		<Box sx={{ width: 350 }} sm={{ width: 250 }} role="presentation">
			<RoomMenuPanel
				toggleNewEntryDrawer={toggleNewEntryDrawer(false)}
				roomId={roomId}
				apartmentId={Listing?.id}
				setRoomId={setRoomId}
			/>
		</Box>
	);

	const roomCount = rooms?.data?.rooms?.length || 0;

	return (
		<>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="w-full"
			>
				{/* Header Section */}
				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
						border: '1px solid rgba(234, 88, 12, 0.1)',
						borderRadius: 2,
					}}
				>
					<Box className="flex items-center justify-between flex-wrap gap-16">
						<Box className="flex items-center gap-16">
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: '12px',
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<FuseSvgIcon className="text-white" size={24}>
									heroicons-outline:home
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 700, color: '#292524', mb: 0.5 }}>
									Manage Rooms
								</Typography>
								<Box className="flex items-center gap-8">
									<Chip
										label={`${roomCount} ${roomCount === 1 ? 'Room' : 'Rooms'}`}
										size="small"
										sx={{
											background: 'rgba(249, 115, 22, 0.1)',
											color: '#ea580c',
											fontWeight: 600,
											height: 24,
										}}
									/>
									<Typography variant="caption" color="text.secondary">
										Configure available rooms in your property
									</Typography>
								</Box>
							</Box>
						</Box>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
						>
							<Button
								variant="contained"
								onClick={toggleNewEntryDrawer(true)}
								startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
								sx={{
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									color: 'white',
									fontWeight: 700,
									height: 48,
									px: 3,
									'&:hover': {
										background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
										boxShadow: '0 8px 16px rgba(234, 88, 12, 0.3)',
									},
								}}
							>
								Add Room
							</Button>
						</motion.div>
					</Box>
				</Paper>

				{/* Rooms Table Section */}
				<Box>
					<RoomsTable
						rooms={rooms?.data?.rooms}
						roomsIsLoading={roomsIsLoading}
						roomsIsError={roomsIsError}
						setRoomId={setRoomId}
						toggleNewEntryDrawer={toggleNewEntryDrawer(true)}
					/>
				</Box>
			</motion.div>

			<Drawer open={openNewEntry} anchor="right">
				{addRoomMenu}
			</Drawer>
		</>
	);
}

export default AboutManageRoomsTab;
