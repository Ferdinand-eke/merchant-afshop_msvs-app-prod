import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import useHubs from 'app/configs/data/server-calls/tradehubs/useTradeHubs';
import useSellerCountries from 'app/configs/data/server-calls/countries/useCountries';
import {
	useGetMyShopAndPlanForUpdate,
	useShopUpdateMutation
} from 'app/configs/data/server-calls/shopdetails/useShopDetails';
import useShopplans from 'app/configs/data/server-calls/shopplans/useShopPlans';
import { Avatar, Box, MenuItem, Select, Paper, Chip, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { getLgaByStateId, getMarketsByLgaId, getStateByCountryId } from 'app/configs/data/client/clientToApiRoutes';
import { firebaseApp } from 'src/app/auth/services/firebase/initializeFirebase';
import { getStorage, ref, deleteObject, uploadString, getDownloadURL } from 'firebase/storage';
import FuseUtils from '@fuse/utils/FuseUtils';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const defaultValues = {
	avatar: '',
	shopname: '',
	tradehub: '',
	userOwner: '',
	businessCountry: '',
	businezState: '',
	businezLga: '',
	market: '',
	usingParentId: '',
	coverimage: '',
	shoplogo: '',
	shopphone: '',
	address: '',
	shopbio: '',
	shopplan: '',
	instagram: '',
	twitter: '',
	facebook: '',
	linkedin: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	shopname: z.string().nonempty('Name is required'),
	shopbio: z.string().nonempty('Shop bio is required'),
	shopemail: z.string().email('Invalid email').nonempty('Email is required'),
	shopphone: z.string().nonempty('Phone is required'),
	businessCountry: z.string().nonempty('Country is required'),
	businezState: z.string().nonempty('State is required'),
	businezLga: z.string().nonempty('L.G.A/County is required'),
	market: z.string().nonempty('Market is required'),
	tradehub: z.string().nonempty('Trade Hub is required'),
	shopplan: z.string().nonempty('A shop plan is required')
});

