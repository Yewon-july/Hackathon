const express = require("express");
const router = express.Router();

const json = (req, res) => {
    const json= require('../controllers/stock_data_v2.json');
    console.log(json);
    console.log(json.stock);
    res.json(json);
}



router.get('', json);



module.exports = router;