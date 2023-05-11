const express = require ('express');
const fetch = require('../Controllers/ShopsControllers');

const router = express.Router()

router.get('/', fetch.getAllShops)

router.get('/shop', fetch.getSingleShop)

router.get('/shop-types/:types', fetch.getShopsByTypes)

router.post('/reviews', fetch.PostBizReview)

router.get('/getreviews/:id', fetch.getShopReviews)

router.post('/review-product/:id', fetch.reviewProduct)



module.exports = router