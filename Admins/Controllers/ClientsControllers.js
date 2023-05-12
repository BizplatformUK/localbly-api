const {isEmpty, DBInsert, findData, update, deleteItem, fetch, findShopClients} = require('../../config/prisma');
const {generateID, getAbbreviation, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')


const addClient = async(req,res)=> {
    const {client, type, logo} = req.body
    const {id} = req.params;
    try{
        const find = await findData('shops', {id});
        if(!find){return res.status(404).json({error:'shop not found', code:3})}
        const check = await isEmpty('clients', {shopID:id, name:client})
        if(check){return res.status(400).json({error: 'A client with this name already exists', code:3})}
        const abbr = getAbbreviation(client)
        const params = {
            id:abbr + generateID(),
            name:client,
            logo,
            clientType:type,
            shopID:id
        }
        const insert = await DBInsert('clients', params)
        if(!insert){return res.status(400)}
        const response = {id:insert.id, name:insert.name, logo:insert.logo}
        res.status(200).json({message: 'Client uploaded successfully', code:0, response})

    }catch(error){
        return res.status(200).json({error:error.message, code:3})
    }
}

const editClient = async(req,res)=> {
    const {clientId, name, logo} = req.body;
    const {id}=req.params;
    try{
        const find = await findData('clients', {id:clientId, shopID:id})
        if(!find){return res.status(404).json({erro:'Shop not found'})}
        const imgName = extractFileNameFromUrl(find.logo)
        const editImg = extractFileNameFromUrl(logo);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'clients')
            if(imgdelete.code == 3){return res.status(500).json(imgdelete.error)}
        }
        const params = {name, logo}
        const client = await update(clientId, 'clients',params)
        if(!client){return res.status(400).json({error:client, code:3})}
        const response = {id:client.id, name:client.name,  logo:client.logo}
        res.status(200).json({message: 'Client update successfully', code:0, response})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const deleteClient = async(req, res)=> {
    const {clientId} = req.body;
    const {id}= req.params;
    try{
        const find = await findData('clients', {id:clientId, shopID:id})
        if(!find){return res.status(404).json({error:'client not found', code:3})}
        const blobname = extractFileNameFromUrl(find.logo)
        const deleted = await deleteBlob(blobname, 'clients')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const deletion = await deleteItem(clientId, 'clients')
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json({message: 'Client deleted successfully', id:clientId, code:0})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const fetchClients = async(req,res)=> {  
    const {id, page} = req.query;
    try{
        let response = []
        const pageNumber = parseInt(page )|| 1;
        const params = {shopID:id, clientType:'Corporate'}
        const clients = await fetch('clients', params, pageNumber);
        return res.status(200).json(clients)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

const searchClients = async(req,res)=> {
    try{
        const pageNumber = parseInt(req.query.page )|| 1;
        const id = req.query.id;
        const query = req.query.term;
        let response = []
            const collections = await search('collections', query, id, pageNumber);
            const results = collections.items;
            results.forEach(collection=> {
                const item = {id:collection.id, name:collection.name, picture:collection.picture, slug:collection.slug, category:collection.category, date:collection.createdAt}
                response.push(item)
            })
            return res.status(200).json({total:collections.total, data:response})
        
       
    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports={addClient, editClient, deleteClient, fetchClients}