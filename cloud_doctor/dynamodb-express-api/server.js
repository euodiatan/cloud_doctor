const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const AWS = require('aws-sdk');

// Configure AWS region and credentials
AWS.config.update({
  region: 'ap-southeast-2', 
  accessKeyId:'AKIAQD7B7R2QOUQLDNQ3',
  secretAccessKey:'lQrNYkkL9mKuXRWPxwDRmbQcBfkvXqwkGR/Z+VLp'// e.g., 'us-west-1'
  // If you're running the app on your local machine, you might want to configure your credentials here
  // accessKeyId: 'YOUR_ACCESS_KEY',
  // secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const itemsRoutes = require('./routes/items');

app.use('/', itemsRoutes);