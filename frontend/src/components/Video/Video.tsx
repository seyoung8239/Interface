import React, { useRef } from 'react';

function Video() {
	const videoRef = useRef();
	return (
		<div>
			<video width="400px" src="test.mov" controls autoPlay ref={videoRef}></video>
		</div>
	);
}

export default Video;
