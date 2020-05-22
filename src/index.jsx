import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from "react-redux"
import App from './components/Main'

import store from "./store"

const AppWithStore = () => (
    <Provider store={store}>
        <App/>
    </Provider>
)


window.onload = () => {
    const el = document.getElementById('root')
    ReactDOM.render(<AppWithStore/>, el)
}
