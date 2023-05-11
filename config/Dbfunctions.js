const {connectToDb, getDb, client} = require('./db');

connectToDb((err)=> {
    if(err) return
})
var db = getDb()
async function checkifEmpty(params, collection){
    const db = getDb()
   
    const check = await db.collection(collection).findOne(params)
    if(check){
        return true
    } else{
        return false
    }

}

async function findOne(params, collection){
    const db = getDb();

    const find = await db.collection(collection).findOne(params)
    if(!find) return{message:'nothing found', code:3}
    return find
}

async function insertToDB(params,collection){
    const db = getDb()

    const insert = await db.collection(collection).insertOne(params);
    if(insert){
        return true
    } else{
        return false
    }
}

async function FetchAllData(params, collection, page){
    const limit = 10;
    const dataPerPage = (page-1) * limit;
    const results = {}
    const count = await db.collection(collection).countDocuments(params)
    
    if(dataPerPage < count){
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
   
    if(dataPerPage > 0){
        results.previous = {
            page: page - 1,
            limit:limit
        }
    }


    try{
        const fetch = await db.collection(collection).find(params).limit(limit).skip(dataPerPage)
        if(!fetch){return false}
        const dataArray = await fetch.toArray();
        results.data = dataArray;
        return results
    }catch(error){
        return error
    }
}

async function fetchData(params, collection){
    const fetch = await db.collection(collection).find(params)
    if(!fetch){
        return false
    }
    const data = await fetch.toArray()
    return data
}

async function fetchSingleItem(params, collection){
    const item = await db.collection(collection).findOne(params);
    if(!item){
        return false
    }
    //const data = await item.toArray()
    return item
}

async function search(params, collection){
    const items = await db.collection(collection).find(params);
    if(!items){
        return {message:'nothing found'}
    }
    let data = []
    await items.forEach(item=> {
        const results = {id:item._id, name:item.name}
        data.push(results)
    })
    //const data = await items.toArray()
    return data;
}

async function updateData(value, params, collection){
   try{
    const db = getDb();
    const update = await db.collection(collection).updateOne({"_id":value}, {$set:params});
    if(!update){
        return {message:'failed to update'}
    }
    return {message:'Update success'}
   }catch(error){
    return error
   }
}

async function updateItems(updateParams, params, collection){
    try{
     const db = getDb();
     const update = await db.collection(collection).updateOne(updateParams, {$set:params});
     if(!update){
         return {message:'failed to update'}
     }
     return {message:'Update success'}
    }catch(error){
     return error
    }
 }

async function pushData(value, params, collection){
    const db = getDb();
    const update = await db.collection(collection).updateOne({"_id":value}, {$push:params});
    if(!update){
        return {message:'failed to update'}
    }
    return {message:'Update success'}
}

async function updateArray(arrParams, params, collection){
    const update = await db.collection(collection).updateOne(arrParams, {$set:params})
    if(!update){return false}
    return true
}

async function pullFromArray(arrParams, params, collection){
    const update = await db.collection(collection).updateOne(arrParams, {$pull:params})
    if(!update){return false}
    return true
}

async function deleteData(params, collection){
    const deleteItem = await db.collection(collection).deleteOne(params)
    if(!deleteItem){
        return {message:'failed to delete'}
    }
    return {message:'Item deleted successfully'}

}

async function updateMany(params, update, collection){
    const updateMany = await db.collection(collection).updateMany(params, {$set:update})
    if(!updateMany){return false}
    return true
}

async function calculate(params, collection){
    const count = await db.collection(collection).countDocuments(params);
    if(!count){return false}
    return count;
}

module.exports = {checkifEmpty, FetchAllData, findOne, insertToDB, fetchData, fetchSingleItem, search, updateData, deleteData, pushData, updateArray, pullFromArray, updateMany, updateItems, calculate}