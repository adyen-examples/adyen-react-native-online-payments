const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const os = require("os");
const app = express();

// setup request logging
app.use(morgan("dev"));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Parse cookie bodies, and allow setting/getting cookies
app.use(cookieParser());
// enable CORS
app.use(cors());
// Serve client from build folder
app.use(express.static(path.join(__dirname, "build")));

// enables environment variables by
// parsing the .env file and assigning it to process.env
dotenv.config({
  path: "./.env",
});

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = process.env.API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);

/* ################# API ENDPOINTS ###################### */

// Handle all redirects from payment type
app.all("/api/handleShopperRedirect", async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {};
  payload["details"] = req.method === "GET" ? req.query : req.body;
  payload["paymentData"] = req.cookies["paymentData"];
  const originalHost = req.cookies["originalHost"] || "";

  try {
    const response = await checkout.paymentsDetails(payload);
    res.clearCookie("paymentData");
    res.clearCookie("originalHost");
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect(`${originalHost}/status/success`);
        break;
      case "Pending":
      case "Received":
        res.redirect(`${originalHost}/status/pending`);
        break;
      case "Refused":
        res.redirect(`${originalHost}/status/failed`);
        break;
      default:
        res.redirect(
          `${originalHost}/status/error?reason=${response.resultCode}`
        );
        break;
    }
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.redirect(`${originalHost}/status/error?reason=${err.message}`);
  }
});

// Get Adyen configuration
app.get("/api/config", (req, res) => {
  res.json({
    environment: "test",
    originKey: process.env.ORIGIN_KEY,
  });
});

// Get payment methods
app.post("/api/getPaymentMethods", async (req, res) => {
  try {
    const response = await checkout.paymentMethods({
      channel: "Web",
      merchantAccount: process.env.MERCHANT_ACCOUNT,
    });
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Get pay by link
app.post("/api/getPaymentLinks", async (req, res) => {
  try {
    const response = await checkout.paymentLinks({
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      reference: `${Date.now()}`,
      amount: {
        value: 1000,
        currency: "EUR",
      },
      description: "1 x Headphone and 1 x Sunglass",
      countryCode: "NL",
      shopperReference: "DEMO_USER",
      shopperEmail: "test@email.com",
      lineItems: [
        {
          quantity: "1",
          amountExcludingTax: "331",
          taxPercentage: "2100",
          description: "Sunglasses",
          id: "Item 1",
          taxAmount: "69",
          amountIncludingTax: "400",
        },
        {
          quantity: "1",
          amountExcludingTax: "248",
          taxPercentage: "2100",
          description: "Headphones",
          id: "Item 2",
          taxAmount: "52",
          amountIncludingTax: "300",
        },
      ],
    });
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Submitting a payment
app.post("/api/initiatePayment", async (req, res) => {
  const currency = findCurrency(req.body.paymentMethod.type);
  const shopperIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const [name, IP] = findIpAddress();
  try {
    // Ideally the data passed here should be computed based on business logic
    const response = await checkout.payments({
      amount: { currency, value: 1000 }, // value is 10€ in minor units
      reference: `${Date.now()}`,
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      // @ts-ignore
      shopperIP,
      channel: "Web",
      additionalData: {
        // @ts-ignore
        allow3DS2: true,
      },
      returnUrl: `exp://${IP}:19000/--/?`, // this URL is used when using with Expo in development
      //   returnUrl: "expo.adyendemo://", // use this if deploying as standalone app in production
      browserInfo: req.body.browserInfo,
      paymentMethod: req.body.paymentMethod,
      billingAddress: req.body.billingAddress,
      origin: req.body.origin,
    });
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

app.post("/api/submitAdditionalDetails", async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {};
  payload["details"] = req.body.details;
  payload["paymentData"] = req.body.paymentData;

  try {
    // Return the response back to client
    // (for further action handling or presenting result to shopper)
    const response = await checkout.paymentsDetails(payload);
    let resultCode = response.resultCode;
    let action = response.action || null;

    res.json({ action, resultCode });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

/* ################# end API ENDPOINTS ###################### */

/* ################# CLIENT ENDPOINTS ###################### */

// Handles any requests that doesn't match the above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/* ################# end CLIENT ENDPOINTS ###################### */

/* ################# UTILS ###################### */

function findCurrency(type) {
  switch (type) {
    case "wechatpayqr":
    case "alipay":
      return "CNY";
    case "dotpay":
      return "PLN";
    case "boletobancario":
      return "BRL";
    default:
      return "EUR";
  }
}

const findIpAddress = () => {
  const ifaces = os.networkInterfaces();

  let name = "localhost";
  let ip = "localhost";

  Object.keys(ifaces).forEach((ifname) => {
    var alias = 0;

    ifaces[ifname].forEach((iface) => {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        name = ifname + ":" + alias;
        ip = iface.address;
      } else {
        // this interface has only one ipv4 adress
        name = ifname;
        ip = iface.address;
      }
      ++alias;
    });
  });
  return [name, ip];
};
/* ################# end UTILS ###################### */

// Start server
const PORT = 8089;
const [name, IP] = findIpAddress();
app.listen(PORT, () =>
  console.log(`Server started on ${name} port http://${IP}:${PORT}`)
);
