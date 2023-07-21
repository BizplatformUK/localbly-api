const {generateID, isValidEmail, getAbbreviation, slugify, generateToken, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {generateAccessToken, hashPassword} = require('../../Utils/Auth')
const {deleteBlob} = require('../Images/ImageController');
const {sendEmail, confirmAdminEmail} = require('../../Emails/Controllers/EmailController')
const {insertData,deleteMultipleItems, updateUserShopID, findShopAdmins, searchTypes, getuserBYNumber,  deleteData,  changePassword, getuserBYResetToken, totalShopProducts, getuserBYEmail, getShops, getUsers, getShopTypes, findsingleShop,deleteFromBanner, getByID, getData, updateData, getBanner, getSingleItem, getDataByParams, countItems} = require('../../config/sqlfunctions')
const bcrypt = require('bcrypt')
const axios = require('axios')


const getCountries = async (country) => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
      const data = response.data;
  
      // Extract currency data from the 'data' object
      const countryData = data[0]; // Assuming the API returns an array with a single country object
  
      const currencyData = countryData.currencies;
      const currencies = Object.keys(currencyData).map((currencyCode) => {
        const currencyInfo = currencyData[currencyCode];
        return {
          code: currencyCode,
          name: currencyInfo.name,
          symbol: currencyInfo.symbol,
        };
      });
  
      return currencies[0].symbol;
    } catch (error) {
      return error
    }
  };


const findshop = async(req,res)=> {
    try{
        const shop = await ifExist(req.body, 'users');
        return res.status(200).json(shop);
    }catch(error){
        res.status(500).json({err:error.message, code:3})
    }
}

