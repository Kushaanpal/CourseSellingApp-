import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51ROadeGD1XsyarQFh6nLvIdnB3qkphowb6B2aMqQORgAgThMnTaXPMogs6vz9jxhbZg8mDZOyxtzgxUqBVMFHRvy00ydfIXlgq"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);