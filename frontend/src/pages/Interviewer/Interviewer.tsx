import React, { useEffect } from 'react';
import { PHASE_TYPE } from '@constants/phase.constant';
import useSafeNavigate from '@hooks/useSafeNavigate';
import usePreventLeave from '@hooks/usePreventLeave';
import { useRecoilValue } from 'recoil';
import { webRTCStreamSelector } from '@store/webRTC.atom';
import Video from '@components/@shared/Video/Video';
import { socket } from '../../service/socket';

const Interviewer = () => {
	const { safeNavigate } = useSafeNavigate();
	usePreventLeave();

	const streamList = useRecoilValue(webRTCStreamSelector);
	const hadleEndInterview = () => {
		socket.emit('end_interview', (res) => {
			console.log(res);
		});
	};

	useEffect(() => {
		socket.on('start_feedback', () => {
			safeNavigate(PHASE_TYPE.FEEDBACK_PHASE);
		});
	}, []);

	return (
		<>
			<div>Interviewer</div>
			{streamList.map((stream) => (
				<Video key={stream.id} src={stream} width={200} autoplay muted />
			))}
			<button onClick={hadleEndInterview}>면접 종료</button>
		</>
	);
};

export default Interviewer;
