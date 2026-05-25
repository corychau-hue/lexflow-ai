"""
Docketwise Client Integration
==============================
Adds new clients to Docketwise via their REST API v1.

Based on official API docs: https://docketwise.gitbook.io/docketwise-api-docs

Endpoint: POST https://app.docketwise.com/api/v1/contacts
Auth:     OAuth 2.0 (Bearer token, 180-day expiry, refreshable)
Rate limit: 120 requests/min per token

Setup:
  1. Email dev@docketwise.com with subject "API integration" to register
  2. Provide your OAuth redirect URI(s)
  3. Set environment variables below
  4. Install: pip install requests
"""

import os
import json
import logging
from datetime import datetime
from typing import Optional

import requests

# ---------------------------------------------------------------------------
# Configuration — set via environment variables
# ---------------------------------------------------------------------------
DOCKETWISE_BASE_URL = os.getenv("DOCKETWISE_BASE_URL", "https://app.docketwise.com/api/v1")
DOCKETWISE_CLIENT_ID = os.getenv("DOCKETWISE_CLIENT_ID", "")
DOCKETWISE_CLIENT_SECRET = os.getenv("DOCKETWISE_CLIENT_SECRET", "")
DOCKETWISE_REDIRECT_URI = os.getenv("DOCKETWISE_REDIRECT_URI", "")
DOCKETWISE_REFRESH_TOKEN = os.getenv("DOCKETWISE_REFRESH_TOKEN", "")

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("docketwise")


# ---------------------------------------------------------------------------
# OAuth 2.0 Token Management
# ---------------------------------------------------------------------------
class DocketwiseAuth:
    """
    Manages OAuth 2.0 tokens for the Docketwise API.
    Tokens expire in 180 days. Refresh tokens are provided automatically.
    """

    AUTHORIZE_URL = "https://app.docketwise.com/oauth/authorize"
    TOKEN_URL = "https://app.docketwise.com/oauth/token"

    def __init__(self):
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = DOCKETWISE_REFRESH_TOKEN or None

    def get_authorization_url(self) -> str:
        """Generate the URL for the initial OAuth authorization step."""
        params = {
            "client_id": DOCKETWISE_CLIENT_ID,
            "redirect_uri": DOCKETWISE_REDIRECT_URI,
            "response_type": "code",
        }
        req = requests.Request("GET", self.AUTHORIZE_URL, params=params)
        return req.prepare().url

    def exchange_code(self, authorization_code: str) -> dict:
        """Exchange an authorization code for access + refresh tokens."""
        payload = {
            "client_id": DOCKETWISE_CLIENT_ID,
            "client_secret": DOCKETWISE_CLIENT_SECRET,
            "code": authorization_code,
            "grant_type": "authorization_code",
            "redirect_uri": DOCKETWISE_REDIRECT_URI,
        }
        resp = requests.post(self.TOKEN_URL, json=payload, timeout=30)
        resp.raise_for_status()
        tokens = resp.json()
        self.access_token = tokens.get("access_token")
        self.refresh_token = tokens.get("refresh_token")
        logger.info("OAuth tokens acquired. Access token expires in 180 days.")
        return tokens

    def refresh_access_token(self) -> str:
        """Refresh an expired access token using the refresh token."""
        if not self.refresh_token:
            raise ValueError("No refresh token available. Re-authenticate via OAuth.")
        payload = {
            "client_id": DOCKETWISE_CLIENT_ID,
            "client_secret": DOCKETWISE_CLIENT_SECRET,
            "refresh_token": self.refresh_token,
            "grant_type": "refresh_token",
        }
        resp = requests.post(self.TOKEN_URL, json=payload, timeout=30)
        resp.raise_for_status()
        tokens = resp.json()
        self.access_token = tokens.get("access_token")
        if tokens.get("refresh_token"):
            self.refresh_token = tokens["refresh_token"]
        logger.info("Access token refreshed successfully.")
        return self.access_token

    def get_headers(self) -> dict:
        """Return the Authorization headers for API requests."""
        if not self.access_token:
            raise ValueError(
                "No access token. Call exchange_code() or refresh_access_token() first."
            )
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }


