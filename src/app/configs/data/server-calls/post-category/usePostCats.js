import { useQuery } from 'react-query';

import { getPostcats } from '../../client/clientToApiRoutes';

export default function usePostCats() {
	return useQuery(['postcategories'], getPostcats);
}
