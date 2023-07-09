const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/ServicesControllers');
const router = express.Router();

router.post('/add-service/:id', /*authenticateJwtToken, authAdmin,*/ post.addService)

router.patch('/edit-service/:id', authenticateJwtToken, authAdmin, post.editService)

router.delete('/delete-service/:id', authenticateJwtToken, authAdmin, post.deleteService)

router.get('/get-services', post.fetchServices)

router.get('/search-services', post.searchServices)


module.exports = router