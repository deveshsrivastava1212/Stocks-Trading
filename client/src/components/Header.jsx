import React, { Component } from 'react';
import { Row, Col, NavItem, NavLink } from 'reactstrap';
import "./header.css";
import MenuButton from "./MenuButton";
import Logout from './auth/Logout';
import PropTypes from 'prop-types';

class Header extends Component {
    state = {}

    // static propTypes = {
    //     auth: PropTypes.object.isRequired
    // }

    render() {

        // const { user } = this.props.auth;

        return (
            <Row style={{ zIndex: 2 }}>
                <Col xl={12} className="wrapper">
                    <MenuButton />
                    <div className='w-100 flex-nav'>
                        <div className="pageTitle header-right">
                            <span className="navbar-text mr-3">
                                <strong>Welcome</strong>
                                {/* <strong>{user ? `Welcome ${user.userName}` : ''}</strong> */}

                            </span>
                            <NavLink className="nav-color" href="/dashboard" style={(this.props.currentLink === "/dashboard") ? { color: 'black' } : null}>
                                Dashboard
                            </NavLink>
                            <NavLink  className="nav-color"  href="/trading" style={(this.props.currentLink === "/trading") ? { color: 'black' } : null}>
                            Trading
                        </NavLink>
                        <Logout />
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Header;