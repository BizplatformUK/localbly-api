const mysql = require('mysql');
const fs = require('fs')
const db = require('./sql')
require('dotenv').config()

/*const db = mysql.createConnection({
  host:process.env.SQL_HOST, 
  user:process.env.SQL_USERNAME, 
  password:process.env.SQL_PASSWORD, 
  database:process.env.SQL_DBNAME, 
  port:process.env.SQL_PORT, 
  ssl: {
    ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
  }
});*/

const ifExist = async(data, table)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT email, number FROM ${table} WHERE email = '${data.email}' AND number = '${data.number}'`
            db.query(sql, [data.email, data.number], (error, results)=> {
                if(error){reject (error)}
                if(results.length > 0){
                    resolve(true)
                } else{
                    resolve(false)
                }
               
            })
        })
    }catch(error){
        return error.message
    }
}

const dbCheck = async (data, table) => {
  try {
    return new Promise((resolve, reject) => {
      const conditions = Object.keys(data).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(data);

      const sql = `SELECT * FROM ${table} WHERE ${conditions}`;
      db.query(sql, values,  (error, results) => {
        if (error) {
          reject(error);
        }
        if(results.length > 0){
          resolve(true)
        } else{
            resolve(false)
        }

      });
    });
  } catch (error) {
    return error.message;
  }
};


const ifShopExists = async (table, data) => {
    try {
      const connection = await db.getConnection();
      const query = `SELECT * FROM ${model}`;
      const [rows] = await db.query(query);
  
      connection.release();
  
      return res.status(200).json(rows);
    } catch (error) {
      return error.message;
    }
  };


const insertData = (data,table) => {
    return new Promise((resolve, reject) => {
      // Check if the user exists
          // Create the query to insert the data into the table
          let query = `INSERT INTO ${table} SET ?`;
  
          // Execute the query and insert the data into the database
          db.query(query, data, (error, results) => {
            if (error) {
              reject({error, code:3});
            } else {
                const item = {
                    id: results.id, // Assuming there's an auto-incrementing ID column
                    ...data // Merge the original data object with the ID
                };
             
              resolve(item);
              db.end()
            }

          });
  
          // Close the connection to the database
    });
  };

  const updateData = (id, data, table) => {
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE ${table} SET ? WHERE id = '${id}'`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, data, (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
            const item = {
                id:id, // Assuming there's an auto-incrementing ID column
                ...data // Merge the original data object with the ID
            };
          resolve(data);
        }
      });
  
      // Close the connection to the database
    });
  };

  const addMultipleProductsToCollections = (ids, colid) => {
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE products SET collectionsID = ? WHERE id IN (?)`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, [colid, ids], (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          const item = {message:"products added to collection", code:0}
          resolve(item);
        }
      });
  
      // Close the connection to the database
    });
  };

  const addMultipleProductsToOffers = (ids, offid) => {
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE products SET offerID = ? WHERE id IN (?)`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, [offid, ids], (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          const item = {message:"products added to offer", code:0}
          resolve(item);
        }
      });
  
      // Close the connection to the database
    });
  };

  const removeMultipleProductsFromFeatured = (ids, shopid) => {
    const featured = false;
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE products SET featuredHome = ? WHERE id IN (?) AND shopID = '${shopid}'`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, [featured, ids], (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          const item = {message:"products updated successfully", code:0}
          resolve(item);
        }
      });
  
      // Close the connection to the database
    });
  };

  const makeMultipleProductsFeatured = (ids, shopid) => {
    const featured = true;
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE products SET featuredHome = ? WHERE id IN (?) AND shopID = '${shopid}'`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, [featured, ids], (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          const item = {message:"products updated successfully", code:0, items:ids}
          resolve(item);
        }
      });
  
      // Close the connection to the database
    });
  };

  const addProductsToOffer = (id, offerId) => {
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE products SET offerID='${offerId}' WHERE id = '${id}'`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
            
          resolve(results[0]);
        }
      });
  
      // Close the connection to the database
    });
  };

  const deleteProductsFromOffer = (id) => {
    const remove = null;
    return new Promise((resolve, reject) => {
      // Check if the user exists
  
      // Create the query to update the data in the table
      let update = `UPDATE products SET offerID=null WHERE id = '${id}'`; // Assuming the ID is used to identify the row to be updated
  
      // Execute the query and update the data in the database
      db.query(update, (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          resolve(results);
        }
      });
  
      // Close the connection to the database
    });
  };
  
  const deleteData = (id, shopid, table) => {
    return new Promise((resolve, reject) => {
      // Check if the item exists
  
      // Create the query to delete the item from the table
      let sql = `DELETE FROM ${table} WHERE id = '${id}' AND shopID = '${shopid}'`; // Assuming the ID is used to identify the row to be deleted
  
      // Execute the query and delete the item from the database
      db.query(sql, (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          //const success = {message: 'Data deleted successfully', code: 0, id};
          resolve(results);
        }
      });
  
      // Close the connection to the database
    });
  };

  const deleteFromBanner = (id, shopid) => {
    return new Promise((resolve, reject) => {
      // Check if the item exists
  
      // Create the query to delete the item from the table
      let sql = `DELETE FROM banner WHERE itemID = '${id}' AND shopID = '${shopid}'`; // Assuming the ID is used to identify the row to be deleted
  
      // Execute the query and delete the item from the database
      db.query(sql, (error, results) => {
        if (error) {
          reject({ error, code: 3 });
        } else {
          const success = {message: 'Data deleted successfully', code: 0, id};
          resolve(success);
        }
      });
  
      // Close the connection to the database
    });
  };
  
  const deleteMultipleItems = (ids, table) => {
    
  
    // Validate the presence of subcategoryIds array in the request body
    if (!ids || !Array.isArray(ids)) {
      return  'Invalid subcategoryIds array provided';
    }
  
    // Execute the SQL query to delete subcategories
    const query = `DELETE FROM ${table} WHERE id IN (?)`;
  
    db.query(query, [ids], (error, results) => {
      if (error) {
        console.error('Error deleting subcategories:', error);
        return { error: 'Failed to delete subcategories' };
      }
  
      const affectedRows = results.affectedRows;
      return { message: `Successfully deleted ${affectedRows} subcategories` };
    });
  };



  const getUsers = async(table)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM ${table}`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(results.length < 0){
                    return resolve(false)
                }
                resolve(results)
                db.end()
                
            })
        })
    }catch(error){
        return error.message
    }
}


