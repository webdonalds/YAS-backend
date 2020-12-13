import { google, youtube_v3 } from 'googleapis';

import * as config from '../config/config.json';

const clientId: string = config.oauth2.web.client_id;
const clientSecret: string = config.oauth2.web.client_secret;
const redirectUri: string = config.oauth2.redirectUri;
const apiKey: string = config.oauth2.apiKey;

class GoogleService {
    private getAuthClient() {
        return new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );
    }

    private getYoutubeClient() {
        const client = google.youtube({
            version: 'v3',
            auth: apiKey,
        });
        return client;
    }

    async getTokens(code) {
        const client = this.getAuthClient();
        const { tokens } = await client.getToken(code);
        return tokens;
    }

    async getUserInfo(accessToken) {
        const client = this.getAuthClient();
        client.setCredentials({
            access_token: accessToken
        });

        const response = await google.oauth2('v2').userinfo.get({
            auth: client
        });

        const userInfo = {
            email: response.data.email,
            id: response.data.id,
            verified: response.data.verified_email
        };

        return userInfo;
    }

    async getAccessToken(refreshToken: string): Promise<string> {
        const client = this.getAuthClient();
        client.setCredentials({
            refresh_token: refreshToken
        });
        const response = await client.getAccessToken();
        return response.token;
    }

    async getMyPlaylist(accessToken: string, pageToken: string): Promise<youtube_v3.Schema$PlaylistListResponse> {
        const authClient = this.getAuthClient();
        authClient.setCredentials({
            access_token: accessToken
        });
        const googleClient = this.getYoutubeClient();
        const response = await googleClient.playlists.list({
            auth: authClient,
            part: ['snippet'],
            mine: true,
            pageToken: pageToken,
        });
        return response.data;
    }

    async getPlaylistItems(accessToken: string, id: string, pageToken:string): Promise<youtube_v3.Schema$PlaylistItemListResponse> {
        const authClient = this.getAuthClient();
        authClient.setCredentials({
            access_token: accessToken
        });
        const googleClient = this.getYoutubeClient();
        const response = await googleClient.playlistItems.list({
            auth: authClient,
            part: ['snippet'],
            playlistId: id,
            pageToken: pageToken,
        });
        return response.data;
    }

    async getLikeVideos(accessToken: string, pageToken: string) {
        const authClient = this.getAuthClient();
        authClient.setCredentials({
            access_token: accessToken
        });
        const googleClient = this.getYoutubeClient();
        const response = await googleClient.videos.list({
            auth: authClient,
            part: ['snippet'],
            myRating: 'like',
            pageToken: pageToken,
        });
        return response.data;
    }

    async search(keyword: string, pageToken: string) {
        const googleClient = this.getYoutubeClient();
        const response = await googleClient.search.list({
            part: ['snippet'],
            q: keyword,
            pageToken: pageToken,
        });
        return response.data;
    }
}

const googleService = new GoogleService();

export default googleService;