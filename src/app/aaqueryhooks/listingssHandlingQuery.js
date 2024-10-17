
import { useMutation, useQuery, useQueryClient } from 'react-query';
import config from './configServerRoutes/homesServerConfig';
import { approvePropertyListing, disApprovePropertyListingEndpoint, getAllPropertyListings, getSinglePropertyListing,  } from './routestoserver';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
// import { resetForgotPassToken, setUserForgotPassCreedStorage } from './utils/opsUtils';



export default function useGetAllListings() {
  return useQuery(['__getAllProperties'], getAllPropertyListings)
}

/***Get Listing By Its ID */
export function useGetSingleListing(params) {
  return useQuery(
      ['__listById', params],
      () => getSinglePropertyListing(params),
      {
          enabled: Boolean(params),
          staleTime: 5000,
      }
  )
}



/***Approve Listing */
export function useApproveAProperty() {
  // const router = useRouter()
  // const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation(approvePropertyListing, {
      onSuccess: (data) => {
        // console.log("APPROVE-LISTING-PAYLOAD", data?.data)
          if (data?.data?.approvedListing) {
              toast.success('Listing Approved')
              queryClient.invalidateQueries("__listById")
              queryClient.refetchQueries()
              return
          } else if (data?.data?.error) {
            toast.error(data?.data?.error?.response && error?.response?.data?.message
                ? error?.response?.data?.message
                : error?.message)
              // toast.error(data?.data?.error?.message)
            //   console.log("In-BoundError:", data?.data?.error)
              return
          } else {
              toast.info('something unexpected happened')
              return
          }
      },
      onError: (error) => {
          const {
              response: { data },
          } = error ?? {}
   
          Array.isArray(data?.message)
              ? data?.message?.map((m) => toast.error(m))
              : toast.error(data?.message)

        //   Array.isArray(data?.message)
        //       ? data?.message?.map((m) => console.log(m))
        //       : console.log(data?.message)
      },
  })
}

/***Dis-Approve Listing */
export function useDisApproveAProperty() {
    // const router = useRouter()
    // const navigate = useNavigate()
    const queryClient = useQueryClient()
    return useMutation(disApprovePropertyListingEndpoint, {
        onSuccess: (data) => {
          // console.log("APPROVE-LISTING-PAYLOAD", data?.data)
            if (data?.data?.approvedListing) {
                toast.success('Listing Dis-Approved')
                queryClient.invalidateQueries("__listById")
                queryClient.refetchQueries()
                return
            } else if (data?.data?.error) {
              toast.error(data?.data?.error?.response && error?.response?.data?.message
                  ? error?.response?.data?.message
                  : error?.message)
                // toast.error(data?.data?.error?.message)
              //   console.log("In-BoundError:", data?.data?.error)
                return
            } else {
                toast.info('something unexpected happened')
                return
            }
        },
        onError: (error) => {
            const {
                response: { data },
            } = error ?? {}
     
            Array.isArray(data?.message)
                ? data?.message?.map((m) => toast.error(m))
                : toast.error(data?.message)
  
          //   Array.isArray(data?.message)
          //       ? data?.message?.map((m) => console.log(m))
          //       : console.log(data?.message)
        },
    })
  }


