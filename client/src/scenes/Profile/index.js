import React, { Component } from "react";
import AppSidebar from "./../../components/AppSidebar";
import MobileMenu from "../../components/MobileMenu";
import Header from "../../components/Header";
// import LineGraph from "./components/LineGraph";
// import GraphTypeControl from "./components/GraphTypeControl";
// import GraphPeriodControl from "./components/GraphPeriodControl";
// import StocksTable from "./components/StocksTable";
// import Watchlist from "./components/Watchlist";
// import BuyForm from "./components/Buy";
// import SellForm from "./components/Sell";
import { Redirect } from 'react-router-dom'
import { loadUser } from "../../actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Container,
    Row,
    Col,
    
} from "reactstrap";
import {
    container,
    pageContent,
    graphSection,
    tableSection,
    tradeSection,
    profileTitle

} from "./trading.module.css";
import Searchbar from "../Trading2/components/Searchbar";
import StocksTable from "../Trading2/components/StocksTable";

class Profile extends Component {

    state = {
        sidebar: false,
        style:  {
        marginTop: 10, backgroundColor: "#FDFDFD", display: 'flex', flexDirection: 'row', alignItems: 'center', padding: "20px", borderRadius: '5px' 
        }
    };

    componentDidMount() {
        this.props.loadUser();
    }


    static propTypes = {
        close: PropTypes.number
    };

    toggleSidebar = () => {
        this.setState({
            sidebar: !this.state.sidebar
        });
    };

    onSidebarOnHover = () => {
        this.setState({ sidebar: !this.state.sidebar });
    };

    styleCard = {
    }

    render() {
        if (this.props.isAuthenticated) {
            return (<Redirect to="/profile" />)
        }
        return (
            <div className="d-flex justify-content-center">
                <MobileMenu />

                <AppSidebar />

                <Container fluid className={container}>
                    <Header />
                    <Row>
                        <Col xl={10} className={pageContent} style={{ backgroundColor: "#E9E6FF" }}>
                            <Row>
                                <Col xl={12}>
                                    <div style={{ marginTop: 10, backgroundColor: "#FDFDFD", display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 10, borderRadius: '5px' }}>
                                        <Searchbar className="justify-content-center" />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                            
                                <Col xl={12}>
                                        <Row>
                                            <Col xl={6}>
                                                <div style={this.state.style} className={profileTitle}>
                                                    <h5>
                                                        Username
                                                    </h5>
                                                    <span>
                                                        {this.props.auth.username}
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col xl={6}>
                                                <div style={this.state.style} className={profileTitle}>
                                                    <h5>
                                                        Balance
                                                    </h5>
                                                    <span>
                                                        {this.props.auth.balance}
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 15 }}>
                                <Col xl={12}>
                                    <div className={tableSection}>
                                        <StocksTable />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    close: state.trading.close,
    auth: state.auth
    // isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { loadUser }
)(Profile);
