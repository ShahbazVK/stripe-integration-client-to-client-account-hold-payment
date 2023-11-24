import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const paymentConfirm = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    const { error, paymentIntent } = paymentConfirm;
    if (error) {
      console.error(error);
      setError(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      // Payment successful, you can handle the success here
      console.log(paymentIntent.id);
      console.log("Payment succeeded!");
    } else if (paymentIntent?.status === "requires_capture") {
      // Payment successful, you can handle the success here
      console.log("Payment capture is required!");
      console.log(paymentIntent);
    }
  };
  return clientSecret ? (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement />
      </label>

      {error && <div role="alert">{error}</div>}

      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  ) : null;
};

export default PaymentForm;
