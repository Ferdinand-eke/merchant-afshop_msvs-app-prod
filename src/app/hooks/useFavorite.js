// import { CLIENT_ENDPOINTS } from "@/config/dataService/data/clientEndpoints";
// import { useLikeCharizAProperty, useUnLikeCharizAProperty } from "@/config/dataService/data/server-calls/manage-properties";
// import { getAuthAdminCredentials } from "@/config/utils/authUtils";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { string } from "yup";




const useFavorite = ({
    listingId,
    currentUser 
}) => {

    const navigate = useNavigate()
    // const favoriteAList = useLikeCharizAProperty()
    // const unFavoriteAList = useUnLikeCharizAProperty()

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoritedListings || null;

        return list?.includes(listingId)
    },[currentUser, listingId])


    const toggleFavorite = useCallback(async(e) => {
        e.stopPropagation();
        if(!currentUser){
            return navigate('/home')
        }

        try {
            if(hasFavorited){
                //un-favorited this listing
                // unFavoriteAList.mutate(listingId)
                // navigate.refresh()
            }else{
                //favorite this listing
                // favoriteAList.mutate(listingId)
                // navigate.refresh()
            }

        } catch (error) {
            toast.error('something went wrong')
        }
        

    },[
        currentUser,
        hasFavorited,
        listingId,
        navigate,
        // getAuthAdminCredentials() 
    ])

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite