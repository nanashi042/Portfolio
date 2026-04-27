# 📧 Booking Form - Quick Start Guide

Your booking form sends confirmation emails **from nikhmdia@gmail.com to clients** automatically!

## What You Need to Do

### 1️⃣ Set Up EmailJS (5 minutes)

Follow the step-by-step guide in **EMAILJS_SETUP.md**

Quick summary:
1. Create free account at [EmailJS.com](https://www.emailjs.com/)
2. Connect your Gmail (nikhmdia@gmail.com)
3. Create one email template
4. Get your Service ID, Template ID, and Public Key

### 2️⃣ Configure Your App

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your EmailJS credentials
# (You'll get these from EmailJS dashboard)
```

Your `.env` should look like:
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=AbC123XyZ
```

### 3️⃣ Test It

1. Restart your dev server
2. Fill out the booking form
3. Client receives email from nikhmdia@gmail.com! ✅

## How It Works

```
Client fills form
       ↓
Form submits
       ↓
EmailJS sends email FROM nikhmdia@gmail.com TO client
       ↓
Client receives confirmation with meeting details
       ↓
Success message shown
       ↓
Form clears
```

## Email Example

When a client books a call, they receive:

```
From: Nikhil <nikhmdia@gmail.com>
To: client@example.com
Subject: Meeting Confirmed! 🎬 Monday, May 15, 2026 at 2:00 PM

Hi John,

Thanks for booking a call with me! I'm excited to chat about your project.

📅 Meeting Details:
━━━━━━━━━━━━━━━━━━━
Date: Monday, May 15, 2026
Time: 2:00 PM
Your Email: client@example.com

📝 Project Details:
Need help editing Instagram reels for my fitness brand

━━━━━━━━━━━━━━━━━━━

I'll send you the Google Meet link 24 hours before our scheduled time.

Looking forward to creating something awesome together! ✨

Best,
Nikhil
```

## Benefits

✅ **Professional** - Emails come from your actual Gmail  
✅ **Automatic** - No manual work needed  
✅ **Two-way** - Clients can reply directly to your email  
✅ **Free** - 200 emails/month on free tier  
✅ **Trackable** - Sent emails appear in your Gmail Sent folder  

## Files

- `EMAILJS_SETUP.md` - Detailed setup instructions
- `.env.example` - Template for your credentials
- `.env` - Your actual credentials (don't commit this!)
- `.gitignore` - Keeps `.env` private

## Need Help?

Check `EMAILJS_SETUP.md` for troubleshooting and detailed instructions.

---

**That's all!** Set it up once and your booking form handles the rest automatically. 🚀
