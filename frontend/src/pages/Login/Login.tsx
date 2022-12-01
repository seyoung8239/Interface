import React from 'react';

import { ReactComponent as InterfacePreview } from '@assets/icon/interface_preview.svg';
import { ReactComponent as InterfaceDescript } from '@assets/icon/interface_descript.svg';
import { ReactComponent as NaverOauthBtn } from '@assets/icon/naver_oauth.svg';
import { ReactComponent as KakaoOauthBtn } from '@assets/icon/kakao_oauth.svg';
import { css } from '@emotion/react';
import axios from 'axios';

enum OAUTH_TYPE {
	NAVER = 'naver',
	KAKAO = 'kakao',
}

const Login = () => {
	const startOauth = async (type: string) => {
		// TODO 응답, 처리 hook으로 빼기
		const res = await axios
			.get(`/api/auth/oauth/redirect/${type}`)
			.then((res) => res.data)
			.catch((err) => err.response);

		location.href = res.data.url;
	};

	return (
		<>
			<div css={LoginContainer}>
				<InterfacePreview css={{ width: '800px', height: '440px' }} />
				<div css={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
					<InterfaceDescript css={{ width: '500px', height: '160px' }} />
					<div css={{ display: 'flex', flexDirection: 'column' }}>
						<NaverOauthBtn
							css={OauthButton}
							onClick={() => startOauth(OAUTH_TYPE.NAVER)}
						/>
						<KakaoOauthBtn
							css={OauthButton}
							onClick={() => startOauth(OAUTH_TYPE.KAKAO)}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

const LoginContainer = css`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #030d45;
	gap: 64px;
	color: white;
`;

const OauthButton = css`
	width: 300px;
	height: 80px;
	margin-left: 32px;
	&:hover {
		cursor: pointer;
	}
`;

export default Login;
