const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

router.get('/items', async (req, res) => {
    const params = {
        TableName: 'real_databrew',
    };

    let items = [];
    try {
        do {
            const data = await dynamoDB.scan(params).promise();
            items = items.concat(data.Items);
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        } while (typeof params.ExclusiveStartKey !== "undefined");

        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Cannot fetch items' });
    }
});

module.exports = router;