const getData = (table, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM ${table}`;
      const selectSql = `SELECT * FROM ${table} LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResult) => {
        if (countError) {
          reject(countError);
        }
        const totalCount = countResult[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          db.end();
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};



const getDataByParams = (data, table, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM ${table} WHERE ?`;
      const selectSql = `SELECT * FROM ${table} WHERE ? LIMIT ? OFFSET ?`;

      db.query(countSql, [data], (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
      

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [data, itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const getSubcategories = (id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM subcategories WHERE  subcategories.shopID = '${id}'`;
      const selectSql = `SELECT subcategories.*, categories.slug AS categorySlug, categories.name AS category
                         FROM subcategories
                         JOIN categories ON categories.id = subcategories.categoryID
                         WHERE subcategories.shopID = '${id}'
                         ORDER BY subcategories.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
        
        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};


const getSubcategoriesByCategorySlug = (slug, id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM subcategories
                        JOIN categories ON categories.id = subcategories.categoryID
                        WHERE categories.slug = '${slug}' AND subcategories.shopID = '${id}'`;
      const selectSql = `SELECT subcategories.*, categories.slug AS categorySlug, categories.name AS categoryName
                         FROM subcategories
                         JOIN categories ON categories.id = subcategories.categoryID
                         WHERE categories.slug = '${slug}' AND subcategories.shopID = '${id}'
                         ORDER BY subcategories.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
        
        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};


const getSubcategoriesByCategoryID = (id, catId, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM subcategories
                        JOIN categories ON categories.id = subcategories.categoryID
                        WHERE subcategories.categoryID = '${catId}' AND subcategories.shopID = '${id}'`;
      const selectSql = `SELECT subcategories.*, categories.slug AS categorySlug, categories.name AS categoryName
                         FROM subcategories
                         JOIN categories ON categories.id = subcategories.categoryID
                         WHERE subcategories.categoryID = '${catId}' AND subcategories.shopID = '${id}'
                         ORDER BY subcategories.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
      

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const getDataByMultipleParams = (data, table, pageNumber) => {
  const itemsPerPage = 6;

  return new Promise((resolve, reject) => {
    const conditions = Object.keys(data).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(data);

    const countSql = `SELECT COUNT(*) AS totalCount FROM ${table} WHERE ${conditions}`;
    const selectSql = `SELECT * FROM ${table} WHERE ${conditions} LIMIT ? OFFSET ?`;

    db.query(countSql, values, (countError, countResults) => {
      if (countError) {
        reject(countError);
        return;
      }

      const totalCount = countResults[0].totalCount;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;

      db.query(selectSql, [...values, itemsPerPage, offset], (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve({
          totalPages: totalPages,
          items: selectResults
        });
      });
    });
  });
};


const getDataByDate = (id, table, pageNumber) => {
  const currentDate = new Date();
  const itemsPerPage = 6;

  return new Promise((resolve, reject) => {
   

    const countSql = `SELECT COUNT(*) AS totalCount FROM ${table} WHERE shopID = '${id}' AND validTo > '${currentDate}'`;
    const selectSql = `SELECT * FROM ${table} WHERE shopID = '${id}' AND validTo > '${currentDate}' LIMIT ? OFFSET ?`;

    db.query(countSql, (countError, countResults) => {
      if (countError) {
        reject(countError);
        return;
      }

      const totalCount = countResults[0].totalCount;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;

      db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve({
          totalPages: totalPages,
          items: selectResults
        });
      });
    });
  });
};

const getDataByCurrentDate = (id, table, pageNumber) => {
  const currentDate = new Date();
  const itemsPerPage = 6;

  return new Promise((resolve, reject) => {
   

    const countSql = `SELECT COUNT(*) AS totalCount FROM ${table} WHERE shopID = '${id}' AND validTo < '${currentDate}'`;
    const selectSql = `SELECT * FROM ${table} WHERE shopID = '${id}' AND validTo < '${currentDate}' LIMIT ? OFFSET ?`;

    db.query(countSql, (countError, countResults) => {
      if (countError) {
        reject(countError);
        return;
      }

      const totalCount = countResults[0].totalCount;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;

      db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve({
          totalPages: totalPages,
          items: selectResults
        });
      });
    });
  });
};


const getOfferProducts = (id, slug, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products
                        JOIN offers ON offers.id = products.offerID
                        WHERE offers.slug = '${slug}' AND products.shopID = '${id}'`;
      const selectSql = `SELECT products.*, offers.slug AS offerSlug, offers.name AS offerName
                         FROM products
                         JOIN offers ON offers.id = products.offerID
                         WHERE offers.slug = '${slug}' AND products.shopID = '${id}'
                         ORDER BY products.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
       

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};


const findFeaturedCategoryProducts = (id, slug, pageNumber) => {
  const featured = true;
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products
                        JOIN categories ON categories.id = products.categoryID
                        WHERE categories.slug = '${slug}' AND products.shopID = '${id}' AND products.featuredCategory =1`;
      const selectSql = `SELECT products.*, categories.slug AS categorySlug, categories.name AS categoryName
                         FROM products
                         JOIN categories ON categories.id = products.categoryID
                         WHERE categories.slug = '${slug}' AND products.shopID = '${id}' AND products.featuredCategory =1 
                         ORDER BY products.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
       

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const findshopproducts = (id,  pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products WHERE shopID = '${id}'`;
      const selectSql = `SELECT p.*, sc.name AS subcategory, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS category, pc.name AS collection
                         FROM products p
                         JOIN categories c ON p.categoryID = c.id
                         JOIN subcategories sc on p.subcategoryID = sc.id
                         JOIN collections pc on p.collectionsID = pc.id
                         WHERE p.shopID = '${id}'
                         ORDER BY p.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults,
            total:totalCount
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const findfeaturedShopProducts = (id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products WHERE shopID = '${id}'`;
      const selectSql = `SELECT p.*, sc.name AS subcategory, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS category, pc.name AS collection
                         FROM products p
                         JOIN categories c ON p.categoryID = c.id
                         JOIN subcategories sc on p.subcategoryID = sc.id
                         JOIN collections pc on p.collectionsID = pc.id
                         WHERE p.shopID = '${id}' AND featuredHome = 1
                         ORDER BY p.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const findstandardShopProducts = (id, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products WHERE shopID = '${id}'`;
      const selectSql = `SELECT p.*, sc.name AS subcategory, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS category, pc.name AS collection
                         FROM products p
                         JOIN categories c ON p.categoryID = c.id
                         JOIN subcategories sc on p.subcategoryID = sc.id
                         JOIN collections pc on p.collectionsID = pc.id
                         WHERE p.shopID = '${id}' AND featuredHome = 0
                         ORDER BY p.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }
        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults,
            total:totalCount
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};


const findSubcategoryProducts = (id, slug, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products p
                        JOIN categories c ON p.categoryID = c.id
                        JOIN subcategories sc on p.subcategoryID = sc.id
                        WHERE sc.slug = '${slug}' AND p.shopID = '${id}'`;
      const selectSql = `SELECT p.*, sc.name AS subcategoryName, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS categoryName
                         FROM products p
                         JOIN categories c ON p.categoryID = c.id
                         JOIN subcategories sc on p.subcategoryID = sc.id
                         WHERE sc.slug = '${slug}' AND p.shopID = '${id}'
                         ORDER BY p.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const findCollectionsProducts = (id, slug, pageNumber) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM products p
                        JOIN collections c ON p.collectionsID = c.id
                        WHERE c.slug = '${slug}' AND p.shopID = '${id}'`;
      const selectSql = `SELECT p.*, c.name AS collectionName, c.slug AS collectionSlug, pc.name AS categoryName, pc.slug AS categorySlug, sc.name AS subcategoryName,sc.slug AS subcategorySlug
                         FROM products p
                         JOIN collections c ON p.collectionsID = c.id
                         JOIN categories pc ON p.categoryID = pc.id
                         JOIN subcategories sc ON p.subcategoryID = sc.id
                         WHERE c.slug = '${slug}' AND p.shopID = '${id}'
                         ORDER BY p.createdAt DESC
                         LIMIT ? OFFSET ?`;

      db.query(countSql, (countError, countResults) => {
        if (countError) {
          reject(countError);
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          }

          resolve({
            totalPages: totalPages,
            items: selectResults
          });
          
        });
      });
    });
  } catch (error) {
    return error.message;
  }
};

