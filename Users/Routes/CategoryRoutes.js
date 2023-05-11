const express = require ('express');
const fetch = require('../Controllers/CategoriesController');

const router = express.Router()

router.get('/', fetch.FetchCategories)

router.post('/category', fetch.fetchSingleCategory)

router.get('/featured-categories', fetch.fetchFeaturedCategories)

router.post('/subcategories', fetch.FetchSubcategories)

router.post('/subcategory', fetch.fetchSingleSubCategory)

module.exports = router