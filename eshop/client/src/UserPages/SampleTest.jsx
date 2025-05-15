import React from 'react'
import {Col, Container, Row} from 'reactstrap'

const SampleTest = () => {
  return (
    <Container>
        <Row>
            <Col sm="6" md="4" lg="4" xs="12" className='bg-primary'> Test1</Col>
            <Col sm="6" md="4" lg="4" xs="12" className='bg-secondary'> Test2</Col>
            <Col sm="6" md="4" lg="4" xs="12" className='bg-success'> Test3</Col>
        </Row>
    </Container>
  )
}

export default SampleTest