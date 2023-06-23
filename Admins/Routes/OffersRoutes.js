const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/OffersControllers');
const router = express.Router();

router.post('/add-offer/:id', authenticateJwtToken, authAdmin, post.addOffer)

router.patch('/edit-offer/:id', authenticateJwtToken, authAdmin, post.editOffers)

router.delete('/delete-offer/:id', authenticateJwtToken, authAdmin, post.deleteOffer)

router.patch('/add-to-featured/:id', authenticateJwtToken, authAdmin, post.addToFeatured)

router.delete('/remove-from-featured', authenticateJwtToken, authAdmin, post.removeFeatured)

router.post('/add-to-offers/:id', /*authenticateJwtToken, authAdmin,*/ post.addProductstoOffers)

router.get('/get-offers',   post.getShopOffers)


router.get('/get-past-offers', post.getPastOffers)


router.get('/get-featured-offers', post.getfeaturedOffers)

router.get('/filter-offers', post.filterOffers)

router.get('/search-offers', post.searchOffers)

module.exports = router;