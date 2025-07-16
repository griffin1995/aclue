import React, { useEffect, useRef, useState } from 'react';

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
}

export const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({
  nodeCount = 80,
  connectionDistance = 150,
  animationSpeed = 0.5,
  colors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    connections: '#3b82f6'
  }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize nodes
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
  }, [dimensions, nodeCount, animationSpeed]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update nodes
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= dimensions.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(dimensions.width, node.x));
        }
        if (node.y <= 0 || node.y >= dimensions.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(dimensions.height, node.y));
        }

        // Update pulse
        node.pulsePhase += 0.02;
        node.opacity = 0.3 + 0.4 * Math.sin(node.pulsePhase);
      });

      // Find connections
      const connections: Connection[] = [];
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          
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
        }
      }

      // Draw connections
      connections.forEach(connection => {
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(
          connection.from.x, connection.from.y,
          connection.to.x, connection.to.y
        );
        // Convert hex to rgba for better browser compatibility
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        gradient.addColorStop(0, hexToRgba(colors.connections, connection.opacity));
        gradient.addColorStop(0.5, hexToRgba(colors.accent, connection.opacity * 0.5));
        gradient.addColorStop(1, hexToRgba(colors.connections, connection.opacity));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = connection.strength * 1.5;
        ctx.stroke();
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        
        // Get color based on type
        let color = colors.primary;
        if (node.type === 'secondary') color = colors.secondary;
        if (node.type === 'accent') color = colors.accent;
        
        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 3
        );
        // Convert hex to rgba for better browser compatibility
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        gradient.addColorStop(0, hexToRgba(color, node.opacity));
        gradient.addColorStop(0.3, hexToRgba(color, node.opacity * 0.5));
        gradient.addColorStop(1, hexToRgba(color, 0));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Inner bright core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.4, 0, Math.PI * 2);
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        ctx.fillStyle = hexToRgba(color, Math.min(1, node.opacity * 1.5));
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, connectionDistance, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: -1,
        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 35%, rgba(6, 182, 212, 0.05) 70%, transparent 100%)'
      }}
    />
  );
};

export default NeuralNetworkBackground;