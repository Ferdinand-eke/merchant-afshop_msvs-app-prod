import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useGetMyShopAndPlan } from "app/configs/data/server-calls/shopdetails/useShopDetails";

/**
 * The ShopDashboardAppHeader - Enhanced header with welcome banner for all merchant types
 */
function ShopDashboardAppHeader() {
	const user = useAppSelector(selectUser);
	const { data: shopData } = useGetMyShopAndPlan();

	const merchantName = shopData?.data?.merchant?.merchantshop?.shopname || user?.name || "Merchant";
	const merchantPlan = shopData?.data?.merchant?.merchantShopplan?.planname || "Business";

	// Get merchant-specific icon based on plan
	const getMerchantIcon = (planKey) => {
		const icons = {
			RETAIL: "heroicons-outline:shopping-bag",
			WHOLESALEANDRETAILERS: "heroicons-outline:shopping-cart",
			MANUFACTURERS: "heroicons-outline:cube",
			HOTELSANDAPARTMENTS: "heroicons-outline:home",
			REALESTATES: "heroicons-outline:office-building",
			FOODVENDORS: "heroicons-outline:cake",
			LOGISTICS: "heroicons-outline:truck",
		};
		return icons[planKey] || "heroicons-outline:store";
	};

	const planKey = shopData?.data?.merchant?.merchantShopplan?.plankey;
	const merchantIcon = getMerchantIcon(planKey);

	return (
		<div className="flex flex-col w-full">
			{/* Welcome Banner */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full px-24 sm:px-32 pt-24 sm:pt-32"
			>
				<Paper
					className="relative overflow-hidden rounded-2xl shadow-lg"
					sx={{
						background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
						color: "white",
					}}
				>
					<Box className="relative z-10 p-24 sm:p-32">
						<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
							{/* Left Side - Welcome Message */}
							<Box className="flex items-center gap-16">
								<Avatar
									sx={{
										width: 64,
										height: 64,
										backgroundColor: "rgba(255, 255, 255, 0.2)",
										color: "white",
									}}
								>
									<FuseSvgIcon size={32}>{merchantIcon}</FuseSvgIcon>
								</Avatar>
								<Box>
									<Typography variant="h4" className="font-bold mb-4">
										Welcome back, {merchantName}!
									</Typography>
									<Typography variant="body1" className="opacity-90">
										Manage your {merchantPlan} business with ease
									</Typography>
								</Box>
							</Box>

							{/* Right Side - Quick Action Buttons */}
							<Box className="flex items-center gap-12">
								<Button
									component={NavLinkAdapter}
									to="/merchants/mailbox/inbox"
									variant="contained"
									sx={{
										backgroundColor: "rgba(255, 255, 255, 0.2)",
										color: "white",
										backdropFilter: "blur(10px)",
										"&:hover": {
											backgroundColor: "rgba(255, 255, 255, 0.3)",
										},
									}}
									startIcon={<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>}
								>
									Messages
								</Button>

								<Button
									component={NavLinkAdapter}
									to="/africanshops/settings/account"
									variant="contained"
									sx={{
										backgroundColor: "rgba(255, 255, 255, 0.2)",
										color: "white",
										backdropFilter: "blur(10px)",
										"&:hover": {
											backgroundColor: "rgba(255, 255, 255, 0.3)",
										},
									}}
									startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
								>
									Settings
								</Button>
							</Box>
						</Box>

						{/* Notification Bar */}
						<Box className="flex items-center gap-8 mt-16 p-12 bg-white/10 backdrop-blur-sm rounded-xl">
							<FuseSvgIcon size={20} className="text-white">
								heroicons-solid:bell
							</FuseSvgIcon>
							<Typography
								component={NavLinkAdapter}
								to="/merchants/mailbox/inbox"
								variant="body2"
								className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
							>
								You have 2 new messages and 15 new tasks
							</Typography>
						</Box>
					</Box>

					{/* Decorative background pattern */}
					<Box
						sx={{
							position: "absolute",
							top: 0,
							right: 0,
							width: "50%",
							height: "100%",
							opacity: 0.1,
							background:
								"radial-gradient(circle at 100% 0%, white 0%, transparent 50%)",
						}}
					/>
				</Paper>
			</motion.div>
		</div>
	);
}

export default ShopDashboardAppHeader;
