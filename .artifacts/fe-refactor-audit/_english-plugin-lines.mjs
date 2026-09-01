/**
 * Replace every remaining Vietnamese-bearing line in plugins/eslint/index.mjs
 * with an English equivalent (comments + docs.description).
 */
import { readFileSync, writeFileSync } from "node:fs"

const path = "plugins/eslint/index.mjs"
const lines = readFileSync(path, "utf8").split(/\r?\n/)

const map = new Map([
    [
        "// ── tier map dùng chung — suy tier từ ĐƯỜNG DẪN FILE, không phải nội dung ──",
        "// ── shared tier map — derive tier from FILE PATH, not contents ──",
    ],
    [
        "// vocabulary: atoms/frames/composites (bọc vendor + ghép leaf, không quyết layout/data).",
        "// vocabulary: atoms/frames/composites (wrap vendor + compose leaves; no layout/data decisions).",
    ],
    [
        "// sentence: blocks/pages/layouts/overlays (ghép câu, không tự vẽ hình/gọi data).",
        "// sentence: blocks/pages/layouts/overlays (compose sentences; do not draw shapes or fetch).",
    ],
    [
        "// Không còn nhà tạm: `features`, `starci`, `modals(v2)`, `drawers(v2)`, `pallettes` đã rỗng và",
        "// Temporary homes (`features`, `starci`, `modals(v2)`, `drawers(v2)`, `pallettes`) are empty and",
    ],
    [
        "// bị xoá, nên bốn tên dưới đây là TOÀN BỘ tầng câu — thêm một thư mục mới cạnh chúng là lách cổng.",
        "// deleted, so the four names below are the FULL sentence tier — a new sibling directory bypasses the gate.",
    ],
    [
        "// Bất cứ gì NGOÀI `src/components/**` (route app/, hook, module) KHÔNG PHẢI 1 component tier —",
        "// Anything OUTSIDE `src/components/**` (app routes, hooks, modules) is NOT a component tier —",
    ],
    [
        "// mỗi rule dùng helper này tự nói rõ trong comment nó bỏ qua phạm vi đó hay không.",
        "// each rule using this helper says in its comment whether it skips that scope.",
    ],
    [
        "// fractional KHÔNG BAO GIỜ đúng thang → bắt chắc, 0 false-positive.",
        "// fractional is NEVER on-scale → exact match, zero false-positives.",
    ],
    [
        "    docs: { description: \"Cấm ≥2 <Chip> kề nhau trong 1 cụm — 1 cụm meta tối đa 1 chip. [[enforcement L3]]\" },",
        "    docs: { description: \"Ban ≥2 adjacent <Chip> siblings in one cluster — one meta cluster max one chip. [[enforcement L3]]\" },",
    ],
    [
        "// L2 — header anatomy: cấm escape-hatch `titleClassName` (nâng header modal thành hero/H-scale).",
        "// L2 — header anatomy: ban the `titleClassName` escape hatch (promotes modal header to hero/H-scale).",
    ],
    [
        "    docs: { description: \"Cấm prop titleClassName trên Modal/Shell — header = Typography body semibold default. [[enforcement L2]]\" },",
        "    docs: { description: \"Ban titleClassName on Modal/Shell — header stays Typography body semibold default. [[enforcement L2]]\" },",
    ],
    [
        "// L2b — hero heading class: text-{xl,2xl,3xl} + font-bold trên 1 element = heading hand-roll → Typography.",
        "// L2b — hero heading class: text-{xl,2xl,3xl} + font-bold on one element = hand-rolled heading → Typography.",
    ],
    [
        "    docs: { description: \"text-xl+/font-bold hand-roll = heading → dùng <Typography type>. [[enforcement L2/L6]]\" },",
        "    docs: { description: \"text-xl+/font-bold hand-roll = heading → use <Typography type>. [[enforcement L2/L6]]\" },",
    ],
    [
        "// L4b/token — arbitrary Tailwind value = thoát token-system. Tailwind v4 sinh spacing bằng calc",
        "// L4b/token — arbitrary Tailwind value escapes the token system. Tailwind v4 emits spacing via calc",
    ],
    [
        "// (không prune-enum được), nên chặn \"cửa hậu\": `gap-[7px]` (ngoài scale) + `text-[#hex]` (ngoài semantic color).",
        "// (cannot prune-enum), so block the backdoor: `gap-[7px]` (off-scale) + `text-[#hex]` (off semantic color).",
    ],
    [
        "// 'warn' — có ca hợp lệ (vd % / px canh chỉnh, brand hex) → dùng eslint-disable + lý do.",
        "// 'warn' — some cases are valid (e.g. % / px alignment, brand hex) → eslint-disable + reason.",
    ],
    [
        "    docs: { description: \"Cấm arbitrary spacing/hex-color (thoát token-system). [[enforcement token]]\" },",
        "    docs: { description: \"Ban arbitrary spacing/hex-color (token-system escape). [[enforcement token]]\" },",
    ],
    [
        "// structure-and-naming §5 + \"tên hàm phải là arrow\": mọi hàm module-level là `const X = () => {}`,",
        "// structure-and-naming §5 + \"functions are arrows\": every module-level function is `const X = () => {}`,",
    ],
    [
        "// KHÔNG `function` declaration / `export default function`. Bắt FunctionDeclaration ở top-level.",
        "// NOT a `function` declaration / `export default function`. Flag top-level FunctionDeclaration.",
    ],
    [
        "// atom layer = bọc vendor 1 LẦN (atom-layer-heroui-wrappers). Import @heroui/react thẳng ở sentence",
        "// atom layer = wrap vendor ONCE (atom-layer-heroui-wrappers). Direct @heroui/react import at sentence",
    ],
    [
        "// tier = 1 block tự quyết lại appearance mà atom đã chốt — bỏ qua atom, chồng nguồn sự thật hình dạng.",
        "// tier = a block re-deciding appearance the atom already fixed — bypasses the atom, splits shape truth.",
    ],
    [
        "// CHỈ áp cho file dưới `src/components/**` (sentence tier); ngoài src/components/ (route, hook, module)",
        "// ONLY applies under `src/components/**` (sentence tier); outside src/components/ (route, hook, module)",
    ],
    [
        "// KHÔNG bị rule này soi — false-positive-risk: 1 hook/route import @heroui/react thẳng lọt lưới.",
        "// is out of scope — otherwise a hook/route direct @heroui/react import would be a false positive.",
    ],
    [
        "// call site, invisible to every other screen that will need the same thing.\" Ở sentence tier, prop",
        "// call site, invisible to every other screen that will need the same thing.\" At sentence tier, a",
    ],
    [
        "// className/classNames (hoặc kế thừa WithClassNames<…>) mở lại cửa hậu đó — đóng bằng cách đẩy khác",
        "// className/classNames prop (or WithClassNames<…>) reopens that backdoor — close it by pushing the",
    ],
    [
        "// biệt xuống 1 tier, nơi nó có TÊN (1 composite/variant mới). CHỈ áp sentence tier.",
        "// difference down one tier where it has a NAME (new composite/variant). Sentence tier only.",
    ],
    [
        "    docs: { description: \"Sentence tier không nhận prop className/classNames — cửa hậu che khác biệt gọi nơi khác. [[canon BLOCK-4]]\" },",
        "    docs: { description: \"Sentence tier must not take className/classNames — that backdoor hides a difference that belongs elsewhere. [[canon BLOCK-4]]\" },",
    ],
    [
        "// BLOCK-5: composing a class string (\"cn(\") là quyết hình dạng — việc của tier dưới (composite/atom).",
        "// BLOCK-5: composing a class string (\"cn(\") is a shape decision — the lower tier's job (composite/atom).",
    ],
    [
        "// `cn(` xuất hiện ngoài vocabulary tier đọc là \"thiếu 1 composite, hoặc composite có sẵn thiếu variant\".",
        "// `cn(` outside vocabulary tier reads as \"missing a composite, or an existing composite missing a variant\".",
    ],
    [
        "// CHỈ áp sentence tier (ngoài src/components/ — hook/lib định nghĩa `cn` chính nó — KHÔNG bị soi;",
        "// Sentence tier only (outside src/components/ — hooks/libs that define `cn` itself — not scanned;",
    ],
    [
        "// false-positive-risk: `cn(` trong 1 hook/util ngoài components lọt lưới, chấp nhận để giữ precision).",
        "// false-positive risk: `cn(` in a hook/util outside components; accepted to keep precision).",
    ],
    [
        "    docs: { description: \"Gọi cn(...) chỉ hợp lệ ở tier vocabulary — tier trên compose bằng composite có sẵn. [[canon BLOCK-5]]\" },",
        "    docs: { description: \"cn(...) is only valid at the vocabulary tier — upper tiers compose via existing composites. [[canon BLOCK-5]]\" },",
    ],
    [
        "// fe-asynccontent-4branch-retired: AsyncContent (bare, 4-nhánh) + EmptyContent/ErrorContent = bộ",
        "// fe-asynccontent-4branch-retired: AsyncContent (bare, 4-branch) + EmptyContent/ErrorContent = the",
    ],
    [
        "// wrapper đã NGHỈ HƯU — thay bằng isSkeleton thread xuống từng leaf + AsyncContentEmpty/AsyncContentError.",
        "// retired wrapper set — replace with isSkeleton threaded to each leaf + AsyncContentEmpty/AsyncContentError.",
    ],
    [
        "// Global — áp cho MỌI file (kể cả ngoài src/components/), vì import retired có thể lọt ở bất cứ đâu.",
        "// Global — applies to EVERY file (including outside src/components/), because retired imports can land anywhere.",
    ],
    [
        "    docs: { description: \"Cấm AsyncContent (bare) + EmptyContent/ErrorContent — bộ 4-nhánh đã retired. [[canon fe-asynccontent-4branch-retired]]\" },",
        "    docs: { description: \"Ban AsyncContent (bare) + EmptyContent/ErrorContent — the 4-branch set is retired. [[canon fe-asynccontent-4branch-retired]]\" },",
    ],
    [
        "// atom-tightening-migration-and-pos-ruling: overlay dev-tool showAnatomy/anatPart/data-anat-* đã",
        "// atom-tightening-migration-and-pos-ruling: showAnatomy/anatPart/data-anat-* overlay tooling is",
    ],
    [
        "// NGHỈ HƯU — identity giờ là data-tier + data-component. Global — soi cả prop declaration, prop pass,",
        "// RETIRED — identity is now data-tier + data-component. Global — scan prop declarations, prop pass,",
    ],
    [
        "// destructure, và JSX attr data-anat*, vì overlay có thể rơi rớt ở bất cứ file nào (blueprint cũ).",
        "// destructure, and JSX attr data-anat*, because leftover overlay can appear in any file (old blueprint).",
    ],
    [
        "    docs: { description: \"Cấm showAnatomy/anatPart/data-anat-* — overlay blueprint đã retired, identity = data-tier + data-component. [[canon atom-tightening-migration-and-pos-ruling]]\" },",
        "    docs: { description: \"Ban showAnatomy/anatPart/data-anat-* — overlay blueprint retired; identity = data-tier + data-component. [[canon atom-tightening-migration-and-pos-ruling]]\" },",
    ],
    [
        "// split.md — component.tsx (nửa PRESENTATIONAL của cặp index.tsx/component.tsx) chỉ nhận props đã",
        "// split.md — component.tsx (PRESENTATIONAL half of the index.tsx/component.tsx pair) only takes already-",
    ],
    [
        "// resolve sẵn: không tự fetch, không tự đọc store, không tự resolve i18n — nếu không thì không còn",
        "// resolved props: no self-fetch, no store reads, no self i18n — otherwise it cannot be",
    ],
    [
        "// render được từ story. Danh sách allow/deny mirror `check-presentational-purity.mjs` (gate BE dùng",
        "// rendered from a story. Allow/deny lists mirror `check-presentational-purity.mjs` (BE gate for",
    ],
    [
        "// cho cùng invariant). Chỉ soi file tên đúng `component.tsx` — không giới hạn tier vì quy ước đặt tên",
        "// the same invariant). Only files named `component.tsx` — no tier filter because the naming",
    ],
    [
        "// đã tự khoanh phạm vi (component.tsx chỉ tồn tại trong src/components/**).",
        "// convention already scopes it (component.tsx only exists under src/components/**).",
    ],
    [
        "    docs: { description: \"component.tsx chỉ nhận props resolve sẵn — không fetch/store/i18n tự gọi. [[canon split.md]]\" },",
        "    docs: { description: \"component.tsx only takes resolved props — no self fetch/store/i18n. [[canon split.md]]\" },",
    ],
    [
        "// components/frames/_identity.ts (teacher's ruling 2026-08-05) — identity của 1 sentence-tier",
        "// components/frames/_identity.ts (teacher's ruling 2026-08-05) — identity of a sentence-tier",
    ],
    [
        "// component.tsx (hoặc index.tsx khi KHÔNG có component.tsx sibling) KHÔNG còn tự vẽ `data-tier` lên",
        "// component.tsx (or index.tsx when there is NO component.tsx sibling) no longer hand-paints `data-tier` on",
    ],
    [
        "// 1 div bọc riêng (đó chính là shape BLOCK-2 cấm) — nó truyền prop `identity={{ tier, component }}`",
        "// a wrapping div (that is the banned BLOCK-2 shape) — it passes `identity={{ tier, component }}`",
    ],
    [
        "// cho root frame/composite nó compose, ROOT đó mang cặp data-tier/data-component thay nó. Rule này",
        "// to the root frame/composite it composes; that ROOT carries data-tier/data-component. This rule",
    ],
    [
        "// bắt trường hợp cũ (mảng `require-identity-root` từng đòi `data-tier` trực tiếp trên file) — giờ đòi",
        "// catches the old case (when `require-identity-root` demanded `data-tier` on the file) — now it demands",
    ],
    [
        "// prop `identity`. Report 1 lần/file, trên export default/named. Conservative: bỏ file không có JSX,",
        "// the `identity` prop. Report once per file on default/named export. Conservative: skip files without JSX,",
    ],
    [
        "// *.stories.tsx, map.ts, types (quy ước tên component.tsx | index.tsx đã tự loại các file đó khỏi",
        "// *.stories.tsx, map.ts, types (the component.tsx | index.tsx naming already excludes those from",
    ],
    [
        "// phạm vi soi), và bỏ file mà MỌI return chỉ là fragment trần (`<>…</>`) hoặc null — không có root",
        "// scope), and skip files whose EVERY return is a bare fragment (`<>…</>`) or null — no real root",
    ],
    [
        "// element thật để mang identity.",
        "// element to carry identity.",
    ],
    [
        "    docs: { description: \"component.tsx/index.tsx sentence tier có JSX phải truyền prop identity={{ tier, component }} cho root frame/composite — ROOT mang identity, không tự vẽ div bọc. [[canon components/frames/_identity.ts]]\" },",
        "    docs: { description: \"sentence-tier component.tsx/index.tsx with JSX must pass identity={{ tier, component }} to the root frame/composite — the ROOT carries identity; no hand-rolled wrapper div. [[canon components/frames/_identity.ts]]\" },",
    ],
    ["      // ok — soi file này", "      // ok — scan this file"],
    [
        "      if (existsSync(join(dir, \"component.tsx\"))) return {} // sibling component.tsx là identity root thật",
        "      if (existsSync(join(dir, \"component.tsx\"))) return {} // sibling component.tsx is the real identity root",
    ],
    [
        "      return {} // không phải component.tsx / index.tsx — ngoài phạm vi rule (bao gồm *.stories.tsx, map.ts, types)",
        "      return {} // not component.tsx / index.tsx — out of rule scope (includes *.stories.tsx, map.ts, types)",
    ],
    ["      if (!arg) return true // `return;` — không render gì", "      if (!arg) return true // `return;` — renders nothing"],
    [
        "      if (arg.type === \"JSXFragment\") return true // fragment trần — không có element để mang identity",
        "      if (arg.type === \"JSXFragment\") return true // bare fragment — no element to carry identity",
    ],
    [
        "        if (sawReturn && !sawNonBareReturn) return // mọi return chỉ là fragment trần / null — bỏ qua",
        "        if (sawReturn && !sawNonBareReturn) return // every return is bare fragment / null — skip",
    ],
    [
        "// components/frames/_identity.ts — mặt trái của rule trên: wrapper div tay-vẽ",
        "// components/frames/_identity.ts — flip side of the rule above: a hand-rolled wrapper div",
    ],
    [
        "// `data-tier=\"block|layout|overlay|page\"` để \"mang identity\" là chính pattern đã bị RETIRE (bug, không",
        "// `data-tier=\"block|layout|overlay|page\"` to \"carry identity\" is the RETIRED pattern (a bug, not",
    ],
    [
        "// phải cách reconcile) — identity của sentence-tier giờ đứng trên CHÍNH root frame/composite nó",
        "// a reconciliation path) — sentence-tier identity now lives on the ROOT frame/composite it",
    ],
    [
        "// compose qua prop `identity`, không phải 1 div bọc thêm. CHỈ 4 giá trị sentence-tier (block/layout/",
        "// composes via the `identity` prop, not an extra wrapping div. ONLY the four sentence-tier values (block/layout/",
    ],
    [
        "// overlay/page) bị cấm ở đây; \"atom\"/\"frame\"/\"composite\" là vocabulary tier tự vẽ + tự badge element",
        "// overlay/page) are banned here; \"atom\"/\"frame\"/\"composite\" are vocabulary-tier self-draw + self-badge",
    ],
    [
        "// của chính nó — hợp lệ, không soi. Global — wrapper có thể rơi rớt ở bất cứ file nào.",
        "// on their own elements — valid, not scanned. Global — leftover wrappers can appear in any file.",
    ],
    [
        "    docs: { description: \"Cấm div/span/… tay-vẽ data-tier=\\\"block|layout|overlay|page\\\" — wrapper identity đã retired, truyền prop identity cho root frame/composite thay vào đó. [[canon components/frames/_identity.ts]]\" },",
        "    docs: { description: \"Ban hand-rolled div/span/… with data-tier=\\\"block|layout|overlay|page\\\" — identity wrapper retired; pass identity to the root frame/composite instead. [[canon components/frames/_identity.ts]]\" },",
    ],
    [
        "        if (!tag || !/^[a-z]/.test(tag)) return // chỉ soi host element (div/span/…) — component PascalCase không tính",
        "        if (!tag || !/^[a-z]/.test(tag)) return // host elements only (div/span/…) — PascalCase components excluded",
    ],
    [
        "// sentence tier ghép câu bằng cách compose frame/composite có sẵn — nó không tự vẽ hình. Class LAYOUT",
        "// sentence tier composes sentences via existing frames/composites — it does not draw shapes. LAYOUT classes",
    ],
    [
        "// (flex/grid/gap-/items-/justify-/space-x-/space-y-/absolute/relative/sticky/overflow-) trên 1 host",
        "// (flex/grid/gap-/items-/justify-/space-x-/space-y-/absolute/relative/sticky/overflow-) on a host",
    ],
    [
        "// element (div/span/section/…) ở sentence tier = tự vẽ hình thay vì compose. Bỏ qua: token `sr-only`,",
        "// element (div/span/section/…) at sentence tier = drawing instead of composing. Skip: `sr-only`,",
    ],
    [
        "// className CHỈ gồm token `size-*` (icon sizing), và variant-prefix (`md:flex`) được strip trước khi so.",
        "// className that is ONLY `size-*` (icon sizing), and strip variant prefixes (`md:flex`) before matching.",
    ],
    [
        "    docs: { description: \"Sentence tier không tự vẽ layout (flex/grid/gap-/absolute/…) trên host element — compose frame/composite có sẵn. [[canon sentence-tier-composes-not-draws]]\" },",
        "    docs: { description: \"Sentence tier must not draw layout (flex/grid/gap-/absolute/…) on host elements — compose existing frames/composites. [[canon sentence-tier-composes-not-draws]]\" },",
    ],
    [
        "// skeleton co-located: cây skeleton tay-giữ (\"import FooSkeleton from './FooSkeleton'\" hoặc prop",
        "// co-located skeleton: a hand-kept skeleton tree (\"import FooSkeleton from './FooSkeleton'\" or prop",
    ],
    [
        "// `skeleton={<...>}`) là bản sao chép tay dễ trôi khỏi bản thật — thread `isSkeleton` xuống từng leaf",
        "// `skeleton={<...>}`) is a hand copy that drifts from the real shape — thread `isSkeleton` to each leaf",
    ],
    [
        "// để shimmer luôn mirror đúng hình đã load, không thể lệch. Global — cả 2 dạng đều là \"cây song song\"",
        "// so shimmer always mirrors the loaded tree. Global — both forms are a \"parallel tree\"",
    ],
    [
        "// dù ở tier nào. KHÔNG bắt import `Skeleton` (bare, tên đúng \"Skeleton\") — đó là primitive dùng co-located.",
        "// at any tier. Do NOT flag bare `Skeleton` imports (exact name \"Skeleton\") — that is the co-located primitive.",
    ],
    [
        "    docs: { description: \"Cấm cây skeleton tay-giữ (prop skeleton={JSX} hoặc import *Skeleton relative) — thread isSkeleton xuống leaf. [[canon v2-src-twins-and-gates]]\" },",
        "    docs: { description: \"Ban hand-kept skeleton trees (skeleton={JSX} prop or relative *Skeleton import) — thread isSkeleton to leaves. [[canon v2-src-twins-and-gates]]\" },",
    ],
    [
        "// atom phải nhận text đã resolve qua prop — không tự embed câu locale (i18n là data, thuộc file",
        "// atoms must take already-resolved text via props — do not embed locale sentences (i18n is data, owned by the",
    ],
    [
        "// connected). Regression thật: Input.Password hardcode \"Show password\", user VN mất \"Hiện mật khẩu\".",
        "// connected file). Real regression: Input.Password hardcoded \"Show password\"; VI users lost \"Hiện mật khẩu\". // vn-ok: documents the retired VI string",
    ],
    [
        "// Heuristic: string literal có khoảng trắng + mở đầu chữ hoa = câu văn thật, không phải token. CHỈ",
        "// Heuristic: string literal with a space + leading capital = real prose, not a token. ONLY",
    ],
    [
        "// áp vocabulary tier — sentence tier nhận text qua props nên không thuộc phạm vi rule này.",
        "// vocabulary tier — sentence tier receives text via props so it is out of this rule's scope.",
    ],
    [
        "    docs: { description: \"Atom (vocabulary tier) không hardcode câu văn ở aria-label/placeholder/title/alt — nhận qua prop đã resolve i18n. [[canon fe-no-custom-from-design-up]]\" },",
        "    docs: { description: \"Atoms (vocabulary tier) must not hardcode prose in aria-label/placeholder/title/alt — take an i18n-resolved prop. [[canon fe-no-custom-from-design-up]]\" },",
    ],
    [
        "// ── mỗi lớp phải TỰ KHAI nó là gì và VÌ SAO nó tồn tại ──────────────────────────",
        "// ── every layer must SELF-DECLARE what it is and WHY it exists ──────────────────",
    ],
    [
        "// `principle` = lớp này tuyên bố nó là seam gì (một token, tập đóng, khớp `patterns.mjs`,",
        "// `principle` = this layer declares which seam it is (one token, closed set, matches `patterns.mjs`,",
    ],
    [
        "// test đi theo `[data-principle]`). `explain` = vì sao có lớp này — thứ không ai dựng lại",
        "// tests follow `[data-principle]`). `explain` = why this layer exists — something nobody can rebuild",
    ],
    [
        "// được từ markup về sau, và là thứ quyết định lớp kế tiếp nằm CẠNH hay nằm TRONG lớp này.",
        "// from markup later, and what decides whether the next layer sits BESIDE or INSIDE this one.",
    ],
    [
        "// Atom miễn: nó bọc vendor, nó không dựng layer nào của riêng mình.",
        "// Atoms are exempt: they wrap vendor and do not build a layer of their own.",
    ],
    [
        "/** Frame nào cũng dựng ra một node thật, nên node đó phải tự khai. */",
        "/** Every frame builds a real node, so that node must self-declare. */",
    ],
    ["/** Tên element JSX, kể cả dạng `Foo.Bar`. */", "/** JSX element name, including `Foo.Bar`. */"],
    [
        "/** Element có prop tên này không (kể cả `{...spread}` — spread thì coi như CÓ, đừng báo oan). */",
        "/** Whether the element has this prop name (including `{...spread}` — treat spread as present, no false positive). */",
    ],
    [
        "// ── một component = MỘT thư mục, và thư mục đó chỉ chứa hai nửa của chính nó ──",
        "// ── one component = ONE folder, and that folder holds only its two halves ──",
    ],
    [
        "// Ba luật dưới đây khoá cùng một thói quen: nhét cả một cụm vào trong thư mục của",
        "// The three rules below lock the same habit: stuffing a whole cluster into the folder of",
    ],
    [
        "// một màn hình. Nó luôn bắt đầu vô hại (\"con này chỉ trang này dùng\") rồi kết thúc",
        "// one screen. It always starts harmlessly (\"only this page uses it\") and ends",
    ],
    [
        "// bằng một trang 674 dòng gồm 4 component, 1 folder constants, 1 folder utils và 3",
        "// as a 674-line page with 4 components, a constants folder, a utils folder, and 3",
    ],
    [
        "// bản skeleton chép tay — đúng thứ `pages/AiSubscriptionPage` từng là.",
        "// hand-copied skeletons — exactly what `pages/AiSubscriptionPage` used to be.",
    ],
    [
        "/** Đường dẫn có nằm trong thư mục của MỘT component ở tầng câu không, và tên thư mục đó là gì. */",
        "/** Whether the path sits in ONE sentence-tier component folder, and what that folder is named. */",
    ],
])

let hit = 0
let miss = []
const out = lines.map((line) => {
    if (!map.has(line)) {
        if (/[À-ỹĂăĐđĨĩŨũƠơƯư]/.test(line)) miss.push(line)
        return line
    }
    hit++
    return map.get(line)
})

writeFileSync(path, out.join("\n"))
console.log({ hit, miss: miss.length })
miss.forEach((m) => console.log("MISS:", m.slice(0, 120)))
