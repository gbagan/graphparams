/* eslint-disable import/first */

import './App.css';
import * as React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import reducer from './redux/reducers';
import MainView from './components/Main'


const store = createStore(reducer);

const App: React.SFC<{}> = () => (
    <Provider store={store as any}>
        <MainView />
    </Provider>
)

export default App;