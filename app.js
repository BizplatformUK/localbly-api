const express = require('express');
const Auth = require('./Admins/Routes/AuthRoutes')
const PostCategories = require('./Admins/Routes/CategoryRoutes')
const postSubcategories = require('./Admins/Routes/SubcategoryRoutes')
const offers = require('./Admins/Routes/OffersRoutes')
const services = require('./Admins/Routes/ServicesRoutes')
const clients = require('./Admins/Routes/ClientsRoutes')
const products = require('./Admins/Routes/ProductsRoutes')
const images = require('./Admins/Images/ImageRoutes')
const collections = require('./Admins/Routes/CollectionRoutes')
const emails = require('./Emails/Routes/EmailRoutes')


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


  app.listen(process.env.PORT, ()=> {
    console.log('listening on port 8080')
  })


app.use('/auth', Auth)
app.use('/categories', PostCategories)
app.use('/subcategories', postSubcategories)
app.use('/offers', offers)
app.use('/services', services)
app.use('/clients', clients)
app.use('/products', products)
app.use('/images', images)
app.use('/collections', collections)
app.use('/email', emails)






