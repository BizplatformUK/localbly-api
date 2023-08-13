const {generateID, getAbbreviation, slugify, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const { insertData, fetchShopCategories, updateData, getSingleItem, deleteData, isPresentInBanner, fetchFeaturedShopCategories, dbCheck, getDataByParams, getByID, getDataByMultipleParams, searchData} = require('../../config/sqlfunctions');

const addCategory = async(req,res)=> {
    const {name, image, featured} = req.body
    const {id} = req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const params = {name, id}
        const cat = await dbCheck(params, 'categories');
        if(cat){return res.status(400).json({error:'A category with this name already exists please use a different name', code:3})}
        const abbr = getAbbreviation(name)
        const slug = slugify(name)
        const category = {
            id:abbr + generateID(),
            name,
            slug,
            picture:image,
            featured,
            shopID:id
        }
        const insert = await insertData(category, 'categories')
        if(!insert){return res.sendStatus(404)}
        //const data = {id:insert.id, name:insert.name, slug:insert.slug, picture:insert.picture, date:insert.createdAt}
        res.status(200).json({message:'category uploaded successfully', code:0, data:insert})

    }catch(error){
        return res.status(500).json({error})
    }
}

const editCategory = async(req,res)=> {
    const {catId, name, image, featured} = req.body;
    const {id}=req.params;
    try{
        const category = await getByID(catId,'categories');
        if(!category){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const imgName = extractFileNameFromUrl(category.picture)
        const editImg = extractFileNameFromUrl(image);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'categories')
            if(imgdelete.code == 3){return res.status(500).json(imgdelete.error)}
        }
        const data = {
            name,
            slug:slugify(name),
            picture: image,
            featured
        }
        const edit = await updateData(catId, data, 'categories')
        if(!edit){res.sendStatus(500)}
        res.status(200).json({message:'category updated successfully', code:0, response:edit});
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const removeFromFeatured = async(req,res)=> {
    const {catid, shopid} = req.query;
    try{
        const category = await getByID(catid,'categories');
        if(!category){return res.sendStatus(404)}
        const shop = await getByID(shopid, 'shops')
        if(!shop){return res.sendStatus(404)}
        const data = {featured:false}
        const edit = await updateData(catid, data, 'categories')
        if(!edit){res.sendStatus(500)}
        res.status(200).json({message:'category updated successfully', code:0, response:edit});
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const makCategoryFeatured = async(req,res)=> {
    const {catId} = req.body;
    const {id}=req.params;
    try{
        
        const category = await getByID(catId,'categories');
        if(!category){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const data = {featured:true}
        const edit = await updateData(catId, data, 'categories')
        if(!edit){res.sendStatus(500)}
        res.status(200).json({message: 'category updated successfully', code:0, response:edit});
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteCategory = async(req, res)=> {
    const {catId} = req.body;
    const {id}=req.params;
    try{
        const find = await dbCheck({id:catId, shopID:id}, 'categories')
        if(!find){return res.sendStatus(404)}
        const shop = await getByID(id,'shops')
        if(!shop){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(find.picture)
        const deleted = await deleteBlob(blobname, 'categories')
        const deletion = await deleteData(catId, id, 'categories');
        //if(deletion.code == 3){return res.status(500).json(deletion.error)}
        if(!deletion){return res.sendStatus(404)}
        res.status(200).json(deletion)

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteMultipleCategories = async(req,res)=> {
    const {ids} = req.body
    const {id} = req.params
    try{
        const find = await getByID(id, 'shops')
        if(!find){return res.status(404).json({error:'item not found', code:3})}
        const pictures =[]
        await Promise.all(ids.map(async (item) => {
            const find = await getSingleItem({id:item}, 'categories')
            const blobname = extractFileNameFromUrl(find.picture)
            const deleted = await deleteBlob(blobname, 'categories')
            await deleteData(item, id, 'categories')
        }));
        //if(!deletion){return res.sendStatus(500)}
        res.status(200).json({messae: 'success', code:0, itemIds:ids})
    }catch(error){
        return res.status(500).json({error:error.message, code:3})
    }
    
}

const getShopCategories = async(req,res)=> {
    const {id, page} = req.query;
    try{
            const pageNumber = parseInt(page)|| 1;
            const response = []
            const params = {shopID:id}
            const categories =  req.query.slug ? await fetchShopCategories(req.query.slug, pageNumber) : await getDataByParams(params, 'categories', pageNumber);
            const cats = categories.items;
            for (const category of cats) {
                const isPresent = await isPresentInBanner(category.id, id);
                const item = {
                  id: category.id,
                  name: category.name,
                  picture: category.picture,
                  slug: category.slug,
                  featured: category.featured,
                  date: category.createdAt,
                  isPresent
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:categories.totalPages, items:response})
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedShopCategories = async(req,res)=> {
    const {id, page} = req.query;
    const slug = req.query.slug || null
    try{
        const pageNumber = parseInt(page)|| 1;
        let response = []
            const categories = await fetchFeaturedShopCategories(id, slug, true, pageNumber);
            const cats = categories.items;
            for (const category of cats) {
                const isPresent = await isPresentInBanner(category.id, id);
                const item = {
                  id: category.id,
                  name: category.name,
                  picture: category.picture,
                  slug: category.slug,
                  featured: category.featured,
                  date: category.createdAt,
                  isPresent
                };
                response.push(item);
            }
            return res.status(200).json(categories)
    }catch(error){
        res.status(500).json(error.message)
    }
}

const searchCategories = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const id = req.query.id;
        const query = req.query.term;
        let response = []
            const categories = await searchData(query, 'categories', pageNumber, id);
            const cats = categories.items;
            for (const category of cats) {
                const isPresent = await isPresentInBanner(category.id, id);
                const item = {
                  id: category.id,
                  name: category.name,
                  picture: category.picture,
                  slug: category.slug,
                  featured: category.featured,
                  date: category.createdAt,
                  isPresent
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:categories.totalPages, data:response})
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getunFeaturedShopCategories = async(req,res)=> {
    const {id, page} = req.query;
    const slug = req.query.slug || null
    try{
        const pageNumber = parseInt(page )|| 1;
        let response = []
            const categories = await fetchFeaturedShopCategories(id, slug, false, pageNumber);
            const cats = categories.items;
            for (const category of cats) {
                const isPresent = await isPresentInBanner(category.id, id);
                const item = {
                  id: category.id,
                  name: category.name,
                  picture: category.picture,
                  slug: category.slug,
                  featured: category.featured,
                  date: category.createdAt,
                  isPresent
                };
                response.push(item);
            }
            return res.status(200).json({totalPages:categories.totalPages, items:response})
        
       
    }catch(error){
        res.status(500).json(error.message)
    }
}



module.exports = {addCategory, removeFromFeatured, makCategoryFeatured, deleteMultipleCategories, editCategory, deleteCategory, getShopCategories, getFeaturedShopCategories, getunFeaturedShopCategories, searchCategories}