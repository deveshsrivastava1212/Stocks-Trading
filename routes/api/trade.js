const express = require("express");
const router = express.Router();
const config = require("config");
const axios = require('axios');

const User = require("../../models/User");


router.post("/", isLoggedIn, async (req, res) => {
    let { orderType, ticker } = req.body;
    ticker = ticker.toUpperCase();
    const qty = parseInt(req.body['qty']);
    const orderTypes = config.get("orderTypes");
    const token = config.get("aplhaVantageAPI_Key");
    const detail = "TIME_SERIES_DAILY";
    console.log(req.session);

    // if qty is below 0 or above 100, return bad req
    if (qty < 1 || 100 < qty) return res.status(400).json({ msg: "Purchase quantity must be between 1 and 100" });
    if (!Number.isInteger(qty)) return res.status(400).json({ msg: "Purchase quantity must be an integer" });
    // if invalid order type, return bad req
    if (!orderTypes.includes(orderType)) return res.status(400).json({ msg: "Invalid order type" });

    if (orderType === 'market') {
        // 1. Call IEX cloud
        // 2. Check Balance, etc.
        // 3. Complete order, save to stock, and return res
        try {
            let axiosRes = await axios.get(`https://www.alphavantage.co/query?function=${detail}&symbol=${ticker}&apikey=${token}`);
            const timeSeriesDaily = axiosRes.data['Time Series (Daily)'];

            const dates = Object.keys(timeSeriesDaily);
            const firstDate = dates[0];

            const firstData = timeSeriesDaily[firstDate];
            const openValue = parseFloat(firstData['4. close']);
            const price = parseFloat(firstData['1. open']);
            console.log(openValue);
            console.log(price);


            let user = await User.findById(req.user._id);
            const { balance, stocks } = user;
            if (balance < openValue * qty) return res.status(400).json({ msg: "You do not have enough money for this purchase" });
            var existingStock = stocks.filter(obj => {
                return obj.ticker === ticker
            });
            if (existingStock.length >= 1) {
                let existingQty = existingStock[0].qty;
                var newQty = existingQty + qty;
                let newBalance = balance - openValue * qty;
                let i = stocks.indexOf(existingStock[0]);
                stocks.splice(i, 1);
                stocks.push({ ticker, qty: newQty, price:price});
                await User.updateOne(
                    { _id: req.user._id },
                    {
                        $set: {
                            balance: newBalance,
                            stocks: stocks
                        }
                    }
                );
                user = await User.findById(req.user._id);
                req.session.passport.user = user;
                res.status(200).json({ msg: "Purchase successful", stocks, balance: newBalance })
            } else {
                let newBalance = balance - openValue * qty;
                stocks.push({ ticker, qty });
                await User.updateOne(
                    { _id: req.user._id },
                    {
                        $set: {
                            balance: newBalance,
                            stocks: stocks
                        }
                    }
                );
                user = await User.findById(req.user._id);
                req.session.passport.user = user;
                res.status(200).json({ msg: "Purchase successful", stocks, balance: newBalance });
            }
        } catch (e) {
            // console.log(e);
            let errMsg;
            if (e.response && e.response.data) {
                if (errMsg === "The API key provided is not valid.") return res.status(500).json({ msg: "Oops...a server error occured and your purchase was not completed" })
                if (errMsg === 'Unknown symbol') return res.status(400).json({ msg: "Invalid ticker" });
                if (errMsg === 'Not Found') return res.status(400).json({ msg: "Invalid ticker" });
            }
        }
    } else {
        const { price } = req.body;
        // if (activation) price is below 0 USD, return bad req
        if (price < 0) return res.status(400).json({ msg: "Purchase price must be above 0" });
        // Add to user's watchlist
        let user = await User.findById(req.user._id);
        const { watchlist } = user;

        // new Watchlist Object = nWO = im lazy
        let nWO = {
            ticker,
            qty,
            price,
            orderType,
            dateCreated: Date.now()
        }

        // existing Watchlist Object = eWO = im lazy
        var eWO = watchlist.filter(obj => {
            return obj.ticker === ticker
        });

        watchlist.push(nWO);
        await User.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    watchlist
                }
            }
        );
        res.status(200).json({ msg: "Order placed", ticker, qty, price, orderType, dateCreated: nWO.dateCreated });
    }
});

