const {generateID, getAbbreviation, slugify, generateCouponCodes, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const {insertData, updateData, addMultipleProductsToOffers, removeMultipleProductsFromOffers, deleteData, filterOfferTypes, filterOfferFeatured, findPastOffers, dbCheck, isPresentInBanner, findFeaturedOffers, findCurrentOffers, getDataByDate, getByID, getDataByMultipleParams, searchData, getSingleItem} = require('../../config/sqlfunctions')

const addOffer = async(req,res)=> {
    const {name, img, type, discount, qty, from, to, featured} = req.body
    const {id}=req.params
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const items = {name, id}
        const find = await dbCheck(items, 'offers')
        if(find){return res.status(400).json({error:'An offer with this name already exists please use a different name', code:3})}
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
        const insert = await insertData(params, 'offers')
        if(!insert){return res.sendStatus(404)}
        //const response = {id:insert.id, name:insert.name, type:insert.type, featured:insert.featured,  picture:insert.picture, date:insert.createdAt}
        res.status(200).json({message: 'Offer created successfully', code:0, response:insert})
    }catch(error){
        return res.status(500).json(error)
    }
}

const editOffers = async(req,res)=> {
    const {offerId, name, img, type, discount, qty, from, to, featured} = req.body
    const {id} = req.params;
    try{
        const check = await getByID(offerId, 'offers')
        if(!check){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops',)
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
        const offer = await updateData(offerId, params, 'offers')
        if(!offer){return res.sendStatus(404)}
        //const response = {id:offer.id, name:offer.name,  picture:offer.picture, date:offer.createdAt}
        res.status(200).json({message: 'Offer updated successfully', code:0, response:offer})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const removeFeatured = async(req,res)=> {
    const {offid, shopid} = req.query;
    try{
        const category = await getByID(offid,'offers');
        if(!category){return res.sendStatus(404)}
        const shop = await getByID(shopid, 'shops')
        if(!shop){return res.sendStatus(404)}
        const data = {featured:false}
        const edit = await updateData(offid, data, 'offers')
        if(!edit){res.sendStatus(500)}
        const item = await getSingleItem({id:offid}, 'offers');
        //const response = {id:item.id, name:item.name, slug:item.slug, picture:item.picture, featured:item.featured}
        res.status(200).json({message:'offer updated successfully', code:0, item:edit});
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const addProductstoOffers = async(req,res)=> {
    const {ids, offid} = req.body;
    const {id}=req.params;
    try{
        const collection = await getByID(offid, 'offers')
        if(!collection){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
       
        const data = await addMultipleProductsToOffers(ids, id, offid);
        if(!data){return res.sendStatus(500)}
        res.status(200).json({message: 'success', code:0, items:ids})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}


const removeProductstoOffers = async(req,res)=> {
    const {ids} = req.body;
    const {id}=req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
       
        const data = await removeMultipleProductsFromOffers(ids, id);
        if(!data){return res.sendStatus(500)}
        res.status(200).json({message: 'success', code:0, items:ids})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const addToFeatured = async(req,res)=> {
    const {offid} = req.body;
    const {id}=req.params;
    try{
        const cat = {id:offid, shopID:id}
        const category = await getByID(offid,'offers');
        if(!category){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const data = {featured:true}
        const edit = await updateData(offid, data, 'offers')
        if(!edit){res.sendStatus(500)}
        res.status(200).json({message: 'success', code:0, item:edit});
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteOffer = async(req,res)=> {
    const {offerId} = req.body;
    const {id} = req.params;
    try{
        const find = await dbCheck({id:offerId, shopID:id}, 'offers')
        if(!find){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(find.picture)
        const deleted = await deleteBlob(blobname, 'images')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const remove = await deleteData(offerId, 'offers')
        if(!remove){return res.sendStatus(404)}
        res.status(200).json({message: 'Offer removed successfully', id:offerId, code:0})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const getShopOffers = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(page)|| 1;
        let response = []
        const offers = await findCurrentOffers(id, pageNumber) ;
        const list = offers.items;
        for (const offer of list) {
            const isPresent = await isPresentInBanner(offer.id, id);
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
            };
            response.push(item);
        }
        return res.status(200).json({totalPages:offers.totalPages, items:response})
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getPastOffers = async(req,res)=> {
    const {id, page} = req.query;
    try{
  
        const pageNumber = parseInt(page )|| 1;
        let response = []
        const offers = await findPastOffers(id, pageNumber);
        const list = offers.items;
        for (const offer of list) {
            const isPresent = await isPresentInBanner(offer.id, id);
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
            };
            response.push(item);
        }
        return res.status(200).json({totalPages:offers.totalPages, items:response})
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const filterOffers = async(req,res)=> {
    const {type, id, page} = req.query;
    try{
        const pageNumber = parseInt(page)|| 1;
        let response = []
            const offers = await filterOfferTypes(id, type, pageNumber);
            const list = offers.items;
            for (const offer of list) {
                const isPresent = await isPresentInBanner(offer.id, id);
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
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:offers.totalPages, items:response})
         
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getfeaturedOffers = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        let response = []
            const offers = await filterOfferFeatured(id, pageNumber);
            const list = offers.items;
            for (const offer of list) {
                const isPresent = await isPresentInBanner(offer.id, id);
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
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:offers.totalPages, items:response})
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
            const offers = await searchData(query, 'offers', pageNumber, id);
            const list = offers.items;
            for (const offer of list) {
                const isPresent = await isPresentInBanner(offer.id, id);
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
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:offers.totalPages, items:response})
        
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}


module.exports = {addOffer, removeProductstoOffers, addProductstoOffers, addToFeatured, removeFeatured, editOffers, deleteOffer, getShopOffers, getPastOffers, getfeaturedOffers, filterOffers, searchOffers}