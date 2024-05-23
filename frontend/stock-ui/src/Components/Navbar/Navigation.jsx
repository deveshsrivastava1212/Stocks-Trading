import React from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
} from 'react-bootstrap';
import "./navbar.css"
import Register from '../Auth/Register';
import Login from '../Auth/Login';

const Navigation = () => {
  
    return (
        <>
            <Navbar className="navWrapper" style={{justifyContent:"space-between"}} light expand="md">
                <a href="/" className="title">
                    <div className="titleHighlight">STOCK</div>
                    NAME
                </a>
                    <Nav className="ml-auto" navbar>
                        <NavItem style={{margin:"0 10px"}} className='mr-5'>
                            <Register />
                        </NavItem>
                        <NavItem style={{margin:"0 10px"}} className='mr-5'>
                           <Login />
                             </NavItem>
                    </Nav>
            </Navbar>
        </>
    )
}

export default Navigation