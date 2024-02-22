import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/ui/NavBar'
import Privacy from './pages/Privacy'
import Weather from './pages/Weather'
import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Weather" element={<Weather />} />
                    <Route path="/Privacy" element={<Privacy />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)