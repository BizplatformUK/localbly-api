const {DBInsert, findData, fetch, getSubscribers, fetchsubscribers} = require('../../config/prisma')
const {generateID, getAbbreviation} = require('../../Utils/Utils');
const { sendMonthlyEmailNotification } = require('../Emails/email');

const createPackage = async(req,res)=> {
    const {name, price, description} = req.body
    const{id}=req.params;
    try{
     const user = await findData('pickupstores', {id:id})
     if(!user){return res.sendStatus(404)}
     const abbr = getAbbreviation(name)
     const data = {
         id: abbr + generateID(),
         name,
         price,
         description,
         storeID:id
     }
     const insert = await DBInsert('packages', data)
     if(!insert){return res.sendStatus(400)}
     //const response = {name:insert.name, id:insert.id, slug:insert.slug, logo:insert.logo}
     res.status(200).json({message: 'Shop created successfully', code:3, insert})
 
    }catch(error){
     return res.status(500).json(error.message)
    }
 }

 const fetchPackages = async(req,res)=> {
    const {id}=req.params;
    try{
        const packages = await fetch('packages', {storeID:id})
        let response = [];
        packages.forEach(package=> {
            const item = {id:package.id, name:package.name, description:package.description, price:package.price}
            response.push(item)
        })
        res.status(200).json(response)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const addSubscription = async(req,res)=> {
    const {userid, packageid} = req.body;
    const {id}= req.params;
    try{
    const user = await findData('users', {id:userid})
    if(!user){return res.sendStatus(404)}
    const packages = await findData('users', {id:packageid})
    if(!packages){return res.sendStatus(404)}
    const stores = await findData('pickupstores', {id:id})
    if(!stores){return res.sendStatus(404)}

    const params = {
        id: generateID(),
        userID: userid,
        packageID:packageid,
        storeID:id
    }
    const insert = await DBInsert("subscriptions", params)
    res.status(200).json(insert)
    }catch(error){
        res.status(500).json()
    }
}


const selectSubscirber = async(req,res)=> {
    const {id}=req.params
    try{
        const subscribers = await getSubscribers(id)
        res.status(200).json(subscribers)

    }catch(error){
        res.status(500).json(error.message)
    }
}

const sendEmails = async(req,res)=> {
    try{
        const subscribers = await fetchsubscribers()
        subscribers.forEach(subscriber=> {
            sendMonthlyEmailNotification(subscriber.host, subscriber.port, subscriber.user, subscriber.email, subscriber.date, subscriber.name, subscriber.price, 'link')
        })
        res.status(200).json(subscribers)

    }catch(error){
        res.status(500).json(error.message)
    }
}

 module.exports = {createPackage, fetchPackages, addSubscription, selectSubscirber, sendEmails}