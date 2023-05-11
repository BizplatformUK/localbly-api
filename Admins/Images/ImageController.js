const AzureStorageBlob = require("@azure/storage-blob");
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
require('dotenv').config()
const crypto = require('crypto');
const {extractFileNameFromUrl}  = require("../../Utils/Utils")

const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`,sharedKeyCredential);

async function createContainer(containerName){
    try{
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const createContainerResponse = await containerClient.create();
      if(!createContainerResponse){return false}
      return containerName
    }catch(error){
        return error
    }
}


async function listContainers() {
    let containerArr = []
    let containers = blobServiceClient.listContainers();
    for await (const container of containers) {
        containerArr.push(container.name)
    }
   return containerArr
}

async function uploadImg(req,res){
    try{
      const {containername} = req.body;
      const containerClient = blobServiceClient.getContainerClient(containername);
    
      const ext = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
      const imgName = crypto.randomBytes(4).toString('hex');
      const blobName = `${imgName}${ext}` 
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.size);
      res.status(200).json({message: "Image uploaded successfully", url: `https://${account}.blob.core.windows.net/${containername}/${blobName}`, blob:blobName, body:req.file, code:0})

    }catch(error){
      res.status(500).json(error.message)
    }
}

async function deleteBlob(blobname, containername) {
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${account};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containername);
    const blobClient = containerClient.getBlobClient(blobname);
    try {
      await blobClient.delete();
      const deleted = `Blob "${blobname}" was deleted from the ${containername} container.`;
      return {message:deleted, code:0};
    } catch (error) {
      return { error, code:3};
    }
}

async function deleteImages(containerName, images) {
  try {
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${account};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const promises = images.map(image => {
      const imageName = extractFileNameFromUrl(image.picture)
      const blobClient = containerClient.getBlobClient(imageName);
      return blobClient.deleteIfExists();
    });
    await Promise.all(promises);
    return {message:"Images deleted successfully!", code:0};
  } catch (error) {
    return {error:`An error occurred: ${error.message}`, code:3};
  }
}

module.exports={createContainer, uploadImg, deleteBlob, listContainers, deleteImages}
