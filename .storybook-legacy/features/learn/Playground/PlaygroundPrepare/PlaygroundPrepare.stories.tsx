import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { RobotIcon, StackIcon } from "@phosphor-icons/react"
import { Ollama, Qwen } from "@lobehub/icons"
import { SiDocker, SiKubernetes } from "react-icons/si"
import { PlaygroundPrepare } from "@/components/features/learn/Playground/PlaygroundPrepare"
import type { ReadinessChecklistItem } from "@/components/blocks/feedback/ReadinessChecklist"
import { resolveInstallGuides } from "@/components/features/learn/Playground/PlaygroundSessionProvider/content"

/**
 * `PlaygroundPrepare` — the step-0 onboarding gate before a RAG playground's
 * hands-on steps: stacked setup steps (pair the StarCi Agent → install Ollama →
 * pull models) plus a live `ReadinessChecklist` and the "enter workspace" CTA.
 * Purely presentational — all data via props.
 */
const meta = {
    title: "Features/Learn/Playground/PlaygroundPrepare",
    component: PlaygroundPrepare,
} satisfies Meta<typeof PlaygroundPrepare>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Base readiness rows. `engine` is the row fed by the agent's `env:report` probe
 * — it is what each step's chip reads (`readyId`), so a story that drops it
 * renders the guide with no per-step status at all.
 */
const READINESS_ITEMS: Array<ReadinessChecklistItem> = [
    {
        id: "agent",
        icon: <RobotIcon aria-hidden focusable="false" />,
        label: "StarCi Agent",
        readyDescription: "Agent đã kết nối vào phiên này.",
        pendingDescription: "Agent chưa kết nối. Chạy lệnh bên trên để nối.",
        ready: false,
    },
    // RAG splits the old single "engine" row into the four things that must be
    // true — Ollama serving + each model role — so the learner SEES which is
    // missing instead of reading it out of one chip's prose (teacher, 2026-07-20).
    {
        id: "engine",
        // brand marks from @lobehub/icons (monochrome, inherit the tile tone) —
        // mirrors what PlaygroundSessionProvider now passes; embedding keeps a
        // Phosphor glyph because Nomic has no mark in the set
        icon: <Ollama aria-hidden focusable="false" />,
        label: "Ollama",
        readyDescription: "Ollama đang chạy trên máy bạn.",
        pendingDescription: "Ollama chưa chạy. Mở Ollama lên rồi bấm kiểm tra lại.",
        ready: false,
    },
    {
        id: "embed",
        icon: <StackIcon aria-hidden focusable="false" />,
        label: "Model embedding",
        readyDescription: "Model embedding đã sẵn sàng.",
        pendingDescription: "Chưa tải model embedding (nomic-embed-text).",
        ready: false,
    },
    {
        id: "gen",
        icon: <Qwen aria-hidden focusable="false" />,
        label: "Model trả lời",
        readyDescription: "Model trả lời đã sẵn sàng.",
        pendingDescription: "Model trả lời (qwen2.5) chưa được tải về.",
        ready: false,
    },
]

/**
 * A reported machine, as `device:info` delivers it. Stories override only the
 * GPU/VRAM bits they are actually about, so the ribbon's other cells stay
 * realistic instead of each story inventing its own half-filled device.
 */
const deviceInfo = (overrides: Partial<{
    gpu: string | null
    vramFreeMb?: number
    vramTotalMb?: number
}> = {}) => ({
    platform: "win32",
    arch: "x64",
    hostname: "DESKTOP-3IE1SPH",
    cpuModel: "Intel(R) Core(TM) i7-14700KF",
    cpuCores: 28,
    totalMemBytes: 69_000_000_000,
    freeMemBytes: 17_000_000_000,
    gpu: "NVIDIA GeForce RTX 4060",
    vramTotalMb: 8192,
    vramFreeMb: 6000,
    ...overrides,
})

