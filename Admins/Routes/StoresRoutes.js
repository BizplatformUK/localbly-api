const express = require ('express');
const {createPackage, fetchPackages, addSubscription, selectSubscirber, sendEmails} = require('../Controllers/StoresController')
const {authenticateJwtToken} = require('../../Utils/Auth')

const router = express.Router();

router.post('/add-package/:id', authenticateJwtToken, createPackage)

router.get('/fetch-packages/:id', fetchPackages)

router.post('/subscribe/:id', addSubscription)

router.get('/select-subscribers/:id', selectSubscirber)

router.get('/subscribers', sendEmails)

module.exports = router