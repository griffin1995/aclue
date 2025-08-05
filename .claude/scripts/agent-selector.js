#!/usr/bin/env node
/**
 * Dynamic Agent Selection and Recommendation System
 * Intelligent matching of tasks to optimal Claude Code agents
 */

const fs = require('fs');
const path = require('path');

class AgentSelector {
    constructor() {
        this.agentMatrix = this.loadAgentMatrix();
        this.performanceHistory = this.loadPerformanceHistory();
        this.activeWorktrees = this.loadActiveWorktrees();
    }

    loadAgentMatrix() {
        try {
            const matrixPath = path.join(__dirname, '../agents/agent-capability-matrix.json');
            return JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
        } catch (error) {
            console.error('Error loading agent matrix:', error.message);
            return { agents: {}, agentCombinations: {}, taskClassification: {} };
        }
    }

    loadPerformanceHistory() {
        try {
            const historyPath = path.join(__dirname, '../context/agent-performance.json');
            return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        } catch (error) {
            // Initialize with default performance scores
            return this.initializePerformanceHistory();
        }
    }

    loadActiveWorktrees() {
        try {
            const contextPath = path.join(__dirname, '../context/project-context.json');
            const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
            return context.activeWorktrees || [];
        } catch (error) {
            return [];
        }
    }

    initializePerformanceHistory() {
        const history = {};
        Object.keys(this.agentMatrix.agents || {}).forEach(agent => {
            history[agent] = {
                successRate: 0.85, // Default success rate
                taskCount: 0,
                avgComplexityHandled: 'medium',
                strengths: [],
                weaknesses: [],
                preferredCombinations: []
            };
        });
        return history;
    }

    /**
     * Main agent selection method
     * @param {string} taskDescription - Description of the task
     * @param {Object} options - Selection options
     * @returns {Object} Selection results with recommendations
     */
    selectAgent(taskDescription, options = {}) {
        const analysis = this.analyzeTask(taskDescription, options);
        const recommendations = this.generateRecommendations(analysis);
        const briefing = this.generateBriefing(recommendations.primary, analysis);

        return {
            taskAnalysis: analysis,
            recommendations,
            briefing,
            executionPlan: this.createExecutionPlan(recommendations, analysis),
            alternatives: this.getAlternatives(recommendations.primary, analysis)
        };
    }

    /**
     * Analyze task requirements and classify complexity
     */
    analyzeTask(taskDescription, options) {
        const analysis = {
            description: taskDescription,
            keywords: this.extractKeywords(taskDescription),
            domains: this.identifyDomains(taskDescription),
            complexity: this.assessComplexity(taskDescription, options),
            urgency: options.urgency || 'medium',
            constraints: options.constraints || [],
            requiredCapabilities: [],
            suggestedApproach: 'single-agent'
        };

        // Determine required capabilities based on keywords and domains
        analysis.requiredCapabilities = this.mapCapabilities(analysis.keywords, analysis.domains);
        
        // Determine if multi-agent approach is needed
        if (analysis.complexity === 'high' || analysis.domains.length > 2) {
            analysis.suggestedApproach = 'multi-agent';
        }

        return analysis;
    }

    extractKeywords(description) {
        const keywords = [];
        const keywordMap = {
            // Frontend/UI keywords
            'ui': 'frontend', 'interface': 'frontend', 'component': 'frontend', 'react': 'frontend',
            'css': 'frontend', 'styling': 'frontend', 'responsive': 'frontend', 'tailwind': 'frontend',
            
            // Backend/API keywords
            'api': 'backend', 'endpoint': 'backend', 'server': 'backend', 'database': 'backend',
            'auth': 'backend', 'jwt': 'backend', 'fastapi': 'backend', 'express': 'backend',
            
            // Database keywords
            'query': 'database', 'sql': 'database', 'optimization': 'database', 'migration': 'database',
            'postgres': 'database', 'mysql': 'database', 'schema': 'database',
            
            // Performance keywords
            'performance': 'performance', 'optimization': 'performance', 'speed': 'performance',
            'loading': 'performance', 'bundle': 'performance', 'caching': 'performance',
            
            // Security keywords
            'security': 'security', 'vulnerability': 'security', 'audit': 'security',
            'compliance': 'security', 'encryption': 'security', 'authentication': 'security',
            
            // Testing keywords
            'test': 'testing', 'testing': 'testing', 'qa': 'testing', 'automation': 'testing',
            'jest': 'testing', 'playwright': 'testing', 'cypress': 'testing',
            
            // DevOps keywords
            'deployment': 'devops', 'deploy': 'devops', 'ci': 'devops', 'cd': 'devops',
            'docker': 'devops', 'kubernetes': 'devops', 'vercel': 'devops',
            
            // Data keywords
            'data': 'data', 'analytics': 'data', 'reporting': 'data', 'visualization': 'data',
            'ml': 'ml', 'ai': 'ai', 'machine learning': 'ml', 'artificial intelligence': 'ai'
        };

        const lowerDesc = description.toLowerCase();
        Object.entries(keywordMap).forEach(([keyword, category]) => {
            if (lowerDesc.includes(keyword) && !keywords.includes(category)) {
                keywords.push(category);
            }
        });

        return keywords;
    }

