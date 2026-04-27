# EmailJS Setup Guide - Send Booking Confirmations

Your booking form will send confirmation emails **FROM your Gmail (nikhmdia@gmail.com) TO the client** automatically!

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **Sign Up** (it's free - 200 emails/month)
3. Verify your email

### Step 2: Connect Your Gmail

1. In EmailJS dashboard, click **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Click **Connect Account** and sign in with **nikhmdia@gmail.com**
5. Authorize EmailJS to send emails on your behalf
6. **Copy your Service ID** (looks like `service_abc123`)

### Step 3: Create Email Template

1. Go to **Email Templates** tab
2. Click **Create New Template**
3. Use this template:

**Template Settings:**
- Template Name: `Booking Confirmation`

**Email Content:**
```
To: {{to_email}}
From: Nikhil <nikhmdia@gmail.com>
Subject: Meeting Confirmed! 🎬 {{meeting_date}} at {{meeting_time}}

Hi {{to_name}},

Thanks for booking a call with me! I'm excited to chat about your project.

📅 Meeting Details:
━━━━━━━━━━━━━━━━━━━
Date: {{meeting_date}}
Time: {{meeting_time}}
Your Email: {{client_email}}

📝 Project Details:
{{project_details}}

━━━━━━━━━━━━━━━━━━━

I'll send you the Google Meet link 24 hours before our scheduled time.

If you need to reschedule or have any questions, just reply to this email.

Looking forward to creating something awesome together! ✨

Best,
Nikhil
Video Editor
📧 nikhmdia@gmail.com
📱 Instagram: @nimbuuz.mov
```

4. **Copy the Template ID** (looks like `template_xyz789`)

### Step 4: Get Public Key

1. Click your profile/account icon
2. Go to **Account** → **General**
3. Find **Public Key** section
4. **Copy your Public Key** (looks like `AbC123XyZ`)

### Step 5: Configure Your App

1. Create `.env` file in your project root:
```bash
cp .env.example .env
```

2. Open `.env` and add your credentials:
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=AbC123XyZ
```

Replace with your actual IDs from steps above!

### Step 6: Test It! 🚀

1. Restart your dev server if it's running
2. Fill out the booking form on your website
3. Submit the form
4. Check the client's email - they should receive a confirmation from nikhmdia@gmail.com!

## How It Works

When someone books a call:
1. They fill the form with name, email, date, time, project details
2. EmailJS sends an email **FROM nikhmdia@gmail.com** TO their email
3. The email includes all meeting details
4. They can reply directly to your Gmail!

## Template Variables Reference

These variables are automatically filled in:
- `{{to_email}}` - Client's email address
- `{{to_name}}` - Client's name  
- `{{client_name}}` - Client's name (alternative)
- `{{client_email}}` - Client's email (for confirmation)
- `{{meeting_date}}` - Selected meeting date
- `{{meeting_time}}` - Selected time slot
- `{{project_details}}` - Client's project description

## Troubleshooting

**Email not sending?**
- Check browser console for errors
- Verify all 3 credentials are correct in `.env`
- Make sure you authorized Gmail in EmailJS

**Wrong sender email?**
- The email WILL come from nikhmdia@gmail.com (the Gmail you connected)
- EmailJS uses your Gmail to send emails

**Gmail blocking?**
- Make sure you completed the OAuth authorization in EmailJS
- Check your Gmail "Sent" folder - sent emails will appear there

**Rate limits?**
- Free tier: 200 emails/month
- Upgrade if you need more

## Security Notes

- ✅ `.env` is in `.gitignore` - your keys are safe
- ✅ Never commit `.env` to git
- ✅ Share `.env.example` instead
- ✅ EmailJS Public Key is safe to use in frontend code

## Need Help?

- 📖 [EmailJS Documentation](https://www.emailjs.com/docs/)
- 🎥 [EmailJS Video Tutorial](https://www.emailjs.com/docs/tutorial/overview/)
- 💬 [EmailJS Support](https://www.emailjs.com/docs/support/)

---

**That's it!** Your booking form now sends professional confirmation emails from your Gmail automatically. 🎉
