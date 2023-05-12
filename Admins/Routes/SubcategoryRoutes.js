const express = require('express')
const {authenticateJwtToken, authAdmin} = require('../../Utils/Auth')
const post = require('../Controllers/SubcategoryControllers');

const router = express.Router();

router.post('/add-subcategory/:id', authenticateJwtToken, authAdmin, post.addSubcategory)

router.patch('/edit-subcategory/:id', authenticateJwtToken, authAdmin, post.editSubcategory)

router.delete('/delete-subcategory/:id', authenticateJwtToken, authAdmin, post.deleteSubcategory)

router.get('/get-subcategories', post.fetchShopSubcategories)


router.post('/get-cat-subcategories/:id', post.getCatSubcategories)

router.get('/search-subcategories', post.searchSubcategories)

module.exports = router