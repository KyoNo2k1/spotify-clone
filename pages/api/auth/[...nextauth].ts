import { CallbacksOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SpotifyProvider from 'next-auth/providers/spotify';
import { scopes, spotifyApi } from "../../../config/spotify";
import { ExtendedToken, TokenError } from '../../../types';
import { ExtendedSession } from './../../../types/index';

const refreshAccessToken = async (
	token: ExtendedToken
): Promise<ExtendedToken> => {
	try {
		spotifyApi.setAccessToken(token.accessToken)
		spotifyApi.setRefreshToken(token.refreshToken)

		// "Hey Spotify, please refresh my access token"
		const { body: refreshedTokens } = await spotifyApi.refreshAccessToken()

		console.log('REFRESHED TOKENS ARE: ', refreshedTokens)

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			refreshToken: refreshedTokens.refresh_token || token.refreshToken,
			accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000
		}
	} catch (error) {
		console.error(error)

		return {
			...token,
			error: TokenError.RefreshAccessTokenError
		}
	}
}

const jwtCallback: CallbacksOptions['jwt'] = async ({
	token,
	account,
	user
}) => {
	let extendedToken: ExtendedToken

	// User logs in for the first time
	if (account && user) {
		extendedToken = {
			...token,
			user,
			accessToken: account.access_token as string,
			refreshToken: account.refresh_token as string,
			accessTokenExpireAt: (account.expires_at as number) * 1000 // converted to ms
		}

		console.log('FIRST TIME LOGIN, EXTENDED TOKEN: ', extendedToken)
		return extendedToken
	}

	// Subsequent requests to check auth sessions
	if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpireAt) {
		console.log('ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN: ', token)
		return token
	}

	// Access token has expired, refresh it
	console.log('ACCESS TOKEN EXPIRED, REFRESHING...')
	return await refreshAccessToken(token as ExtendedToken)
}
//calll after jwt callback token -> extended token
const sessionCallback: CallbacksOptions['session'] = async ({
	session,
	token
}) => {
	(session as ExtendedSession).accessToken = (token as ExtendedToken).accessToken as string;
	(session as ExtendedSession).error = (token as ExtendedToken).error

	return session
}

export default NextAuth({
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			authorization: {
				url: 'https://accounts.spotify.com/authorize',
				params: {
					scope: scopes
				}
			}
		})
	],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		jwt: jwtCallback,
		session: sessionCallback
	}
})