import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Input from '@components/Input/Input';
import { lowerBoundFB } from '../../utils/utils';
import { FeedbackType } from '@myTypes/common';

const initialTimeline = [
	{ id: '1', startTime: 1, endTime: 2, content: 'hello' },
	{ id: '2', startTime: 2, endTime: 3, content: 'hello' },
	{ id: '3', startTime: 3, endTime: 4, content: 'hello' },
	{ id: '4', startTime: 5, endTime: 6, content: 'hello' },
	{ id: '5', startTime: 6, endTime: 7, content: 'hello' },
	{ id: '6', startTime: 8, endTime: 9, content: 'hello' },
	{ id: '7', startTime: 10, endTime: 11, content: 'hello' },
	{ id: '8', startTime: 11, endTime: 12, content: 'hello' },
	{ id: '9', startTime: 13, endTime: 14, content: 'hello' },
];
interface PropType {
	currentTime: number;
	setCurrentTime: Dispatch<SetStateAction<number>>;
	setIsFbClicked: Dispatch<SetStateAction<boolean>>;
}

const timeLineSize = 4;
const firstIndex = 0;
const prevFbNum = 1;
const nextFbNum = 2;

function Timeline({ currentTime, setCurrentTime, setIsFbClicked }: PropType) {
	const [feedbackBoxes, setFeedbackBoxes] = useState<FeedbackType[]>(initialTimeline);
	const [timeline, setTimeline] = useState<FeedbackType[]>([]);

	const handleClickFeedbackBox = useCallback(
		(nextTime: number) => {
			setIsFbClicked(true);
			setCurrentTime(nextTime);
		},
		[setCurrentTime]
	);

	useEffect(() => {
		const orderedFbs = feedbackBoxes.sort(fbCmp);
		const fbsLen = orderedFbs.length;
		(function () {
			if (fbsLen <= timeLineSize) {
				setTimeline(orderedFbs);
				return;
			}

			const curFbIdx = lowerBoundFB(orderedFbs, currentTime);
			const lowIdxBound = firstIndex + prevFbNum;
			const hightIdxBound = fbsLen - 1 - nextFbNum;
			const leftOffset = curFbIdx < lowIdxBound ? lowIdxBound - curFbIdx : 0;
			const rightOffset = curFbIdx > hightIdxBound ? curFbIdx - hightIdxBound : 0;

			const newTimeline = orderedFbs.slice(
				curFbIdx - prevFbNum - rightOffset,
				curFbIdx + nextFbNum + leftOffset + 1
			);
			setTimeline(newTimeline);
		})();
	}, [currentTime, feedbackBoxes]);

	const fbCmp = (a: FeedbackType, b: FeedbackType) => {
		return a.startTime - b.startTime;
	};

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
			<Input setFeedbackBoxes={setFeedbackBoxes} currentTime={currentTime}></Input>
		</div>
	);
}

export default Timeline;
