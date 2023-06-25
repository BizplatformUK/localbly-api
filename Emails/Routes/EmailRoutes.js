const express = require ('express');
const {sendEmail, resetPassword} = require('../Controllers/EmailController')

const router = express.Router();

router.post('/send',  sendEmail);

router.post('/reset-password', resetPassword )

module.exports = router;