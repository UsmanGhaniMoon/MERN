import React, { useState } from 'react'
import ErrorMessage from '../CommonComponents/ErrorMessage'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    
    const [showToast, setShowToast] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const navigate = useNavigate()
    
    const [logindt, setLogindt] = useState({
        admin_email:'',
        admin_pass:'',
    })

    const handleInputChange = (e)=>{
        const {name, value} = e.target
        setLogindt({
            ...logindt,
            [name]:value,
        })
    }
    const handleLogin = async(e)=>{
        e.preventDefault()

        try{
            const res = await axios.post(process.env.REACT_APP_ADMIN_LOGIN, logindt)
            if(res.data.status===0){
                localStorage.setItem('aid', res.data.aid)
                localStorage.setItem('aemail', res.data.aemail)
                localStorage.setItem('aname', res.data.aname)
                localStorage.setItem('token', res.data.token)
                navigate('/adminhome')
            } else {
                setShowToast(true)
                setMsg(res.data.message)
                setType("error")
                setTimeout(()=>{
                    setShowToast(false)
                }, 3000) 
            }
        } catch(error){
            console.error(error)
        }
  
    }
    
  return (
    <div>
        <ErrorMessage showToast={showToast} msg={msg} type={type} />
        <div className='container'>
            <div className='row justify-content-center mt-5'>
                <div className='col-md-4 col-sm-4 align-self-center'>
                    <div className='card'>
                        <div className='card-header bg-success text-white text-center'>
                            <h5>Admin Login</h5>
                        </div>
                        <div className='card-body'>
                            <div class='mb-3'>
                                <label for="admin_email" class='form-label'>Admin Email</label>
                                <input type='email' class='form-control' id='admin_email' name='admin_email' placeholder='Enter Email' onChange={handleInputChange}/>
                            </div>

                            <div class='mb-3'>
                                <label for="admin_pass" class='form-label'>Admin Password</label>
                                <input type='password' class='form-control' id='admin_pass' name='admin_pass' placeholder='Enter Password' onChange={handleInputChange}/>
                            </div>
                            
                            <div class="mb-3 text-center">
                                Forget password!! <a href='/adminforgetpass'>Click Here</a>
                            </div>
                            
                            <div class='mb-3'>
                                <input type='button' class='form-control btn btn-success'  name='admin_login' value={"Login"} onClick={handleLogin}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminLogin