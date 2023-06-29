const {generateID, isValidPhoneNumber, isValidEmail, getAbbreviation, slugify, generateToken, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {generateAccessToken, hashPassword, checkPassword} = require('../../Utils/Auth')
const {deleteBlob} = require('../Images/ImageController');
const {sendEmail} = require('../../Emails/Controllers/EmailController')
const {ifExist, insertData,deleteMultipleItems, findSingleUser,  changePassword, getuserBYResetToken, totalShopProducts, getuserBYEmail, getShops, getUsers, getShopTypes, findsingleShop,deleteFromBanner, getByID, getData, updateData, getBanner, getSingleItem, getDataByParams, countItems} = require('../../config/sqlfunctions')
const bcrypt = require('bcrypt')


const findshop = async(req,res)=> {
    try{
        const shop = await ifExist(req.body, 'users');
        return res.status(200).json(shop);
    }catch(error){
        res.status(500).json({err:error.message, code:3})
    }
}

const Register = async(req,res)=> {
    const {name, email, number, password, role}= req.body
    try{
        
        const isValid = isValidPhoneNumber(number)
        const isEmailValid = isValidEmail(email);
        if(!isValid){return res.status(404).json({error:'Please provide a valid phone number', code:3})}
        if(!isEmailValid){return res.status(404).json({error:'Please provide a valid email address', code:3})}
        const hashedPassword = await hashPassword(password);
        const user = {
            name:name,
            email:email,
            number:number,
            password:hashedPassword,
            role:role,
            id: generateID(),
        }
        const data = await insertData(user, 'users')
        if(data.code === 3){return res.status(500).json(data)}
        res.status(200).json(data);
         sendEmail(email, name)
    }catch(error){
        res.status(500).json({err:error.message, code:3})
    }
}

const fetchusers = async(req,res)=> {
    try{
        const user = await getUsers()
        res.status(200).json(user)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getSingleUser = async(req,res)=> {
    const {id} = req.params;
    try{
        const user = await getByID(id, 'users');
        const response = {id:user.id, name:user.name, number:user.number, email:user.email, role:user.role}
        res.status(200).json(response);
    }catch(error){
        return res.status(500).json(error.message)
    }
}


const Login = async(req,res)=> {
    const {email, password}=req.body
    try{
    const user = await getuserBYEmail(email);
    if(!user){return res.status(404).json({error:'Sorry, but the email address you entered is not registered, please check and try again', code:3})}
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){return res.status(401).json({error:'You entered an incorrect password, please check and try again', code:3})}
    const data = {name:user.name, email:user.email, id:user.id, role:user.role}
    const token = generateAccessToken(data)
    const response = {user:'Login Success', token, id:user.id, name:user.name, email:user.email, role:user.role}
    res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const createShop = async(req,res)=> {
   const {name, town, type, socials, logo, location, phoneNumbers } = req.body
   const{id}=req.params;
   try{
    const user = await getByID(id, 'users')
    if(!user){return res.status(404).json({error:'User not found', code:3})}
    const slug = slugify(name)
    const abbr = getAbbreviation(name)
    const data = {
        id: abbr + generateID(),
        slug:slug,
        town:town,
        version:'Free Trial',
        sellingOn:socials,
        logo:logo,
        location:location,
        ownerID:id,
        phoneNumbers:phoneNumbers,
        typeID:type,
        name:name,
    }
    const insert = await insertData(data, 'shops')
    if(!insert){return res.status(404).json({error:insert, code:0})}
    res.status(200).json(insert);

   }catch(error){
    return res.status(500).json({error:error.message, code:3})
   }
}

const addtoBanner = async(req,res)=> {
    const {name, slug, image, itemID, link} = req.body
    const {id} = req.params
    try{
        const bannerItem = await getByID(id, 'shops')
        if(!bannerItem){return res.status(404).json({error:'shop not found', code:3})}
        const abbr = getAbbreviation(name)
        const data = {id:abbr + generateID(), name, slug, image, itemID, shopID:id, link}
        const insert = await insertData(data, 'banner');
        if(!insert){return res.status(404).json({error:insert, code:3})}
        res.status(200).json({message: 'Item added to banner', code:0, insert})
   }catch(error){
    return res.status(500).json(error)
   }
}

const removefromBanner = async(req,res)=> {
    const {itemID} = req.body
    const {id} = req.params
    try{
        const find = await getSingleItem({itemID}, 'banner')
        if(!find){return res.status(404).json({error:'item not found', code:3})}
        const deletion = await deleteFromBanner(itemID, id)
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json({message: 'item removed from banner', code:0, deletion})
    }catch(error){
        return res.status(500).json(error)
    }
    
}

const removeMultiplefromBanner = async(req,res)=> {
    const {ids} = req.body
    const {id} = req.params
    try{
        const find = await getByID(id, 'shops')
        if(!find){return res.status(404).json({error:'item not found', code:3})}
        const remove = await deleteMultipleItems(ids, id, 'banner');
        res.status(200).json({message: 'success', code:0,  response:ids})
    }catch(error){
        return res.status(500).json({error:error.message, code:3})
    }
}



const fetchbanner = async(req,res)=> {
   try{
    const pageNumber = parseInt(req.query.page )|| 1;
    const shop = req.query.id ? await getDataByParams({shopID:req.query.id}, 'banner', pageNumber) : await getBanner(req.query.slug)
    if(!shop) {return shop}
    res.status(200).json(shop)

   }catch(error){
    console.log(error)
   }
}


 const updateuser = async(req,res)=> {
    const {name, email, number} = req.body
    const {id}= req.params;
    const user = await getByID(id, 'users')
    if(!user){return res.status(404).json({error:user, code:3})}
    try{
        const params = {name, email, number}
        const result = await updateData(id, params, 'users');
        if(!result){return res.status(404).json({error:result, code:3})}
        //const response = {name:result.name, id:result.id, email:result.email, number:result.number}
        res.status(200).json({message: 'Profile updated successfully', code:0, result})

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const resetPassword = async(req,res)=> {
    const {token, newPassword} = req.body
    const user = await getuserBYResetToken(token)
    if(!user){return res.status(404).json({error:user, code:3})}
    try{
        const hashedPassword = await hashPassword(newPassword);
        const params = {resetToken:'na', password:hashedPassword}
        const result = await changePassword(params, token);
        if(!result){return res.status(404).json({error:result, code:3})}
        res.status(200).json({message: 'password changed successfully', code:0, result})

    }catch(error){
        return res.status(500).json(error.message)
    }
}


const updateShop = async(req,res)=> {
    const {name, town, logo, location, phoneNumbers, email, color} = req.body
    const {id}= req.params;
    const shop = await getByID(id, 'shops')
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
        const result = await updateData(id, params, 'shops');
        if(!result){return res.status(404).json({error:result, code:3})}
        //const response = {name:result.name, town:result.town, location:result.location, numbers:result.phoneNumbers, logo:result.logo, email:result.email, color:result.brandcolor}
        res.status(200).json({message: 'Shop updated successfully', code:0, result});

    }catch(error){
        return res.status(500).json(error.message)
    }
}

/*
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

}*/

const addTypes = async(req,res)=> {
    const {name, picture} = req.body;
    try{
        const slug = slugify(name)
        const abbr = getAbbreviation(name)
        const id = generateID()
        const params = {id: abbr + id, name, slug, picture}
        const insert = await insertData(params, 'shoptypes')
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
        const updatetype = await updateData(id, data, 'shoptypes');
        res.status(200).json(updatetype)
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getShopSingleShop = async(req,res)=> {
    try{
        const params = req.query.id ? {ownerID:req.query.id} : {slug:req.query.slug}
        const shop = await getSingleItem(params, 'shops')
        if(!shop){return res.status(404).json({error:'no shop found', code:4})}
        res.status(200).json(shop)

    }catch(error){
        res.status(500).json(error)
    }
}



const getShopSingleShopByID = async(req,res)=> {
    const {id} = req.params;
    try{
        const shop = await findsingleShop(id)
        if(!shop){return res.status(404).json({error:'no shop found', code:4})}
        res.status(200).json(shop)

    }catch(error){
        res.status(500).json(error)
    }
}


/*const getShopTypes = async(req,res)=> {
    const {slug} = req.params
    try{
        const shops = await findShopByTypes(slug);
        res.status(200).json(shops)
        
    }catch(error){
        res.status(500).json(error.message)
    }
}*/

const fetchShops = async(req,res)=> {
    const pageNumber = parseInt(req.query.page )|| 1;
    try{
        const shops = await getShops(pageNumber);
        res.status(200).json(shops)
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getTypes = async(req,res)=> {
    const pageNumber = parseInt(req.query.page )|| 1;
    try{
        const types = await getShopTypes(pageNumber);
        res.status(200).json(types)
        
    }catch(error){
        res.status(500).json(error.message)
    }
}

const countShopProducts = async(req,res)=> {
    const {id}= req.params;
    try{
        const total = await totalShopProducts(id)
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
    fetchusers, 
    addTypes, 
    updateTypes, 
    getShopSingleShop, 
    countShopProducts, 
    getSingleUser,
    updateuser,
    addtoBanner,
    removefromBanner,
    fetchbanner,
    fetchShops,
    findshop,
    removeMultiplefromBanner,
    getShopSingleShopByID,
    resetPassword
}