    identifyDomains(description) {
        const domains = [];
        const domainPatterns = {
            'web-development': /(web|website|frontend|backend|full.?stack)/i,
            'api-development': /(api|endpoint|rest|graphql|microservice)/i,
            'database-design': /(database|db|sql|query|schema|migration)/i,
            'user-interface': /(ui|interface|component|design|responsive)/i,
            'performance': /(performance|optimization|speed|loading|caching)/i,
            'security': /(security|auth|jwt|encryption|compliance|vulnerability)/i,
            'testing': /(test|testing|qa|automation|unit|integration|e2e)/i,
            'deployment': /(deploy|deployment|ci|cd|devops|infrastructure)/i,
            'data-science': /(data|analytics|ml|ai|machine.learning|visualization)/i,
            'mobile-development': /(mobile|ios|android|react.native|app)/i,
            'content-management': /(cms|content|blog|admin|management)/i,
            'e-commerce': /(ecommerce|e.commerce|payment|shop|cart|checkout)/i
        };

        Object.entries(domainPatterns).forEach(([domain, pattern]) => {
            if (pattern.test(description)) {
                domains.push(domain);
            }
        });

        return domains.length > 0 ? domains : ['general-development'];
    }

    assessComplexity(description, options) {
        let score = 0;
        
        // Length-based complexity
        if (description.length > 500) score += 2;
        else if (description.length > 200) score += 1;
        
        // Keyword-based complexity indicators
        const complexityIndicators = {
            high: ['architecture', 'system', 'enterprise', 'scalable', 'distributed', 'microservices', 'integration', 'migration'],
            medium: ['api', 'database', 'authentication', 'optimization', 'responsive', 'testing'],
            low: ['fix', 'update', 'simple', 'basic', 'small']
        };
        
        const lowerDesc = description.toLowerCase();
        complexityIndicators.high.forEach(indicator => {
            if (lowerDesc.includes(indicator)) score += 3;
        });
        complexityIndicators.medium.forEach(indicator => {
            if (lowerDesc.includes(indicator)) score += 1;
        });
        complexityIndicators.low.forEach(indicator => {
            if (lowerDesc.includes(indicator)) score -= 1;
        });
        
        // Multi-domain indicates higher complexity
        const domains = this.identifyDomains(description);
        if (domains.length > 2) score += 2;
        else if (domains.length > 1) score += 1;
        
        // Options-based complexity
        if (options.timeline && options.timeline === 'urgent') score += 1;
        if (options.constraints && options.constraints.length > 2) score += 1;
        
        if (score >= 5) return 'high';
        if (score >= 2) return 'medium';
        return 'low';
    }

    mapCapabilities(keywords, domains) {
        const capabilities = new Set();
        
        // Map keywords to required capabilities
        const keywordCapabilityMap = {
            'frontend': ['javascript', 'typescript', 'react', 'css', 'html'],
            'backend': ['python', 'javascript', 'api-development', 'database-integration'],
            'database': ['sql', 'database-design', 'query-optimization'],
            'performance': ['optimization', 'monitoring', 'profiling'],
            'security': ['vulnerability-assessment', 'secure-coding', 'compliance'],
            'testing': ['test-automation', 'qa-processes', 'ci-cd-testing'],
            'devops': ['deployment', 'infrastructure', 'ci-cd', 'monitoring'],
            'data': ['data-analysis', 'statistical-modeling', 'python'],
            'ml': ['machine-learning', 'data-science', 'python', 'tensorflow'],
            'ai': ['ai-integration', 'llm-implementation', 'python']
        };
        
        keywords.forEach(keyword => {
            if (keywordCapabilityMap[keyword]) {
                keywordCapabilityMap[keyword].forEach(cap => capabilities.add(cap));
            }
        });
        
        return Array.from(capabilities);
    }

