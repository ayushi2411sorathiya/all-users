import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'

const Index = () => {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="home-btn my-4">
                            <Link to="/all-users">
                                <button className='mx-2'>Home</button>
                            </Link>
                            <Link to="/all-users/users">
                                <button className='mx-2'>Users</button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Index