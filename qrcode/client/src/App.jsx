import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import { HelmetProvider } from 'react-helmet-async'
import ProtectedRoute from './ProtectedRoute'
import LinkQr from './Components/LinkQr'
import AllLinkQR from './Components/AllLinkQR'
import ForgetPass from './Components/ForgetPass'
import ResetPass from './Components/ResetPass'

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpass" element={<ForgetPass />} />
          <Route path="/reset-pass/:token" element={<ResetPass />} />

          <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/linkqr' element={<LinkQr />} />
            <Route path='/showqr' element={<AllLinkQR />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App