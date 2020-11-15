const express = require("express");
const router = express.Router();

const {home, setting, postSetting, top10} = require('../controllers/home');

router.get('', home);
router.get('/setting', setting);
router.post('/setting', postSetting);
router.get('/top10', top10);

module.exports = router;