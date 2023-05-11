const express = require('express');
const {connectToDb, getDb} = require('./config/db');
const Routes = require('./Users/Routes/ShopsRoutes')
const CategoryRoutes = require('./Users/Routes/CategoryRoutes')
const Auth = require('./Admins/Routes/AuthRoutes')
const PostCategories = require('./Admins/Routes/CategoryRoutes')
const postSubcategories = require('./Admins/Routes/SubcategoryRoutes')
const offers = require('./Admins/Routes/OffersRoutes')
const services = require('./Admins/Routes/ServicesRoutes')
const clients = require('./Admins/Routes/ClientsRoutes')
const products = require('./Admins/Routes/ProductsRoutes')
const images = require('./Admins/Images/ImageRoutes')
const reviews = require('./Users/Routes/ReviewsRoutes')
const stores = require('./Admins/Routes/StoresRoutes')
const collections = require('./Admins/Routes/CollectionRoutes')
const db = require('./config/sql');
const cors = require('cors');
require('dotenv').config()
const fs = require('fs')
const app = express();

app.use(cors());

// parse application/json
app.use(express.json())
app.use((req, res, next)=> {
    console.log(req.path,req.method)
    next()
})

let database

connectToDb((err) => {
   if(!err){
    app.listen(4000, ()=> {
        console.log('listening on port 4000')
    })
   }
    database = getDb()
})

app.use('/api/shops', Routes)
app.use('/api/categories', CategoryRoutes)
app.use('/shops', Auth)
app.use('/categories', PostCategories)
app.use('/subcategories', postSubcategories)
app.use('/offers', offers)
app.use('/services', services)
app.use('/clients', clients)
app.use('/products', products)
app.use('/images', images)
app.use('/reviews', reviews)
app.use('/stores', stores)
app.use('/collections', collections)





