import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from "./components/Login"
import TestBlok from "./components/TestBlok";
import Registration from './components/Registration';
import Home from './components/Home';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {

  const token = localStorage.getItem('token')
  const [tokendt,settokendt] = useState({
    token,
  })

  useEffect(()=>{
    const checktoken = async()=>{
      try{
        const res = await axios.post('http://localhost:5000/api/user/checktoken', tokendt)
        console.log(res)
        if(res.data.tokenstatus===1){
          localStorage.removeItem('token')
          localStorage.removeItem('user_name')
          settokendt({ token: null });
        }
      } catch(error){
        console.error(error)
      }
    }

    checktoken()
  }, [])
 
  return (
   <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Registration/>} />
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/home' element={<Home/>} />
      <Route exact path='/test' element={<TestBlok/>} />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
