const express = require('express')
const post = require('../Controllers/ReviewsController');
const router = express.Router();

router.post('/write-review/:id', post.reviewProduct)

router.get('/get-reviews/:slug', post.getProductReviews)

module.exports=router