import React, { useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { QRCodeCanvas } from 'qrcode.react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const LinkQr = () => {

    const location = useLocation()
    const qrData = location.state?.qrData || null
    const [qrLink,setQrLink] = useState(qrData? qrData.qrlink : "")
    const [qrColor,setQrColor] = useState(qrData? qrData.qrcolor : "#0328fc")

    //const [qrLink,setQrLink] = useState("")
    //const [qrColor,setQrColor] = useState("#0328fc")

    const qRef = useRef()

    const downLoadQr=()=>{
      const canvas = qRef.current.querySelector("canvas")
      const url = canvas.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = url
      a.download = "qrcode.png"
      a.click()
    }

    const saveQR = async()=>{
      const utoken = localStorage.getItem('token')

      try {
        let response 
        if (qrData) {
          response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/editqr/${qrData._id}`,
            { 
              qrlink:qrLink, 
              qrcolor:qrColor 
            },
            {
              headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${utoken}`
              }
            }
          )
        } else {
          response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/addlinkqr`,
            { 
              qrlink:qrLink, 
              qrcolor:qrColor 
            },
            {
              headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${utoken}`
              }
            }
          )
        }
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }

    }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
        <Helmet>
            <title>Link QR | JotPhone</title>
        </Helmet>
        
        <h1 className='text-2xl font-bold mb-4'>Genrate URL QR</h1>
        <input type='text' value={qrLink} placeholder='Enter your URL here' className='mb-2 p-2 border rounded w-80' onChange={(e)=>setQrLink(e.target.value)} />

        <label className='mb-1 text-gray-700 font-medium'>Select QR Color</label>
        <input type='color' className='mb-4' value={qrColor} onChange={(e)=>setQrColor(e.target.value)} /> 

        <div ref={qRef} className='flex gap-4 bg-white p-2 rounded-lg shadow-lg '>
          <QRCodeCanvas value={qrLink} size={300} fgColor={qrColor} includeMargin={true} />
        </div>

        <div className='mt-4 flex gap-4'>
          <button className='px-4 py-2 w-36 bg-green-600 text-white hover:bg-green-900 transition hover:cursor-pointer border rounded' onClick={saveQR}>SaveQR</button>
          <button className='px-4 py-2 w-36 bg-blue-600 text-white hover:bg-blue-900 transition hover:cursor-pointer border rounded' onClick={downLoadQr}>Download</button>
        </div>
    </div>
  )
}

export default LinkQr