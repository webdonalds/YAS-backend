import { google } from 'googleapis';

import * as config from '../config/config.json';

const clientId: string = config.oauth2.web.client_id;
const clientSecret: string = config.oauth2.web.client_secret;
const redirectUri: string = config.oauth2.redirectUri;

class GoogleService {
    private getClient() {
        return new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );
    }

    async getTokens(code) {
        const client = this.getClient();
        const { tokens } = await client.getToken(code);
        return tokens;
    }

    async getUserInfo(accessToken) {
        const client = this.getClient();
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
        const client = this.getClient();
        client.setCredentials({
            refresh_token: refreshToken
        });
        const response = await client.getAccessToken();
        return response.token;
    }
}

const googleService = new GoogleService();

export default googleService;