const BASE_ARGS = {
    // the REAL guides the app ships (locale-resolved), so the story can't drift
    // from what a learner actually reads on the Setup route.
    osGuides: resolveInstallGuides("rag", "vi"),
    pairCommand: "npx @starciacademy/playground-agent R4G-K9F2",
    engineName: "Ollama",
    envReport: { ready: false, label: "Ollama", detail: "Chưa chạy — mở Ollama rồi kiểm tra lại." },
    deviceInfo: deviceInfo(),
    // a live code, so the default stories show the pair step's meta line in full
    // (countdown · Node requirement) rather than the paired-state short form
    pairingCodeSecondsLeft: 870,
    // present so the action row renders BOTH buttons — the button is gated on this
    // callback, the same way the check button is gated on `onVerify`
    onRefreshPairingCode: () => {},
    onEnter: () => {},
    onVerify: () => {},
}

/** Nothing is ready yet — the state right after the learner lands on step 0. */
export const Pending: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — state ②. Step-0 gate before a RAG playground: pair the StarCi Agent → install Ollama (per-OS tab) → pull models, with a live readiness panel. Pairing leads because every check runs THROUGH the agent. Nothing ready yet, so the \"Bắt đầu playground\" CTA is disabled and the hint counts remaining items. **Hàng nút:** \"Kiểm tra lại\" (tertiary) + \"Lấy mã mới\" (danger-soft) nằm CÙNG MỘT HÀNG cuối card — trước đây chúng bị dòng hint chen giữa vì sinh ra ở hai nhánh render khác nhau. Countdown + yêu cầu Node.js gộp thành một dòng meta.",
    },
}

/**
 * No agent has reported specs yet (`deviceInfo: null`) — the "which model" call
 * is genuinely UNKNOWN, not "no GPU".
 *
 * This is the state the teacher caught: the panel used to show the "no discrete
 * GPU" warning the instant it loaded, before the learner had even paired. Now
 * step 3 reads the neutral "specs not read yet" line and offers NO model /
 * command — a recommendation is a verdict, and there is nothing yet to base one on.
 */
export const DeviceUnknown: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        deviceInfo: null,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — CHƯA nối agent (`deviceInfo: null`). Bước 3 hiện câu TRUNG TÍNH \"chưa đọc được cấu hình, nối agent xong sẽ gợi ý\", KHÔNG chốt model nào, KHÔNG lệnh pull (lỗi thầy bắt: đừng chốt verdict khi chưa có dữ liệu). Gợi ý model giờ CHỈ sống trong bước 3 — không còn callout riêng dưới bảng Máy-của-bạn.",
    },
}

/** Every prerequisite reports ready — the CTA unlocks. */
export const AllReady: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        // paired ⇒ the code has done its job and the provider stops counting down;
        // a story that kept counting would advertise an expiry that cannot happen
        pairingCodeSecondsLeft: null,
        readinessItems: READINESS_ITEMS.map((item) => ({ ...item, ready: true })),
        allReady: true,
    },
    parameters: {
        usage: "Chờ duyệt — state ⑤ + CTA mở khoá. Mọi điều kiện đều xanh nên \"Bắt đầu playground\" bật. Countdown BIẾN MẤT (mã xong việc, phiên vẫn sống) nên dòng meta chỉ còn yêu cầu Node.js. **Bấm \"Lấy mã mới\"** để thấy ConfirmDialog: khi agent đang chạy, mã mới sẽ ngắt nó — cảnh báo đó giờ hiện ĐÚNG LÚC BẤM thay vì nằm thường trực trong card (state này là state học viên ở lại lâu nhất).",
    },
}

/**
 * The session has not answered yet, so there is no code to render. `pairCommand`
 * is `""` until then — a skeleton beats an empty fence, which a learner can copy
 * as a truncated command.
 */
export const PairCodeMinting: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        pairCommand: "",
        pairingCodeSecondsLeft: null,
        isRefreshingPairingCode: true,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — state ①, MỚI. Chưa có mã (`pairCommand` = \"\" cho tới khi session trả lời): khối lệnh render SKELETON thay vì fence rỗng. Trước đây state này không được vẽ riêng nên học viên có thể copy một lệnh cụt. Cả hai nút đều pending.",
    },
}

