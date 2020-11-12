const { User, Account } = require("../models");

const home = async (req, res, next) => {
    console.log(req.session.user);
    await Account.findAll({
        where: {
            userId : req.session.user.id
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
            id : req.session.user.id
        }
    }).then(user => {
        console.log(user);
        res.render('setting', {
            user : user
        });
    }).catch(error => {
        console.log(error);
        next(error);
    });
    
}

const postSetting = async (req, res, next) => {
    const {amount, date, period} = req.body;
    console.log(req.body);
    await User.update({
        transferAmount : parseInt(amount),
        transferPeriod: parseInt(period),
        transferDate: date
    },{
        where: {
            id: req.session.user.id
        }
    }).then(user =>{
        res.redirect('/home/setting');
    }).catch(error => {
        console.log(error);
        next(error);
    });
}

module.exports = {
    home,
    setting,
    postSetting
};