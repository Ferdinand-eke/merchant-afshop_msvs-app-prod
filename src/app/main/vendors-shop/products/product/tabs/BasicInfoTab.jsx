import TextField from '@mui/material/TextField';
import {
	Box,
	Card,
	CardContent,
	MenuItem,
	Select,
	Typography,
	FormControl,
	InputLabel,
	FormHelperText,
	alpha,
	Chip,
	Divider
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import useProductCats from 'app/configs/data/server-calls/product-categories/useProductCategories';
import useHubs from 'app/configs/data/server-calls/tradehubs/useTradeHubs';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The enhanced basic info tab with improved UX
 */
function BasicInfoTab() {
	const { data: hubs } = useHubs();
	const { data: catData } = useProductCats();

	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const selectedCategory = watch('category');
	const selectedHub = watch('tradehub');
	const productName = watch('name');

	return (
		<Box>
			{/* Header Section */}
			<Box className="mb-24">
				<Typography
					variant="h5"
					className="font-bold mb-12 text-2xl"
				>
					Basic Product Information
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					className="text-lg"
				>
					Provide essential details about your product to help customers find and understand what you're
					selling
				</Typography>
			</Box>

			{/* Product Identity Card */}
			<Card
				elevation={0}
				sx={{
					mb: 3,
					border: 1,
					borderColor: 'divider',
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? alpha(theme.palette.primary.main, 0.02)
							: alpha(theme.palette.background.paper, 0.4)
				}}
			>
				<CardContent>
					<Box className="flex items-center gap-12 mb-24">
						<FuseSvgIcon
							size={24}
							className="text-primary"
						>
							heroicons-outline:identification
						</FuseSvgIcon>
						<Typography
							variant="h6"
							className="font-semibold text-xl"
						>
							Product Identity
						</Typography>
					</Box>

					<Controller
						name="name"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mb-20"
								required
								label="Product Name"
								placeholder="e.g., Premium Wireless Headphones"
								autoFocus
								id="name"
								variant="outlined"
								fullWidth
								error={!!errors.name}
								helperText={
									errors?.name?.message ||
									'Choose a clear, descriptive name that customers will search for'
								}
								InputProps={{
									startAdornment: (
										<FuseSvgIcon
											size={20}
											className="mr-8"
											color="action"
										>
											heroicons-outline:pencil
										</FuseSvgIcon>
									)
								}}
							/>
						)}
					/>

					{productName && productName.length > 0 && (
						<Box className="mb-20">
							<Typography
								variant="caption"
								color="text.secondary"
								className="mb-8 block"
							>
								Character count: {productName.length}/100
							</Typography>
							<Box className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
								<Box
									className="h-full bg-primary"
									sx={{ width: `${Math.min((productName.length / 100) * 100, 100)}%` }}
								/>
							</Box>
						</Box>
					)}

					<Controller
						name="shortDescription"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mb-20"
								required
								label="Short Description"
								placeholder="Brief summary of your product in one sentence"
								id="shortDescription"
								variant="outlined"
								fullWidth
								multiline
								rows={2}
								error={!!errors.shortDescription}
								helperText={
									errors?.shortDescription?.message ||
									'A catchy summary that appears in search results'
								}
								InputProps={{
									startAdornment: (
										<FuseSvgIcon
											size={20}
											className="mr-8 mt-8"
											color="action"
										>
											heroicons-outline:chat-alt-2
										</FuseSvgIcon>
									)
								}}
							/>
						)}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								id="description"
								label="Detailed Description"
								placeholder="Provide comprehensive details about features, specifications, benefits, and usage..."
								type="text"
								multiline
								rows={6}
								variant="outlined"
								fullWidth
								helperText="Include key features, materials, dimensions, and any other relevant information"
								InputProps={{
									startAdornment: (
										<FuseSvgIcon
											size={20}
											className="mr-8 mt-8"
											color="action"
										>
											heroicons-outline:document-text
										</FuseSvgIcon>
									)
								}}
							/>
						)}
					/>
				</CardContent>
			</Card>

			{/* Classification Card */}
			<Card
				elevation={0}
				sx={{
					border: 1,
					borderColor: 'divider',
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? alpha(theme.palette.secondary.main, 0.02)
							: alpha(theme.palette.background.paper, 0.4)
				}}
			>
				<CardContent>
					<Box className="flex items-center gap-12 mb-24">
						<FuseSvgIcon
							size={24}
							className="text-secondary"
						>
							heroicons-outline:tag
						</FuseSvgIcon>
						<Typography
							variant="h6"
							className="font-semibold text-xl"
						>
							Product Classification
						</Typography>
					</Box>

					<Typography
						variant="body1"
						color="text.secondary"
						className="mb-24 text-base"
					>
						Categorize your product to help buyers find it easily
					</Typography>

					<Controller
						name="tradehub"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<FormControl
								fullWidth
								className="mb-20"
								error={!!errors.tradehub}
								variant="outlined"
							>
								<InputLabel id="tradehub-label">Trade Hub</InputLabel>
								<Select
									labelId="tradehub-label"
									id="tradehub"
									label="Trade Hub"
									onChange={onChange}
									value={value || ''}
									startAdornment={
										<FuseSvgIcon
											size={20}
											className="ml-8 mr-4"
											color="action"
										>
											heroicons-outline:globe
										</FuseSvgIcon>
									}
								>
									<MenuItem value="">
										<em>Select a trade hub</em>
									</MenuItem>
									{hubs?.data?.tradehubs &&
										hubs?.data?.tradehubs?.map((option) => (
											<MenuItem
												key={option.id}
												value={option.id}
											>
												<Box className="flex items-center gap-8">
													<FuseSvgIcon size={16}>
														heroicons-outline:location-marker
													</FuseSvgIcon>
													{option.hubname}
												</Box>
											</MenuItem>
										))}
								</Select>
								<FormHelperText>
									{errors?.tradehub?.message ||
										'Select the trade hub where this product is available'}
								</FormHelperText>
							</FormControl>
						)}
					/>

					{selectedHub && (
						<Box className="mb-20">
							<Chip
								icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
								label={`Trade Hub: ${hubs?.data?.tradehubs?.find((h) => h.id === selectedHub)?.hubname}`}
								color="primary"
								variant="outlined"
								size="small"
							/>
						</Box>
					)}

					<Divider className="my-20" />

					<Controller
						name="category"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<FormControl
								fullWidth
								error={!!errors.category}
								variant="outlined"
							>
								<InputLabel id="category-label">Product Category *</InputLabel>
								<Select
									labelId="category-label"
									id="category"
									label="Product Category *"
									onChange={onChange}
									value={value || ''}
									startAdornment={
										<FuseSvgIcon
											size={20}
											className="ml-8 mr-4"
											color="action"
										>
											heroicons-outline:collection
										</FuseSvgIcon>
									}
								>
									<MenuItem value="">
										<em>Select a product category</em>
									</MenuItem>
									{catData?.data?.categories &&
										catData?.data?.categories?.map((option) => (
											<MenuItem
												key={option.id}
												value={option.id}
											>
												<Box className="flex items-center gap-8">
													<FuseSvgIcon size={16}>heroicons-outline:folder</FuseSvgIcon>
													{option.name}
												</Box>
											</MenuItem>
										))}
								</Select>
								<FormHelperText>
									{errors?.category?.message ||
										'Choose the most relevant category for better discoverability'}
								</FormHelperText>
							</FormControl>
						)}
					/>

					{selectedCategory && (
						<Box className="mt-20">
							<Chip
								icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
								label={`Category: ${catData?.data?.categories?.find((c) => c.id === selectedCategory)?.name}`}
								color="secondary"
								variant="outlined"
								size="small"
							/>
						</Box>
					)}
				</CardContent>
			</Card>

			{/* Pro Tips */}
			<Box
				className="mt-24 p-16 rounded-lg"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? alpha(theme.palette.info.main, 0.08)
							: alpha(theme.palette.info.main, 0.15),
					border: 1,
					borderColor: 'info.main',
					borderStyle: 'dashed'
				}}
			>
				<Box className="flex items-start gap-16">
					<FuseSvgIcon
						size={24}
						className="text-info mt-4"
					>
						heroicons-outline:light-bulb
					</FuseSvgIcon>
					<Box>
						<Typography
							variant="h6"
							className="font-semibold mb-12 text-info text-lg"
						>
							Pro Tips for Better Listings
						</Typography>
						<ul className="list-disc list-inside space-y-6 text-base text-gray-700">
							<li>Use keywords that buyers would search for in your product name</li>
							<li>Highlight unique features and benefits in the description</li>
							<li>Be specific about product specifications and dimensions</li>
							<li>Choose the most accurate category to reach the right audience</li>
							<li>Keep descriptions honest and accurate to build customer trust</li>
						</ul>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default BasicInfoTab;
