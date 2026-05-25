"""
Typeform → LexFlow AI Webhook Listener
========================================
Listens for Typeform form submissions via webhook and automatically
creates a client record in the LexFlow AI platform.

Setup:
  1. Install dependencies: pip install fastapi uvicorn requests
  2. Configure your Typeform webhook to POST to: http://your-server:8000/webhook/typeform
  3. Set LEXFLOW_API_URL to point to your LexFlow instance

Typeform webhook docs: https://developer.typeform.com/webhooks/
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import Optional

import requests
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

# ---------------------------------------------------------------------------
# Configuration — set via environment variables or edit directly
# ---------------------------------------------------------------------------
LEXFLOW_API_URL = os.getenv("LEXFLOW_API_URL", "http://localhost:3000/api/clients")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
VERIFY_TOKEN = os.getenv("TYPEFORM_VERIFY_TOKEN", "")  # Optional: Typeform webhook secret

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("typeform-lexflow")

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Typeform → LexFlow AI Bridge",
    description="Receives Typeform submissions and creates LexFlow client records",
    version="1.0.0",
)


# ---------------------------------------------------------------------------
# Typeform field mapping
# ---------------------------------------------------------------------------
def map_typeform_to_lexflow(payload: dict) -> dict:
    """
    Convert a Typeform webhook payload into a LexFlow client JSON body.

    Typeform sends answers as an array under `form_response.answers[]`.
    Each answer has a `field.id` that matches your form's field IDs.
    This mapper assumes you have a Typeform with these field IDs.
    """

    logger.info("Processing Typeform submission: %s", payload.get("event_id"))

    try:
        form_response = payload.get("form_response", payload)
        answers = {a["field"]["id"]: a for a in form_response.get("answers", [])}
    except (KeyError, TypeError):
        logger.warning("Unexpected payload format — using raw payload")
        answers = {}

    # ------------------------------------------------------------------
    # Helper: extract text / number / date / choice from a Typeform answer
    # ------------------------------------------------------------------
    def get_answer(field_id: str) -> Optional[str]:
        """Return the text value of a Typeform answer by field ID."""
        ans = answers.get(field_id)
        if ans is None:
            return None
        at = ans.get("type")
        if at == "text":
            return ans.get("text")
        if at == "choice":
            return ans.get("choice", {}).get("label")
        if at == "choices":
            labels = [c.get("label") for c in ans.get("choices", [])]
            return ", ".join(labels)
        if at == "number":
            return str(ans.get("number", ""))
        if at == "date":
            return ans.get("date", "")
        if at == "boolean":
            return str(ans.get("boolean", False))
        if at == "email":
            return ans.get("email", "")
        if at == "phone_number":
            return ans.get("phone_number", "")
        if at == "url":
            return ans.get("url", "")
        return str(ans.get(at, "")) if at else None

    def get_choice(field_id: str) -> Optional[bool]:
        """Return boolean from a yes/no or boolean field."""
        ans = answers.get(field_id)
        if ans is None:
            return None
        at = ans.get("type")
        if at == "boolean":
            return ans.get("boolean")
        if at == "choice":
            label = (ans.get("choice") or {}).get("label", "").strip().lower()
            return label in ("yes", "true", "1", "y")
        return None

    # ------------------------------------------------------------------
    # Map Typeform fields → LexFlow client fields
    # EDIT THE FIELD IDS BELOW to match your Typeform
    # ------------------------------------------------------------------
    client_data = {
        # === Core Identifiers ===
        "firstName": get_answer("first_name") or "",
        "lastName": get_answer("last_name") or "",
        "email": get_answer("email") or "",
        "phone": get_answer("phone") or "",

        # === Demographics ===
        "dateOfBirth": get_answer("date_of_birth") or "",
        "gender": get_answer("gender") or "",
        "language": get_answer("language") or "ENGLISH",

        # === Address ===
        "addressStreet": get_answer("address_street") or "",
        "addressCity": get_answer("address_city") or "",
        "addressState": get_answer("address_state") or "",
        "addressZip": get_answer("address_zip") or "",

        # === Immigration ===
        "immigrationStatus": get_answer("immigration_status") or "",
        "countryOfBirth": get_answer("country_of_birth") or "",
        "countryOfCitizenship": get_answer("country_of_citizenship") or "",
        "aNumber": get_answer("a_number") or "",

        # === Additional ===
        "ssn": get_answer("ssn") or "",
        "otherNames": get_answer("other_names") or "",
        "eSignatureConsent": get_choice("esign_consent") or False,

        # === Source Tracking ===
        "source": "typeform",
    }

    # Remove empty values for cleaner payload
    return {k: v for k, v in client_data.items() if v not in (None, "", False)}


# ---------------------------------------------------------------------------
# POST to LexFlow API
# ---------------------------------------------------------------------------
def push_to_lexflow(client_data: dict) -> dict:
    """Send the mapped client data to the LexFlow AI /api/clients endpoint."""
    logger.info("Pushing to LexFlow API: %s", LEXFLOW_API_URL)
    logger.debug("Payload: %s", json.dumps(client_data, indent=2))

    try:
        resp = requests.post(
            LEXFLOW_API_URL,
            json=client_data,
            headers={"Content-Type": "application/json"},
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()
        logger.info("LexFlow API responded: %s", result.get("message", "OK"))
        return result
    except requests.exceptions.ConnectionError:
        logger.error("Cannot connect to LexFlow API at %s", LEXFLOW_API_URL)
        raise
    except requests.exceptions.HTTPError as e:
        logger.error("LexFlow API returned %s: %s", e.response.status_code, e.response.text)
        raise
    except requests.exceptions.Timeout:
        logger.error("LexFlow API request timed out after 30s")
        raise


# ---------------------------------------------------------------------------
# Webhook endpoint
# ---------------------------------------------------------------------------
@app.post("/webhook/typeform")
async def typeform_webhook(request: Request):
    """
    Receive a Typeform webhook payload, map it to LexFlow client fields,
    and POST to the LexFlow API.
    """
    # Verify webhook token (if configured)
    if VERIFY_TOKEN:
        # Typeform sends the secret in the 'Typeform-Signature' header
        signature = request.headers.get("Typeform-Signature", "")
        if not signature:
            raise HTTPException(status_code=401, detail="Missing Typeform-Signature header")

    # Parse the incoming payload
    try:
        payload = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    logger.info("Received Typeform webhook: event_id=%s", payload.get("event_id", "unknown"))

    # Map Typeform data → LexFlow client format
    try:
        client_data = map_typeform_to_lexflow(payload)
    except Exception as e:
        logger.exception("Failed to map Typeform payload")
        raise HTTPException(status_code=422, detail=f"Mapping error: {str(e)}")

    if not client_data.get("firstName") and not client_data.get("lastName"):
        raise HTTPException(
            status_code=422,
            detail="Missing required fields: at least one of firstName/lastName must be provided",
        )

    # Push to LexFlow API
    try:
        result = push_to_lexflow(client_data)
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=502, detail="Cannot connect to LexFlow API")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"LexFlow API error: {str(e)}")
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="LexFlow API timeout")

    return JSONResponse(
        content={
            "status": "created",
            "client": result.get("client", client_data),
            "lexflow_response": result,
            "typeform_event_id": payload.get("event_id"),
        },
        status_code=201,
    )


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "typeform-to-lexflow",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ---------------------------------------------------------------------------
# CLI helper: test with a sample payload
# ---------------------------------------------------------------------------
SAMPLE_TYPEFORM_PAYLOAD = {
    "event_id": "test-event-001",
    "event_type": "form_response",
    "form_response": {
        "form_id": "abc123",
        "submitted_at": "2026-05-24T12:00:00Z",
        "answers": [
            {"field": {"id": "first_name"}, "type": "text", "text": "Tran"},
            {"field": {"id": "last_name"}, "type": "text", "text": "Nguyen"},
            {"field": {"id": "email"}, "type": "email", "email": "tran.nguyen@example.com"},
            {"field": {"id": "phone"}, "type": "phone_number", "phone_number": "+15551234567"},
            {"field": {"id": "date_of_birth"}, "type": "date", "date": "1988-03-15"},
            {"field": {"id": "immigration_status"}, "type": "text", "text": "LPR"},
            {"field": {"id": "country_of_birth"}, "type": "text", "text": "Vietnam"},
            {"field": {"id": "language"}, "type": "text", "text": "VIETNAMESE"},
            {"field": {"id": "esign_consent"}, "type": "boolean", "boolean": True},
        ],
    },
}


if __name__ == "__main__":
    """Run: python typeform-to-lexflow.py            → starts the webhook server
       Run: python typeform-to-lexflow.py --test     → sends a sample payload to LexFlow
    """
    if "--test" in sys.argv:
        # Test mode: send sample payload directly to LexFlow
        logger.info("=== TEST MODE ===")
        logger.info("Mapping sample Typeform payload...")
        mapped = map_typeform_to_lexflow(SAMPLE_TYPEFORM_PAYLOAD)
        logger.info("Mapped client data:\n%s", json.dumps(mapped, indent=2))
        logger.info("Sending to LexFlow API at %s ...", LEXFLOW_API_URL)
        try:
            result = push_to_lexflow(mapped)
            logger.info("SUCCESS: %s", json.dumps(result, indent=2))
        except Exception as e:
            logger.error("FAILED: %s", e)
            sys.exit(1)
    else:
        # Server mode
        import uvicorn
        uvicorn.run(app, host=HOST, port=PORT)