/**
 * Rotating an existing code: the command stays on screen (it is still the live
 * one until the new session answers) while the refresh button holds the pending
 * state via HeroUI's `isPending`.
 */
export const RefreshingPairCode: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        isRefreshingPairingCode: true,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — state ⑧. Đang mint mã thay thế: nút \"Lấy mã mới\" giữ trạng thái pending qua prop `isPending` của HeroUI + `<Spinner color=\"current\">` đặt tay (HeroUI KHÔNG tự render spinner). Trước đây cả hai nút tự chế `isDisabled` + ternary — lệch `button.md §6c`.",
    },
}

/**
 * Pressing "Kiểm tra lại" with no agent paired. The check is REFUSED up front —
 * no socket emit, no fake spinner — because `verify:now` fired into a room with
 * no agent drops silently, which would read exactly like "checked, still not
 * ready". The two cases need opposite next moves (chạy npx vs mở engine).
 */
export const CheckRefusedNoAgent: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getAllByRole("button", { name: /Kiểm tra lại/ })[0])
        await waitFor(() =>
            expect(canvas.getByText(/Chưa nối được StarCi Agent/)).toBeInTheDocument(),
        )
    },
    parameters: {
        usage: "Chờ duyệt — state ⑦ (play tự bấm). Chưa pair mà bấm kiểm tra → TỪ CHỐI ngay, không quay spinner giả. Dòng lỗi nằm DƯỚI hàng nút (nó là kết quả của lần bấm), không chen giữa 2 nút; và nó derived — agent nối được là tự biến mất.",
    },
}

/**
 * The busy window of a real check. The probe answers over the socket rather than
 * a promise, so the button holds a bounded 1.5s pending state and the arriving
 * `env:report` updates the chip.
 */
export const CheckingStep: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        pairingCodeSecondsLeft: null,
        // agent paired, engine still pending — the realistic mid-flow moment where
        // a learner actually presses "Kiểm tra lại"
        readinessItems: [
            { ...READINESS_ITEMS[0], ready: true },
            READINESS_ITEMS[1],
        ],
        allReady: false,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getAllByRole("button", { name: /Kiểm tra lại/ })[0])
        await waitFor(() =>
            expect(canvas.getAllByText(/Đang kiểm tra/)[0]).toBeInTheDocument(),
        )
    },
    parameters: {
        usage: "Chờ duyệt — state ⑥ (play tự bấm). Agent đã nối, engine chưa → bấm kiểm tra chạy THẬT: nút vào `isPending`, spinner + nhãn \"Đang kiểm tra…\" trong 1.5s rồi trả về. Nút thứ hai (\"Lấy mã mới\") KHÔNG bị khoá theo — hai hành động độc lập.",
    },
}

/**
 * Plenty of free VRAM — the single recommendation line names `qwen2.5-coder:14b`
 * and the pull command uses it. Models NOT yet installed (readiness rows pending),
 * so step 3 shows the recommend line + command; contrast `AllReady` where the
 * models ARE installed and step 3 collapses to the "đã đủ model" confirmation.
 */
export const HighVram: Story = {
    args: {
        ...BASE_ARGS,
        deviceInfo: deviceInfo({ gpu: "NVIDIA RTX 4090", vramTotalMb: 24576, vramFreeMb: 16000 }),
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Máy nhiều VRAM (16 GB trống), model CHƯA cài: bước 3 hiện MỘT dòng \"Nên cài qwen2.5-coder:14b — vừa với máy bạn\" + lệnh pull đúng model đó. Không còn bảng 3 tier (một máy = một đáp án). Khi model đã cài (xem `AllReady`) bước 3 co lại thành \"đã đủ model\".",
    },
}

