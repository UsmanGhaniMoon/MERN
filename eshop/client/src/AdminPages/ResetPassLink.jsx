import React, { useState } from 'react'
import ErrorMessage from '../CommonComponents/ErrorMessage'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const ResetPassLink = () => {

    const { rtoken } = useParams()

    const [showToast, setShowToast] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')

    const [resetpass, setResetpass] = useState({
        reset_token:rtoken,
        admin_pass:'',
    })

    const handleInputChange = async(e)=>{
        const {name, value} = e.target
        setResetpass({
            ...resetpass,
            [name]:value
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post("http://127.0.0.1:5000/api/admin/resetpass", resetpass)
            if (res.data.sts===0) {
                setType("success")
            } else {
                setType("error")
            }
            setShowToast(true)
            setMsg(res.data.msg)
            setTimeout(()=>{
                setShowToast(false)
            }, 5000)
        } catch(error){
            console.error(error)
        }
    }
  return (
    <>
        <ErrorMessage showToast={showToast} msg={msg} type={type} />
        <div className='container'>
            <div className='row justify-content-center mt-5'>
                <div className='col-md-4 col-sm-4 align-self-center'>
                    <div className='card'>
                        <div className='card-header bg-success text-white text-center'>
                            <h5>Change Your Password</h5>
                        </div>
                        <div className='card-body'>
                            <div className='mb-3'>
                                <label for="admin_pass" className='form-label'>Admin new Password</label>
                                <input type='password' className='form-control' id='admin_pass' name='admin_pass' placeholder='Enter New Password' onChange={handleInputChange} />
                            </div>

                            <div className='mb-3'>
                                <input type='button' className='form-control btn btn-success'  name='change_pass' value={"Change Password"} onClick={handleSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ResetPassLink