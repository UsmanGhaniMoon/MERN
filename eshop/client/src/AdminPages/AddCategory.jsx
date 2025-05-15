import React, { useEffect, useState } from 'react';
import AdminNav from '../CommonComponents/AdminNav';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../CommonComponents/ErrorMessage';
import axios from 'axios';

const AddCategory = () => {
    const navigate = useNavigate();
    
    const [viewcatData, setViewcatData] = useState([])
    const [showToast, setShowToast] = useState(false)
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
    }, []); // Add dependency array to avoid infinite loop

    const [formData, setFormData] = useState(new FormData());
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const newFormData = new FormData();
            newFormData.append(name, value);
            return newFormData;
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const addCat = async (e) => {
        e.preventDefault();
        if (file) {
            formData.append('cat_img', file);
            try {
                const res = await axios.post("http://127.0.0.1:5000/api/admin/category/addcategory", formData);
                if (res.data.sts === 0) {
                    setShowToast(true);
                    setMsg(res.data.msg);
                    setType("success");
                    setTimeout(() => setShowToast(false), 3000);
                    getCat()
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

    const delCat = async(id)=>{
        try {
            const res = await axios.delete(`http://127.0.0.1:5000/api/admin/category/deletecat/${id}`)
            setShowToast(true);
            setMsg(res.data.msg);
            if (res.data.delsts===0) {
                setType("success");
                getCat()
            } else {
                setType("error"); 
            }
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <ErrorMessage showToast={showToast} msg={msg} type={type} />
            <AdminNav />
            <div className='container'>
                <div className='row mt-5'>
                    <div className='col-md-4 col-sm-12'>
                        <div className='card'>
                            <div className='card-header bg-primary text-white text-center'>
                                <h5>Add Category</h5>
                            </div>
                            <div className='card-body'>
                                <div className='mb-3'>
                                    <label htmlFor="cat_name" className='form-label'>Product Category</label>
                                    <input 
                                        type='text' 
                                        className='form-control' 
                                        id='cat_name' 
                                        name='cat_name' 
                                        placeholder='Enter Category' 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="cat_img" className='form-label'>Category Image</label>
                                    <input 
                                        type='file' 
                                        className='form-control' 
                                        id='cat_img' 
                                        name='cat_img' 
                                        onChange={handleFileChange} 
                                    />
                                </div>
                                <div className='mb-3'>
                                    <input 
                                        type='button' 
                                        className='form-control btn btn-primary'  
                                        name='add_cat' 
                                        value="Add Category" 
                                        onClick={addCat} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-8 col-sm-12'>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th className='bg-primary text-white' scope='col'>#</th>
                                    <th className='bg-primary text-white' scope='col'>Category Name</th>
                                    <th className='bg-primary text-white' scope='col'>Category Image</th>
                                    <th className='bg-primary text-white' scope='col'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewcatData.map((cats, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{cats.cat_name}</td>
                                        <td>
                                            <img src={`http://localhost:5000/cats/${cats.cat_img}`} alt="Category" style={{width:"100px", mixBlendMode:"multiply"}} />
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={()=>delCat(cats._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddCategory;
