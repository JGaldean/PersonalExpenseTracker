const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const allowOrigin = "http://personal-expense-tracker-frontend-jgaldean.s3-website-us-east-1.amazonaws.com";

  try {
    const userId = event.requestContext?.authorizer?.claims?.sub || "anonymous";
    const { date, amount, category, description } = JSON.parse(event.body);

    const expense = {
      userId,
      expenseId: uuidv4(),
      date,
      amount,
      category,
      description,
    };

    await dynamoDb.put({
      TableName: process.env.TABLE_NAME,
      Item: expense,
    }).promise();

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(expense),
    };
  } catch (err) {
    console.error("Error saving expense:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: "Failed to create expense", message: err.message }),
    };
  }
};
