import axios from 'axios'
import { QRCodeCanvas } from 'qrcode.react'
import React, { useEffect, useRef, useState } from 'react'
import { ShowToast } from '../utilities/ShowToast'
import { Helmet } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AllLinkQR = () => {
    const [qrlinks, setQrlinks] = useState([])
    const [loading,setLoading] = useState(true)

    const navigate = useNavigate()
    

    const fetchQrLinks = async()=>{
        try {
           const utoken = localStorage.getItem('token')
           const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/user/getqrlinks`,
                {
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${utoken}`
                    }
                }
            )
            setQrlinks(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchQrLinks()
    },[])

    const editQr = async(qr)=>{
        navigate('/linkqr',{state:{qrData:qr}})
    }

    const deleteQr = async(qrid)=>{
        try {
            const utoken = localStorage.getItem('token')
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/user/deleteqr/${qrid}`, 
                {
                    headers:{
                        'Content-Type':'application/json',
                        Authorization:`Bearer ${utoken}`
                    }
                }
            )
            if(response.data.deletests === 0){
                ShowToast(response.data.msg, "success")
                setQrlinks(qrlinks.filter(qr => qr._id !== qrid))
            } else{
                ShowToast(response.data.msg, "error")
            }
        } catch (error) {
            ShowToast(error, "error")
        }
    }

    if(loading){
        <p>Loading QR Links</p>
    }
  return (
    <>
        <Helmet>
            <title>Show Link QR | JotPhone</title>
        </Helmet>
        <ToastContainer />
        <div className='max-w-4xl mx-auto mt-10'>
            <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>My QR Links</h2>
            <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className='py-3 px-6 text-left'>QR Links</th>
                        <th className='py-3 px-6 text-left'>QR Color</th>
                        <th className='py-3 px-6 text-left'>QR Status</th>
                        <th className='py-3 px-6 text-left' colSpan={2}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        qrlinks.map((qr, index)=>(
                            <tr key={index} className='border-b hover:bg-gray-100'>
                                <td className='py-3 px-6'>
                                    <QRCodeCanvas value={qr.qrlink} size={100} fgColor={qr.qrcolor} includeMargin={true} />
                                </td>
                                <td className='py-3 px-6'>{qr.qrcolor}</td>
                                <td className='py-3 px-6'>{qr.qr_status}</td>
                                <td className='py-3 px-6'>
                                    <button className='bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800' onClick={()=>editQr(qr)}>Edit</button>
                                </td>
                                <td className='py-3 px-6'>
                                    <button className='bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800' onClick={()=>deleteQr(qr._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
        </table>
        </div>
    </>
  )
}

export default AllLinkQR