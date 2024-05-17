const FileUploadCheck = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'No image uploaded'
        });
    }
    if (!req.file.mimetype.includes("image")) {
        return res.status(400).json({
            error: 'Not an image'
        });
    }
    
    next();
};

module.exports = FileUploadCheck;