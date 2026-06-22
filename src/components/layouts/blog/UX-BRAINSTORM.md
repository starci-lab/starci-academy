# Blog — UX brainstorm (2026-06-21)

> Re-imagine the `/blog` index (and detail) from data + first principles. Legacy = inventory only.
> NO code in this doc. After thầy picks a direction → `/starci-fe-ux-apply blog`.

## 0. Page & files
- Index route: `src/app/[locale]/blog/page.tsx` → `components/layouts/blog/BlogList`
- Detail route: `src/app/[locale]/blog/[slug]/page.tsx` → `components/layouts/blog/BlogPost`
- Data hooks: `modules/api/graphql/queries/query-blog-posts.ts`, `query-blog-post.ts`, types in `.../types/blog.ts`
- A blog FE already EXISTS (competent but generic). This is a redesign, not greenfield.

## 1. What data REALLY exists (BE/DB — grounded)
Backend repo: `D:\Repositories\starci-academy-backend`. Two public queries, **no mutations**.

### `blogPosts(category?, limit=12, offset=0)` — list
Offset pagination, hard cap 50, **fixed sort `publishedAt DESC`**, optional category filter. Per item:
`id, slug, title, excerpt?, category, coverImageUrl?, readingMinutes?, isPremium, publishedAt`. Body omitted.

### `blogPost(slug)` — detail (optional auth)
`+ body (markdown, locale-resolved), ctaUrl?, ctaLabel?, sourceUrl?, isPremium, isLocked, publishedAt`.
Premium gating: if `isPremium && !member` → body truncated to 600 chars + `isLocked=true`.

### 6 editorial pillars (`BlogCategory`)
`deep-dive` · `build-in-public` · `career` · `ai` · `case-study` · `codebase`.

### Reality checks that MUST shape the design
- **`coverImageUrl` is null on every real seed post.** Schema has it, content doesn't. → design must be **text-first**; use a cover only opportunistically when present, NEVER depend on it.
- **Very few posts** (2 seeded today, both `deep-dive`, both with `ctaUrl` → System Design course). → layout must look intentional at low volume AND scale to 50.
- **No author** relation (team-authored editorial). → no author avatars/bylines (Stripe/Medium pattern is out).
- **No tags, no search, no view counts, no comments.** Only real meta = `category · publishedAt · readingMinutes`.
- **Funnel intent is real:** every post carries `ctaUrl/ctaLabel` → a course. Blog = top-of-funnel SEO → courses.
- **Premium is real:** `isPremium`/`isLocked` paywall (reserved for build-in-public).
- Bilingual vi/en, locale-resolved server-side.

### Unused-but-available opportunities
- `isPremium` is in the LIST payload → can show a subtle "Members" tag on cards (currently underused).
- Detail has `sourceUrl` ("View on GitHub") + `ctaUrl` funnel — make these first-class, not afterthoughts.
- `blogPosts(category=X)` can power a **"More in {pillar}"** related strip on detail (real data, no new BE).

## 2. Legacy inventory (NOT design authority)
- **Index:** header + 7 category chips + 2-col **image-card grid** (MediaCard), `limit:24` hardcoded, no pagination.
- **Detail:** back link + header (chips/title/date/read) + cover + `MarkdownContent` body + members gate + sourceUrl btn + funnel CTA.
- **Pain:** image-card grid with all-null covers → sad empty boxes; 2 cards in a 2-col grid feels thin; no featured/anchor; no pagination/load-more; no related posts; empty state can't tell "no posts yet" from "none in this filter"; long body (~2000w) has no reading aid.

