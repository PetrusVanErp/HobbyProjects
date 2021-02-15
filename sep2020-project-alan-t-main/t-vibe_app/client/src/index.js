import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import allReducers from './reducers';
import { openWebSocket } from './websockets/serverCommunication';

let ws = openWebSocket()
  ws.onerror = () => console.log('WebSocket error')
  ws.onopen = () => console.log('WebSocket connection established')
  ws.onclose = () => console.log('WebSocket connection closed')       
   
  const store = createStore(allReducers)
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
