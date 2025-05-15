import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap'

const Product = () => {

    const [categoryData, setCategoryData] = useState([])
    const [priceRange, setPriceRange] = useState({min:0,max:100000})
    const [selectedCategories, setSelectedCategories] = useState([])
    const [proData, setProData] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])


    const getCategories = async()=>{
        try {
            const allCategory = await axios.get("http://127.0.0.1:5000/api/user/category/getcategory")
            setCategoryData(allCategory.data.categories)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCategoryChange = (CategoryId)=>{
        setSelectedCategories(prev=>{
            if (prev.includes(CategoryId)) {
                return prev.filter(id=>id !== CategoryId)
            } else {
                return [...prev, CategoryId]
            }
        })
    }

    const getProducts = async()=>{
        try {
            const allPro = await axios.get("http://127.0.0.1:5000/api/user/product/getallproduct")
            setProData(allPro.data.products) 
            setFilteredProducts(allPro.data.products) 
        } catch (error) {
            console.error(error)
        }
    }

    const filterProduct = ()=>{
        const filtered = proData.filter((product)=>{
            const withinPriceRange = product.product_sale_price >= priceRange.min && product.product_sale_price <= priceRange.max

            const inSelectedCategory = selectedCategories.length === 0 || selectedCategories.includes(product.pro_cat._id) 

            return withinPriceRange && inSelectedCategory
        })

        setFilteredProducts(filtered)
    }

    useEffect(()=>{
        getCategories()
        getProducts()
    }, [])

    useEffect(()=>{
        filterProduct()
    }, [priceRange, selectedCategories, proData])

    const isSaleActive = (product)=>{
        const saleStartDate = new Date(product.product_sale_start_date)
        const saleEndDate = new Date(product.product_sale_end_date)
        const today = new Date()

        return today >= saleStartDate && today <= saleEndDate
    }
  return (
    <Container fluid>
        <Row>
            <Col md="3" lg="3" xs="12" sm="12" className='mt-5'>
                <h5>Filter by Category</h5>
                {
                    categoryData.map((category) => (
                        <FormGroup check key={category._id}>
                            <Label check>
                                <Input type="checkbox" onChange={()=>handleCategoryChange(category._id)} />
                                {category.cat_name} 
                            </Label>
                        </FormGroup>
                    ))
                }
                <hr />
                <h5>Filter By Price</h5>
                <Label>Min: ₹{priceRange.min}</Label>
                <Input type='range' min={0} max={3000} value={priceRange.min} onChange={(e)=>setPriceRange({...priceRange,min:Number(e.target.value)})} />

                <Label>Max: ₹{priceRange.max}</Label>
                <Input type='range' min={3000} max={100000} value={priceRange.max} onChange={(e)=>setPriceRange({...priceRange,max:Number(e.target.value)})} />
            </Col>
            <Col md="9" lg="9" xs="12" sm="12" className='mt-5'>
                <Row>
                {
                    filteredProducts.map((product) => (
                        <Col md="3" lg="3" xs="12" sm="12" className='mb-4'>
                        <Card className="position-relative" color='light'>
                            <CardImg src={`http://127.0.0.1:5000/pros/${product.product_thumb}`} alt="Product" top width={"100%"} />
                            <CardBody>
                                <CardTitle tag={"h5"} style={{ height:'3em',overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WeblitLineClamp:2, WebkitBoxOrient:'vertical'}}>
                                    {product.product_name}
                                </CardTitle>
                                <CardText>
                                {
                                    isSaleActive(product) && product.product_sale_price?(
                                        <>
                                        <span style={{textDecoration:'line-through'}}>{product.product_org_price}</span>
                                        <span className='text-danger bold ml-2' style={{fontWeight:'bold'}}>{product.product_sale_price}</span>
                                        </>
                                    ) : (
                                        <span style={{fontWeight:'bold'}}>{product.product_org_price}</span>
                                    )
                                }
                                    
                                </CardText>
                                <div>
                                    <Button color='danger' className='btn btn-sm' style={{borderRadius:'0px'}}>Add to Cart</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    ))
                } 
                </Row>
            </Col>
        </Row>
    </Container>
  )
}

export default Product