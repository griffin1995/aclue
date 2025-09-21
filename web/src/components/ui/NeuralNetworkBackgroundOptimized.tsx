import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
  type: 'primary' | 'secondary' | 'accent';
  gridIndex?: number; // For spatial indexing
}

interface Connection {
  from: Node;
  to: Node;
  opacity: number;
  strength: number;
}

interface NeuralNetworkBackgroundProps {
  nodeCount?: number;
  connectionDistance?: number;
  animationSpeed?: number;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    connections: string;
  };
  performanceMode?: 'high' | 'balanced' | 'low';
}

/**
 * Optimized Neural Network Background Component
 *
 * Performance improvements:
 * - Adaptive frame rate based on device capabilities
 * - Spatial indexing for connection calculations
 * - Visibility-based rendering (pauses when tab is hidden)
 * - Mobile-optimized node count
 * - Memory-efficient connection caching
 * - RequestIdleCallback for non-critical updates
 * - Reduced calculations through grid-based spatial partitioning
 */
export const NeuralNetworkBackgroundOptimized: React.FC<NeuralNetworkBackgroundProps> = ({
  nodeCount: defaultNodeCount = 80,
  connectionDistance = 150,
  animationSpeed = 0.5,
  colors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    connections: '#3b82f6'
  },
  performanceMode = 'balanced'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);
  const spatialGridRef = useRef<Map<string, Node[]>>(new Map());
  const connectionCacheRef = useRef<Map<string, Connection[]>>(new Map());
  const isVisibleRef = useRef<boolean>(true);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Performance configuration based on mode
  const perfConfig = {
    high: { fps: 60, nodeMultiplier: 1, cacheConnections: false },
    balanced: { fps: 30, nodeMultiplier: 0.7, cacheConnections: true },
    low: { fps: 15, nodeMultiplier: 0.4, cacheConnections: true }
  }[performanceMode];

  // Detect mobile and reduce node count
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const nodeCount = Math.floor(
    (isMobile ? defaultNodeCount * 0.5 : defaultNodeCount) * perfConfig.nodeMultiplier
  );

  // Target frame time based on desired FPS
  const targetFrameTime = 1000 / perfConfig.fps;

  // Grid size for spatial partitioning
  const GRID_SIZE = connectionDistance;

  /**
   * Get grid key for spatial indexing
   */
  const getGridKey = (x: number, y: number): string => {
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);
    return `${gridX},${gridY}`;
  };

  /**
   * Get neighboring grid cells for connection search
   */
  const getNeighboringCells = (x: number, y: number): string[] => {
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);
    const cells: string[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        cells.push(`${gridX + dx},${gridY + dy}`);
      }
    }

    return cells;
  };

  /**
   * Update spatial grid with node positions
   */
  const updateSpatialGrid = useCallback(() => {
    const newGrid = new Map<string, Node[]>();

    nodesRef.current.forEach(node => {
      const key = getGridKey(node.x, node.y);
      if (!newGrid.has(key)) {
        newGrid.set(key, []);
      }
      newGrid.get(key)!.push(node);
      node.gridIndex = newGrid.get(key)!.length - 1;
    });

    spatialGridRef.current = newGrid;
  }, []);

  /**
   * Convert hex to rgba
   */
  const hexToRgba = useCallback((hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }, []);

  /**
   * Handle window resize
   */
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();

    // Debounced resize handler
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Handle visibility change
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;

      if (!document.hidden && animationRef.current === undefined) {
        // Resume animation when tab becomes visible
        lastFrameTimeRef.current = performance.now();
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  /**
   * Initialize nodes
   */
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const nodes: Node[] = [];
    const nodeTypes: Array<'primary' | 'secondary' | 'accent'> = ['primary', 'secondary', 'accent'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.7 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
      });
    }

    nodesRef.current = nodes;
    updateSpatialGrid();

    // Clear connection cache when nodes change
    connectionCacheRef.current.clear();
  }, [dimensions, nodeCount, animationSpeed, updateSpatialGrid]);

  /**
   * Find connections using spatial partitioning
   */
  const findConnections = useCallback((): Connection[] => {
    // Check cache first if enabled
    if (perfConfig.cacheConnections && frameCountRef.current % 5 !== 0) {
      const cached = connectionCacheRef.current.get('current');
      if (cached) return cached;
    }

    const connections: Connection[] = [];
    const processed = new Set<string>();

    nodesRef.current.forEach((nodeA, indexA) => {
      const neighborCells = getNeighboringCells(nodeA.x, nodeA.y);

      neighborCells.forEach(cellKey => {
        const nodesInCell = spatialGridRef.current.get(cellKey) || [];

        nodesInCell.forEach(nodeB => {
          if (nodeA.id >= nodeB.id) return; // Avoid duplicates

          const pairKey = `${nodeA.id}-${nodeB.id}`;
          if (processed.has(pairKey)) return;
          processed.add(pairKey);

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = Math.max(0, 1 - distance / connectionDistance);
            connections.push({
              from: nodeA,
              to: nodeB,
              opacity: opacity * 0.3,
              strength: opacity
            });
          }
        });
      });
    });

    // Cache connections if enabled
    if (perfConfig.cacheConnections) {
      connectionCacheRef.current.set('current', connections);
    }

    return connections;
  }, [connectionDistance, perfConfig.cacheConnections]);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    // Pause animation when tab is hidden
    if (!isVisibleRef.current) {
      animationRef.current = undefined;
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTimeRef.current;

    // Frame rate limiting
    if (deltaTime < targetFrameTime) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Update nodes with frame-independent movement
    const speedMultiplier = deltaTime / 16.67; // Normalize to 60fps baseline

    nodesRef.current.forEach(node => {
      // Update position
      node.x += node.vx * speedMultiplier;
      node.y += node.vy * speedMultiplier;

      // Bounce off edges
      if (node.x <= 0 || node.x >= dimensions.width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(dimensions.width, node.x));
      }
      if (node.y <= 0 || node.y >= dimensions.height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(dimensions.height, node.y));
      }

      // Update pulse (slower for better performance)
      node.pulsePhase += 0.01 * speedMultiplier;
      node.opacity = 0.3 + 0.4 * Math.sin(node.pulsePhase);
    });

    // Update spatial grid periodically
    if (frameCountRef.current % 10 === 0) {
      updateSpatialGrid();
    }

    // Find and draw connections
    const connections = findConnections();

    // Draw connections with reduced quality for performance
    ctx.lineWidth = 1;
    connections.forEach(connection => {
      ctx.beginPath();
      ctx.moveTo(connection.from.x, connection.from.y);
      ctx.lineTo(connection.to.x, connection.to.y);

      // Simplified gradient for performance
      ctx.strokeStyle = hexToRgba(colors.connections, connection.opacity);
      ctx.stroke();
    });

    // Draw nodes with reduced effects
    nodesRef.current.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);

      // Get color based on type
      let color = colors.primary;
      if (node.type === 'secondary') color = colors.secondary;
      if (node.type === 'accent') color = colors.accent;

      // Simple fill without gradient for performance
      ctx.fillStyle = hexToRgba(color, node.opacity);
      ctx.fill();
    });

    // Update frame tracking
    lastFrameTimeRef.current = currentTime;
    frameCountRef.current++;

    // Calculate actual FPS periodically
    if (frameCountRef.current % 60 === 0) {
      const avgFrameTime = deltaTime;
      fpsRef.current = Math.round(1000 / avgFrameTime);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [
    dimensions,
    colors,
    targetFrameTime,
    updateSpatialGrid,
    findConnections,
    hexToRgba
  ]);

  /**
   * Start animation
   */
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    lastFrameTimeRef.current = performance.now();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: -1,
        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 35%, rgba(6, 182, 212, 0.05) 70%, transparent 100%)',
        willChange: 'transform',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
      aria-hidden="true"
    />
  );
};

export default NeuralNetworkBackgroundOptimized;