/**
 * The agent has not answered `env:report` yet, so the engine row falls back to
 * the i18n pending copy. That copy must state the BAR (Ollama running AND both
 * models pulled) — "chưa kiểm tra được" alone reads as a broken check.
 *
 * NOTE: the real fallback is chosen in `PlaygroundSessionProvider` (rag vs infra
 * key), which is outside this component; the row text is passed in here to show
 * what the learner ends up reading.
 */
export const AwaitingProbe: Story = {
    args: {
        ...BASE_ARGS,
        envReport: null,
        readinessItems: [
            READINESS_ITEMS[0],
            {
                // [1] is the ENGINE row (agent leads the list, mirroring step order).
                ...READINESS_ITEMS[1],
                pendingDescription: "Ollama phải đang chạy và đã tải đủ hai model. Xong rồi bấm Kiểm tra lại.",
            },
        ],
        allReady: false,
    },
    parameters: {
        usage: "Chưa có `env:report`: hàng Ollama dùng câu i18n dự phòng, và câu đó phải NÓI RÕ điều kiện (Ollama đang chạy + đủ hai model) chứ không chỉ \"chưa kiểm tra được\".",
    },
}

/** No discrete GPU detected — the warning callout explains the CPU fallback, and
 * the pull command drops to the light qwen2.5:3b generation model. */
export const NoGpu: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        deviceInfo: deviceInfo({ gpu: null, vramTotalMb: undefined, vramFreeMb: undefined }),
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — no NVIDIA GPU detected: the recommendation callout switches to a warning explaining the CPU fallback, and step 2's pull command drops to the light qwen2.5:3b generation model (`recommendGenModel(undefined)`).",
    },
}

/** Infra flavor (Docker/K8s): pair the agent then install the CLI engine — no
 * Ollama, no model pull. The machine callout confirms CPU/RAM instead of sizing a model to
 * VRAM, and only TWO numbered steps show. */
export const Infra: Story = {
    tags: ["news"],
    args: {
        flavor: "infra",
        osGuides: resolveInstallGuides("docker", "vi"),
        pairCommand: "npx @starciacademy/playground-docker-agent R4G-K9F2",
        engineName: "Docker",
        envReport: { ready: true, label: "Docker engine", detail: "Đang chạy · v29.5.2" },
        deviceInfo: deviceInfo({ gpu: null, vramTotalMb: undefined, vramFreeMb: undefined }),
        readinessItems: [
            {
                id: "agent",
                icon: <RobotIcon aria-hidden focusable="false" />,
                label: "StarCi Agent",
                readyDescription: "Agent đã bắt tay và trả lời health check.",
                pendingDescription: "Đang chờ agent kết nối.",
                ready: true,
            },
            {
                id: "engine",
                // brand glyph from react-icons (mirrors the real provider) — monochrome
                // so IconTile's tone owns the colour, unlike a full-colour <img> SVG.
                icon: <SiDocker aria-hidden />,
                label: "Docker engine",
                readyDescription: "Đang chạy · v29.5.2",
                pendingDescription: "Chưa chạy — mở Docker Desktop rồi kiểm tra lại.",
                ready: true,
            },
        ],
        allReady: true,
        // paired ⇒ no countdown; the refresh button still renders (rotating a code
        // is allowed at any time, e.g. to point the session at another machine)
        pairingCodeSecondsLeft: null,
        onRefreshPairingCode: () => {},
        onEnter: () => {},
        onVerify: () => {},
    },
    parameters: {
        usage: "Chờ duyệt — flavor `infra` (Docker/K8s): only TWO numbered steps (pair the agent → install the engine per-OS), each with its own status chip + \"Kiểm tra lại\" button; an accent CPU/RAM callout instead of the VRAM model sizer; readiness rendered as a labeled surface list. The install step renders the REAL shipped guide (`osGuides[os]`) — an accordion of collapsible panels: package-manager route (incl. installing Homebrew/Chocolatey itself), manual binary/installer route, then a verify panel whose every signal is command-checkable.",
    },
}

/** The minikube + kubectl playground: same `infra` shell, different guide — its
 * first panel is a DRIVER prerequisite check (minikube needs docker/hyperkit/… to
 * build the node). */
