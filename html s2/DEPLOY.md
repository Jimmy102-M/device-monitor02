# Publish Traceboard

Traceboard has a browser dashboard and an official API scaffold. It does not bypass platform security, access private accounts, or recover data without an official backup or account authorization.

## Local network access

The Python server now listens on all local network interfaces by default. Start it from this folder:

```powershell
python server.py
```

Find the computer's local IPv4 address with `ipconfig`, then open `http://YOUR_LOCAL_IP:4173/` on another device connected to the same network. Allow Python through Windows Firewall when prompted. Do not expose the dashboard to the public internet while it contains real call logs, phone numbers, or case records.

## Free API setup

Traceboard starts in demo mode and does not require credentials. For live platform connections, create your own free developer apps from the official provider portals, then set the values from `.env.example` in your local environment. API access and approval rules vary by platform; no shared keys are included.

```powershell
$env:DEMO_MODE="1"
python server.py
```

Switch to live OAuth only after adding your own credentials:

```powershell
$env:DEMO_MODE="0"
$env:META_APP_ID="your-app-id"
$env:META_APP_SECRET="your-app-secret"
$env:TIKTOK_CLIENT_KEY="your-client-key"
$env:TIKTOK_CLIENT_SECRET="your-client-secret"
python server.py
```

Never place secrets in HTML, JavaScript, Git, screenshots, or a public deployment.

## Before publishing

1. Choose a public HTTPS domain.
2. Replace `YOUR_PUBLIC_DOMAIN` in `robots.txt` and `sitemap.xml`.
3. Set `PUBLIC_URL` to that HTTPS URL.
4. Add Meta and TikTok app credentials from the official developer portals. Never commit `.env`.
5. Register these callbacks in each developer portal:
   - `https://YOUR_PUBLIC_DOMAIN/auth/meta/callback`
   - `https://YOUR_PUBLIC_DOMAIN/auth/tiktok/callback`

## Google

After deployment, open Google Search Console, verify the domain, submit `https://YOUR_PUBLIC_DOMAIN/sitemap.xml`, and request indexing for the home page. Google cannot index `localhost` or a file opened directly from a computer.

## Public deployment

For access over the internet, deploy behind HTTPS using a host such as Render, Railway, Fly.io, or a VPS with a reverse proxy. Add authentication and a real database before storing personal records. Set `HOST=0.0.0.0`, `PORT`, and `PUBLIC_URL` in the deployment environment, and never commit platform secrets.

## Run locally

```powershell
$env:HOST="127.0.0.1"
$env:PORT=4173
$env:PUBLIC_URL="http://localhost:4173"
python server.py
```