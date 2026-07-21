import type { LocalizedGuide } from "./types"

/**
 * Linux Ollama install guide (RAG Setup: engine step). Chỉ lo CÀI + CHẠY Ollama —
 * tải model là bước RIÊNG ngay sau đó của Setup. Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH
 * (`systemctl is-active`, `ollama list`, HTTP :11434) — không mô tả GUI.
 */
export const RAG_LINUX_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Cách 1 — Script cài đặt chính thức (khuyên dùng)"}
\`\`\`bash
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`

Script tự cài binary và đăng ký sẵn systemd service, nên Ollama chạy nền ngay sau khi cài.
:::

:::panel{title="Cách 2 — Tải binary thủ công"}
Không muốn pipe script từ internet vào \`sh\`? Tải rồi giải nén thẳng vào \`/usr/local\`:

\`\`\`bash
curl -LO https://ollama.com/download/ollama-linux-amd64.tgz
sudo tar -C /usr/local -xzf ollama-linux-amd64.tgz
\`\`\`

Cách này KHÔNG tạo systemd service — mỗi lần dùng phải tự chạy \`ollama serve\` (xem panel dưới).
:::

:::panel{title="Khởi động Ollama + xác nhận"}
Cài bằng script thì kiểm service:

\`\`\`bash
systemctl is-active ollama
\`\`\`

Ra \`active\` là đang chạy; ra \`inactive\` thì bật lên:

\`\`\`bash
sudo systemctl start ollama
sudo systemctl enable ollama
\`\`\`

Cài binary thủ công (không có service) thì tự chạy server, giữ cửa sổ đó mở:

\`\`\`bash
ollama serve
\`\`\`

Xác nhận server trả lời thật:

\`\`\`bash
ollama list
\`\`\`

Ra bảng danh sách model (rỗng cũng được — bước sau mới tải model) nghĩa là server sống.

Kiểm trực tiếp cổng nếu muốn chắc:

\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
:::
::::
`,
    en: `
::::accordion
:::panel{title="Option 1 — Official install script (recommended)"}
\`\`\`bash
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`

The script installs the binary and registers a systemd service, so Ollama runs in the background right after install.
:::

:::panel{title="Option 2 — Download the binary manually"}
Rather not pipe a script from the internet into \`sh\`? Download and extract straight into \`/usr/local\`:

\`\`\`bash
curl -LO https://ollama.com/download/ollama-linux-amd64.tgz
sudo tar -C /usr/local -xzf ollama-linux-amd64.tgz
\`\`\`

This route does NOT create a systemd service — you'll have to run \`ollama serve\` yourself each time (see the panel below).
:::

:::panel{title="Start Ollama and verify"}
If you used the script, check the service:

\`\`\`bash
systemctl is-active ollama
\`\`\`

\`active\` means it's running; \`inactive\` means start it:

\`\`\`bash
sudo systemctl start ollama
sudo systemctl enable ollama
\`\`\`

If you installed the binary by hand (no service), run the server yourself and keep that window open:

\`\`\`bash
ollama serve
\`\`\`

Confirm the server actually answers:

\`\`\`bash
ollama list
\`\`\`

A model table (empty is fine — models come in the next step) means the server is alive.

To check the port directly:

\`\`\`bash
curl http://localhost:11434/api/version
\`\`\`
:::
::::
`,
}
