const {insertData, updateData, deleteData, dbCheck, getByID, getshopClients, getDataByMultipleParams, searchData} = require('../../config/sqlfunctions');
const {generateID, getAbbreviation, extractFileNameFromUrl, compareStrings} = require('../../Utils/Utils');
const {deleteBlob} = require('../Images/ImageController')


const addClient = async(req,res)=> {
    const {client, type, logo} = req.body
    const {id} = req.params;
    try{
        const find = await getByID(id, 'shops');
        if(!find){return res.status(404).json({error:'shop not found', code:3})}
        const items = {client, id}
        const check = await dbCheck(items, 'clients')
        if(check){return res.status(400).json({error: 'A client with this name already exists', code:3})}
        const abbr = getAbbreviation(client)
        const params = {
            id:abbr + generateID(),
            name:client,
            logo,
            clientType:type,
            shopID:id
        }
        const insert = await insertData(params, 'clients')
        if(!insert){return res.status(400)}
        //const response = {id:insert.id, name:insert.name, logo:insert.logo}
        res.status(200).json({message: 'Client uploaded successfully', code:0, response:insert})

    }catch(error){
        return res.status(200).json(error)
    }
}

const editClient = async(req,res)=> {
    const {clientId, name, logo} = req.body;
    const {id}=req.params;
    try{
        const find = await getByID(clientId, 'clients')
        if(!find){return res.status(404).json({erro:'Shop not found'})}
        const imgName = extractFileNameFromUrl(find.logo)
        const editImg = extractFileNameFromUrl(logo);
        const strSimilar = compareStrings(imgName, editImg)
        if(!strSimilar){
            const imgdelete = await deleteBlob(imgName, 'clients')
            if(imgdelete.code == 3){return res.status(500).json(imgdelete.error)}
        }
        const params = {name, logo}
        const client = await updateData(clientId, params, 'clients')
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
        const find = await dbCheck({id:clientId, shopID:id}, 'clients')
        if(!find){return res.status(404).json({error:'client not found', code:3})}
        const blobname = extractFileNameFromUrl(find.logo)
        const deleted = await deleteBlob(blobname, 'clients')
        if(deleted.code == 3){return res.status(500).json(deleted.error)}
        const deletion = await deleteData(clientId, id, 'clients')
        if(!deletion){return res.sendStatus(500)}
        res.status(200).json({message: 'Client deleted successfully', id:clientId, code:0})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
}

const fetchClients = async(req,res)=> {  
    const {id, page} = req.query;
    try{
        const pageNumber = parseInt(page)|| 1;
        const clients = await getshopClients(id, 'Corporate', pageNumber);
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
        const clients = await searchData(query, 'clients', pageNumber, id);
        return res.status(200).json({totalPages:clients.totalPages, items:clients.items})

    }catch(error){
        res.status(500).json(error.message)
    }
}

module.exports={addClient, editClient, deleteClient, fetchClients, searchClients}