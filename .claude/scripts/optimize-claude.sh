#!/bin/bash

# Claude Code Optimization Script for aclue Project
# Reduces context usage from ~35k to ~18k tokens

set -e

CLAUDE_DIR="/home/jack/Documents/aclue-preprod/.claude"
BACKUP_DIR="$CLAUDE_DIR/backups/$(date +%Y%m%d_%H%M%S)"

echo "🚀 Starting Claude Code optimization for aclue project..."

# Create backup
echo "📦 Creating backup..."
mkdir -p "$BACKUP_DIR"
cp "$CLAUDE_DIR/mcp.json" "$BACKUP_DIR/" 2>/dev/null || echo "No existing mcp.json found"
cp "$CLAUDE_DIR/settings.local.json" "$BACKUP_DIR/" 2>/dev/null || echo "No existing settings.local.json found"

# Apply optimized configurations
echo "⚙️  Applying optimized MCP configuration..."
cp "$CLAUDE_DIR/mcp.optimized.json" "$CLAUDE_DIR/mcp.json"

echo "🔧 Applying optimized settings..."
# Merge with existing settings
if [ -f "$CLAUDE_DIR/settings.local.json" ]; then
    # Keep existing permissions but add performance settings
    jq -s '.[0] * .[1]' "$CLAUDE_DIR/settings.local.json" "$CLAUDE_DIR/settings.optimized.json" > "$CLAUDE_DIR/settings.merged.json"
    mv "$CLAUDE_DIR/settings.merged.json" "$CLAUDE_DIR/settings.local.json"
else
    cp "$CLAUDE_DIR/settings.optimized.json" "$CLAUDE_DIR/settings.local.json"
fi

# Restart Claude Code if running
echo "🔄 Restarting Claude Code..."
pkill -f "claude-code" 2>/dev/null || echo "Claude Code not running"

echo "✅ Optimization complete!"
echo ""
echo "📊 Expected improvements:"
echo "   • Context usage: 34,836 → ~18,000 tokens (48% reduction)"
echo "   • Startup time: Faster with lazy-loading"
echo "   • Memory usage: Reduced by selective tool loading"
echo ""
echo "🔧 Configuration files:"
echo "   • MCP: $CLAUDE_DIR/mcp.json"
echo "   • Settings: $CLAUDE_DIR/settings.local.json"
echo "   • Workflows: $CLAUDE_DIR/workflows.json"
echo ""
echo "📁 Backup location: $BACKUP_DIR"
echo ""
echo "To verify optimization, run: claude-code diagnostics"
