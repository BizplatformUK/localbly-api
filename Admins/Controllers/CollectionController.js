const {generateID, getAbbreviation, slugify, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const {isEmpty, DBInsert, findData, update, deleteItem, fetch, search, findByShop} = require('../../config/prisma');

const addCollection = async(req,res)=> {
    const {name, image, featured} = req.body
    const {id}= req.params;
    try{
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const service = await isEmpty('collections', {name, shopID:id})
        if(service){return res.status(400).json({error: 'A collection with this name already exists please use a different name', code:3})}
        const slug = slugify(name)
        const abbr = getAbbreviation(name)
        const params = {
            id:abbr + generateID(),
            name,
            slug,
            featured,
            shopID:id,
            picture: image
        }
        const insert = await DBInsert('collections', params)
        if(!insert){return res.sendStatus(400)}
        const response = {id:insert.id, name:insert.name, picture:insert.picture, featured:insert.featured, date:insert.createdAt}
        res.status(200).json({message: 'Collection uploaded successfully', code:0, response})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const editCollections = async(req,res)=> {
    const {colId, name, image, featured} = req.body;
    const {id}=req.params;
    try{
        const collection = await findData('collections', {id:colId, shopID:id})
        if(!collection){return res.sendStatus(404)}
        const shop = await findData('shops', {id})
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
        const imgName = extractFileNameFromUrl(collection.picture)
        const editImg = extractFileNameFromUrl(image);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'collections')
            if(imgdelete.code == 3){return res.status(400).json(imgdelete.error)}
        }
        const slug = slugify(name)
        const params = {
            name,
            slug,
            featured,
            picture:image
        }
        const data = await update(colId, 'collections', params)
        if(!data){return res.sendStatus(500)}
        const response =  {id:data.id, name:data.name, picture:data.picture, featured:data.featured, date:data.createdAt}
        res.status(200).json({message:'collection updated successfully', code:0, response})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteCollection = async(req,res)=> {
    const {colId} = req.body;
    const {id}=req.params;
    try{
        const collection = await findData('collections', {id:colId, shopID:id})
        if(!collection){return res.sendStatus(404)}
        const deletion = await deleteItem(colId, 'collections')
        const blobname = extractFileNameFromUrl(collection.picture)
        const deleted = await deleteBlob(blobname, 'collections')
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json({message:'collection deleted successfully', id:colId, code:0})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const fetchCollections = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const params = {shopID:req.query.id}
        const collections = req.query.id ? await fetch('collections', params, pageNumber) :  await findByShop(req.query.slug, 'collections', pageNumber)
        return res.status(200).json(collections)
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const fetchFeaturedCollections = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        let response = []
        if(req.query.id){
            const params = {shopID:req.query.id, featured:true}
            const collections = await fetch('collections', params, pageNumber);
            collections.items.forEach(collection=> {
                const item = {id:collection.id, name:collection.name, picture:collection.picture, featured:collection.featured, date:collection.createdAt}
                response.push(item)
            })
            return res.status(200).json({total:collections.total, data:response})
        } 
        if(req.query.slug){
            const params = {slug:req.query.slug, featured:true}
            const collections = await fetch('collections', params, pageNumber);
            collections.items.forEach(collection=> {
                const item = {id:collection.id, name:collection.name, picture:collection.picture, featured:collection.featured, slug:collection.slug}
                response.push(item)
            })
            return res.status(200).json({total:collections.total, data:response})
        }
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const fetchStandardCollections = async(req,res)=> {
    
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        let response = []
            const params = {shopID:req.query.id, featured:false}
            const collections = await fetch('collections', params, pageNumber);
            collections.items.forEach(collection=> {
                const item = {id:collection.id, name:collection.name, picture:collection.picture, featured:collection.featured, date:collection.createdAt}
                response.push(item)
            })
            return res.status(200).json({total:collections.total, data:response})
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const searchCollections = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const id = req.query.id;
        const query = req.query.term;
        const collections = await search('collections', query, id, pageNumber);
        return res.status(200).json(collections)
        
       
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports={addCollection, editCollections, fetchCollections, deleteCollection, searchCollections, fetchFeaturedCollections, fetchStandardCollections}