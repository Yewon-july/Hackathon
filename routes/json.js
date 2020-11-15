const express = require("express");
const router = express.Router();

const json = (req, res) => {
    const json= require('../controllers/stock_data_2.json');
    console.log(json);
    console.log(json.stock);
    console.log(json.stock.dataValues);

    res.json(json);
}



router.get('', json);



module.exports = router;