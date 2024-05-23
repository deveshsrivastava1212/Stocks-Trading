import React, { Component } from 'react';
import { connect } from "react-redux";
import { getStockPrice, handleSale } from "./../../../actions/tradingActions";
import { Modal, ModalBody } from "reactstrap";
import axios from 'axios';
import Swal from 'sweetalert2'
import { tableRow, tableCol, title, headerRow, sellButton } from "./../table.module.css";
import {
    confirmWrapper, confirmTitle, confirmSubText,
    confirmDescWrapper, confirmDescTitle, confrimDescRow,
    confirmDescText, buttonRow, cancelButton, purchaseButton, input
} from "./../tradingForm.module.css";
class StocksTable extends Component {
  
    render() {
        return (
            <div>
                <div className={title}>Your Stocks</div>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr className={headerRow}>
                            <th className={tableCol}>
                                Ticker
                        </th>
                            <th className={tableCol}>
                                Stock Price
                        </th>
                            <th className={tableCol}>
                                Quantity
                        </th>
                            <th className={tableCol}>
                                Actions
                        </th>
                        </tr>
                        {
                            stocks.map((stock, i) => {
                                return (
                                    <tr className={tableRow} key={stock.ticker.toLowerCase()}>
                                        <td className={tableCol}>
                                            {stock.ticker.toUpperCase()}
                                        </td>
                                        <td className={tableCol}>
                                            {'$' + prices[i].toFixed(2)}
                                        </td>
                                        <td className={tableCol}>
                                            {stock.qty}
                                        </td>
                                        <td className={tableCol}>
                                            <div className={sellButton} onClick={() => this.onSell(i)} >Sell</div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className="modal-md"
                >
                    <ModalBody>
                        <div className={confirmTitle}>Select Quantity</div>
                        <div className={confirmSubText}>How many {ticker} stocks would you like to sell?</div>
                        <div className={confirmDescWrapper}>
                            <div className={confrimDescRow}>
                                <div>Ticker:</div>
                                <div className={confirmDescText}>{ticker}</div>
                            </div>
                            <div className={confrimDescRow}>
                                <div>Quantity:</div>
                                <div className={confirmDescText}>
                                    <input className={input} value={this.state.qty}
                                        onChange={this.onChange} name="qty" />
                                </div>
                            </div>
                        </div>
                        <div className={buttonRow}>
                            <div className={cancelButton} onClick={this.toggle}>Cancel</div>
                            <div className={purchaseButton} onClick={this.onConfirmTrade}>Confirm Quantity</div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal
                    isOpen={this.state.confirmModal}
                    toggle={this.toggleConfirmModal}
                    className="modal-md"
                >
                    <ModalBody className={confirmWrapper}>
                        <div className={confirmTitle}>Confirm Order</div>
                        <div className={confirmSubText}>Would you like to place the following order?</div>
                        <div className={confirmDescWrapper}>
                            <div className={confirmDescTitle}>
                                Sell {this.state.qty} {ticker} @ {estimatedCost} {orderType}
                            </div>
                            <div className={confrimDescRow}>
                                <div>Order Type:</div>
                                <div className={confirmDescText}>{orderType.charAt(0).toUpperCase() + orderType.substring(1)}</div>
                            </div>
                            <div className={confrimDescRow}>
                                <div>Ticker:</div>
                                <div className={confirmDescText}>{ticker}</div>
                            </div>
                            <div className={confrimDescRow}>
                                <div>Amount:</div>
                                <div className={confirmDescText}>{this.state.qty}</div>
                            </div>
                            <div className={confrimDescRow}>
                                <div>Estimated Cost:</div>
                                <div className={confirmDescText}>{estimatedCost * this.state.qty}</div>
                            </div>
                        </div>
                        <div className={buttonRow}>
                            <div className={cancelButton} onClick={this.toggleConfirmModal}>Cancel</div>
                            <div className={purchaseButton} onClick={this.onTrade}>Sell</div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    stocks: state.auth.stocks,
    estimatedCost: state.trading.estimatedPrice,
    tradeError: state.trading.tradeError,
    tradeMsg: state.trading.tradeMsg,
});

export default connect(
    mapStateToProps,
    {
        getStockPrice,
        handleSale
    }
)(StocksTable);