    generateRecommendations(analysis) {
        const candidates = this.rankAgents(analysis);
        const primary = candidates[0];
        const secondary = candidates.slice(1, 4);
        
        // Check for pre-defined combinations
        const combination = this.findOptimalCombination(analysis);
        
        return {
            primary: primary ? primary.agent : 'general-purpose',
            primaryScore: primary ? primary.score : 0.5,
            secondary: secondary.map(c => c.agent),
            combination: combination || [],
            reasoning: this.generateReasoning(primary, analysis),
            confidence: this.calculateConfidence(primary, analysis)
        };
    }

    rankAgents(analysis) {
        const agents = this.agentMatrix.agents || {};
        const candidates = [];
        
        Object.entries(agents).forEach(([agentName, agentData]) => {
            const score = this.calculateAgentScore(agentName, agentData, analysis);
            if (score > 0.3) { // Minimum threshold
                candidates.push({
                    agent: agentName,
                    score,
                    agentData,
                    reasoning: this.getScoreBreakdown(agentName, agentData, analysis)
                });
            }
        });
        
        return candidates.sort((a, b) => b.score - a.score);
    }

    calculateAgentScore(agentName, agentData, analysis) {
        let score = 0;
        
        // Capability Match (40%)
        const capabilityMatch = this.calculateCapabilityMatch(agentData, analysis);
        score += capabilityMatch * 0.4;
        
        // Domain Expertise (25%)
        const domainMatch = this.calculateDomainMatch(agentData, analysis);
        score += domainMatch * 0.25;
        
        // Complexity Handling (20%)
        const complexityMatch = this.calculateComplexityMatch(agentData, analysis);
        score += complexityMatch * 0.2;
        
        // Integration Compatibility (10%)
        const integrationMatch = this.calculateIntegrationMatch(agentData, analysis);
        score += integrationMatch * 0.1;
        
        // Performance History (5%)
        const performanceScore = this.getPerformanceScore(agentName);
        score += performanceScore * 0.05;
        
        return Math.min(score, 1.0); // Cap at 1.0
    }

    calculateCapabilityMatch(agentData, analysis) {
        const agentCapabilities = agentData.capabilities.languages.concat(
            agentData.capabilities.frameworks || [],
            agentData.specializations || []
        );
        
        const requiredCapabilities = analysis.requiredCapabilities;
        if (requiredCapabilities.length === 0) return 0.5; // Default if no specific requirements
        
        const matches = requiredCapabilities.filter(req => 
            agentCapabilities.some(cap => 
                cap.toLowerCase().includes(req.toLowerCase()) || 
                req.toLowerCase().includes(cap.toLowerCase())
            )
        );
        
        return matches.length / requiredCapabilities.length;
    }

    calculateDomainMatch(agentData, analysis) {
        const agentDomains = agentData.capabilities.domains || [];
        const taskDomains = analysis.domains;
        
        if (taskDomains.length === 0) return 0.5;
        
        const matches = taskDomains.filter(domain => 
            agentDomains.some(agentDomain => 
                agentDomain.includes(domain) || domain.includes(agentDomain)
            )
        );
        
        return matches.length / taskDomains.length;
    }

    calculateComplexityMatch(agentData, analysis) {
        const agentComplexity = agentData.capabilities.complexity || 'medium';
        const taskComplexity = analysis.complexity;
        
        const complexityMap = { low: 1, medium: 2, high: 3 };
        const agentLevel = complexityMap[agentComplexity];
        const taskLevel = complexityMap[taskComplexity];
        
        // Agents should handle equal or lower complexity well
        if (agentLevel >= taskLevel) return 1.0;
        if (agentLevel === taskLevel - 1) return 0.7;
        return 0.3;
    }

    calculateIntegrationMatch(agentData, analysis) {
        // Check if agent works well with existing project stack
        // This would be enhanced with actual project analysis
        return 0.8; // Default good integration score
    }

    getScoreBreakdown(agentName, agentData, analysis) {
        const breakdown = [];
        
        const capabilityMatch = this.calculateCapabilityMatch(agentData, analysis);
        breakdown.push(`Capability match: ${(capabilityMatch * 100).toFixed(1)}%`);
        
        const domainMatch = this.calculateDomainMatch(agentData, analysis);
        breakdown.push(`Domain expertise: ${(domainMatch * 100).toFixed(1)}%`);
        
        const complexityMatch = this.calculateComplexityMatch(agentData, analysis);
        breakdown.push(`Complexity handling: ${(complexityMatch * 100).toFixed(1)}%`);
        
        return breakdown.join(', ');
    }