// @route   GET api/trade/:ticker
// @desc    Send Get Request
router.get("/:ticker", isLoggedIn, async (req, res) => {
    try {
        const { ticker } = req.params;
        const detail = "TIME_SERIES_DAILY";
        const token = config.get("aplhaVantageAPI_Key");
        console.log(ticker, token)
        const response = await axios.get(`https://www.alphavantage.co/query?function=${detail}&symbol=${ticker}&apikey=${token}`)
        if (response && response.data) {
            const stocksData = response.data;
            console.log(stocksData);
            return res.status(200).json(stocksData);
        } else {
            return res.status(404).json({ error: "Stock Data Not Found..." })
        }
    } catch (err) {
        console.error("Error: ", err)
        return res.status(404).json({ err: "Stock Data Not Found" })
    }
})

//@route GET api/trade/news
//@desc Send the News from date to date
router.get("/news", isLoggedIn, async (req, res) => {
    try {
        const { ticker, from } = req.query;
        const token = config.get("aplhaVantageAPI_Key");

        if (from) {
            const apiUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${token}`;//`https://cloud.iexapis.com/stable/stock/${ticker}/news/last/${from}?token=${token}`;
            const response = await axios.get(apiUrl);
            console.log(response.data)
            if (response.status === 200 && response.data && response.data.length > 0) {
                console.log(response.data);
                return res.status(200).json(response.data);
            } else {
                return res.status(404).json({ error: "No news found for the specified dates." });
            }
        } else {
            return res.status(400).json({ error: "Please provide valid 'from' and 'to' date parameters." });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Server Error" });
    }
});

// @route   POST api/trade/sell
// @desc    Send Sell Request
router.post("/sell", async (req, res) => {
    try {
        const { ticker, qty } = req.body;
        const parsedQty = parseInt(qty);
        const detail = "TIME_SERIES_DAILY";
        if (!req.user || !req.user._id) {
            return res.status(401).json({ msg: 'User authentication failed' });
        }

        if (parsedQty < 1 || parsedQty > 100 || !Number.isInteger(parsedQty)) {
            return res.status(400).json({ msg: "Sale quantity must be between 1 and 100 and an integer" });
        }

        const token = config.get("aplhaVantageAPI_Key");
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        let index = null;
        for (let i = 0; i < user.stocks.length; i++) {
            if (user.stocks[i].ticker.toUpperCase() === ticker.toUpperCase()) {
                index = i;
                break;
            }
        }

        if (index === null) {
            return res.status(400).json({ msg: "You do not own shares of that ticker" });
        }

        const stock = user.stocks[index];
        if (stock.qty < parsedQty) {
            return res.status(400).json({ msg: "You do not own enough shares of that ticker" });
        }

        const axiosRes = await axios.get(`https://www.alphavantage.co/query?function=${detail}&symbol=${ticker}&apikey=${token}`);
        const timeSeriesDaily = axiosRes.data['Time Series (Daily)'];

        const dates = Object.keys(timeSeriesDaily);
        const firstDate = dates[0];

        const firstData = timeSeriesDaily[firstDate];
        const openValue = parseFloat(firstData['4. close']);

        //const oldQty = stock.qty;
        stock.qty -= parsedQty;

        const newBalance = user.balance + parsedQty * openValue;
        const newStocks = [...user.stocks];
        newStocks[index] = stock;

        await User.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    balance: newBalance,
                    stocks: newStocks
                }
            }
        );

        const updatedUser = await User.findById(req.user._id);
        req.session.passport.user = updatedUser;

        res.status(200).json({ msg: "Sale successful", stocks: newStocks, balance: newBalance });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Internal server error" });
    }
});


function isLoggedIn(req, res, next) {
    if (req.session.passport !== undefined) {
        next();
    } else {
        res.status(401).json({ msg: "authorization denied" });
    }
}

module.exports = router;