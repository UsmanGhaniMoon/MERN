import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WelcomePart from './WelcomePart'

const Home = () => {

    const navigate = useNavigate()
    const token = localStorage.getItem('token')
   
    useEffect(()=>{
        if(token===null){    
            navigate('/login')
        }
    })
     
  return (
    <div>Home
    
        <WelcomePart/>
    </div>
  )
}

export default Home