# ---------------------------------------------------------------------------
# Docketwise API Client
# ---------------------------------------------------------------------------
class DocketwiseClient:
    """
    High-level client for the Docketwise API v1.
    """

    def __init__(self, auth: DocketwiseAuth):
        self.auth = auth
        self.session = requests.Session()
        self.session.headers.update(auth.get_headers())
        self.session.headers.update({"User-Agent": "LexFlow-AI-Integration/1.0"})

    def _request(self, method: str, path: str, **kwargs) -> dict:
        """Make an API request with automatic token refresh on 401."""
        url = f"{DOCKETWISE_BASE_URL}{path}"
        logger.debug("%s %s", method, url)

        for attempt in range(2):  # max 1 retry with refreshed token
            resp = self.session.request(method, url, **kwargs)
            if resp.status_code == 401 and attempt == 0:
                logger.info("Token expired — refreshing...")
                new_token = self.auth.refresh_access_token()
                self.session.headers.update({"Authorization": f"Bearer {new_token}"})
                continue
            resp.raise_for_status()
            return resp.json()

    def create_contact(self, contact_data: dict) -> dict:
        """
        Create a new contact (client) in Docketwise.

        POST /contacts

        Args:
            contact_data: Dictionary with keys matching the Docketwise API.
                          Must be wrapped — this function adds the "contact" root key.

        Returns:
            The created contact object from Docketwise.
        """
        payload = {"contact": contact_data}
        logger.info("Creating Docketwise contact: %s %s",
                     contact_data.get("first_name", ""),
                     contact_data.get("last_name", ""))
        return self._request("POST", "/contacts", json=payload)

    def get_contact(self, contact_id: int) -> dict:
        """Retrieve a single contact by ID."""
        logger.info("Fetching Docketwise contact ID: %s", contact_id)
        return self._request("GET", f"/contacts/{contact_id}")

    def list_contacts(self, contact_type: Optional[str] = None) -> list:
        """List all contacts, optionally filtered by type ('Person' or 'Institution')."""
        params = {}
        if contact_type:
            params["type"] = contact_type
        logger.info("Listing Docketwise contacts (type=%s)", contact_type or "all")
        result = self._request("GET", "/contacts", params=params)
        return result if isinstance(result, list) else result.get("contacts", [])

    def update_contact(self, contact_id: int, contact_data: dict) -> dict:
        """Update an existing contact."""
        payload = {"contact": contact_data}
        logger.info("Updating Docketwise contact ID: %s", contact_id)
        return self._request("PUT", f"/contacts/{contact_id}", json=payload)

    def delete_contact(self, contact_id: int) -> dict:
        """Delete a contact by ID."""
        logger.info("Deleting Docketwise contact ID: %s", contact_id)
        return self._request("DELETE", f"/contacts/{contact_id}")


# ---------------------------------------------------------------------------
# Intake → Docketwise Mapper
# ---------------------------------------------------------------------------
def map_intake_to_docketwise(intake_data: dict) -> dict:
    """
    Convert LexFlow intake/client data into the Docketwise contact format.

    Expected input fields:
        firstName, lastName, email, phone,
        addressStreet, addressCity, addressState, addressZip
        (additional fields mapped where possible)
    """

    contact = {
        "first_name": intake_data.get("firstName", ""),
        "last_name": intake_data.get("lastName", ""),
        "email": intake_data.get("email", ""),
        "type": "Person",
    }

    # Phone number
    phone = intake_data.get("phone", "")
    if phone:
        contact["phone_numbers_attributes"] = [
            {"data": {"number": phone, "daytime": True}}
        ]

    # Address
    street = intake_data.get("addressStreet", "")
    city = intake_data.get("addressCity", "")
    state = intake_data.get("addressState", "")
    zip_code = intake_data.get("addressZip", "")

    if any([street, city, state, zip_code]):
        addr = {"physical": True}
        if street:
            addr["street_number_and_name"] = street
        if city:
            addr["city"] = city
        if state:
            addr["state"] = state
        if zip_code:
            addr["zip_code"] = zip_code
        contact["addresses_attributes"] = [{"data": addr}]

    return contact


