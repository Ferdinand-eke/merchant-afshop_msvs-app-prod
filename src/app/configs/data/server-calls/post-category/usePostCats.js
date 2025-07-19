import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router';
import { getPostcats } from '../../client/clientToApiRoutes';

export default function usePostCats() {
  return useQuery(['postcategories'], getPostcats);
}
