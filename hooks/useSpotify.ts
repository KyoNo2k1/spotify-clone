import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { spotifyApi } from "../config/spotify";
import { TokenError } from "../types"
import { ExtendedSession } from './../types/index';

const useSpotify = () => {
    const {data: session} = useSession()

    useEffect(() => {
        if(!session) return

        //refresh token failed session will have error, redirect login
        if((session as ExtendedSession).error === TokenError.RefreshAccessTokenError){
            signIn()
        }
        spotifyApi.setAccessToken((session as ExtendedSession).accessToken)
    }, [session])
    return spotifyApi
}

export default useSpotify