const findRelatedProducts = (id, slug) => {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT p.* FROM products p JOIN categories c on p.categoryID = c.id WHERE c.id =(SELECT categoryID from products WHERE slug = '${slug}')
    AND p.slug != '${slug}' AND p.shopID = '${id}' ORDER BY p.createdAT DESC LIMIT 4`;
      db.query(selectSql, (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve(selectResults);
      });
  });
};


const findSingleProductBySlug = (id, slug ) => {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT p.*, sc.name AS subcategoryName, sc.slug AS subcategorySlug, c.slug AS categorySlug, c.name AS categoryName
                         FROM products p
                         JOIN categories c ON p.categoryID = c.id
                         JOIN subcategories sc on p.subcategoryID = sc.id
                         WHERE p.slug = '${slug}' AND p.shopID = '${id}'
                         LIMIT 1`;
      db.query(selectSql, (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve(selectResults[0]);
      });
  });
};

const findFeaturedOffers = (id, pageNumber) => {
  const currentDate = new Date();
  const itemsPerPage = 6;
  const featured = true;

  return new Promise((resolve, reject) => {
   

    const countSql = `SELECT COUNT(*) AS totalCount FROM offers WHERE shopID = '${id}' AND featured= '${featured}' AND validTo > '${currentDate}'`;
    const selectSql = `SELECT * FROM offers WHERE shopID = '${id}' AND featured= '${featured}' AND validTo > '${currentDate}' LIMIT ? OFFSET ?`;

    db.query(countSql, (countError, countResults) => {
      if (countError) {
        reject(countError);
        return;
      }

      const totalCount = countResults[0].totalCount;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;

      db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve({
          totalPages: totalPages,
          items: selectResults
        });
      });
    });
  });
};

