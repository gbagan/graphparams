import React from 'react';
import ReactDOM from 'react-dom';
import '@/antd/antd.min.css';
import App from './App';

window.onload = () => {
    const el = document.getElementById('root');
    ReactDOM.render(<App/>, el);
};
