const {fetchData, fetchSingleItem,insertToDB, FetchAllData, updateData } = require('../../config/Dbfunctions');
const {roundToNearest} = require('../../Utils/Utils')
const collection = 'Shops'
const p = 1
const getAllShops = async(req, res) => {
    const businesses = await FetchAllData({}, collection)
    let data = []
    await businesses.map(item=> {
        const results = {id:item._id, name:item.shopName, email:item.email, type:item.type, slug:item.slug}
        data.push(results)
    })
    res.status(200).json(data)
}

//get single business profile
const getSingleShop = async(req,res) => {
    let params 
    if(req.query.id){ params = {_id:req.query.id}}
    if(req.query.slug){params = {slug:req.query.slug}}
    const shop = await fetchSingleItem(params, collection)
    if(!shop){ return res.status(404).json({error:'shop not found', params})}
    const data = {id:shop._id, name:shop.shopName, slug:shop.slug, type:shop.type}
    res.status(200).json(data)
}

//get businesses by types
const getShopsByTypes = async(req, res)=> {
    const{types} = req.params
    const page = parseInt(req.query.page )|| p;
    const shops = await FetchAllData({type:types}, collection, page)
    if(!shops){return res.sendStatus(404)}
    let results = [];
    await shops.data.map(shop=> {
        const response = {id:shop._id, name:shop.shopName, slug:shop.slug, type:shop.type}
        results.push(response)
    })
    res.status(200).json(results)
}



//post a business review
const PostBizReview = async(req,res) => {
    const {name, email, shopId, rating, review} = req.body;
  try{
    let rateArr
    const ratings = await fetchData({shop:shopId}, 'Reviews')
    if(ratings.length < 0){rateArr = null}
    const data = {
        name:name, 
        email:email, 
        shop:shopId,
        rating:rating, 
        review:review, 
        createdAt:new Date(Date.now())
    }
    const insert = await insertToDB(data, 'Reviews')
    if(!insert){return res.status(404).json({error:'unable to add to db'})}
    rateArr = ratings;
    const shopRate = await getAverage(rateArr, rating)
    await updateData(shopId, {shopRating:shopRate}, 'Shops')
    res.status(200).json({message:'upload successful', code:3, rate:shopRate})

  }catch(error){
    res.status(401).json({error:error.message})
  }
}

const reviewProduct = async(req,res)=> {
    const {name, email, shopId, rating, review} = req.body;
    const {id}=req.params;
    try{
        let rateArr
        const ratings = await fetchData({shop:shopId, product:id}, 'Reviews')
        if(ratings.length < 0){rateArr = null}
        const data = {
            name:name, 
            email:email, 
            shop:shopId,
            product:id,
            rating:rating, 
            review:review, 
            createdAt:new Date(Date.now())
        }
        const insert = await insertToDB(data, 'Reviews')
        if(!insert){return res.status(404).json({error:'unable to add to db'})}
        rateArr = ratings;
        const productRate = await getAverage(rateArr, rating)
        await updateData(id, {productRate:productRate}, 'Products')
        res.status(200).json({message:'upload successful', code:3, rate:productRate})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const getShopReviews = async(req, res)=> {
    const {id} = req.params
    const page = parseInt(req.query.page )|| p;
    const reviews = await FetchAllData({shop:id}, 'Reviews', page)
    const results = await reviews.data.map(item=> {
        return {id:item._id, reviewedBy:item.name, rating:item.rating, review:item.review, date:item.createdAt}
    })
    res.status(200).json(results)
}

const getAverage = async(rateArr, rate)=> {
    const array = [rate]
    if(rateArr !== null){
        rateArr.forEach(rate=> {
            array.push(rate.rating)
        })
    }
    const sum = array.reduce((acc, val)=> acc + val, 0);
    const avg = sum / array.length;
    const finalAvg = roundToNearest(avg)
    return finalAvg
}


module.exports = {
    getAllShops, 
    getSingleShop, 
    getShopsByTypes, 
    PostBizReview,
    getShopReviews,
    reviewProduct
}