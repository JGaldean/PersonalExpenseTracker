const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = "anonymous";
  const expenseId = event.pathParameters?.id;

  const { date, amount, category, description } = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { userId, expenseId },
    UpdateExpression: "set #d = :d, #a = :a, #c = :c, #desc = :desc",
    ExpressionAttributeNames: {
      "#d": "date",
      "#a": "amount",
      "#c": "category",
      "#desc": "description",
    },
    ExpressionAttributeValues: {
      ":d": date,
      ":a": amount,
      ":c": category,
      ":desc": description,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (err) {
    console.error("Error updating expense:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: "Failed to update expense", message: err.message }),
    };
  }
};
