# Toronto Wedding 2028 extension

This fork integrates the Toronto Wedding workspace into [VowSuite](https://github.com/Gab8511/wedding-planning-studio), preserving its original guest, budget, vendor, and seating tools.

## What's included

- All money in VowSuite formatted as **CAD**. New blank wedding plans default to **150 guests**, **$55,000 CAD**, and **May 20, 2028** as a tentative date (not booked).
- A **Toronto Wedding** workspace in the sidebar for venue/package comparisons, food and beverage minimums, room rental, administration fees, HST, deposits, package/menu selections, and approximate travel times from Scarborough.
- Editable budget categories, a spring 2028 checklist, CSV venue exports, and separate JSON backup/import.
- Optional, confirmed transfer of a selected quote into the original VowSuite budget and vendor lists.

## Start using it

Serve the folder with `python3 -m http.server 4173` and open `http://localhost:4173`, or publish the **main branch** with GitHub Pages after reviewing/merging this change. Choose **Toronto Wedding** from the sidebar and **Start blank VowSuite plan** to avoid loading the fictional sample wedding.

**Important:** All quotes start empty. You must enter actual vendor quotes, and this feature does not check live venue availability.

## Ontario fee calculator

Default quote assumptions are **19% administration** and **13% HST**, both configurable *per venue*. The default model assumes the fee is charged on food and beverage and HST applies to the taxable subtotal including that fee. Contract language can differ: confirm minimums, service fees, tipping, HST treatment and whether costs are tax-inclusive before committing. The extension presents detailed estimated totals to prevent missing fees.

**Avoid double counting:** If you transfer a fully loaded venue quote to VowSuite, set the original Budget screen's global tax, service, and tip percentages to zero for those already-taxed items. VowSuite's original global finance model applies rates broadly.

## Data and privacy

- The added Toronto workspace stores information in browser `localStorage` under `vowsuite-toronto-v1`, separately from VowSuite's existing `vowsuite-plan-v2` data.
- Export **both** VowSuite's plan and the Toronto JSON backup for a complete backup. Browser storage can be cleared, so save backups regularly.
- Do **not** use the upstream project's example Supabase policies for real guest, contract, or financial information: the provided example grants broad access without strong user authentication.
- This extension does not fetch Toronto venues, send emails, or upload your data.
- Changing couples inside the original VowSuite app does not automatically switch the Toronto workspace; it is one Toronto workspace per browser profile.

## Publishing

1. Review and merge the pull request to `main`.
2. On your GitHub fork, open **Settings → Pages**. Choose **Deploy from a branch** → **main** → **/(root)** and Save.
3. Wait for GitHub Pages to publish; the public site address is usually `https://mking-a.github.io/wedding-planning-studio/`.
4. Use the site for non-sensitive planning data until account-based private storage is configured.

Original project: © 2026 Gab8511, MIT License. Toronto enhancement: MIT; see the original LICENSE.
