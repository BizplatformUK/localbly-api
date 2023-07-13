const express = require ('express');
const post = require('../Controllers/AuthController')
const {authenticateJwtToken, authRole, userExists, authAdmin} = require('../../Utils/Auth')

const router = express.Router();

router.post('/find', post.findshop);

router.post('/register', userExists, post.Register)

router.post('/login', post.Login)

router.patch('/password-reset', post.resetPassword)

router.get('/fetch', post.fetchusers)

router.get('/fetch-user/:id', post.getSingleUser)

router.patch('/update-user/:id', authenticateJwtToken, post.updateuser);

router.post('/add-to-banner/:id', authenticateJwtToken, authAdmin, post.addtoBanner)

router.delete('/remove-from-banner/:id', authenticateJwtToken, authAdmin, post.removefromBanner)

router.delete('/remove-multiple/:id', post.removeMultiplefromBanner);

router.get('/fetch-shop-banner', post.fetchbanner)

router.get('/search-types', post.searchShopTypes)

router.get('/get-shops', post.fetchShops)

router.get('/get-single-shop/:id', authenticateJwtToken, authAdmin, post.getShopSingleShopByID)

router.get('/fetch-shop', post.getShopSingleShop)

//router.get ('/fetch-shop-types/:slug', post.getShopTypes)

router.get('/fetch-types', post.getTypes)

router.get('/count/:id', post.countShopProducts)

router.post('/add-shop/:id',  post.createShop)

router.get('/get-admins', post.getShopAdmins)

router.post('/update-shop/:id', authenticateJwtToken, authRole, post.updateShop)

router.post('/approve-admin/:id', authenticateJwtToken, authRole, post.approveAdmin)

router.post('/suspend-admin/:id', authenticateJwtToken, authRole, post.suspendAdmin )

router.delete('/delete-admin/:id', authenticateJwtToken, authRole, post.deleteAdmin)

router.post('/add-type', authenticateJwtToken, authRole, post.addTypes)

router.patch('/update-type/:id', authenticateJwtToken, authRole, post.updateTypes)

router.get('/count-items/:id', post.countShopProducts)

module.exports = router;
