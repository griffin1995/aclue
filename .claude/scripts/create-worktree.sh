#!/bin/bash
# Enhanced Git Worktree Creation Script with Intelligent Agent Assignment
# Usage: ./create-worktree.sh <worktree-name> [agent-type|task-description] [description]
# Examples:
#   ./create-worktree.sh feature-ui frontend-developer "Improve homepage UI"
#   ./create-worktree.sh bug-fix "Fix React.Children.only error in Button component"
#   ./create-worktree.sh performance "Optimize loading times and bundle size"

set -e

WORKTREE_NAME=$1
AGENT_OR_TASK=$2
DESCRIPTION=${3:-""}
WORKTREE_BASE_DIR="/home/jack/Documents/mpto-worktrees"
MAIN_REPO="/home/jack/Documents/my_private_tutor_online"
WORKTREE_DIR="$WORKTREE_BASE_DIR/$WORKTREE_NAME"
AGENT_SELECTOR="$MAIN_REPO/.claude/scripts/agent-selector.js"

# Validation
if [ -z "$WORKTREE_NAME" ]; then
    echo "Error: Missing worktree name"
    echo "Usage: $0 <worktree-name> [agent-type|task-description] [description]"
    echo ""
    echo "Examples:"
    echo "  $0 feature-ui frontend-developer 'Improve homepage UI'"
    echo "  $0 bug-fix 'Fix React.Children.only error in Button component'"
    echo "  $0 performance 'Optimize loading times and bundle size'"
    echo ""
    echo "Available agents: frontend-developer, backend-architect, ui-ux-designer,"
    echo "                 typescript-pro, python-pro, performance-engineer, security-auditor,"
    echo "                 test-automator, devops-troubleshooter, database-admin, etc."
    echo ""
    echo "Or provide a task description for intelligent agent selection."
    exit 1
fi

# Determine if AGENT_OR_TASK is an agent name or task description
AGENT_TYPE=""
TASK_DESCRIPTION=""

if [ -n "$AGENT_OR_TASK" ]; then
    # Check if it's a known agent type by looking for hyphens (agent names have hyphens)
    if [[ "$AGENT_OR_TASK" =~ ^[a-z]+-[a-z]+(-[a-z]+)*$ ]]; then
        AGENT_TYPE="$AGENT_OR_TASK"
        TASK_DESCRIPTION="$DESCRIPTION"
    else
        # It's a task description, use agent selector
        TASK_DESCRIPTION="$AGENT_OR_TASK"
        if [ -n "$DESCRIPTION" ]; then
            TASK_DESCRIPTION="$TASK_DESCRIPTION $DESCRIPTION"
        fi
        echo "🤖 Analyzing task and selecting optimal agent..."
        if [ -f "$AGENT_SELECTOR" ]; then
            SELECTION_RESULT=$(node "$AGENT_SELECTOR" "$TASK_DESCRIPTION" 2>/dev/null | grep "Primary Agent:" | cut -d':' -f2 | xargs)
            if [ -n "$SELECTION_RESULT" ]; then
                AGENT_TYPE="$SELECTION_RESULT"
                echo "✅ Selected agent: $AGENT_TYPE"
            else
                echo "⚠️  Agent selection failed, using general-purpose"
                AGENT_TYPE="general-purpose"
            fi
        else
            echo "⚠️  Agent selector not found, using general-purpose"
            AGENT_TYPE="general-purpose"
        fi
    fi
else
    # No agent or task provided, use general-purpose
    AGENT_TYPE="general-purpose"
    TASK_DESCRIPTION="General development task"
fi

echo "📋 Task: $TASK_DESCRIPTION"
echo "🤖 Agent: $AGENT_TYPE"

# Create worktree base directory if it doesn't exist
mkdir -p "$WORKTREE_BASE_DIR"

# Change to main repository
cd "$MAIN_REPO"

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/$WORKTREE_NAME; then
    echo "Warning: Branch $WORKTREE_NAME already exists"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Create new branch
    echo "Creating branch: $WORKTREE_NAME"
    git branch $WORKTREE_NAME
fi

# Create worktree
echo "Creating worktree: $WORKTREE_DIR"
git worktree add "$WORKTREE_DIR" $WORKTREE_NAME

