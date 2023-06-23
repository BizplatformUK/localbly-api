const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/CategoryControllers');
const router = express.Router();

router.post('/add-category/:id', /*authenticateJwtToken, authAdmin,*/ post.addCategory)

router.patch('/edit-category/:id', /*authenticateJwtToken, authAdmin,*/ post.editCategory)

router.delete('/delete-category/:id',authenticateJwtToken, authAdmin, post.deleteCategory)

router.delete('/delete-multiple-categories/:id', authenticateJwtToken, authAdmin, post.deleteMultipleCategories)

router.patch('/remove-from-featured', /*authenticateJwtToken, authAdmin,*/ post.removeFromFeatured)

router.patch('/add-to-featured/:id', /*authenticateJwtToken, authAdmin,*/ post.makCategoryFeatured)

router.get('/get-categories', post.getShopCategories)

router.get('/featured-shop-categories', post.getFeaturedShopCategories)

router.get('/unfeatured-shop-categories', post.getunFeaturedShopCategories)

router.get('/search-categories', post.searchCategories)


module.exports=router