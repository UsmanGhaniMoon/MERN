import React, { useEffect, useState } from 'react';
import AdminNav from '../CommonComponents/AdminNav';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../CommonComponents/ErrorMessage';
import axios from 'axios';
import styles from './ViewProduct.module.css';


const ViewProducts = () => {

    const navigate = useNavigate();
        
    const [proData, setProData] = useState([])
    const [showToast, setShowToast] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedStatus,setSelectedStatus] = useState('')
    const [searchProd, setSearchProd] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [files, setFiles] = useState([])

    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const token = localStorage.getItem('token')

    const getPro = async () => {
        try {
            const result = await axios.get("http://127.0.0.1:5000/api/admin/product/viewproduct");
            if (result.data.viewprosts===1) {
                setShowToast(true);
                setMsg(result.data.msg);
                setType("error");
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setProData(result.data.product)
            }
            
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (token === null) {
            navigate('/adminlogin');
        } else {
            getPro();
        }
    }, []);
    
    const handleCheckboxChange = async(productId)=>{
        setSelectedRows((prevSelectedRows)=>{
            if (prevSelectedRows.includes(productId)) {
                return prevSelectedRows.filter((id)=>id !== productId)
            } else {
                return [...prevSelectedRows,productId]
            }
        })
    }

    const handleChangeStatus = async(newStatus)=>{
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/admin/product/changestatus", 
                {
                    productIds: selectedRows,
                    newStatus: newStatus
                })
            setSelectedRows([])
            setShowToast(true)
            setMsg(res.data.msg)
            setType("success")
    
            setTimeout(()=>{
                setShowToast(false)
            }, 3000) 
            getPro() 
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeletePro = async () => {
        if (selectedRows.length === 0) {
            setShowToast(true);
            setMsg("Please select at least one product to delete.");
            setType("error");
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
    
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/admin/product/deleteproduct", 
                { productIds: selectedRows });
    
            setSelectedRows([]);
            setShowToast(true);
            setMsg(res.data.msg || "Products deleted successfully");
            setType("success");
    
            setTimeout(() => {
                setShowToast(false);
            }, 3000); 
            
            getPro(); 
        } catch (error) {
            console.error(error);
            setShowToast(true);
            setMsg("Failed to delete products.");
            setType("error");
    
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    const delPro = async(productId)=>{
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/api/admin/product/deletepro/${productId}`)

            if (response.data.delsts === 0) {
                setShowToast(true)
                setMsg(response.data.msg)
                setType("success")
                setTimeout(()=>{
                    setShowToast(false)
                }, 3000)
                getPro()
            } else {
                setShowToast(true)
                setMsg(response.data.msg)
                setType("error")
                setTimeout(()=>{
                    setShowToast(false)
                }, 3000)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const openModel = (productId)=>{
        setIsModalOpen(true)
        setSelectedProductId(productId) 
    }

    const closeModal = ()=>{
        setIsModalOpen(false)
        setFiles([])
    }

    const handleFileChange = (e)=>{
        setFiles(e.target.files)
    }

    const handleUploadImages = async()=>{
        const formData = new FormData()
        for (const file of files) {
            formData.append('images',file)
        }
        formData.append('productId',selectedProductId)

        try {
            await axios.post(`http://127.0.0.1:5000/api/admin/product/uploadimage/${selectedProductId}`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            setShowToast(true)
            setMsg("Images uploaded successfully")
            setType("success")
            setTimeout(()=>{
                setShowToast(false)
            }, 3000)
            closeModal()
            getPro()
        } catch (error) {
            console.error(error)
            setShowToast(true)
            setMsg("Failed to upload images")
            setType("error")
            setTimeout(()=>{
                setShowToast(false)
            }, 3000)
            closeModal()
            getPro()
        }
    }
  return (
    <div>
            <ErrorMessage showToast={showToast} msg={msg} type={type} />
            <AdminNav />
            <div className='container'>
                <div className='row mt-5'>
                    <div className='col-md-12 col-sm-12'>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th className='bg-primary text-white' scope='col'>#</th>
                                    <th className='bg-primary text-white' scope='col'>Product Image</th>
                                    <th className='bg-primary text-white' scope='col'>Product Name</th>
                                    <th className='bg-primary text-white' scope='col'>Category</th>
                                    <th className='bg-primary text-white' scope='col'>Price</th>
                                    <th className='bg-primary text-white' scope='col'>Status</th>
                                    <th className='bg-primary text-white' scope='col' colSpan={2}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <tr>
                                        <td colSpan={2}>
                                            <select name='pro_sts' className='form-control' onChange={(e)=>setSelectedStatus(e.target.value)}>
                                                <option value=''>All</option>
                                                <option value='Pending'>Pending</option>
                                                <option value='Enable'>Enable</option>
                                                <option value='Disable'>Disable</option>
                                            </select>
                                        </td>
                                        <td colSpan={6}>
                                            <input type='text' className='form-control' placeholder='Search Product' onChange={(e)=>{setSearchProd(e.target.value)} }/>
                                        </td>
                                    </tr>
                                {proData.filter(product=> (!selectedStatus || product.product_status===selectedStatus) && (searchProd==='' || product.product_name.toLowerCase().includes(searchProd.toLocaleLowerCase()))).map((products, index) => (
                                    <tr key={index}>
                                        <td><input type='checkbox' checked={selectedRows.includes(products._id)} onChange={()=>handleCheckboxChange(products._id)}/>{index + 1}</td>
                                        <td>
                                            <img src={`http://localhost:5000/pros/${products.product_thumb}`} alt="Category" width={"100px"} style={{mixBlendMode:"multiply"}} />
                                        </td>
                                        <td>{products.product_name}</td>
                                        <td>{products.category}</td>
                                        <td>{products.product_org_price}</td>
                                        <td>{products.product_status}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={()=>delPro(products._id)}>Delete</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={()=>openModel(products._id)}>Upload Image</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={6}>
                                        <button className='btn btn-sm btn-outline-primary' onClick={()=>handleChangeStatus("Pending")}>Pending</button>
                                        &nbsp;
                                        <button className='btn btn-sm btn-outline-success' onClick={()=>handleChangeStatus("Enable")}>Enable</button>
                                        &nbsp;
                                        <button className='btn btn-sm btn-outline-danger' onClick={()=>handleChangeStatus("Disable")}>Disable</button>
                                    </td>
                                    <td>
                                        <button className='btn btn-sm btn-danger' onClick={()=>handleDeletePro()}>Remove</button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
            </div>
            {isModalOpen&&(
                <div className={styles.modal}>
                    <span className={styles.close} onClick={closeModal}>&times;</span>
                    <input type='file' className='' onChange={handleFileChange} multiple />
                    <button className='btn btn-primary' onClick={handleUploadImages}>Upload</button>
                </div>
            )}
        </div>
  )
}

export default ViewProducts