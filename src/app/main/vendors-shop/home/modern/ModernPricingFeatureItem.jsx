import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * AfricanShops Modern Pricing Feature Item - Redesigned for Production
 * Compelling feature display with gradient accents
 */
function ModernPricingFeatureItem(props) {
	const { title = '', subtitle = '', icon = '' } = props;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			whileHover={{ y: -4 }}
		>
			<Box className="flex flex-col">
				{/* Icon Container with Gradient */}
				<Box
					sx={{
						width: 64,
						height: 64,
						borderRadius: '16px',
						background: 'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 8px 24px rgba(255, 107, 53, 0.25)',
						transition: 'all 0.3s ease',
						'&:hover': {
							boxShadow: '0 12px 32px rgba(255, 107, 53, 0.35)',
							transform: 'scale(1.05)'
						}
					}}
				>
					<FuseSvgIcon size={28} sx={{ color: 'white' }}>
						{icon}
					</FuseSvgIcon>
				</Box>

				{/* Feature Title */}
				<Typography
					className="mt-20 text-20 font-bold leading-tight"
					sx={{
						color: 'text.primary'
					}}
				>
					{title}
				</Typography>

				{/* Feature Description */}
				<Typography
					className="mt-12 text-15 leading-relaxed"
					color="text.secondary"
				>
					{subtitle}
				</Typography>
			</Box>
		</motion.div>
	);
}

export default ModernPricingFeatureItem;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function ModernPricingFeatureItem(props) {
	const { title = '', subtitle = '', icon = '' } = props;
	return (
		<div>
			<Box
				className="flex h-48 w-48 items-center justify-center rounded"
				sx={{ backgroundColor: 'orange', color: 'secondary.contrastText' }}
			>
				<FuseSvgIcon>{icon}</FuseSvgIcon>
			</Box>
			<Typography className="mt-16 text-xl font-medium">{title}</Typography>
			<Typography
				className="leading-24 mt-8"
				color="text.secondary"
			>
				{subtitle}
			</Typography>
		</div>
	);
}

export default ModernPricingFeatureItem;
*/