function AccountTab() {
	const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	const { avatar } = watch();

	const [loading, setLoading] = useState(false);
	const { data: justMyshop } = useGetMyShopAndPlanForUpdate();

	const { data: hubData } = useHubs();
	const { data: countryData } = useSellerCountries();

	const { data: shopPlanData, isLoading: planIsLoading } = useShopplans();
	const updateShopDetails = useShopUpdateMutation();

	const [blgas, setBlgas] = useState([]);
	const [markets, setBMarkets] = useState([]);
	const [stateData, setStateData] = useState([]);

	useEffect(() => {
		reset(justMyshop?.data?.merchant);
	}, [justMyshop?.data?.merchant, reset]);

	useEffect(() => {
		if (getValues()?.businessCountry) {
			findStatesByCountry(getValues()?.businessCountry);
		}

		if (getValues()?.businezState) {
			getLgasFromState(getValues()?.businezState);
		}

		if (getValues()?.businezLga) {
			getMarketsFromLgaId(getValues()?.businezLga);
		}
	}, [getValues()?.businessCountry, getValues()?.businezState]);

	/** Get States from country_ID data */
	async function findStatesByCountry() {
		setLoading(true);
		const stateResponseData = await getStateByCountryId(getValues()?.businessCountry);

		if (stateResponseData) {
			setStateData(stateResponseData?.data?.states);

			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	/** Get L.G.As from state_ID data */
	async function getLgasFromState(sid) {
		setLoading(true);
		const responseData = await getLgaByStateId(sid);

		if (responseData) {
			setBlgas(responseData?.data?.lgas);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	/** Get Markets from lga_ID data */
	async function getMarketsFromLgaId(lid) {
		if (lid) {
			setLoading(true);
			const responseData = await getMarketsByLgaId(lid);

			if (responseData) {
				setBMarkets(responseData?.data?.markets);
				setTimeout(function () {
					setLoading(false);
				}, 250);
			}
		}
	}

	/**
	 * Form Submit
	 */
	function onSubmit(formData) {
		if (avatar) {
			const fileName = new Date().getTime() + FuseUtils.generateGUID();
			const storage = getStorage(firebaseApp);
			const storageRef = ref(storage, `/shopbanners/${fileName}`);
			const uploadTask = uploadString(storageRef, avatar, 'data_url');
			const desertRef = ref(storage, `${getValues()?.coverimage}`);

			// Delete the file
			if (getValues()?.coverimage) {
				deleteObject(desertRef)
					.then(() => {
						uploadTask.then((snapshot) => {
							getDownloadURL(snapshot.ref).then((downloadURL) => {
								setValue('coverimage', downloadURL);
								updateShopDetails?.mutate(getValues());
							});
						});
					})
					.catch((error) => {
						console.log(error);
						toast.error(
							error.response && error.response.data.message ? error.response.data.message : error.message
						);
					});
			} else {
				uploadTask.then((snapshot) => {
					getDownloadURL(snapshot.ref)
						.then((downloadURL) => {
							setValue('coverimage', downloadURL);
							updateShopDetails?.mutate(getValues());
						})
						.catch((error) => {
							console.log(error);
							toast.error(
								error.response && error.response.data.message
									? error.response.data.message
									: error.message
							);
						});
				});
			}
		} else {
			updateShopDetails?.mutate(getValues());
		}
	}

	return (
		<Box className="w-full max-w-4xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Profile Section */}
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
									heroicons-outline:user-circle
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Profile Information
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Update your public merchant profile details
								</Typography>
							</Box>
						</Box>

						<Box className="grid gap-24">
							{/* Profile Avatar */}
							<Box className="flex flex-col sm:flex-row items-center gap-24">
								<Controller
									control={control}
									name="avatar"
									render={({ field: { onChange, value } }) => (
										<Box className="relative">
											<Box
												sx={{
													position: 'relative',
													width: 140,
													height: 140,
													borderRadius: '16px',
													overflow: 'hidden',
													border: '4px solid',
													borderColor: 'background.paper',
													boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
												}}
											>
												<Avatar
													sx={{
														backgroundColor: 'background.default',
														color: 'text.secondary',
														width: '100%',
														height: '100%',
														fontSize: '3rem',
														fontWeight: 'bold'
													}}
													src={getValues()?.avatar}
													alt={getValues()?.shopname}
												>
													{getValues()?.shopname?.charAt(0)}
												</Avatar>

												<Box
													sx={{
														position: 'absolute',
														inset: 0,
														background: 'rgba(0, 0, 0, 0.5)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														opacity: 0,
														transition: 'opacity 0.3s',
														'&:hover': { opacity: 1 },
														cursor: 'pointer'
													}}
												>
													<label
														htmlFor="button-avatar"
														className="flex p-12 cursor-pointer"
													>
														<input
															accept="image/*"
															className="hidden"
															id="button-avatar"
															type="file"
															onChange={async (e) => {
																function readFileAsync() {
																	return new Promise((resolve, reject) => {
																		const file = e?.target?.files?.[0];

																		if (!file) {
																			return;
																		}

																		const reader = new FileReader();
																		reader.onload = () => {
																			if (typeof reader.result === 'string') {
																				resolve(
																					`data:${file.type};base64,${btoa(reader.result)}`
																				);
																			} else {
																				reject(
																					new Error(
																						'File reading did not result in a string.'
																					)
																				);
																			}
																		};
																		reader.onerror = reject;
																		reader.readAsBinaryString(file);
																	});
																}

																const newImage = await readFileAsync();
																onChange(newImage);
															}}
														/>
														<Box className="flex flex-col items-center gap-4">
															<FuseSvgIcon
																className="text-white"
																size={32}
															>
																heroicons-outline:camera
															</FuseSvgIcon>
															<Typography
																variant="caption"
																className="text-white font-semibold"
															>
																Change Photo
															</Typography>
														</Box>
													</label>
												</Box>
											</Box>
										</Box>
									)}
								/>

								<Box className="flex-1">
									<Typography
										variant="body2"
										sx={{ color: '#292524', fontWeight: 600, mb: 1 }}
									>
										Profile Photo
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: '#78716c', display: 'block', mb: 2 }}
									>
										Upload a professional photo that represents your brand. JPG, PNG or GIF (MAX. 2MB)
									</Typography>
									<Box className="flex gap-8">
										<Chip
											label="Square Format Recommended"
											size="small"
											sx={{
												background: 'rgba(249, 115, 22, 0.1)',
												color: '#ea580c',
												fontWeight: 500,
												fontSize: '0.75rem'
											}}
										/>
									</Box>
								</Box>
							</Box>

							<Divider sx={{ my: 1 }} />

							{/* Shop Name */}
							<Controller
								control={control}
								name="shopname"
								render={({ field }) => (
									<TextField
										{...field}
										label="Shop Name"
										placeholder="Enter your shop name"
										error={!!errors.shopname}
										helperText={errors?.shopname?.message}
										variant="outlined"
										required
										fullWidth
										disabled
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:shopping-bag
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

							{/* Trade Hub and Shop Plan */}
							<Box className="grid gap-24 sm:grid-cols-2">
								<FormControl
									fullWidth
									error={!!errors.tradehub}
								>
									<InputLabel>Trade Hub</InputLabel>
									<Controller
										control={control}
										name="tradehub"
										render={({ field }) => (
											<Select
												{...field}
												label="Trade Hub"
												startAdornment={
													<InputAdornment position="start">
														<FuseSvgIcon
															size={20}
															sx={{ color: '#ea580c' }}
														>
															heroicons-solid:location-marker
														</FuseSvgIcon>
													</InputAdornment>
												}
												sx={{
													'&:hover .MuiOutlinedInput-notchedOutline': {
														borderColor: '#f97316'
													},
													'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
														borderColor: '#ea580c'
													}
												}}
											>
												{hubData?.data?.tradehubs?.map((hub, index) => (
													<MenuItem
														key={index}
														value={hub?.id}
													>
														<Box className="flex items-center gap-8">
															<FuseSvgIcon
																size={16}
																sx={{ color: '#ea580c' }}
															>
																heroicons-solid:office-building
															</FuseSvgIcon>
															{hub?.hubname}
														</Box>
													</MenuItem>
												))}
											</Select>
										)}
									/>
									{errors.tradehub && <FormHelperText>{errors.tradehub.message}</FormHelperText>}
								</FormControl>

								<FormControl
									fullWidth
									error={!!errors.shopplan}
								>
									<InputLabel>Shop Plan</InputLabel>
									<Controller
										control={control}
										name="shopplan"
										render={({ field }) => (
											<Select
												{...field}
												label="Shop Plan"
												disabled
												startAdornment={
													<InputAdornment position="start">
														<FuseSvgIcon
															size={20}
															sx={{ color: '#ea580c' }}
														>
															heroicons-solid:star
														</FuseSvgIcon>
													</InputAdornment>
												}
											>
												{shopPlanData?.data?.merchantPlans?.map((plan, index) => (
													<MenuItem
														key={index}
														value={plan?.id}
													>
														{plan?.plansname}
													</MenuItem>
												))}
											</Select>
										)}
									/>
									{errors.shopplan && <FormHelperText>{errors.shopplan.message}</FormHelperText>}
								</FormControl>
							</Box>

							{/* Address */}
							<Controller
								control={control}
								name="address"
								render={({ field }) => (
									<TextField
										{...field}
										label="Shop Address"
										placeholder="Enter your shop's physical address"
										error={!!errors.address}
										helperText={errors?.address?.message || 'Your shop\'s location for deliveries and visits'}
										variant="outlined"
										required
										fullWidth
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:map
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

							{/* Postal Code */}
							<Controller
								control={control}
								name="postalCode"
								render={({ field }) => (
									<TextField
										{...field}
										label="Postal Code"
										placeholder="Enter postal/zip code"
										variant="outlined"
										fullWidth
										error={!!errors.postalCode}
										helperText={errors?.postalCode?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:mail-open
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

							{/* Shop Bio */}
							<Controller
								control={control}
								name="shopbio"
								render={({ field }) => (
									<TextField
										{...field}
										label="Shop Description"
										placeholder="Tell customers about your business..."
										error={!!errors.shopbio}
										variant="outlined"
										fullWidth
										multiline
										minRows={4}
										maxRows={8}
										InputProps={{
											startAdornment: (
												<InputAdornment
													className="self-start mt-16"
													position="start"
												>
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:document-text
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										helperText={
											<span className="flex flex-col gap-4">
												<span className="text-xs text-stone-600">
													Write a compelling description of your business. This will be displayed on your public profile.
												</span>
												{errors?.shopbio && <span className="text-red-600">{errors?.shopbio?.message}</span>}
											</span>
										}
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
					</Paper>
				</motion.div>

				{/* Contact Information Section */}
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
									heroicons-outline:phone
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Contact Information
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									How customers can reach you
								</Typography>
							</Box>
						</Box>

						<Box className="grid gap-24 sm:grid-cols-2">
							<Controller
								control={control}
								name="shopemail"
								render={({ field }) => (
									<TextField
										{...field}
										label="Shop Email"
										placeholder="shop@example.com"
										variant="outlined"
										fullWidth
										disabled
										error={!!errors.shopemail}
										helperText={errors?.shopemail?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:mail
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
								name="shopphone"
								render={({ field }) => (
									<TextField
										{...field}
										label="Phone Number"
										placeholder="+234 XXX XXX XXXX"
										variant="outlined"
										fullWidth
										error={!!errors.shopphone}
										helperText={errors?.shopphone?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:phone
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
					</Paper>
				</motion.div>

				{/* Geographic Location Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
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
									heroicons-outline:globe
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Geographic Location
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Where your business operates
								</Typography>
							</Box>
						</Box>

						<Box className="grid gap-24 sm:grid-cols-2">
							<FormControl
								fullWidth
								error={!!errors.businessCountry}
							>
								<InputLabel>Country</InputLabel>
								<Controller
									control={control}
									name="businessCountry"
									render={({ field }) => (
										<Select
											{...field}
											label="Country"
											startAdornment={
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:flag
													</FuseSvgIcon>
												</InputAdornment>
											}
											sx={{
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#f97316'
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#ea580c'
												}
											}}
										>
											{countryData?.data?.countries?.map((buzcountry, index) => (
												<MenuItem
													key={index}
													value={buzcountry?.id}
												>
													{buzcountry?.name}
												</MenuItem>
											))}
										</Select>
									)}
								/>
								{errors.businessCountry && (
									<FormHelperText>{errors.businessCountry.message}</FormHelperText>
								)}
							</FormControl>

							<FormControl
								fullWidth
								error={!!errors.businezState}
							>
								<InputLabel>State/Region</InputLabel>
								<Controller
									control={control}
									name="businezState"
									render={({ field }) => (
										<Select
											{...field}
											label="State/Region"
											startAdornment={
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:map
													</FuseSvgIcon>
												</InputAdornment>
											}
											sx={{
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#f97316'
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#ea580c'
												}
											}}
										>
											{stateData?.map((buzstate, index) => (
												<MenuItem
													key={index}
													value={buzstate?.id}
												>
													{buzstate?.name}
												</MenuItem>
											))}
										</Select>
									)}
								/>
								{errors.businezState && <FormHelperText>{errors.businezState.message}</FormHelperText>}
							</FormControl>

							<FormControl
								fullWidth
								error={!!errors.businezLga}
							>
								<InputLabel>L.G.A/County</InputLabel>
								<Controller
									control={control}
									name="businezLga"
									render={({ field }) => (
										<Select
											{...field}
											label="L.G.A/County"
											startAdornment={
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:location-marker
													</FuseSvgIcon>
												</InputAdornment>
											}
											sx={{
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#f97316'
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#ea580c'
												}
											}}
										>
											{blgas?.map((lga, index) => (
												<MenuItem
													key={index}
													value={lga?.id}
												>
													{lga?.name}
												</MenuItem>
											))}
										</Select>
									)}
								/>
								{errors.businezLga && <FormHelperText>{errors.businezLga.message}</FormHelperText>}
							</FormControl>

							<FormControl
								fullWidth
								error={!!errors.market}
							>
								<InputLabel>Market</InputLabel>
								<Controller
									control={control}
									name="market"
									render={({ field }) => (
										<Select
											{...field}
											label="Market"
											startAdornment={
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#ea580c' }}
													>
														heroicons-solid:shopping-cart
													</FuseSvgIcon>
												</InputAdornment>
											}
											sx={{
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#f97316'
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#ea580c'
												}
											}}
										>
											{markets?.map((market, index) => (
												<MenuItem
													key={index}
													value={market?.id}
												>
													{market?.name}
												</MenuItem>
											))}
										</Select>
									)}
								/>
								{errors.market && <FormHelperText>{errors.market.message}</FormHelperText>}
							</FormControl>
						</Box>
					</Paper>
				</motion.div>

				{/* Social Media Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							mb: 4,
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
									heroicons-outline:share
								</FuseSvgIcon>
							</Box>
							<Box>
								<Typography
									variant="h6"
									className="font-bold"
									sx={{ color: '#292524', mb: 0.5 }}
								>
									Social Media
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: '#78716c' }}
								>
									Connect with customers on social platforms
								</Typography>
							</Box>
						</Box>

						<Box className="grid gap-24 sm:grid-cols-2">
							<Controller
								control={control}
								name="instagram"
								render={({ field }) => (
									<TextField
										{...field}
										label="Instagram"
										placeholder="@yourshop"
										variant="outlined"
										fullWidth
										error={!!errors.instagram}
										helperText={errors?.instagram?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#E1306C' }}
													>
														heroicons-solid:camera
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#E1306C'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#E1306C'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#E1306C'
											}
										}}
									/>
								)}
							/>

							<Controller
								control={control}
								name="twitter"
								render={({ field }) => (
									<TextField
										{...field}
										label="Twitter/X"
										placeholder="@yourshop"
										variant="outlined"
										fullWidth
										error={!!errors.twitter}
										helperText={errors?.twitter?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#1DA1F2' }}
													>
														heroicons-solid:hashtag
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#1DA1F2'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#1DA1F2'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#1DA1F2'
											}
										}}
									/>
								)}
							/>

							<Controller
								control={control}
								name="facebook"
								render={({ field }) => (
									<TextField
										{...field}
										label="Facebook"
										placeholder="facebook.com/yourshop"
										variant="outlined"
										fullWidth
										error={!!errors.facebook}
										helperText={errors?.facebook?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#1877F2' }}
													>
														heroicons-solid:thumb-up
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#1877F2'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#1877F2'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#1877F2'
											}
										}}
									/>
								)}
							/>

							<Controller
								control={control}
								name="linkedin"
								render={({ field }) => (
									<TextField
										{...field}
										label="LinkedIn"
										placeholder="linkedin.com/in/yourshop"
										variant="outlined"
										fullWidth
										error={!!errors.linkedin}
										helperText={errors?.linkedin?.message}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon
														size={20}
														sx={{ color: '#0A66C2' }}
													>
														heroicons-solid:briefcase
													</FuseSvgIcon>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												'&:hover fieldset': {
													borderColor: '#0A66C2'
												},
												'&.Mui-focused fieldset': {
													borderColor: '#0A66C2'
												}
											},
											'& .MuiInputLabel-root.Mui-focused': {
												color: '#0A66C2'
											}
										}}
									/>
								)}
							/>
						</Box>
					</Paper>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
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
									{_.isEmpty(dirtyFields)
										? 'No changes made yet'
										: `${Object.keys(dirtyFields).length} field(s) updated`}
								</Typography>
							</Box>

							<Box className="flex items-center gap-12">
								<Button
									variant="outlined"
									disabled={_.isEmpty(dirtyFields)}
									onClick={() => reset(justMyshop?.data?.merchant)}
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
									Reset Changes
								</Button>
								<Button
									variant="contained"
									disabled={_.isEmpty(dirtyFields) || !isValid || updateShopDetails.isLoading}
									type="submit"
									startIcon={
										updateShopDetails.isLoading ? (
											<FuseSvgIcon
												size={18}
												className="animate-spin"
											>
												heroicons-outline:refresh
											</FuseSvgIcon>
										) : (
											<FuseSvgIcon size={18}>heroicons-outline:check-circle</FuseSvgIcon>
										)
									}
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
									{updateShopDetails.isLoading ? 'Saving Profile...' : 'Save Profile'}
								</Button>
							</Box>
						</Box>
					</Paper>
				</motion.div>
			</form>
		</Box>
	);
}

export default AccountTab;
