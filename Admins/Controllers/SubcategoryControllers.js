const {generateID, getAbbreviation, slugify, compareStrings, extractFileNameFromUrl} = require('../../Utils/Utils');
const {insertData, updateData, deleteData, getSingleItem, dbCheck, getSubcategories, deleteMultipleItems, getDataByParams, getSubcategoriesByCategoryID, getByID, getSubcategoriesByCategorySlug, searchData} = require('../../config/sqlfunctions');
const {deleteBlob} = require('../Images/ImageController')


const addSubcategory = async(req,res)=> {
    const {catId, name, image} = req.body
    const {id} = req.params;
    try{
        const find = await dbCheck({name, shopID:id}, 'subcategories')
        if(find){return res.status(400).json({error:'A sub-category with this name already exists please use a different name', code:3})}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const category = await getByID(catId, 'categories')
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
        const insert = await insertData(data, 'subcategories')
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
        const subcat = await dbCheck({id:subId,shopID:id}, 'subcategories')
        if(!subcat){return res.status(404).json({error:'Subcategory not found', code:3})}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error:'Subcategory not found', code:3})}
        const category = await dbCheck({id:catId, shopID:id}, 'categories')
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
        const edit = await updateData(subId, data, 'subcategories')
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
        const subcat = await getSingleItem({id:subId}, 'subcategories')
        if(!subcat){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        //const blobname = extractFileNameFromUrl(subcat.picture)
        //const deleted = await deleteBlob(blobname, 'subcategories')
        //if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const deletion = await deleteData(subId, id, 'subcategories');
        if(!deletion){return res.sendStatus(404)}
        res.status(200).json({message:'subcategory deleted successfully',  id:deletion.id, code:0})

    }catch(error){
        return res.status(500).json(error)
    }
}

const deleteMultipleSubcategories = async(req,res)=> {
    const {ids} = req.body;
    const {id}=req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const deletion = await deleteMultipleItems(ids, 'subcategories')
        //if(!deletion){return res.sendStatus(404)}
        res.status(200).json(deletion)
    }catch(error){
        return res.status(500).json(error)
    }
}

const fetchShopSubcategories = async(req,res)=> {
    const {id, page}=req.query;
    const pageNumber = parseInt(page )|| 1;
    try{
        const subcategories = await getSubcategories(id, pageNumber)
        res.status(200).json(subcategories)

    }catch(error){
        return res.status(500).json(error.message)
    }
}



const getCatSubcategories = async(req,res)=> {
    const {id, page, slug, catId} = req.query;
    const pageNumber = parseInt(page)|| 1;
    try{
        const subcategories = slug ? await getSubcategoriesByCategorySlug(slug, id, pageNumber) : await getSubcategoriesByCategoryID(id,catId,pageNumber);
        res.status(200).json(subcategories)
    }catch(error){
        res.status(500).json(error)
    }
}



const searchSubcategories = async(req,res)=> {
    const pageNumber = parseInt(req.query.page )|| 1;
    const id = req.query.id;
    const query = req.query.term;
    try{
        const subcategories = await searchData(query, 'subcategories', pageNumber, id);
        return res.status(200).json(subcategories)
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports = {addSubcategory, deleteMultipleSubcategories, editSubcategory, deleteSubcategory, fetchShopSubcategories, getCatSubcategories, searchSubcategories}