import type { LocalizedGuide } from "./types"

/**
 * Linux minikube + kubectl install guide (Setup: engine step). minikube cần MỘT
 * driver — playground chốt `--driver=docker` vì học viên vừa qua playground
 * Docker. Mọi tín hiệu KIỂM ĐƯỢC BẰNG LỆNH — không mô tả GUI.
 */
export const K8S_LINUX_GUIDE: LocalizedGuide = {
    vi: `
::::accordion
:::panel{title="Điều kiện trước — một driver để chạy cluster"}
minikube không tự chạy Kubernetes, nó cần **driver** dựng máy ảo hoặc container làm node. Playground này dùng \`--driver=docker\` vì bạn đã cài Docker ở playground trước.

Kiểm Docker còn sống:

\`\`\`bash
systemctl is-active docker
docker info
\`\`\`

Chưa \`active\` thì \`sudo systemctl start docker\`; báo \`permission denied\` thì bạn chưa vào nhóm \`docker\` — quay lại phần cài Docker làm nốt bước \`usermod\`.

Máy có KVM cũng chạy được (\`minikube start --driver=kvm2\`) nếu bạn muốn node là máy ảo thật thay vì container.
:::

:::panel{title="Cách 1 — Tải binary chính thức (khuyên dùng)"}
Hai công cụ này chỉ là 1 file thực thi, tải về rồi đưa vào PATH là xong.

\`minikube\` (thay \`amd64\` bằng \`arm64\` nếu \`uname -m\` ra \`aarch64\`):

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
\`\`\`

\`kubectl\`:

\`\`\`bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
\`\`\`
:::

:::panel{title="Cách 2 — Cài qua package manager"}
Debian/Ubuntu có gói \`.deb\` chính thức của minikube:

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
\`\`\`

\`kubectl\` cài bằng snap:

\`\`\`bash
sudo snap install kubectl --classic
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
systemctl is-active docker
docker info
\`\`\`

Not \`active\` → run \`sudo systemctl start docker\`. \`permission denied\` → you're not in the \`docker\` group yet; go back to the Docker install and finish the \`usermod\` step.

KVM works too (\`minikube start --driver=kvm2\`) if you'd rather the node be a real VM than a container.
:::

:::panel{title="Option 1 — Official binaries (recommended)"}
Both tools are single executables — download, then move onto your PATH.

\`minikube\` (swap \`amd64\` for \`arm64\` if \`uname -m\` prints \`aarch64\`):

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
\`\`\`

\`kubectl\`:

\`\`\`bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
\`\`\`
:::

:::panel{title="Option 2 — Install from a package manager"}
Debian/Ubuntu have an official minikube \`.deb\`:

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
\`\`\`

Install \`kubectl\` with snap:

\`\`\`bash
sudo snap install kubectl --classic
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
