import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * AfricanShops Modern Pricing Card - Redesigned for Production
 * Compelling, conversion-focused pricing card with gradient design
 */
function ModernPricingCard(props) {
	const {
		accountId = '',
		period = '',
		title = '',
		subtitle = '',
		yearlyPrice = '',
		monthlyPrice = '',
		buttonTitle = '',
		isPopular = null,
		details = '',
		className = '',
		index = 0
	} = props;

	// Define gradient colors for each plan
	const gradients = [
		'linear-gradient(135deg, #FF6B35 0%, #F77F00 100%)',
		'linear-gradient(135deg, #F77F00 0%, #FCBF49 100%)',
		'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)'
	];

	const currentGradient = gradients[index % gradients.length];

	return (
		<Paper
			className={clsx(
				'relative flex-col overflow-hidden transition-all duration-300',
				isPopular ? 'ring-4 ring-offset-4 shadow-2xl' : 'shadow-lg hover:shadow-xl',
				className
			)}
			sx={{
				borderRadius: '24px',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				...(isPopular && {
					ringColor: '#FF6B35',
					transform: 'scale(1.05)',
					'@media (max-width: 1024px)': {
						transform: 'scale(1)'
					}
				}),
				'&:hover': {
					transform: isPopular ? 'scale(1.07)' : 'translateY(-8px)',
					'@media (max-width: 1024px)': {
						transform: 'translateY(-4px)'
					}
				}
			}}
		>
			{/* Gradient Header Bar */}
			<Box
				sx={{
					background: currentGradient,
					height: isPopular ? '8px' : '6px'
				}}
			/>

			{/* Popular Badge */}
			{isPopular && (
				<Box
					sx={{
						position: 'absolute',
						top: 24,
						right: 24,
						zIndex: 10
					}}
				>
					<Chip
						icon={<FuseSvgIcon size={16} sx={{ color: 'white !important' }}>heroicons-solid:star</FuseSvgIcon>}
						label="MOST POPULAR"
						size="small"
						sx={{
							background: currentGradient,
							color: 'white',
							fontWeight: 700,
							fontSize: '0.75rem',
							letterSpacing: '0.5px',
							px: 1.5,
							height: 32,
							boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
							'& .MuiChip-icon': {
								color: 'white'
							}
						}}
					/>
				</Box>
			)}

			{/* Card Content */}
			<Box className="flex flex-col flex-1 p-32 sm:px-40 sm:py-48">
				{/* Plan Title */}
				<Typography
					className="text-32 font-black leading-tight tracking-tight"
					sx={{
						color: 'text.primary',
						mb: 2
					}}
				>
					{title}
				</Typography>

				{/* Plan Subtitle */}
				<Typography
					className="text-15 font-medium leading-relaxed"
					color="text.secondary"
					sx={{
						minHeight: '60px',
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden'
					}}
				>
					{subtitle?.substring(0, 120)}{subtitle?.length > 120 && '...'}
				</Typography>

				{/* Decorative Divider with Gradient */}
				<Box
					sx={{
						background: currentGradient,
						height: '4px',
						width: '48px',
						borderRadius: '2px',
						my: 4
					}}
				/>

				{/* Pricing Display */}
				<Box className="flex items-end gap-8 my-24">
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: '12px',
							background: currentGradient,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25)'
						}}
					>
						<Typography className="text-24 font-black" sx={{ color: 'white' }}>
							%
						</Typography>
					</Box>
					<Typography
						className="text-56 font-black leading-none tracking-tight"
						sx={{
							background: currentGradient,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text'
						}}
					>
						{period === 'month' && monthlyPrice}
						{period === 'year' && yearlyPrice}
					</Typography>
				</Box>

				{/* Commission Details */}
				<Box
					className="mb-32 p-16 rounded-lg"
					sx={{
						backgroundColor: (theme) => theme.palette.mode === 'dark'
							? 'rgba(255, 107, 53, 0.1)'
							: 'rgba(255, 107, 53, 0.05)',
						border: '1px solid',
						borderColor: (theme) => theme.palette.mode === 'dark'
							? 'rgba(255, 107, 53, 0.2)'
							: 'rgba(255, 107, 53, 0.1)'
					}}
				>
					{period === 'month' ? (
						<>
							<Typography className="text-13 font-bold mb-4" sx={{ color: '#FF6B35' }}>
								Negotiated Commission
							</Typography>
							<Typography className="text-13" color="text.secondary">
								Only <span className="font-bold">{monthlyPrice}%</span> commission when you earn
							</Typography>
							<Typography className="text-12 mt-4" color="text.secondary">
								Alternative: <span className="font-bold">{yearlyPrice}%</span> standard rate
							</Typography>
						</>
					) : (
						<>
							<Typography className="text-13 font-bold mb-4" sx={{ color: '#FF6B35' }}>
								Percentage Commission
							</Typography>
							<Typography className="text-13" color="text.secondary">
								Only <span className="font-bold">{yearlyPrice}%</span> commission when you earn
							</Typography>
							<Typography className="text-12 mt-4" color="text.secondary">
								Alternative: <span className="font-bold">{monthlyPrice}%</span> negotiated rate
							</Typography>
						</>
					)}
				</Box>

				{/* CTA Button */}
				<Button
					component={Link}
					to={`/homeregistry/register/${accountId}/chosen-plan`}
					size="large"
					variant="contained"
					fullWidth
					sx={{
						background: isPopular ? currentGradient : 'transparent',
						color: isPopular ? 'white' : '#FF6B35',
						border: isPopular ? 'none' : '2px solid #FF6B35',
						py: 1.5,
						fontSize: '1rem',
						fontWeight: 700,
						borderRadius: '12px',
						textTransform: 'none',
						boxShadow: isPopular ? '0 4px 16px rgba(255, 107, 53, 0.3)' : 'none',
						'&:hover': {
							background: isPopular
								? 'linear-gradient(135deg, #F77F00 0%, #FF6B35 100%)'
								: 'rgba(255, 107, 53, 0.1)',
							boxShadow: isPopular
								? '0 6px 24px rgba(255, 107, 53, 0.4)'
								: 'none',
							borderColor: isPopular ? 'transparent' : '#F77F00',
							transform: 'translateY(-2px)'
						},
						transition: 'all 0.3s ease',
						mb: 3
					}}
					endIcon={<FuseSvgIcon size={20}>heroicons-outline:arrow-right</FuseSvgIcon>}
				>
					{buttonTitle}
				</Button>

				{/* Trust Badge */}
				<Box className="flex items-center justify-center gap-8 mb-24">
					<FuseSvgIcon size={16} sx={{ color: '#10B981' }}>
						heroicons-solid:check-circle
					</FuseSvgIcon>
					<Typography className="text-12 font-medium" sx={{ color: '#10B981' }}>
						No credit card required
					</Typography>
				</Box>

				{/* Feature Details */}
				<Box sx={{ mt: 'auto' }}>
					{details}
				</Box>
			</Box>
		</Paper>
	);
}

