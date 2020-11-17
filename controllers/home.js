const { User, Account, Stock } = require("../models");

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const home = async (req, res, next) => {
    // console.log(req.session.user);
    await Account.findAll({
        where: {
            userId : 1//req.session.user.id
        }
    }).then(accounts => {
        console.log(accounts);
        res.render('home', {
            userName: req.session.user.name,
            accounts: accounts
        });
    }).catch(error => {
        console.error(error);
        next(error);
    });
};

const setting = async (req, res, next) => {
    await User.findOne({
        where: {
            id : 1//,req.session.user.id
        }
    }).then(user => {
        // console.log(user);
        res.render('setting', {
            user : user
        });
    }).catch(error => {
        console.log(error);
        next(error);
    });
    
}

const postSetting = async (req, res, next) => {
    const {amount, date, period, profits} = req.body;

    console.log("profits: \n" + profits);
    await User.update({
        transferAmount : parseInt(amount),
        transferPeriod: parseInt(period),
        transferDate: date,
        expectedProfits: parseInt(profits)
    },{
        where: {
            id: 1//req.session.user.id
        }
    }).then(user =>{
        res.redirect('/home/setting');
    }).catch(error => {
        console.log(error);
        next(error);
    });
}

const top10 = async (req, res) => {
    var request=require('request');
    await request('http://localhost:8000/json', (err, response, obj) => {
        if(!err&&response.statusCode==200){
            const parsed = JSON.parse(obj);
            // console.log(parsed);
            // console.log(parsed.stock);
            // console.log(parsed.stock.dataValues);


            res.render('top10', {
                data: parsed.stock.dataValues
            });
        }
        
    });
    
}
const buyForm = (req, res) => {
    const {stock_name, stock_number, stock_price, stock_percent, market_code} = req.body;
    console.log("market_code: " + market_code);
    res.render('buy', {
        stock_name: stock_name, 
        stock_number: stock_number,
        stock_price: stock_price,
        stock_percent: stock_percent,
        market_code: market_code
    });
}

const report = async(req, res, next) => {
    let query = "" + "select stockName, sum(stockAmount) as 'stockAmount', avg(stockPrice) as 'stockPrice' from stocks  where userId=1 group by stockName";
    await sequelize.query(query, 
        { type: Sequelize.QueryTypes.SELECT}
    ).then((stocks)=>{
        res.render('report', {
            stocks: stocks
        })
    })
}

const buy = async(req, res, next) => {
    const {stock_name, stock_number, stock_price, amount,market_code} = req.body;
    await Stock.create({
        stockNumber: stock_number,
        stockName: stock_name,
        stockPrice: Number(stock_price),
        stockAmount: Number(amount),
        userId: 1,//eq.session.user.id,
        marketCode: market_code
    }).then(async() => {
        await Account.findOne({
            where: {
                userId: 1,
                bankName: "project"
            }
        }).then((account) => {
                console.log(account);
                var balance = account.dataValues.balance-stock_price*amount;
                Account.update({
                    balance : balance
                }, {
                    where: {
                        userId: 1,//req.session.user.id,
                        bankName: "project"
                    }
                });
        });
    }).then(() => {
        res.redirect('/home/report');
    }).catch(error => {
        console.error(error);
        return next(error);
    });
}
/*

function kosdaqs(){Stock.findAll({
    where: {
        userId: 1,
        marketCode: 'kosdaq'
    }
}).then(async(kosdaq) => {
    let stockNumbers = ''
    for(let i=0; i<kosdaq.length; i++){
        stockNumbers += kosdaq[i].dataValues.stockNumber + ','
    }
    stockNumbers = stockNumbers.substr(0, stockNumbers.length-1);

    let request = require('request');
    let url = 'https://sandbox-apigw.koscom.co.kr/v2/market/multiquote/stocks/{marketcode}/price'.replace(/{marketcode}/g, encodeURIComponent('kosdaq'));
    const queryParams = url + '?' +  encodeURIComponent('isuCd') + '=' + encodeURIComponent(stockNumbers)+ '&' +  encodeURIComponent('apikey') + '=' + encodeURIComponent('l7xx16014a467a924424b74e86bb2bdf86f2');

    await request(queryParams, (err, response, obj) => {
        if(!err&&response.statusCode==200){
            const parsed = JSON.parse(obj);
            let arr = new Array();
            for(let j=0; j<parsed.result.isulist.length; j++){
                let tmp = Object();
                tmp.trdPrc = parsed.result.isulist[j].trdPrc;
                tmp.isuSrtCd = parsed.result.isulist[j].isuSrtCd;
                arr.push(tmp);
            }
            console.log("parsed.result.isulist-kosdaq: \n" + JSON.stringify(arr));

            return JSON.stringify(arr);
        }
    });
}).catch(error => {
    console.error(error);
    next(error);
})}

function kospis (){  
    Stock.findAll({
    where: {
        userId: 1,
        marketCode: 'kospi'
    }
}).then(async (kospi_stocks) => {
    let stockNumbers = ''
    for(let i=0; i<kospi_stocks.length; i++){
        stockNumbers += kospi_stocks[i].dataValues.stockNumber + ','
    }
    stockNumbers = stockNumbers.substr(0, stockNumbers.length-1);

    let request = require('request');
    let url = 'https://sandbox-apigw.koscom.co.kr/v2/market/multiquote/stocks/{marketcode}/price'.replace(/{marketcode}/g, encodeURIComponent('kospi'));
    const queryParams = url + '?' +  encodeURIComponent('isuCd') + '=' + encodeURIComponent(stockNumbers)+ '&' +  encodeURIComponent('apikey') + '=' + encodeURIComponent('l7xx16014a467a924424b74e86bb2bdf86f2');

    await request(queryParams, (err, response, obj) => {
        if(!err&&response.statusCode==200){
            const parsed = JSON.parse(obj);
            let arr = new Array();
            for(let j=0; j<parsed.result.isulist.length; j++){
                let tmp = Object();
                tmp.trdPrc = parsed.result.isulist[j].trdPrc;
                tmp.isuSrtCd = parsed.result.isulist[j].isuSrtCd;
                arr.push(tmp);
            }
            console.log("parsed.result.isulist-kospi: \n" + JSON.stringify(arr))
            return JSON.stringify(arr);
        }
    })
}).catch(error => {
    console.error(error);
    next(error);
})
}

function stocks() {
    Stock.findAll({
        where: {
            userId: 1
        }
    }).then(stocks => {
        return stocks;
    }).catch(error => {
        console.error(error);
        next(error);
    })
}
*/

// });
// const report = async(req, res, next) => {
//     res.render('report', {
//         kospis: kospis,
//             kosdaqs: kosdaqs,
//             stocks: stocks
//         }
//     )};

//     res.render
//     console.log(kospis);
//     console.log(kosdaqs);
//     console.log(stocks);



// }
module.exports = {
    home,
    setting,
    postSetting,
    top10,
    buyForm,
    buy,
    report
};