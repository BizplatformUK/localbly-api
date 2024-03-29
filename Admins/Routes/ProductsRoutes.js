const express = require('express')
const {authenticateJwtToken, authAdmin, productLimit} = require('../../Utils/Auth')
const post = require('../Controllers/ProductsControllers');
const router = express.Router();

router.post('/add-product/:id', authenticateJwtToken, authAdmin, post.addProduct)

router.patch('/edit-product/:id', authenticateJwtToken, authAdmin, post.editProduct)


router.delete('/delete-product/:id', authenticateJwtToken, authAdmin, post.deleteProducts)


router.patch('/featured-category', authenticateJwtToken, post.addFeaturedCategoryProducts)

router.patch('/remove-featured-category', authenticateJwtToken, post.removeFeaturedCategoryProducts)

router.delete('/remove-multiple-featured/:id', post.removeFeatured)

router.post('/add-multiple-featured/:id', post.addFeatured);

router.get('/get-shop-products', post.getshopProducts)

router.get('/search-products', post.searchProducts)

router.get('/get-offer-products',  post.fetchofferProducts)

router.get('/get-related-products', post.getRelatedproducts)

router.get('/get-featured-home-products', post.getFeaturedHomeProducts)

router.get('/get-standard-products', post.getstandardproducts)

router.get('/get-featured-category-products', post.getFeaturedCategoryProducts)

router.get('/get-products', post.getSubcategoryProducts)

router.get('/get-single-product', post.getSingleProduct)

router.get('/get-collections-products', post.getCollectionsProducts)

router.get('/get-all-collections-products', post.getAllCollectionsProducts)

router.get('/get-not-collections', post.getProductsNotinCollection)

router.get('/get-not-offers', post.getProductsNotinOffer)

module.exports = router