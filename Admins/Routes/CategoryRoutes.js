const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/CategoryControllers');
const router = express.Router();

router.post('/add-category/:id', authenticateJwtToken, authAdmin, post.addCategory)

router.patch('/edit-category/:id', authenticateJwtToken, authAdmin, post.editCategory)

router.delete('/delete-category/:id', authenticateJwtToken, authAdmin, post.deleteCategory)

router.get('/get-categories', post.getShopCategories)

router.get('/featured-categories', post.getFeaturedCategories)

router.get('/featured-shop-categories', post.getFeaturedShopCategories)

router.get('/unfeatured-shop-categories', post.getunFeaturedShopCategories)

router.get('/search-categories', post.searchCategories)


module.exports=router