export const InfraKubernetes: Story = {
    tags: ["news"],
    args: {
        ...Infra.args,
        osGuides: resolveInstallGuides("k8s", "vi"),
        pairCommand: "npx @starciacademy/playground-k8s-agent R4G-K9F2",
        engineName: "minikube + kubectl",
        envReport: { ready: false, label: "kubectl + minikube", detail: "Chưa thấy minikube — cài rồi kiểm tra lại." },
        readinessItems: [
            {
                id: "agent",
                icon: <RobotIcon aria-hidden focusable="false" />,
                label: "StarCi Agent",
                readyDescription: "Agent đã bắt tay và trả lời health check.",
                pendingDescription: "Đang chờ agent kết nối.",
                ready: false,
            },
            {
                id: "engine",
                icon: <SiKubernetes aria-hidden />,
                label: "kubectl + minikube",
                readyDescription: "Đã cài cả hai.",
                pendingDescription: "Chưa thấy minikube — cài rồi kiểm tra lại.",
                ready: false,
            },
        ],
        // nothing paired here, so the code is still counting down
        pairingCodeSecondsLeft: 700,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — the Kubernetes playground reuses the `infra` shell but ships its own guide: panel 1 is a DRIVER prerequisite (minikube needs docker/hyperkit/kvm2 to build the node; the playground standardises on `--driver=docker` because the learner already installed it), then package-manager vs raw-binary routes, then a verify panel that starts and deletes a throwaway cluster.",
    },
}

/** English locale — every guide is authored vi + en, so switching the app
 * language must switch the install instructions too. */
export const EnglishGuide: Story = {
    tags: ["news"],
    args: {
        ...Infra.args,
        osGuides: resolveInstallGuides("docker", "en"),
    },
    parameters: {
        usage: "Chờ duyệt — the same Docker step rendered from the ENGLISH guide (`resolveInstallGuides(\"docker\", \"en\")`). Guides live as `{ vi, en }` pairs and are locale-resolved by `PlaygroundSessionProvider`, so an English viewer no longer reads Vietnamese install steps. Surrounding chrome here still shows Vietnamese because Storybook pins the app's own i18n messages.",
    },
}

/**
 * The pairing code is still valid but under a minute from death. The countdown
 * switches from muted to a danger tone at `PAIR_CODE_URGENT_SECONDS` (60) —
 * muted text reads as background info right up to the moment the code expires,
 * which is exactly when the learner needed the nudge.
 */
export const PairCodeExpiring: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        pairingCodeSecondsLeft: 42,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — state ③. Mã còn 0:42: trong dòng meta gộp, CHỈ vế countdown chuyển tông danger, vế yêu cầu Node.js giữ muted — nó vẫn là thông tin nền dù mã sắp chết. So với `Pending` (14:30, cả dòng mờ) để thấy đúng ngưỡng 60 giây.",
    },
}

/**
 * The code has expired. Two things disappear on purpose: the command block (a
 * dead code left copyable invites the paste that then fails cryptically) and
 * the "check again" button (pairing is impossible, so it could only ever answer
 * "chưa nối được agent" — a button guaranteed to fail is worse than none).
 * Exactly one action remains.
 */
export const PairCodeExpired: Story = {
    tags: ["news"],
    args: {
        ...BASE_ARGS,
        pairingCodeSecondsLeft: 0,
        pairingCodeExpired: true,
        readinessItems: READINESS_ITEMS,
        allReady: false,
    },
    parameters: {
        usage: "Chờ duyệt — state ④. Mã hết hạn: khối lệnh VÀ nút \"Kiểm tra lại\" đều biến mất, và dòng meta cũng biến mất (chưa có lệnh để chạy thì nhắc Node.js là nhiễu). Hàng hành động còn ĐÚNG một nút \"Lấy mã mới\" — vẫn cùng khuôn 4 vùng, chỉ khác số nút. Đây là state thầy hỏi 2026-07-20 (\"hết hạn thì có nút kiểm tra lại chi?\").",
    },
}
