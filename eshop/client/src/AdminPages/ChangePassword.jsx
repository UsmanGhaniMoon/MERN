import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminNav from '../CommonComponents/AdminNav'
import ErrorMessage from '../CommonComponents/ErrorMessage'


const ChangePassword = () => {

    const navigate = useNavigate()
    const [showToast, setShowToast] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')

    const token = localStorage.getItem('token')
    //const aid = localStorage.getItem('aid')
    const aemail = localStorage.getItem('aemail')
    //const aname = localStorage.getItem('aname')

    const [cpassdt, setCpassdt] = useState({
        admin_email:aemail,
        old_pass:'',
        admin_pass:'',
    })

    const handleInputChange = (e) =>{
        const { name, value } = e.target
        setCpassdt({
            ...cpassdt,
            [name]:value,
        })
    }

    const handleSubmit = async(e)=>{
        try{
            const res = await axios.post("http://127.0.0.1:5000/api/admin/updatepass", cpassdt)

            setShowToast(true)
            setMsg(res.data.msg)
            if(res.data.chpasssts===0){
                setType("success")
            } else {
                setType("error")
            }
            setTimeout(()=>{
                setShowToast(false)
            }, 3000) 
        } catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        if(token===null){
            navigate('/adminlogin')
        }
    })

  return (
    <div>
        <AdminNav/>
        <ErrorMessage showToast={showToast} msg={msg} type={type} />
        <div className='container'>
            <div className='row justify-content-center mt-5'>
                <div className='col-md-4 col-sm-4 align-self-center'>
                    <div className='card'>
                        <div className='card-header bg-success text-white text-center'>
                            <h5>Change Password of {aemail}</h5>
                        </div>
                        <div className='card-body'>
                            <div className='mb-3'>
                                <label for="old_pass" className='form-label'>Old Password</label>
                                <input type='password' className='form-control' id='old_pass' name='old_pass' placeholder='Enter old password' onChange={handleInputChange} />
                            </div>

                            <div className='mb-3'>
                                <label for="admin_pass" className='form-label'>Admin Password</label>
                                <input type='password' className='form-control' id='admin_pass' name='admin_pass' placeholder='Enter new Password' onChange={handleInputChange} />
                            </div>

                            <div className='mb-3'>
                                <input type='button' className='form-control btn btn-success'  name='admin_cpass' value={"Change Password"} onClick={handleSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChangePassword