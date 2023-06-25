const express = require ('express');
const {sendEmail, resetPassword} = require('../Controllers/EmailController')

const router = express.Router();

router.post('/send',  sendEmail);

router.post('/reset-password/:id', resetPassword )

module.exports = router;