import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ShowToast } from '../utilities/ShowToast';

const ResetPass = () => {
    const {token} = useParams();
    const [password, setPassword] = useState("")

    const handleResetPass = async(e)=>{
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/reset-pass/${token}`,{password})

            if (response.data.reststs==0) {
                ShowToast(response.data?.msg, "success")
            } else{
                ShowToast(response.data?.msg, "error")
            }
        } catch (error) {
            console.log(error);
            ShowToast(error.response?.data?.message, "error")
        }
    }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <Helmet>
            <title>Reset Password | JotPhone</title>
        </Helmet>
        <ToastContainer />
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className='text-2xl font-bold mb-4 text-center'>Set New Password Now!!</h2>
            
            <input 
                type='password' 
                name='password' 
                placeholder='Enter New Password' 
                required 
                className='w-full p-2 border rounded mb-3' 
                onChange={(e)=>setPassword(e.target.value)}
            />
            
            <button 
                className='w-full bg-blue-800 text-white p-2 rounded font-bold hover:bg-blue-600 uppercase'
                onClick={handleResetPass}
            >
                Reset Now
            </button>
        </div>
    </div>
  )
}

export default ResetPass