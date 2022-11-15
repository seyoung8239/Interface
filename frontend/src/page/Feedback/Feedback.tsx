import React, { useState } from 'react';

import Timeline from '@components/Timeline/Timeline';
import Video from '@components/Video/Video';

function Feedback() {
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [isFbClicked, setIsFbClicked] = useState(false);

	return (
		<div>
			<Timeline
				currentTime={currentTime}
				setCurrentTime={setCurrentTime}
				setIsFbClicked={setIsFbClicked}
			></Timeline>
			<Video
				currentTime={currentTime}
				setCurrentTime={setCurrentTime}
				isFbClicked={isFbClicked}
				setIsFbClicked={setIsFbClicked}
			></Video>
		</div>
	);
}

export default Feedback;
