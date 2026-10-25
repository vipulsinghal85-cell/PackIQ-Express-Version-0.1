# PackIQ Express v0.2 — Custom Questionnaire Builder

## Deploy safely
1. **Back up** your current GitHub repository and Supabase database. Do not delete existing tables.
2. Open your **existing** Supabase project → SQL Editor → New query. Paste and run `supabase/migration_v0_2.sql` **before deploying the new app**.
3. Copy this project into your **existing** GitHub repository (replace/update matching files; do not create a new Supabase or Vercel project). Commit to the branch Vercel deploys.
4. Vercel will build and deploy. Existing environment variables are unchanged.
5. Open `https://packiqexpress.vercel.app/admin`, enter your existing admin token, and click Load studies.
6. Click **Questionnaire builder** on a study. Enter the token, **Load saved questionnaire**, edit questions, **Save draft**, then **Publish**.
7. Open that study's **Public survey** in a private/incognito window. Submit a test response. Use **Custom results** to view results and export CSV.

## Important behavior
- Existing studies with no published custom questionnaire keep using the original v0.1 survey and results.
- Custom questionnaire responses are stored in a NEW `questionnaire_responses` table; they do not appear in the old `Live results` page. Use `Custom results` instead.
- Question IDs are stable when editing existing questions. Deleting/recreating a question creates a new ID.
- Publishing creates a new version, but this first upgrade does **not** retain full historical questionnaire definitions. Export data before significant questionnaire changes. Do not modify a live questionnaire during fieldwork; create a new study instead.
- This is a pilot, not a commercial survey platform. Admin token access must be replaced with real authentication. Avoid sensitive personal data. Conditional display is supported for earlier choice questions only.
- The `Custom results` page calculates descriptive metrics; no statistical significance testing is claimed.
- The pilot uses an admin token. Never share the token or a results URL containing it.

## AI Questionnaire Designer (included)
1. In Vercel → Project → Settings → Environment Variables, add `OPENAI_API_KEY` as a **secret** for Production (and Preview if needed). Use an API key from your own OpenAI API account with billing enabled. Do **not** prefix it with `NEXT_PUBLIC_` or commit it to GitHub.
2. Optionally set `OPENAI_MODEL` (default: `gpt-4o-mini`). Redeploy.
3. Open a study → Questionnaire Builder, enter the existing Admin Setup Token, type a research brief (at least 20 characters), choose 3–25 questions, and click **Generate AI questionnaire**.
4. Review and edit the draft, **Save draft**, then **Publish** when ready. Generation replaces only the unsaved questions in the browser editor after confirmation; it does not alter database data until you save/publish.
5. AI requests incur API charges. Generation uses a 25-second timeout, validates the output, and does not send respondent answers to OpenAI.

**Scope:** AI-generated questionnaire drafts only. AI results interpretation and verbatim coding are not included in this ZIP.
