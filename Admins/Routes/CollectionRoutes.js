const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/CollectionController');
const router = express.Router();

router.post('/add-collection/:id', authenticateJwtToken, authAdmin, post.addCollection)

router.patch('/edit-collection/:id', authenticateJwtToken, authAdmin, post.editCollections)

router.delete('/delete-collection/:id', authenticateJwtToken, authAdmin, post.deleteCollection)

router.get('/fetch-collections', post.fetchCollections)

router.get('/get-featured-collections', post.fetchFeaturedCollections)

router.get('/get-unfeatured-collections', post.fetchStandardCollections)

router.get('/search-collections', post.searchCollections)

module.exports = router