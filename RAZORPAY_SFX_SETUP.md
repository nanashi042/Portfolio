# Razorpay SFX delivery setup

The SFX checkout uses Razorpay's payment-link callback and server-side payment verification.

1. In Razorpay, set the payment link's **Callback URL** to `https://YOUR_DOMAIN/store/success`.
2. Add these Vercel environment variables for Production (and Preview if needed):
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
3. Deploy. Razorpay redirects paid customers with `razorpay_payment_link_id` and `razorpay_payment_id` query parameters.

The app sends those IDs to `/api/verify-payment`. The ZIP is stored under `private/` and is only returned by `/api/download-sfx` after Razorpay reports the payment as captured. Opening `/store/success` directly, or calling the download endpoint without a captured payment, is rejected.
