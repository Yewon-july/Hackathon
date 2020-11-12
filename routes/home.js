const express = require("express");
const router = express.Router();

const {home, setting, postSetting} = require('../controllers/home');

router.get('', home);
router.get('/setting', setting);
router.post('/setting', postSetting);

module.exports = router;