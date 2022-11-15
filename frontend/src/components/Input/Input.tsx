import React, { Dispatch, SetStateAction, useState } from 'react';
import { FeedbackType } from '@myTypes/common';
import { useEffect } from 'react';

interface PropType {
	setFeedbackBoxes: Dispatch<SetStateAction<FeedbackType[]>>;
	currentTime: number;
}

function Input({ setFeedbackBoxes, currentTime }: PropType) {
	const [startTime, setStartTime] = useState(0);
	const [content, setContent] = useState('');
	const [isEmpty, setIsEmpty] = useState(false);

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const newFeedback: FeedbackType = {
			id: new Date().getTime() + '',
			startTime: Math.round(startTime),
			endTime: Math.round(currentTime),
			content: content,
		};
		console.log(newFeedback);
		setFeedbackBoxes((fbs) => fbs.concat(newFeedback));
		setContent('');
	};

	useEffect(() => {
		if (isEmpty && content.length === 1) {
			setStartTime(currentTime);
			setIsEmpty(false);
		}
		if (!content.length) setIsEmpty(true);
	}, [content]);

	return (
		<>
			<form onSubmit={(e) => handleSubmit(e)}>
				<input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
				<button type="submit">등록</button>
			</form>
		</>
	);
}

export default Input;
