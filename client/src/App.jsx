import React, { useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51Lo6PUHWs13Ra00Lh1oRlSBwcLDVWAFp6dJROnp5Es3fEls4KvktkMa9J4wJp1cvix20VcyjsfF1Id32oxXPqEUD00yMcnxqKu"
);
const App = () => {
  const [clientSecret, setclientSecret] = useState("");
  const confirmPaymentIntent = () => {
    axios
      .post("http://localhost:5000/pay")
      .then((resp) => {
        setclientSecret(resp.data.client_secret);
        console.log(resp.data);
      })
      .catch((err) => console.log(err));
  };
  const capturePaymentIntent = () => {
    axios
      .post("http://localhost:5000/capture")
      .then((resp) => console.log(resp.data))
      .catch((e) => console.log(e));
  };
  const refundPayment = () => {
    axios
      .post("http://localhost:5000/refund")
      .then((resp) => console.log(resp.data))
      .catch((e) => console.log(e));
  };
  return (
    <div>
      <form action="http://localhost:5000/create-account" method="POST">
        <button type="submit">Create connect account</button>
      </form>

      <button onClick={confirmPaymentIntent} type="submit">
        Pay
      </button>
      <form action="http://localhost:5000/delete" method="DELETE">
        <button type="submit">Delete account</button>
      </form>
      <button onClick={capturePaymentIntent} type="submit">
        Capture
      </button>
      <button onClick={refundPayment} type="submit">
        Refund
      </button>
      <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default App;
