const {generateID, getAbbreviation, slugify, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')
const {insertData, updateData, deleteData, dbCheck, getDataByParams, getByID, searchData} = require('../../config/sqlfunctions')


const addService = async(req,res)=> {
    const {name, price, description, image} = req.body
    const {id}= req.params;
    try{
        const shop = await getByID(id, 'shops')
        if(!shop){return res.sendStatus(404)}
        const items = {name, id}
        const find = await dbCheck(items, 'services')
        if(find){return res.status(400).json({error: 'A service with this name already exists please use a different name', code:3})}
        const slug = slugify(name)
        const abbr = getAbbreviation(name)
        const params = {
            id:abbr + generateID(),
            name,
            price,
            description,
            slug,
            shopID:id,
            picture: image
        }
        const insert = await insertData(params, 'services')
        if(!insert){return res.sendStatus(400)}
        //const response = {name:insert.name, price:insert.price, id:insert.id, image:insert.picture}
        res.status(200).json({message: 'Service uploaded successfully',  code:0, response:insert})
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const editService = async(req,res)=> {
    const {serviceId, name, price, description, image} = req.body;
    const {id}=req.params;
    try{
        const service = await getByID(serviceId, 'services')
        if(!service){return res.status(404).json({error: 'service not found', code:3})}
        const shop = await getByID(id, 'shops')
        if(!shop){return res.status(404).json({error: 'shop not found', code:3})}
        const imgName = extractFileNameFromUrl(service.picture)
        const editImg = extractFileNameFromUrl(image);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'services')
            if(imgdelete.code == 3){return res.status(400).json({error:imgdelete.error, code:3})}
        }
        const slug = slugify(name)
        const params = {
            name,
            price,
            description,
            slug,
            picture:image
        }
        const data = await updateData(serviceId, params,  'services')
        if(!data){return res.sendStatus(500)}
        res.status(200).json({message:'service updated successfully', code:0, response:data})

    }catch(error){
        return res.status(500).json({error:error.message, code:3})
    }
}

const deleteService = async(req,res)=> {
    const {serviceId} = req.body;
    const {id}=req.params;
    try{
        const service = await getByID(serviceId, 'services')
        if(!service){return res.status(404).json({error:'service not found', code:3})}
        const blobname = extractFileNameFromUrl(service.picture)
        const deleted = await deleteBlob(blobname, 'services')
        const deletion = await deleteData(serviceId, id, 'services')
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json({message:'Service deleted successfully', id:serviceId, deletion, code:0})

    }catch(error){
        return res.status(500).json({error:error.message, code:3})
    }
}

const fetchServices = async(req,res)=> {
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(page )|| 1;
        const params = {shopID:id}
        const services =  await getDataByParams(params, 'services', pageNumber);
        return res.status(200).json(services)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const searchServices = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const id = req.query.id;
        const query = req.query.term;
        const services = await searchData(query, 'services', pageNumber, id);
        return res.status(200).json(services)
    }catch(error){
        return res.status(500).json(error.message)
    }
}
module.exports = {addService, editService, deleteService, fetchServices, searchServices}