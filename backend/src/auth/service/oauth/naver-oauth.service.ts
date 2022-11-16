import {
	AUTHORIZATION_TOKEN_TYPE,
	NAVER_ACCESS_TOKEN_URL,
	NAVER_AUTHORIZE_PAGE_URL,
	NAVER_PROFILE_API_URL,
	OAUTH_CALLBACK_URL,
	OAUTH_TYPE,
} from '@constant';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserSocialInfo } from 'src/types/auth.type';
import { OauthService } from './interface-oauth.service';

@Injectable()
export class OauthNaverService implements OauthService {
	private clientId = process.env.NAVER_CLIENT_ID;
	private clientSecret = process.env.NAVER_CLIENT_SECRET;
	private callbackUrl = [
		process.env.SERVER_ORIGIN_URL,
		OAUTH_CALLBACK_URL,
		OAUTH_TYPE.NAVER,
	].join('/');

	getSocialUrl(): string {
		const queryString = `&client_id=${this.clientId}&redirect_uri=${this.callbackUrl}`;
		return NAVER_AUTHORIZE_PAGE_URL + queryString;
	}

	async getAccessTokenByAuthorizationCode(authorizationCode: string): Promise<string> {
		if (!authorizationCode) throw new Error();

		const queryString =
			`&client_id=${this.clientId}&client_secret=${this.clientSecret}` +
			`&redirect_uri=${this.callbackUrl}&code=${authorizationCode}`;
		const headers = {
			'X-Naver-Client-Id': this.clientId,
			'X-Naver-Client-Secret': this.clientSecret,
		};

		const { access_token } = await axios
			.get(NAVER_ACCESS_TOKEN_URL + queryString, { headers })
			.then((res) => res.data);

		return access_token;
	}

	/**
	 * @link https://developers.naver.com/docs/login/profile/profile.md
	 * @param accessToken
	 * @returns userInfo
	 */
	async getSocialInfoByAccessToken(accessToken: string): Promise<UserSocialInfo> {
		const headers = { Authorization: `${AUTHORIZATION_TOKEN_TYPE} ${accessToken}` };
		const res = await axios.get(NAVER_PROFILE_API_URL, { headers }).then((res) => res.data);

		if (res.resultcode !== '00') {
			throw new Error(res.message);
		}

		return res.response;
	}
}
