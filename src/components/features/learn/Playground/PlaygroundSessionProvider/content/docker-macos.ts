import type { LocalizedGuide } from "./types"

/**
 * macOS Docker install guide (Setup: engine step) — Homebrew route including
 * installing Homebrew itself, the plain .dmg installer, and a verify step.
 *
 * Mọi tín hiệu trong guide phải KIỂM ĐƯỢC BẰNG LỆNH (`uname -m`, `docker info`,
 * exit code) — không mô tả GUI ("icon con cá voi trên thanh menu") vì thứ đó
 * đổi theo phiên bản app và học viên không tự đối chiếu chắc chắn được. Xem
 * `.claude/fe/features/playground.md`.
 */
export const DOCKER_MACOS_GUIDE: LocalizedGuide = {
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

Script in ra 2 dòng thêm \`brew\` vào PATH ở cuối — chạy đúng 2 dòng đó, mở lại terminal, rồi \`brew --version\` phải ra số phiên bản.

Có Homebrew rồi thì cài Docker:

\`\`\`bash
brew install --cask docker
\`\`\`

Lệnh này cài **Docker Desktop** (app quản lý engine), không phải chỉ CLI.
:::

:::panel{title="Cách 2 — Tải installer thủ công"}
Không muốn cài Homebrew? Tải file \`.dmg\` tại [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop) rồi cài như app thường.

Trang tải có 2 bản theo chip — kiểm chip máy bằng lệnh, đừng đoán:

\`\`\`bash
uname -m
\`\`\`

Ra \`arm64\` → tải bản **Apple Silicon**. Ra \`x86_64\` → tải bản **Intel**. Tải nhầm bản thì app không khởi động được.
:::

:::panel{title="Khởi động engine + xác nhận"}
Cài xong engine CHƯA chạy. Khởi động bằng lệnh (không cần mở Launchpad):

\`\`\`bash
open -a Docker
\`\`\`

Engine mất khoảng 10-30 giây để lên. Xác nhận:

\`\`\`bash
docker info
\`\`\`

Lệnh này hỏi thẳng daemon — ra được khối thông tin (\`Server Version: …\`) nghĩa là engine sống. Còn báo \`Cannot connect to the Docker daemon\` thì engine chưa lên: đợi thêm rồi chạy lại.

Lưu ý \`docker --version\` KHÔNG thay được kiểm tra này — nó chỉ đọc phiên bản CLI và vẫn trả lời bình thường khi engine đang tắt.

Chạy thử 1 container để chắc chắn:

\`\`\`bash
docker run --rm hello-world
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

The script ends by printing two lines that add \`brew\` to your PATH — run exactly those, reopen your terminal, then \`brew --version\` should print a version number.

With Homebrew in place, install Docker:

\`\`\`bash
brew install --cask docker
\`\`\`

This installs **Docker Desktop** (the app that manages the engine), not just the CLI.
:::

:::panel{title="Option 2 — Download the installer manually"}
Rather not install Homebrew? Download the \`.dmg\` from [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop) and install it like any other app.

The download page offers two builds by chip — check yours with a command instead of guessing:

\`\`\`bash
uname -m
\`\`\`

\`arm64\` → take the **Apple Silicon** build. \`x86_64\` → take the **Intel** build. The wrong build simply won't launch.
:::

:::panel{title="Start the engine and verify"}
Installing does NOT start the engine. Start it from the terminal:

\`\`\`bash
open -a Docker
\`\`\`

The engine takes roughly 10-30 seconds to come up. Verify with:

\`\`\`bash
docker info
\`\`\`

This asks the daemon directly — a block of output (\`Server Version: …\`) means the engine is alive. \`Cannot connect to the Docker daemon\` means it isn't up yet: wait a moment and run it again.

Note that \`docker --version\` is NOT a substitute — it only reads the CLI version and answers happily while the engine is stopped.

Run one container to be sure:

\`\`\`bash
docker run --rm hello-world
\`\`\`
:::
::::
`,
}
