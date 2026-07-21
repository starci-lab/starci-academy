import type { LocalizedGuide } from "./types"

/**
 * Windows Docker install guide (Setup: engine step) — the WSL2 prerequisite,
 * Chocolatey route including installing Chocolatey itself, winget / the plain
 * .exe installer, and a verify step. Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH
 * (`wsl -l -v`, `docker info`) — không mô tả GUI (icon khay hệ thống).
 */
export const DOCKER_WINDOWS_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Điều kiện trước — WSL2"}
Docker Desktop trên Windows chạy engine bên trong **WSL2** (Windows Subsystem for Linux 2), không chạy native. Mở PowerShell **với quyền Administrator** rồi chạy:

\`\`\`bash
wsl --install
\`\`\`

Máy chưa có WSL sẽ cần khởi động lại 1 lần. Xác nhận sau khi khởi động lại:

\`\`\`bash
wsl -l -v
\`\`\`

Bảng in ra phải có ít nhất 1 distro ở cột \`VERSION\` là \`2\`.
:::

:::panel{title="Cách 1 — Cài qua Chocolatey (khuyên dùng)"}
Kiểm xem đã có Chocolatey chưa:

\`\`\`bash
choco --version
\`\`\`

Chưa có thì mở PowerShell **với quyền Administrator** và cài bằng lệnh chính thức từ [chocolatey.org/install](https://chocolatey.org/install):

\`\`\`bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
\`\`\`

Mở lại PowerShell rồi \`choco --version\` phải ra số phiên bản. Có rồi thì cài Docker:

\`\`\`bash
choco install docker-desktop
\`\`\`
:::

:::panel{title="Cách 2 — winget hoặc installer thủ công"}
Không muốn cài Chocolatey? Dùng winget (có sẵn trên Windows 10/11 bản mới):

\`\`\`bash
winget install Docker.DockerDesktop
\`\`\`

Hoặc tải bộ cài \`.exe\` tại [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop) và chạy như cài phần mềm thường.
:::

:::panel{title="Khởi động engine + xác nhận"}
Cài xong engine CHƯA chạy. Khởi động bằng lệnh:

\`\`\`bash
Start-Process "$env:ProgramFiles\\Docker\\Docker\\Docker Desktop.exe"
\`\`\`

Engine mất khoảng 30-60 giây để lên. Xác nhận:

\`\`\`bash
docker info
\`\`\`

Lệnh này hỏi thẳng daemon — ra được khối thông tin (\`Server Version: …\`) nghĩa là engine sống. Báo lỗi kết nối thì engine chưa lên (đợi thêm rồi chạy lại), hoặc WSL2 backend chưa bật.

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
:::panel{title="Prerequisite — WSL2"}
On Windows, Docker Desktop runs its engine inside **WSL2** (Windows Subsystem for Linux 2), not natively. Open PowerShell **as Administrator** and run:

\`\`\`bash
wsl --install
\`\`\`

A machine with no WSL yet needs one reboot. Verify after rebooting:

\`\`\`bash
wsl -l -v
\`\`\`

The table must list at least one distro with \`2\` in the \`VERSION\` column.
:::

:::panel{title="Option 1 — Install via Chocolatey (recommended)"}
Check whether you already have Chocolatey:

\`\`\`bash
choco --version
\`\`\`

If not, open PowerShell **as Administrator** and install it with the official command from [chocolatey.org/install](https://chocolatey.org/install):

\`\`\`bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
\`\`\`

Reopen PowerShell and \`choco --version\` should print a version. Then install Docker:

\`\`\`bash
choco install docker-desktop
\`\`\`
:::

:::panel{title="Option 2 — winget or the manual installer"}
Rather not install Chocolatey? Use winget (ships with recent Windows 10/11):

\`\`\`bash
winget install Docker.DockerDesktop
\`\`\`

Or download the \`.exe\` from [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop) and run it like any other installer.
:::

:::panel{title="Start the engine and verify"}
Installing does NOT start the engine. Start it from the terminal:

\`\`\`bash
Start-Process "$env:ProgramFiles\\Docker\\Docker\\Docker Desktop.exe"
\`\`\`

The engine takes roughly 30-60 seconds to come up. Verify with:

\`\`\`bash
docker info
\`\`\`

This asks the daemon directly — a block of output (\`Server Version: …\`) means the engine is alive. A connection error means it isn't up yet (wait and retry), or the WSL2 backend is off.

Note that \`docker --version\` is NOT a substitute — it only reads the CLI version and answers happily while the engine is stopped.

Run one container to be sure:

\`\`\`bash
docker run --rm hello-world
\`\`\`
:::
::::
`,
}