export default ModernPricingCard;

/* ========================================
   PREVIOUS VERSION - COMMENTED OUT
   ======================================== */

/*
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import clsx from 'clsx';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';

function ModernPricingCard(props) {
	const {
		accountId='',
		period = '',
		title = '',
		subtitle = '',
		yearlyPrice = '',
		monthlyPrice = '',
		buttonTitle = '',
		isPopular = null,
		details = '',
		className = ''
	} = props;

	return (
		<Paper
			className={clsx(
				'relative max-w-sm flex-col p-24 sm:px-40 sm:py-48 md:max-w-none',
				isPopular && 'ring-primary ring-2',
				className
			)}
		>
			{isPopular && (
				<div className="absolute inset-x-0 -top-16 flex items-center justify-center">
					<Chip
						label="POPULAR"
						color="secondary"
						className="flex h-32 items-center rounded-full px-32 text-center font-medium leading-none"
					/>
				</div>
			)}

			<Typography className="text-4xl font-bold leading-tight tracking-tight">{title}</Typography>

			<Typography
				className="mt-8 text-lg font-medium tracking-tight"
				color="text.secondary"
			>
				{subtitle?.substring(0, 100)}{subtitle && '...'}
			</Typography>

			<Divider className="bg-accent my-40 h-4 w-32 rounded" />

			<div className="flex items-baseline whitespace-nowrap">
				<Typography className="mr-8 text-2xl">%</Typography>
				<Typography className="text-6xl font-semibold leading-tight tracking-tight">
					{period === 'month' && monthlyPrice }
					{period === 'year' && yearlyPrice}
				</Typography>
			</div>

			<Typography
				className="mt-8 flex flex-col"
				color="text.secondary"
			>
				{period === 'month' && (
					<>
						<span> commission billed only when you earn </span>
						<span>
							<b>{yearlyPrice} {"%"}</b>  commission billed only when you earn
						</span>
					</>
				)}
				{period === 'year' && (
					<>
						<span>billed commission only when you earn</span>
						<span>
							<b>{monthlyPrice} {"%"}</b> billed commission only when you earn
						</span>
					</>
				)}
			</Typography>

			<Button
			component={Link}
			to={`/homeregistry/register/${accountId}/chosen-plan`}
				className="mt-40 w-full"
				size="large"
				variant={isPopular ? 'contained' : 'outlined'}
				color={isPopular ? 'secondary' : 'inherit'}
			>
				{buttonTitle}
			</Button>
			{details}
		</Paper>

	);
}

export default ModernPricingCard;
*/
