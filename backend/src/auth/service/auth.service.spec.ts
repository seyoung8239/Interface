import { USER_REPOSITORY_INTERFACE } from '@constant';
import { Test, TestingModule } from '@nestjs/testing';
import { UserInfo } from 'src/types/auth.type';
import { MockRepository } from 'src/types/mock.type';
import { JoinUserBuilder, UserEntity } from 'src/user/entities/typeorm-user.entity';
import { UserRepository } from 'src/user/repository/interface-user.repository';
import { AuthService } from './auth.service';
import { OauthGoogleService } from './oauth/google-oauth.service';
import { OauthNaverService } from './oauth/naver-oauth.service';

const mockUserRepository = () => ({
	saveUser: jest.fn(),
	findUserById: jest.fn(),
	findAllUser: jest.fn(),
});

describe('AuthService', () => {
	let authService: AuthService;
	let userRepository: MockRepository<UserRepository<UserEntity>>;
	let oauthGoogleService: OauthGoogleService;
	let oauthNaverService: OauthNaverService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: USER_REPOSITORY_INTERFACE,
					useValue: mockUserRepository(),
				},
				OauthGoogleService,
				OauthNaverService,
			],
		}).compile();

		authService = module.get(AuthService);
		userRepository = module.get(USER_REPOSITORY_INTERFACE);
		oauthNaverService = module.get(OauthNaverService);
		oauthGoogleService = module.get(OauthGoogleService);
	});

	it('의존성 주입 테스트', () => {
		expect(authService).toBeDefined();
		expect(userRepository).toBeDefined();
		expect(oauthNaverService).toBeDefined();
		expect(oauthGoogleService).toBeDefined();
	});

	it('유저의 OAuth로 시작 테스트', async () => {
		const user = makeMockUser({ id: 'testId', oauthType: 'naver' } as UserInfo);

		jest.spyOn(oauthNaverService, 'getAccessTokenByAuthorizationCode').mockResolvedValue(
			'success'
		);
		jest.spyOn(oauthNaverService, 'getSocialInfoByAccessToken').mockResolvedValue(user);
		jest.spyOn(userRepository, 'saveUser').mockResolvedValue(user);

		const joinedUser = await authService.socialStart({
			type: 'naver',
			authorizationCode: 'test',
		});

		expect(user).toEqual(joinedUser);
	});

	it('유저의 OAuth 승인 취소 테스트', async () => {
		try {
			await authService.socialStart({ type: 'naver', authorizationCode: undefined });
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err.message).toBe('social 인증이 되지 않았습니다.');
		}
	});

	it('옳바른 OAuth타입이 아닐 때의 오류 테스트', async () => {
		try {
			await authService.socialStart({ type: 'invalid', authorizationCode: 'authCode' });
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err.message).toBe('');
		}
	});

	const makeMockUser = (userInfo: UserInfo): UserEntity => {
		const { id, email, password, nickname, oauthType } = userInfo;
		const userEntity = new JoinUserBuilder()
			.setId(id)
			.setEmail(email)
			.setPassword(password)
			.setNickname(nickname)
			.setOauthType(oauthType)
			.setDefaultValue()
			.build();
		return userEntity;
	};
});
