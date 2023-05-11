const {DBInsert, findProductReviews, fetch, update } = require('../../config/prisma');
const {roundToNearest, generateID} = require('../../Utils/Utils')

const reviewProduct = async(req,res)=> {
    const {name, email, rating, review} = req.body;
    const {id}=req.params;
    try{
        let rateArr
        const ratings = await fetch('reviews',{productID:id})
        const data = {
            id:generateID(),
            name, 
            email, 
            productID:id,
            rating:rating, 
            review:review
        }
        const insert = await DBInsert('reviews', data)
        if(!insert){return res.status(404).json({error:'unable to add to db'})}
        if(ratings.length < 0){
            rateArr = null
        } else{
            rateArr = ratings;
        }
       
        const productRate = await getAverage(rateArr, rating)
        await update(id, 'products', {rating:productRate})
        res.status(200).json({message:'upload successful', code:3, rate:productRate, insert})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
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

const getProductReviews = async(req,res)=> {
    const {slug}= req.params
    try{
        const products = await findProductReviews(slug);
        res.status(200).json(products)
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports ={reviewProduct, getProductReviews}