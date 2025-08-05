#!/usr/bin/env node
/**
 * Context Management Script for Git Worktrees
 * Updates project state and agent assignments
 */

const fs = require('fs');
const path = require('path');

const CONTEXT_DIR = path.join(__dirname, '..', 'context');
const PROJECT_STATE_FILE = path.join(CONTEXT_DIR, 'project-state.json');
const AGENT_ASSIGNMENTS_FILE = path.join(CONTEXT_DIR, 'agent-assignments.json');
const WORKTREE_MAP_FILE = path.join(CONTEXT_DIR, 'worktree-map.json');

/**
 * Load JSON file with error handling
 */
function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Save JSON file with formatting
 */
function saveJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Add new worktree to project state
 */
function addWorktree(name, agent, description = '') {
  const projectState = loadJson(PROJECT_STATE_FILE);
  const agentAssignments = loadJson(AGENT_ASSIGNMENTS_FILE);
  const worktreeMap = loadJson(WORKTREE_MAP_FILE);
  
  // Check if worktree already exists
  const existing = projectState.activeWorktrees.find(wt => wt.name === name);
  if (existing) {
    console.log(`⚠️  Worktree '${name}' already exists in project state`);
    return;
  }
  
  // Add to project state
  const newWorktree = {
    name,
    branch: name,
    agent,
    status: 'active',
    created: new Date().toISOString(),
    description,
    dependencies: [],
    lastUpdate: new Date().toISOString()
  };
  
  projectState.activeWorktrees.push(newWorktree);
  projectState.lastUpdated = new Date().toISOString();
  
  // Add to agent assignments
  const assignment = {
    worktree: name,
    primaryAgent: agent,
    supportAgents: [],
    scope: description,
    status: 'active',
    created: new Date().toISOString()
  };
  
  agentAssignments.assignments.push(assignment);
  
  // Add to worktree map
  worktreeMap.activeWorktrees.push({
    name,
    category: name.startsWith('feature-') ? 'feature' : 
             name.startsWith('opt-') ? 'optimization' :
             name.startsWith('bugfix-') ? 'bugfix' : 'other',
    primaryAgent: agent,
    status: 'active',
    created: new Date().toISOString()
  });
  
  // Save all files
  saveJson(PROJECT_STATE_FILE, projectState);
  saveJson(AGENT_ASSIGNMENTS_FILE, agentAssignments);
  saveJson(WORKTREE_MAP_FILE, worktreeMap);
  
  console.log(`🎉 Successfully added worktree '${name}' assigned to '${agent}'`);
}

/**
 * Remove worktree from project state
 */
function removeWorktree(name) {
  const projectState = loadJson(PROJECT_STATE_FILE);
  const agentAssignments = loadJson(AGENT_ASSIGNMENTS_FILE);
  const worktreeMap = loadJson(WORKTREE_MAP_FILE);
  
  // Remove from project state
  const worktreeIndex = projectState.activeWorktrees.findIndex(wt => wt.name === name);
  if (worktreeIndex === -1) {
    console.log(`⚠️  Worktree '${name}' not found in project state`);
    return;
  }
  
  const removedWorktree = projectState.activeWorktrees.splice(worktreeIndex, 1)[0];
  projectState.lastUpdated = new Date().toISOString();
  
  // Move to completed worktrees
  if (!projectState.completedWorktrees) {
    projectState.completedWorktrees = [];
  }
  
  removedWorktree.completedAt = new Date().toISOString();
  removedWorktree.status = 'completed';
  projectState.completedWorktrees.push(removedWorktree);
  
  // Remove from agent assignments
  const assignmentIndex = agentAssignments.assignments.findIndex(a => a.worktree === name);
  if (assignmentIndex !== -1) {
    agentAssignments.assignments.splice(assignmentIndex, 1);
  }
  
  // Move in worktree map
  const mapIndex = worktreeMap.activeWorktrees.findIndex(wt => wt.name === name);
  if (mapIndex !== -1) {
    const completedWorktree = worktreeMap.activeWorktrees.splice(mapIndex, 1)[0];
    completedWorktree.completedAt = new Date().toISOString();
    completedWorktree.status = 'completed';
    
    if (!worktreeMap.completedWorktrees) {
      worktreeMap.completedWorktrees = [];
    }
    worktreeMap.completedWorktrees.push(completedWorktree);
  }
  
  // Save all files
  saveJson(PROJECT_STATE_FILE, projectState);
  saveJson(AGENT_ASSIGNMENTS_FILE, agentAssignments);
  saveJson(WORKTREE_MAP_FILE, worktreeMap);
  
  console.log(`✅ Successfully removed worktree '${name}' and marked as completed`);
}

/**
 * Update worktree status
 */
function updateStatus(name, status, notes = '') {
  const projectState = loadJson(PROJECT_STATE_FILE);
  
  const worktree = projectState.activeWorktrees.find(wt => wt.name === name);
  if (!worktree) {
    console.log(`⚠️  Worktree '${name}' not found`);
    return;
  }
  
  worktree.status = status;
  worktree.lastUpdate = new Date().toISOString();
  if (notes) {
    worktree.notes = notes;
  }
  
  projectState.lastUpdated = new Date().toISOString();
  
  saveJson(PROJECT_STATE_FILE, projectState);
  console.log(`✅ Updated status for '${name}' to '${status}'`);
}

/**
 * Show current context summary
 */
function showStatus() {
  const projectState = loadJson(PROJECT_STATE_FILE);
  const agentAssignments = loadJson(AGENT_ASSIGNMENTS_FILE);
  
  console.log('\n📊 Project Context Status');
  console.log('==========================');
  console.log(`Project: ${projectState.projectName}`);
  console.log(`Last Updated: ${projectState.lastUpdated}`);
  console.log(`Active Worktrees: ${projectState.activeWorktrees.length}`);
  
  if (projectState.activeWorktrees.length > 0) {
    console.log('\n🌳 Active Worktrees:');
    projectState.activeWorktrees.forEach(wt => {
      console.log(`  • ${wt.name} (${wt.agent}) - ${wt.status}`);
      if (wt.description) {
        console.log(`    ${wt.description}`);
      }
    });
  }
  
  console.log(`\n🤖 Agent Assignments: ${agentAssignments.assignments.length}`);
  if (agentAssignments.assignments.length > 0) {
    agentAssignments.assignments.forEach(assignment => {
      console.log(`  • ${assignment.primaryAgent} → ${assignment.worktree}`);
    });
  }
}

/**
 * Main command processing
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('Usage: node update-context.js <command> [args...]');
    console.log('Commands:');
    console.log('  add-worktree <name> <agent> [description]');
    console.log('  remove-worktree <name>');
    console.log('  update-status <name> <status> [notes]');
    console.log('  status');
    process.exit(1);
  }
  
  switch (command) {
    case 'add-worktree':
      if (args.length < 3) {
        console.error('Usage: add-worktree <name> <agent> [description]');
        process.exit(1);
      }
      addWorktree(args[1], args[2], args[3] || '');
      break;
      
    case 'remove-worktree':
      if (args.length < 2) {
        console.error('Usage: remove-worktree <name>');
        process.exit(1);
      }
      removeWorktree(args[1]);
      break;
      
    case 'update-status':
      if (args.length < 3) {
        console.error('Usage: update-status <name> <status> [notes]');
        process.exit(1);
      }
      updateStatus(args[1], args[2], args[3] || '');
      break;
      
    case 'status':
      showStatus();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}