import React, { useState } from 'react'
import axios from 'axios'

const Registration = () => {

    const [userdt,setuserdt] = useState({
        user_name:'',
        user_email:'',
        user_dob:'',
        gender:'',
        password:'', 
    })

    const handleInputChange = (e)=>{
        const {name, value} = e.target
        setuserdt({
            ...userdt,
            [name]:value,
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post('http://localhost:5000/api/user/adduser', userdt)
            console.log(res)
        } catch(error){
            console.error(error)
        }
    }

  return (
    <div>
        <table align='center'>
            <tr>
                <td>Username</td>
                <td>
                    <input type='text' name='user_name' onChange={handleInputChange} />
                </td>
            </tr>
            <tr>
                <td>User Email</td>
                <td>
                    <input type='email' name='user_email' onChange={handleInputChange} />
                </td>
            </tr>
            <tr>
                <td>Dob</td>
                <td>
                    <input type='text' name='user_dob' onChange={handleInputChange} />
                </td>
            </tr>
            <tr>
                <td>Gender</td>
                <td>
                    <select name='gender' onChange={handleInputChange}>
                        <option value={""}>-Select-</option>
                        <option value={"male"}>Male</option>
                        <option value={"female"}>Female</option>
                    </select>
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
                    <button onClick={handleSubmit}>Registration</button>
                </td>
            </tr>
            <tr>
                <td colSpan={2} align='center'>
                    If already Register <a href='login'>Login here</a>
                </td>
            </tr>
        </table>
    </div>
  )
}

export default Registration