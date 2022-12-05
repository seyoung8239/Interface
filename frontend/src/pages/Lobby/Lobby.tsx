import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import useSafeNavigate from '@hooks/useSafeNavigate';
import usePreventLeave from '@hooks/usePreventLeave';
import useWebRTCSignaling from '@hooks/useWebRTCSignaling';

import { webRTCStreamSelector, webRTCUserListState } from '@store/webRTC.atom';
import { meInRoomState, othersInRoomState } from '@store/room.atom';

import Video from '@components/@shared/Video/Video';
import VideoGrid from '@components/@shared/VideoGrid/VideoGrid';
import BottomBar from '@components/BottomBar/BottomBar';

import { socket } from '../../service/socket';
import { socketEmit } from '@api/socket.api';
import { UserDTO } from '@customType/user';
import { css } from '@emotion/react';

import { ReactComponent as BroadcastIcon } from '@assets/icon/broadcast.svg';
import { iconBgStyle } from '@styles/commonStyle';
import { lobbyWrapperStyle, startInterviewBtnStyle } from './Lobby.style';

import { SOCKET_EVENT_TYPE } from '@constants/event.constant';
import { PAGE_TYPE } from '@constants/page.constant';

interface joinInterviewResponseType {
	usersInRoom: UserDTO[];
}

const Lobby = () => {
	const { safeNavigate } = useSafeNavigate();
	const [me, setMe] = useRecoilState<UserDTO>(meInRoomState);
	const [others, setOthers] = useRecoilState<UserDTO[]>(othersInRoomState);

	usePreventLeave();

	const [webRTCUserList, setWebRTCUserList] = useRecoilState(webRTCUserListState);
	const { startConnection } = useWebRTCSignaling(webRTCUserList, setWebRTCUserList);

	const streamList = useRecoilValue(webRTCStreamSelector);

	useEffect(() => {
		socket.on(SOCKET_EVENT_TYPE.JOIN_INTERVIEW, ({ user: interviewee }) => {
			const newOthers = others.map((user) => {
				return user.uuid === interviewee.uuid
					? { ...user, role: 'interviewee' }
					: { ...user, role: 'interviewer' };
			});

			setOthers(newOthers);
			setMe({ ...me, role: 'interviewer' });

			safeNavigate(PAGE_TYPE.INTERVIEWER_PAGE);
		});

		socket.on(SOCKET_EVENT_TYPE.ENTER_USER, ({ user }) => {
			setOthers((prevOthers) => [...prevOthers, user]);
		});

		socket.on(SOCKET_EVENT_TYPE.LEAVE_USER, ({ user }) => {
			setOthers((prevOhters) => prevOhters.filter((other) => other.uuid !== user.uuid));
		});

		return () => {
			socket.off(SOCKET_EVENT_TYPE.JOIN_INTERVIEW);
			socket.off(SOCKET_EVENT_TYPE.ENTER_USER);
			socket.off(SOCKET_EVENT_TYPE.LEAVE_USER);
		};
	}, [others]);

	useEffect(() => {
		if (!webRTCUserList.has(me.uuid)) startConnection(me.uuid);
	}, []);

	const handleStartInterviewee = async () => {
		await socketEmit<joinInterviewResponseType>(SOCKET_EVENT_TYPE.START_INTERVIEW);

		const newOthers = others.map((user) => {
			return { ...user, role: 'interviewer' };
		});

		setMe({ ...me, role: 'interviewee' });
		setOthers(newOthers);
		safeNavigate(PAGE_TYPE.INTERVIEWEE_PAGE);
	};

	const startInterviewBtn = (
		<button css={startInterviewBtnStyle} onClick={handleStartInterviewee}>
			<BroadcastIcon {...iconBgStyle} />
			<div>면접시작</div>
		</button>
	);

	return (
		<div css={lobbyWrapperStyle}>
			<div css={VideoAreaStyle}>
				<VideoGrid>
					{streamList.map(({ uuid, stream }) => (
						<Video key={uuid} src={stream} autoplay muted />
					))}
				</VideoGrid>
			</div>
			<BottomBar mainController={startInterviewBtn} />
		</div>
	);
};

export default Lobby;

const VideoAreaStyle = () => css`
	display: flex;
	justify-content: center;
	align-content: center;

	width: 100%;
	height: calc(100% - 72px);
`;