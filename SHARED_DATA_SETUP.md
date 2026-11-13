# Private collaborative wedding planning (Cloudflare Access + D1)

This feature syncs BOTH VowSuite's original plan and the Toronto venue workspace into one Cloudflare D1 record for invited users. The GitHub source can remain public; no guest data is stored in GitHub.

## Prerequisites

- Cloudflare Pages **connected to this GitHub repository** via Git integration (not a Direct Upload-only Pages project).
- The Cloudflare Pages site is protected by a Cloudflare Access application that only allows the invited people. **Protect every site hostname** (your custom domain, main pages.dev hostname, and any accessible previews). Disable the old public GitHub Pages site.
- This branch merged into the GitHub repository's main branch.

## One-time Cloudflare setup

1. Go to **Cloudflare dashboard → Storage & databases → D1 SQL database → Create database**. Name it "wedding-planner-db".
2. Open the database → **Console**. Paste the complete contents of [db/schema.sql](db/schema.sql) and click **Execute**. Do not add real guest information to this console manually.
3. Go to **Workers & Pages → your existing Pages project → Settings → Bindings → Add → D1 database**. Set **Variable name** exactly **DB** and choose your new "wedding-planner-db" database. This binding is for the Production environment. Add to Preview only if those preview deployments are also safely Access-protected.
4. In your Pages project → **Settings → Variables and Secrets**, add the following **Production** variables:
   - **TEAM_DOMAIN** = https://YOUR-TEAM.cloudflareaccess.com (the full Access team domain, with https://, no trailing slash).
   - **POLICY_AUD** = the **Application Audience (AUD) tag** from **Zero Trust → Access controls → Applications → your wedding planner application → Edit → Additional settings**.
   - **WRITER_EMAILS** = comma-separated verified email addresses allowed to edit, for example alice@example.com,bob@example.com. Include your own actual sign-in email here.
   - **READER_EMAILS** = optional comma-separated addresses allowed to view but not save.
5. In **Cloudflare Zero Trust → Access controls → Applications**, update your website's **Allow** policy so it includes only these same approved email addresses. For new members, add an email to the Access policy AND to one of the two environment variable lists. If you remove a user, remove them from BOTH lists and revoke their session if needed.
6. **Redeploy your Pages project** from the latest main branch so the new server Function and D1 binding are active.
7. Open the protected website, sign in with an allowed email, and select **Shared plan** in the left sidebar.

The server refuses ALL requests until its D1 binding and required Access configuration are present. It validates Cloudflare Access's signed token and application audience, then checks its own email allowlist. It never trusts user-supplied email headers or client-side roles.

### First person: initialize the shared plan

1. Open the **Toronto Wedding** workspace; use **Start blank VowSuite plan** if your browser still shows the fictional sample wedding.
2. Enter the basic details and export a backup from the original VowSuite app AND the Toronto workspace as a precaution.
3. Open **Shared plan**. After Cloudflare connects, click **Start sharing this browser's plan**. Confirm. This creates cloud revision 1.
4. The status message should say "Saved to shared cloud" and show revision 1. Changes are now automatically saved about every 6.5 seconds while this browser remains open.

### Everyone else: load the shared copy

1. Get invited in **Cloudflare Access**, and be included in WRITER_EMAILS or READER_EMAILS.
2. Open the private website and sign in with your own email.
3. Open **Shared plan** and click **Load shared plan**. Your existing local plan is first downloaded as a JSON backup.
4. Changes will save automatically for editors and refresh automatically on other open devices. Viewers can read but cannot save changes.

### Safeguards and limitations

- **Edit collisions:** The API uses a monotonically increasing revision and an atomic update. The second simultaneous save is blocked with HTTP 409; it never silently overwrites the first editor's data. To resolve: download the local backup, inspect or copy the differences, then **Load shared plan** and re-enter or merge changes manually. Automatic field-by-field merging is not provided.
- **Local first:** When you open the app on a new browser, it does not automatically overwrite its saved local plan. Explicitly select **Load shared plan** once. In subsequent visits you must select it again; this avoids unexpected replacement of unsaved local edits.
- **Original cloud sync:** Do not configure the legacy VowSuite Supabase synchronization panel. Its example permissions are unsafe for private guest data, and it is separate from this feature. Disable "Auto-push" if previously enabled.
- **One wedding:** The database contains **one** shared wedding, not separate projects for each couple. Change or reset it deliberately.
- **Not realtime:** Automated save checks run every ~6.5 seconds and remote update checks every ~18 seconds. Editing simultaneously can trigger a conflict. Only the browser with an enabled shared plan performs synchronization.
- **Backup:** Export both original and Toronto plans. D1 retains the current shared copy; this feature is not a substitute for versioned offsite backups or compliance reviews.
- **Transport:** Use HTTPS behind Access. Disabling Access or publishing the site publicly exposes its static HTML but not the private data, because the /api/shared endpoint rejects unsigned or unauthorized requests.
- **Storage:** Sync stores guest names, emails, phone numbers, quote/contract notes, and budgets in Cloudflare D1. Obtain consent from the couple and follow your privacy obligations before adding personal information. Do not paste Access tokens, API keys or private data into GitHub.

## Troubleshooting

- **"Shared storage is not configured yet"**: Confirm the binding is called exactly DB; TEAM_DOMAIN, POLICY_AUD and WRITER_EMAILS are present in Production; and you redeployed.
- **"Access denied"**: Check the signed-in person's email in the Access policy and the correct WRITER_EMAILS or READER_EMAILS entry. Verify TEAM_DOMAIN and POLICY_AUD refer to the same protected site.
- **404 on /api/shared**: The Cloudflare Pages project must be Git-connected with the /functions directory at the repository root; recheck deployment logs and output directory.
- **Authentication HTML instead of JSON**: Open the private site's homepage and sign in first, rather than calling the endpoint from an unauthenticated browser.
- **Conflict after concurrent editing**: Download backup, load shared, then re-enter intended changes.
- **Site still publicly accessible**: Restrict all hostnames via Cloudflare Access and unpublish GitHub Pages. Database API will nevertheless require a verified JWT.
- **"Invalid request origin"**: Make changes from the website's own page; the sync endpoint rejects cross-origin modifications.

## References

- [Cloudflare Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Cloudflare D1 create database and Console](https://developers.cloudflare.com/d1/get-started/)
