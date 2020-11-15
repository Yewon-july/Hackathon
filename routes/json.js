const express = require("express");
const router = express.Router();

const json = (req, res) => {
    const json= require('../controllers/stock_data_2.json');

    res.json(json);
}



router.get('', json);



module.exports = router;