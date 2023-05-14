const {isEmpty, fetch, DBInsert, findData, update, deleteItem, findShopCategories, search, fetchfeaturedcategories, bannerPresent, frontendfetch} = require('../../config/prisma');
const {generateID, getAbbreviation, slugify, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')

const addCategory = async(req,res)=> {
    const {name, image, featured} = req.body
    const {id} = req.params;
    try{
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const cat = await isEmpty('categories', {name, shopID:id})
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
        const insert = await DBInsert('categories', category)
        if(!insert){return res.sendStatus(404)}
        const data = {id:insert.id, name:insert.name, slug:insert.slug, picture:insert.picture, date:insert.createdAt}
        res.status(200).json({message:'Category Uploaded successfully', code:0, data})

    }catch(error){
        return res.status(500).json({error})
    }
}

const editCategory = async(req,res)=> {
    const {catId, name, image, featured} = req.body;
    const {id}=req.params;
    try{
        const category = await findData('categories', {id:catId, shopID:id})
        if(!category){return res.sendStatus(404)}
        const shop = await findData('shops',{id:id})
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
        const edit = await update(catId, 'categories', data)
        if(!edit){res.sendStatus(500)}
        const response = {id:edit.id, name:edit.name, slug:edit.slug, picture:edit.picture}
        res.status(200).json({message: 'Category updated successfully', code:0, response})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteCategory = async(req, res)=> {
    const {catId} = req.body;
    const {id}=req.params;
    try{
        const find = await findData('categories',{id:catId, shopID:id})
        if(!find){return res.sendStatus(404)}
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(find.picture)
        const deleted = await deleteBlob(blobname, 'categories')
        const deletion = await deleteItem(catId, 'categories')
        if(deletion.code == 3){return res.status(500).json(deletion.error)}
        if(!deletion){return res.sendStatus(404)}
        res.status(200).json({message:'Category deleted successfully', code:0, deleted, id:deletion.id})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const getShopCategories = async(req,res)=> {
    const {id, page} = req.query;
    try{
            const pageNumber = parseInt(page)|| 1;
            const response = []
            const params = {shopID:id}
            const categories =  await fetch('categories', params, pageNumber);
            const cats = categories.items;
            await Promise.all(cats.map(async (category) => {
                const isPresent = await bannerPresent(category.id, id);
                const item = {
                    id: category.id,
                    name: category.name,
                    picture: category.picture,
                    slug: category.slug,
                    featured: category.featured,
                    date: category.createdAt,
                    isPresent
                };
                response.push(item)
            }));
            return res.status(200).json({total:categories.total, totalPages:categories.totalPages, items:response})
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedShopCategories = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        let response = []
            const params = {shopID:id, featured:true}
            const categories = await fetch('categories', params, pageNumber);
            const cats = categories.items;
            await Promise.all(cats.map(async (category) => {
                const isPresent = await bannerPresent(category.id, req.query.id);
                const item = {
                    id: category.id,
                    name: category.name,
                    picture: category.picture,
                    slug: category.slug,
                    featured: category.featured,
                    date: category.createdAt,
                    isPresent
                };
                response.push(item)
            }));
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
            const categories = await search('categories', query, id, pageNumber);
            const cats = categories.items;
            await Promise.all(cats.map(async (category) => {
                const isPresent = await bannerPresent(category.id, req.query.id);
                const item = {
                    id: category.id,
                    name: category.name,
                    picture: category.picture,
                    slug: category.slug,
                    featured: category.featured,
                    date: category.createdAt,
                    isPresent
                };
                response.push(item)
            }));
            return res.status(200).json({total:categories.total, totalPages:categories.totalPages, data:response})
        
       
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getunFeaturedShopCategories = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        let response = []
            const params = {shopID:req.query.id, featured:false}
            const categories = await fetch('categories', params, pageNumber);
            const cats = categories.items;
            await Promise.all(cats.map(async (category) => {
                const isPresent = await bannerPresent(category.id, req.query.id);
                const item = {
                    id: category.id,
                    name: category.name,
                    picture: category.picture,
                    slug: category.slug,
                    featured: category.featured,
                    date: category.createdAt,
                    isPresent
                };
                response.push(item)
            }));
            return res.status(200).json({total:categories.total, totalPages:categories.totalPages, data:response})
        
       
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedCategories = async(req,res)=>{
        const {slug}=req.params;
    try{
        const shop = await isEmpty('shops', {slug})
        if(!shop){return res.sendStatus(404)}
        let response = []
        const categories = await fetchfeaturedcategories(slug);
        categories.forEach(item=> {
            const category = {id:item.id,name:item.name,slug:item.slug,picture:item.picture}
            response.push(category)
        })
        res.status(200).json(response)

    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports = {addCategory, editCategory, deleteCategory, getShopCategories, getFeaturedCategories, getFeaturedShopCategories, getunFeaturedShopCategories, searchCategories}