# Proposal — Skills Graph (canonical taxonomy, cross-source mastery)

> Layout brainstorm 2026-07-18. Thầy chốt **Option D — Full BE taxonomy**. Feature nặng, ĐA-PHASE.
> Prototype: `.artifacts/prototypes/skills-graph/index.html` — host :8088. Marker verified.
> Deep-scan trần dữ liệu: 2 Explore agent (FE+BE) — kết luận dưới.

## Vì sao cần BE taxonomy (trần dữ liệu — CHỐT)
Các nguồn **KHÔNG chung tag vocabulary**, KHÔNG join được hôm nay:
| Nguồn | Tín hiệu | Khoá | Trạng thái |
|---|---|---|---|
| **Flashcard** | per-tag **retention** + coverage (`user_flashcard_course_stats_projection`) | tech-tag free-form ("NestJS") | ✅ persist, skill-keyed THẬT |
| Coding-problem | `byDomain` solved-count | `CodingDomain` enum (arrays/dp) | keyspace khác |
| Mock interview | phase/kind/**attribute** + weakTags flat | rubric literal | KHÔNG tag; content chỉ nối qua RAG `matchedContentId` |
| **Challenge + content** | score/difficulty | **0 tag** (entity không có cột tag) | cần THÊM schema |
| Milestone/capstone | task score/passed | **0 tag** | cần THÊM schema |

→ Muốn "skills graph gen từ MỌI nguồn" phải dựng **canonical skill taxonomy + back-tag + normalize + projection cross-source**. Hạ tầng compute SẴN (Kafka CDC + `AbstractProjectionListener`, mọi projection đã theo mẫu này).

## Data model (BE — nền tảng, xây trước)
1. **`skills` entity (canonical)** — `id, key(slug), name(vi/en), domain(enum: backend/databases/system-design/devops/frontend/…), parent_skill_id (hierarchy → edge graph), description`. + `skill_edges` (skillId↔relatedSkillId, kind: prerequisite|related) cho cạnh graph.
2. **Back-tag nguồn** (M:N tới `skills`):
   - `content_skills` / `challenge_skills` (thêm cột/bảng nối — challenge/content HIỆN không có tag).
   - Coding: map `CodingDomain` enum → skillId (bảng map tĩnh).
   - Flashcard: **normalize** `weak_tags` free-text → skillId (bảng `flashcard_tag_skill_map` + fallback "chưa map").
   - Interview: map rubric attribute/phase + weakTags → skill (một phần là skill topic, một phần là năng lực-ngang rubric → xem §Ghi chú).
3. **`user_skill_mastery_projection`** (per enrollment, jsonb) — `skills: [{ skillId, mastery(0-100), evidenceCount, bySource: { flashcard, coding, interview, challenge, milestone } (nullable mỗi nguồn), lastUpdated }]`. **Mastery = blend có trọng số** các nguồn map vào skill đó (flashcard retention + coding solved-normalized + interview score + challenge pass% + milestone score). CDC listener trên `flashcard_*`, `coding_submissions`, `mock_interview_attempts`, `user_challenge_submission_attempts`, `user_milestone_task_attempts` → recompute.
4. **Query** `mySkillGraph(courseId?)` → nodes (skill+mastery+bySource) + edges (skill relationships). Course-scoped hoặc all-course (thầy chốt scope).

## FE — surface Skills Graph
- **Route/shell:** page-level `/vi/skills` (hoặc profile tab) — `PageHeader` + breadcrumb + graph canvas + side detail panel. JOB = KHÁM PHÁ/duyệt bản đồ năng lực → shell canvas 2-pane (graph + panel), mobile → stack (graph trên, panel dưới khi chọn).
- **Graph block MỚI `SkillGraph`** (dùng `@xyflow/react` — hạ tầng node/edge/layout tái từ MindMap): node = skill (màu theo mastery: <40 đỏ / 40-70 vàng / >70 xanh; size theo evidenceCount), cụm theo domain (background zone), cạnh = skill edges. Không auto-forward, click node = chọn.
- **Detail panel (select):** skill name + mastery gộp + **breakdown theo NGUỒN** (`ProgressMeter`/bar mỗi nguồn, nguồn không đóng góp = "—") + CTA **"Luyện skill này"** deep-link tới nguồn YẾU NHẤT (flashcard deck / coding / interview phase — mang Ý ĐỊNH, [[content-linking]]).
- **State-matrix:** rỗng (chưa có mastery nào — mời học, phễu khóa) · sparse (ít skill → graph nhỏ, không giả to) · loading (skeleton canvas) · node chưa map nguồn nào (ẩn / "chưa đủ dữ liệu").

## Build matrix (ĐA-PHASE — thứ tự BE trước, FE sau)
| Phase | Việc | Loại |
|---|---|---|
| **1** | `skills` + `skill_edges` entity + seed canonical taxonomy (per khóa, từ tag flashcard hiện có + domain coding + rubric) | 🟠 schema + seed |
| **2** | Back-tag: `content_skills`/`challenge_skills` + coding-domain-map + `flashcard_tag_skill_map` (normalize free-text) | 🟠 schema + data-map (nặng nhất — cần map thủ công/AI-assist tag→skill) |
| **3** | `user_skill_mastery_projection` + CDC listeners + mastery blend formula | 🟠 aggregate-BE (mẫu projection sẵn) |
| **4** | Query `mySkillGraph` + FE `SkillGraph` block + page + panel + CTA | 🟢 FE (sau khi BE có data) |

## Files to touch (khởi điểm)
- BE: `src/modules/databases/.../skill.entity.ts` (+edges, +M:N nối) · seed script · `projections/user-skill-mastery/*` (entity+listener+service) · query `mySkillGraph`.
- FE: `blocks/graph/SkillGraph` (mới, @xyflow) · `app/[locale]/skills/page.tsx` · `features/skills/SkillsGraphPage` + detail panel · i18n `skills.*`.

## Component → Storybook
| Component | Story | Mới/Sửa | State |
|---|---|---|---|
| `SkillGraph` | `SkillGraph.stories` | **MỚI** | mastery-mix (weak/mid/strong) · sparse · empty · node-selected |

## Verify
BE: seed + projection recompute qua scratch (mẫu stats-insight) → row có skills+mastery thật. FE: tsc/eslint + đi state-matrix (empty/sparse/loaded/select) + mobile stack.

## Ghi chú cần thầy chốt tiếp (trước Phase 1)
1. **Scope mastery:** per-COURSE (như job-readiness) hay ALL-COURSE gộp? (graph 1 khóa vs toàn hồ sơ).
2. **Interview rubric (communication/structuredThinking/tradeoffAwareness) = "skill" ngang hay để riêng?** — nó là năng-lực-ngang, không phải topic. Đề xuất: 1 cụm "Kỹ năng mềm/tư duy" riêng, tách khỏi topic-skills.
3. **Back-tag Phase 2** — map flashcard-tag→skill + tag challenge/content: làm tay hay AI-assist (workflow gen mapping rồi thầy duyệt)? Đây là phần nặng + quyết chất lượng graph.
4. **Mastery blend formula** — trọng số mỗi nguồn (flashcard retention vs coding volume vs interview score…) cần thầy tune.

## Nguồn tham khảo
- FE data-ceiling: `OverviewChallengeSkills`, `TopicMasteryGrid`, `user-coding-skills.ts`, `my-flashcard-review-stats.ts` (weakTags), `MockInterview/types.ts` (phase/attribute), `MindMap` (@xyflow infra), `package.json` (@xyflow ^12.10.2, recharts ^3.8.1).
- BE data-ceiling: `flashcard-card.entity.ts:150` (tags jsonb), `user-flashcard-course-stats-projection` (weakTags/quizByTag), `coding-problem.entity.ts:90` (CodingDomain), `mock-interview-attempt.entity.ts` (phase/attribute), `challenge.entity.ts`/`content.entity.ts` (KHÔNG tag), `AbstractProjectionListener` (CDC infra), `JobReadinessService` (per-course composite tham chiếu).
