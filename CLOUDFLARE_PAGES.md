# Fix Cloudflare: "functions directory" / Wrangler Worker migration error

The error **"Automatic configuration cannot migrate Pages Functions to Workers yet"** occurs because Cloudflare is running a **Workers** deployment (typically `wrangler deploy`) against this **Cloudflare Pages Functions** repository.

The shared database API lives at `functions/api/shared.js` and **must run server-side as a Pages Function**. Do not delete it or publish it as a static file.

## Recommended deployment: Cloudflare Pages (Git integration)

1. Open **Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git**. If your existing project is listed as **Worker** rather than **Pages**, create a new **Pages** project. A Worker project will not become a Pages project just by changing its build command.
2. Select GitHub repository **MKING-A/wedding-planning-studio**, branch **main**.
3. In Pages build settings select **Framework preset: None**, **Root directory: /**, **Build command: `npm run build`**, **Build output directory: `dist`**.
4. Do not use `wrangler deploy`. For a Pages Git integration, Cloudflare deploys Pages automatically after the build. If deploying manually through the CLI instead, use `npx wrangler pages deploy dist --project-name <YOUR-PAGES-PROJECT-NAME>`.
5. Once the Pages site deploys, go to **Settings → Bindings** on the **new Pages project**, bind your existing **D1** database with variable name `DB`.
6. Under **Settings → Variables and Secrets** on the Pages project, add the same `TEAM_DOMAIN`, `POLICY_AUD`, `WRITER_EMAILS` and optional `READER_EMAILS` that are documented in [SHARED_DATA_SETUP.md](SHARED_DATA_SETUP.md). Do not put the actual values in GitHub.
7. Protect the Pages domain and any custom domain/preview with **Cloudflare Access**. The Access application audience (`POLICY_AUD`) must match the protected domain's Access application. Keep the old Worker or custom-domain routing untouched until the new Pages site is tested, then switch any custom domain deliberately.
8. Redeploy after updating the D1 binding and variables. Open the protected Pages website, sign in and select **Shared plan**.

### Expected repository layout

- `index.html`, CSS and browser JavaScript are the source website files.
- `scripts/build-pages.mjs` copies **only seven website files** to `dist/`.
- `functions/api/shared.js` stays at the repository root and is compiled by **Cloudflare Pages**, not uploaded as a website asset.
- `db/`, documentation, credentials and GitHub configuration are not copied to `dist/`.

### How to check

- The build logs should show `Cloudflare Pages: copied 7 static files into dist/`.
- A successful **Pages** deployment should no longer try to auto-migrate `functions/` to a Worker.
- With Cloudflare Access enabled, open the private website. The `Shared plan` tab should call `/api/shared`. A JSON response showing a role or a clear configuration error (503) indicates the Function was deployed. A 404 typically indicates Pages Functions were not deployed.
- Until you have verified Access + D1 storage end-to-end, do **not** enter real guest/contact/financial data.

### What not to do

- Do **not** delete `functions/` to silence the error; that would disable shared editing.
- Do **not** add `wrangler deploy` as the deployment command for Pages Functions.
- Do **not** deploy the repository root (`.`) as all website assets; doing so risks exposing code/documentation that should not be publicly served. Use the `dist` build output.
- If you intentionally want to remain on **Workers**, that requires a separate migration of the Pages Function to a Worker entry point and explicit assets and D1 configuration. This PR deliberately stays with Pages.

Official docs:
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Pages Functions getting started](https://developers.cloudflare.com/pages/functions/get-started/)
- [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