# ---------------------------------------------------------------------------
# Convenience: push an entire LexFlow intake
# ---------------------------------------------------------------------------
def push_intake_to_docketwise(
    docketwise: DocketwiseClient,
    intake: dict,
) -> dict:
    """
    High-level function: takes a LexFlow intake dict, maps it to Docketwise
    format, creates the contact, and returns the result.
    """
    mapped = map_intake_to_docketwise(intake)
    contact = docketwise.create_contact(mapped)
    logger.info("Docketwise contact created: ID=%s", contact.get("id"))
    return contact


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Docketwise Integration CLI")
    parser.add_argument("--auth-url", action="store_true", help="Print the OAuth authorization URL")
    parser.add_argument("--exchange", metavar="CODE", help="Exchange an authorization code for tokens")
    parser.add_argument("--create-client", nargs=2, metavar=("FIRST", "LAST"), help="Create a test contact")
    parser.add_argument("--list", action="store_true", help="List all contacts")
    parser.add_argument("--from-lexflow", metavar="FILE", help="Import a JSON intake file into Docketwise")
    parser.add_argument("--refresh", action="store_true", help="Refresh the access token")

    args = parser.parse_args()

    auth = DocketwiseAuth()

    if args.auth_url:
        print("=" * 60)
        print("OAuth Authorization URL")
        print("=" * 60)
        print(auth.get_authorization_url())
        print()
        print("After authorizing, you'll receive a code at your redirect URI.")
        print("Pass it to: python docketwise-sync.py --exchange <CODE>")

    elif args.exchange:
        tokens = auth.exchange_code(args.exchange)
        print(json.dumps(tokens, indent=2))
        print("\n⚠ Save the refresh_token securely! It will NOT be shown again.")

    elif args.refresh:
        if not DOCKETWISE_REFRESH_TOKEN:
            print("ERROR: Set DOCKETWISE_REFRESH_TOKEN env var first.")
            sys.exit(1)
        new_token = auth.refresh_access_token()
        print(f"New access token: {new_token}")

    elif args.list:
        client = DocketwiseClient(auth)
        try:
            contacts = client.list_contacts()
            print(f"Found {len(contacts)} contacts:")
            for c in contacts:
                print(f"  [{c.get('id')}] {c.get('first_name')} {c.get('last_name')} — {c.get('email')}")
        except Exception as e:
            logger.error("Failed to list contacts: %s", e)
            print(f"\nHint: Set DOCKETWISE_REFRESH_TOKEN or re-authenticate.\nError: {e}")

    elif args.create_client:
        first, last = args.create_client
        client = DocketwiseClient(auth)
        try:
            result = client.create_contact({
                "first_name": first,
                "last_name": last,
                "email": f"{first.lower()}.{last.lower()}@example.com",
                "type": "Person",
            })
            print(f"Created contact: {json.dumps(result, indent=2)}")
        except Exception as e:
            logger.error("Failed to create contact: %s", e)
            print(f"\nHint: Authenticate first.\nError: {e}")

    elif args.from_lexflow:
        filepath = args.from_lexflow
        try:
            with open(filepath) as f:
                intake = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"ERROR reading {filepath}: {e}")
            sys.exit(1)

        client = DocketwiseClient(auth)
        try:
            result = push_intake_to_docketwise(client, intake)
            print(f"Created Docketwise contact ID: {result.get('id')}")
            print(json.dumps(result, indent=2))
        except Exception as e:
            logger.error("Failed: %s", e)

    else:
        parser.print_help()
