import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './AdminPages/AdminLogin';
import AdminHome from './AdminPages/AdminHome';
import { useEffect, useState } from 'react';
import axios from 'axios'
import ChangePassword from './AdminPages/ChangePassword';
import ForgetPass from './AdminPages/ForgetPass';
import ResetPassLink from './AdminPages/ResetPassLink';
import AddCategory from './AdminPages/AddCategory';
import AddProduct from './AdminPages/AddProduct';
import ViewProducts from './AdminPages/ViewProducts';
import SampleTest from './UserPages/SampleTest';
import Product from './UserPages/Product';

function App() {
  
  const token = localStorage.getItem('token')
  const [tokendt, setTokendt] = useState({
    token
  })

  useEffect(()=>{

    const checkToken = async()=>{
      try{
        const res = await axios.post("http://127.0.0.1:5000/api/admin/checktoken", tokendt)
        if(res.data.tokensts===1){
          localStorage.removeItem('token')
          localStorage.removeItem('aid')
          localStorage.removeItem('aemail')
          localStorage.removeItem('aname')

        }
      } catch(error){
        console.error(error)
      }
    }
    
    // useEffect(()=>{
      
    // })
    checkToken()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/test' element={<SampleTest />} />
        <Route exact path='/adminlogin' element={<AdminLogin />} />
        <Route exact path='/adminhome' element={<AdminHome />} />
        <Route exact path='/adminchangepass' element={<ChangePassword />} />
        <Route exact path='/adminforgetpass' element={<ForgetPass />} />
        <Route exact path='/adminpassreset/:rtoken' element={<ResetPassLink />} />
        <Route exact path='/admincategory' element={<AddCategory />} />
        <Route exact path='/addProduct' element={<AddProduct />} />
        <Route exact path='/viewProducts' element={<ViewProducts />} />
        <Route exact path='/product' element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
