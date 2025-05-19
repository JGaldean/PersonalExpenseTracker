const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { date, amount, category, description } = JSON.parse(event.body);

  const expense = {
    expenseId: uuidv4(),
    date,
    amount,
    category,
    description
  };

  await dynamoDb.put({
    TableName: process.env.TABLE_NAME,
    Item: expense
  }).promise();

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify(expense),
  };
};
