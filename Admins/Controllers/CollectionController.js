const {generateID, getAbbreviation, slugify, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const {insertData, updateData, deleteData, addMultipleProductsToCollections, findShopCollectionswithProducts, filterShopCollections, isPresentInBanner, dbCheck, getDataByParams, getByID, getDataByMultipleParams, searchData} = require('../../config/sqlfunctions')

const addCollection = async(req,res)=> {
    const {name, image, featured} = req.body
    const {id}= req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const items = {name, id}
        const find = await dbCheck(items, 'collections')
        if(find){return res.status(400).json({error: 'A collection with this name already exists please use a different name', code:3})}
        const slug = slugify(name)
        const abbr = getAbbreviation(name)
        const params = {
            id:abbr + generateID(),
            name,
            slug,
            picture:image,
            shopID:id,
            featured
        }
        const insert = await insertData(params, 'collections')
        if(!insert){return res.sendStatus(400)}
        //const response = {id:insert.id, name:insert.name, picture:insert.picture, featured:insert.featured, date:insert.createdAt}
        res.status(200).json({message:'collection uploaded successfully', code:0, response:insert})
    }catch(error){
        return res.status(500).json(error)
    }
}

const editCollections = async(req,res)=> {
    const {colId, name, image, featured} = req.body;
    const {id}=req.params;
    try{
        const collection = await getByID(colId, 'collections')
        if(!collection){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
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
        const data = await updateData(colId, params, 'collections');
        if(!data){return res.sendStatus(500)}
        const response =  {id:data.id, name:data.name, picture:data.picture, featured:data.featured, date:data.createdAt}
        res.status(200).json({message:'collection updated successfully', code:0, response})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const editCollectionFeatured = async(req,res)=> {
    const {colId, featured} = req.body;
    const {id}=req.params;
    try{
        const collection = await getByID(colId, 'collections')
        if(!collection){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
        const params = {featured}
        const data = await updateData(colId, params, 'collections');
        if(!data){return res.sendStatus(500)}
        res.status(200).json({message:'collection updated successfully', code:0, response:data})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteCollection = async(req,res)=> {
    const {colId} = req.body;
    const {id}=req.params;
    try{
        const collection = await dbCheck({id:colId, shopID:id}, 'collections')
        if(!collection){return res.sendStatus(404)}
        const deletion = await deleteData(colId, 'collections')
        const blobname = extractFileNameFromUrl(collection.picture)
        const deleted = await deleteBlob(blobname, 'collections')
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json(deletion)

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}



const addproductsToCollections = async(req,res)=> {
    const {ids, colid} = req.body;
    const {id}=req.params;
    try{
        const collection = await getByID(colid, 'collections')
        if(!collection){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
       
        const data = await addMultipleProductsToCollections(ids, colid);
        if(!data){return res.sendStatus(500)}
        //const response =  {id:data.id, name:data.name, picture:data.picture, featured:data.featured, date:data.createdAt}
        res.status(200).json({message: 'success', code:0, itemIds:ids})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const fetchCollections = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        const params = {shopID:id}
        const response = [];
        const collections = await getDataByParams(params, 'collections', pageNumber);
        const cols = collections.items
        for (const collection of cols) {
            const isPresent = await isPresentInBanner(collection.id, id);
            const item = {
                id: collection.id,
                name: collection.name,
                picture: collection.picture,
                slug: collection.slug,
                featured: collection.featured,
                date: collection.createdAt,
                isPresent
            };
            response.push(item);
        }
        return res.status(200).json({totalPages:collections.totalPages, items:response})
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const fetchFeaturedCollections = async(req,res)=> {
    const {id, page} = req.query;
    const slug = req.query.slug || null
    try{
        const pageNumber = parseInt(page )|| 1;
        let response = []
        const collections = await filterShopCollections(id, slug, true, pageNumber);
        const cols = collections.items
        for (const collection of cols) {
            const isPresent = await isPresentInBanner(collection.id, id);
            const item = {
                id: collection.id,
                name: collection.name,
                picture: collection.picture,
                slug: collection.slug,
                featured: collection.featured,
                date: collection.createdAt,
                isPresent
            };
            response.push(item);
        }
        return res.status(200).json({totalPages:collections.totalPages, items:response})
 
    }catch(error){
        return res.status(500).json(error.message)
    }
}



const getFeaturedCollectionsWithProducts = async(req,res)=> {
    const {id} = req.query;
    const slug = req.query.slug || null
    try{
        const collections = await findShopCollectionswithProducts(id, slug, true);
        return res.status(200).json(collections)
 
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const fetchStandardCollections = async(req,res)=> {
    const {id,page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        let response = []
            const collections = await filterShopCollections(id, false, pageNumber);
            const cols = collections.items
            for (const collection of cols) {
                const isPresent = await isPresentInBanner(collection.id, id);
                const item = {
                    id: collection.id,
                    name: collection.name,
                    picture: collection.picture,
                    slug: collection.slug,
                    featured: collection.featured,
                    date: collection.createdAt,
                    isPresent
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:collections.totalPages, items:response})
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const searchCollections = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const id = req.query.id;
        const query = req.query.term;
        const response = []
        const collections = await searchData(query, 'collections', pageNumber, id);
        const cols = collections.items
        for (const collection of cols) {
                const isPresent = await isPresentInBanner(collection.id, id);
                const item = {
                    id: collection.id,
                    name: collection.name,
                    picture: collection.picture,
                    slug: collection.slug,
                    featured: collection.featured,
                    date: collection.createdAt,
                    isPresent
                };
                response.push(item);
        }
        return res.status(200).json({totalPages:collections.totalPages, items:response})
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports={addCollection, getFeaturedCollectionsWithProducts, editCollectionFeatured, addproductsToCollections, editCollections, fetchCollections, deleteCollection, searchCollections, fetchFeaturedCollections, fetchStandardCollections}