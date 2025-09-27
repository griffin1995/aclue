#!/bin/bash
# Worktree Status Display Script
# Shows status of all active worktrees with context information

set -e

MAIN_REPO="/home/jack/Documents/my_private_tutor_online"
WORKTREE_BASE="/home/jack/Documents/mpto-worktrees"

cd "$MAIN_REPO"

echo "🌳 Git Worktree Status Report"
echo "==============================="
echo "📅 Generated: $(date)"
echo "📍 Main repo: $MAIN_REPO"
echo "📂 Worktrees: $WORKTREE_BASE"
echo ""

# Check if any worktrees exist
if ! git worktree list --porcelain | grep -q "worktree"; then
    echo "ℹ️  No active worktrees found."
    echo "💡 Create one with: .claude/scripts/create-worktree.sh <name> <agent>"
    exit 0
fi

echo "📊 Active Worktrees:"
echo "-------------------"

# Parse git worktree list output
current_worktree=""
current_path=""
current_branch=""

git worktree list --porcelain | while IFS= read -r line; do
    if [[ $line == worktree* ]]; then
        # Extract path from worktree line
        current_path=$(echo "$line" | cut -d' ' -f2-)
        current_worktree=$(basename "$current_path")
    elif [[ $line == branch* ]]; then
        # Extract branch name
        current_branch=$(echo "$line" | cut -d' ' -f2-)

        # Skip main repository entry
        if [[ "$current_path" == "$MAIN_REPO" ]]; then
            continue
        fi

        echo "🔹 $current_worktree"
        echo "   Branch: $current_branch"
        echo "   Path: $current_path"

        # Check if worktree directory exists and get context
        if [ -d "$current_path" ]; then
            cd "$current_path"

            # Get git status
            ahead=$(git rev-list --count origin/master..HEAD 2>/dev/null || echo "0")
            behind=$(git rev-list --count HEAD..origin/master 2>/dev/null || echo "0")
            modified=$(git status --porcelain | wc -l)

            echo "   Status: $modified modified files, $ahead ahead, $behind behind"

            # Read worktree context if available
            if [ -f ".worktree-context" ]; then
                agent=$(grep "PRIMARY_AGENT=" .worktree-context | cut -d'=' -f2)
                description=$(grep "DESCRIPTION=" .worktree-context | cut -d'=' -f2)
                status=$(grep "STATUS=" .worktree-context | cut -d'=' -f2)

                echo "   Agent: $agent"
                echo "   Status: $status"
                if [ -n "$description" ] && [ "$description" != "" ]; then
                    echo "   Description: $description"
                fi
            fi

            # Check for recent commits
            last_commit=$(git log -1 --format="%h - %s (%cr)" 2>/dev/null || echo "No commits")
            echo "   Last commit: $last_commit"

            cd "$MAIN_REPO"
        else
            echo "   ⚠️  Worktree directory not found!"
        fi

        echo ""
    fi
done

echo "🔧 Management Commands:"
echo "----------------------"
echo "Create worktree:  .claude/scripts/create-worktree.sh <name> <agent>"
echo "Remove worktree:  git worktree remove ../mpto-worktrees/<name>"
echo "List all:         git worktree list"
echo "Sync with main:   cd <worktree> && git fetch origin && git rebase origin/master"
echo ""

# Check for context file and show summary
if [ -f ".claude/context/project-state.json" ]; then
    echo "📋 Project Context Summary:"
    echo "---------------------------"

    # Extract key info using basic tools (avoiding jq dependency)
    version=$(grep '"version"' .claude/context/project-state.json | cut -d'"' -f4)
    updated=$(grep '"lastUpdated"' .claude/context/project-state.json | cut -d'"' -f4)

    echo "Context version: $version"
    echo "Last updated: $updated"

    # Count active worktrees in context
    active_count=$(grep -c '"name"' .claude/context/project-state.json 2>/dev/null || echo "0")
    echo "Tracked worktrees: $active_count"
fi
