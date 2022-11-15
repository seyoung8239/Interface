import { FeedbackType } from '@myTypes/common';

export const lowerBoundFB = (list: Array<FeedbackType>, key: number) => {
	let mid;
	let start = 0;
	let end = list.length - 1;
	let result = end;

	while (start <= end) {
		mid = Math.floor((start + end) / 2);
		if (list[mid].startTime < key) {
			start = mid + 1;
			continue;
		}
		result = Math.min(result, mid);
		end = mid - 1;
	}

	return result;
};
