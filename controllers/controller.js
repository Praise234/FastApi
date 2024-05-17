const path = require('path');
const fs = require('fs');
const cv = require('@u4/opencv4nodejs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mime = require('mime-types');


const rootDir = process.cwd();


// Function to preprocess the image using OpenCV
const preprocessImage = (imagePath) => {
    const img = cv.imread(imagePath);
    if (img.empty) {
        throw new Error("Image not found or unable to open");
    }
    
    // Convert to grayscale
    const grayImg = img.bgrToGray();

    // Apply Gaussian Blur to reduce noise
    const blurredImg = grayImg.gaussianBlur(new cv.Size(5, 5), 0);
    
    // Edge detection using Canny
    const edges = blurredImg.canny(50, 150);
    
    // Resize image to the size expected by the API
    const resizedImg = edges.resize(224, 224);
    
    // Save the processed image
    const processedImagePath = path.join(path.dirname(imagePath), 'processed_' + path.basename(imagePath));
    cv.imwrite(processedImagePath, resizedImg);
    
    return processedImagePath;
};

// Converts local file information to a GoogleGenerativeAI.Part object.
const fileToGenerativePart = (path, mimeType) => {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}


const classify = async(req, res) => {
    
    try {

        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        
        const imagePath = path.join(rootDir, req.file.path);
        
        // Preprocess the image
        const processedImagePath = preprocessImage(imagePath);

        // Get MIME type of the processed image
        const mimeType = mime.lookup(processedImagePath);
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const prompt = "Identify this chemical structure and classify it";
        
        const imageParts = [
            fileToGenerativePart(processedImagePath, mimeType),
        ];

        
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        res.status(200).json({message: text});

     
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}



module.exports = {
    classify
}