import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import _ from '@lodash';
import clsx from 'clsx';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Chip, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import useShopplans from 'app/configs/data/server-calls/shopplans/useShopPlans';
import { useGetMyShopAndPlanForUpdate } from 'app/configs/data/server-calls/shopdetails/useShopDetails';

const defaultValues = {
	selectedPlan: '',
	cardHolder: '',
	cardNumber: '',
	cardExpiration: '',
	cardCVC: '',
	country: '',
	zip: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	selectedPlan: z.string().min(1, 'Please select a plan'),
	cardHolder: z.string().optional(),
	cardNumber: z.string().optional(),
	cardExpiration: z.string().optional(),
	cardCVC: z.string().optional(),
	country: z.string().optional(),
	zip: z.string().optional()
});

function PlanBillingTab() {
	const { data: shopPlanData, isLoading: plansLoading } = useShopplans();
	const { data: justMyshop } = useGetMyShopAndPlanForUpdate();
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [selectedPlanData, setSelectedPlanData] = useState(null);

	const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	const { selectedPlan } = watch();

	const currentPlan = justMyshop?.data?.merchant?.shopplan;
	const merchantPlans = shopPlanData?.data?.merchantPlans || [];

	/**
	 * Form Submit
	 */
	function onSubmit(formData) {
		const plan = merchantPlans.find((p) => p.id === formData.selectedPlan);
		setSelectedPlanData(plan);
		setConfirmDialogOpen(true);
	}

	const confirmPlanChange = () => {
		// TODO: Implement plan change mutation
		setConfirmDialogOpen(false);
		// Here you would call the mutation to update the merchant plan
		console.log('Changing plan to:', selectedPlanData);
	};

	// Get plan details helper
	const getPlanDetails = (plan) => {
		const features = [];

		if (plan?.numberOfProducts) {
			features.push({
				icon: 'heroicons-outline:shopping-bag',
				text: `${plan.numberOfProducts} Products`
			});
		}

		if (plan?.numberOfStaff) {
			features.push({
				icon: 'heroicons-outline:user-group',
				text: `${plan.numberOfStaff} Staff Members`
			});
		}

		if (plan?.percetageCommissionCharge) {
			features.push({
				icon: 'heroicons-outline:receipt-percent',
				text: `${plan.percetageCommissionCharge}% Commission`
			});
		}

		return features;
	};

	return (
		<Box className="w-full max-w-6xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Plan Selection Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							mb: 3,
							background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
							border: '1px solid rgba(234, 88, 12, 0.1)',
							borderRadius: 2
						}}
					>
						<Box className="flex items-center gap-12 mb-24">
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: '12px',
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={24}
								>
									heroicons-outline:sparkles
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Merchant Plans
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Choose the perfect plan for your business needs
								</Typography>
							</Box>
						</Box>

						{/* Info Alert */}
						<Paper
							elevation={0}
							sx={{
								p: 2,
								mb: 3,
								background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
								border: '1px solid rgba(59, 130, 246, 0.2)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-start gap-12">
								<FuseSvgIcon
									size={18}
									sx={{ color: '#3b82f6', mt: 0.25 }}
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Box>
									<Typography
										variant="body2"
										sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
									>
										Plan Change Information
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#57534e', lineHeight: 1.6 }}
									>
										Upgrading your plan takes effect immediately. Downgrading will take effect at the end of your current billing cycle to ensure you don't lose access to features mid-cycle.
									</Typography>
								</Box>
							</Box>
						</Paper>

						{/* Current Plan Badge */}
						{currentPlan && (
							<Box className="mb-24">
								<Box className="flex items-center gap-8">
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										Current Plan:
									</Typography>
									<Chip
										icon={<FuseSvgIcon size={14}>heroicons-solid:star</FuseSvgIcon>}
										label={merchantPlans.find((p) => p.id === currentPlan)?.plansname || 'Unknown'}
										size="small"
										sx={{
											background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
											color: 'white',
											fontWeight: 600,
											border: 'none'
										}}
									/>
								</Box>
							</Box>
						)}

						{/* Plan Cards Grid */}
						<Controller
							name="selectedPlan"
							control={control}
							render={({ field }) => (
								<Box className="grid gap-24 sm:grid-cols-2 lg:grid-cols-3">
									{plansLoading ? (
										// Loading skeletons
										[1, 2, 3].map((i) => (
											<Skeleton
												key={i}
												variant="rectangular"
												height={280}
												sx={{ borderRadius: 2 }}
											/>
										))
									) : (
										merchantPlans.map((plan) => {
											const isSelected = field.value === plan.id;
											const isCurrent = currentPlan === plan.id;
											const features = getPlanDetails(plan);

											return (
												<motion.div
													key={plan.id}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Paper
														onClick={() => field.onChange(plan.id)}
														sx={{
															p: 3,
															cursor: 'pointer',
															position: 'relative',
															height: '100%',
															display: 'flex',
															flexDirection: 'column',
															border: isSelected
																? '3px solid #ea580c'
																: '2px solid rgba(234, 88, 12, 0.1)',
															background: isSelected
																? 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%)'
																: 'white',
															transition: 'all 0.3s',
															borderRadius: 2,
															'&:hover': {
																borderColor: '#f97316',
																boxShadow: '0 8px 24px rgba(234, 88, 12, 0.15)'
															}
														}}
													>
														{/* Selection Indicator */}
														{isSelected && (
															<Box
																sx={{
																	position: 'absolute',
																	top: 12,
																	right: 12
																}}
															>
																<FuseSvgIcon
																	size={28}
																	sx={{ color: '#ea580c' }}
																>
																	heroicons-solid:check-circle
																</FuseSvgIcon>
															</Box>
														)}

														{/* Current Plan Badge */}
														{isCurrent && (
															<Chip
																label="Current Plan"
																size="small"
																sx={{
																	position: 'absolute',
																	top: 12,
																	left: 12,
																	background: '#16a34a',
																	color: 'white',
																	fontWeight: 600,
																	fontSize: '0.7rem'
																}}
															/>
														)}

														{/* Plan Name */}
														<Typography
															variant="h6"
															className="font-bold"
															sx={{
																color: '#292524',
																mb: 1,
																mt: isCurrent ? 3 : 0
															}}
														>
															{plan.plansname}
														</Typography>

														{/* Plan Description */}
														<Typography
															variant="caption"
															sx={{ color: '#78716c', mb: 2, display: 'block' }}
														>
															{plan.plansDesc || 'Professional plan for growing businesses'}
														</Typography>

														{/* Price */}
														<Box className="flex items-end gap-4 mb-24">
															<Typography
																variant="h4"
																className="font-bold"
																sx={{ color: '#ea580c' }}
															>
																₦{plan.planPrice?.toLocaleString() || '0'}
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: '#78716c', pb: 0.5 }}
															>
																/ month
															</Typography>
														</Box>

														{/* Features List */}
														<Box className="flex-1 space-y-12">
															{features.map((feature, index) => (
																<Box
																	key={index}
																	className="flex items-center gap-8"
																>
																	<FuseSvgIcon
																		size={16}
																		sx={{ color: '#ea580c' }}
																	>
																		{feature.icon}
																	</FuseSvgIcon>
																	<Typography
																		variant="caption"
																		sx={{ color: '#57534e' }}
																	>
																		{feature.text}
																	</Typography>
																</Box>
															))}
														</Box>

														{/* Select Button */}
														<Button
															fullWidth
															variant={isSelected ? 'contained' : 'outlined'}
															disabled={isCurrent}
															sx={{
																mt: 3,
																textTransform: 'none',
																fontWeight: 600,
																...(isSelected
																	? {
																			background:
																				'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
																			color: 'white',
																			'&:hover': {
																				background:
																					'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
																			}
																	  }
																	: {
																			color: '#ea580c',
																			borderColor: '#ea580c',
																			'&:hover': {
																				borderColor: '#f97316',
																				background: 'rgba(249, 115, 22, 0.04)'
																			}
																	  })
															}}
														>
															{isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Select Plan'}
														</Button>
													</Paper>
												</motion.div>
											);
										})
									)}
								</Box>
							)}
						/>

						{errors.selectedPlan && (
							<Typography
								variant="caption"
								sx={{ color: '#dc2626', display: 'block', mt: 2 }}
							>
								{errors.selectedPlan.message}
							</Typography>
						)}
					</Paper>
				</motion.div>

				{/* Payment Details Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							mb: 3,
							background: 'linear-gradient(135deg, #fafaf9 0%, #fef3e2 100%)',
							border: '1px solid rgba(234, 88, 12, 0.1)',
							borderRadius: 2
						}}
					>
						<Box className="flex items-center gap-12 mb-24">
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: '12px',
									background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
								}}
							>
								<FuseSvgIcon
									className="text-white"
									size={24}
								>
									heroicons-outline:credit-card
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Payment Details
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Secure billing information (Optional for now)
								</Typography>
							</Box>
						</Box>

						<Box className="grid gap-24">
							{/* Card Holder */}
							<Controller
								control={control}
								name="cardHolder"
								render={({ field }) => (
									<TextField
										{...field}
										label="Card Holder Name"
										placeholder="John Doe"
										error={!!errors.cardHolder}
										helperText={errors?.cardHolder?.message}
										variant="outlined"
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:user-circle
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#f97316'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#ea580c'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#ea580c'
											}
										}}
									/>
								)}
							/>

							{/* Card Number and Details */}
							<Box className="grid gap-24 sm:grid-cols-2">
								<Controller
									control={control}
									name="cardNumber"
									render={({ field }) => (
										<TextField
											{...field}
											label="Card Number"
											placeholder="1234 5678 9012 3456"
											error={!!errors.cardNumber}
											helperText={errors?.cardNumber?.message}
											variant="outlined"
											fullWidth
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon
															size={20}
															sx={{ color: '#ea580c' }}
														>
															heroicons-solid:credit-card
														</FuseSvgIcon>
													</InputAdornment>
												)
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													'&:hover fieldset': {
														borderColor: '#f97316'
													},
													'&.Mui-focused fieldset': {
														borderColor: '#ea580c'
													}
												},
												'& .MuiInputLabel-root.Mui-focused': {
													color: '#ea580c'
												}
											}}
										/>
									)}
								/>

								<Box className="grid gap-24 sm:grid-cols-2">
									<Controller
										control={control}
										name="cardExpiration"
										render={({ field }) => (
											<TextField
												{...field}
												label="Expiry"
												placeholder="MM / YY"
												error={!!errors.cardExpiration}
												helperText={errors?.cardExpiration?.message}
												variant="outlined"
												fullWidth
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FuseSvgIcon
																size={20}
																sx={{ color: '#ea580c' }}
															>
																heroicons-solid:calendar
															</FuseSvgIcon>
														</InputAdornment>
													)
												}}
												sx={{
													'& .MuiOutlinedInput-root': {
														'&:hover fieldset': {
															borderColor: '#f97316'
														},
														'&.Mui-focused fieldset': {
															borderColor: '#ea580c'
														}
													},
													'& .MuiInputLabel-root.Mui-focused': {
														color: '#ea580c'
													}
												}}
											/>
										)}
									/>

									<Controller
										control={control}
										name="cardCVC"
										render={({ field }) => (
											<TextField
												{...field}
												label="CVC"
												placeholder="123"
												error={!!errors.cardCVC}
												helperText={errors?.cardCVC?.message}
												variant="outlined"
												fullWidth
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FuseSvgIcon
																size={20}
																sx={{ color: '#ea580c' }}
															>
																heroicons-solid:lock-closed
															</FuseSvgIcon>
														</InputAdornment>
													)
												}}
												sx={{
													'& .MuiOutlinedInput-root': {
														'&:hover fieldset': {
															borderColor: '#f97316'
														},
														'&.Mui-focused fieldset': {
															borderColor: '#ea580c'
														}
													},
													'& .MuiInputLabel-root.Mui-focused': {
														color: '#ea580c'
													}
												}}
											/>
										)}
									/>
								</Box>
							</Box>

							{/* Country and ZIP */}
							<Box className="grid gap-24 sm:grid-cols-2">
								<Controller
									control={control}
									name="country"
									render={({ field }) => (
										<TextField
											{...field}
											label="Country"
											placeholder="Nigeria"
											error={!!errors.country}
											helperText={errors?.country?.message}
											variant="outlined"
											fullWidth
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon
															size={20}
															sx={{ color: '#ea580c' }}
														>
															heroicons-solid:globe
														</FuseSvgIcon>
													</InputAdornment>
												)
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													'&:hover fieldset': {
														borderColor: '#f97316'
													},
													'&.Mui-focused fieldset': {
														borderColor: '#ea580c'
													}
												},
												'& .MuiInputLabel-root.Mui-focused': {
													color: '#ea580c'
												}
											}}
										/>
									)}
								/>

								<Controller
									control={control}
									name="zip"
									render={({ field }) => (
										<TextField
											{...field}
											label="ZIP / Postal Code"
											placeholder="100001"
											error={!!errors.zip}
											helperText={errors?.zip?.message}
											variant="outlined"
											fullWidth
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon
															size={20}
															sx={{ color: '#ea580c' }}
														>
															heroicons-solid:location-marker
														</FuseSvgIcon>
													</InputAdornment>
												)
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													'&:hover fieldset': {
														borderColor: '#f97316'
													},
													'&.Mui-focused fieldset': {
														borderColor: '#ea580c'
													}
												},
												'& .MuiInputLabel-root.Mui-focused': {
													color: '#ea580c'
												}
											}}
										/>
									)}
								/>
							</Box>
						</Box>
					</Paper>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							background: 'rgba(249, 115, 22, 0.03)',
							border: '1px solid rgba(234, 88, 12, 0.1)',
							borderRadius: 2
						}}
					>
						<Box className="flex flex-col sm:flex-row items-center justify-between gap-16">
							<Box className="flex items-center gap-12">
								<FuseSvgIcon
									size={20}
									sx={{ color: '#78716c' }}
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Typography
									variant="body2"
									sx={{ color: '#78716c' }}
								>
									{!selectedPlan
										? 'Please select a plan to continue'
										: selectedPlan === currentPlan
										? 'This is your current plan'
										: 'Ready to upgrade your plan'}
								</Typography>
							</Box>

							<Box className="flex items-center gap-12">
								<Button
									variant="outlined"
									disabled={!selectedPlan || selectedPlan === currentPlan}
									onClick={() => reset()}
									sx={{
										color: '#78716c',
										borderColor: 'rgba(120, 113, 108, 0.3)',
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#78716c',
											background: 'rgba(120, 113, 108, 0.04)'
										}
									}}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									disabled={!selectedPlan || selectedPlan === currentPlan || !isValid}
									type="submit"
									startIcon={<FuseSvgIcon size={18}>heroicons-outline:sparkles</FuseSvgIcon>}
									sx={{
										background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
										color: 'white',
										fontWeight: 700,
										textTransform: 'none',
										px: 4,
										py: 1.25,
										boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
										'&:hover': {
											background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
											boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)'
										},
										'&:disabled': {
											background: 'rgba(120, 113, 108, 0.12)',
											color: 'rgba(120, 113, 108, 0.38)',
											boxShadow: 'none'
										}
									}}
								>
									Change Plan
								</Button>
							</Box>
						</Box>
					</Paper>
				</motion.div>
			</form>

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={() => setConfirmDialogOpen(false)}
				PaperProps={{
					sx: {
						borderRadius: 2,
						minWidth: { xs: '90%', sm: 500 },
						maxWidth: 600
					}
				}}
			>
				<DialogTitle>
					<Box className="flex items-center gap-12">
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: '14px',
								background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
							}}
						>
							<FuseSvgIcon
								className="text-white"
								size={28}
							>
								heroicons-outline:sparkles
							</FuseSvgIcon>
						</Box>
						<Box>
							<Typography
								variant="h6"
								className="font-bold"
								sx={{ color: '#292524', mb: 0.5 }}
							>
								Confirm Plan Change
							</Typography>
							<Typography
								variant="caption"
								sx={{ color: '#78716c' }}
							>
								Review your new plan details
							</Typography>
						</Box>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ pt: 3 }}>
					<Box className="space-y-20">
						{/* Plan Details Card */}
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%)',
								border: '2px solid rgba(234, 88, 12, 0.2)',
								borderRadius: 2
							}}
						>
							<Typography
								variant="body1"
								sx={{ color: '#292524', fontWeight: 700, mb: 2 }}
							>
								You're upgrading to {selectedPlanData?.plansname}
							</Typography>

							<Box className="space-y-12">
								<Box className="flex items-center justify-between">
									<Typography
										variant="body2"
										sx={{ color: '#78716c' }}
									>
										Monthly Cost
									</Typography>
									<Typography
										variant="h6"
										sx={{ color: '#ea580c', fontWeight: 700 }}
									>
										₦{selectedPlanData?.planPrice?.toLocaleString()}
									</Typography>
								</Box>

								{selectedPlanData && getPlanDetails(selectedPlanData).map((feature, index) => (
									<Box
										key={index}
										className="flex items-center gap-8"
									>
										<FuseSvgIcon
											size={16}
											sx={{ color: '#16a34a' }}
										>
											heroicons-solid:check
										</FuseSvgIcon>
										<Typography
											variant="caption"
											sx={{ color: '#57534e' }}
										>
											{feature.text}
										</Typography>
									</Box>
								))}
							</Box>
						</Paper>

						{/* Billing Info */}
						<Paper
							elevation={0}
							sx={{
								p: 2,
								background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
								border: '1px solid rgba(59, 130, 246, 0.2)',
								borderRadius: 1.5
							}}
						>
							<Box className="flex items-start gap-12">
								<FuseSvgIcon
									size={18}
									sx={{ color: '#3b82f6', mt: 0.25 }}
								>
									heroicons-outline:information-circle
								</FuseSvgIcon>
								<Box>
									<Typography
										variant="body2"
										sx={{ color: '#292524', fontWeight: 600, mb: 0.5 }}
									>
										Billing Information
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#57534e', lineHeight: 1.6 }}
									>
										Your new plan will be activated immediately. You'll be charged a prorated amount for the rest of this month, and the full amount on your next billing cycle.
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Box>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 2 }}>
					<Button
						onClick={() => setConfirmDialogOpen(false)}
						variant="outlined"
						sx={{
							color: '#78716c',
							borderColor: 'rgba(120, 113, 108, 0.3)',
							fontWeight: 600,
							textTransform: 'none',
							px: 3,
							'&:hover': {
								borderColor: '#78716c',
								background: 'rgba(120, 113, 108, 0.04)'
							}
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={confirmPlanChange}
						variant="contained"
						startIcon={<FuseSvgIcon size={18}>heroicons-outline:check-circle</FuseSvgIcon>}
						sx={{
							background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
							color: 'white',
							fontWeight: 700,
							textTransform: 'none',
							px: 4,
							py: 1.25,
							boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
							'&:hover': {
								background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
								boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)'
							}
						}}
					>
						Confirm & Upgrade
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default PlanBillingTab;
