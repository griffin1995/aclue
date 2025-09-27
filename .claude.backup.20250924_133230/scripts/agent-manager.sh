#!/bin/bash
# Comprehensive Agent Management System for Claude Code Ecosystem
# Supports all 50+ agents with intelligent coordination and monitoring

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_REPO="$(dirname "$(dirname "$SCRIPT_DIR")")"
WORKTREE_BASE_DIR="/home/jack/Documents/mpto-worktrees"
AGENT_SELECTOR="$SCRIPT_DIR/agent-selector.js"
CONTEXT_DIR="$MAIN_REPO/.claude/context"
AGENTS_DIR="$MAIN_REPO/.claude/agents"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis for better UX
ROBOT="🤖"
CHECK="✅"
WARN="⚠️"
INFO="ℹ️"
ROCKET="🚀"
BRAIN="🧠"
GEAR="⚙️"
CHART="📊"
BOOK="📚"
TARGET="🎯"

show_help() {
    echo -e "${CYAN}🤖 Claude Code Agent Management System${NC}"
    echo ""
    echo -e "${YELLOW}USAGE:${NC}"
    echo "  $0 <command> [options]"
    echo ""
    echo -e "${YELLOW}COMMANDS:${NC}"
    echo -e "  ${GREEN}list${NC}                    List all available agents with capabilities"
    echo -e "  ${GREEN}status${NC}                  Show status of all active worktrees and agents"
    echo -e "  ${GREEN}recommend${NC} <task>        Get agent recommendations for a task"
    echo -e "  ${GREEN}create${NC} <name> [agent]   Create new worktree with agent assignment"
    echo -e "  ${GREEN}assign${NC} <worktree> <agent>  Reassign agent to existing worktree"
    echo -e "  ${GREEN}performance${NC}             Show agent performance analytics"
    echo -e "  ${GREEN}workflows${NC}               Show example multi-agent workflows"
    echo -e "  ${GREEN}validate${NC}                Validate agent ecosystem integrity"
    echo -e "  ${GREEN}cleanup${NC}                 Clean up inactive worktrees"
    echo ""
    echo -e "${YELLOW}EXAMPLES:${NC}"
    echo "  $0 recommend 'Optimize React component performance'"
    echo "  $0 create feature-auth security-auditor"
    echo "  $0 assign existing-worktree frontend-developer"
    echo "  $0 list --by-domain frontend"
    echo "  $0 status --detailed"
    echo ""
    echo -e "${YELLOW}AGENT CATEGORIES:${NC}"
    echo -e "  ${PURPLE}Frontend:${NC} frontend-developer, ui-ux-designer, typescript-pro"
    echo -e "  ${PURPLE}Backend:${NC} backend-architect, python-pro, database-admin"
    echo -e "  ${PURPLE}DevOps:${NC} devops-troubleshooter, cloud-architect, deployment-engineer"
    echo -e "  ${PURPLE}Quality:${NC} test-automator, security-auditor, performance-engineer"
    echo -e "  ${PURPLE}Specialized:${NC} ai-engineer, data-scientist, mobile-developer"
    echo -e "  ${PURPLE}Coordination:${NC} context-manager, architect-reviewer, code-reviewer"
}

