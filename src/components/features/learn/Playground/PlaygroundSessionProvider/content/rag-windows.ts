import type { LocalizedGuide } from "./types"

/**
 * Windows Ollama install guide (RAG Setup: engine step). Chỉ lo CÀI + CHẠY Ollama —
 * tải model là bước RIÊNG ngay sau đó của Setup. Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH
 * (`ollama list`, HTTP :11434) — không mô tả GUI.
 */
export const RAG_WINDOWS_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Cách 1 — Cài qua winget (khuyên dùng)"}
winget có sẵn trên Windows 10/11 bản mới:

\`\`\`bash
winget install Ollama.Ollama
\`\`\`

Bộ cài này đăng ký Ollama chạy nền ngay sau khi cài, không cần tự \`ollama serve\`.
:::

:::panel{title="Cách 2 — Chocolatey hoặc installer thủ công"}
Dùng Chocolatey (kiểm \`choco --version\`; chưa có thì cài theo lệnh chính thức tại [chocolatey.org/install](https://chocolatey.org/install) trong PowerShell quyền Administrator):

\`\`\`bash
choco install ollama
\`\`\`

Hoặc tải \`OllamaSetup.exe\` tại [ollama.com/download](https://ollama.com/download) và chạy như cài phần mềm thường.
:::

:::panel{title="Xác nhận Ollama đang chạy"}
Mở terminal mới (PowerShell/Git Bash) — terminal cũ chưa thấy lệnh vừa cài:

\`\`\`bash
ollama list
\`\`\`

Ra bảng danh sách model (rỗng cũng được — bước sau mới tải model) nghĩa là server sống. Báo \`could not connect to ollama app\` thì server chưa lên; bật thủ công bằng:

\`\`\`bash
ollama serve
\`\`\`

Kiểm trực tiếp cổng nếu muốn chắc:

\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
:::
::::
`,
    en: `
::::accordion
:::panel{title="Option 1 — Install via winget (recommended)"}
winget ships with recent Windows 10/11:

\`\`\`bash
winget install Ollama.Ollama
\`\`\`

This installer registers Ollama to run in the background, so you don't have to start \`ollama serve\` yourself.
:::

:::panel{title="Option 2 — Chocolatey or the manual installer"}
Use Chocolatey (check \`choco --version\`; if missing, install it with the official command from [chocolatey.org/install](https://chocolatey.org/install) in an Administrator PowerShell):

\`\`\`bash
choco install ollama
\`\`\`

Or download \`OllamaSetup.exe\` from [ollama.com/download](https://ollama.com/download) and run it like any other installer.
:::

:::panel{title="Verify Ollama is running"}
Open a NEW terminal (PowerShell/Git Bash) — an already-open one won't see the freshly installed command:

\`\`\`bash
ollama list
\`\`\`

A model table (empty is fine — models come in the next step) means the server is alive. \`could not connect to ollama app\` means it isn't up; start it by hand with:

\`\`\`bash
ollama serve
\`\`\`

To check the port directly:

\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
:::
::::
`,
}
