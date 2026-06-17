import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.PROD ? 'https://sigwe-palankara.onrender.com' : 'http://localhost:5000';

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
 <Provider store={store}>
 <BrowserRouter basename={import.meta.env.BASE_URL}>
 <App />
 </BrowserRouter>
 </Provider>
 </React.StrictMode>,
)
