import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	useCreateECommerceProductMutation,
	useDeleteECommerceProductMutation,
	useUpdateECommerceProductMutation
} from '../ECommerceApi';
// import { useAddShopEstatePropertyMutation, useEstatePropertyUpdateMutation } from 'app/configs/data/server-calls/estateproperties/useShopEstateProperties';
import { useAddShopBookingsPropertyMutation, useBookingsPropertyUpdateMutation } from 'app/configs/data/server-calls/hotelsandapartments/useShopBookingsProperties';

/**
 * The product header.
 */
function BookingPropertyHeader() {
	const routeParams = useParams();
	const { productId } = routeParams;
	// const [createProduct] = useCreateECommerceProductMutation();
	// const [saveProduct] = useUpdateECommerceProductMutation();
	// const [removeProduct] = useDeleteECommerceProductMutation();
	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const {title, name, images, featuredImageId } = watch();

	const addBookingsProperty = useAddShopBookingsPropertyMutation()
	const updateBookingsProperty = useBookingsPropertyUpdateMutation()

	function handleSaveApartment() {
		// console.log("BOOKING_PROP_DETAILS", getValues())
		// return
		updateBookingsProperty.mutate(getValues());
	}

	function handleCreateApartment() {
		console.log("BOOKING_PROP_DETAILS", getValues())

		return
		addBookingsProperty.mutate(getValues())
	}


	function handleRemoveListing() {
		console.log("Deleting BookingProperty_List-Values", getValues())
	
	}



	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/bookings/managed-listings"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Property Listings</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 && featuredImageId ? (
							<img
								className="w-32 sm:w-48 rounded"
								src={_.find(images, { id: featuredImageId })?.url}
								alt={title}
							/>
						) : (
							<img
								className="w-32 sm:w-48 rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={title}
							/>
						)}
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{title || 'New Property Listing'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Property Listings Detail
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{productId !== 'new' ? (
					<>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveListing}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
						>
							Remove
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={
								_.isEmpty(dirtyFields) 
								|| !isValid
							|| 
							updateBookingsProperty.isLoading
							}
							onClick={handleSaveApartment}
						>
							Save
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid  || addBookingsProperty.isLoading }
						onClick={handleSaveApartment}
					>
						Add Bookings|Property
					</Button>
				)}
			</motion.div>

			
		</div>

	);
}

export default BookingPropertyHeader;
