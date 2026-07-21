import type { LocalizedGuide } from "./types"

/**
 * Linux Docker install guide (Setup: engine step) — the official convenience script
 * + the distro-package route, the post-install "run without sudo" group step,
 * and a verify step. Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH (`systemctl is-active`,
 * `docker info`, `id -nG`) — không mô tả GUI.
 */
export const DOCKER_LINUX_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Cách 1 — Script cài đặt chính thức (khuyên dùng)"}
\`\`\`bash
curl -fsSL https://get.docker.com | sh
\`\`\`

Script tự nhận diện distro (Ubuntu/Debian/Fedora/CentOS…) và cài **Docker Engine** trực tiếp — Linux không cần Docker Desktop như Mac/Windows.
:::

:::panel{title="Cách 2 — Cài qua package manager của distro"}
Không muốn pipe script từ internet vào \`sh\`? Cài thủ công theo distro, ví dụ Ubuntu/Debian:

\`\`\`bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
\`\`\`

Distro khác xem hướng dẫn tương ứng tại [docs.docker.com/engine/install](https://docs.docker.com/engine/install).
:::

:::panel{title="Bắt buộc sau khi cài — dùng docker không cần sudo"}
\`\`\`bash
sudo usermod -aG docker $USER
\`\`\`

Chạy xong phải **đăng xuất rồi đăng nhập lại** (hoặc \`newgrp docker\`) để nhóm quyền có hiệu lực. Xác nhận đã vào nhóm:

\`\`\`bash
id -nG | tr ' ' '\\n' | grep -x docker
\`\`\`

In ra \`docker\` là được; không in gì nghĩa là chưa có hiệu lực → mọi lệnh \`docker\` sẽ báo \`permission denied\`.
:::

:::panel{title="Khởi động engine + xác nhận"}
Trên distro dùng systemd, engine thường tự chạy sau khi cài. Kiểm:

\`\`\`bash
systemctl is-active docker
\`\`\`

Ra \`active\` là đang chạy. Ra \`inactive\` thì bật lên (\`enable\` để tự chạy sau mỗi lần khởi động máy):

\`\`\`bash
sudo systemctl start docker
sudo systemctl enable docker
\`\`\`

Rồi xác nhận daemon trả lời thật:

\`\`\`bash
docker info
\`\`\`

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
:::panel{title="Option 1 — Official install script (recommended)"}
\`\`\`bash
curl -fsSL https://get.docker.com | sh
\`\`\`

The script detects your distro (Ubuntu/Debian/Fedora/CentOS…) and installs **Docker Engine** directly — Linux doesn't need Docker Desktop the way Mac/Windows do.
:::

:::panel{title="Option 2 — Install from your distro's package manager"}
Rather not pipe a script from the internet into \`sh\`? Install by hand for your distro, e.g. Ubuntu/Debian:

\`\`\`bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
\`\`\`

For other distros see the matching guide at [docs.docker.com/engine/install](https://docs.docker.com/engine/install).
:::

:::panel{title="Required after install — use docker without sudo"}
\`\`\`bash
sudo usermod -aG docker $USER
\`\`\`

You must **log out and back in** (or run \`newgrp docker\`) for the group to take effect. Confirm you're in it:

\`\`\`bash
id -nG | tr ' ' '\\n' | grep -x docker
\`\`\`

Printing \`docker\` means you're set; printing nothing means it hasn't taken effect yet → every \`docker\` command will fail with \`permission denied\`.
:::

:::panel{title="Start the engine and verify"}
On systemd distros the engine usually starts itself after install. Check:

\`\`\`bash
systemctl is-active docker
\`\`\`

\`active\` means it's running. \`inactive\` means start it (\`enable\` makes it come back after each reboot):

\`\`\`bash
sudo systemctl start docker
sudo systemctl enable docker
\`\`\`

Then confirm the daemon actually answers:

\`\`\`bash
docker info
\`\`\`

Note that \`docker --version\` is NOT a substitute — it only reads the CLI version and answers happily while the engine is stopped.

Run one container to be sure:

\`\`\`bash
docker run --rm hello-world
\`\`\`
:::
::::
`,
}
