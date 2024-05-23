import React, { useState } from 'react'
import {
    Modal,
    ModalBody,
    NavLink,
    Alert,
    Col,
    Row,
    Container,
} from 'react-bootstrap';
import { ReactComponent as RegisterImage } from './RegisterImage.svg';
import { ReactComponent as LoginBG } from './LoginBG.svg';
import Close from "@mui/icons-material/Close";
import "./login.css"
import { RegisterUser } from '../../axios/apis';

const Register = () => {

    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => setIsOpen(false)

    const [registerDetails, setRegisterDetails] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setRegisterDetails({ ...registerDetails, [name]: value })
    }

    const handleSubmit = async () => {
        try {
            const res = await RegisterUser(registerDetails)
            localStorage.setItem("user", res.data)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div onClick={() => setIsOpen(true)} href="#" className="link">
                Sign Up
            </div>

            <Modal show={isOpen} onHide={handleClose}
                // toggle={this.toggle}
                className="modal-xl"
            >
                <ModalBody className="p-0">
                    <Container fluid={true} className="p-0">
                        <Row noGutters={true}>
                            <Col xs={6} className="loginImageCol">
                                <LoginBG className="oginBG" />
                                <div className="companyNameWrapper">
                                    <div className="companyName">
                                        STOCK NAME
                                    </div>
                                </div>
                                <div className="loginImageWrapper">
                                    <RegisterImage className="oginImage" />
                                </div>
                            </Col>
                            <Col xs={12} xl={6}>
                                <div className="closeButtonWrapper">
                                    <Close onClick={handleClose} style={{ fontSize: 36 }} />
                                </div>
                                <div className="loginTitle">Sign up for an account</div>
                                {/* <div className={signUpText}>Already have an account?<div className={signUpLink}>Log In</div></div> */}
                                <form>
                                    <div className="registerInputWrapper">
                                        <div className="inputLabel">USERNAME</div>
                                        <input className="registerInput" placeholder={"Enter your username"}
                                            name={"username"} type={"username"} onChange={handleChange} />
                                    </div>
                                    <div className="registerInputWrapper">
                                        <div className="inputLabel">EMAIL ADDRESS</div>
                                        <input className="registerInput" placeholder={"Enter your email"}
                                            name={"email"} type={"email"} onChange={handleChange} />
                                    </div>
                                    <div className="registerInputWrapper">
                                        <div className="inputLabel">PASSWORD</div>
                                        <input className="registerInput" placeholder={"Enter your password  "}
                                            name={"password"} type={"password"} onChange={handleChange}
                                            autoComplete="off" />
                                    </div>
                                    <div className="registerInputWrapper">
                                        <div className="inputLabel">CONFIRM PASSWORD</div>
                                        <input className="registerInput" placeholder={"Enter your password again "}
                                            name={"confirmPassword"} type={"confirmPassword"} onChange={handleChange}
                                            autoComplete="off" />
                                    </div>
                                </form>
                                {/* {this.state.msg ? <Alert color="danger" className="errMsg">{this.state.msg}</Alert> : <Alert color="danger" className={errMsgHidden}>Nothing Here!</Alert>} */}
                                <div className="logInButtonContainer">
                                    <div className="logInButtonWrapper" onClick={handleSubmit}>
                                        <div className="logInButton">
                                            Sign Up
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                </ModalBody>
            </Modal>
        </>
    )
}

export default Register