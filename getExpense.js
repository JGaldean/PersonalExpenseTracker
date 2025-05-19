const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = event.requestContext?.authorizer?.claims?.sub || "anonymous";

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: "Failed to fetch expenses", message: err.message }),
    };
  }
};
