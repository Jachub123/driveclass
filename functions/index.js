// serverless-function.js
exports.handler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body); // Assuming the webhook sends JSON data
    // Process the incoming webhook data and perform actions
    console.log("Webhook data:", requestBody);

    // Send an acknowledgment response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Webhook received and processed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing webhook",
        error: error.message,
      }),
    };
  }
};
