# LexFlow AI — Integration Scripts

## Typeform → LexFlow
Listens for Typeform webhook submissions and auto-creates clients.

```bash
pip install -r requirements.txt
python typeform-to-lexflow.py          # Start webhook server
python typeform-to-lexflow.py --test   # Test mode (sends sample to LexFlow)
```

**Typeform setup:**
1. Create a Typeform with field IDs matching the mapper
2. Configure webhook to POST to `http://your-server:8000/webhook/typeform`
3. Set env: `TYPEFORM_VERIFY_TOKEN` (optional)

## Docketwise Sync
Creates clients in Docketwise via their REST API v1.

```bash
# 1. Get OAuth URL
python docketwise-sync.py --auth-url

# 2. Exchange code for tokens
python docketwise-sync.py --exchange <AUTH_CODE>

# 3. Create a test contact
python docketwise-sync.py --create-client "Tran" "Nguyen"

# 4. Import from LexFlow intake JSON
python docketwise-sync.py --from-lexflow sample-intake.json

# 5. List contacts
python docketwise-sync.py --list
```

**Docketwise API:** POST https://app.docketwise.com/api/v1/contacts
**Auth:** OAuth 2.0 — tokens expire in 180 days, refreshable

---

## Environment Variables

| Variable | Description |
|---|---|
| `LEXFLOW_API_URL` | LexFlow API base URL (default: http://localhost:3000) |
| `TYPEFORM_VERIFY_TOKEN` | Typeform webhook secret |
| `DOCKETWISE_CLIENT_ID` | OAuth client ID from Docketwise |
| `DOCKETWISE_CLIENT_SECRET` | OAuth client secret |
| `DOCKETWISE_REDIRECT_URI` | OAuth redirect URI |
| `DOCKETWISE_REFRESH_TOKEN` | Saved refresh token |