    getPerformanceScore(agentName) {
        const history = this.performanceHistory[agentName];
        if (!history) return 0.5;
        return history.successRate;
    }

    findOptimalCombination(analysis) {
        const taskClassification = this.agentMatrix.taskClassification || {};
        const combinations = this.agentMatrix.agentCombinations || {};
        
        // Find matching task patterns
        for (const [taskType, agents] of Object.entries(taskClassification)) {
            if (analysis.keywords.includes(taskType) || analysis.domains.some(d => d.includes(taskType))) {
                return agents;
            }
        }
        
        // Check for complexity-based combinations
        if (analysis.complexity === 'high') {
            const domains = analysis.domains;
            if (domains.includes('web-development')) return combinations['full-stack'];
            if (domains.includes('performance')) return combinations['performance-optimization'];
            if (domains.includes('security')) return combinations['security-audit'];
        }
        
        return null;
    }

    generateReasoning(primaryCandidate, analysis) {
        if (!primaryCandidate) return 'No optimal agent found. Using general-purpose as fallback.';
        
        const agent = primaryCandidate.agentData;
        const reasons = [];
        
        reasons.push(`Selected ${primaryCandidate.agent} (confidence: ${(primaryCandidate.score * 100).toFixed(1)}%)`);
        
        if (agent.specializations) {
            const relevantSpecs = agent.specializations.filter(spec => 
                analysis.keywords.some(keyword => spec.includes(keyword))
            );
            if (relevantSpecs.length > 0) {
                reasons.push(`Specializes in: ${relevantSpecs.join(', ')}`);
            }
        }
        
        if (analysis.complexity === 'high' && agent.capabilities.complexity === 'high') {
            reasons.push('Capable of handling high complexity tasks');
        }
        
        return reasons.join('. ');
    }

    calculateConfidence(primaryCandidate, analysis) {
        if (!primaryCandidate) return 0.3;
        
        let confidence = primaryCandidate.score;
        
        // Boost confidence for exact matches
        if (analysis.domains.some(domain => 
            primaryCandidate.agentData.capabilities.domains.includes(domain)
        )) {
            confidence += 0.1;
        }
        
        // Reduce confidence for complex tasks with simple agents
        if (analysis.complexity === 'high' && primaryCandidate.agentData.capabilities.complexity !== 'high') {
            confidence -= 0.2;
        }
        
        return Math.max(0.1, Math.min(1.0, confidence));
    }

    generateBriefing(agentName, analysis) {
        const agent = this.agentMatrix.agents[agentName];
        if (!agent) return this.getDefaultBriefing(analysis);
        
        return {
            agent: agentName,
            task: analysis.description,
            approach: analysis.suggestedApproach,
            complexity: analysis.complexity,
            keyRequirements: analysis.requiredCapabilities,
            successCriteria: this.generateSuccessCriteria(analysis),
            constraints: analysis.constraints,
            integrationPoints: this.identifyIntegrationPoints(analysis),
            nextSteps: this.generateNextSteps(agentName, analysis)
        };
    }

    getDefaultBriefing(analysis) {
        return {
            agent: 'general-purpose',
            task: analysis.description,
            approach: 'exploratory',
            complexity: analysis.complexity,
            keyRequirements: ['general-development'],
            successCriteria: ['Task completion according to requirements'],
            constraints: analysis.constraints,
            integrationPoints: ['Main project codebase'],
            nextSteps: ['Analyze requirements', 'Implement solution', 'Test implementation']
        };
    }

    generateSuccessCriteria(analysis) {
        const criteria = ['Task completed according to specifications'];
        
        if (analysis.keywords.includes('performance')) {
            criteria.push('Performance metrics meet or exceed targets');
        }
        
        if (analysis.keywords.includes('testing')) {
            criteria.push('All tests pass and coverage requirements met');
        }
        
        if (analysis.keywords.includes('security')) {
            criteria.push('Security audit passes without critical issues');
        }
        
        return criteria;
    }

