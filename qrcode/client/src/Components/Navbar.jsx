import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import axios from 'axios'

const Navbar = () => {

    const [isOpen,setIsOpen] = useState(false)

    const navigate = useNavigate()

    const handleLogout = async()=>{
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/user/logoutuser`,
                {
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${token}`    
                    }
                }
            )
            localStorage.removeItem('token')
            navigate('/login')
            console.log(response)
        } catch (error) {
            console.log(error)
        }
        
    }
  return (
    <nav className='bg-gray-800 p-4 shadow-md '>
        <div className='container mx-auto flex justify-between items-center'>
            {/* Logo */}
            <Link to={"/dashboard"} className='text-white text-xl font-bold'>JotPhone</Link>

            {/* Desktop menu */}
            <ul className='hidden md:flex space-x-6 text-white'>
                <li>
                    <Link to={"/dashboard"} className='hover:text-gray-400'>Dashboard</Link>
                </li>
                <li>
                    <Link to={"/linkqr"} className='hover:text-gray-400'>Add QR</Link>
                </li>
                <li>
                    <Link to={"/showqr"} className='hover:text-gray-400'>List QR</Link>
                </li>
                <li>
                    <button className='hover:text-gray-400' onClick={handleLogout}>Logout</button>
                </li>
            </ul>
            
            {/* Mobile Menu Button */}
            <button className='text-white text-2xl md:hidden' onClick={()=>setIsOpen(!isOpen)}>
                {isOpen?<FaTimes/>:<FaBars/>}
            </button>
        </div>

        {/* Mobile Menu */ }
        {isOpen &&(
            <ul className='md:hidden bg-gray-800 text-white p-4 space-y-4 absolute left-0 w-full shadow-md'>
                <li>
                    <Link to={"/dashboard"} className='block py-2' onClick={()=>setIsOpen(false)}>Dashboard</Link>
                </li>
                <li>
                    <Link to={"/linkqr"} className='block py-2' onClick={()=>setIsOpen(false)}>Add QR</Link>
                </li>
                <li>
                    <Link to={"/showqr"} className='block py-2' onClick={()=>setIsOpen(false)}>List QR</Link>
                </li>
                <li>
                    <button className='block py-2' onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        )}
    </nav>
  )
}

export default Navbar