import { google } from 'googleapis';
import { gmail } from 'googleapis/build/src/apis/gmail';

import * as config from '../config/config.json';

const clientId:string = config.oauth2.web.client_id;
const clientSecret:string = config.oauth2.web.client_secret;
const redirectUri:string = config.oauth2.redirectUri;
const tokenUri:string = config.oauth2.web.token_uri;

const scopes = config.oauth2.scopes;


class GoogleService{
    oauth2Client;
    constructor(oauth2Client){
        this.oauth2Client = oauth2Client;
        
    }

    // return OAuth2 code request url
    getAuthUrl(){
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
    }

    async getTokens(code) {
        const {tokens} = await this.oauth2Client.getToken(code);
        return tokens;
    }

    async getUserInfo(accessToken) {
        this.oauth2Client.setCredentials({
            access_token: accessToken
        });
        
        const response = await google.oauth2('v2').userinfo.get({
            auth: this.oauth2Client
        });

        return response.data;
    }
}


const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
);


const googleService = new GoogleService(oauth2Client);

export default googleService;