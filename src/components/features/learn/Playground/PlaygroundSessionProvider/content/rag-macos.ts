import type { LocalizedGuide } from "./types"

/**
 * macOS Ollama install guide (RAG Setup: engine step). Chỉ lo CÀI + CHẠY Ollama —
 * việc tải model là bước RIÊNG ngay sau đó của Setup, đừng nhắc lại ở đây. Mọi tín hiệu
 * KIỂM ĐƯỢC BẰNG LỆNH (`ollama list`, HTTP :11434) — không mô tả GUI.
 */
export const RAG_MACOS_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Cách 1 — Cài qua Homebrew (khuyên dùng)"}
Kiểm xem máy đã có Homebrew chưa:

\`\`\`bash
brew --version
\`\`\`

Báo \`command not found\` thì cài bằng lệnh chính thức từ [brew.sh](https://brew.sh):

\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`

Script in ra 2 dòng thêm \`brew\` vào PATH ở cuối — chạy đúng 2 dòng đó rồi mở lại terminal.

Có Homebrew rồi thì cài Ollama:

\`\`\`bash
brew install ollama
\`\`\`
:::

:::panel{title="Cách 2 — Tải bộ cài thủ công"}
Không muốn cài Homebrew? Tải bộ cài tại [ollama.com/download](https://ollama.com/download) rồi cài như app thường.

Bản tải từ trang chủ chạy sẵn dạng app nền, không cần tự \`ollama serve\`.
:::

:::panel{title="Khởi động Ollama + xác nhận"}
Cài bằng Homebrew thì server CHƯA chạy — bật lên (giữ cửa sổ này mở, hoặc dùng \`brew services start ollama\` để chạy nền):

\`\`\`bash
ollama serve
\`\`\`

Mở terminal khác rồi xác nhận server trả lời thật:

\`\`\`bash
ollama list
\`\`\`

Ra bảng danh sách model (rỗng cũng được — bước sau mới tải model) nghĩa là server sống. Báo \`could not connect to ollama app\` thì server chưa lên.

Kiểm trực tiếp cổng nếu muốn chắc:

\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
:::
::::
`,
    en: `
::::accordion
:::panel{title="Option 1 — Install via Homebrew (recommended)"}
Check whether you already have Homebrew:

\`\`\`bash
brew --version
\`\`\`

If that says \`command not found\`, install it with the official command from [brew.sh](https://brew.sh):

\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`

The script ends by printing two lines that add \`brew\` to your PATH — run exactly those, then reopen your terminal.

With Homebrew in place, install Ollama:

\`\`\`bash
brew install ollama
\`\`\`
:::

:::panel{title="Option 2 — Download the installer manually"}
Rather not install Homebrew? Grab the installer from [ollama.com/download](https://ollama.com/download) and install it like any other app.

The build from the website runs as a background app, so you don't have to start \`ollama serve\` yourself.
:::

:::panel{title="Start Ollama and verify"}
A Homebrew install does NOT start the server — start it (keep this window open, or use \`brew services start ollama\` to run it in the background):

\`\`\`bash
ollama serve
\`\`\`

Open a second terminal and confirm the server actually answers:

\`\`\`bash
ollama list
\`\`\`

A model table (empty is fine — models come in the next step) means the server is alive. \`could not connect to ollama app\` means it isn't up.

To check the port directly:

\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
:::
::::
`,
}
