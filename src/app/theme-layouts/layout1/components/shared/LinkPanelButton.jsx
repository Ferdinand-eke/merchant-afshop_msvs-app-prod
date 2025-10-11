import Badge from '@mui/material/Badge';
import { Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * The notification panel toggle button.
 */
function LinkPanelButton(props) {
	
	return (
		<Button
			component={Link}
			to="/news-blog"
			className="min-h-40 min-w-40 p-0 md:px-8 md:py-6"
			
			size="small"
		>
			<Badge
				color="secondary"
				className="align-center h-10 w-40 mx-2"
			>
				Blog
			</Badge>
		  </Button>
	);
}

export default LinkPanelButton;
