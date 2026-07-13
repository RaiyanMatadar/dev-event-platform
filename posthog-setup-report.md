<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for the Dev Event Platform. The following changes were made:

- **`instrumentation-client.ts`** — Created. Initializes posthog-js with the reverse-proxy host, error tracking (`capture_exceptions: true`), and debug mode in development. This file is automatically picked up by Next.js 15.3+ (instrumentation-client convention) for client-side initialization.
- **`next.config.ts`** — Updated. Added `rewrites` to proxy PostHog ingestion through `/ingest`, bypassing ad blockers. Added `skipTrailingSlashRedirect: true` for PostHog API compatibility.
- **`components/ExploreBtn.tsx`** — Updated. Added `posthog.capture("explore_events_clicked")` inside the button's click handler.
- **`components/EventCard.tsx`** — Updated. Added `"use client"` directive and `posthog.capture("event_card_clicked", { event_title, event_slug, event_location, event_date })` in a click handler on the `<Link>`.
- **`.env.local`** — Created. Stores `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the Explore Events CTA button on the homepage | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on a featured event card to view its details | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/509749/dashboard/1839117)
- **Insight** — [Explore Events clicks (wizard)](https://us.posthog.com/project/509749/insights/3ZDWKP1H)
- **Insight** — [Event card clicks by event (wizard)](https://us.posthog.com/project/509749/insights/HuDGLhYH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` (or any team bootstrap scripts) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
