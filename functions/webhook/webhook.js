// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    console.log(JSON.parse(event.body).subscription);
    console.log(JSON.parse(event.body).subscription.uuid);
    console.log(JSON.parse(event.body).subscription.valid_until);
    console.log(event.body.transaction);
    console.log("event.transaction.subscription");
    console.log(event.body.transaction.subscription);
    return {
      event,
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
