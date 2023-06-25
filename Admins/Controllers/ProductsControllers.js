const {generateID, getAbbreviation, slugify, getDiscountPrice, extractFileNameFromUrl,  compareStrings} = require('../../Utils/Utils');
const {deleteBlob, deleteImages} = require('../Images/ImageController')
const {insertData, updateData, filterProductsNotInCollection, searchShopProducts, filterProductsNotInOffer, fetchFeaturedHomeProducts, toggleProductFeaturedHome, toggleProductFeaturedCategory, findshopproducts, deleteData, deleteProductsFromOffer,findCollectionsProducts, findSubcategoryProducts, findSingleProductBySlug, findFeaturedCategoryProducts, dbCheck, addProductsToOffer, findRelatedProducts, getOfferProducts, getDataByParams, getByID, getDataByMultipleParams, searchData, getSingleItem}= require('../../config/sqlfunctions');


const addProduct = async(req,res)=> {
    const {name, catId, subId, image, price, onSale, salePrice, fhome, fcat, description, options, tags, offerId, collection} = req.body
    const {id}=req.params
    try{
        const items = {name, id}
        const find = await dbCheck(items, 'products')
        if(find){return res.status(400).json({error:'A product with this name already exists', code:3})}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const category = await getByID(catId, 'categories')
        if(!category){return res.sendStatus(404)}
        const subcategory = await getByID(subId, 'subcategories')
        if(!subcategory){return res.sendStatus(404)}
        const slug = slugify(name);
        const abbr = getAbbreviation(name)
        const params = {
            id: abbr + generateID(),
            name,
            slug,
            picture: image,
            categoryID:catId,
            subcategoryID:subId,
            price,
            onSale,
            salePrice: salePrice == null ? 0 : salePrice,
            featuredHome: fhome,
            featuredCategory:fcat,
            description,
            options: JSON.stringify(options),
            tags,
            offerID: offerId == null ? null : offerId,
            collectionsID:collection === null ? null : collection,
            shopID:id
        }
        const insert = await insertData(params, 'products')
        if(!insert){return res.sendStatus(400)}
        res.status(200).json({message: 'product uploaded successfully', code:0, response:insert})
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const editProduct = async(req,res)=> {
    const {prodId, name, catId, subId, image, price, onSale, salePrice, fhome, fcat, description, options, tags, collection, offerId} = req.body
    const {id} = req.params;
    try{
        const shop = await getByID(id, 'shops',)
        if(!shop){return res.sendStatus(404)}
        const category = await getByID(catId, 'categories')
        if(!category){return res.status(404).json({error:'category not found'})}
        const subcategory = await getByID(subId, 'subcategories')
        if(!subcategory){return res.status(404).json({error:'subcategory not found'})}
        const product = await getByID(prodId, 'products')
        if(!product){return res.status(404).json({error:'product not found'})}
        const imgName = extractFileNameFromUrl(product.picture)
        const editImg = extractFileNameFromUrl(image);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'products')
            if(imgdelete.code == 3){return res.status(500).json(imgdelete.error)}
        }
      
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
            options:JSON.stringify(options),
            tags,
            offerID: offerId == null ? null : offerId,
            collectionsID:collection === null ? null : collection,
        }
        const insert = await updateData(prodId, params,  'products')
        if(!insert){return res.sendStatus(400)}
        res.status(200).json({message: 'Product updated successfully', code:0, insert})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const removeFeatured = async(req,res)=> {
    const {id} = req.params;
    const {ids} = req.body
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const edit = await toggleProductFeaturedHome(ids, false, id)
        if(!edit){res.sendStatus(500)}
        res.status(200).json({message: 'success', code:0, items:ids});
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const addFeatured = async(req,res)=> {
    const {id} = req.params;
    const {idsArr} = req.body
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const edit = await toggleProductFeaturedHome(idsArr, true, id)
        if(!edit){res.sendStatus(500)}
        res.status(200).json({message: 'success', code:0, items:ids});
    }catch(error){
        return res.status(500).json(error)
    }
}


/*
const addProductImg = async(req,res)=> {
    const {shopId, picture}=req.body;
    const {id}= req.params;
    try{
        const find = await dbCheck({id:id, shopID:shopId}, 'products')
        if(!find){return res.sendStatus(404)}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const params = {id:generateID(), picture, shopID:shopId, productID:id}
        const insert = await insertData(params, 'productpictures')
        res.status(200).json({message:'Image uploaded successfully', code:0, insert})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const updateProductImg = async(req, res)=> {
    const {shopId, productId, picture}= req.body;
    const {id}=req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const product = await dbCheck({id:productId}, 'products')
        if(!product){return res.sendStatus(404)}
        const ppic = await getByID(id, 'productpictures')
        if(!ppic){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(ppic.picture)
        const deleted = await deleteBlob(blobname, 'products')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const data = {picture}
        const image = await updateData(id, data,  'productpictures',)
        res.status(200).json({message:'Picture updated', code:0, image})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteProductImage = async(req,res)=> {
    const {shopId, productId}= req.body;
    const {id}=req.params;
    try{
        const shop = await getByID(shopId, 'shops')
        if(!shop){return res.sendStatus(404)}
        const product = await getByID(productId, 'products',)
        const ppic = await findData('productpictures', {id})
        if(!ppic){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(ppic.picture)
        const deleted = await deleteBlob(blobname, 'products')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        if(!product){return res.sendStatus(404)}
        const deletion = await deleteData(id, 'productpictures')
        res.status(200).json({message:'Picture deleted successfully', deletion, deleted})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}



const updateProductsOffer = async(req, res)=> {
    const {shopId, productIds} = req.body
    const {id} = req.params;
    try{
        const shop = await getByID(shopId, 'shops')
        if(!shop){return res.sendStatus(404)}
        const offer = await dbCheck({id, shopID:shopId}, 'offers')
        if(!offer){return res.sendStatus(404)}
        const response = []
        const total = productIds.length;
        await Promise.all(productIds.map(async (item) => {
            const add = await addProductsToOffer(item, id)
            response.push(add);
        }));
        //if(!add){return res.sendStatus(404)}
        res.status(200).json({message: `${total} products added to offer`, code:0})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const removeProductsFromOffer = async(req,res)=> {
    const {shopId, productIds}= req.body
    try{
        const find = await getByID(shopId, 'shops')
        if(!find){return res.sendStatus(404)}
        await Promise.all(productIds.map(async (item) => {
            const add = await deleteProductsFromOffer(item)
        }));
        const total = productIds.length;
        res.status(200).json({message: `${total} products removed from offer`, code:0})
    }catch(error){
        return res.status(500).json(error.message)
    }
}*/

const addFeaturedCategoryProducts = async(req,res)=> {
    const {ids}= req.body
    const {id} = req.params;
    try{
        const find = await getByID(id, 'shops')
        if(!find){return res.sendStatus(404)}
    
        const add = await toggleProductFeaturedCategory(ids, true, id);
        //const add = await productUpdateMany(productIds, params);
        res.status(200).json({message:'success', code:0})

    }catch(error){
        return res.status(500).json(error.message)
    }
}

const removeFeaturedCategoryProducts = async(req,res)=> {
    const {ids}= req.body
    const {id} = req.params;
    try{
        const find = await getByID(id, 'shops')
        if(!find){return res.sendStatus(404)}
        const add = await toggleProductFeaturedCategory(ids, false, id);
        res.status(200).json({message:'success', code:0})

    }catch(error){
        return res.status(500).json(error.message)
    }
}



const deleteProducts = async(req, res)=>{
    const {prodId}=req.body;
    const {id}=req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const product = await getByID(prodId, 'products')
        if(!product){return res.sendStatus(404)}
        const blobname = extractFileNameFromUrl(product.picture)
        const deleteImg = await deleteBlob(blobname, 'products')
        if(deleteImg.code == 3){return res.status(500).json(deleted.error)}
        const images = await fetch('productpictures', {productID:id})
        const deleted = await deleteImages('products', images)
        if(deleted.code == 3){ return res.status(500).json(deleted.error)}
        const deletion= await deleteData(prodId, 'products');
        if(!deletion){return res.sendStatus(400)}
        res.status(200).json({message:'Product deleted successfully', code:0 , id:prodId})

    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const getshopProducts = async(req,res)=> {
    const {id,page}=req.query;
    try{
        const pageNumber = parseInt(page)|| 1;
        const products = await findshopproducts(id, pageNumber);
        return res.status(200).json(products)

    }catch(error){
        return res.status(400).json({err: error.message})
    }
}

const searchProducts = async(req,res)=> {
    const {id,term, page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        const products = await searchShopProducts(term,  pageNumber, id);
        return res.status(200).json(products)

    }catch(error){
        return res.status(400).json(error)
    }
}

const getofferProducts = async(req,res)=> {
    const {id, page, slug} = req.query;
    try{
        let response = []
        const pageNumber = parseInt(page) || 1;
        const products = await getOfferProducts(id, slug, pageNumber)
        res.status(200).json(products)
    }catch(error){
        return res.status(500).json(error.message)
    }
}



const getRelatedproducts = async(req,res)=> {
    const {id, slug} = req.query;
    try{
        const products = await findRelatedProducts(id, slug)
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedHomeProducts = async(req,res)=> {
    const {id, page}=req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await fetchFeaturedHomeProducts(id, true, pageNumber)
        res.status(200).json(products);

    }catch(error){
        res.status(500).json(error.message)
    }
}



const getstandardproducts = async(req,res)=> {
    const {id, page}=req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await fetchFeaturedHomeProducts(id, false, pageNumber)
        res.status(200).json(products);

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getFeaturedCategoryProducts = async(req,res)=> {
    const {id, page, slug} = req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await findFeaturedCategoryProducts(id, slug, true, pageNumber)
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error.message)
    }
}


const getSubcategoryProducts = async(req,res)=> {
    const {id, slug, page} = req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await findSubcategoryProducts(id, slug, pageNumber)
        let response = []
        products.items.forEach(product=> {
            const item = {
                id:product.id, 
                name:product.name, 
                slug:product.slug,
                price:product.price,
                picture:product.picture, 
                category:product.categoryName, 
                subcategory:product.subcategoryName,
                onsale:product.onSale,
                saleprice:product.salePrice,
                discountPrice: product.discount == null ? 0 : getDiscountPrice(product.price, product.discount)
            }
            response.push(item)
        })
        res.status(200).json({totalPages:products.totalPages, items:response})

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getSingleProduct = async(req,res)=> {
    const {id, slug} = req.query;
    try{
        const product = await findSingleProductBySlug(id, slug)
        const item = {
            id:product.id, 
            name:product.name, 
            slug:product.slug,
            price:product.price,
            picture:product.picture, 
            category:product.categorySlug, 
            subcategory:product.subcategorySlug,
            onsale:product.onSale,
            saleprice:product.salePrice,
            discountPrice: product.discount == null ? 0 : getDiscountPrice(product.price, product.discount),
            couponCode:product.code == null ? null : product.code,
            description:product.description
        }
        res.status(200).json(item)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const getCollectionsProducts = async(req,res)=> {
    const {id, slug, page} = req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await findCollectionsProducts(id, slug, pageNumber);
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error)
    }
}

const getProductsNotinCollection = async(req,res)=> {
    const {id, shopid, page} = req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await filterProductsNotInCollection(id, shopid, pageNumber);
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error)
    }
}

const getProductsNotinOffer = async(req,res)=> {
    const {id, shopid, page} = req.query;
    try{
        const pageNumber = parseInt(page) || 1;
        const products = await filterProductsNotInOffer(id, shopid, pageNumber);
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(error)
    }
}




module.exports = {
    addProduct, 
    editProduct, 
    deleteProducts, 
    getofferProducts,
    addFeaturedCategoryProducts,
    removeFeaturedCategoryProducts,
    getRelatedproducts,
    getFeaturedHomeProducts,
    getFeaturedCategoryProducts,
    getSubcategoryProducts,
    getSingleProduct,
    getshopProducts,
    searchProducts,
    getCollectionsProducts,
    removeFeatured,
    addFeatured,
    getstandardproducts,
    getProductsNotinCollection,
    getProductsNotinOffer
    
}