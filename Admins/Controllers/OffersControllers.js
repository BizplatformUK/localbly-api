const {isEmpty, DBInsert, findData, update, deleteItem, fetch, findByShop, search, getFeaturedOffers, bannerPresent} = require('../../config/prisma');
const {generateID, getAbbreviation, slugify, generateCouponCodes, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const addOffer = async(req,res)=> {
    const {name, img, type, discount, qty, from, to, featured} = req.body
    const {id}=req.params
    try{
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const offer = await isEmpty('offers', {name, shopID:id})
        if(offer){return res.status(400).json({error:'An offer with this name already exists please use a different name', code:3})}
        const slug = slugify(name);
        const abbr = getAbbreviation(name)
        const params = {
            id: abbr + generateID(),
            name,
            slug,
            type,
            discount,
            couponCode:type == 'OFFER' ? "na" : generateCouponCodes(name),
            quantity: qty,
            picture:img,
            validFrom:new Date(from),
            validTo: new Date(to),
            featured : featured == null ? false : true,
            shopID:id
        }
        const insert = await DBInsert('offers', params)
        if(!insert){return res.sendStatus(404)}
        const response = {id:insert.id, name:insert.name, type:insert.type, featured:insert.featured,  picture:insert.picture, date:insert.createdAt}
        res.status(200).json({message: 'Offer created successfully', code:0, response})
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

const editOffers = async(req,res)=> {
    const {offerId, name, img, type, discount, qty, from, to, featured} = req.body
    const {id} = req.params;
    try{
        const check = await findData('offers', {id:offerId, shopID:id})
        if(!check){return res.sendStatus(404)}
        const shop = await findData('shops', {id})
        const slug = slugify(name);
        const imgName = extractFileNameFromUrl(check.picture)
        const editImg = extractFileNameFromUrl(img);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'images')
            if(imgdelete.code == 3){return res.status(400).json(imgdelete.error)}
        }
        const params = {
            name,
            slug,
            type,
            discount,
            quantity:  qty,
            picture: img,
            validFrom:new Date(from),
            validTo: new Date(to),
            featured,
        }
        const offer = await update(offerId, 'offers', params)
        if(!offer){return res.sendStatus(404)}
        const response = {id:offer.id, name:offer.name,  picture:offer.picture, date:offer.createdAt}
        res.status(200).json({message: 'Offer updated successfully', code:0, response})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteOffer = async(req,res)=> {
    const {offerId} = req.body;
    const {id} = req.params;
    try{
        const find = await findData('offers', {id:offerId, shopID:id})
        if(!find){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(find.picture)
        const deleted = await deleteBlob(blobname, 'images')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const remove = await deleteItem(offerId, 'offers')
        if(!remove){return res.sendStatus(404)}
        res.status(200).json({message: 'Offer removed successfully', id:offerId, code:0})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const getShopOffers = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const currentDate = new Date();
        const pageNumber = parseInt(page)|| 1;
        let response = []
        const params = {shopID:id, validTo:{gte:currentDate}}
        const offers = await fetch('offers', params, pageNumber) ;
        await Promise.all(offers.items.map(async (offer) => {
                const isPresent = await bannerPresent(offer.id, id);
                    const item = {
                        id:offer.id, 
                        name:offer.name,
                        slug:offer.slug,
                        type:offer.type,
                        discount:offer.discount,
                        quantity:offer.quantity, 
                        picture:offer.picture,
                        from:offer.validFrom,
                        to:offer.validTo, 
                        slug:offer.slug, 
                        featured:offer.featured, 
                        description:offer.description, 
                        date:offer.createdAt,
                        isPresent
                    }
                    response.push(item)
        }));
        return res.status(200).json({total:offers.total, totalPages:offers.totalPages, response, code:0})
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getPastOffers = async(req,res)=> {
    try{
        const currentDate = new Date();
        const pageNumber = parseInt(req.query.page )|| 1;
        let response = []
            const params = {shopID:req.query.id, validTo:{lte:currentDate}}
            const offers = await fetch('offers', params, pageNumber);
            await Promise.all(offers.item.map(async (offer) => {
                const isPresent = await bannerPresent(offer.id, req.query.id);
                    const item = {
                        id:offer.id, 
                        name:offer.name, 
                        type:offer.type,
                        discount:offer.discount,
                        quantity:offer.quantity, 
                        picture:offer.picture,
                        from:offer.validFrom,
                        to:offer.validTo, 
                        slug:offer.slug, 
                        featured:offer.featured, 
                        description:offer.description, 
                        date:offer.createdAt,
                        isPresent
                    }
                    response.push(item)
            }));
            return res.status(200).json({response:{total:offers.total, data:response}, code:0})
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const filterOffers = async(req,res)=> {
    try{
        const query = req.query.type
        const pageNumber = parseInt(req.query.page )|| 1;
        let response = []
            const params = {shopID:req.query.id, type:query}
            const offers = await fetch('offers', params, pageNumber);
            await Promise.all(offers.item.map(async (offer) => {
                const isPresent = await bannerPresent(offer.id, req.query.id);
                    const item = {
                        id:offer.id, 
                        name:offer.name, 
                        type:offer.type,
                        discount:offer.discount,
                        quantity:offer.quantity, 
                        picture:offer.picture,
                        from:offer.validFrom,
                        to:offer.validTo, 
                        slug:offer.slug, 
                        featured:offer.featured, 
                        description:offer.description, 
                        date:offer.createdAt,
                        isPresent
                    }
                    response.push(item)
            }));
            return res.status(200).json({response:{total:offers.total, data:response}, code:0})
         
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getfeaturedOffers = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const currentDate = new Date();
        const pageNumber = parseInt(page )|| 1;
        let response = []
            const params = {shopID:id, featured:true,  validTo:{gte:currentDate}}
            const offers = await fetch('offers', params, pageNumber);
            await Promise.all(offers.items.map(async (offer) => {
                const isPresent = await bannerPresent(offer.id, id);
                    const item = {
                        id:offer.id, 
                        name:offer.name, 
                        type:offer.type,
                        discount:offer.discount,
                        quantity:offer.quantity, 
                        picture:offer.picture,
                        from:offer.validFrom,
                        to:offer.validTo, 
                        slug:offer.slug, 
                        featured:offer.featured, 
                        description:offer.description, 
                        date:offer.createdAt,
                        isPresent
                    }
                    response.push(item)
            }));
            return res.status(200).json({total:offers.total, totalPages:offers.totalPages, response})
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const searchOffers = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const id = req.query.id;
        const query = req.query.term;
        let response = []
            const offers = await search('offers', query, id, pageNumber);
            await Promise.all(offers.item.map(async (offer) => {
                const isPresent = await bannerPresent(offer.id, req.query.id);
                    const item = {
                        id:offer.id, 
                        name:offer.name, 
                        type:offer.type,
                        discount:offer.discount,
                        quantity:offer.quantity, 
                        picture:offer.picture,
                        from:offer.validFrom,
                        to:offer.validTo, 
                        slug:offer.slug, 
                        featured:offer.featured, 
                        description:offer.description, 
                        date:offer.createdAt,
                        isPresent
                    }
                    response.push(item)
            }));
            return res.status(200).json({response:{total:offers.total, data:response}, code:0})
        
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}


module.exports = {addOffer, editOffers, deleteOffer, getShopOffers, getPastOffers, getfeaturedOffers, filterOffers, searchOffers}