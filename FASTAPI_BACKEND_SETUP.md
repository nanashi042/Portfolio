# FastAPI Backend Setup

This project now supports server-side booking + acknowledgment emails via FastAPI and SQLite.

## 1) Install backend dependencies

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 2) Configure environment variables

```bash
cp .env.example .env
```

Update `backend/.env` with your SMTP credentials.

Important for Gmail:
- Use an App Password (not your normal account password)
- Keep `SMTP_HOST=smtp.gmail.com` and `SMTP_PORT=587`

## 3) Run backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 4) Configure frontend API URL

Create a root `.env` file (if missing) and add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Then run frontend:

```bash
npm run dev
```

## API endpoint

- `POST /api/bookings`

Payload:

```json
{
  "client_name": "John",
  "client_email": "john@example.com",
  "meeting_date": "Monday, May 15, 2026",
  "meeting_time": "2:00 PM",
  "project_details": "Need reel edits"
}
```

Behavior:
- Saves booking in SQLite (`backend/bookings.db`)
- Creates email log row
- Sends acknowledgment email via SMTP
- Updates email log with `sent` or `failed`

## SQLite tables

- `bookings`
- `email_logs`

## Health check

- `GET /health`
