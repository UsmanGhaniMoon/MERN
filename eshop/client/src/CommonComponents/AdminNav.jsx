import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ErrorMessage from '../CommonComponents/ErrorMessage'

const AdminNav = () => {

    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    // const aid = localStorage.getItem('aid')
    // const aemail = localStorage.getItem('aemail')
    const aname = localStorage.getItem('aname')
    const [showToast, setShowToast] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')

    const [tokendt, setTokendt] = useState({
        token,
    })
    const logout = async(e)=>{
        const res = await axios.post("http://127.0.0.1:5000/api/admin/logout", tokendt)
        if(res.data.logoutsts===0){
            localStorage.removeItem('token')
            localStorage.removeItem('aid')
            localStorage.removeItem('aemail')
            localStorage.removeItem('aname')
            navigate('/adminlogin')
        } else {
            setShowToast(true)
            setMsg(res.data.msg)
            setType("error")
            setTimeout(()=>{
                setShowToast(false)
            }, 3000) 
        }
    }
  return (
    <>
        <ErrorMessage showToast={showToast} msg={msg} type={type} />
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Admin e-shop</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/adminhome">Home</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Product</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/admincategory">Add Category</a></li>
                                <li><a className="dropdown-item" href="/addProduct">Add Products</a></li>
                                <li><a className="dropdown-item" href="/viewProducts">View Products</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">{aname}</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Edit Profile</a></li>
                                <li><a className="dropdown-item" href="/adminchangepass">Change Password</a></li>
                                <li><a className="dropdown-item" href="#" onClick={logout}>Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
    
  )
}

export default AdminNav