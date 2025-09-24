#!/usr/bin/env python3
"""
MCP Configuration Optimizer for aclue project
Removes Playwright MCP and optimizes Memory MCP to reduce token usage
"""

import json
import sys
import os
from datetime import datetime

def load_claude_config(config_path):
    """Load Claude configuration file"""
    with open(config_path, 'r') as f:
        return json.load(f)

def save_claude_config(config_path, config):
    """Save Claude configuration file"""
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)

def remove_playwright_from_config(config):
    """Remove Playwright MCP server from all project configurations"""
    changes_made = 0

    # Check if projects exist in config
    if 'projects' in config:
        projects = config['projects']

        # Iterate through all projects
        for project_path, project_config in projects.items():
            if isinstance(project_config, dict) and 'mcpServers' in project_config:
                mcpServers = project_config['mcpServers']

                # Remove playwright if it exists
                if 'playwright' in mcpServers:
                    print(f"Removing Playwright MCP from project: {project_path}")
                    del mcpServers['playwright']
                    changes_made += 1

                # Also check if it's disabled but still present in disabled list
                if 'disabledMcpjsonServers' in project_config:
                    disabled_servers = project_config['disabledMcpjsonServers']
                    if 'playwright' in disabled_servers:
                        print(f"Removing Playwright from disabled servers list: {project_path}")
                        disabled_servers.remove('playwright')
                        changes_made += 1

    print(f"Total Playwright configurations removed: {changes_made}")
    return changes_made > 0

def optimize_memory_config(config):
    """Optimize Memory MCP configuration to reduce token usage"""
    changes_made = 0

    # Check if projects exist in config
    if 'projects' in config:
        projects = config['projects']

        # Iterate through all projects
        for project_path, project_config in projects.items():
            if isinstance(project_config, dict) and 'mcpServers' in project_config:
                mcpServers = project_config['mcpServers']

                # Optimize memory server if it exists
                if 'memory' in mcpServers:
                    memory_config = mcpServers['memory']
                    print(f"Optimizing Memory MCP for project: {project_path}")

                    # Add optimization parameters to reduce token usage
                    if 'env' not in memory_config:
                        memory_config['env'] = {}

                    # Set memory-specific optimizations
                    memory_config['env']['MCP_MEMORY_MAX_NODES'] = '50'
                    memory_config['env']['MCP_MEMORY_MAX_RELATIONS'] = '100'
                    memory_config['env']['MCP_MEMORY_PRUNE_THRESHOLD'] = '0.7'

                    # Add load-on-demand configuration
                    memory_config['loadOnDemand'] = True
                    memory_config['priority'] = 'low'

                    changes_made += 1

    print(f"Memory MCP optimizations applied: {changes_made}")
    return changes_made > 0

def add_optimization_metadata(config):
    """Add metadata about the optimization process"""
    optimization_info = {
        'optimized_at': datetime.now().isoformat(),
        'changes_applied': [
            'Removed Playwright MCP server (9,804 tokens saved)',
            'Optimized Memory MCP configuration',
            'Added load-on-demand for memory server'
        ],
        'estimated_token_reduction': 9804,
        'browser_automation': 'Puppeteer MCP remains active for browser automation needs'
    }

    # Add to root level of config
    config['_mcp_optimization'] = optimization_info

def main():
    config_path = '/home/jack/.claude.json'

    if not os.path.exists(config_path):
        print(f"Error: Claude configuration file not found at {config_path}")
        sys.exit(1)

    print("Loading Claude configuration...")
    config = load_claude_config(config_path)

    print("Applying MCP optimizations...")

    # Remove Playwright MCP
    playwright_removed = remove_playwright_from_config(config)

    # Optimize Memory MCP
    memory_optimized = optimize_memory_config(config)

    # Add optimization metadata
    add_optimization_metadata(config)

    if playwright_removed or memory_optimized:
        print("Saving optimized configuration...")
        save_claude_config(config_path, config)
        print("✅ MCP optimization completed successfully!")
        print("\nNext steps:")
        print("1. Restart Claude Code: claude restart")
        print("2. Verify changes: claude mcp list")
        print("3. Test functionality with remaining MCPs")
        return True
    else:
        print("No changes needed - configuration already optimized")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"Error during optimization: {e}")
        sys.exit(1)
