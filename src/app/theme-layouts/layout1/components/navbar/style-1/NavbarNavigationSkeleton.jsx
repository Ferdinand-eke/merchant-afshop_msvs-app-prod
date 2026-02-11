import { Box, Skeleton } from '@mui/material';

/**
 * NavbarNavigationSkeleton
 *
 * A polished loading placeholder that mirrors the visual structure of a
 * vertical navigation list. Shown while the merchant's plan data is being
 * fetched so the layout never shifts once navigation appears.
 *
 * @param {object}  props
 * @param {number}  [props.itemCount=8]   - Number of skeleton nav rows to render.
 * @param {boolean} [props.showSection=true] - Whether to render a section-label skeleton above the items.
 */
function NavbarNavigationSkeleton({ itemCount = 8, showSection = true }) {
	return (
		<Box
			role="status"
			aria-label="Loading navigation"
			className="flex flex-col px-12 pt-8 pb-4"
			sx={{ width: '100%' }}
		>
			{showSection && (
				<Skeleton
					variant="text"
					width="45%"
					height={14}
					sx={{ mb: '10px', ml: '4px', borderRadius: 1 }}
				/>
			)}

			{Array.from({ length: itemCount }).map((_, index) => (
				<Box
					key={index}
					className="flex items-center gap-12 px-8 py-6"
					sx={{
						borderRadius: '8px',
						mb: '2px',
						opacity: 1 - index * (0.07),
					}}
				>
					{/* Icon placeholder */}
					<Skeleton
						variant="rounded"
						width={20}
						height={20}
						sx={{ flexShrink: 0, borderRadius: '6px' }}
					/>
					{/* Label placeholder — varying widths feel more natural */}
					<Skeleton
						variant="text"
						width={`${55 + ((index * 17) % 30)}%`}
						height={16}
						sx={{ borderRadius: 1 }}
					/>
				</Box>
			))}
		</Box>
	);
}

export default NavbarNavigationSkeleton;
