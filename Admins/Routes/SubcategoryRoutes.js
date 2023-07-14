const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/SubcategoryControllers');

const router = express.Router();

router.post('/add-subcategory/:id', authenticateJwtToken, authAdmin, post.addSubcategory)

router.patch('/edit-subcategory/:id', authenticateJwtToken, authAdmin, post.editSubcategory)

router.delete('/delete-subcategory/:id', authenticateJwtToken, authAdmin, post.deleteSubcategory)

router.get('/get-subcategories', post.getShopSubcategories)

router.delete('/delete-subcategories/:id', post.deleteMultipleSubcategories)

router.get('/get-cat-subcategories', post.getCatSubcategories)

router.get('/search-subcategories', post.searchSubcategories)

module.exports = router