    identifyIntegrationPoints(analysis) {
        const points = ['Main project repository'];
        
        if (analysis.keywords.includes('database')) {
            points.push('Database layer');
        }
        
        if (analysis.keywords.includes('api')) {
            points.push('API endpoints', 'Authentication system');
        }
        
        if (analysis.keywords.includes('frontend')) {
            points.push('UI components', 'State management');
        }
        
        return points;
    }

    generateNextSteps(agentName, analysis) {
        const agent = this.agentMatrix.agents[agentName];
        const steps = [];
        
        steps.push('Review task requirements and constraints');
        steps.push('Analyze existing codebase and architecture');
        
        if (agent && agent.capabilities.complexity === 'high') {
            steps.push('Create detailed implementation plan');
            steps.push('Identify potential risks and mitigation strategies');
        }
        
        steps.push('Begin implementation following CLAUDE.md guidelines');
        steps.push('Regular progress updates to context manager');
        
        if (analysis.complexity === 'high') {
            steps.push('Coordinate with other agents as needed');
        }
        
        return steps;
    }

    createExecutionPlan(recommendations, analysis) {
        const plan = {
            approach: analysis.suggestedApproach,
            phases: [],
            timeline: this.estimateTimeline(analysis),
            resources: recommendations.combination.length > 0 ? recommendations.combination : [recommendations.primary]
        };
        
        if (analysis.suggestedApproach === 'multi-agent') {
            plan.phases = this.createMultiAgentPhases(recommendations, analysis);
        } else {
            plan.phases = this.createSingleAgentPhases(recommendations.primary, analysis);
        }
        
        return plan;
    }

    createMultiAgentPhases(recommendations, analysis) {
        const phases = [
            {
                name: 'Planning & Architecture',
                agent: 'context-manager',
                duration: '1-2 hours',
                deliverables: ['Detailed execution plan', 'Agent coordination strategy']
            }
        ];
        
        if (recommendations.combination.length > 0) {
            recommendations.combination.forEach((agent, index) => {
                const agentData = this.agentMatrix.agents[agent];
                phases.push({
                    name: `Implementation Phase ${index + 1}`,
                    agent,
                    duration: this.estimateAgentDuration(agent, analysis),
                    deliverables: this.getAgentDeliverables(agent, agentData),
                    dependencies: index > 0 ? [phases[index].name] : []
                });
            });
        }
        
        phases.push({
            name: 'Integration & Testing',
            agent: 'test-automator',
            duration: '2-4 hours',
            deliverables: ['Integration tests', 'Performance validation', 'Quality assurance']
        });
        
        return phases;
    }

    createSingleAgentPhases(primaryAgent, analysis) {
        return [
            {
                name: 'Analysis & Planning',
                agent: primaryAgent,
                duration: '0.5-1 hour',
                deliverables: ['Requirements analysis', 'Implementation plan']
            },
            {
                name: 'Implementation',
                agent: primaryAgent,
                duration: this.estimateAgentDuration(primaryAgent, analysis),
                deliverables: ['Core implementation', 'Documentation updates']
            },
            {
                name: 'Testing & Validation',
                agent: primaryAgent,
                duration: '1-2 hours',
                deliverables: ['Unit tests', 'Integration validation', 'Performance check']
            }
        ];
    }

    estimateTimeline(analysis) {
        const baseHours = {
            low: 2,
            medium: 6,
            high: 16
        };
        
        let hours = baseHours[analysis.complexity];
        
        // Adjust for domain complexity
        if (analysis.domains.length > 2) hours *= 1.5;
        if (analysis.domains.includes('security')) hours *= 1.2;
        if (analysis.domains.includes('performance')) hours *= 1.3;
        
        return `${Math.floor(hours)}-${Math.ceil(hours * 1.5)} hours`;
    }

    estimateAgentDuration(agentName, analysis) {
        const agent = this.agentMatrix.agents[agentName];
        if (!agent) return '2-4 hours';
        
        const complexityMultiplier = {
            low: 1,
            medium: 1.5,
            high: 2.5
        };
        
        const baseHours = agent.capabilities.complexity === 'high' ? 4 : 3;
        const hours = baseHours * complexityMultiplier[analysis.complexity];
        
        return `${Math.floor(hours)}-${Math.ceil(hours * 1.2)} hours`;
    }

    getAgentDeliverables(agentName, agentData) {
        const deliverables = ['Task completion'];
        
        if (agentData.capabilities.domains.includes('user-interface')) {
            deliverables.push('UI components', 'Responsive design');
        }
        
        if (agentData.capabilities.domains.includes('api-development')) {
            deliverables.push('API endpoints', 'Documentation');
        }
        
        if (agentData.capabilities.domains.includes('database-design')) {
            deliverables.push('Database schema', 'Migration scripts');
        }
        
        return deliverables;
    }

