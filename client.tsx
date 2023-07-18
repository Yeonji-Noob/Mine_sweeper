// exportDefault가 아니라면 * as로 써준다.
// tsconfig에서 "esModuleInterop": true 를 켜도 되지만 권장하지 않는다고 한다.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { hot } from 'react-hot-loader/root';

import MineSearch from './components/MineSearch';

// const Hot = hot(MineSearch); //HOC

ReactDOM.render(<MineSearch />, document.querySelector('#root'));