# SMTP Environment Setup

Set the SMTP configuration in your environment (do not commit secrets).

Local (zsh):

```bash
export SMTP_HOST="smtp.example.com"
export SMTP_USER="user@example.com"
export SMTP_PASS="your_password"
```

Or create a `.env` file at project root (for local development only):

```
SMTP_HOST=smtp.example.com
SMTP_USER=user@example.com
SMTP_PASS=your_password
```

If you have a backend (FastAPI or similar), make sure the server process reads these env vars and does not expose them to the client. In production, set these variables in your host/CI provider's secret manager or environment settings.

Reminder: copy `.env.example` to `.env` and fill in values; never commit `.env`.
