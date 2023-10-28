const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

router.get('/items', async (req, res) => {
    const params = {
        TableName: 'databrew_patient',
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Cannot fetch items' });
    }
});

module.exports = router;