const findNomalOffers = (id, pageNumber) => {
  const currentDate = new Date();
  const itemsPerPage = 6;
  const featured = false;

  return new Promise((resolve, reject) => {
   

    const countSql = `SELECT COUNT(*) AS totalCount FROM offers WHERE shopID = '${id}' AND featured= '${featured}' AND validTo > '${currentDate}'`;
    const selectSql = `SELECT * FROM offers WHERE shopID = '${id}' AND featured= '${featured}' AND validTo > '${currentDate}' LIMIT ? OFFSET ?`;

    db.query(countSql, (countError, countResults) => {
      if (countError) {
        reject(countError);
        return;
      }

      const totalCount = countResults[0].totalCount;
      const totalPages = Math.ceil(totalCount / itemsPerPage);
      const offset = (pageNumber - 1) * itemsPerPage;

      db.query(selectSql, [itemsPerPage, offset], (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
          return;
        }

        resolve({
          totalPages: totalPages,
          items: selectResults
        });
      });
    });
  });
};


const searchData = (term, table, pageNumber, id) => {
  try {
    const itemsPerPage = 6;
    return new Promise((resolve, reject) => {
      const countSql = `SELECT COUNT(*) AS totalCount FROM ${table} WHERE name LIKE ? AND shopID = ?`;
      const selectSql = `SELECT * FROM ${table} WHERE name LIKE ? AND shopID = ? LIMIT ? OFFSET ?`;

      const searchTerm = `%${term}%`; // Adding wildcard characters to search for partial matches

      db.query(countSql, [searchTerm, id], (countError, countResults) => {
        if (countError) {
          reject(countError);
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const offset = (pageNumber - 1) * itemsPerPage;

        db.query(
          selectSql,
          [searchTerm, id, itemsPerPage, offset],
          (selectError, selectResults) => {
            if (selectError) {
              reject(selectError);
            }

            resolve({
              totalPages: totalPages,
              items: selectResults,
            });
          }
        );
      });
    });
  } catch (error) {
    return error.message;
  }
};



const getBanner = (slug)=> {
  try{
      return new Promise((resolve, reject)=> {
        const sql = `SELECT b.* FROM banner AS b JOIN shops AS s ON b.shopID = s.id WHERE s.slug = ?`;
          db.query(sql, [slug], (error, results)=> {
              if(error){reject (error)}
              if(results.length < 0){
                  return resolve(false)
              }
              resolve(results)
              db.end();
          })
      })

  }catch(error){
      return error.message
  }
}

const countItems = (id, table)=> {
  try{
      return new Promise((resolve, reject)=> {
          const countSql = `SELECT COUNT(*) AS totalCount FROM ${table} WHERE shopID=  '${id}'`;
          db.query(countSql, (countError, countResults)=> {
              if(countError){reject (countError)}
              
              const totalCount = countResults[0].totalCount;
              resolve(totalCount)
              db.end();
          })
      })

  }catch(error){
      return error.message
  }
}

const getByID = (id,table)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM ${table} WHERE id = '${id}'`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(results.length < 0){
                    return resolve(false)
                }
                resolve(results[0])
            })
        })

    }catch(error){
        return error.message
    }
}

const getSingleItem = (data,table)=> {
  try{
      return new Promise((resolve, reject)=> {
          const sql = `SELECT * FROM ${table} WHERE ? LIMIT 1`
          db.query(sql, data, (error, results)=> {
              if(error){reject (error)}
              if(results.length < 0){
                  return resolve(false)
              }
              resolve(results[0])
          })
      })

  }catch(error){
      return error.message
  }
}

const getUserById = (data)=>{
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM users WHERE userID = '${data.id}'`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(!results){
                    return resolve(false)
                }
                resolve(results[0])
            })
        })

    }catch(error){
        return error.message
    }
}
  
  
  
  

module.exports={
    insertData, 
    ifExist, 
    getUsers, 
    getByID, 
    getData, 
    ifShopExists,
    getUserById,
    updateData,
    getBanner,
    deleteData,
    getSingleItem,
    getDataByParams,
    countItems,
    dbCheck,
    getDataByMultipleParams,
    searchData,
    getDataByDate,
    getDataByCurrentDate,
    findFeaturedOffers,
    findNomalOffers,
    getSubcategoriesByCategorySlug,
    getSubcategoriesByCategoryID,
    addProductsToOffer,
    deleteProductsFromOffer,
    getOfferProducts,
    findRelatedProducts,
    findFeaturedCategoryProducts,
    findSubcategoryProducts,
    findSingleProductBySlug,
    findCollectionsProducts,
    getSubcategories,
    deleteMultipleItems,
    deleteFromBanner,
    addMultipleProductsToCollections,
    addMultipleProductsToOffers,
    findshopproducts,
    findfeaturedShopProducts,
    removeMultipleProductsFromFeatured,
    makeMultipleProductsFeatured,
    findstandardShopProducts
    
}