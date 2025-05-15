import React from 'react'
import {jwtDecode} from 'jwt-decode'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar'

const ProtectedRoute = ()=>{
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to='/login'/>
    }

    try {
        const decodeToken = jwtDecode(token)
        const currentTime = Math.floor(Date.now()/1000)
        if (decodeToken.exp < currentTime) {
            localStorage.removeItem('token')
            return <Navigate to='/login'/>
        } else {
            return (
                <>
                    <Navbar />
                    <Outlet />
                </>
            )
        }
    } catch (error) {
        console.log(error)
        localStorage.removeItem('token') 
        return <Navigate to='/login'/>
    }
}


export default ProtectedRoute