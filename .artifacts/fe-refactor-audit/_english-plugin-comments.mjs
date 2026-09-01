/**
 * English-ify remaining Vietnamese comments in plugins/eslint/index.mjs.
 * Message strings were already rewritten; this pass targets comments/JSDoc only.
 */
import { readFileSync, writeFileSync } from "node:fs"

const path = "plugins/eslint/index.mjs"
let src = readFileSync(path, "utf8")

const pairs = [
    [
        "/** Lấy chuỗi className tĩnh từ 1 JSXAttribute (string literal hoặc template quasi thuần). */",
        "/** Static className string from one JSXAttribute (literal or pure template quasi). */",
    ],
    [
        "/** Tên component của 1 JSXElement (Chip, Chip.Label, ModalShell…). */",
        "/** Component name of one JSXElement (Chip, Chip.Label, ModalShell…). */",
    ],
    [
        "/** Lấy string literal tĩnh từ 1 JSXAttribute (Literal hoặc JSXExpressionContainer bọc Literal). */",
        "/** Static string literal from one JSXAttribute (Literal or JSXExpressionContainer wrapping Literal). */",
    ],
    [
        "// ── tier map dùng chung — suy tier từ ĐƯỜNG DẪN FILE, không phải nội dung ──\n// vocabulary: atoms/frames/composites (bọc vendor + ghép leaf, không quyết layout/data).\n// sentence: blocks/pages/layouts/overlays (ghép câu, không tự vẽ hình/gọi data).\n// Không còn nhà tạm: `features`, `starci`, `modals(v2)`, `drawers(v2)`, `pallettes` đã rỗng và\n// bị xoá, nên bốn tên dưới đây là TOÀN BỘ tầng câu — thêm một thư mục mới cạnh chúng là lách cổng.\n// Bất cứ gì NGOÀI `src/components/**` (route app/, hook, module) KHÔNG PHẢI 1 component tier —\n// mỗi rule dùng helper này tự nói rõ trong comment nó bỏ qua phạm vi đó hay không.",
        "// ── shared tier map — derive tier from FILE PATH, not contents ──\n// vocabulary: atoms/frames/composites (wrap vendor + compose leaves; no layout/data decisions).\n// sentence: blocks/pages/layouts/overlays (compose sentences; do not draw shapes or fetch).\n// Temporary homes (`features`, `starci`, `modals(v2)`, `drawers(v2)`, `pallettes`) are gone —\n// the four names below are the full sentence tier; adding a sibling directory bypasses the gate.\n// Anything outside `src/components/**` (app routes, hooks, modules) is NOT a component tier —\n// each rule that uses this helper says whether it skips that scope.",
    ],
    [
        "/** \"vocabulary\" | \"sentence\" | null (null = ngoài src/components/** hoặc thư mục tier không xác định). */",
        "/** \"vocabulary\" | \"sentence\" | null (null = outside src/components/** or unknown tier dir). */",
    ],
    [
        "// L4 — off-scale spacing: fractional Tailwind (gap-1.5, p-2.5, space-y-1.5…). Thang StarCi = 0·2·3·6·8(+4);\n// fractional KHÔNG BAO GIỜ đúng thang → bắt chắc, 0 false-positive.",
        "// L4 — off-scale spacing: fractional Tailwind (gap-1.5, p-2.5, space-y-1.5…). StarCi scale = 0·2·3·6·8(+4);\n// fractional is never on-scale → exact match, zero false-positives.",
    ],
    [
        "// L3 — chip-cạnh-chip: ≥2 <Chip> sibling trực tiếp trong 1 cụm = vi phạm (1 cụm meta tối đa 1 chip).",
        "// L3 — adjacent chips: ≥2 direct <Chip> siblings in one cluster = violation (one meta cluster → one chip).",
    ],
    [
        "// ── authoring convention rules (trục viết-code, 2026-08) — mỗi rule = 1 luật `enforce/authoring/*` ──",
        "// ── authoring convention rules (2026-08) — each rule = one `enforce/authoring/*` law ──",
    ],
    [
        "// structure-and-naming §5 + \"tên hàm phải là arrow\": mọi hàm module-level là `const X = () => {}`,\n// KHÔNG `function` declaration / `export default function`. Bắt FunctionDeclaration ở top-level.",
        "// structure-and-naming §5 + \"functions are arrows\": every module-level function is `const X = () => {}`,\n// NOT a `function` declaration / `export default function`. Flag top-level FunctionDeclaration.",
    ],
    [
        "// comments.md §3: mọi thứ EXPORT (component/hook/helper/const/interface) mở đầu bằng 1 JSDoc `/** */`.",
        "// comments.md §3: every EXPORT (component/hook/helper/const/interface) opens with JSDoc `/** */`.",
    ],
    [
        "// react-idioms §7: handler đặt tên `onXxx`, KHÔNG `handleXxx` (biến cục bộ lẫn prop).",
        "// react-idioms §7: handlers are named `onXxx`, NOT `handleXxx` (locals and props).",
    ],
    [
        "// structure-and-naming §1/§5: 1 folder PascalCase = 1 `index.tsx`, có 1 named-export TRÙNG tên folder.",
        "// structure-and-naming §1/§5: one PascalCase folder = one `index.tsx` with a named export matching the folder.",
    ],
    [
        "// ── tier rules (refactor tuần này, 2026-08) — mỗi rule = 1 lớp vi phạm cụ thể vừa bắt được ──",
        "// ── tier rules (2026-08 refactor) — each rule = one concrete violation class ──",
    ],
    [
        "// atom layer = bọc vendor 1 LẦN (atom-layer-heroui-wrappers). Import @heroui/react thẳng ở sentence\n// tier = 1 block tự quyết lại appearance mà atom đã chốt — bỏ qua atom, chồng nguồn sự thật hình dạng.\n// CHỈ áp cho file dưới `src/components/**` (sentence tier); ngoài src/components/ (route, hook, module)\n// KHÔNG bị rule này soi — false-positive-risk: 1 hook/route import @heroui/react thẳng lọt lưới.",
        "// atom layer = wrap vendor ONCE (atom-layer-heroui-wrappers). Direct @heroui/react import at sentence\n// tier = a block re-deciding appearance the atom already fixed — bypasses the atom, splits the truth.\n// ONLY applies under `src/components/**`; outside (routes, hooks, modules) is out of scope —\n// otherwise a hook/route direct import would be a false positive.",
    ],
]

let n = 0
for (const [from, to] of pairs) {
    if (src.includes(from)) {
        src = src.split(from).join(to)
        n++
    } else {
        console.log("MISS block starting:", from.slice(0, 60).replace(/\n/g, " "))
    }
}

writeFileSync(path, src)

const VN = /[À-ÃÈ-ÊÌÍÒ-ÕÙÚÝà-ãè-êìíò-õùúýĂăĐđĨĩŨũƠơƯưẠ-ỿ]/
const lines = src.split(/\r?\n/)
const left = lines.map((l, i) => (VN.test(l) ? `${i + 1}: ${l.trim().slice(0, 100)}` : null)).filter(Boolean)
console.log({ replacedBlocks: n, remainingViLines: left.length })
left.slice(0, 40).forEach((l) => console.log(l))
