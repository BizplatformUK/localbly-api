const express = require ('express');
const router = express.Router();
const multer = require('multer');
const {createContainer, uploadImg, deleteBlob, listContainers} = require('./ImageController')
const {authenticateJwtToken} = require('../../Utils/Auth')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', createContainer)

router.post('/img-upload',  upload.single('image'), uploadImg)

router.delete('/img-delete', authenticateJwtToken,  deleteBlob)

router.get('/list', listContainers)
module.exports = router