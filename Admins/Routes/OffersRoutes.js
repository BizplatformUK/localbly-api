const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/OffersControllers');
const router = express.Router();

router.post('/add-offer/:id', authenticateJwtToken, authAdmin, post.addOffer)

router.patch('/edit-offer/:id', authenticateJwtToken, authAdmin, post.editOffers)

router.delete('/delete-offer/:id', authenticateJwtToken, authAdmin, post.deleteOffer)

router.get('/get-offers', post.getShopOffers)

router.get('/get-past-offers', post.getPastOffers)

router.get('/featured-offers/:slug', post.featuredOffers)

router.get('/get-featured-offers', post.getfeaturedOffers)

router.get('/filter-offers', post.filterOffers)

router.get('/search-offers', post.searchOffers)

module.exports = router;