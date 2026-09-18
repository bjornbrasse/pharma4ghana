import { createServer } from "node:http";

const port = 4100;

function checkoutSession(id, paymentStatus) {
  return {
    id,
    object: "checkout.session",
    amount_total: 2000,
    created: 1_735_689_600,
    currency: "eur",
    customer_details: {
      address: {
        city: "Amsterdam",
        country: "NL",
        line1: "Donorstraat 2",
        line2: null,
        postal_code: "1000 AA",
        state: null,
      },
      email: "donor@example.com",
      name: "Test Donor",
    },
    metadata: {
      amount_eur: "20.00",
      locale: "en",
      source: "donation-page",
    },
    mode: "payment",
    payment_intent: {
      id: "pi_test_paid_donation",
      object: "payment_intent",
    },
    payment_method_types: ["card"],
    payment_status: paymentStatus,
    status: paymentStatus === "paid" ? "complete" : "open",
  };
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/health") {
    response.writeHead(200).end("ok");
    return;
  }

  if (request.method === "POST" && url.pathname === "/v1/checkout/sessions") {
    const session = checkoutSession("cs_test_paid", "paid");
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        ...session,
        url: "http://127.0.0.1:3100/en/donate/success?session_id=cs_test_paid",
      }),
    );
    return;
  }

  const sessionMatch = url.pathname.match(/^\/v1\/checkout\/sessions\/(cs_test_[a-z]+)$/);

  if (request.method === "GET" && sessionMatch) {
    const id = sessionMatch[1];
    const paymentStatus = id === "cs_test_paid" ? "paid" : "unpaid";
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(checkoutSession(id, paymentStatus)));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: { message: "Fixture route not found" } }));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Stripe fixture listening on http://127.0.0.1:${port}`);
});
