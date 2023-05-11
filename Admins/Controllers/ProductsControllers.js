const {generateID, getAbbreviation, slugify, getDiscountPrice, extractFileNameFromUrl,  compareStrings} = require('../../Utils/Utils');
const {deleteBlob, deleteImages} = require('../Images/ImageController')
const {isEmpty, 
    DBInsert, 
    findData, 
    update, 
    deleteItem, 
    productUpdateMany, 
    getOfferProducts, 
    getRelatedProducts, 
    fetchFeaturedHomeProducts, 
    fetchFeaturedCategoryProducts, 
    fetchSubcategoryProducts,
    fetchSingleItem,
    fetch,
    fetchshopProducts,
    searchshopproducts
}= require('../../config/prisma');


const addProduct = async(req,res)=> {
    const {name, catId, subId, image, price, onSale, salePrice, fhome, fcat, description, options, tags, offerId, collection} = req.body
    const {id}=req.params
    try{
        const product = await isEmpty('products', {name, shopID:id})
        if(product){return res.status(400).json({error:'A product with this name already exists', code:3})}
        const shop = await findData('shops', {id:id})
        if(!shop){return res.sendStatus(404)}
        const category = await findData('categories', {id:catId, shopID:id})
        if(!category){return res.sendStatus(404)}
        const subcategory = await findData('subcategories', {id:subId, shopID:id})
        if(!subcategory){return res.sendStatus(404)}
        const slug = slugify(name);
        const abbr = getAbbreviation(name)
        //const searchTags = [category.name, subcategory.name];
        //const tagsArr = tags.concat(searchTags)
        //const tagsStr = tagsArr.join(', ');
        const params = {
            id: abbr + generateID(),
            name,
            slug,
            picture: image,
            categoryID:catId,
            subcategoryID:subId,
            category: category.categoryName,
            subcategory:subcategory.subCategoryName,
            price,
            onSale,
            salePrice: salePrice == null ? 0 : salePrice,
            featuredHome: fhome,
            featuredCategory:fcat,
            description,
            options,
            tags,
            offerID: offerId == null ? null : offerId,
            collectionsID:collection === null ? null : collection,
            shopID:id
        }
        const insert = await DBInsert('products', params)
        if(!insert){return res.sendStatus(400)}
        //const response = {id:insert.id, name:insert.name, slug:insert.slug, category:category.name, subcategory:subcategory.name, picture:insert.picture}
        res.status(200).json({message: 'Product uploaded successfully', code:0, insert})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const addProductImg = async(req,res)=> {
    const {shopId, picture}=req.body;
    const {id}= req.params;
    try{
        const find = await findData('products', {id:id, shopID:shopId})
        if(!find){return res.sendStatus(404)}
        const shop = await findData('shops', {id:shopId})
        if(!shop){return res.sendStatus(404)}
        const params = {id:generateID(), picture, shopID:shopId, productID:id}
        const insert = await DBInsert('productpictures', params)
        res.status(200).json({message:'Image uploaded successfully', code:0, insert})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const updateProductImg = async(req, res)=> {
    const {shopId, productId, picture}= req.body;
    const {id}=req.params;
    try{
        const shop = await findData('shops', {id:shopId})
        if(!shop){return res.sendStatus(404)}
        const product = await findData('products', {id:productId})
        if(!product){return res.sendStatus(404)}
        const ppic = await findData('productpictures', {id})
        if(!ppic){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(ppic.picture)
        const deleted = await deleteBlob(blobname, 'products')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const image = await update(id, 'productpictures', {picture})
        res.status(200).json({message:'Picture updated', code:0, image})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteProductImage = async(req,res)=> {
    const {shopId, productId}= req.body;
    const {id}=req.params;
    try{
        const shop = await findData('shops', {id:shopId})
        if(!shop){return res.sendStatus(404)}
        const product = await findData('products', {id:productId})
        const ppic = await findData('productpictures', {id})
        if(!ppic){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(ppic.picture)
        const deleted = await deleteBlob(blobname, 'products')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        if(!product){return res.sendStatus(404)}
        const deletion = await deleteItem(id, 'productpictures')
        res.status(200).json({message:'Picture deleted successfully', deletion, deleted})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const editProduct = async(req,res)=> {
    const {prodId, name, catId, subId, image, price, onSale, salePrice, fhome, fcat, description, options, tags, collection, offerId} = req.body
    const {id} = req.params;
    try{
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const category = await findData('categories', {id:catId,shopID:id})
        if(!category){return res.status(404).json({error:'category not found'})}
        const subcategory = await findData('subcategories', {id:subId, shopID:id})
        if(!subcategory){return res.status(404).json({error:'subcategory not found'})}
        const product = await findData('products', {id:prodId, shopID:id})
        if(!product){return res.status(404).json({error:'product not found'})}
        const imgName = extractFileNameFromUrl(product.picture)
        const editImg = extractFileNameFromUrl(image);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'products')
            if(imgdelete.code == 3){return res.status(500).json(imgdelete.error)}
        }
        //const searchTags = [category.name, subcategory.name];
        //const tagsArr = tags.concat(searchTags)
        //const tagsStr = tagsArr.join(', ');
        const slug = slugify(name);
        const params = {
            name,
            slug,
            picture: image,
            categoryID:catId,
            subcategoryID:subId,
            price,
            onSale,
            salePrice,
            featuredHome:fhome,
            featuredCategory: fcat,
            description,
            options,
            tags,
            offerID: offerId == null ? null : offerId,
            collectionsID:collection === null ? null : collection,
        }
        const insert = await update(prodId, 'products', params)
        if(!insert){return res.sendStatus(400)}
        res.status(200).json({message: 'Product updated successfully', code:0, insert})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const updateProductsOffer = async(req, res)=> {
    const {shopId, productIds} = req.body
    const {id} = req.params;
    try{
        const shop = await isEmpty('shops', {id:shopId})
        if(!shop){return res.sendStatus(404)}
        const offer = await isEmpty('offers', {id:id})
        if(!offer){return res.sendStatus(404)}
        const params = {offerID:id}
        const add = await productUpdateMany(productIds, params)
        if(!add){return res.sendStatus(404)}
        res.status(200).json({message:'success', add})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const removeProductsFromOffer = async(req,res)=> {
    const {shopId, productIds}= req.body
    const {id} = req.params;
    try{
        const find = await findData('shops', {id:shopId})
        if(!find){return res.sendStatus(404)}
        const offer = await findData('offers', {id})
        if(!offer){return res.sendStatus(404)}
        const params = {offerID:null}
        const removed = productUpdateMany(productIds, params)

        res.status(200).json({message: 'Update successful', removed})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const addFeaturedCategoryProducts = async(req,res)=> {
    const {shopId, productIds}= req.body
    try{
        const find = await findData('shops', {id:shopId})
        if(!find){return res.sendStatus(404)}
        const params = {featuredCategory:true}
        const add = await productUpdateMany(productIds, params);
        res.status(200).json(add)

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const removeFeaturedCategoryProducts = async(req,res)=> {
    const {shopId, productIds}= req.body
    try{
        const find = await findData('shops', {id:shopId})
        if(!find){return res.sendStatus(404)}
        const params = {featuredCategory:false}
        const add = await productUpdateMany(productIds, params);
        res.status(200).json(add)

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const addFeaturedHomeProducts = async(req,res)=> {
    const {shopId, productIds}= req.body
    try{
        const find = await findData('shops', {id:shopId})
        if(!find){return res.sendStatus(404)}
        const params = {featuredHome:true}
        const add = await productUpdateMany(productIds, params);
        res.status(200).json(add)

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const removeFeaturedHomeProducts = async(req,res)=> {
    const {shopId, productIds}= req.body
    try{
        const find = await findData('shops', {id:shopId})
        if(!find){return res.sendStatus(404)}
        const params = {featuredHome:false}
        const add = await productUpdateMany(productIds, params);
        res.status(200).json(add)

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const deleteProducts = async(req, res)=>{
    const {prodId}=req.body;
    const {id}=req.params;
    try{
        const shop = await findData('shops', {id})
        if(!shop){return res.sendStatus(404)}
        const product = await findData('products', {id:prodId, shopID:id})
        if(!product){return res.sendStatus(404)}
        //const blobname = extractFileNameFromUrl(product.picture)
        //const deleteImg = await deleteBlob(blobname, 'products')
        //if(deleteImg.code == 3){return res.status(500).json(deleted.error)}
        //const images = await fetch('productpictures', {productID:id})
        //const deleted = await deleteImages('products', images)
        //if(deleted.code == 3){ return res.status(500).json(deleted.error)}
        const deletion= await deleteItem(prodId, 'products');
        if(!deletion){return res.sendStatus(400)}
        res.status(200).json({message:'Product deleted successfully', code:0 , id:prodId})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const getshopProducts = async(req,res)=> {
    const {id,page}=req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        const params = {shopID:id}
        const products = await fetchshopProducts(params, pageNumber);
        return res.status(200).json(products)

    }catch(error){
        return res.status(400).json({err: error.message})
    }
}

const searchProducts = async(req,res)=> {
    const {id,term} = req.query;
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const products = await searchshopproducts(term,id,pageNumber);
        return res.status(200).json(products)

    }catch(error){
        return res.status(400).json({err: error.message})
    }
}

const getofferProducts = async(req,res)=> {
    const {slug}= req.params;
    try{
        let response = []
        const products = await getOfferProducts(slug)
        products.forEach(product=> {
            const item = {
                id:product.id, 
                name:product.name, 
                slug:product.slug,
                price:product.price,
                picture:product.picture, 
                category:product.category, 
                subcategory:product.subcategory,
                onsale:product.onSale,
                saleprice:product.salePrice,
                discountPrice: getDiscountPrice(product.price, product.discount)
            }
            response.push(item)
        })
        res.status(200).json(response)
    }catch(error){
        return res.status(500).json(error.message)
    }
}



const getRelatedproducts = async(req,res)=> {
    const {slug} = req.params;
    try{
        const products = await getRelatedProducts(slug)
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedHomeProducts = async(req,res)=> {
    const {slug}=req.params;
    try{
        const products = await fetchFeaturedHomeProducts(slug)
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedCategoryProducts = async(req,res)=> {
    const {slug}=req.params;
    const {id}=req.body;
    try{
        const products = await fetchFeaturedCategoryProducts(slug, id)
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error.message)
    }
}


const getSubcategoryProducts = async(req,res)=> {
    const {slug}=req.params;
    const {id}=req.body;
    try{
        const products = await fetchSubcategoryProducts(slug, id)
        let response = []
        products.forEach(product=> {
            const item = {
                id:product.id, 
                name:product.name, 
                slug:product.slug,
                price:product.price,
                picture:product.picture, 
                category:product.category, 
                subcategory:product.subcategory,
                onsale:product.onSale,
                saleprice:product.salePrice,
                discountPrice: product.discount == null ? 0 : getDiscountPrice(product.price, product.discount)
            }
            response.push(item)
        })
        res.status(200).json(response)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getSingleProduct = async(req,res)=> {
    try{
        let params
        if(req.query.id){
            params = {id:req.query.id}
        }else{
            params={slug:req.query.slug}
        }
        const product = await fetchSingleItem(params)
        const item = {
            id:product.id, 
            name:product.name, 
            slug:product.slug,
            price:product.price,
            picture:product.picture, 
            category:product.category, 
            subcategory:product.subcategory,
            onsale:product.onSale,
            saleprice:product.salePrice,
            discountPrice: product.discount == null ? 0 : getDiscountPrice(product.price, product.discount),
            couponCode:product.code == null ? null : product.code
        }
        res.status(200).json(item)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getProductImages = async(req,res)=> {
    const {id}=req.params;
    try{
        const images = await fetch('productpictures', {productID:id})
        res.status(200).json(images)

    }catch(error){
        res.status(500).json(error.message)
    }
}



module.exports = {
    addProduct, 
    addProductImg, 
    updateProductImg, 
    deleteProductImage, 
    editProduct, 
    updateProductsOffer, 
    removeProductsFromOffer, 
    deleteProducts, 
    getofferProducts,
    addFeaturedCategoryProducts,
    removeFeaturedCategoryProducts,
    removeFeaturedHomeProducts,
    addFeaturedHomeProducts,
    getRelatedproducts,
    getFeaturedHomeProducts,
    getFeaturedCategoryProducts,
    getSubcategoryProducts,
    getSingleProduct,
    getProductImages,
    getshopProducts,
    searchProducts
}