# Initialize worktree context
echo "Initializing worktree context..."
cat > "$WORKTREE_DIR/.worktree-context" << EOF
WORKTREE_NAME=$WORKTREE_NAME
PRIMARY_AGENT=$AGENT_TYPE
TASK_DESCRIPTION=$TASK_DESCRIPTION
DESCRIPTION=$DESCRIPTION
CREATED=$(date -Iseconds)
STATUS=active
DEPENDENCIES=
AGENT_SELECTION_METHOD=$([[ "$AGENT_OR_TASK" =~ ^[a-z]+-[a-z]+(-[a-z]+)*$ ]] && echo "manual" || echo "automatic")
EOF

# Copy essential config files
if [ -f "$MAIN_REPO/.env.local" ]; then
    cp "$MAIN_REPO/.env.local" "$WORKTREE_DIR/"
fi

# Install dependencies in worktree
cd "$WORKTREE_DIR"
if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Update project state with enhanced context
echo "📊 Updating project context..."
node "$MAIN_REPO/.claude/scripts/update-context.js" add-worktree "$WORKTREE_NAME" "$AGENT_TYPE" "$TASK_DESCRIPTION" "$DESCRIPTION" 2>/dev/null || echo "⚠️  Context update failed, but worktree created successfully"

# Create enhanced agent briefing with agent-specific guidance
echo "📝 Generating agent-specific briefing..."

# Get agent-specific briefing if agent selector is available
AGENT_BRIEFING=""
if [ -f "$AGENT_SELECTOR" ] && [ "$TASK_DESCRIPTION" != "General development task" ]; then
    BRIEFING_JSON=$(node "$AGENT_SELECTOR" "$TASK_DESCRIPTION" 2>/dev/null | grep -A 1000 "Execution Plan:" || echo "")
fi

# Create comprehensive agent briefing
cat > "$WORKTREE_DIR/.agent-briefing.md" << EOF
# Agent Briefing: $WORKTREE_NAME

## Assignment Details
- **Worktree**: $WORKTREE_NAME
- **Primary Agent**: $AGENT_TYPE
- **Created**: $(date)
- **Task**: $TASK_DESCRIPTION
- **Selection Method**: $([[ "$AGENT_OR_TASK" =~ ^[a-z]+-[a-z]+(-[a-z]+)*$ ]] && echo "Manual" || echo "Intelligent Auto-Selection")

## Project Context
This worktree is part of the My Private Tutor Online project - a premium tutoring website serving elite clientele including royal family testimonials.

### Current Project Status
- ✅ **Production Ready** - Royal endorsement branding implemented for 2025
- ✅ **Vercel Deployment Complete** - Dynamic rendering successfully configured
- ✅ **React.Children.only Errors Resolved** - Radix UI Slot components fixed
- ✅ **Content Updates Complete** - Trust indicators updated with new copy and images

## Agent-Specific Guidance

### For $AGENT_TYPE
$([[ -f "$MAIN_REPO/.claude/agents/$AGENT_TYPE.md" ]] && echo "Refer to your agent definition at .claude/agents/$AGENT_TYPE.md for specialized guidance." || echo "You are a specialist agent. Follow your core competencies and best practices.")

### Key Capabilities Expected
- Leverage your specialized knowledge in your domain
- Coordinate with other agents when cross-domain expertise needed
- Follow established patterns and architectural decisions
- Maintain high-quality, production-ready standards

## Technical Constraints
- **Architecture**: Client Components with dynamic rendering (unusual but validated)
- **Performance**: LCP <2.5s, FID <100ms, CLS <0.1, bundle <150kB gzipped
- **Accessibility**: WCAG 2.1 AA compliance required
- **Language**: British English spelling throughout
- **Documentation**: Use Context7 MCP for all library docs
- **Component Library**: Radix UI + Tailwind (Shadcn/UI pattern)

## Critical Development Rules
1. **MANDATORY**: Check local docs/ directory before ANY code implementation
2. **NEVER mention AI assistance** in code comments, commits, or documentation
3. **ALWAYS implement production-ready solutions** - no shortcuts or minimal versions
4. **UPDATE CUSTOM_DOCS.md** with proven patterns for future reference
5. **USE CMS SYSTEM** (cms-content.ts/cms-images.ts) for all content - no hardcoding
6. **VERIFY WITH CONTEXT7 MCP** - All library implementations must use official docs

