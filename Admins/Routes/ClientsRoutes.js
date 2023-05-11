const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/ClientsControllers');
const router = express.Router();

router.post('/add-client/:id', authenticateJwtToken, post.addClient)

router.patch('/edit-client/:id', authenticateJwtToken, post.editClient)

router.delete('/delete-client/:id', authenticateJwtToken, post.deleteClient)

router.get('/get-clients', post.fetchClients)


module.exports = router