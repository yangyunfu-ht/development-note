# SSH Key 生成与配置指南

本文档详细介绍了在 Windows 和 macOS 系统下生成和配置 SSH Key 的完整流程，用于实现与 GitHub、GitLab 等远程代码仓库的免密安全通信。

## 1. 检查现有 SSH Key

在生成新的 SSH Key 之前，建议先检查电脑上是否已经存在 SSH Key。

### Windows / macOS

打开终端（Terminal 或 Git Bash），运行以下命令：

```bash
ls -al ~/.ssh
```

查看是否存在 `id_rsa` 和 `id_rsa.pub` (或 `id_ed25519` 等) 文件。

- `id_rsa`: 私钥 (Private Key)，**切勿泄露**。
- `id_rsa.pub`: 公钥 (Public Key)，用于配置到远程仓库。

如果存在且你记得密码（或未设置密码），可以直接使用。如果不存在或需要重新生成，请继续下一步。

## 2. 生成新的 SSH Key

我们将使用 `ed25519` 算法（推荐）或 `rsa` 算法生成密钥。

### macOS / Windows (Git Bash)

在终端中运行以下命令（请替换为你的邮箱）：

```bash
# 推荐使用 ed25519 算法 (更安全且性能更好)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或者使用 rsa 算法 (兼容性更好)
# ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

系统会提示你确认文件保存路径和设置密码：

1.  **Enter file in which to save the key**: 直接按回车，使用默认路径 (`~/.ssh/id_ed25519`)。
2.  **Enter passphrase**: 输入密钥密码（可选，推荐留空以实现免密推送）。
3.  **Enter same passphrase again**: 再次输入密码（如果上一步留空，这里也直接回车）。

成功后，你会看到类似 "The key's randomart image is..." 的输出。

## 3. 将 SSH Key 添加到 ssh-agent

`ssh-agent` 是一个密钥管理器，可以让你在会话中免去重复输入密钥密码的麻烦。

### macOS

1.  后台启动 ssh-agent：

    ```bash
    eval "$(ssh-agent -s)"
    ```

2.  修改 `~/.ssh/config` 文件，以便自动加载密钥到 ssh-agent 并存储密码到钥匙串（Keychain）：

    检查文件是否存在，如果不存在则创建：

    ```bash
    touch ~/.ssh/config
    ```

    打开并编辑该文件（可以使用 `vim` 或 `code`），添加以下内容：

    ```text
    Host *
      AddKeysToAgent yes
      UseKeychain yes
      IdentityFile ~/.ssh/id_ed25519
    ```

    _(注：如果你使用的是 `id_rsa`，请将 `id_ed25519` 替换为 `id_rsa`)_

3.  将私钥添加到 ssh-agent：
    ```bash
    ssh-add --apple-use-keychain ~/.ssh/id_ed25519
    ```
    _(注：如果不使用 `--apple-use-keychain` 选项，每次重启可能需要重新添加)_

### Windows (Git Bash / PowerShell)

1.  后台启动 ssh-agent：

    **Git Bash:**

    ```bash
    eval "$(ssh-agent -s)"
    ```

    **PowerShell (管理员身份):**

    ```powershell
    # 确保 ssh-agent 服务已启动
    Get-Service -Name ssh-agent | Set-Service -StartupType Manual
    Start-Service ssh-agent
    ```

2.  将私钥添加到 ssh-agent：
    ```bash
    ssh-add ~/.ssh/id_ed25519
    ```

## 4. 将 SSH 公钥添加到远程仓库 (GitHub/GitLab)

1.  **复制公钥内容**：

    **macOS:**

    ```bash
    pbcopy < ~/.ssh/id_ed25519.pub
    ```

    **Windows (Git Bash):**

    ```bash
    cat ~/.ssh/id_ed25519.pub | clip
    ```

    或者直接用文本编辑器打开 `.pub` 文件并复制所有内容。

2.  **粘贴到 GitHub/GitLab**：
    - **GitHub**: Settings -> SSH and GPG keys -> New SSH key
    - **GitLab**: User Settings -> SSH Keys -> Add an SSH key

    - **Title**: 给这个 Key 起个名字（例如 "My MacBook Pro"）。
    - **Key**: 粘贴刚才复制的公钥内容（以 `ssh-ed25519` 或 `ssh-rsa` 开头）。
    - 点击 **Add SSH key**。

## 5. 验证连接

在终端中运行以下命令测试连接：

**GitHub:**

```bash
ssh -T git@github.com
```

**GitLab:**

```bash
ssh -T git@gitlab.com
```

- 第一次连接时，会提示 `Are you sure you want to continue connecting (yes/no/[fingerprint])?`，输入 `yes` 并回车。
- 如果看到 `Hi username! You've successfully authenticated...`，说明配置成功！

## 6. 常见问题排查

- **Permission denied (publickey)**:
  - 确保公钥已正确添加到远程仓库。
  - 确保私钥已添加到 `ssh-agent` (`ssh-add -l` 查看)。
  - 检查本地使用的私钥与远程仓库的公钥是否匹配。

- **端口问题**:
  - 如果公司网络屏蔽了 22 端口，可以尝试使用 443 端口连接 GitHub (需要在 `~/.ssh/config` 中额外配置)。