## Integration Points
- **Main Repository**: $MAIN_REPO
- **Deployment**: Vercel (https://my-tutor-website-6aipxnfeh-jacks-projects-cf5effed.vercel.app)
- **Testing Stack**: Jest + Playwright + axe-core
- **State Management**: Zustand for complex state
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion (with LazyMotion for performance)

## Agent Coordination
- **Context Manager**: Available for complex multi-agent workflows
- **Performance Reviews**: Use performance-engineer for optimization needs
- **Security Reviews**: Consult security-auditor for security-sensitive changes
- **Testing**: Coordinate with test-automator for comprehensive test coverage
- **Deployment**: Work with devops-troubleshooter for deployment issues

## Success Criteria
- Task completed according to specifications
- Code follows project architectural patterns
- Performance targets maintained or improved
- Accessibility standards upheld
- Documentation updated appropriately
- Tests pass (existing and new)

## Next Steps
1. **Review Existing Codebase**: Understand current implementation patterns
2. **Check Agent Definition**: Review .claude/agents/$AGENT_TYPE.md if available
3. **Analyze Task Requirements**: Break down task into actionable steps
4. **Verify Documentation**: Ensure all required docs are available in docs/ directory
5. **Begin Implementation**: Follow CLAUDE.md guidelines and agent specialization
6. **Regular Updates**: Coordinate with context manager for complex workflows

## Emergency Contacts
- **Complex Coordination**: Switch to context-manager
- **Critical Bugs**: Use error-detective or debugger
- **Performance Issues**: Consult performance-engineer
- **Security Concerns**: Immediate escalation to security-auditor
- **Deployment Problems**: Contact devops-troubleshooter

EOF

# Generate intelligent recommendations if available
if [ -f "$AGENT_SELECTOR" ] && [ "$TASK_DESCRIPTION" != "General development task" ]; then
    echo "\n🧠 Generating intelligent recommendations..."
    node "$AGENT_SELECTOR" "$TASK_DESCRIPTION" > "$WORKTREE_DIR/.agent-recommendations.txt" 2>/dev/null || true
fi

echo ""
echo "✅ Enhanced worktree created successfully!"
echo "📍 Location: $WORKTREE_DIR"
echo "🤖 Primary Agent: $AGENT_TYPE"
echo "📋 Task: $TASK_DESCRIPTION"
echo "🎯 Selection: $([[ "$AGENT_OR_TASK" =~ ^[a-z]+-[a-z]+(-[a-z]+)*$ ]] && echo "Manual" || echo "AI-Powered")"
echo ""
echo "📚 Quick Start:"
echo "  cd $WORKTREE_DIR"
echo "  cat .agent-briefing.md        # Read your mission"
echo "  cat .worktree-context        # Check configuration"
[ -f "$WORKTREE_DIR/.agent-recommendations.txt" ] && echo "  cat .agent-recommendations.txt # View AI recommendations"
echo ""
echo "🔍 Management Commands:"
echo "  $MAIN_REPO/.claude/scripts/worktree-status.sh                    # Check all worktrees"
echo "  $MAIN_REPO/.claude/scripts/agent-selector.js 'your task here'    # Get agent recommendations"
echo "  $MAIN_REPO/.claude/scripts/update-context.js add-worktree ...     # Update project context"
echo ""
echo "🎯 Agent Ecosystem:"
echo "  Available agents: frontend-developer, backend-architect, ui-ux-designer,"
echo "                   typescript-pro, python-pro, performance-engineer, security-auditor,"
echo "                   test-automator, devops-troubleshooter, database-admin, content-marketer,"
echo "                   api-documenter, code-reviewer, error-detective, data-scientist,"
echo "                   cloud-architect, mobile-developer, ai-engineer, and 30+ more!"
echo ""
echo "💡 Pro Tips:"
echo "  - Use context-manager for complex multi-agent workflows"
echo "  - Let the AI recommend agents: 'I need to optimize database queries'"
echo "  - Check agent definitions in .claude/agents/ directory"
echo "  - All agents follow the same CLAUDE.md development rules"