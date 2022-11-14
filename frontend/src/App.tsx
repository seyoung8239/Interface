import React from 'react';
import { Global, ThemeProvider } from '@emotion/react';
import globalStyle from './styles/globalStyle';
import theme from './styles/theme';

import Test from '@components/Test/Test';
import Feedback from './page/Feedback/Feedback';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Global styles={globalStyle} />
				<Test text={'test'} />
				<Feedback></Feedback>
			</div>
		</ThemeProvider>
	);
}

export default App;
