import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';

import IntervieweeVideo from '@components/IntervieweeVideo/IntervieweeVideo';
import FeedbackArea from '@components/FeedbackArea/FeedbackArea';
import BottomBar from '@components/BottomBar/BottomBar';
import RoundButton from '@components/@shared/RoundButton/RoundButton';
import usePreventLeave from '@hooks/usePreventLeave';
import useSafeNavigate from '@hooks/useSafeNavigate';
import { feedbackDtoSelector, isFbSyncState } from '@store/feedback.store';
import { completedFbCntState, docsUUIDState, meInRoomState } from '@store/room.store';

import { ReactComponent as LinkIcon } from '@assets/icon/link.svg';
import { socket } from '../../service/socket';
import { feedbackWrapperStyle, feedbackPageContainerStyle } from './Feedback.style';
import { PAGE_TYPE } from '@constants/page.constant';
import theme from '@styles/theme';
import { iconBgStyle } from '@styles/commonStyle';
import { socketEmit } from '@api/socket.api';
import { SOCKET_EVENT_TYPE } from '@constants/socket.constant';
import { FeedbackDtoType } from '@customType/dto';
import { REST_TYPE } from '@constants/rest.constant';

const Feedback = () => {
	usePreventLeave();
	const setCompletedFbCnt = useSetRecoilState(completedFbCntState);
	const { safeNavigate } = useSafeNavigate();
	const [isFbSync, setIsFbSync] = useRecoilState(isFbSyncState);
	const [videoUrl, setVideoUrl] = useState('');
	const docsUUID = useRecoilValue(docsUUIDState);
	const feedbackList = useRecoilValue(feedbackDtoSelector);
	const me = useRecoilValue(meInRoomState);

	const handleEndFeedback = useCallback(() => {
		socketEmit(SOCKET_EVENT_TYPE.END_FEEDBACK, ({ data }) => {
			const { isLastFeedback, count } = data;
			setCompletedFbCnt(count);
			const feedbackDTO: FeedbackDtoType = {
				docsUUID,
				userUUID: me.uuid,
				feedbackList,
			};
			axios.post(REST_TYPE.FEEDBACK, feedbackDTO);

			if (!isLastFeedback) safeNavigate(PAGE_TYPE.LOBBY_PAGE);
			else safeNavigate(PAGE_TYPE.WAITTING_PAGE);
		});
	}, [docsUUID, feedbackList]);

	useEffect(() => {
		socket.on(SOCKET_EVENT_TYPE.DOWNLOAD_VIDEO, ({ videoUrl }) => {
			setVideoUrl(videoUrl);
		});
	}, []);

	useEffect(() => {
		console.log(videoUrl);
	}, [videoUrl]);

	const finishFeedbackBtn = (
		<RoundButton
			style={{
				backgroundColor: theme.colors.primary,
				width: 200,
				height: 50,
				color: theme.colors.white,
			}}
			onClick={handleEndFeedback}
		>
			<div>피드백 종료</div>
		</RoundButton>
	);

	return (
		<div css={feedbackWrapperStyle}>
			<div css={feedbackPageContainerStyle}>
				<IntervieweeVideo src={videoUrl} width={400} autoplay muted controls />
				<button
					style={{
						backgroundColor: isFbSync ? theme.colors.primary : theme.colors.white,
						width: 50,
						height: 50,
						borderRadius: '25px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onClick={() => setIsFbSync((current) => !current)}
				>
					<LinkIcon
						{...iconBgStyle}
						fill={isFbSync ? theme.colors.white : theme.colors.primary}
					/>
				</button>
				<FeedbackArea />
			</div>
			<BottomBar mainController={finishFeedbackBtn} />
		</div>
	);
};

export default Feedback;
