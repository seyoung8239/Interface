import React, { Dispatch, SetStateAction } from 'react';
import { FeedbackType } from '@types/common';

interface PropType {
	setFeedbackBoxes: Dispatch<SetStateAction<FeedbackType[]>>;
}

function Input({ setFeedbackBoxes }: PropType) {
	return (
		<>
			<form>
				<input type="text" />
				<button>등록</button>
			</form>
		</>
	);
}

export default Input;
