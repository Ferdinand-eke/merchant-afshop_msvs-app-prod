import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import usePostCats from 'app/configs/data/server-calls/post-category/usePostCats';

/**
 * The activity item?.
 */
function ActivityItem(props) {
	// const { item } = props;
	const { data: categories } = usePostCats();

	return (
		<>
			{categories?.data?.data?.map((item, index) => (
				<ListItem
					key={item?._id}
					className="px-0 space-x-12"
				>
					<ListItemText
						className="flex-1"
						primary={
							<div className="flex">
								<Typography
									className="font-normal whitespace-nowrap"
									color="secondary"
									paragraph={false}
								>
									{item?.name}
								</Typography>
							</div>
						}
						// secondary={item?.time}
					/>
				</ListItem>
			))}
		</>
	);
}

export default ActivityItem;
