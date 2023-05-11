const {generateID, getAbbreviation, slugify, compareStrings, extractFileNameFromUrl} = require('../../Utils/Utils');
const {isEmpty, DBInsert, findData, fetch, update, deleteItem, fetchCategorySubcategories, search, searchSubCats, getSubcategoriesWithCategory} = require('../../config/prisma');
const {deleteBlob} = require('../Images/ImageController')


const addSubcategory = async(req,res)=> {
    const {catId, name, image} = req.body
    const {id} = req.params;
    try{
        const find = await isEmpty('subcategories', {name, shopID:id})
        if(find){return res.status(400).json({error:'A sub-category with this name already exists please use a different name', code:3})}
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const category = await findData('categories', {id:catId})
        if(!category){return res.sendStatus(404)}
        const abbr = getAbbreviation(name)
        const slug = slugify(name)
        const data = {
            id:abbr + generateID(),
            name,
            slug,
            picture:image,
            categoryID:catId,
            shopID:id
        }
        const insert = await DBInsert('subcategories', data)
        if(!insert){return res.sendStatus(404)}
        const response = {id:insert.id, name:insert.name, slug:insert.slug, picture:insert.picture, category:category.name}
        res.status(200).json({message:'subcategory uploaded successfully', code:0, response})

    }catch(error){
        return res.status(500).json({error:error.message})
    }

}

const editSubcategory = async(req,res)=> {
    const {subId, catId, name, image} = req.body;
    const {id}= req.params;
    try{
        const subcat = await findData('subcategories', {id:subId,shopID:id})
        if(!subcat){return res.status(404).json({error:'Subcategory not found', code:3})}
        const shop = await findData('shops', {id})
        if(!shop){return res.status(404).json({error:'Subcategory not found', code:3})}
        const category = await findData('categories', {id:catId, shopID:id})
        if(!category){return res.status(404).json({error:'Subcategory not found', code:3})}
        const imgName = extractFileNameFromUrl(subcat.picture)
        const editImg = extractFileNameFromUrl(image);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'subcategories')
            if(imgdelete.code == 3){return res.status(500).json({error:imgdelete.error, code:3})}
        }
        const data = {
            name,
            slug: slugify(name),
            picture:  image,
        }
        const edit = await update(subId, 'subcategories', data)
        if(!edit){res.sendStatus(500)}
        const response = {id:edit.id, name:edit.name, picture:edit.picture, slug:edit.slug, category:category.name, catid:catId}
        res.status(200).json({message: 'Subcategory updated successfully', code:0, response})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteSubcategory = async(req,res)=> {
    const {subId} = req.body;
    const {id}=req.params;
    try{
        const subcat = await findData('subcategories', {id:subId, shopID:id})
        if(!subcat){return res.sendStatus(404)}
        const shop = await isEmpty('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(subcat.picture)
        const deleted = await deleteBlob(blobname, 'subcategories')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const deletion = await deleteItem(subId, 'subcategories')
        if(!deletion){return res.sendStatus(404)}
        res.status(200).json({message:'subcategory deleted successfully',  id:deletion.id, code:0})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const fetchShopSubcategories = async(req,res)=> {
    const {id, page}=req.query;
    const pageNumber = parseInt(page )|| 1;
    try{
        const subcategories = await getSubcategoriesWithCategory(id, pageNumber);
        res.status(200).json(subcategories)

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const getCategorySubcategories = async(req,res)=> {
    const {id}= req.body;
    const {slug} = req.params;
    try{
        const subcategories = await fetchCategorySubcategories(slug, id)
        res.status(200).json(subcategories)
    }catch(error){
        res.status(500).json(error.message)
    }
}

const getCatSubcategories = async(req,res)=> {
    const {catId}= req.body;
    const {id} = req.params;
    const pageNumber = parseInt(req.query.page )|| 1;
    try{
        const subcategories = await fetch('subcategories', {categoryID:catId, shopID:id}, pageNumber)
        res.status(200).json(subcategories)
    }catch(error){
        res.status(500).json(error.message)
    }
}

const searchSubcategories = async(req,res)=> {
    const {id, term, page} = req.query
    try{
        const pageNumber = parseInt(page )|| 1;
        const subcategories = await searchSubCats(term, id, pageNumber);
        return res.status(200).json(subcategories)
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports = {addSubcategory, editSubcategory, deleteSubcategory, fetchShopSubcategories, getCategorySubcategories, getCatSubcategories, searchSubcategories}