    getAlternatives(primaryAgent, analysis) {
        const alternatives = [];
        const allCandidates = this.rankAgents(analysis);
        
        // Get top alternatives excluding primary
        const alternativeCandidates = allCandidates
            .filter(c => c.agent !== primaryAgent)
            .slice(0, 3);
        
        alternativeCandidates.forEach(candidate => {
            alternatives.push({
                agent: candidate.agent,
                score: candidate.score,
                reason: `Alternative with ${(candidate.score * 100).toFixed(1)}% match`,
                useCase: this.getAlternativeUseCase(candidate.agent, analysis)
            });
        });
        
        return alternatives;
    }

    getAlternativeUseCase(agentName, analysis) {
        const agent = this.agentMatrix.agents[agentName];
        if (!agent) return 'General alternative approach';
        
        const specializations = agent.specializations || [];
        const relevantSpecs = specializations.filter(spec => 
            analysis.keywords.some(keyword => spec.includes(keyword))
        );
        
        if (relevantSpecs.length > 0) {
            return `Better for: ${relevantSpecs[0]}`;
        }
        
        return `Alternative specializing in: ${specializations[0] || 'general development'}`;
    }

    /**
     * Save performance feedback for future selections
     */
    updatePerformance(agentName, taskType, success, feedback = {}) {
        if (!this.performanceHistory[agentName]) {
            this.performanceHistory[agentName] = this.initializePerformanceHistory()[agentName];
        }
        
        const history = this.performanceHistory[agentName];
        history.taskCount++;
        
        // Update success rate with moving average
        const weight = Math.min(history.taskCount, 10) / 10; // Weight recent tasks more
        history.successRate = (history.successRate * (1 - weight)) + (success ? weight : 0);
        
        // Track strengths and weaknesses
        if (success && feedback.strengths) {
            feedback.strengths.forEach(strength => {
                if (!history.strengths.includes(strength)) {
                    history.strengths.push(strength);
                }
            });
        }
        
        if (!success && feedback.weaknesses) {
            feedback.weaknesses.forEach(weakness => {
                if (!history.weaknesses.includes(weakness)) {
                    history.weaknesses.push(weakness);
                }
            });
        }
        
        this.savePerformanceHistory();
    }

    savePerformanceHistory() {
        try {
            const historyPath = path.join(__dirname, '../context/agent-performance.json');
            fs.writeFileSync(historyPath, JSON.stringify(this.performanceHistory, null, 2));
        } catch (error) {
            console.error('Error saving performance history:', error.message);
        }
    }
}

// CLI Interface
if (require.main === module) {
    const selector = new AgentSelector();
    
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Usage: node agent-selector.js <task-description> [options]');
        console.log('       node agent-selector.js --interactive');
        process.exit(1);
    }
    
    if (args[0] === '--interactive') {
        // Interactive mode would be implemented here
        console.log('Interactive mode not yet implemented');
        process.exit(0);
    }
    
    const taskDescription = args.join(' ');
    const result = selector.selectAgent(taskDescription);
    
    console.log('\\n🤖 Agent Selection Results\\n');
    console.log('Task:', result.taskAnalysis.description);
    console.log('Complexity:', result.taskAnalysis.complexity);
    console.log('Domains:', result.taskAnalysis.domains.join(', '));
    console.log('\\nRecommendations:');
    console.log('Primary Agent:', result.recommendations.primary);
    console.log('Confidence:', (result.recommendations.confidence * 100).toFixed(1) + '%');
    console.log('Reasoning:', result.recommendations.reasoning);
    
    if (result.recommendations.combination.length > 0) {
        console.log('\\nSuggested Team:', result.recommendations.combination.join(', '));
    }
    
    console.log('\\nExecution Plan:');
    result.executionPlan.phases.forEach((phase, index) => {
        console.log(`${index + 1}. ${phase.name} (${phase.agent}) - ${phase.duration}`);
    });
    
    if (result.alternatives.length > 0) {
        console.log('\\nAlternatives:');
        result.alternatives.forEach(alt => {
            console.log(`- ${alt.agent} (${(alt.score * 100).toFixed(1)}%): ${alt.useCase}`);
        });
    }
}

module.exports = AgentSelector;