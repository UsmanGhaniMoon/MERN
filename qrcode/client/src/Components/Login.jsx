import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify' 

const Login = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const [error, setError] = useState()
  const msg = ()=>{
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      });
  }

  const [userdt,setUserdt] = useState({
    uemail: '',
    upass:''
  })

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setUserdt({
      ...userdt,
      [name]: value
    })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const logindt = await axios.post(`${backendUrl}api/user/loginuser`, userdt)
      if (logindt.data.loginsts === 0) {
        localStorage.setItem("token", logindt.data.token)
        navigate('/dashboard')
      } else {
        setError(logindt.data.msg) 
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(error){
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  },[error])
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Helmet>
        <title>Login | JotPhone</title>
      </Helmet>
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
          <input type='email' name='uemail' placeholder='Enter Email' required className='w-full p-2 border rounded mb-3' onChange={handleInputChange} />

          <input type='password' name='upass' placeholder='Enter Password' required className='w-full p-2 border rounded mb-3' onChange={handleInputChange} />

          <button className='w-full bg-green-800 text-white p-2 rounded font-bold hover:bg-green-600' onClick={handleFormSubmit}>Login</button>

          <p className='text-center mt-3'>Don't have an account? 
            <Link to={"/register"} className='text-blue-500 hover:underline'> Register</Link>
          </p>

          <p className='text-center mt-3'>Forget Password!! 
            <Link to={"/forgetpass"} className='text-blue-500 hover:underline'>Click Here</Link>
          </p>
          
      </div>
    </div>
  )
}

export default Login