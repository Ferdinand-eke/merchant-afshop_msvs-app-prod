import { useQuery } from 'react-query';
import { getTradehubs } from '../../client/clientToApiRoutes';

export default function useHubs() {
	return useQuery(['tradeHubs'], getTradehubs);
}
