const {fetchData, fetchSingleItem,insertToDB, FetchAllData, updateData } = require('../../config/Dbfunctions');

const collection = 'Categories'
const p = 1

const FetchCategories = async(req,res) => {
    let params 
    if(req.query.id){params={shopId:req.query.id}}
    if(req.query.slug){params = {shopSlug:req.query.slug}}
    const page = parseInt(req.query.page )|| p;
    const categories = await FetchAllData(params, collection, page)
    if(!categories){return res.status(404).json({'Error': 'Category not found', code:3})}
    const results = await categories.data.map(item=> {
        return {id:item._id, name:item.categoryName, slug:item.slug, picture:item.categoryImg}
    })
    res.status(200).json(results)
}

const fetchSingleCategory = async(req, res)=> {
    const {slug}=req.body
    let params
    if(req.query.id){params={_id:req.query.id}}
    if(req.query.slug){params={slug:req.query.slug, shopSlug:slug}}
    const category = await fetchSingleItem(params, collection);
    if(!category){return res.sendStatus(404)}
    const data = {id:category._id, name:category.categoryName, slug:category.slug, picture:category.categoryImg}
    res.status(200).json(data)
}

const fetchFeaturedCategories = async(req,res)=> {
    const {slug}=req.query
    try{
        const categories = await fetchData({shopSlug:slug, featured:{$eq:0}}, collection)
        if(!categories){return res.sendStatus(404)}
        const results = await categories.map(item=> {
            return {id:item._id, name:item.categoryName, slug:item.slug, picture:item.categoryImg}
        })
        res.status(200).json(results)
    }catch(error){
        return res.status(400).json({error:error.message})
    }
}


const FetchSubcategories = async(req, res)=> {
    const {slug} = req.body
    let params
    if(req.query.id){params={shopId:req.query.id}}
    if(req.query.slug){params={categorySlug:req.query.slug,  shopId:id}}
    const page = parseInt(req.query.page )|| p;
    const subcategories = await FetchAllData(params, 'Subcategories', page)
    if(!subcategories){return res.status(404).json({error:'No subcategories found'})}
    const data = await subcategories.data.map(item=> {
        return {id:item._id, name:item.subCategory_name, category:item.categorySlug, image:item.subCategoryImg}
    })
    res.status(200).json(data)
}


const fetchSingleSubCategory = async(req,res)=> {
    const {id}=req.body;
    try{
        const params = {slug:req.query.slug, shopId:id}
        const subcategory = await fetchSingleItem(params, 'Subcategories')
        if(!subcategory){return res.sendStatus(404)}
        const data = {id:subcategory._id, name:subcategory.subCategoryName, slug:subcategory.slug, category:subcategory.categorySlug, picture:subcategory.subCategoryImg}
        res.status(200).json(data)
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}


module.exports = {FetchCategories, FetchSubcategories, fetchSingleCategory, fetchFeaturedCategories, fetchSingleSubCategory}