const express = require ('express');
const post = require('../Controllers/AuthController')
const {authenticateJwtToken, authRole} = require('../../Utils/Auth')

const router = express.Router();


router.post('/register', post.Register)

router.post('/login', post.Login)

router.post('/fetch', post.fetchusers)

router.get('/fetch-user/:id', post.getSingleUser)

router.patch('/update-user/:id', authenticateJwtToken, post.updateuser);

router.post('/add-to-banner/:id', authenticateJwtToken, post.addtoBanner)

router.delete('/remove-from-banner/:id', post.removefromBanner)

router.get('/fetch-shop-banner', post.fetchbanner)

router.get('/get-shops', post.getShops)

router.get('/fetch-shop', post.getShopSingleShop)

router.get ('/fetch-shop-types/:slug', post.getShopTypes)

router.get('/fetch-types', post.getTypes)

router.get('/count/:id', post.countShopProducts)

router.post('/add-shop/:id', authenticateJwtToken, authRole, post.createShop)

router.post('/add-store/:id', authenticateJwtToken, authRole, post.createStore)

router.post('/update-store/:id', authenticateJwtToken, post.updatestore)

router.post('/update-shop/:id', authenticateJwtToken, authRole, post.updateShop)

//router.post('/approve-admin/:id', authenticateJwtToken, authRole, post.approveAdmin)

//router.post('/suspend-admin/:id', authenticateJwtToken, authRole, post.suspendAdmin )

//router.delete('/delete-admin/:id', authenticateJwtToken, authRole, post.deleteAdmin)

router.post('/add-type', authenticateJwtToken, authRole, post.addTypes)

router.patch('/update-type/:id', authenticateJwtToken, authRole, post.updateTypes)



module.exports = router;
