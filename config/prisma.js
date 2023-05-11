const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const isEmpty = async(model, data)=> {
    try{
        const user = await prisma[model].findFirst({where: data})
        if(!user){return false}
        return true
    }catch(error){
        return error.message
    }
}

const bannerPresent = async(id, shopID)=> {
    try{
        const isPresent = await prisma.banner.findFirst({where: {itemID:id, shopID}});
        if(!isPresent){return false}
        return true
    }catch(error){
        return error.message
    }
}

const DBInsert = async(model, params)=> {
    try{
        const insert = await prisma[model].create({data:params})
        if(!insert){return false}
        return insert
    }catch(error){
        return error.message
    }
}

const findData = async(model, data)=> {
    try{
        const user = await prisma[model].findFirst({where: data})
        if(!user){return false}
        return user
    }catch(error){
        return error.message
    }
}

const fetch = async(model, data, pageNumber)=> {
    const itemsPerPage = 6;
    try{
        const [items, total] = await Promise.all([
            prisma[model].findMany({
              where: data,
              skip: (pageNumber - 1) * itemsPerPage,
              take: itemsPerPage,
              /*orderBy: {
                createdAt: "desc",
              },*/
            }),
            prisma[model].count({
              where: data,
            }),
          ]);
        if(!items){return false}
        const totalPages = Math.ceil(total / itemsPerPage)
        return {total, totalPages, items}
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const frontendfetch = async(model, data, pageNumber, items = [])=> {
    const itemsPerPage = 2;
    try{
        const [fetchedItems, total] = await Promise.all([
            prisma[model].findMany({
              where: data,
              //skip: (pageNumber - 1) * itemsPerPage,
              take: itemsPerPage,
              orderBy: {
                createdAt: "desc",
              },
            }),
            prisma[model].count({
              where: data,
            }),
        ]);
        if(!fetchedItems){return false}
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const newItems = fetchedItems.slice(startIndex - items.length);
        items.push(...newItems);
        return {total, items}
    }catch(error){
        return error.message
    }finally{
        async()=> {
            await prisma.$disconnect();
        }
    }
};


const search = async(model, query, id, pageNumber)=> {
    const itemsPerPage = 6;
    try{
        const [items, total] = await Promise.all([
            prisma[model].findMany({
                where: {
                    AND: [
                      {
                        name: {
                          contains: query
                        }
                      },
                      {
                        shopID: id
                      }
                    ]
                  },
              skip: (pageNumber - 1) * itemsPerPage,
              take: itemsPerPage,
              orderBy: {
                createdAt: "desc",
              },
            }),
            prisma[model].count({
                where: {
                    AND: [
                      {
                        name: {
                          contains: query
                        }
                      },
                      {
                        shopID: id
                      }
                    ]
                  },
            }),
          ]);
        if(!items){return false}
        const totalPages = Math.ceil(total / itemsPerPage)
        return {total, totalPages, items}
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const update = async(id, model, params)=> {
    try{
        const updateModel = await prisma[model].update({
            where: {id:id},
            data:params
        })
        if(!updateModel){return false}
        return updateModel
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const deleteItem = async(id, model)=> {
    try{
        const deleteItem = await prisma[model].delete({
            where: {id}
        })
        if(!deleteItem){return false}
        return deleteItem
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const removefrombanner = async(id)=> {
    try{
        const result = await prisma.$executeRaw`
            DELETE FROM banner
            WHERE itemID = ${id}
      `;
        if(!result){return false}
        return result
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const fetchbannercontents = async(slug, pageNumber)=>{
    try{
        const itemsPerPage = 10;
        const data = await prisma.banner.findMany({
            where: {
                shop:{
                    slug:slug
                }
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage
        })
        const total = await prisma.banner.count({where:{shop:{slug}}})
        return {total, data}

    }catch(error){
        return error.message
    }
}

const findShopCategories = async(params, pageNumber)=>{
    try{
        const itemsPerPage = 6;
        const items = await prisma.categories.findMany({
            where: params,
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        const total = await prisma.categories.count({where: params})
        const totalPages = Math.ceil(total / itemsPerPage);
        return {total, totalPages, items}

    }catch(error){
        return error.message
    }
}

const findShopByTypes = async(slug)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const data = await prisma.shops.findMany({
            where: {
                type:{
                    slug:slug
                }
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return data

    }catch(error){
        return error.message
    }
}

const fetchfeaturedcategories = async(slug)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const data = await prisma.categories.findMany({
            where: {
                shop:{
                    slug:slug
                },
                featured:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return data

    }catch(error){
        return error.message
    }
}

const fetchshopProducts = async(params, pageNumber)=> {
    try{
        const itemsPerPage = 6
        const products = await prisma.products.findMany({
            where:params,
            include:{
                category:true,
                subcategory:true,
                offers:true,
                collections:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        const total = await prisma.products.count({where:params})
        const totalPages = Math.ceil(total / itemsPerPage)
        const data = [];
        products.forEach(product=> {
            const item = {
                id: product.id,
                name: product.name,
                slug:product.slug,
                picture:product.picture,
                category:product.category.name,
                subcategory:product.subcategory.name,
                price:product.price,
                onSale:product.onSale,
                salePrice:product.salePrice,
                fhome:product.featuredHome,
                fcat:product.featuredCategory,
                catId:product.categoryID,
                subId:product.subcategoryID,
                offerId:product.offerID,
                colId:product.collectionsID,
                offer:product.offerID === null ? null : product.offers.name,
                collection:product.collectionsID === null ? null : product.collections.name,
                tags:product.tags,
                options:product.options,
                description:product.description
            }
            data.push(item);
        })
        return {total, totalPages, data}


    }catch(error){
        console.log(error)
    }
}

const searchshopproducts = async(query, id, pageNumber)=> {
    const itemsPerPage = 6;
    try{
        const [items, total] = await Promise.all([
            prisma.products.findMany({
                where: {
                    AND: [
                      {
                        name: {
                          contains: query
                        }
                      },
                      {
                        shopID: id
                      }
                    ]
                },
                include:{
                    category:true,
                    subcategory:true,
                    offers:true,
                    collections:true
                },
                
              skip: (pageNumber - 1) * itemsPerPage,
              take: itemsPerPage,
              orderBy: {
                createdAt: "asc",
              },
            }),
            prisma.products.count({
                where: {
                    AND: [
                      {
                        name: {
                          contains: query
                        }
                      },
                      {
                        shopID: id
                      }
                    ]
                  },
            }),
          ]);
        if(!items){return false}
        const totalPages = Math.ceil(total / itemsPerPage)
        const data = [];
        items.forEach(product=> {
            const item = {
                id: product.id,
                name: product.name,
                slug:product.slug,
                picture:product.picture,
                category:product.category.name,
                subcategory:product.subcategory.name,
                
                price:product.price,
                onSale:product.onSale,
                salePrice:product.salePrice,
                fhome:product.featuredHome,
                fcat:product.featuredCategory,
                catId:product.categoryID,
                subId:product.subcategoryID,
                offerId:product.offerID,
                colId:product.collectionsID,
                offer:product.offerID === null ? null : product.offers.name,
                collection:product.collectionsID === null ? null : product.collections.name,
                tags:product.tags,
                options:product.options,
                description:product.description
            }
            data.push(item);
        })
        return {total, totalPages, data}
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}



const getOfferProducts = async(slug)=> {
    const pageNumber = 1;
    const itemsPerPage = 10;
    try{
        const products = await prisma.products.findMany({
            where: {
              offers:{
                slug:slug
              }
            },
            include: {
                offers: true,
                category:true,
                subcategory:true,
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
          })
          return products.map(product => {
            return {
              id: product.id,
              name: product.name,
              slug:product.slug,
              picture:product.picture,
              category:product.category.name,
              subcategory:product.subcategory.name,
              price:product.price,
              onSale:product.onSale,
              salePrice:product.salePrice,
              discount:product.offers.discount,
              code:product.offers.couponCode
            }
          })

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const countProducts = async(id)=> {
    const totalProducts = await prisma.products.count({
        where: { shopID:id }
    });
    return totalProducts;
}

const getSubscribers = async(id)=> {
    const pageNumber = 1;
    const itemsPerPage = 10;
    try{
        const subscribers = await prisma.subscriptions.findMany({
            where: {storeID:id},
            include: {
                users: true,
                packages:true,
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
          })
          return subscribers.map(subscriber => {
            return {
              id: subscriber.id,
              name: subscriber.users.name,
              email:subscriber.users.email,
              number:subscriber.users.number,
              package:subscriber.packages.name,
              price:subscriber.packages.price,
              date:subscriber.createdAt
            }
          })

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const fetchsubscribers = async()=> {
    const pageNumber = 1;
    const itemsPerPage = 10;
    try{
        const subscribers = await prisma.subscriptions.findMany({
            include: {
                users: true,
                packages:true,
                stores:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
          })
          return subscribers.map(subscriber => {
            return {
              id: subscriber.id,
              name: subscriber.users.name,
              email:subscriber.users.email,
              number:subscriber.users.number,
              package:subscriber.packages.name,
              price:subscriber.packages.price,
              host:subscriber.stores.emailHost,
              port:subscriber.stores.emailPort,
              user:subscriber.stores.emailUser,
              date:subscriber.createdAt
            }
          })

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const findProductReviews = async(slug)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const data = await prisma.reviews.findMany({
            where: {
                product:{
                    slug:slug
                }
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return data

    }catch(error){
        return error.message
    }
}


const fetchFeaturedHomeProducts = async(slug)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const products = await prisma.products.findMany({
            where: {
                shop:{
                    slug:slug
                },
                featuredHome:true
            },
            include: {
                category:true,
                subcategory:true,
                offers:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return products.map(product => {
            return {
              id: product.id,
              name: product.name,
              slug:product.slug,
              picture:product.picture,
              category:product.category.name,
              subcategory:product.subcategory.name,
              price:product.price,
              onSale:product.onSale,
              salePrice:product.salePrice,
              discount:product.offers == null ? null : product.offers.discount,
              code:product.offers == null ? null : product.offers.couponCode
            }
          })

    }catch(error){
        return error.message
    }
}

const fetchFeaturedCategoryProducts = async(slug, id)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const products = await prisma.products.findMany({
            where: {
                category:{
                    slug:slug
                },
                featuredCategory:true,
                shopID:id
            },
            include: {
                category:true,
                subcategory:true,
                offers:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return products.map(product => {
            return {
              id: product.id,
              name: product.name,
              slug:product.slug,
              picture:product.picture,
              category:product.category.name,
              subcategory:product.subcategory.name,
              price:product.price,
              onSale:product.onSale,
              salePrice:product.salePrice,
              discount:product.offers == null ? null : product.offers.discount,
              code:product.offers == null ? null : product.offers.couponCode
            }
          })

    }catch(error){
        return error.message
    }
}

const fetchSubcategoryProducts = async(slug, id)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const products = await prisma.products.findMany({
            where: {
                subcategory:{
                    slug:slug
                },
                shopID:id
            },
            include: {
                category:true,
                subcategory:true,
                offers:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return products.map(product => {
            return {
              id: product.id,
              name: product.name,
              slug:product.slug,
              picture:product.picture,
              category:product.category.name,
              subcategory:product.subcategory.name,
              price:product.price,
              onSale:product.onSale,
              salePrice:product.salePrice,
              discount:product.offers == null ? null : product.offers.discount,
              code:product.offers == null ? null : product.offers.couponCode
            }
          })

    }catch(error){
        return error.message
    }
}

const fetchSingleItem = async(params)=>{
    try{

        const product = await prisma.products.findFirst({
            where: params,
            include: {
                category:true,
                subcategory:true,
                offers:true
            },
        })
        
        return {
            id: product.id,
            name: product.name,
            slug:product.slug,
            picture:product.picture,
            category:product.category.name,
            subcategory:product.subcategory.name,
            price:product.price,
            onSale:product.onSale,
            salePrice:product.salePrice,
            description:product.description,
            discount:product.offers == null ? null : product.offers.discount,
            code:product.offers == null ? null : product.offers.couponCode
          }

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

async function getRelatedProducts(slug) {
    // find the category of the product with the given ID
    const product = await prisma.products.findFirst({
      where: { slug: slug },
      include: { category: true }
    })
  
    if (!product) {
      throw new Error(`Product with ID ${slug} not found`)
    }
  
    // find other products in the same category, excluding the current product
    const relatedProducts = await prisma.products.findMany({
      where: {
        categoryID: product.categoryID,
        NOT: { slug: slug }
      },
      take: 4, // limit to 4 related products
      orderBy: { createdAt: 'desc' } // order by ID in descending order
    })
  
    return relatedProducts
  }


const getSubcategoriesWithCategory = async(id, pageNumber)=> {
    const itemsPerPage = 6;
    try{
        const subcategories = await prisma.subcategories.findMany({
            where: {
              shopID: id
            },
            include: {
              category: true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'desc'
            }
          })

          const total = await prisma.subcategories.count({where:{shopID:id}})
          let data = []
          subcategories.map(subcategory => {
            const item = {
              id: subcategory.id,
              name: subcategory.name,
              category: subcategory.category.name,
              picture:subcategory.picture,
              catid: subcategory.categoryID
            }
            data.push(item)
          })
          const totalPages = Math.ceil(total / itemsPerPage)

          return {total, totalPages, data,}

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}


const searchSubCats = async(query, id, pageNumber)=> {
    const itemsPerPage = 6;
    try{
        const [items, total] = await Promise.all([
            prisma.subcategories.findMany({
                where: {
                    AND: [
                      {
                        name: {
                          contains: query
                        }
                      },
                      {
                        shopID: id
                      }
                    ]
                  },
                  include:{
                    category:true
                  },
              skip: (pageNumber - 1) * itemsPerPage,
              take: itemsPerPage,
              orderBy: {
                createdAt: "asc",
              },
            }),
            prisma.subcategories.count({
                where: {
                    AND: [
                      {
                        name: {
                          contains: query
                        }
                      },
                      {
                        shopID: id
                      }
                    ]
                  },
            }),
          ]);
        if(!items){return false}
        const data = [];
        items.forEach(item=>{
            const single = {
                id:item.id,
                name:item.name,
                slug:item.slug,
                picture:item.picture,
                category:item.category.name,
            }
            data.push(single)
        })
        const totalPages = Math.ceil(total / itemsPerPage)
        return {total, totalPages, data}
    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}

const fetchSingleShop = async(params)=>{
    try{
        const shop = await prisma.shops.findFirst({
            where: params,
            include: {
                type: true,
                shopOwner:true
            },
        })
        if(!shop){return false}
        return {
            id: shop.id,
            name: shop.name,
            slug:shop.slug,
            type:shop.type.name,
            location:shop.location,
            logo:shop.logo,
            numbers:shop.phoneNumbers,
            price:shop.price,
            rating:shop.rating,
            town:shop.town,
            version:shop.version,
            email:shop.email,
            color:shop.brandcolor
        }
          

    }catch(error){
        return error.message
    }
}



const fetchCategorySubcategories = async(slug, id)=>{
    try{
        const pageNumber = 1;
        const itemsPerPage = 10;

        const subcategories = await prisma.subcategories.findMany({
            where: {
                category:{
                    slug:slug
                },
                shopID:id
            },
            include: {
                category: true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        return subcategories.map(subcategory => {
            return {
              id: subcategory.id,
              name: subcategory.name,
              category: subcategory.category.name,
              picture:subcategory.picture
            }
          })

    }catch(error){
        return error.message
    }
}

const findShopClients = async(slug, pageNumber)=> {
    const itemsPerPage = 6;
    try{
        const clients = await prisma.clients.findMany({
            where: {
                shop:{
                    slug:slug
                }
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'desc'
            }
          })

          const total = await prisma.clients.count({where:{shop:{slug:slug}}})
          let items = []
          clients.map(client => {
            const item = {
              id: client.id,
              name: client.name,
              picture:client.logo,
            }
            items.push(item)
          })
          const totalPages = Math.ceil(total / itemsPerPage)

          return {total, totalPages, items}

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}


const findByShop = async(slug, model, pageNumber)=>{
    try{
        const itemsPerPage = 6;

        const items = await prisma[model].findMany({
            where: {
                shop:{
                    slug:slug
                }
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        const total = await prisma[model].count({
            where: {
                shop:{
                    slug:slug
                }
            }
        })
        const totalPages = Math.ceil(total / itemsPerPage)
        return {total, totalPages, data}

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}




const getFeaturedOffers= async(slug, pageNumber)=>{
    try{
        const itemsPerPage = 10;
        const currentDate = new Date();
        const data = await prisma.offers.findMany({
            where: {
                shop:{
                    slug:slug
                },
                validTo: {
                    gte: currentDate
                },
                featured:true
            },
            skip:(pageNumber - 1) * itemsPerPage,
            take:itemsPerPage,
            orderBy:{
                createdAt: 'asc'
            }
        })
        const total = await prisma.offers.count({
            where: {
                shop:{
                    slug:slug
                },
                validTo: {
                    gte: currentDate
                },
                featured:true
            },
        })
        return {total, data}

    }catch(error){
        return error.message
    }finally{
        async()=> {
            prisma.$disconnect()
        }
    }
}



async function productUpdateMany(productIds, params) {
    try{
        const result = await prisma.products.updateMany({
            where: {
              id: { in: productIds },
            },
            data: params
          })
          return result.count
    }catch(error){
        return error.message
    } finally{
        async()=> {
            prisma.$disconnect()
        }
    }
  }

module.exports={isEmpty, 
    DBInsert, 
    findData, 
    update, 
    deleteItem, 
    findShopCategories, 
    fetchfeaturedcategories, 
    fetch, 
    getSubcategoriesWithCategory, 
    findShopClients, 
    findByShop, 
    getFeaturedOffers,
    getOfferProducts,
    productUpdateMany,
    findProductReviews,
    getRelatedProducts,
    fetchCategorySubcategories,
    fetchFeaturedHomeProducts,
    fetchFeaturedCategoryProducts,
    fetchSubcategoryProducts,
    fetchSingleItem,
    getSubscribers,
    fetchsubscribers,
    findShopByTypes,
    countProducts,
    search,
    fetchSingleShop,
    bannerPresent,
    removefrombanner,
    frontendfetch,
    fetchbannercontents,
    fetchshopProducts,
    searchshopproducts,
    searchSubCats
}