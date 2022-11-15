declare module '*.svg' {
	import React = require('react');

	export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}

export interface FeedbackType {
	id: string;
	startTime: number;
	endTime: number;
	content: string;
}
