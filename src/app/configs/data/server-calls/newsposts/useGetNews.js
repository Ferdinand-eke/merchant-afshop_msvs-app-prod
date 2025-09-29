import { useQuery } from 'react-query';
import { getNewsPost, getNewsPosts } from './newsposts';

export default function getPosts() {
	return useQuery(['posts'], getNewsPosts);
}

export const useGetSinglePost = (slug) => {
	return useQuery(['post', slug], () => getNewsPost(slug), {
		enabled: Boolean(slug)
		// staleTime: 5000,
	});
};
