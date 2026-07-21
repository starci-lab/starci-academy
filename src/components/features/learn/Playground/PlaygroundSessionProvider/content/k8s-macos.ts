import type { LocalizedGuide } from "./types"

/**
 * macOS minikube + kubectl install guide (Setup: engine step). minikube cần MỘT
 * driver để chạy cluster (docker/hyperkit/virtualbox…) — playground chốt
 * `--driver=docker` vì học viên vừa qua playground Docker nên đã có sẵn.
 * Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH — không mô tả GUI.
 */
export const K8S_MACOS_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Điều kiện trước — một driver để chạy cluster"}
minikube không tự chạy Kubernetes, nó cần **driver** dựng máy ảo hoặc container làm node. Playground này dùng \`--driver=docker\` vì bạn đã cài Docker ở playground trước.

Kiểm Docker còn sống:

\`\`\`bash
docker info
\`\`\`

Báo \`Cannot connect to the Docker daemon\` thì mở lại engine (\`open -a Docker\`) rồi làm tiếp.

Máy không dùng Docker cũng được — minikube nhận cả \`hyperkit\`, \`virtualbox\`, \`podman\`; đổi cờ \`--driver\` cho khớp thứ bạn có (\`minikube start --driver=hyperkit\`).
:::

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

Có Homebrew rồi thì cài cả 2 công cụ:

\`\`\`bash
brew install minikube kubectl
\`\`\`
:::

:::panel{title="Cách 2 — Tải binary thủ công"}
Không muốn cài Homebrew? Hai công cụ này chỉ là 1 file thực thi, tải về rồi đưa vào PATH là xong.

\`minikube\` (thay \`arm64\` bằng \`amd64\` nếu \`uname -m\` ra \`x86_64\`):

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-arm64
sudo install minikube-darwin-arm64 /usr/local/bin/minikube
\`\`\`

\`kubectl\`:

\`\`\`bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
\`\`\`
:::

:::panel{title="Xác nhận đã cài đúng"}
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
minikube doesn't run Kubernetes by itself; it needs a **driver** to build the VM or container that acts as the node. This playground uses \`--driver=docker\` since you already installed Docker in the previous playground.

Check Docker is alive:

\`\`\`bash
docker info
\`\`\`

If it reports \`Cannot connect to the Docker daemon\`, start the engine again (\`open -a Docker\`) and continue.

You don't have to use Docker — minikube also accepts \`hyperkit\`, \`virtualbox\` and \`podman\`; just match the \`--driver\` flag to whatever you have (\`minikube start --driver=hyperkit\`).
:::

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

With Homebrew in place, install both tools:

\`\`\`bash
brew install minikube kubectl
\`\`\`
:::

:::panel{title="Option 2 — Download the binaries manually"}
Rather not install Homebrew? Both tools are single executables — download, then move onto your PATH.

\`minikube\` (swap \`arm64\` for \`amd64\` if \`uname -m\` prints \`x86_64\`):

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-arm64
sudo install minikube-darwin-arm64 /usr/local/bin/minikube
\`\`\`

\`kubectl\`:

\`\`\`bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
\`\`\`
:::

:::panel{title="Verify the install"}
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
