import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './root/App';
import { Provider } from 'react-redux';
import getStore from './store/store';

const store = getStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root'));