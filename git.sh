#!/bin/bash
# git-force-pull.sh - 强制拉取远程分支并覆盖本地所有文件
# 用法: $0 [分支名]   # 缺省分支为 main

set -e  # 任何命令失败即退出

# 显示用法
usage() {
    echo "用法: $0 [分支名]"
    echo "缺省分支为 main"
    exit 1
}

# 检查参数（多于 1 个才报错；0 个 = 用 main，1 个 = 用指定分支）
if [ $# -gt 1 ]; then
    usage
fi

# 缺省分支
BRANCH="${1:-main}"
REMOTE="origin"  # 可修改为您的远程名称

# 检查当前目录是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误：当前目录不是一个 Git 仓库"
    exit 1
fi

# 获取最新远程信息
echo "正在获取远程最新数据..."
git fetch "$REMOTE"

# 检查远程分支是否存在
if ! git show-ref --verify --quiet "refs/remotes/$REMOTE/$BRANCH"; then
    echo "错误：远程分支 $REMOTE/$BRANCH 不存在"
    exit 1
fi

# 强制切换/创建本地分支并重置为远程分支状态
# 添加 -f 选项以覆盖本地未跟踪文件（如脚本自身）
echo "正在强制更新并切换到分支 '$BRANCH'..."
git checkout -f -B "$BRANCH" "$REMOTE/$BRANCH"

# 清理所有未跟踪的文件和目录（包括 .gitignore 中忽略的）
# 此时工作区已与远程一致，此步骤删除其他未被跟踪的本地文件
echo "正在删除未跟踪的文件和目录..."
git clean -fd

echo "完成！本地代码已完全与 $REMOTE/$BRANCH 一致。"