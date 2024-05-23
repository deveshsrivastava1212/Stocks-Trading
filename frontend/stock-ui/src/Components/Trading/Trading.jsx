import React from 'react'
import {
    Container,
    Row,
    Col
} from "react-bootstrap";
import {
    container,
    pageContent,
    graphSection,
    tableSection,
    tradeSection
} from "./trading.css";

const Trading = () => {
    return (
        <>
            <div className="d-flex justify-content-center">

                {/*
                <MobileMenu />

                <AppSidebar />
*/}

                <Container fluid className="container">

                    {
                        /**
                        
                        <Header />
                         */
                    }
                    <Row>
                        <Col xl={10} className="pageContent" style={{ backgroundColor: "#E9E6FF" }}>
                            <Row>
                                <Col xl={12}>
                                    <div style={{ marginTop: 10, backgroundColor: "#FDFDFD", display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 10, borderRadius: '5px' }}>
                                        {
                                            /**
                                             * 
                                            <Searchbar className="justify-content-center" />
                                             */
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={3} style={{ marginTop: 15 }}>
                                    <div className="tradeSection">
                                        {/*
                                        
                                        <BuyForm />
                                        <SellForm /> */}
                                    </div>

                                </Col>
                            </Row>
                            <Row style={{ marginTop: 15 }}>
                                <Col xl={12}>
                                    <div className="tableSection">
                                        {/*
                                        
                                        <StocksTable />
                                        */}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Trading