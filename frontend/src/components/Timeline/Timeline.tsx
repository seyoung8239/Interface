import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

const initialTimeline = [
	{ id: '1', startTime: 1, endTime: 3, content: 'hello' },
	{ id: '2', startTime: 4, endTime: 6, content: 'hello' },
	{ id: '3', startTime: 9, endTime: 11, content: 'hello' },
	{ id: '4', startTime: 13, endTime: 14, content: 'hello' },
];
interface PropType {
	currentTime: number;
	setCurrentTime: Dispatch<SetStateAction<number>>;
	setIsFbClicked: Dispatch<SetStateAction<boolean>>;
}

function Timeline({ currentTime, setCurrentTime, setIsFbClicked }: PropType) {
	const [timeline, setTimeline] = useState(initialTimeline);

	const handleClickFeedbackBox = useCallback(
		(nextTime: number) => {
			setIsFbClicked(true);
			setCurrentTime(nextTime);
		},
		[setCurrentTime]
	);

	return (
		<div>
			{timeline.map(({ id, startTime, endTime, content }) => (
				<div
					key={id}
					style={{ display: 'flex' }}
					onClick={() => handleClickFeedbackBox(startTime)}
				>
					<div>{startTime}</div>
					<div>{endTime}</div>
					<div>{content}</div>
				</div>
			))}
		</div>
	);
}

export default Timeline;
