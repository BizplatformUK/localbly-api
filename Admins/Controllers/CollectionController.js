const {generateID, getAbbreviation, slugify, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const {insertData, updateData, deleteData, addMultipleProductsToCollections, dbCheck, getDataByParams, getByID, getDataByMultipleParams, searchData} = require('../../config/sqlfunctions')

const addCollection = async(req,res)=> {
    const {name, image, featured} = req.body
    const {id}= req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const collection = await dbCheck({name, shopID:id}, 'collections')
        if(collection){return res.status(400).json({error: 'A collection with this name already exists please use a different name', code:3})}
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
        const response = {id:insert.id, name:insert.name, picture:insert.picture, featured:insert.featured, date:insert.createdAt}
        res.status(200).json({message:'collection uploaded successfully', code:0, response})
    }catch(error){
        return res.status(500).json(error)
    }
}

const editCollections = async(req,res)=> {
    const {colId, name, image, featured} = req.body;
    const {id}=req.params;
    try{
        const collection = await dbCheck({id:colId, shopID:id}, 'collections')
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
        const collection = await dbCheck({id:colid, shopID:id}, 'collections')
        if(!collection){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
       
        const data = await addMultipleProductsToCollections(ids, colid);
        if(!data){return res.sendStatus(500)}
        //const response =  {id:data.id, name:data.name, picture:data.picture, featured:data.featured, date:data.createdAt}
        res.status(200).json(data)

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
        await Promise.all(collections.items.map(async (collection) => {
            const checker = {itemID:collection.id, shopID:id}
            const isPresent = await dbCheck(checker, "banner");
            const item = {
                id: collection.id,
                name: collection.name,
                picture: collection.picture,
                slug: collection.slug,
                featured: collection.featured,
                date: collection.createdAt,
                isPresent
            };
            response.push(item)
        }));
        return res.status(200).json({totalPages:collections.totalPages, items:response})
        
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const fetchFeaturedCollections = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        let response = []
        const params = {shopID:id, featured:true}
        const collections = await getDataByMultipleParams(params, 'collections', pageNumber);
        await Promise.all(collections.items.map(async (collection) => {
            const checker = {itemID:collection.id, shopID:id}
            const isPresent = await dbCheck(checker, "banner");
            const item = {
                id: collection.id,
                name: collection.name,
                picture: collection.picture,
                slug: collection.slug,
                featured: collection.featured,
                date: collection.createdAt,
                isPresent
            };
            response.push(item)
        }));
        return res.status(200).json({totalPages:collections.totalPages, items:response})
 
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const fetchStandardCollections = async(req,res)=> {
    const {id,page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        let response = []
            const params = {shopID:id, featured:false}
            const collections = await getDataByMultipleParams(params, 'collections', pageNumber);
            await Promise.all(collections.items.map(async (collection) => {
                const checker = {itemID:collection.id, shopID:id}
                const isPresent = await dbCheck(checker, "banner");
                const item = {
                    id: collection.id,
                    name: collection.name,
                    picture: collection.picture,
                    slug: collection.slug,
                    featured: collection.featured,
                    date: collection.createdAt,
                    isPresent
                };
                response.push(item)
            }));
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
        await Promise.all(collections.items.map(async (collection) => {
            const checker = {itemID:collection.id, shopID:id}
            const isPresent = await dbCheck(checker, "banner");
            const item = {
                id: collection.id,
                name: collection.name,
                picture: collection.picture,
                slug: collection.slug,
                featured: collection.featured,
                date: collection.createdAt,
                isPresent
            };
            response.push(item)
        }));
        return res.status(200).json({totalPages:collections.totalPages, items:response})
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports={addCollection, addproductsToCollections, editCollections, fetchCollections, deleteCollection, searchCollections, fetchFeaturedCollections, fetchStandardCollections}