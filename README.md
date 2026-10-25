# PackIQ Express — GitHub-ready pilot

A minimal working **two-pack independent monadic** research prototype. Researcher creates a study, receives a public survey URL, respondents are assigned to a pack, and descriptive results refresh every 10 seconds.

## Included
- Researcher study creator (pilot shared setup token)
- Two packaging cells, optional publicly hosted image URLs
- Least-filled-cell assignment with randomized ties (best-effort, not transactional)
- Five-point appeal and purchase intent, open-ended likes/improvements
- Mobile survey, one response per issued session
- Live descriptive results, top-box/means, CSV export
- Supabase SQL schema and GitHub Actions build validation

## Not included yet
Professional login, secure organization accounts, image upload, response quotas, durable randomization under concurrency, bot protection, respondent privacy controls, statistical tests, AI interviewing, AI summaries, visual annotations, payments, or production compliance. **Do not use for confidential client work or production research.**

## Deploy entirely from an Android phone
1. Extract ZIP on phone. Open github.com in browser and create a new repository. Upload extracted files, preserving folders (GitHub web upload may be cumbersome; a mobile Git client or Codespaces can help).
2. At supabase.com create a project. Open SQL Editor and run `supabase/schema.sql`.
3. In Supabase Project Settings > API, copy the project URL, anon/publishable key and **service_role secret**. Never place the service role secret in public files or `NEXT_PUBLIC_` variables.
4. At vercel.com import your GitHub repository. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and a long random `ADMIN_SETUP_TOKEN` in Vercel project environment variables. `OPENAI_API_KEY` is reserved for a future version and not needed.
5. Deploy. Open `/admin`, enter the setup token, create a study, copy `/s/<slug>` for respondents and view `/results/<slug>` for descriptive analysis.
6. Test both pack assignments and response collection with dummy data before inviting participants.

## Local development
`npm install` then copy `.env.example` to `.env.local`, fill values, run `npm run dev`.

## Research limitations
This pilot uses independent monadic exposure and **does not** test statistical significance. The allocation is best-effort and may drift under simultaneous traffic. Social recruitment yields self-selected samples. Top-box is defined as 5 on a five-point scale. For professional use, implement sample controls, prespecified action standards, power calculations, statistical tests, audited randomization, secure accounts, versioning and consent.

## Security warning
The researcher token is passed in the results URL in this pilot, which can leak through browser history or sharing. Treat it as a private prototype only; replace it with session-based authentication before any real client launch. Public survey endpoints need rate limiting and abuse prevention.
