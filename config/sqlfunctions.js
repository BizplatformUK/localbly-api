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

const finshopbyName = async (name) => {
  try {
    const sql = `SELECT * FROM shops WHERE name = ? `;
    
    const [rows] = await db.query(sql, [name])
    if(rows.length < 1){
      return false
    }
    return true;
  } catch (error) {
    return error.message;
  }
};

const finshopbySlug = async (slug) => {
  try {
    const sql = `SELECT currency, whatsappnumber, brandcolor FROM shops WHERE slug = ? LIMIT 1`;
    
    const [rows] = await db.query(sql, [slug])
    if(rows.length < 1){
      return false
    }
    return rows[0];
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

const getuserBYNumber = async(number)=> {
  try{
    const sql = `SELECT * FROM users WHERE number = ? LIMIT 1`
    const [rows] = await db.query(sql, [number]);
    if(rows.length < 1){
      return false
    }
    return rows[0];

  }catch(error){
      return error.message
  }
}

const getuserBYResetToken = async(token)=> {
  try{
    const sql = `SELECT * FROM users WHERE resetToken = ? LIMIT 1`
    const [rows] = await db.query(sql, [token]);
    if(rows.length < 1){
      return false
    }
    return rows[0];

  }catch(error){
      return error.message
  }
}

const changePassword = async(data, token) => {
  try{
    let update = `UPDATE users SET ? WHERE resetToken = ?`
    const [results] = await db.query(update, [data, token])
    const response = await getByID(id, table)
    return response;
  }catch(error){
    return error;
  }

};

const findSingleUser = async(email, number)=> {
  try{
    const sql = `SELECT * FROM users WHERE email = '${email}' AND number = '${number}'  LIMIT 1`
    const [rows] = await db.query(sql);
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



const updateUserShopID = async(userID, shopID)=> {
  try{
    let update = `UPDATE users SET shopID = ? WHERE id = ?`
    const [results] = await db.query(update, [shopID, userID])
    const sql = `SELECT name, id, email,shopID, role, number FROM users WHERE shopID = ? LIMIT 1`
    const [rows] = await db.query(sql, [shopID])
    if(rows.length < 1){
      return false
    }
    return rows[0]
  }catch(error){
    return error
  }
}

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

const findShopAdmins = async(id, approved) => {
  try {
    const sql = `SELECT 
     id AS id,
     name AS name,
     email AS email,
     role AS role,
     shopID AS shopID,
     approved AS approved
     FROM users WHERE shopID = ? AND approved = ? AND role != 'super-admin' ORDER BY createdAt DESC`; 

    const [rows] = await db.query(sql, [id, approved])
    return rows;
   
  } catch (error) {
    return error.message;
  }
};



const getData = async(table, id, pageNumber) => {
  try {
    const itemsPerPage = 8;
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
    const itemsPerPage = 8;
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
      const sql = `
      SELECT b.*, s.slug AS shopSlug, s.brandcolor AS bgColor FROM banner b
      JOIN shops s ON b.shopID = s.id WHERE s.slug = ?`;
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
    const [results] = await db.query(sql, [data])
    if(results.length < 1){
      return false;
    }
    return results[0]
  }catch(error){
      return error.message
  }
}

const findsingleShop = async(id) => {
  try{
    const sql = `SELECT s.*, st.name AS shopType
    FROM shops s
    JOIN shopTypes st ON s.typeID = st.id
    WHERE s.id = ?
    LIMIT 1`;

    const [results] = await db.query(sql, [id])
    if(results.length < 1){
      return false;
    }
    return results[0];
  }catch(error){
    return error;
  }
  
};

const getShops = async(pageNumber) => {
  try {
    const itemsPerPage = 8;
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
    const itemsPerPage = 8;
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

const fetchShopServices = async(slug, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const countSql = `
    SELECT COUNT(*) AS total FROM services  
    JOIN shops on services.shopID = shops.id  WHERE shops.slug = ?`;
    const sql = `
    SELECT se.*  FROM services se JOIN shops s ON se.shopID = s.id WHERE s.slug = ? LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql, [slug])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [slug, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const fetchShopCategories = async(slug, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const countSql = `
    SELECT COUNT(*) AS total FROM categories 
    JOIN shops on categories.shopID = shops.id  WHERE shops.slug = ?`;
    const sql = `
    SELECT c.*  FROM categories c JOIN shops s ON c.shopID = s.id WHERE s.slug = ? LIMIT ? OFFSET ?`; 

    const [count] = await db.query(countSql, [slug])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = await db.query(sql, [slug, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};


const fetchFeaturedShopCategories = async(id, slug, featured, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const isSlugPresent = slug === null

    const countSlug = `
    SELECT COUNT(*) AS total FROM categories 
    JOIN shops ON categories.shopID = shops.id WHERE shops.slug = ? AND featured = ?`

    const countID = `SELECT COUNT(*) AS total FROM categories WHERE shopID = ? AND featured = ?`;

    const sql = `SELECT * FROM categories WHERE shopID = ? AND featured = ? LIMIT ? OFFSET ?`; 
    const sqlSlug = `
    SELECT c.* FROM categories c 
    JOIN shops s ON c.shopID = s.id WHERE s.slug = ? AND featured = ? LIMIT ? OFFSET ?`

    const [count] = isSlugPresent ? await db.query(countID, [id, featured]) : await db.query(countSlug, [slug, featured])
    
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = isSlugPresent ? await db.query(sql, [id, featured, itemsPerPage, offset]) : await db.query(sqlSlug, [slug, featured, itemsPerPage, offset]) 
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const searchData = async(term, table, pageNumber, id) => {
  try {
    const itemsPerPage = 8;
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

const searchTypes = async(term) => {
  try {

    const searchTerm = `%${term}%`;

    const sql = `SELECT * FROM shoptypes WHERE name LIKE ?`;

    const [rows] = await db.query(sql, [searchTerm])
    return rows;

  } catch (error) {
    return error.message;
  }
};

const fetchShopCollections = async(slug, featured, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const countSql = `
    SELECT COUNT(*) AS total FROM collections 
    JOIN shops ON shops.id = collections.shopID WHERE shops.slug = ?`;
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

const filterShopCollections = async(id, slug, featured, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const isSlugPresent = slug === null

    const countSlug = `
    SELECT COUNT(*) AS total FROM collections 
    JOIN shops ON shops.id = collections.shopID WHERE shops.slug = ? AND featured = ?`;

    const countSql = `SELECT COUNT(*) AS total FROM collections WHERE shopID = ? AND featured = ?`;

    const sql = `SELECT * FROM collections WHERE shopID = ? AND featured = ? LIMIT ? OFFSET ?`; 
    const sqlSlug = `
    SELECT c.* FROM collections c 
    JOIN shops s ON s.id = c.shopID WHERE s.slug = ? AND featured = ? LIMIT ? OFFSET ?`

    const [count] = isSlugPresent ? await db.query(countSql, [id, featured]) : await db.query(countSlug, [slug, featured])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = isSlugPresent ? await db.query(sql, [id, featured, itemsPerPage, offset]) : await db.query(sqlSlug, [slug, featured, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;
   
  } catch (error) {
    return error.message;
  }
};

const findShopCollectionswithProducts = async(id, slug, featured) => {
  try {
    const isSlugPresent = slug === null
    const sqlSlug = `SELECT c.*
    FROM collections c JOIN shops s
    ON s.id = c.shopID WHERE s.slug = ? 
    AND featured = ? 
    AND c.id IN (SELECT DISTINCT collectionsID FROM products)`

    const sql = `SELECT *
    FROM collections
    WHERE shopID = ? 
    AND featured = ? 
    AND id IN (SELECT DISTINCT collectionsID FROM products)`; 

    const [rows] = isSlugPresent ? await db.query(sql, [id, featured]) : await db.query(sqlSlug, [slug, featured])
    return rows;
   
  } catch (error) {
    return error.message;
  }
};



const filterProductsNotInCollection = async(id, shopid, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const countSql = `SELECT COUNT(*) AS total FROM products WHERE shopID = ? AND (collectionsID <> ? OR collectionsID IS NULL)`;
    const sql = `SELECT * FROM products WHERE shopID = ? AND (collectionsID <> ? OR collectionsID IS NULL) LIMIT ? OFFSET ?`;

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

const filterProductsNotInOffer = async (id, shopid, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const offset = (pageNumber - 1) * itemsPerPage;
    const offid = null;

    const countSql = `SELECT COUNT(*) AS total FROM products WHERE shopID = ? AND (offerID <> ? OR offerID IS NULL)`;
    const sql = `SELECT * FROM products WHERE shopID = ? AND (offerID <> ? OR offerID IS NULL) LIMIT ? OFFSET ?`;

    const [count] = await db.query(countSql, [shopid, id]);
    const totalItems = count[0].total;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const [rows] = await db.query(sql, [shopid, id, itemsPerPage, offset]);
    const results = { totalPages, items: rows };
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const findCurrentOffers = async(id, pageNumber) => {
  try{
    const itemsPerPage = 8;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validTo >= CURDATE() AND shopID = ?';
    const sql = 'SELECT * FROM offers WHERE validTo >= CURDATE() AND shopID = ?';

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
    const itemsPerPage = 8;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validTo <= CURDATE() AND shopID = ?';
    const sql = 'SELECT * FROM offers WHERE validTo <= CURDATE() AND shopID = ?';

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
    const itemsPerPage = 8;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE validTo >= CURDATE() AND shopID = ? AND type = ?';
    const sql = 'SELECT * FROM offers WHERE validTo >= CURDATE() AND shopID = ? AND type = ?';

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
    const itemsPerPage = 8;

    const countsql = 'SELECT COUNT(*) AS total FROM offers WHERE  validTo >= CURDATE() AND shopID = ? AND featured = ?';
    const sql = 'SELECT * FROM offers WHERE validTo >= CURDATE() AND shopID = ? AND featured = ?';

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

  const removeMultipleProductsFromOffers = async(ids, shopid) => {
    const offid = null;
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
      const itemsPerPage = 8;
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
      const itemsPerPage = 8;
      const countSql = `SELECT COUNT(*) AS total FROM products WHERE shopID = ?`;
      const sql = `SELECT 
      products.*, 
      categories.name AS category, 
      subcategories.name AS subcategory,
      COALESCE(collections.name, null) AS collection,
      COALESCE(collections.slug, null) AS collection_slug
      FROM products
      JOIN categories ON categoryID = categories.id
      JOIN subcategories ON subcategoryID = subcategories.id
      LEFT JOIN collections ON collectionsID = collections.id
      WHERE products.shopID = ?
      ORDER BY products.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    
      const [count] = await db.query(countSql, [id])
      const totalItems = count[0].total
                                                                                                                                                          
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
                                                                                                                                                          
      const [rows] = await db.query(sql, [id, itemsPerPage, offset])
      const results = {totalPages:totalPages, items:rows}
      return results; 
    } catch (error) {
      return error.message;
    }
};

const searchShopProducts = async(term, slug, pageNumber, id) => {
  try {
    const itemsPerPage = 8;
    const isSlugPresent = slug === null
    const searchTerm = `%${term}%`;

    const countSql = `SELECT COUNT(*) AS total FROM products WHERE name LIKE ? AND shopID = ?`;

    const countSlug = `
    SELECT COUNT(*) AS total FROM products 
    JOIN shops ON shops.id = products.shopID  
    WHERE products.name LIKE ? AND shops.slug = ?`;

    const sql = `SELECT 
    products.*, 
    categories.name AS category, 
    subcategories.name AS subcategory,
    categories.slug AS categorySlug,
    subcategories.slug AS subcategorySlug, 
    COALESCE(collections.name, null) AS collection,
    COALESCE(collections.slug, null) AS collection_slug
    FROM products
    JOIN categories ON categoryID = categories.id
    JOIN subcategories ON subcategoryID = subcategories.id
    LEFT JOIN collections ON collectionsID = collections.id
    WHERE products.name LIKE ? AND products.shopID = ?
    ORDER BY products.createdAt DESC
    LIMIT ? OFFSET ?
  `;

  const sqlSlug = `SELECT 
  products.*,
  shops.currency, shops.brandcolor, 
  shops.whatsappnumber, 
  categories.name AS category, 
  subcategories.name AS subcategory,
  categories.slug AS categorySlug,
  subcategories.slug AS subcategorySlug, 
  COALESCE(collections.name, null) AS collection,
  COALESCE(collections.slug, null) AS collection_slug
  FROM products
  JOIN shops ON shops.id = products.shopID
  JOIN categories ON categoryID = categories.id
  JOIN subcategories ON subcategoryID = subcategories.id
  LEFT JOIN collections ON collectionsID = collections.id
  WHERE products.name LIKE ? AND shops.slug = ?
  ORDER BY products.createdAt DESC
  LIMIT ? OFFSET ?
`;
  
    const [count] = isSlugPresent ? await db.query(countSql, [searchTerm, id]) : await db.query(countSlug, [searchTerm, slug])
    const totalItems = count[0].total

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;

    const [rows] = isSlugPresent ? await db.query(sql, [searchTerm, id, itemsPerPage, offset]) : await db.query(sqlSlug, [searchTerm, slug, itemsPerPage, offset])
    const results = {totalPages, items:rows}
    return results;

  } catch (error) {
    return error.message;
  }
};

  

const getOfferProducts = async(id, slug, pageNumber) => {
    try {
      const itemsPerPage = 8;
      const countSql = `SELECT COUNT(*) AS total FROM products
                          JOIN offers ON offers.id = products.offerID
                          WHERE offers.slug = ? AND products.shopID = ?`;
      const sql = `SELECT products.*, offers.slug AS offerSlug, offers.name AS offerName, categories.name AS category, subcategories.name AS subcategory,
                           categories.slug AS categorySlug, subcategories.slug AS subcategorySlug FROM products
                           JOIN offers ON offers.id = products.offerID
                           JOIN categories ON categories.id = products.categoryID
                           JOIN subcategories ON subcategories.id = products.subcategoryID
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

const fetchFeaturedHomeProducts = async(id, slug, featured,  pageNumber) => {
    try {
      const itemsPerPage = 8;
      const isSlugPresent = slug === null
      const countSlug = `
        SELECT COUNT(*) AS total FROM products 
        JOIN shops ON shops.id = products.shopID
        WHERE featuredHome = ? AND shops.slug = ?
      `;
      const countSql = `SELECT COUNT(*) AS total FROM products WHERE featuredHome = ? AND shopID = ?`;

      const sql = `SELECT 
      products.*, 
      categories.name AS category, 
      categories.slug AS categorySlug,
      subcategories.slug AS subcategorySlug,
      subcategories.name AS subcategory, 
      COALESCE(collections.name, null) AS collection,
      COALESCE(collections.slug, null) AS collection_slug,
      COALESCE(offers.discount, null) AS discount
      FROM products
      JOIN categories ON categoryID = categories.id
      JOIN subcategories ON subcategoryID = subcategories.id
      LEFT JOIN collections ON collectionsID = collections.id
      LEFT JOIN offers ON offerID = offers.id
      WHERE products.featuredHome = ? AND products.shopID = ?
      ORDER BY products.createdAt DESC
      LIMIT ? OFFSET ?`;

      const sqlSlug = `SELECT 
      products.*, 
      categories.name AS category, 
      categories.slug AS categorySlug,
      subcategories.slug AS subcategorySlug,
      subcategories.name AS subcategory, 
      COALESCE(collections.name, null) AS collection,
      COALESCE(collections.slug, null) AS collection_slug,
      COALESCE(offers.discount, null) AS discount
      FROM products
      JOIN shops ON shops.id = products.shopID
      JOIN categories ON categoryID = categories.id
      JOIN subcategories ON subcategoryID = subcategories.id
      LEFT JOIN collections ON collectionsID = collections.id
      LEFT JOIN offers ON offerID = offers.id
      WHERE products.featuredHome = ? AND shops.slug = ?
      ORDER BY products.createdAt DESC
      LIMIT ? OFFSET ?`;

      const [count] = isSlugPresent ? await db.query(countSql, [featured, id]) : await db.query(countSlug, [featured, slug]) 
      const totalItems = count[0].total
                                              
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
                                              
      const [rows] = isSlugPresent ? await db.query(sql, [featured, id, itemsPerPage, offset]) : await db.query(sqlSlug, [featured, slug, itemsPerPage, offset])
      const results = {totalPages, items:rows} 
      return results                   
    } catch (error) {
      return error.message;
    }
  };

  const findFeaturedCategoryProducts = async(id, slug, shopSlug, featured, pageNumber) => {

    try {
      const isSlugPresent = shopSlug === null
      const itemsPerPage = 8;
      const countSlug = `SELECT COUNT(*) AS total FROM products 
                          JOIN shops on shops.id = products.shopID
                          JOIN categories ON categories.id = products.categoryID
                          WHERE categories.slug = ? AND shops.slug = ? AND products.featuredCategory = ?`;

      const countSql = `SELECT COUNT(*) AS total FROM products
                          JOIN categories ON categories.id = products.categoryID
                          WHERE categories.slug = ? AND products.shopID = ? AND products.featuredCategory = ?`;

      const sql =       `SELECT 
                          products.*, 
                          categories.name AS category, 
                          categories.slug AS categorySlug,
                          subcategories.slug AS subcategorySlug,
                          subcategories.name AS subcategory, 
                          COALESCE(collections.name, null) AS collection,
                          COALESCE(collections.slug, null) AS collection_slug,
                          COALESCE(offers.discount, null) AS discount
                          FROM products
                          JOIN categories ON categoryID = categories.id
                          JOIN subcategories ON subcategoryID = subcategories.id
                          LEFT JOIN collections ON collectionsID = collections.id
                          LEFT JOIN offers ON offerID = offers.id
                          WHERE categories.slug = ? AND products.shopID = ? AND products.featuredCategory = ?
                          ORDER BY products.createdAt DESC
                          LIMIT ? OFFSET ?`

        const sqlslug =   `SELECT 
                          products.*, 
                          categories.name AS category, 
                          categories.slug AS categorySlug,
                          subcategories.slug AS subcategorySlug,
                          subcategories.name AS subcategory, 
                          COALESCE(collections.name, null) AS collection,
                          COALESCE(collections.slug, null) AS collection_slug,
                          COALESCE(offers.discount, null) AS discount
                          FROM products
                          JOIN shops on shops.id = products.shopID
                          JOIN categories ON categoryID = categories.id
                          JOIN subcategories ON subcategoryID = subcategories.id
                          LEFT JOIN collections ON collectionsID = collections.id
                          LEFT JOIN offers ON offerID = offers.id
                          WHERE categories.slug = ? AND shops.slug = ? AND products.featuredCategory = ?
                          ORDER BY products.createdAt DESC
                          LIMIT ? OFFSET ?`
  
            
    const [count] = isSlugPresent ? await db.query(countSql, [slug, id, featured]) : await db.query(countSlug, [slug, shopSlug, featured])
    const totalItems = count[0].total
                                                                   
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const offset = (pageNumber - 1) * itemsPerPage;
                                                                   
    const [rows] = isSlugPresent ? await db.query(sql, [slug, id, featured, itemsPerPage, offset]) : await db.query(sqlslug, [slug, shopSlug, featured, itemsPerPage, offset])
    const results = {totalPages, items:rows} 
    return results
    } catch (error) {
      return error.message;
    }
  };

  const findSubcategoryProducts = async(id, slug, shopSlug, pageNumber) => {
    try {
      const isSlugPresent = shopSlug === null
      const itemsPerPage = 8;
      const countSlug = `SELECT COUNT(*) AS total FROM products p
                          JOIN shops s ON p.shopID = s.id
                          JOIN categories c ON p.categoryID = c.id
                          JOIN subcategories sc on p.subcategoryID = sc.id
                          WHERE sc.slug = ? AND s.slug = ?`;

      const countSql = `SELECT COUNT(*) AS total FROM products p
                          JOIN categories c ON p.categoryID = c.id
                          JOIN subcategories sc on p.subcategoryID = sc.id
                          WHERE sc.slug = ? AND p.shopID = ?`;

        const sql = `SELECT p.*, 
        sc.name AS subcategoryName, 
        sc.slug AS subcategorySlug, 
        c.slug AS categorySlug, 
        c.name AS categoryName,
        COALESCE(o.discount, null) AS discount
        FROM products p
                           
        JOIN categories c ON p.categoryID = c.id
        JOIN subcategories sc on p.subcategoryID = sc.id
        LEFT JOIN offers o ON p.offerID = o.id
                           
        WHERE sc.slug = ? AND p.shopID = ?
        ORDER BY p.createdAt DESC
        LIMIT ? OFFSET ?`;

        const sqlSlug = `SELECT p.*,
        s.slug AS shopSlug, 
        sc.name AS subcategoryName, 
        sc.slug AS subcategorySlug, 
        c.slug AS categorySlug, 
        c.name AS categoryName,
        COALESCE(o.discount, null) AS discount
        FROM products p
        JOIN shops s ON s.id = p.shopID                   
        JOIN categories c ON p.categoryID = c.id
        JOIN subcategories sc on p.subcategoryID = sc.id
        LEFT JOIN offers o ON p.offerID = o.id
                           
        WHERE sc.slug = ? AND s.slug = ?
        ORDER BY p.createdAt DESC
        LIMIT ? OFFSET ?`;

      const [count] = isSlugPresent ? await db.query(countSql, [slug, id]) : await db.query(countSlug, [slug, shopSlug])
      const totalItems = count[0].total
                                                                                          
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;
                                                                                          
      const [rows] = isSlugPresent ? await db.query(sql, [slug, id, itemsPerPage, offset]) : await db.query(sqlSlug, [slug, shopSlug, itemsPerPage, offset]) 
      const results = {totalPages, total:totalItems, items:rows}
      return results;                
     
    } catch (error) {
      return error.message;
    }
  };

const findSingleProductBySlug = async(shopSlug, slug ) => {
    try{
      const sql = `SELECT p.*, sc.name AS subcategoryName, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS categoryName
                  FROM products p
                  JOIN shops s ON s.id = p.shopID
                  JOIN categories c ON p.categoryID = c.id
                  JOIN subcategories sc on p.subcategoryID = sc.id
                  WHERE p.slug = ? AND s.slug = ?
                  LIMIT 1`;
    const [results] = await db.query(sql, [slug, shopSlug])
    return results[0];
    }catch(error){
      return error;
    }
   
};

const findCollectionsProducts = async(id, slug, shopSlug, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const isSlugPresent = shopSlug === null
    const countSlug = `SELECT COUNT(*) AS total FROM products p
                        JOIN shops s ON s.id = p.shopID
                        JOIN collections c ON p.collectionsID = c.id
                        WHERE c.slug = ? AND s.slug = ? AND p.featuredHome != 1`;

    const countSql = `SELECT COUNT(*) AS total FROM products p
                        JOIN collections c ON p.collectionsID = c.id
                        WHERE c.slug = ? AND p.shopID = ? AND p.featuredHome != 1`;

    const sql = `SELECT p.id AS id, 
    p.name AS name, 
    p.slug AS slug, 
    p.price AS price,
    p.description AS description,
    p.options AS options,
    p.offerID AS offer,
    p.onSale AS sale,
    p.picture AS picture,
    p.salePrice AS salePrice,
    c.name AS collectionName, 
    c.slug AS collectionSlug, 
    pc.name AS category, 
    pc.slug AS categorySlug, 
    sc.name AS subcategory,
    sc.slug AS subcategorySlug
    FROM products p
    JOIN collections c ON p.collectionsID = c.id
    JOIN categories pc ON p.categoryID = pc.id
    JOIN subcategories sc ON p.subcategoryID = sc.id
    WHERE c.slug = ? AND p.shopID = ? AND p.featuredHome != 1
    ORDER BY p.createdAt DESC
    LIMIT ? OFFSET ?`;

    const sqlSlug = `SELECT p.id AS id, 
    p.name AS name, 
    p.slug AS slug, 
    p.price AS price,
    p.description AS description,
    p.options AS options,
    p.offerID AS offer,
    p.onSale AS sale,
    p.picture AS picture,
    p.salePrice AS salePrice,
    c.name AS collectionName, 
    c.slug AS collectionSlug, 
    pc.name AS category, 
    pc.slug AS categorySlug, 
    sc.name AS subcategory,
    sc.slug AS subcategorySlug
    FROM products p
    JOIN shops s ON s.id = p.shopID
    JOIN collections c ON p.collectionsID = c.id
    JOIN categories pc ON p.categoryID = pc.id
    JOIN subcategories sc ON p.subcategoryID = sc.id
    WHERE c.slug = ? AND s.slug = ? AND p.featuredHome != 1
    ORDER BY p.createdAt DESC
    LIMIT ? OFFSET ?`;
  const [count] = isSlugPresent ? await db.query(countSql, [slug, id]) : await db.query(countSlug, [slug, shopSlug])
  const totalItems = count[0].total
                                                                                                             
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const offset = (pageNumber - 1) * itemsPerPage;
                                                                                                             
  const [rows] = isSlugPresent ? await db.query(sql, [slug, id, itemsPerPage, offset]) : await db.query(sqlSlug, [slug, shopSlug, itemsPerPage, offset]) 
  const results = {totalPages, items:rows}
  return results;                  
  } catch (error) {
    return error.message;
  }
};

const findAllCollectionsProducts = async(id, slug, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const countSql = `SELECT COUNT(*) AS total FROM products p
                        JOIN collections c ON p.collectionsID = c.id
                        WHERE c.slug = ? AND p.shopID = ? `;
    const sql = `SELECT p.id AS id, 
    p.name AS name, 
    p.slug AS slug, 
    p.price AS price,
    p.description AS description,
    p.options AS options,
    p.offerID AS offer,
    p.onSale AS sale,
    p.picture AS picture,
    p.salePrice AS salePrice,
    c.name AS collection, 
    c.slug AS collectionSlug, 
    pc.name AS categoryName, 
    pc.slug AS categorySlug, 
    sc.name AS subcategory,
    sc.slug AS subcategorySlug
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

const findRelatedProducts = async(shopSlug, slug) => {
  try{
    const sql = `SELECT p.*, c.slug AS categorySlug, sc.slug AS subcategorySlug, 
     c.name AS category, sc.name AS subcategory FROM products p 
     JOIN shops s ON s.id = p.shopID
     JOIN categories c ON p.categoryID = c.id 
     JOIN subcategories sc ON p.subcategoryID = sc.id
     WHERE c.id =(SELECT categoryID from products WHERE slug = '${slug}')
    AND p.slug != ? AND s.slug = ? ORDER BY p.createdAT DESC LIMIT 4`;
    const [results] = await db.query(sql, [slug, shopSlug])
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
  

const getSubcategoriesByCategorySlug = async(slug, shopSlug, pageNumber) => {
  try {
    const itemsPerPage = 8;
    const countSql = `SELECT COUNT(*) AS total FROM subcategories
                        JOIN categories ON categories.id = subcategories.categoryID
                        JOIN shops on shops.id = subcategories.shopID
                        WHERE categories.slug = ? AND shops.slug = ?`;
      const sql = `SELECT sc.*, c.slug AS categorySlug, c.name AS categoryName
                         FROM subcategories sc
                         JOIN categories c ON c.id = sc.categoryID
                         JOIN shops s ON sc.shopID = s.id
                         WHERE c.slug = ? AND s.slug = ?
                         ORDER BY sc.createdAt DESC`;
    const [count] = await db.query(countSql, [slug, shopSlug])
    const totalItems = count[0].total
                                                                                                                                    
                                                                                                                             
    const [rows] = await db.query(sql, [slug, shopSlug])
    const results = rows
    return results;               
  } catch (error) {
    return error.message;
  }
};


const getSubcategoriesByCategoryID = async(id, catId, pageNumber) => {
  try {
    const itemsPerPage = 8;
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
    const itemsPerPage = 8;
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
    fetchShopCategories,
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
    filterProductsNotInCollection,
    filterProductsNotInOffer,
    removeMultipleProductsFromOffers,
    changePassword,
    getuserBYResetToken,
    searchShopProducts,
    findAllCollectionsProducts,
    searchTypes,
    findShopCollectionswithProducts,
    getuserBYNumber,
    findShopAdmins,
    updateUserShopID,
    finshopbyName,
    fetchShopServices,
    finshopbySlug
    
}