list_agents() {
    local filter="$1"
    local detailed="$2"

    echo -e "${CYAN}${ROBOT} Available Claude Code Agents${NC}"
    echo ""

    if [ ! -f "$AGENTS_DIR/agent-capability-matrix.json" ]; then
        echo -e "${RED}${WARN} Agent capability matrix not found${NC}"
        return 1
    fi

    # Use node to parse and display agents
    node -e "
        const fs = require('fs');
        const matrix = JSON.parse(fs.readFileSync('$AGENTS_DIR/agent-capability-matrix.json', 'utf8'));
        const agents = matrix.agents || {};

        const filter = '$filter';
        const detailed = '$detailed' === '--detailed';

        let count = 0;
        Object.entries(agents).forEach(([name, data]) => {
            if (filter && !data.capabilities.domains.some(d => d.includes(filter)) &&
                !data.specializations.some(s => s.includes(filter))) {
                return;
            }

            count++;
            const priority = data.priority || 'medium';
            const priorityEmoji = priority === 'critical' ? '🔴' :
                                 priority === 'high' ? '🟡' :
                                 priority === 'medium' ? '🟢' : '⚪';

            console.log(\`\${priorityEmoji} \${name}\`);
            console.log(\`   \${data.description}\`);

            if (detailed) {
                console.log(\`   Specializations: \${data.specializations.join(', ')}\`);
                console.log(\`   Domains: \${data.capabilities.domains.join(', ')}\`);
                console.log(\`   Complexity: \${data.capabilities.complexity}\`);
                console.log(\`   Languages: \${data.capabilities.languages.join(', ')}\`);
                if (data.worksWith && data.worksWith.length > 0) {
                    console.log(\`   Works with: \${data.worksWith.slice(0, 3).join(', ')}\${data.worksWith.length > 3 ? '...' : ''}\`);
                }
                console.log('');
            }
        });

        console.log(\`\\n\${count} agents \${filter ? 'matching filter' : 'available'}\`);
    " 2>/dev/null || {
        echo -e "${RED}${WARN} Error parsing agent matrix${NC}"
        return 1
    }
}

show_status() {
    local detailed="$1"

    echo -e "${CYAN}${CHART} Agent Ecosystem Status${NC}"
    echo ""

    # Count total available agents
    local total_agents=0
    if [ -f "$AGENTS_DIR/agent-capability-matrix.json" ]; then
        total_agents=$(node -e "
            const matrix = JSON.parse(require('fs').readFileSync('$AGENTS_DIR/agent-capability-matrix.json', 'utf8'));
            console.log(Object.keys(matrix.agents || {}).length);
        " 2>/dev/null || echo "0")
    fi

    # Count active worktrees
    local active_worktrees=0
    local worktree_agents=()

    if [ -d "$WORKTREE_BASE_DIR" ]; then
        for worktree in "$WORKTREE_BASE_DIR"/*; do
            if [ -d "$worktree" ] && [ -f "$worktree/.worktree-context" ]; then
                active_worktrees=$((active_worktrees + 1))
                if [ -f "$worktree/.worktree-context" ]; then
                    local agent=$(grep "PRIMARY_AGENT=" "$worktree/.worktree-context" | cut -d'=' -f2)
                    worktree_agents+=("$agent")
                fi
            fi
        done
    fi

    echo -e "${GREEN}${ROBOT} Total Available Agents: ${total_agents}${NC}"
    echo -e "${BLUE}${GEAR} Active Worktrees: ${active_worktrees}${NC}"
    echo ""

    if [ $active_worktrees -gt 0 ]; then
        echo -e "${YELLOW}Active Worktrees:${NC}"
        echo ""

        for worktree in "$WORKTREE_BASE_DIR"/*; do
            if [ -d "$worktree" ] && [ -f "$worktree/.worktree-context" ]; then
                local name=$(basename "$worktree")
                local agent=$(grep "PRIMARY_AGENT=" "$worktree/.worktree-context" | cut -d'=' -f2 || echo "unknown")
                local created=$(grep "CREATED=" "$worktree/.worktree-context" | cut -d'=' -f2 || echo "unknown")
                local status=$(grep "STATUS=" "$worktree/.worktree-context" | cut -d'=' -f2 || echo "unknown")
                local task=$(grep "TASK_DESCRIPTION=" "$worktree/.worktree-context" | cut -d'=' -f2 || echo "")

                local status_emoji="${GREEN}${CHECK}${NC}"
                if [ "$status" = "blocked" ]; then
                    status_emoji="${RED}${WARN}${NC}"
                elif [ "$status" = "in-progress" ]; then
                    status_emoji="${YELLOW}${GEAR}${NC}"
                fi

                echo -e "  ${status_emoji} ${CYAN}${name}${NC}"
                echo -e "    Agent: ${agent}"
                [ -n "$task" ] && echo -e "    Task: ${task}"
                [ "$detailed" = "--detailed" ] && echo -e "    Created: ${created}"
                [ "$detailed" = "--detailed" ] && echo -e "    Status: ${status}"
                echo ""
            fi
        done
    else
        echo -e "${INFO} No active worktrees found"
        echo ""
    fi

    # Show agent utilization
    if [ ${#worktree_agents[@]} -gt 0 ]; then
        echo -e "${YELLOW}Agent Utilization:${NC}"
        printf "%s\\n" "${worktree_agents[@]}" | sort | uniq -c | while read count agent; do
            echo -e "  ${agent}: ${count} worktree(s)"
        done
        echo ""
    fi
}

recommend_agent() {
    local task="$1"

    if [ -z "$task" ]; then
        echo -e "${RED}${WARN} Please provide a task description${NC}"
        echo "Usage: $0 recommend 'your task description'"
        return 1
    fi

    echo -e "${CYAN}${BRAIN} Analyzing task and recommending optimal agent...${NC}"
    echo ""

    if [ ! -f "$AGENT_SELECTOR" ]; then
        echo -e "${RED}${WARN} Agent selector not found at $AGENT_SELECTOR${NC}"
        return 1
    fi

    # Run agent selector and format output nicely
    node "$AGENT_SELECTOR" "$task" | while IFS= read -r line; do
        if [[ $line == Task:* ]]; then
            echo -e "${YELLOW}${TARGET} $line${NC}"
        elif [[ $line == *Agent:* ]]; then
            echo -e "${GREEN}${ROBOT} $line${NC}"
        elif [[ $line == *Confidence:* ]]; then
            echo -e "${BLUE}${CHART} $line${NC}"
        elif [[ $line == *Reasoning:* ]]; then
            echo -e "${PURPLE}${BRAIN} $line${NC}"
        elif [[ $line == *Team:* ]]; then
            echo -e "${CYAN}${ROCKET} $line${NC}"
        elif [[ $line =~ ^[0-9]+\\. ]]; then
            echo -e "${YELLOW}  $line${NC}"
        else
            echo "$line"
        fi
    done
}

create_worktree() {
    local name="$1"
    local agent_or_task="$2"
    local description="$3"

    if [ -z "$name" ]; then
        echo -e "${RED}${WARN} Please provide a worktree name${NC}"
        echo "Usage: $0 create <worktree-name> [agent-type|task-description] [description]"
        return 1
    fi

    echo -e "${CYAN}${ROCKET} Creating worktree with intelligent agent assignment...${NC}"
    echo ""

    local create_script="$SCRIPT_DIR/create-worktree.sh"
    if [ ! -f "$create_script" ]; then
        echo -e "${RED}${WARN} Create worktree script not found${NC}"
        return 1
    fi

    # Execute the enhanced create script
    bash "$create_script" "$name" "$agent_or_task" "$description"
}

assign_agent() {
    local worktree_name="$1"
    local new_agent="$2"

    if [ -z "$worktree_name" ] || [ -z "$new_agent" ]; then
        echo -e "${RED}${WARN} Please provide worktree name and agent type${NC}"
        echo "Usage: $0 assign <worktree-name> <agent-type>"
        return 1
    fi

    local worktree_dir="$WORKTREE_BASE_DIR/$worktree_name"

    if [ ! -d "$worktree_dir" ]; then
        echo -e "${RED}${WARN} Worktree '$worktree_name' not found${NC}"
        return 1
    fi

    # Validate agent exists
    if [ -f "$AGENTS_DIR/agent-capability-matrix.json" ]; then
        local agent_exists=$(node -e "
            const matrix = JSON.parse(require('fs').readFileSync('$AGENTS_DIR/agent-capability-matrix.json', 'utf8'));
            console.log(matrix.agents && matrix.agents['$new_agent'] ? 'true' : 'false');
        " 2>/dev/null || echo "false")

        if [ "$agent_exists" = "false" ]; then
            echo -e "${YELLOW}${WARN} Agent '$new_agent' not found in capability matrix${NC}"
            echo -e "${INFO} Proceeding anyway (might be a custom agent)${NC}"
        fi
    fi

    # Update worktree context
    if [ -f "$worktree_dir/.worktree-context" ]; then
        sed -i "s/PRIMARY_AGENT=.*/PRIMARY_AGENT=$new_agent/" "$worktree_dir/.worktree-context"
        echo "REASSIGNED=$(date -Iseconds)" >> "$worktree_dir/.worktree-context"
    fi

    # Update agent briefing
    if [ -f "$worktree_dir/.agent-briefing.md" ]; then
        sed -i "s/\\*\\*Primary Agent\\*\\*:.*/\\*\\*Primary Agent\\*\\*: $new_agent/" "$worktree_dir/.agent-briefing.md"
        echo "" >> "$worktree_dir/.agent-briefing.md"
        echo "## Agent Reassignment" >> "$worktree_dir/.agent-briefing.md"
        echo "- **Reassigned**: $(date)" >> "$worktree_dir/.agent-briefing.md"
        echo "- **New Agent**: $new_agent" >> "$worktree_dir/.agent-briefing.md"
        echo "- **Reason**: Manual reassignment via agent-manager" >> "$worktree_dir/.agent-briefing.md"
    fi

    echo -e "${GREEN}${CHECK} Successfully reassigned worktree '$worktree_name' to agent '$new_agent'${NC}"
    echo -e "${INFO} Updated .worktree-context and .agent-briefing.md${NC}"
}

show_performance() {
    echo -e "${CYAN}${CHART} Agent Performance Analytics${NC}"
    echo ""

    local perf_file="$CONTEXT_DIR/agent-performance.json"

    if [ ! -f "$perf_file" ]; then
        echo -e "${YELLOW}${INFO} No performance data available yet${NC}"
        echo -e "${INFO} Performance tracking will begin as agents complete tasks${NC}"
        return 0
    fi

    node -e "
        const fs = require('fs');
        const perf = JSON.parse(fs.readFileSync('$perf_file', 'utf8'));

        console.log('Top Performing Agents:');
        console.log('');

        const sorted = Object.entries(perf)
            .filter(([_, data]) => data.taskCount > 0)
            .sort((a, b) => b[1].successRate - a[1].successRate)
            .slice(0, 10);

        if (sorted.length === 0) {
            console.log('No performance data available yet');
            return;
        }

        sorted.forEach(([agent, data], index) => {
            const rate = (data.successRate * 100).toFixed(1);
            const emoji = rate >= 90 ? '🏆' : rate >= 80 ? '🥇' : rate >= 70 ? '🥈' : '🥉';
            console.log(\`\${emoji} \${agent}: \${rate}% success (\${data.taskCount} tasks)\`);

            if (data.strengths && data.strengths.length > 0) {
                console.log(\`   Strengths: \${data.strengths.slice(0, 3).join(', ')}\`);
            }
        });

        console.log('');
        console.log('Agent Utilization:');
        const totalTasks = Object.values(perf).reduce((sum, data) => sum + data.taskCount, 0);
        console.log(\`Total tasks completed: \${totalTasks}\`);
    " 2>/dev/null || {
        echo -e "${RED}${WARN} Error reading performance data${NC}"
    }
}

show_workflows() {
    echo -e "${CYAN}${BOOK} Example Multi-Agent Workflows${NC}"
    echo ""

    if [ -f "$AGENTS_DIR/agent-capability-matrix.json" ]; then
        node -e "
            const matrix = JSON.parse(require('fs').readFileSync('$AGENTS_DIR/agent-capability-matrix.json', 'utf8'));
            const combinations = matrix.agentCombinations || {};

            console.log('Pre-defined Agent Combinations:');
            console.log('');

            Object.entries(combinations).forEach(([name, agents]) => {
                const displayName = name.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
                console.log(\`🎯 \${displayName}:\`);
                console.log(\`   \${agents.join(' → ')}\`);
                console.log('');
            });

            console.log('Usage Examples:');
            console.log('');
            console.log('1. Full-Stack Development:');
            console.log('   $0 create feature-new-page \"Build user dashboard with API integration\"');
            console.log('');
            console.log('2. Performance Optimization:');
            console.log('   $0 create perf-optimize \"Improve React app loading times\"');
            console.log('');
            console.log('3. Security Audit:');
            console.log('   $0 create security-review \"Conduct comprehensive security audit\"');
        " 2>/dev/null
    fi
}

validate_ecosystem() {
    echo -e "${CYAN}${GEAR} Validating Agent Ecosystem${NC}"
    echo ""

    local issues=0

    # Check if agent matrix exists
    if [ ! -f "$AGENTS_DIR/agent-capability-matrix.json" ]; then
        echo -e "${RED}${WARN} Agent capability matrix missing${NC}"
        issues=$((issues + 1))
    else
        echo -e "${GREEN}${CHECK} Agent capability matrix found${NC}"

        # Validate JSON structure
        if ! node -e "JSON.parse(require('fs').readFileSync('$AGENTS_DIR/agent-capability-matrix.json', 'utf8'))" 2>/dev/null; then
            echo -e "${RED}${WARN} Agent capability matrix has invalid JSON${NC}"
            issues=$((issues + 1))
        else
            local agent_count=$(node -e "
                const matrix = JSON.parse(require('fs').readFileSync('$AGENTS_DIR/agent-capability-matrix.json', 'utf8'));
                console.log(Object.keys(matrix.agents || {}).length);
            " 2>/dev/null || echo "0")

            echo -e "${GREEN}${CHECK} Agent matrix valid with $agent_count agents${NC}"
        fi
    fi

    # Check if agent selector exists and is executable
    if [ ! -f "$AGENT_SELECTOR" ]; then
        echo -e "${RED}${WARN} Agent selector script missing${NC}"
        issues=$((issues + 1))
    elif [ ! -x "$AGENT_SELECTOR" ]; then
        echo -e "${YELLOW}${WARN} Agent selector not executable${NC}"
        chmod +x "$AGENT_SELECTOR" 2>/dev/null && echo -e "${GREEN}${CHECK} Fixed agent selector permissions${NC}" || {
            echo -e "${RED}${WARN} Could not fix agent selector permissions${NC}"
            issues=$((issues + 1))
        }
    else
        echo -e "${GREEN}${CHECK} Agent selector ready${NC}"
    fi

    # Check context directory
    if [ ! -d "$CONTEXT_DIR" ]; then
        echo -e "${YELLOW}${WARN} Context directory missing, creating...${NC}"
        mkdir -p "$CONTEXT_DIR" && echo -e "${GREEN}${CHECK} Created context directory${NC}" || {
            echo -e "${RED}${WARN} Could not create context directory${NC}"
            issues=$((issues + 1))
        }
    else
        echo -e "${GREEN}${CHECK} Context directory exists${NC}"
    fi

    # Check worktree base directory
    if [ ! -d "$WORKTREE_BASE_DIR" ]; then
        echo -e "${YELLOW}${WARN} Worktree base directory missing, creating...${NC}"
        mkdir -p "$WORKTREE_BASE_DIR" && echo -e "${GREEN}${CHECK} Created worktree base directory${NC}" || {
            echo -e "${RED}${WARN} Could not create worktree base directory${NC}"
            issues=$((issues + 1))
        }
    else
        echo -e "${GREEN}${CHECK} Worktree base directory exists${NC}"
    fi

    echo ""
    if [ $issues -eq 0 ]; then
        echo -e "${GREEN}${ROCKET} Agent ecosystem is fully operational!${NC}"
    else
        echo -e "${YELLOW}${WARN} Found $issues issue(s) that need attention${NC}"
    fi

    return $issues
}

cleanup_worktrees() {
    echo -e "${CYAN}${GEAR} Cleaning up inactive worktrees${NC}"
    echo ""

    if [ ! -d "$WORKTREE_BASE_DIR" ]; then
        echo -e "${INFO} No worktrees directory found${NC}"
        return 0
    fi

    local cleaned=0

    for worktree in "$WORKTREE_BASE_DIR"/*; do
        if [ -d "$worktree" ]; then
            local name=$(basename "$worktree")

            # Check if worktree is still valid git worktree
            if ! git -C "$MAIN_REPO" worktree list | grep -q "$worktree"; then
                echo -e "${YELLOW}${WARN} Removing orphaned worktree: $name${NC}"
                rm -rf "$worktree"
                cleaned=$((cleaned + 1))
                continue
            fi

            # Check if marked for cleanup
            if [ -f "$worktree/.worktree-context" ]; then
                local status=$(grep "STATUS=" "$worktree/.worktree-context" | cut -d'=' -f2 || echo "")
                if [ "$status" = "completed" ] || [ "$status" = "abandoned" ]; then
                    echo -e "${INFO} Found inactive worktree: $name (status: $status)${NC}"
                    read -p "Remove this worktree? (y/N): " -n 1 -r
                    echo
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        git -C "$MAIN_REPO" worktree remove "$worktree" --force 2>/dev/null || true
                        rm -rf "$worktree" 2>/dev/null || true
                        cleaned=$((cleaned + 1))
                        echo -e "${GREEN}${CHECK} Removed worktree: $name${NC}"
                    fi
                fi
            fi
        fi
    done

    echo ""
    echo -e "${GREEN}${CHECK} Cleanup complete. Removed $cleaned worktree(s)${NC}"
}

# Main command processing
case "${1:-help}" in
    "list")
        list_agents "$2" "$3"
        ;;
    "status")
        show_status "$2"
        ;;
    "recommend")
        recommend_agent "$2"
        ;;
    "create")
        create_worktree "$2" "$3" "$4"
        ;;
    "assign")
        assign_agent "$2" "$3"
        ;;
    "performance")
        show_performance
        ;;
    "workflows")
        show_workflows
        ;;
    "validate")
        validate_ecosystem
        ;;
    "cleanup")
        cleanup_worktrees
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}${WARN} Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
