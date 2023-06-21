const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {ifExist, countItems, getByID} = require('../config/sqlfunctions')
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

function userExists(req,res,next){
    const {number, email} = req.body;
    const data = {number, email}
    const user = ifExist(data, 'users');
    if(user){return res.status(400).json({error:'user already exists', code:3})}
    next();
}

async function authAdmin(req,res,next){
    const user = await getByID(req.user.id, 'users')
    if(user.token == null && user.status == 3){
        return res.sendStatus(401)
    }
    next() 
}

async function productLimit(req,res,next){
    const {id}=req.params;
    const shop = await getByID(id, 'shops')
    if(shop.version !== 'Free Trial'){return next()}
    const total = await countItems(id, 'products')
    if(total >= 50){
        return res.status(401).json({message: 'Product limit reached upgrade to a premium package to add more products'})
    }
    next()
}

module.exports = {generateAccessToken, userExists, authenticateJwtToken, hashPassword, checkPassword, authRole, authAdmin, productLimit}