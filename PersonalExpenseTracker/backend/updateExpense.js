const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const userId = event.requestContext.authorizer.claims.sub;
    const expenseId = event.pathParameters.id;
    const { date, amount, category, description } = JSON.parse(event.body);

    await dynamoDb.update({
        TableName: process.env.TABLE_NAME,
        Key: { userId, expenseId },
        UpdateExpression: "set #d = :d, amount = :a, category = :c, description = :desc",
        ExpressionAttributeNames: { "#d": "date" },
        ExpressionAttributeValues: {
            ":d": date,
            ":a": amount,
            ":c": category,
            ":desc": description
        }
    }).promise();

    const updated = {
        userId,
        expenseId,
        date,
        amount,
        category,
        description
    };


    return {
  statusCode: 201,
  headers: {
    "Access-Control-Allow-Origin": "*",         // Allow requests from any origin
    "Access-Control-Allow-Credentials": true     // Optional but common
  },
  body: JSON.stringify(updated)
};

};
