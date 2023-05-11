const express = require('express')
const {authenticateJwtToken, authAdmin, productLimit} = require('../../Utils/Auth')
const post = require('../Controllers/ProductsControllers');
const router = express.Router();

router.post('/add-product/:id', authenticateJwtToken, authAdmin, post.addProduct)

router.post('/add-product-images/:id', authenticateJwtToken, authAdmin, post.addProductImg)

router.patch('/edit-product/:id', authenticateJwtToken, authAdmin, post.editProduct)

router.patch('/edit-product-images/:id', authenticateJwtToken, authAdmin, post.updateProductImg)

router.delete('/delete-product-image/:id', authenticateJwtToken, authAdmin, post.deleteProductImage)

router.delete('/delete-product/:id', authenticateJwtToken, authAdmin, post.deleteProducts)

router.post('/add-to-offer/:id', authenticateJwtToken, authAdmin, post.updateProductsOffer)

router.patch('/remove-from-offer/:id', authenticateJwtToken, authAdmin, post.removeProductsFromOffer)

router.patch('/featured-category', authenticateJwtToken, post.addFeaturedCategoryProducts)

router.patch('/featured-home', authenticateJwtToken, post.addFeaturedHomeProducts)

router.patch('/remove-featured-category', authenticateJwtToken, post.removeFeaturedCategoryProducts)

router.patch('/remove-featured-home', authenticateJwtToken, post.removeFeaturedHomeProducts)

router.get('/get-shop-products', post.getshopProducts)

router.get('/search-products', post.searchProducts)

router.get('/product-offers/:slug',  post.getofferProducts)

router.get('/get-related-products/:slug', post.getRelatedproducts)

router.get('/featured-home-products/:slug', post.getFeaturedHomeProducts)

router.get('/featured-category-products/:slug', post.getFeaturedCategoryProducts)

router.get('/get-products/:slug', post.getSubcategoryProducts)

router.get('/single-product', post.getSingleProduct)

router.get('/product-images/:id', post.getProductImages)

module.exports = router