const express = require('express');
const router = express.Router();
const multer = require('multer');
const FileUploadCheck = require('../middleware/FileUploadCheck');
const { classify } = require("../controllers/controller");

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

/**
 * @swagger
 * /classify:
 *   post:
 *     summary: Classify an image
 *     description: >
 *       Upload an image of a chemical structure to classify and analyze it.
 *       
 *       Example using cURL:
 *       ```bash
 *       curl -X POST "http://localhost:3000/classify" -H "Content-Type: multipart/form-data" -F "image=@path_to_your_image"
 *       ```
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: {"message": "Analysis of structure"}
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */
router.post('/classify', upload.single('image'), FileUploadCheck, classify);

module.exports = router;
