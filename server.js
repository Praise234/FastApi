require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const appRouter = require('./routes/route');
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(appRouter)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
