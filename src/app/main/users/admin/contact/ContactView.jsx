import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useNavigate, useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';
// import { useGetContactsItemQuery, useGetContactsCountriesQuery, useGetContactsTagsQuery } from '../ContactsApi';
import { useGetAdminById } from 'src/app/aaqueryhooks/adminHandlingQuery';

/**
 * The contact view.
 */
function ContactView() {
	// const { data: countries } = useGetContactsCountriesQuery();
	// const { data: tags } = useGetContactsTagsQuery();

	const routeParams = useParams();
	const { id: contactId } = routeParams;
	// const {
	// 	data: contact,
	// 	isLoading,
	// 	isError
	// } = useGetContactsItemQuery(contactId, {
	// 	skip: !contactId
	// });
	// useGetAdminById

	const {
		data: admin,
		isLoading: adminLoading,
		isError: adminIsError
	} = useGetAdminById(contactId, {
		skip: !contactId
	});

	console.log('SINGLE ADMIN:', admin?.data);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	function getCountryByIso(iso) {
		return countries?.find((country) => country.iso === iso);
	}

	// if (isLoading) {
	// 	return <FuseLoading className="min-h-screen" />;
	// }
	if (adminLoading) {
		return <FuseLoading className="min-h-screen" />;
	}
	// adminIsError
	// 	if (isError) {
	// 		setTimeout(() => {
	// 			navigate('/users/admin');
	// 			dispatch(showMessage({ message: 'NOT FOUND' }));
	// 		}, 0);
	// 		return null;
	// 	}

	if (adminIsError) {
		setTimeout(() => {
			navigate('/users/admin');
			dispatch(showMessage({ message: 'NOT FOUND okay!' }));
		}, 0);
		return null;
	}

	// if (!contact) {
	// 	return null;
	// }
	if (!admin?.data) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{admin?.data?.avatar && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={admin?.data?.avatar}
						alt="user background"
					/>
				)}
			</Box>
			<div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
				<div className="w-full max-w-3xl">
					<div className="flex flex-auto items-end -mt-64">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary'
							}}
							className="w-128 h-128 text-64 font-bold"
							src={admin?.data?.avatar}
							alt={admin?.data?.name}
						>
							{admin?.data?.name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-4">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="edit"

								// component={NavLinkAdapter}
								// to={`/users/admin/${admin?.id}`}
								// to={`/users/admin/operate/${admin?.id}`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
								<span className="mx-8">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{admin?.data?.name}</Typography>

					<div className="flex flex-wrap items-center mt-8">
						{/* {contact?.tags?.map((id) => (
							<Chip
								key={id}
								label={_.find(tags, { id })?.title}
								className="mr-12 mb-12"
								size="small"
							/>
						))} */}
						<Chip
							// key={id}
							// label={_.find(tags, { id })?.title}
							label={admin?.data?.role}
							className="mr-12 mb-12"
							size="small"
						/>
					</div>

					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-32">
						{/* {contact.title && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{contact.title}</div>
							</div>
						)} */}

						{/* {contact.company && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
								<div className="ml-24 leading-6">{contact.company}</div>
							</div>
						)} */}

						{admin?.data?.email && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
								<div className="min-w-0 ml-24 space-y-4">
									{/* {contact.emails.map(
		(item) =>
			item.email !== '' && ( */}
									<div
										className="flex items-center leading-6"
										// key={item.email}
									>
										<a
											className="hover:underline text-primary-500"
											href={`mailto: ${admin?.data?.email}`}
											target="_blank"
											rel="noreferrer"
										>
											{admin?.data?.email}
										</a>
										{/* {item.label && (
						<Typography
							className="text-md truncate"
							color="text.secondary"
						>
							<span className="mx-8">&bull;</span>
							<span className="font-medium">{item.label}</span>
						</Typography>
					)} */}
									</div>
									{/* )
	)} */}
								</div>
							</div>
						)}

						{admin?.data?.phone_number && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
								<div className="min-w-0 ml-24 space-y-4">
									{/* {contact.phoneNumbers.map(
			(item, index) =>
				item.phoneNumber !== '' && ( */}
									<div
										className="flex items-center leading-6"
										// key={index}
									>
										<Box
											className="hidden sm:flex w-24 h-16 overflow-hidden"
											sx={{
												background:
													"url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
												backgroundSize: '24px 3876px'
												// backgroundPosition: getCountryByIso(item.country)
												// 	?.flagImagePos
											}}
										/>

										{/* <div className="sm:ml-12 font-mono">
							{getCountryByIso(item.country)?.code}
						</div> */}

										<div className="ml-10 font-mono">{admin?.data?.phone_number}</div>
									</div>
									{/* )
		)} */}
								</div>
							</div>
						)}

						{admin?.data?.address && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
								<div className="ml-24 leading-6">{admin?.data?.address}</div>
							</div>
						)}

						{/* {contact.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-24 leading-6">{format(new Date(contact.birthday), 'MMMM d, y')}</div>
							</div>
						)} */}

						{/* {contact.notes && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
								<div
									className="max-w-none ml-24 prose dark:prose-invert"
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{ __html: contact.notes }}
								/>
							</div>
						)} */}
					</div>
				</div>
			</div>
		</>
	);
}

export default ContactView;
