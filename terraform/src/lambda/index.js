const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  // Token Verification
  const token = event.headers ? (event.headers['x-api-token'] || event.headers['X-Api-Token']) : null;
  if (token !== process.env.API_TOKEN) {
    console.warn("Unauthorized access attempt");
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }


  try {
    const body = JSON.parse(event.body || "{}");
    const { to, subject, message, bcc } = body;

    if (!to || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: to, subject, message" }),
      };
    }

    const destination = {
      ToAddresses: [to],
    };

    if (bcc) {
      destination.BccAddresses = [bcc];
    }

    const command = new SendEmailCommand({
      Source: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
      Destination: destination,
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: message,
          },
        },
      },
    });

    await sesClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email", details: error.message }),
    };
  }
};
