import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { ShowToast } from '../utilities/ShowToast';

const ForgetPass = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleForgetButton = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/forgetpass`, { email });
            console.log(response.data);
            if (response.data.sts==0) {
              ShowToast(response.data?.msg, "success")
            } else{
              ShowToast(response.data?.msg, "error")
            }
        } catch (error) {
            ShowToast(error.response?.data?.message, "error")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Helmet>
                <title>Forget Password | JotPhone</title>
            </Helmet>
            <ToastContainer />
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className='text-2xl font-bold mb-4 text-center'>Forget Password!!</h2>
                
                <input 
                    type='email' 
                    name='uemail' 
                    placeholder='Enter Email' 
                    required 
                    className='w-full p-2 border rounded mb-3' 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                
                <button 
                    className='w-full bg-blue-800 text-white p-2 rounded font-bold hover:bg-blue-600 uppercase'
                    onClick={handleForgetButton}
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Reset Now"}
                </button>

                <p className='text-center mt-3'>
                    Don't have an account? 
                    <Link to={"/register"} className='text-blue-500 hover:underline'> Register</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgetPass;