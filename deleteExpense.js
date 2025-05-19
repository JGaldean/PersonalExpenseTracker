const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = "anonymous";
  const expenseId = event.pathParameters?.id;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { userId, expenseId },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ message: "Expense deleted" }),
    };
  } catch (err) {
    console.error("Error deleting expense:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: "Failed to delete expense", message: err.message }),
    };
  }
};
