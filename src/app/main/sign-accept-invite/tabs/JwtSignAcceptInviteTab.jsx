// import JwtSignInForm from '../../../auth/services/jwt/components/JwtSignInForm';
import JwtSignAcceptInviteForm from 'src/app/auth/services/jwt/components/JwtSignAcceptInviteForm';

function jwtSignInTab() {
	return (
		<div className="w-full">
			<JwtSignAcceptInviteForm />

			{/* <div className="mt-32 flex items-center">
				<div className="mt-px flex-auto border-t" />
				<Typography
					className="mx-8"
					color="text.secondary"
				>
					Or continue with
				</Typography>
				<div className="mt-px flex-auto border-t" />
			</div> */}

			{/* <div className="mt-32 flex items-center space-x-16">
				<Button
					variant="outlined"
					className="flex-auto"
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:facebook
					</FuseSvgIcon>
				</Button>
				<Button
					variant="outlined"
					className="flex-auto"
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:twitter
					</FuseSvgIcon>
				</Button>
				<Button
					variant="outlined"
					className="flex-auto"
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:github
					</FuseSvgIcon>
				</Button>
			</div> */}
		</div>
	);
}

export default jwtSignInTab;
