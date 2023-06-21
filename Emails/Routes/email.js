const express = require ('express');
const {sendEmail} = require('../Controllers/EmailController')

const router = express.Router();

router.post('/send',  sendEmail);

module.exports = router;