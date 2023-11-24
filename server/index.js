const express = require("express");
const cors = require("cors");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const stripe = require("stripe")("key");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => res.json("hello world"));

app.post("/create-account", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: "jenny.rosen@example.com",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });
    res.redirect(accountLink.url);
  } catch (error) {
    console.error("error");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/pay", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    //if u dont need to hold payment then dont add this
    payment_method_options: {
      card: {
        capture_method: "manual",
      },
    },
    //if u dont need to hold payment then add next commented line
    // application_fee_amount: 500,
    transfer_data: {
      destination: "acct_1OG47jH1Fofgkqju",
    },
  });
  res.json({
    paymentIntentId: paymentIntent.id,
    client_secret: paymentIntent.client_secret,
  });
  //   console.log(paymentIntentConfirmation);
});

app.post("/capture", async (req, res) => {
  const paymentCapture = await stripe.paymentIntents.capture(
    "pi_3OG6OsHWs13Ra00L0uIIXBk0",
    {
      application_fee_amount: 200,
    }
  );
  res.send(paymentCapture);
});

app.post("/refund", async (req, res) => {
  const refund = await stripe.refunds.create({
    payment_intent: "pi_3OG6OsHWs13Ra00L0uIIXBk0",
  });
  res.send(refund);
});

app.delete("/delete", async (req, res) => {
  const deleted = await stripe.accounts.del("acct_1OFbapH0f0pIK5jH");
  console.log(deleted);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(5000, () => console.log("server running on 5000"));
