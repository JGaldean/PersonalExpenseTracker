const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const userId = event.requestContext.authorizer.claims.sub;
    const expenseId = event.pathParameters.id;

    await dynamoDb.delete({
        TableName: process.env.TABLE_NAME,
        Key: { userId, expenseId }
    }).promise();

    return {
  statusCode: 201,
  headers: {
    "Access-Control-Allow-Origin": "*",         // Allow requests from any origin
    "Access-Control-Allow-Credentials": true     // Optional but common
  },
  body: JSON.stringify({ message: "Expense deleted", expenseId })
};

};