import React, { useRef, Dispatch, SetStateAction, useEffect } from 'react';

interface PropType {
	currentTime: number;
	setCurrentTime: Dispatch<SetStateAction<number>>;
	isFbClicked: boolean;
	setIsFbClicked: Dispatch<SetStateAction<boolean>>;
}

function Video({ currentTime, setCurrentTime, isFbClicked, setIsFbClicked }: PropType) {
	const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
	const aSec = 1000;

	useEffect(() => {
		const interverId = setInterval(() => {
			setCurrentTime(videoRef.current.currentTime);
		}, aSec);

		return () => clearInterval(interverId);
	}, [setCurrentTime]);

	useEffect(() => {
		if (isFbClicked) {
			videoRef.current.currentTime = currentTime;
			setIsFbClicked(false);
		}
	}, [currentTime]);

	return (
		<div>
			<video width="400px" src="test.mov" controls autoPlay ref={videoRef}></video>
		</div>
	);
}

export default Video;
