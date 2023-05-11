const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {findData, countProducts} = require('../config/prisma')
require('dotenv').config()


function generateAccessToken(user){
   const accessToken = jwt.sign(user, process.env.JWT_SECRET, /*{expiresIn: 60 * 60}*/)
   return accessToken
}

function authenticateJwtToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
   
}

async function hashPassword(password){
    if(!password){return false}
    let salt;
    salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    return hashPassword
}

async function checkPassword(password, userPassword){
    const validPassword = await bcrypt.compare(password,userPassword);
    if(!validPassword){return 'Incorrect password'}
    return true
}

function authenticateJwtToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
   
}

function authRole(req,res,next){
    if(req.user.role !== 'super-admin'){
        return res.sendStatus(401)
    }
    next()

}

async function authAdmin(req,res,next){
    const user = await findData('users', {userID:req.user.id})
    if(user.token == null && user.status == 3){
        return res.sendStatus(401)
    }
    next() 
}

async function productLimit(req,res,next){
    const {id}=req.params;
    const shop = await findData('shops', {id})
    if(shop.version !== 'free'){return next()}
    const total = await countProducts(id)
    if(total >= 2){
        return res.status(401).json({message: 'Product limit reached upgrade to a premium package to add more products'})
    }
    next()
}

module.exports = {generateAccessToken, authenticateJwtToken, hashPassword, checkPassword, authRole, authAdmin, productLimit}