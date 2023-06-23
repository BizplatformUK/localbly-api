const fs = require('fs')
const db = require('./sql')
const { extractFileNameFromUrl } = require('../Utils/Utils')
require('dotenv').config()






const dbCheck = async (data, table) => {
  try {
    const sql = `SELECT * FROM ${table} WHERE name = ? AND shopID = ?`;
    
    const [rows] = await db.query(sql, [data.name, data.id])
    if(rows.length < 1){
      return false
    }
    return rows;
  } catch (error) {
    return error.message;
  }
};


const ifShopExists = async (id) => {
    try {

      const query = `SELECT * FROM shops WHERE id = ?`;
      const [rows] = await db.query(query, [id]);
      if(rows.length < 1){
        return false
      }
      return rows;
    } catch (error) {
      return error.message;
    }
};

const getByID = async(id,table)=> {
  try{
    const sql = `SELECT * FROM ${table} WHERE id = ? LIMIT 1`
    const [rows] = await db.query(sql, [id]);
    if(rows.length < 1){
      return false
    }
    return rows[0];

  }catch(error){
      return error.message
  }
}

const getuserBYEmail = async(email)=> {
  try{
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`
    const [rows] = await db.query(sql, [email]);
    if(rows.length < 1){
      return false
    }
    return rows[0];

  }catch(error){
      return error.message
  }
}

const findSingleUser = async(email, number)=> {
  try{
    const sql = `SELECT * FROM users WHERE email = ? AND number = ?  LIMIT 1`
    const [rows] = await db.query(sql, [email, number]);
    if(rows.length < 1){
      return false
    }
    return rows[0];

  }catch(error){
      return error.message
  }
}


const insertData = async(data,table) => {
  try{
    let sql = `INSERT INTO ${table} SET ?`;
    const [results] = await db.query(sql, data)
    const response = await getByID(data.id, table)
    return response;
  } catch(error){
    return error
  }
};

const updateData = async(id, data, table) => {
    try{
      let update = `UPDATE ${table} SET ? WHERE id = ?`
      const [results] = await db.query(update, [data, id])
      const response = await getByID(id, table)
      return response;
    }catch(error){
      return error;
    }
  
};

const deleteData = async(id, shopid, table) => {
  try{
    let sql = `DELETE FROM ${table} WHERE id = ? AND shopID = ?`;
    const [results] = await db.query(sql, [id, shopid])
    if(results){
      return id
    }
  }catch(error){
    return error
  }
 
};

const deleteFromBanner = async(id, shopid) => {
  try{
    let sql = `DELETE FROM banner WHERE itemID = ? AND shopID = ?`;
    const [results] = await db.query(sql, [id, shopid])
    if(results){
      return id;
    }
    
  }catch(error){
    console.log(error)
  }
  
};

const deleteMultipleItems = async(ids, shopid, table) => {
  try{
    const sql = `DELETE FROM ${table} WHERE shopID = ? AND id IN (?)`;
    const [results] = await db.query(sql, [shopid, ids])
    return results;
  }catch(error){
    return error
  }
 
};



const getData = async(table, id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM ${table} WHERE shopID = ?`;
    const sql = `SELECT * FROM ${table} WHERE shopID = ? LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql, [id])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const getDataByParams = async(data, table, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM ${table} WHERE ?`;
    const sql = `SELECT * FROM ${table} WHERE ? LIMIT ? OFFSET ?`;
    const [count] = await db.query(countSql, [data])

    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [data, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;

  } catch (error) {
    return error.message;
  }
};

const getBanner = async(slug)=> {
  try{
      const sql = `SELECT b.* FROM banner AS b JOIN shops s ON b.shopID = s.id WHERE s.slug = ?`;
      const [results] = await db.query(sql, [slug])
      return results

  }catch(error){
      return error.message
  }
}

const isPresentInBanner = async(id, shopid)=> {
  try{
      const sql = `SELECT * FROM banner WHERE itemID = ? AND shopID = ? LIMIT 1`;
      const [results] = await db.query(sql, [id, shopid])
      if(results.length < 1){
        return false;
      }
      return true

  }catch(error){
      return error.message
  }
}


const getSingleItem = async(data,table)=> {
  try{
    const sql = `SELECT * FROM ${table} WHERE ? LIMIT 1`
    const [result] = await db.query(sql, [data])
    return result[0]

  }catch(error){
      return error.message
  }
}

const findsingleShop = async(id) => {
  try{
    const sql = `SELECT s.*, st.name AS shopType
    FROM shops s
    JOIN shopTypes st ON s.typeID = st.id
    WHERE s.ownerID = ?
    LIMIT 1`;

    const [results] = await db.query(sql, [id])
    return results[0];
  }catch(error){
    return error;
  }
  
};

const getShops = async(pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM shops`;
    const sql = `SELECT * FROM shops LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql)
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const getShopTypes = async(pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM shopTypes`;
    const sql = `SELECT * FROM shopTypes LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql)
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const totalShopProducts = async(id) => {
  try {
    const countSql = `SELECT COUNT(*) AS total FROM products WHERE shopID = ?`;

    const [count] = await db.query(countSql, [id])
    const totalItems = count[0].total

    return totalItems;
   
  } catch (error) {
    return error.message;
  }
};


const fetchFeaturedShopCategories = async(id, featured, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM categories WHERE shopID = ? AND featured = ?`;
    const sql = `SELECT * FROM categories WHERE shopID = ? AND featured = ? LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql, [id, featured])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, featured, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const searchData = async(term, table, pageNumber, id) => {
  try {
    const itemsPerPage = 6;
    const searchTerm = `%${term}%`;

    const countSql = `SELECT COUNT(*) AS total FROM ${table} WHERE name LIKE ? AND shopID = ?`;
    const sql = `SELECT * FROM ${table} WHERE name LIKE ? AND shopID = ? LIMIT ? OFFSET ?`;

    const [count] = await db.query(countSql, [searchTerm, id])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [searchTerm, id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;

  } catch (error) {
    return error.message;
  }
};

const filterShopCollections = async(id, featured, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM collections WHERE shopID = ? AND featured = ?`;
    const sql = `SELECT * FROM collections WHERE shopID = ? AND featured = ? LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql, [id, featured])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, featured, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const filterProductsNotInCollection = async(id, shopid, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM products WHERE shopID = ? AND collectionsID != ?`;
    const sql = `SELECT * FROM products WHERE shopID = ? AND collectionsID != ? LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql, [shopid, id])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [shopid, id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const findCurrentOffers = async(id, pageNumber) => {
  try{
    const itemsPerPage = 6;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validFrom <= CURDATE() AND validTo >= CURDATE() AND shopID = ?';
    const sql = 'SELECT * FROM offers WHERE validFrom <= CURDATE() AND validTo >= CURDATE() AND shopID = ?';

    const [count] = await db.query(countsql, [id])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
  }catch(error){
    return error
  }

  
};

const findPastOffers = async(id, pageNumber) => {
  try{
    const itemsPerPage = 6;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validFrom >= CURDATE() AND validTo <= CURDATE() AND shopID = ?';
    const sql = 'SELECT * FROM offers WHERE validFrom >= CURDATE() AND validTo <= CURDATE() AND shopID = ?';

    const [count] = await db.query(countsql, [id])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
  }catch(error){
    return error
  }
};

const filterOfferTypes = async(id, type, pageNumber) => {
  try{
    const itemsPerPage = 6;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validFrom <= CURDATE() AND validTo >= CURDATE() AND shopID = ? AND type = ?';
    const sql = 'SELECT * FROM offers WHERE validFrom <= CURDATE() AND validTo >= CURDATE() AND shopID = ? AND type = ?';

    const [count] = await db.query(countsql, [id, type])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, type, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
  }catch(error){
    return error
  }
};

const filterOfferFeatured = async(id, featured, pageNumber) => {
  try{
    const itemsPerPage = 6;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validFrom <= CURDATE() AND validTo >= CURDATE() AND shopID = ? AND featured = ?';
    const sql = 'SELECT * FROM offers WHERE validFrom <= CURDATE() AND validTo >= CURDATE() AND shopID = ? AND featured = ?';

    const [count] = await db.query(countsql, [id, featured])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [id, featured, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
  }catch(error){
    return error
  }
};

  const addMultipleProductsToCollections = async(ids, colid) => {
    try{
      let update = `UPDATE products SET collectionsID = ? WHERE id IN (?)`;
      const [results] = await db.query(update, [colid, ids])
      return results;
    }catch(error){
      return error;
    }
  };

  const addMultipleProductsToOffers = async(ids, shopid, offid) => {
    try{
      let update = `UPDATE products SET offerID = ? WHERE shopID = ? AND id IN (?)`;
      const [results] = await db.query(update, [offid, shopid, ids])
      return results;
    }catch(error){
      return error;
    }
    
  };

  const getshopClients = async(id, type, pageNumber) => {
    try {
      const itemsPerPage = 6;
      const countSql = `SELECT COUNT(*) AS total FROM clients WHERE shopID = ? AND clientType = ?`;
      const sql = `SELECT * FROM clients WHERE shopID = ? AND clientType = ? LIMIT ? OFFSET ?`; 
  
      const [count] = await db.query(countSql, [id, type])
      const totalItems = count[0].total
  
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
  
      const [rows] = await db.query(sql, [id, type, itemsPerPage, offset])
      const results = {totalPages, items:rows}
      return results;
     
    } catch (error) {
      return error.message;
    }
  };

  const toggleProductFeaturedHome= async(ids, featured, shopid) => {

    try{
      let update = `UPDATE products SET featuredHome = ? WHERE id IN (?) AND shopID = ?`;
      const [results] = await db.query(update, [featured, ids, shopid])
      return results;
    }catch(error){
      return error
    }

  };

  const toggleProductFeaturedCategory= async(ids, featured, shopid) => {
    try{
      let update = `UPDATE products SET featuredCategory = ? WHERE id IN (?) AND shopID = ?`;
      const [results] = await db.query(update, [featured, ids, shopid])
      return results;
    }catch(error){
      return error
    }

  };

  const findshopproducts = async(id,  pageNumber) => {
    try {
      const itemsPerPage = 6;
      const countSql = `SELECT COUNT(*) AS total FROM products WHERE shopID = ?`;
      const sql = `SELECT p.*, sc.name AS subcategory, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS category, pc.name AS collection
                           FROM products p
                           JOIN categories c ON p.categoryID = c.id
                           JOIN subcategories sc on p.subcategoryID = sc.id
                           JOIN collections pc on p.collectionsID = pc.id
                           WHERE p.shopID = ?
                           ORDER BY p.createdAt DESC
                           LIMIT ? OFFSET ?`;

    const [count] = await db.query(countSql, [id])
    const totalItems = count[0].total
                       
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;
                       
    const [rows] = await db.query(sql, [id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
    } catch (error) {
      return error.message;
    }
  };

const getOfferProducts = async(id, slug, pageNumber) => {
    try {
      const itemsPerPage = 6;
      const countSql = `SELECT COUNT(*) AS total FROM products
                          JOIN offers ON offers.id = products.offerID
                          WHERE offers.slug = ? AND products.shopID = ?`;
      const sql = `SELECT products.*, offers.slug AS offerSlug, offers.name AS offerName
                           FROM products
                           JOIN offers ON offers.id = products.offerID
                           WHERE offers.slug = ? AND products.shopID = ?
                           ORDER BY products.createdAt DESC
                           LIMIT ? OFFSET ?`;
      const [count] = await db.query(countSql, [slug, id])
      const totalItems = count[0].total
                                              
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
                                              
      const [rows] = await db.query(sql, [slug, id, itemsPerPage, offset])
      const results = {totalPages, items:rows} 
      return results                   
    } catch (error) {
      return error.message;
    }
  };

const fetchFeaturedHomeProducts = async(id, featured,  pageNumber) => {
    try {
      const itemsPerPage = 6;
      const countSql = `SELECT COUNT(*) AS total FROM products WHERE featuredHome = ? AND shopID = ?`;
      const sql = `SELECT * FROM products WHERE featuredHome = ? AND shopID = ? ORDER BY products.createdAt DESC LIMIT ? OFFSET ?`;

      const [count] = await db.query(countSql, [featured, id])
      const totalItems = count[0].total
                                              
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
                                              
      const [rows] = await db.query(sql, [featured, id, itemsPerPage, offset])
      const results = {totalPages, items:rows} 
      return results                   
    } catch (error) {
      return error.message;
    }
  };

  const findFeaturedCategoryProducts = async(id, slug, featured, pageNumber) => {

    try {
      const itemsPerPage = 6;
      const countSql = `SELECT COUNT(*) AS total FROM products
                          JOIN categories ON categories.id = products.categoryID
                          WHERE categories.slug = ? AND products.shopID = ? AND products.featuredCategory = ?`;
      const sql = `SELECT products.*, categories.slug AS categorySlug, categories.name AS categoryName
                           FROM products
                           JOIN categories ON categories.id = products.categoryID
                           WHERE categories.slug = ? AND products.shopID = ? AND products.featuredCategory = ? 
                           ORDER BY products.createdAt DESC
                           LIMIT ? OFFSET ?`;
            
    const [count] = await db.query(countSql, [slug, id, featured])
    const totalItems = count[0].total
                                                                   
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;
                                                                   
    const [rows] = await db.query(sql, [slug, id, featured, itemsPerPage, offset])
    const results = {totalPages, items:rows} 
    return results
    } catch (error) {
      return error.message;
    }
  };

  const findSubcategoryProducts = async(id, slug, pageNumber) => {
    try {
      const itemsPerPage = 6;
      const countSql = `SELECT COUNT(*) AS total FROM products p
                          JOIN categories c ON p.categoryID = c.id
                          JOIN subcategories sc on p.subcategoryID = sc.id
                          WHERE sc.slug = ? AND p.shopID = ?`;
        const sql = `SELECT p.*, sc.name AS subcategoryName, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS categoryName
                           FROM products p
                           JOIN categories c ON p.categoryID = c.id
                           JOIN subcategories sc on p.subcategoryID = sc.id
                           WHERE sc.slug = ? AND p.shopID = ?
                           ORDER BY p.createdAt DESC
                           LIMIT ? OFFSET ?`;

      const [count] = await db.query(countSql, [slug, id])
      const totalItems = count[0].total
                                                                                          
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
                                                                                          
      const [rows] = await db.query(sql, [slug, id, itemsPerPage, offset])
      const results = {totalPages, items:rows}
      return results;                
     
    } catch (error) {
      return error.message;
    }
  };

const findSingleProductBySlug = async(id, slug ) => {
    try{
      const sql = `SELECT p.*, sc.name AS subcategoryName, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS categoryName
                           FROM products p
                           JOIN categories c ON p.categoryID = c.id
                           JOIN subcategories sc on p.subcategoryID = sc.id
                           WHERE p.slug = ? AND p.shopID = ?
                           LIMIT 1`;
    const [results] = await db.query(sql, [slug, id])
    return results[0];
    }catch(error){
      return error;
    }
   
};

const findCollectionsProducts = async(id, slug, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM products p
                        JOIN collections c ON p.collectionsID = c.id
                        WHERE c.slug = ? AND p.shopID = ?`;
    const sql = `SELECT p.*, c.name AS collectionName, c.slug AS collectionSlug, pc.name AS categoryName, pc.slug AS categorySlug, sc.name AS subcategoryName,sc.slug AS subcategorySlug
                         FROM products p
                         JOIN collections c ON p.collectionsID = c.id
                         JOIN categories pc ON p.categoryID = pc.id
                         JOIN subcategories sc ON p.subcategoryID = sc.id
                         WHERE c.slug = ? AND p.shopID = ?
                         ORDER BY p.createdAt DESC
                         LIMIT ? OFFSET ?`;
  const [count] = await db.query(countSql, [slug, id])
  const totalItems = count[0].total
                                                                                                             
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const offset = (pageNumber - 1) * itemsPerPage;
                                                                                                             
  const [rows] = await db.query(sql, [slug, id, itemsPerPage, offset])
  const results = {totalPages, items:rows}
  return results;                  
  } catch (error) {
    return error.message;
  }
};

const findRelatedProducts = async(id, slug) => {
  try{
    const sql = `SELECT p.* FROM products p JOIN categories c on p.categoryID = c.id WHERE c.id =(SELECT categoryID from products WHERE slug = '${slug}')
    AND p.slug != ? AND p.shopID = ? ORDER BY p.createdAT DESC LIMIT 4`;
    const [results] = await db.query(sql, [slug, id])
    return results;
  }catch(error){
    return error
  }
 
};

const getUsers = async() => {
    try {
      const sql = `SELECT COUNT(*) AS totalCount FROM users`;
      const [rows] = await db.query(sql);
      return rows
    } catch (error) {
      throw error;
    }
};
  

const getSubcategoriesByCategorySlug = async(slug, id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM subcategories
                        JOIN categories ON categories.id = subcategories.categoryID
                        WHERE categories.slug = ? AND subcategories.shopID = ?`;
      const sql = `SELECT subcategories.*, categories.slug AS categorySlug, categories.name AS categoryName
                         FROM subcategories
                         JOIN categories ON categories.id = subcategories.categoryID
                         WHERE categories.slug = ? AND subcategories.shopID = ?
                         ORDER BY subcategories.createdAt DESC
                         LIMIT ? OFFSET ?`;
    const [count] = await db.query(countSql, [slug, id])
    const totalItems = count[0].total
                                                                                                                                    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;
                                                                                                                                    
    const [rows] = await db.query(sql, [slug, id, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;               
  } catch (error) {
    return error.message;
  }
};


const getSubcategoriesByCategoryID = async(id, catId, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM subcategories
                        JOIN categories ON categories.id = subcategories.categoryID
                        WHERE categories.id = ? AND subcategories.shopID = ?`;
      const sql = `SELECT subcategories.*, categories.slug AS categorySlug, categories.name AS categoryName
                         FROM subcategories
                         JOIN categories ON categories.id = subcategories.categoryID
                         WHERE categories.id = ? AND subcategories.shopID = ?
                         ORDER BY subcategories.createdAt DESC
                         LIMIT ? OFFSET ?`;
     const [count] = await db.query(countSql, [catId, id])
     const totalItems = count[0].total
                                                                                                                                                         
     const totalPages = Math.ceil(totalItems / itemsPerPage);
     const offset = (pageNumber - 1) * itemsPerPage;
                                                                                                                                                         
      const [rows] = await db.query(sql, [catId, id, itemsPerPage, offset])
     const results = {totalPages, items:rows}
      return results;                      
    
  } catch (error) {
    return error.message;
  }
};


const fetchShopSubcategories = async(id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    const countSql = `SELECT COUNT(*) AS total FROM subcategories WHERE shopID = ?`;
    const sql = `SELECT subcategories.*, categories.slug AS categorySlug, categories.name AS category
                         FROM subcategories
                         JOIN categories ON categories.id = subcategories.categoryID
                         WHERE subcategories.shopID = ?
                         ORDER BY subcategories.createdAt DESC
                         LIMIT ? OFFSET ?`;
     const [count] = await db.query(countSql, [id])
     const totalItems = count[0].total
                                                                                                                                                         
     const totalPages = Math.ceil(totalItems / itemsPerPage);
     const offset = (pageNumber - 1) * itemsPerPage;
                                                                                                                                                         
      const [rows] = await db.query(sql, [id, itemsPerPage, offset])
     const results = {totalPages, items:rows}
      return results;                      
    
  } catch (error) {
    return error.message;
  }
};


module.exports={
    insertData, 
    getUsers, 
    getByID, 
    getData, 
    ifShopExists,
    updateData,
    getBanner,
    deleteData,
    getSingleItem,
    getDataByParams,
    dbCheck,
    searchData,
    findPastOffers,
    findCurrentOffers,
    getSubcategoriesByCategorySlug,
    getSubcategoriesByCategoryID,
    getOfferProducts,
    findRelatedProducts,
    findFeaturedCategoryProducts,
    findSubcategoryProducts,
    findSingleProductBySlug,
    findCollectionsProducts,
    deleteMultipleItems,
    deleteFromBanner,
    addMultipleProductsToCollections,
    addMultipleProductsToOffers,
    findshopproducts,
    toggleProductFeaturedHome,
    findsingleShop,
    getuserBYEmail,
    getShops,
    getShopTypes,
    totalShopProducts,
    isPresentInBanner,
    fetchFeaturedShopCategories,
    filterShopCollections,
    filterOfferTypes,
    filterOfferFeatured,
    getshopClients,
    toggleProductFeaturedCategory,
    fetchFeaturedHomeProducts,
    findSingleUser,
    fetchShopSubcategories,
    filterProductsNotInCollection
    
}