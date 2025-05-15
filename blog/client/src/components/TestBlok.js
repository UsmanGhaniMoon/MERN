import React from 'react'
import './TestBlok.css'
import styled from 'styled-components'
import { BlogButton, BlogPara } from '../CommonElements'

const StyleBtn = styled.button`
    color: white;
    background-color: red;
    border: 1px double black;
    font-size: 34px;
    border-radius:5px;
`

const TestBlok = () => {

    const pStyle = {
        color:'blue',
        fontSize:'28px',
    }

  return (
    <>
        <p style={pStyle}>Hello</p>

        <p style={{color:'red'}}>Loram ipsum</p>

        <p className='myParagraph'>External CSS</p>

        <StyleBtn>Login</StyleBtn> 
        <StyleBtn>Registration</StyleBtn>

        <BlogButton>Test Button</BlogButton>

        <BlogPara>Loram ipsum</BlogPara>
    </>
  )
}

export default TestBlok