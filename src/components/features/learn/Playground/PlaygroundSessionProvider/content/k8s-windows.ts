import type { LocalizedGuide } from "./types"

/**
 * Windows minikube + kubectl install guide (Setup: engine step). minikube cần MỘT
 * driver (docker/hyperv) — playground chốt `--driver=docker` vì học viên vừa
 * qua playground Docker. Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH — không mô tả GUI.
 */
export const K8S_WINDOWS_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Điều kiện trước — một driver để chạy cluster"}
minikube không tự chạy Kubernetes, nó cần **driver** dựng máy ảo hoặc container làm node. Playground này dùng \`--driver=docker\` vì bạn đã cài Docker Desktop ở playground trước.

Kiểm Docker còn sống:

\`\`\`bash
docker info
\`\`\`

Báo lỗi kết nối thì mở lại Docker Desktop rồi làm tiếp.

Máy bật Hyper-V cũng chạy được (\`minikube start --driver=hyperv\`), nhưng phải mở PowerShell quyền Administrator.
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

Mở lại PowerShell rồi cài cả 2 công cụ (gói \`kubectl\` trên Chocolatey tên là \`kubernetes-cli\`):

\`\`\`bash
choco install minikube kubernetes-cli
\`\`\`
:::

:::panel{title="Cách 2 — winget hoặc tải binary thủ công"}
Dùng winget (có sẵn trên Windows 10/11 bản mới):

\`\`\`bash
winget install Kubernetes.minikube Kubernetes.kubectl
\`\`\`

Hoặc tải 2 file \`.exe\` rồi đưa vào PATH:

\`\`\`bash
curl.exe -Lo minikube.exe https://storage.googleapis.com/minikube/releases/latest/minikube-windows-amd64.exe
curl.exe -LO "https://dl.k8s.io/release/v1.31.0/bin/windows/amd64/kubectl.exe"
\`\`\`

Chuyển 2 file vào 1 thư mục nằm trong PATH (vd \`C:\\bin\`, nhớ thêm thư mục đó vào biến môi trường \`Path\` nếu chưa có).
:::

:::panel{title="Xác nhận đã cài đúng"}
Mở terminal MỚI (terminal cũ chưa thấy lệnh vừa cài):

\`\`\`bash
minikube version
kubectl version --client
\`\`\`

Cả hai phải ra số phiên bản, không phải \`command not found\`.

Cluster thật sẽ do bước đầu tiên trong playground tạo. Muốn chắc minikube chạy được thì dựng thử rồi xoá (lần đầu tải image node nên mất vài phút):

\`\`\`bash
minikube start --driver=docker
kubectl get nodes
minikube delete
\`\`\`

\`kubectl get nodes\` ra 1 node \`Ready\` là mọi thứ đã thông.
:::
::::
`,
    en: `
::::accordion
:::panel{title="Prerequisite — a driver to run the cluster on"}
minikube doesn't run Kubernetes by itself; it needs a **driver** to build the VM or container that acts as the node. This playground uses \`--driver=docker\` since you already installed Docker Desktop in the previous playground.

Check Docker is alive:

\`\`\`bash
docker info
\`\`\`

On a connection error, start Docker Desktop again and continue.

Hyper-V works too (\`minikube start --driver=hyperv\`), but you must run it from an Administrator PowerShell.
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

Reopen PowerShell, then install both tools (Chocolatey's \`kubectl\` package is named \`kubernetes-cli\`):

\`\`\`bash
choco install minikube kubernetes-cli
\`\`\`
:::

:::panel{title="Option 2 — winget or download the binaries manually"}
Use winget (ships with recent Windows 10/11):

\`\`\`bash
winget install Kubernetes.minikube Kubernetes.kubectl
\`\`\`

Or download the two \`.exe\` files and put them on your PATH:

\`\`\`bash
curl.exe -Lo minikube.exe https://storage.googleapis.com/minikube/releases/latest/minikube-windows-amd64.exe
curl.exe -LO "https://dl.k8s.io/release/v1.31.0/bin/windows/amd64/kubectl.exe"
\`\`\`

Move both into a folder that's on your PATH (e.g. \`C:\\bin\` — add that folder to the \`Path\` environment variable if it isn't there yet).
:::

:::panel{title="Verify the install"}
Open a NEW terminal (an already-open one won't see the freshly installed commands):

\`\`\`bash
minikube version
kubectl version --client
\`\`\`

Both must print a version rather than \`command not found\`.

The playground's first hands-on step creates the real cluster. To be sure minikube works, spin one up and tear it down (the first run pulls the node image, so give it a few minutes):

\`\`\`bash
minikube start --driver=docker
kubectl get nodes
minikube delete
\`\`\`

One \`Ready\` node from \`kubectl get nodes\` means everything is wired up.
:::
::::
`,
}
