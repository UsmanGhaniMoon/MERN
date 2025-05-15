import React, { useEffect, useState } from 'react';
import AdminNav from '../CommonComponents/AdminNav';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../CommonComponents/ErrorMessage';
import axios from 'axios';

const AddProduct = () => {
    const navigate = useNavigate();
    
    const [viewcatData, setViewcatData] = useState([]);

    const [showToast, setShowToast] = useState(false);
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')

    const token = localStorage.getItem('token')
    
    const getCat = async () => {
        try {
            const result = await axios.get("http://127.0.0.1:5000/api/admin/category/getcat");
            setViewcatData(result.data.cat);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (token === null) {
            navigate('/adminlogin');
        } else {
            getCat();
        }
    }, []);

    const [formData, setFormData] = useState(new FormData());
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        formData.set(name,value)
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const addPro = async (e) => {
        e.preventDefault();
        if (file) {
            formData.append('product_thumb', file);
            try {
                const res = await axios.post("http://127.0.0.1:5000/api/admin/product/addproduct", formData);
                if (res.data.sts===0) {
                    setShowToast(true);
                    setMsg(res.data.msg);
                    setType("success");
                    setTimeout(() => setShowToast(false), 3000);
                    navigate('/viewProducts')
                } else {
                    setShowToast(true);
                    setMsg("File Upload Failed");
                    setType("error");
                    setTimeout(() => setShowToast(false), 3000);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setShowToast(true);
            setMsg("Please Select File");
            setType("error");
            setTimeout(() => setShowToast(false), 3000);
        }
    };

  return (
    <div>
        <ErrorMessage showToast={showToast} msg={msg} type={type} />
            <AdminNav />
            <div className='container'>
                <div className='row mt-5'>
                    <div className='col-md-12 col-sm-12 align-self-center'>
                        <div className='card'>
                            <div className='card-header bg-primary text-white text-left'>
                                <h5>ADD PRODUCT</h5>
                            </div>
                            <div className='card-body'>
                                <div className='row mb-3'>
                                    <div className='col-sm-4 col-md-4'>
                                        <label htmlFor="pro_cat" className='form-label'>Product Category</label>
                                        <select className='form-control' id='pro_cat' name='pro_cat' onChange={handleInputChange}>
                                            <option>Select Category</option>
                                            {
                                                viewcatData.map(cats=>(
                                                    <option value={cats._id}>
                                                        {cats.cat_name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className='col-sm-4 col-md-4'>
                                        <label htmlFor="product_name" className='form-label'>Product Name</label>
                                        <input type='text' className='form-control' id='product_name' name='product_name' placeholder='Enter Product Name' onChange={handleInputChange}/>
                                    </div>
                                    <div className='col-sm-4 col-md-4'>
                                        <label htmlFor="product_thumb" className='form-label'>Product Thumbnail</label>
                                        <input type='file' className='form-control' id='product_thumb' name='product_thumb' onChange={handleFileChange} />
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <div className='col-sm-5 col-md-5'>
                                        <label htmlFor="product_shot_desc" className='form-label'>Product Short Description</label>
                                        <textarea className='form-control' id='product_shot_desc' name='product_shot_desc' placeholder='Enter Product Short Description' onChange={handleInputChange}/>
                                    </div>
                                    <div className='col-sm-7 col-md-7'>
                                        <label htmlFor="product_long_desc" className='form-label'>Product Long Description</label>
                                        <textarea className='form-control' id='product_long_desc' name='product_long_desc' placeholder='Enter Product Long Description' onChange={handleInputChange}/>
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <div className='col-sm-3 col-md-3'>
                                        <label htmlFor="product_org_price" className='form-label'>Product Price</label>
                                        <input type='text' className='form-control' id='product_org_price' name='product_org_price' placeholder='Enter Product Price' onChange={handleInputChange}/>
                                    </div>
                                    <div className='col-sm-3 col-md-3'>
                                        <label htmlFor="product_sale_price" className='form-label'>Product Sale Price</label>
                                        <input type='text' className='form-control' id='product_sale_price' name='product_sale_price' placeholder='Enter Product Sale Price' onChange={handleInputChange}/>
                                    </div>
                                    <div className='col-sm-3 col-md-3'>
                                        <label htmlFor="product_sale_start_date" className='form-label'>Sale Start Date</label>
                                        <input type='date' className='form-control' id='product_sale_start_date' name='product_sale_start_date' placeholder='dd-mm-yyyy' onChange={handleInputChange}/>
                                    </div>
                                    <div className='col-sm-3 col-md-3'>
                                        <label htmlFor="product_sale_end_date" className='form-label'>Sale End Date</label>
                                        <input type='date' className='form-control' id='product_sale_end_date' name='product_sale_end_date' placeholder='dd-mm-yyyy' onChange={handleInputChange}/>
                                    </div>
                                </div>
                                
                                <div className='row mb-3'>
                                    <div className='col-sm-2 col-md-2'>
                                        <input type='button' className='form-control btn btn-primary' name='add_pro' value="Add Product" onClick={addPro} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default AddProduct