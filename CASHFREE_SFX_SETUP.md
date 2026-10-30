# Cashfree SFX checkout setup

The SFX store creates a Cashfree order on the server, redirects the customer to Cashfree checkout, and verifies the order status with Cashfree before serving the ZIP.

Set these server environment variables in the deployment environment:

- `CASHFREE_CLIENT_ID`
- `CASHFREE_CLIENT_SECRET`
- `CASHFREE_SFX_PRICE_INR` (the SFX pack price in INR)

The local `.env` file should use the same `NAME=value` format. The success return URL is generated as `/store/success?order_id={order_id}`. The ZIP remains in `private/` and is only served when Cashfree reports that order as `PAID`.

Cashfree checkout is configured for production. Use production credentials and configure the website domain in the Cashfree dashboard before launch.
