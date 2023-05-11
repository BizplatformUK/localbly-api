const {checkifEmpty, insertToDB, findOne, updateData, deleteData} = require('../../config/Dbfunctions')
const {isEmpty, DBInsert, fetch, findData, update, findShopByTypes, fetchSingleShop, countProducts, deleteItem, removefrombanner, fetchbannercontents} = require('../../config/prisma')
const {generateID, isValidPhoneNumber, isValidEmail, getAbbreviation, slugify, generateToken, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {generateAccessToken, hashPassword, checkPassword} = require('../../Utils/Auth')
const {createContainer, deleteBlob} = require('../Images/ImageController');




const Register = async(req,res)=> {
    const {name, email, number, password, role}= req.body
    try{
        
        const isValid = isValidPhoneNumber(number)
        const isEmailValid = isValidEmail(email);
        if(!isValid){return res.status(404).json({error:'Please provide a valid phone number', code:3})}
        if(!isEmailValid){return res.status(404).json({error:'Please provide a valid email address', code:3})}
        const find = await isEmpty('users', {number:number})
        if(find){return res.status(400).json({error: 'A user with this email and phone number exists', find, code:3})}
        const hashedPassword = await hashPassword(password);
        const user = {id: generateID(),name,email,number, password:hashedPassword,role}
        const data = await DBInsert('users', user)
        const response = {id:user.id, name:user.name, email:user.email, number:user.number, role:user.role}
        res.status(200).json({response, code:0})
    }catch(error){
        res.status(500).json({err:error.message, code:3})
    }
}

const fetchusers = async(req,res)=> {
    const {number, email} = req.body;
    try{
        const user = await isEmpty('users', {number:number, email:email})
        res.status(200).json(user)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getSingleUser = async(req,res)=> {
    const {id} = req.params;
    try{
        const user = await findData('users', {id})
        const response = {id:user.id, name:user.name, number:user.number, email:user.email, role:user.role}
        res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message)
    }
}


const Login = async(req,res)=> {
    const {email, password}=req.body
    try{
    const user = await findData('users', {email})
    const validPassword = await checkPassword(password, user.password)
    if(!validPassword){return res.sendStatus(401)}
    const data = {name:user.name, email:user.email, id:user.id, role:user.role}
    const token = generateAccessToken(data)
    const response = {message:'Login Success', token, data}
    res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const createShop = async(req,res)=> {
   const {name, town, type, socials, logo, location, phoneNumbers } = req.body
   const{id}=req.params;
   try{
    const user = await findData('users', {id})
    if(!user){return res.status(404).json({error:'User not found', code:3})}
    const slug = slugify(name)
    const abbr = getAbbreviation(name)
    const str = socials.join(',')
    const data = {
        id: abbr + generateID(),
        name,
        slug,
        town,
        typeID:type,
        version: 'free',
        sellingOn: str,
        logo,
        location,
        ownerID: id,
        phoneNumbers
    }
    const insert = await DBInsert('shops', data)
    if(!insert){return res.status(404).json({error:insert, code:0})}
    const response = {name:insert.shopName, id:insert.id, slug:insert.slug, type:insert.type, logo:insert.logo}
    res.status(200).json({message: 'Shop created successfully', code:0, response})

   }catch(error){
    return res.status(500).json({error:error.message, code:3})
   }
}

const addtoBanner = async(req,res)=> {
    const {name, slug, image, itemID, link} = req.body
    const {id} = req.params
    try{
        const bannerItem = await findData('shops', {id})
        if(!bannerItem){return res.status(404).json({error:'shop not found', code:3})}
        const abbr = getAbbreviation(name)
        const data = {id:abbr + generateID(), name, slug, image, itemID, shopID:id, link}
        const insert = await DBInsert('banner', data)
        if(!insert){return res.status(404).json({error:insert, code:3})}
        res.status(200).json({message: 'Item added to banner', code:0, insert})
   }catch(error){
    return res.status(500).json({error:error.message, code:3})
   }
}

const removefromBanner = async(req,res)=> {
    const {itemID} = req.body
    const {id} = req.params
    try{
        const find = await findData('banner', {shopID:id, itemID})
        if(!find){return res.status(404).json({error:'item not found', code:3})}
        const deletion = await removefrombanner(itemID)
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json({message: 'Item removed from banner successfully', id:itemID, code:0})
    }catch(error){
        return res.status(500).json({error:error.message, code:3})
    }
    
}

const fetchbanner = async(req,res)=> {
    const {id} = req.query
   try{
    const pageNumber = parseInt(req.query.page )|| 1;
    const shop = req.query.id ? await fetch('banner', {shopID:id}, pageNumber) : await fetchbannercontents(req.query.slug, pageNumber)
    if(!shop) {return shop}
    res.status(200).json(shop)

   }catch(error){
    console.log(error)
   }
}

const createStore = async(req,res)=> {
    const {name, town, logo, location, phoneNumber} = req.body
    const{id}=req.params;
    try{
     const user = await findData('users', {userID:id})
     if(!user){return res.sendStatus(404)}
     const abbr = getAbbreviation(name)
     const data = {
         id: abbr + generateID(),
         name,
         phonenumber:phoneNumber,
         email:user.email,
         location,
         town,
         userID: id,
         logo
     }
     const insert = await DBInsert('pickupstores', data)
     if(!insert){return res.sendStatus(400)}
    
     res.status(200).json({message: 'Shop created successfully', code:3, response})
 
    }catch(error){
     return res.status(500).json(error.message)
    }
 }

 const updateuser = async(req,res)=> {
    const {name, email, number} = req.body
    const {id}= req.params;
    const user = await findData('users', {id:id})
    if(!user){return res.status(404).json({error:user, code:3})}
    try{
        const params = {name, email, number}
        const result = await update(id, 'users', params);
        if(!result){return res.status(404).json({error:result, code:3})}
        const response = {name:result.name, id:result.id, email:result.email, number:result.number}
        res.status(200).json({message: 'Profile updated successfully', code:0, response})

    }catch(error){
        return res.status(500).json(error.message)
    }
}


const updatestore = async(req,res)=> {
    const {name, town, logo, location, phoneNumber, host, port, user} = req.body
    const {id}= req.params;
    const shop = await findData('pickupstores', {id:id})
    if(!shop){return res.sendStatus(404)}
    try{
        const params = {
            name,
            phonenumber:phoneNumber,
            location,
            town,
            logo,
            emailHost:host,
            emailPort:port,
            emailUser:user
        }
        const updateShop = await update(id, 'pickupstores', params);
        if(!updateShop){return res.sendStatus(404)}
        res.status(200).json({message: 'Update successful', code:0, updateShop})

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const updateShop = async(req,res)=> {
    const {name, town, logo, location, phoneNumbers, email, color} = req.body
    const {id}= req.params;
    const shop = await findData('shops', {id:id})
    if(!shop){return res.status(404).json({error:'Shop not found', code:3})}
    const imgName = extractFileNameFromUrl(shop.logo)
    const editImg = extractFileNameFromUrl(logo);
    const strSimilar = compareStrings(imgName, editImg)
    try{
        if(!strSimilar){
           const imgdelete = await deleteBlob(imgName, 'logos')
           if(imgdelete.code == 3){return res.status(500).json(imgdelete.error)}
        }
        const params = {
            name,
            town,
            logo,
            location,
            phoneNumbers,
            email,
            brandcolor:color
        }
        const result = await update(id, 'shops', params);
        if(!result){return res.status(404).json({error:result, code:3})}
        const response = {name:result.name, town:result.town, location:result.location, numbers:result.phoneNumbers, logo:result.logo, email:result.email, color:result.brandcolor}
        res.status(200).json({message: 'Shop details Updated successfully', response, code:0})

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const approveAdmin = async(req,res)=> {
    const{id}=req.params
    const admin = await findOne({_id:id}, collection)
    if(!admin){return res.sendStatus(404)}
    try{
        const params = {status:0, token:generateToken()} 
        const approve = await updateData(id, params, collection)
        if(!approve){return res.sendStatus(404)}
        res.status(200).json({message:'admin approved successfully'})
    }catch(error){
        return res.status(200).json(error)
    }
}


const suspendAdmin = async(req,res)=> {
    const{id}=req.params
    const admin = await findOne({_id:id}, collection)
    if(!admin){return res.sendStatus(404)}
    try{
        const params = {status:3, token:null}
        const approve = await updateData(id, params, collection)
        if(!approve){return res.sendStatus(404)}
        res.status(200).json({message:'admin suspended successfully'})
    }catch(error){
        return res.status(200).json(error)
    }
}

const deleteAdmin = async(req,res)=> {
    const{id}=req.params;
    const admin = await findOne({_id:id}, collection)
    if(!admin){return res.sendStatus(404)}
    try{
        const params = {_id:id}
        const approve = await deleteData(params, collection)
        if(!approve){return res.sendStatus(404)}
        res.status(200).json({message:'admin deleted successfully'})
    }catch(error){
        return res.status(200).json(error)
    }

}

const addTypes = async(req,res)=> {
    const {name, picture} = req.body;
    try{
        const slug = slugify(name)
        const abbr = getAbbreviation(name)
        const id = generateID()
        const params = {id: abbr + id, name, slug, picture}
        const insert = await DBInsert('shoptypes', params)
        res.status(200).json(insert)

    }catch(error){
        req.status(500).json(error.message)
    }
}

const updateTypes = async(req,res)=> {
    const {name, picture}=req.body;
    const {id}=req.params;
    try{
        const slug = slugify(name)
        const data = {name, slug, picture}
        const updatetype = await update(id, 'shoptypes', data);
        res.status(200).json(updatetype)
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getShopSingleShop = async(req,res)=> {
    try{
        const params = req.query.id ? {ownerID:req.query.id} : {slug:req.query.slug}
        const shop = await fetchSingleShop(params)
        if(!shop){return res.status(404).json({error:'no shop found', code:4})}
        res.status(200).json(shop)

    }catch(error){
        res.status(500).json({err:error.message, shop})
    }
}


const getShopTypes = async(req,res)=> {
    const {slug} = req.params
    try{
        const shops = await findShopByTypes(slug);
        res.status(200).json(shops)
        
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getShops = async(req,res)=> {
    const pageNumber = parseInt(req.query.page )|| 1;
    try{
        const shops = await fetch('shops', {}, pageNumber);
        let response = []
        shops.items.forEach(shop=> {
            const item = {id:shop.id, name:shop.name, slug:shop.slug, logo:shop.logo, town:shop.town, location:shop.location, numbers:shop.phoneNumbers, color:shop.brandcolor}
            response.push(item)
        })
        res.status(200).json({totalPages:shops.totalPages, response})
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getTypes = async(req,res)=> {
    const pageNumber = parseInt(req.query.page )|| 1;
    try{
        const types = await fetch('shoptypes', {}, pageNumber);
        let response = [];
        types.items.forEach(type=> {
            const item = {id:type.id, name:type.name, slug:type.slug, picture:type.picture}
            response.push(item)
        })
        res.status(200).json({total:types.total, data:response})
        
    }catch(error){
        res.status(500).json(error.message)
    }
}

const countShopProducts = async(req,res)=> {
    const {id}= req.params;
    try{
        const total = await countProducts(id)
        res.status(200).json(total)
    }catch(error){
        res.status(500).json(error.message)
    }
}



module.exports={
    Register, 
    getTypes, 
    Login, 
    createShop, 
    updateShop, 
    approveAdmin, 
    suspendAdmin, 
    deleteAdmin, 
    fetchusers, 
    createStore, 
    updatestore, 
    addTypes, 
    updateTypes, 
    getShopSingleShop, 
    countShopProducts, 
    getShopTypes,
    getSingleUser,
    updateuser,
    addtoBanner,
    removefromBanner,
    fetchbanner,
    getShops
}
