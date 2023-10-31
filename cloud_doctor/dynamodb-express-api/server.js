const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Configure AWS region
AWS.config.update({
  region: 'ap-southeast-2'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const itemsRoutes = require('./routes/items');

app.use('/', itemsRoutes);