const Register = async(req,res)=> {
    const {name, email, number, password, role, shopID}= req.body
    try{
        
        const isEmailValid = isValidEmail(email);
        if(!isEmailValid){return res.status(404).json({error:'Please provide a valid email address', code:3})}
        const userCheck = await getuserBYEmail(email);
        if(userCheck){return res.status(401).json({error: 'A user with this email address already exists, please use a different', code:3})} 
        const userNumber = await getuserBYNumber(number)
        if(userNumber){return res.status(401).json({error: 'A user with this phone number already exists please use a different one', code:3})}
        const hashedPassword = await hashPassword(password);
        const user = {
            name:name,
            email:email,
            number:number,
            password:hashedPassword,
            role:role,
            id: generateID(),
            shopID,
            approved: role === 'super-admin' ? true : false
        }
        const data = await insertData(user, 'users')
        if(!data){return res.status(500).json(data)}
        const details = {id:data.id, name:data.name}
        res.status(200).json({message: 'Registration successful', code:0, details});
        await sendEmail(email, shopID, name)
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

const getShopAdmins = async(req,res)=> {
    const approved = req.query.approved === 'true'
    try{
        const users = await findShopAdmins(req.query.id, approved)
        res.status(200).json(users)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const Login = async(req,res)=> {
    const {email, password}=req.body
    try{
    
    const user = await getuserBYEmail(email);
    if(!user){return res.status(404).json({error:'Sorry, but the email address you entered is not registered, please check and try again', code:3})}
    if(!user.approved){return res.status(401).json({error: 'Your admin account has not been approved yet', code:3})}
    const shop = await getSingleItem({id:user.shopID}, 'shops')
    const hasShop = !shop ?  false : true
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){return res.status(401).json({error:'You entered an incorrect password, please check and try again', code:3})}
    const data = {name:user.name, email:user.email, id:user.id, role:user.role}
    const token = generateAccessToken(data)
    
    const response = {user:'Login Success', token, id:user.id, name:user.name, email:user.email, role:user.role, shopSlug:shop.slug, hasShop, shopid:user.shopID}
    res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const GoogleLogin = async(req,res)=> {
    const {email}=req.body
    try{
    
    const user = await getuserBYEmail(email);
    if(!user){return res.status(404).json({error:'Sorry, but the email address you entered is not registered, please check and try again', code:3})}
    if(!user.approved){return res.status(401).json({error: 'Your admin account has not been approved yet', code:3})}
    const data = {name:user.name, email:user.email, id:user.id, role:user.role}
    const token = generateAccessToken(data)
    const shop = await getSingleItem({id:user.shopID}, 'shops')
    const hasShop = !shop ?  false : true
    const response = {user:'Login Success', token, id:user.id, name:user.name, email:user.email, role:user.role, shopSlug:shop.slug, hasShop, shopid:user.shopID}
    res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message)
    }
}




const approveAdmin = async(req,res)=> {
    const{id}=req.params
    const admin = await getByID(id, 'users')
    if(!admin){return res.status(404).json({error: 'user not found', code:3})}
    try{
        const params = {approved:true} 
        const approve = await updateData(id, params, 'users');
        if(!approve){return res.sendStatus(404)}
        res.status(200).json({message:'admin approved successfully', code:0})
        await confirmAdminEmail(admin.email, admin.shopID, admin.name)
    }catch(error){
        return res.status(500).json(error)
    }
}


const suspendAdmin = async(req,res)=> {
    const{id}=req.params
    const admin = await getByID(id, 'users')
    if(!admin){return res.sendStatus(404)}
    try{
        const params = {approved:false}
        const approve = await updateData(id, params, 'users')
        if(!approve){return res.status(404).json({error:'user not found', code:3})}
        res.status(200).json({message:'admin suspended successfully', code:0})
    }catch(error){
        return res.status(200).json(error)
    }
}

const deleteAdmin = async(req,res)=> {
    const{id}=req.params;
    const {shopID} = req.body;
    const admin = await getByID(id, 'users')
    if(!admin){return res.status(404).json({error: 'no admin found'})}
    try{
        const approve = await deleteData(id, shopID, 'users')
        if(!approve){return res.status(404).json({error:'admin not found', code:3})}
        res.status(200).json({message:'admin deleted successfully', code:0})
    }catch(error){
        return res.status(200).json(error.message)
    }
}

const createShop = async(req,res)=> {
   const {name, town, type, socials, logo, location, phoneNumbers, about, country } = req.body
   const{id}=req.params;
   try{
    const user = await getByID(id, 'users')
    if(!user){return res.status(404).json({error:'User not found', code:3})}
    //const findshop = await finshopbyName(name);
    //if(findshop){return res.status(400).json({error: 'A shop with this name already exists, please use a different name', code:3})}
    //const shop = await getSingleItem({name}, 'shops')
    //if(shop){return res.status(400).json({error:'a shop with this name already exists use a different name', code:3})}
    const currency = await getCountries(country);
    const slug = slugify(name)
    const abbr = getAbbreviation(name)
    const shopid = abbr + generateID();
    const data = {
        id:shopid,
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
        about,
        country,
        currency
    }
    const insert = await insertData(data, 'shops')
    if(!insert){return res.status(404).json({error:insert, code:0})}
    const update = await updateUserShopID(id, insert.id)
    if(!update){return res.status(400).json({error: 'unable to create shop please try again', code:3})}
    res.status(200).json({message: 'shop created successfully', code:0, insert, update});

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
        const response = {name:result.name, id:result.id, email:result.email, number:result.number}
        res.status(200).json({message: 'Profile updated successfully', code:0, response})

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
    const {name, town, logo, location, phoneNumbers, email, color, whatsappNo, fb, instagram, country} = req.body
    const {id}= req.params;
    const shop = await getByID(id, 'shops')
    if(!shop){return res.status(404).json({error:'Shop not found', code:3})}
    const currency = await getCountries(country);
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
            brandcolor:color,
            whatsappnumber:whatsappNo,
            facebooklink:fb,
            instagramlink:instagram,
            country,
            currency
        }
        const result = await updateData(id, params, 'shops');
        if(!result){return res.status(404).json({error:result, code:3})}
        //const response = {name:result.name, town:result.town, location:result.location, numbers:result.phoneNumbers, logo:result.logo, email:result.email, color:result.brandcolor}
        res.status(200).json({message: 'Shop updated successfully', code:0, result});

    }catch(error){
        return res.status(500).json(error.message)
    }
}



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



const searchShopTypes = async(req,res)=> {
    const {term}=req.query;

    try{
        const data = await searchTypes(term);
        res.status(200).json(data)
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
    resetPassword,
    searchShopTypes,
    approveAdmin,
    suspendAdmin,
    deleteAdmin,
    getShopAdmins,
    GoogleLogin
}
