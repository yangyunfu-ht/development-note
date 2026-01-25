# Git 版本控制

Git 是目前世界上最先进的分布式版本控制系统。

## 1. 基础命令 (Basic)

### 初始化与获取

- `git init`: 在当前目录初始化一个新的 Git 仓库。
- `git clone <url>`: 克隆远程仓库到本地。

### 配置

- `git config --global user.name "Your Name"`: 设置全局用户名。
- `git config --global user.email "email@example.com"`: 设置全局邮箱。
- `git config --list`: 查看当前配置。

### 提交与状态

- `git status`: 查看工作区状态（哪些文件被修改、哪些是新文件）。
- `git add <file>`: 将文件添加到暂存区 (Staging Area)。
  - `git add .`: 添加当前目录下所有变更。
- `git commit -m "message"`: 将暂存区的内容提交到本地仓库。
- `git log`: 查看提交历史。
  - `git log --oneline`: 简洁模式查看历史。

## 2. 分支管理 (Branching)

### 创建与切换

- `git branch`: 列出所有本地分支。
- `git branch <branch-name>`: 创建新分支。
- `git checkout <branch-name>`: 切换到指定分支。
  - `git switch <branch-name>`: 推荐使用 switch 切换分支（Git 2.23+）。
- `git checkout -b <branch-name>`: 创建并切换到新分支。

### 合并与删除

- `git merge <branch-name>`: 将指定分支合并到当前分支。
- `git branch -d <branch-name>`: 删除已合并的分支。
- `git branch -D <branch-name>`: 强制删除未合并的分支。

## 3. 远程操作 (Remote)

- `git remote -v`: 查看远程仓库信息。
- `git remote add origin <url>`: 添加远程仓库地址。
- `git pull`: 拉取远程分支并自动合并 (fetch + merge)。
- `git fetch`: 拉取远程更新但**不**合并。
- `git push origin <branch-name>`: 将本地分支推送到远程仓库。
  - `git push -u origin <branch-name>`: 推送并设置上游关联（第一次推送时使用）。

## 4. 撤销与回滚 (Undo & Rollback)

### 撤销工作区修改

- `git checkout -- <file>`: 丢弃工作区的修改（回到最近一次 commit 或 add 的状态）。
  - `git restore <file>`: 推荐使用 restore (Git 2.23+)。

### 撤销暂存区

- `git reset HEAD <file>`: 将文件从暂存区移出（不改变文件内容）。
  - `git restore --staged <file>`: 推荐使用 restore (Git 2.23+)。

### 版本回退 (Reset)

- `git reset --soft <commit-id>`: 回退到指定版本，**保留**暂存区和工作区的修改。
- `git reset --mixed <commit-id>`: (默认) 回退到指定版本，**清空**暂存区，**保留**工作区的修改。
- `git reset --hard <commit-id>`: 回退到指定版本，**清空**暂存区和工作区（**慎用**，修改会丢失）。

### 反做 (Revert)

- `git revert <commit-id>`: 生成一个新的提交来撤销某次提交的修改（不破坏历史记录，适合公共分支）。

## 5. 高级操作 (Advanced)

### 暂存 (Stash)

当手头工作没有完成时，先把工作现场 `stash` 一下，然后去修 bug，修完回来再恢复。

- `git stash`: 保存当前进度。
- `git stash list`: 查看所有 stash。
- `git stash pop`: 恢复最近一次 stash 并删除记录。

### 变基 (Rebase)

`rebase` (变基) 可以让提交历史变得线性整洁。

- `git rebase <branch-name>`: 将当前分支变基到目标分支上。
  - **注意**：不要在公共分支（如 master/main）上使用 rebase，会破坏历史记录。

### 拣选 (Cherry-pick)

- `git cherry-pick <commit-id>`: 将特定的某次提交应用到当前分支。

## 6. Git Flow 简述

Git Flow 是一种标准的 Git 分支管理工作流：

- **master/main**: 主分支，用于发布生产环境代码。
- **develop**: 开发分支，用于日常开发。
- **feature/**: 功能分支，从 develop 切出，开发完合并回 develop。
- **release/**: 发布分支，从 develop 切出，测试完成后合并回 master 和 develop。
- **hotfix/**: 补丁分支，从 master 切出，修复紧急 bug 后合并回 master 和 develop。
