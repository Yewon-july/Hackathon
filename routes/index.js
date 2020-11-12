const express = require("express");
const router = express.Router();

const loginRouter = require('./login');
const homeRouter = require('./home');
const signupRouter = require('./signup');

router.use('/home', homeRouter);
router.use('/', loginRouter);
router.use('/signup', signupRouter);

module.exports = router;