import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()
    const [message, setMessage] = useState(null)
    const [logindt, setLogindt] = useState({
        user_email:'',
        password:'',
    })

    const handleInputChange = (e)=>{
        const {name, value} = e.target
        setLogindt({
                ...logindt,
                [name]:value,
            })
    }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
        const res = await axios.post('http://localhost:5000/api/user/userlogin', logindt)
        console.log(res)
        if(res.data.status === 0){
            //setMessage(res.data.message)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user_name', res.data.user_name)
            navigate('/home')
        }else if(res.data.status === 1){
            setMessage(res.data.message)
        }else{
            setMessage(res.data.message)
        }
    } catch(error){
        console.error(error)
    }
  }

  return (
    <div>
      <table align='center'>
            <tr>
                <td>User Email</td>
                <td>
                    <input type='email' name='user_email' onChange={handleInputChange} />
                </td>
            </tr>
            <tr>
                <td>Password</td>
                <td>
                    <input type='password' name='password' onChange={handleInputChange} />
                </td>
            </tr>
            <tr>
                <td colSpan={2}>
                    <button onClick={handleSubmit}>Login</button>
                </td>
            </tr>
            <tr>
                <td colSpan={2} align='center' style={{color:'red'}}>
                    {message}
                </td>
            </tr>
            <tr>
                <td colSpan={2} align='center'>
                    If you are not Register <a href='/'>Register here</a>
                </td>
            </tr>
        </table>
    </div>
  )
}

export default Login