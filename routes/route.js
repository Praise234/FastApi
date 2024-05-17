const express = require('express');

const router = express.Router();

const multer = require('multer');

const FileUploadCheck = require('../middleware/FileUploadCheck');



// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


const { classify } = require("../controllers/controller");


router.post('/classify', upload.single('image'), FileUploadCheck, classify);

module.exports = router;