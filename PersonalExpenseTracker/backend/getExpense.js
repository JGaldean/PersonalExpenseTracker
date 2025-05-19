const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const userId = event.requestContext.authorizer.claims.sub;

    const result = await dynamoDb.query({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
            ":uid": userId
        }
    }).promise();

    return {
  statusCode: 201,
  headers: {
    "Access-Control-Allow-Origin": "*",         // Allow requests from any origin
    "Access-Control-Allow-Credentials": true     // Optional but common
  },
  body: JSON.stringify(result.Items)
};

};