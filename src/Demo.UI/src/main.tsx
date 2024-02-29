import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './assets/css/layout.css'
import AppRoutes from './components/ui/AppRoutes'
import NavBar from './components/ui/NavBar'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <NavBar />
                <AppRoutes />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)