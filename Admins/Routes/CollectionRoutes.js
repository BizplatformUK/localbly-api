const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/CollectionController');
const router = express.Router();

router.post('/add-collection/:id', authenticateJwtToken, authAdmin, post.addCollection)

router.patch('/edit-collection/:id', authenticateJwtToken, authAdmin, post.editCollections)

router.delete('/delete-collection/:id', authenticateJwtToken, authAdmin, post.deleteCollection)

router.get('/get-collections', post.fetchCollections)

router.post('/add-to-collection/:id', post.addproductsToCollections)

router.patch('/edit-collection-featured/:id', authenticateJwtToken, authAdmin, post.editCollectionFeatured)

router.get('/get-featured-collections', post.fetchFeaturedCollections)

router.get('/get-unfeatured-collections', post.fetchStandardCollections)

router.get('/search-collections', post.searchCollections)

module.exports = router