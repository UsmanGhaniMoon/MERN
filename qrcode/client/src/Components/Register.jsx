import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet-async'

const Register = () => {

    const [userdt, setUserdt] = useState({
        uname: '',
        uemail: '',
        upass: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUserdt({
            ...userdt,
            [name]: value
        })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/reguser`, userdt)
            console.log(res.data)
        } catch (error) {
            console.log(error)  
        }
        
    }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <Helmet>
            <title>Register | JotPhone</title>
        </Helmet>
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className='text-2xl font-bold mb-4 text-center'>Registration</h2>

            <input type='text' name='uname' placeholder='Enter username' required className='w-full p-2 border rounded mb-3' onChange={handleInputChange} />

            <input type='email' name='uemail' placeholder='Enter Email' required className='w-full p-2 border rounded mb-3' onChange={handleInputChange} />

            <input type='password' name='upass' placeholder='Enter Password' required className='w-full p-2 border rounded mb-3' onChange={handleInputChange} />

            <button className='w-full bg-blue-400 text-white p-2 rounded font-bold hover:bg-blue-700' onClick={handleFormSubmit}>Register</button>

            <p className='text-center mt-3'>Already have an account? 
                <Link to={"/login"} className='text-blue-500 hover:underline'> Login</Link>
            </p>
        </div>
    </div>
  )
}

export default Register