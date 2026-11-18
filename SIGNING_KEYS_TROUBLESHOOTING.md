# Shared API: signing key troubleshooting

If your browser opens the official team's /cdn-cgi/access/certs URL and displays JSON keys, but the Pages Function reports KEYS_FETCH_FAILED or KEYS_HTTP_403, the team domain may already be correct. The Worker-side fetch is distinct from the browser request.

This update sends an explicit application User-Agent, rejects unexpected redirects, validates the JWK response, and returns a distinct fetch, HTTP, redirect or JSON error. It continues to validate JWT issuer, audience, expiry, RSA signature and approved email.

## Temporary emergency fallback (only if normal retrieval still fails)

In your own Cloudflare dashboard, open the exact configured TEAM_DOMAIN followed by /cdn-cgi/access/certs. Confirm the HTTPS address is your real Cloudflare Access team endpoint. Copy the complete JSON response from your browser.

Under your Pages project's **Production** Variables and Secrets:
- ACCESS_JWKS_FALLBACK: paste the verified endpoint's complete JSON response as Text.
- ACCESS_JWKS_FALLBACK_UNTIL: an explicit UTC ISO 8601 timestamp no more than 48 hours in the future (choose a 24-hour window).

Redeploy. The fallback is used ONLY if live key retrieval fails, and ONLY for a matching key ID. It is not a private key or a bearer token, but its integrity is critical. Never accept a key set from an untrusted person or request. A successful live retrieval takes precedence, even if the key ID is missing. The fallback does not bypass token or email checks.

This is a temporary mitigation, not an operational key rotation strategy. A freshly copied signing key may become obsolete or be revoked during the fallback period. Remove both fallback variables when normal key fetching is restored; never renew indefinitely. If they expire, the API fails closed. Keep wedding data backed up and do not disable Cloudflare Access.

For persistent problems, open the Pages deployment details, then Functions, and reproduce the error while viewing live logs. Contact Cloudflare support with the exact diagnostic and deployment details. Do not share authentication cookies or JWTs.
