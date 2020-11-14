import { google } from 'googleapis';

import * as config from '../config/config.json';

const clientId: string = config.oauth2.web.client_id;
const clientSecret: string = config.oauth2.web.client_secret;
const redirectUri: string = config.oauth2.redirectUri;



class GoogleService {
    oauth2Client;
    constructor(oauth2Client) {
        this.oauth2Client = oauth2Client;

    }

    async getTokens(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }

    async getUserInfo(accessToken) {
        this.oauth2Client.setCredentials({
            access_token: accessToken
        });

        const response = await google.oauth2('v2').userinfo.get({
            auth: this.oauth2Client
        });

        const userInfo = {
            email: response.data.email,
            id: response.data.id,
            verified: response.data.verified_email
        };

        return userInfo;
    }
}


const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
);


const googleService = new GoogleService(oauth2Client);

export default googleService;