## 3. Refs (web-grounded — no blog ref in memory before this)
- **Vercel blog** — single-column, **text-first, zero cover images**, category tag + 1-line desc per post. Proof a coverless dev blog reads as deliberate. https://vercel.com/blog
- **Stripe blog** — category "departments" each with *View all*; but **image-forward + author photos** (assets we don't have). https://stripe.com/blog
- Smashing / Web Style Guide — typographic hierarchy carries the page when there's no imagery (contrast + whitespace + scale). https://www.smashingmagazine.com/2013/05/typographic-design-patterns-practices-case-study-2013/

## 4. Three directions (see widget mockup)
| Dir | Pattern | Ref | At 2 posts | At 50 posts | Verdict |
|-----|---------|-----|-----------|-------------|---------|
| **A** | Flat chronological text list | Vercel | thin, no anchor | great | runner-up |
| **B** | Pillar departments (section per category + view-all) | Stripe | **5/6 pillars empty → looks broken** | great (SEO) | premature |
| **C** | **Featured lead + typographic list + filter** | Vercel + editorial | intentional, has anchor | great | ✅ **CHỐT** |

### Recommendation: Direction C
A blend that takes Vercel's text-first scannability and adds ONE editorial anchor so the page never feels empty:
- It's the only option that degrades gracefully at today's 2-post volume **and** scales.
- B (pillar hub) is the right *eventual* shape for SEO topic-clusters, but only after each pillar has ≥2–3 posts. Treat it as a v2 once content fills out — not now.

## 5. New information architecture (Direction C)

### Index `/blog`
1. **Header (tier 2, H3)** — "Blog" + one-line subtitle. No breadcrumb (editorial, not `/learn`).
2. **Category filter** — `All` + 6 pillars as a scannable chip row. Re-keys SWR on change. (No counts — BE gives none; don't invent data.)
3. **Featured lead** — newest post (first of the filtered list), large + typographic: pillar/"Latest" eyebrow, serif-ish big title, excerpt, `date · N min`. No image dependency; if `coverImageUrl` present, show it, else pure type.
4. **List** — remaining posts as compact text rows: title (bold) + meta line `pillar · date · min` (+ excerpt 1 line on wider viewports). Optional small "Members" tag when `isPremium`.
5. **Load more** — offset pagination (`offset += limit`), since BE is offset-based. Hidden when returned < limit.
- States: skeleton mirrors lead+list rhythm; empty distinguishes **"no posts yet"** (unfiltered) vs **"nothing in {pillar}"** (filtered, offer "clear filter"); error = retry.

### Detail `/blog/[slug]`
1. Back link → `/blog`.
2. Header: pillar chip + (Members chip if premium), large title, meta `long date · N min`.
3. Optional cover (only if present).
4. **Body** via `MarkdownContent`. Add a thin top **reading-progress bar** (bodies ~2000w). On-this-page TOC = optional/secondary, only if headings exist (reuse lesson `OnThisPage` if cheap; don't over-build).
5. **Premium gate** (when `isLocked`): clear paywall card after the 600-char teaser → CTA to membership.
6. **`sourceUrl`** → "View on GitHub" secondary button (codebase posts).
7. **Funnel CTA** (`ctaUrl`/`ctaLabel`) → related course, prominent at article end (primary).
8. **"More in {pillar}"** — 2–3 related via `blogPosts(category)` minus current. Reinforces pillar + funnel; uses existing query.

## 6. Section → data map
| Section | Source field(s) |
|---------|-----------------|
| Filter chips | `BlogCategory` enum (static 6) |
| Featured lead | first item of `blogPosts` (title, excerpt, category, publishedAt, readingMinutes, coverImageUrl?) |
| List rows | `blogPosts[]` rest (+ `isPremium` → Members tag) |
| Load more | `blogPosts(offset+=limit)` |
| Detail header | `blogPost`: title, category, isPremium, publishedAt, readingMinutes |
| Reading-progress | client scroll over `body` |
| Premium gate | `isLocked` |
| GitHub btn | `sourceUrl` |
| Funnel CTA | `ctaUrl` + `ctaLabel` |
| More-in-pillar | `blogPosts(category=detail.category)` |

## 7. Cut / add
- **Cut:** image-dependent card grid (covers are null) → replace with text-first list; the thin 2-col grid feel.
- **Add:** featured lead anchor; load-more pagination; filter-aware empty state; reading-progress on detail; related "More in pillar"; first-class GitHub + funnel CTAs; subtle Members tag on premium cards.
- **Defer (v2):** Direction B pillar-hub once pillars fill; search; on-this-page TOC if posts get long/structured.

## 8. CHỐT (thầy duyệt 2026-06-21)
- **Featured lead = serif display title** (`var(--font-serif)`) — editorial moment; rest of app stays sans.
- **Pagination = load-more** (bump `offset`), not numbered pages. Lighter, fits early-stage volume.
- **"More in {pillar}" on detail = YES** — related strip via `blogPosts(category)` minus current.
→ Ready for `/starci-fe-ux-apply blog`.
