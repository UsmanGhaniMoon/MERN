import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../CommonComponents/AdminNav'

const AdminHome = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    // const aid = localStorage.getItem('aid')
    // const aemail = localStorage.getItem('aemail')
    const aname = localStorage.getItem('aname')
    useEffect(()=>{
        if(token===null){
            navigate('/adminlogin')
        }
    })
    
  return (
    <div>
      <AdminNav />
      <p>Welcome {aname}</p>
    </div>
  )
}

export default AdminHome