// @ts-nocheck
'use client';

function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
  colors = stryMutAct_9fa48("7531") ? {} : (stryCov_9fa48("7531"), {
    primary: stryMutAct_9fa48("7532") ? "" : (stryCov_9fa48("7532"), '#3b82f6'),
    secondary: stryMutAct_9fa48("7533") ? "" : (stryCov_9fa48("7533"), '#8b5cf6'),
    accent: stryMutAct_9fa48("7534") ? "" : (stryCov_9fa48("7534"), '#06b6d4'),
    connections: stryMutAct_9fa48("7535") ? "" : (stryCov_9fa48("7535"), '#3b82f6')
  }),
  performanceMode = stryMutAct_9fa48("7536") ? "" : (stryCov_9fa48("7536"), 'balanced')
}) => {
  if (stryMutAct_9fa48("7537")) {
    {}
  } else {
    stryCov_9fa48("7537");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const nodesRef = useRef<Node[]>(stryMutAct_9fa48("7538") ? ["Stryker was here"] : (stryCov_9fa48("7538"), []));
    const lastFrameTimeRef = useRef<number>(0);
    const frameCountRef = useRef<number>(0);
    const fpsRef = useRef<number>(60);
    const spatialGridRef = useRef<Map<string, Node[]>>(new Map());
    const connectionCacheRef = useRef<Map<string, Connection[]>>(new Map());
    const isVisibleRef = useRef<boolean>(stryMutAct_9fa48("7539") ? false : (stryCov_9fa48("7539"), true));
    const [dimensions, setDimensions] = useState(stryMutAct_9fa48("7540") ? {} : (stryCov_9fa48("7540"), {
      width: 0,
      height: 0
    }));

    // Performance configuration based on mode
    const perfConfig = (stryMutAct_9fa48("7541") ? {} : (stryCov_9fa48("7541"), {
      high: stryMutAct_9fa48("7542") ? {} : (stryCov_9fa48("7542"), {
        fps: 60,
        nodeMultiplier: 1,
        cacheConnections: stryMutAct_9fa48("7543") ? true : (stryCov_9fa48("7543"), false)
      }),
      balanced: stryMutAct_9fa48("7544") ? {} : (stryCov_9fa48("7544"), {
        fps: 30,
        nodeMultiplier: 0.7,
        cacheConnections: stryMutAct_9fa48("7545") ? false : (stryCov_9fa48("7545"), true)
      }),
      low: stryMutAct_9fa48("7546") ? {} : (stryCov_9fa48("7546"), {
        fps: 15,
        nodeMultiplier: 0.4,
        cacheConnections: stryMutAct_9fa48("7547") ? false : (stryCov_9fa48("7547"), true)
      })
    }))[performanceMode];

    // Detect mobile and reduce node count
    const isMobile = stryMutAct_9fa48("7550") ? typeof window !== 'undefined' || window.innerWidth < 768 : stryMutAct_9fa48("7549") ? false : stryMutAct_9fa48("7548") ? true : (stryCov_9fa48("7548", "7549", "7550"), (stryMutAct_9fa48("7552") ? typeof window === 'undefined' : stryMutAct_9fa48("7551") ? true : (stryCov_9fa48("7551", "7552"), typeof window !== (stryMutAct_9fa48("7553") ? "" : (stryCov_9fa48("7553"), 'undefined')))) && (stryMutAct_9fa48("7556") ? window.innerWidth >= 768 : stryMutAct_9fa48("7555") ? window.innerWidth <= 768 : stryMutAct_9fa48("7554") ? true : (stryCov_9fa48("7554", "7555", "7556"), window.innerWidth < 768)));
    const nodeCount = Math.floor(stryMutAct_9fa48("7557") ? (isMobile ? defaultNodeCount * 0.5 : defaultNodeCount) / perfConfig.nodeMultiplier : (stryCov_9fa48("7557"), (isMobile ? stryMutAct_9fa48("7558") ? defaultNodeCount / 0.5 : (stryCov_9fa48("7558"), defaultNodeCount * 0.5) : defaultNodeCount) * perfConfig.nodeMultiplier));

    // Target frame time based on desired FPS
    const targetFrameTime = stryMutAct_9fa48("7559") ? 1000 * perfConfig.fps : (stryCov_9fa48("7559"), 1000 / perfConfig.fps);

    // Grid size for spatial partitioning
    const GRID_SIZE = connectionDistance;

    /**
     * Get grid key for spatial indexing
     */
    const getGridKey = (x: number, y: number): string => {
      if (stryMutAct_9fa48("7560")) {
        {}
      } else {
        stryCov_9fa48("7560");
        const gridX = Math.floor(stryMutAct_9fa48("7561") ? x * GRID_SIZE : (stryCov_9fa48("7561"), x / GRID_SIZE));
        const gridY = Math.floor(stryMutAct_9fa48("7562") ? y * GRID_SIZE : (stryCov_9fa48("7562"), y / GRID_SIZE));
        return stryMutAct_9fa48("7563") ? `` : (stryCov_9fa48("7563"), `${gridX},${gridY}`);
      }
    };

    /**
     * Get neighboring grid cells for connection search
     */
    const getNeighboringCells = (x: number, y: number): string[] => {
      if (stryMutAct_9fa48("7564")) {
        {}
      } else {
        stryCov_9fa48("7564");
        const gridX = Math.floor(stryMutAct_9fa48("7565") ? x * GRID_SIZE : (stryCov_9fa48("7565"), x / GRID_SIZE));
        const gridY = Math.floor(stryMutAct_9fa48("7566") ? y * GRID_SIZE : (stryCov_9fa48("7566"), y / GRID_SIZE));
        const cells: string[] = stryMutAct_9fa48("7567") ? ["Stryker was here"] : (stryCov_9fa48("7567"), []);
        for (let dx = stryMutAct_9fa48("7568") ? +1 : (stryCov_9fa48("7568"), -1); stryMutAct_9fa48("7571") ? dx > 1 : stryMutAct_9fa48("7570") ? dx < 1 : stryMutAct_9fa48("7569") ? false : (stryCov_9fa48("7569", "7570", "7571"), dx <= 1); stryMutAct_9fa48("7572") ? dx-- : (stryCov_9fa48("7572"), dx++)) {
          if (stryMutAct_9fa48("7573")) {
            {}
          } else {
            stryCov_9fa48("7573");
            for (let dy = stryMutAct_9fa48("7574") ? +1 : (stryCov_9fa48("7574"), -1); stryMutAct_9fa48("7577") ? dy > 1 : stryMutAct_9fa48("7576") ? dy < 1 : stryMutAct_9fa48("7575") ? false : (stryCov_9fa48("7575", "7576", "7577"), dy <= 1); stryMutAct_9fa48("7578") ? dy-- : (stryCov_9fa48("7578"), dy++)) {
              if (stryMutAct_9fa48("7579")) {
                {}
              } else {
                stryCov_9fa48("7579");
                cells.push(stryMutAct_9fa48("7580") ? `` : (stryCov_9fa48("7580"), `${stryMutAct_9fa48("7581") ? gridX - dx : (stryCov_9fa48("7581"), gridX + dx)},${stryMutAct_9fa48("7582") ? gridY - dy : (stryCov_9fa48("7582"), gridY + dy)}`));
              }
            }
          }
        }
        return cells;
      }
    };

    /**
     * Update spatial grid with node positions
     */
    const updateSpatialGrid = useCallback(() => {
      if (stryMutAct_9fa48("7583")) {
        {}
      } else {
        stryCov_9fa48("7583");
        const newGrid = new Map<string, Node[]>();
        nodesRef.current.forEach(node => {
          if (stryMutAct_9fa48("7584")) {
            {}
          } else {
            stryCov_9fa48("7584");
            const key = getGridKey(node.x, node.y);
            if (stryMutAct_9fa48("7587") ? false : stryMutAct_9fa48("7586") ? true : stryMutAct_9fa48("7585") ? newGrid.has(key) : (stryCov_9fa48("7585", "7586", "7587"), !newGrid.has(key))) {
              if (stryMutAct_9fa48("7588")) {
                {}
              } else {
                stryCov_9fa48("7588");
                newGrid.set(key, stryMutAct_9fa48("7589") ? ["Stryker was here"] : (stryCov_9fa48("7589"), []));
              }
            }
            newGrid.get(key)!.push(node);
            node.gridIndex = stryMutAct_9fa48("7590") ? newGrid.get(key)!.length + 1 : (stryCov_9fa48("7590"), newGrid.get(key)!.length - 1);
          }
        });
        spatialGridRef.current = newGrid;
      }
    }, stryMutAct_9fa48("7591") ? ["Stryker was here"] : (stryCov_9fa48("7591"), []));

    /**
     * Convert hex to rgba
     */
    const hexToRgba = useCallback((hex: string, alpha: number): string => {
      if (stryMutAct_9fa48("7592")) {
        {}
      } else {
        stryCov_9fa48("7592");
        const r = parseInt(stryMutAct_9fa48("7593") ? hex : (stryCov_9fa48("7593"), hex.slice(1, 3)), 16);
        const g = parseInt(stryMutAct_9fa48("7594") ? hex : (stryCov_9fa48("7594"), hex.slice(3, 5)), 16);
        const b = parseInt(stryMutAct_9fa48("7595") ? hex : (stryCov_9fa48("7595"), hex.slice(5, 7)), 16);
        return stryMutAct_9fa48("7596") ? `` : (stryCov_9fa48("7596"), `rgba(${r}, ${g}, ${b}, ${alpha})`);
      }
    }, stryMutAct_9fa48("7597") ? ["Stryker was here"] : (stryCov_9fa48("7597"), []));

    /**
     * Handle window resize
     */
    useEffect(() => {
      if (stryMutAct_9fa48("7598")) {
        {}
      } else {
        stryCov_9fa48("7598");
        const updateDimensions = () => {
          if (stryMutAct_9fa48("7599")) {
            {}
          } else {
            stryCov_9fa48("7599");
            setDimensions(stryMutAct_9fa48("7600") ? {} : (stryCov_9fa48("7600"), {
              width: window.innerWidth,
              height: window.innerHeight
            }));
          }
        };
        updateDimensions();

        // Debounced resize handler
        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
          if (stryMutAct_9fa48("7601")) {
            {}
          } else {
            stryCov_9fa48("7601");
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateDimensions, 250);
          }
        };
        window.addEventListener(stryMutAct_9fa48("7602") ? "" : (stryCov_9fa48("7602"), 'resize'), handleResize);
        return () => {
          if (stryMutAct_9fa48("7603")) {
            {}
          } else {
            stryCov_9fa48("7603");
            clearTimeout(resizeTimer);
            window.removeEventListener(stryMutAct_9fa48("7604") ? "" : (stryCov_9fa48("7604"), 'resize'), handleResize);
          }
        };
      }
    }, stryMutAct_9fa48("7605") ? ["Stryker was here"] : (stryCov_9fa48("7605"), []));

    /**
     * Handle visibility change
     */
    useEffect(() => {
      if (stryMutAct_9fa48("7606")) {
        {}
      } else {
        stryCov_9fa48("7606");
        const handleVisibilityChange = () => {
          if (stryMutAct_9fa48("7607")) {
            {}
          } else {
            stryCov_9fa48("7607");
            isVisibleRef.current = stryMutAct_9fa48("7608") ? document.hidden : (stryCov_9fa48("7608"), !document.hidden);
            if (stryMutAct_9fa48("7611") ? !document.hidden || animationRef.current === undefined : stryMutAct_9fa48("7610") ? false : stryMutAct_9fa48("7609") ? true : (stryCov_9fa48("7609", "7610", "7611"), (stryMutAct_9fa48("7612") ? document.hidden : (stryCov_9fa48("7612"), !document.hidden)) && (stryMutAct_9fa48("7614") ? animationRef.current !== undefined : stryMutAct_9fa48("7613") ? true : (stryCov_9fa48("7613", "7614"), animationRef.current === undefined)))) {
              if (stryMutAct_9fa48("7615")) {
                {}
              } else {
                stryCov_9fa48("7615");
                // Resume animation when tab becomes visible
                lastFrameTimeRef.current = performance.now();
                animate();
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("7616") ? "" : (stryCov_9fa48("7616"), 'visibilitychange'), handleVisibilityChange);
        return stryMutAct_9fa48("7617") ? () => undefined : (stryCov_9fa48("7617"), () => document.removeEventListener(stryMutAct_9fa48("7618") ? "" : (stryCov_9fa48("7618"), 'visibilitychange'), handleVisibilityChange));
      }
    }, stryMutAct_9fa48("7619") ? ["Stryker was here"] : (stryCov_9fa48("7619"), []));

    /**
     * Initialize nodes
     */
    useEffect(() => {
      if (stryMutAct_9fa48("7620")) {
        {}
      } else {
        stryCov_9fa48("7620");
        if (stryMutAct_9fa48("7623") ? dimensions.width === 0 && dimensions.height === 0 : stryMutAct_9fa48("7622") ? false : stryMutAct_9fa48("7621") ? true : (stryCov_9fa48("7621", "7622", "7623"), (stryMutAct_9fa48("7625") ? dimensions.width !== 0 : stryMutAct_9fa48("7624") ? false : (stryCov_9fa48("7624", "7625"), dimensions.width === 0)) || (stryMutAct_9fa48("7627") ? dimensions.height !== 0 : stryMutAct_9fa48("7626") ? false : (stryCov_9fa48("7626", "7627"), dimensions.height === 0)))) return;
        const nodes: Node[] = stryMutAct_9fa48("7628") ? ["Stryker was here"] : (stryCov_9fa48("7628"), []);
        const nodeTypes: Array<'primary' | 'secondary' | 'accent'> = stryMutAct_9fa48("7629") ? [] : (stryCov_9fa48("7629"), [stryMutAct_9fa48("7630") ? "" : (stryCov_9fa48("7630"), 'primary'), stryMutAct_9fa48("7631") ? "" : (stryCov_9fa48("7631"), 'secondary'), stryMutAct_9fa48("7632") ? "" : (stryCov_9fa48("7632"), 'accent')]);
        for (let i = 0; stryMutAct_9fa48("7635") ? i >= nodeCount : stryMutAct_9fa48("7634") ? i <= nodeCount : stryMutAct_9fa48("7633") ? false : (stryCov_9fa48("7633", "7634", "7635"), i < nodeCount); stryMutAct_9fa48("7636") ? i-- : (stryCov_9fa48("7636"), i++)) {
          if (stryMutAct_9fa48("7637")) {
            {}
          } else {
            stryCov_9fa48("7637");
            nodes.push(stryMutAct_9fa48("7638") ? {} : (stryCov_9fa48("7638"), {
              id: i,
              x: stryMutAct_9fa48("7639") ? Math.random() / dimensions.width : (stryCov_9fa48("7639"), Math.random() * dimensions.width),
              y: stryMutAct_9fa48("7640") ? Math.random() / dimensions.height : (stryCov_9fa48("7640"), Math.random() * dimensions.height),
              vx: stryMutAct_9fa48("7641") ? (Math.random() - 0.5) / animationSpeed : (stryCov_9fa48("7641"), (stryMutAct_9fa48("7642") ? Math.random() + 0.5 : (stryCov_9fa48("7642"), Math.random() - 0.5)) * animationSpeed),
              vy: stryMutAct_9fa48("7643") ? (Math.random() - 0.5) / animationSpeed : (stryCov_9fa48("7643"), (stryMutAct_9fa48("7644") ? Math.random() + 0.5 : (stryCov_9fa48("7644"), Math.random() - 0.5)) * animationSpeed),
              size: stryMutAct_9fa48("7645") ? Math.random() * 4 - 2 : (stryCov_9fa48("7645"), (stryMutAct_9fa48("7646") ? Math.random() / 4 : (stryCov_9fa48("7646"), Math.random() * 4)) + 2),
              opacity: stryMutAct_9fa48("7647") ? Math.random() * 0.7 - 0.3 : (stryCov_9fa48("7647"), (stryMutAct_9fa48("7648") ? Math.random() / 0.7 : (stryCov_9fa48("7648"), Math.random() * 0.7)) + 0.3),
              pulsePhase: stryMutAct_9fa48("7649") ? Math.random() * Math.PI / 2 : (stryCov_9fa48("7649"), (stryMutAct_9fa48("7650") ? Math.random() / Math.PI : (stryCov_9fa48("7650"), Math.random() * Math.PI)) * 2),
              type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)] as "primary" | "secondary" | "accent"
            }));
          }
        }
        nodesRef.current = nodes;
        updateSpatialGrid();

        // Clear connection cache when nodes change
        connectionCacheRef.current.clear();
      }
    }, stryMutAct_9fa48("7651") ? [] : (stryCov_9fa48("7651"), [dimensions, nodeCount, animationSpeed, updateSpatialGrid]));

    /**
     * Find connections using spatial partitioning
     */
    const findConnections = useCallback((): Connection[] => {
      if (stryMutAct_9fa48("7652")) {
        {}
      } else {
        stryCov_9fa48("7652");
        // Check cache first if enabled
        if (stryMutAct_9fa48("7655") ? perfConfig.cacheConnections || frameCountRef.current % 5 !== 0 : stryMutAct_9fa48("7654") ? false : stryMutAct_9fa48("7653") ? true : (stryCov_9fa48("7653", "7654", "7655"), perfConfig.cacheConnections && (stryMutAct_9fa48("7657") ? frameCountRef.current % 5 === 0 : stryMutAct_9fa48("7656") ? true : (stryCov_9fa48("7656", "7657"), (stryMutAct_9fa48("7658") ? frameCountRef.current * 5 : (stryCov_9fa48("7658"), frameCountRef.current % 5)) !== 0)))) {
          if (stryMutAct_9fa48("7659")) {
            {}
          } else {
            stryCov_9fa48("7659");
            const cached = connectionCacheRef.current.get(stryMutAct_9fa48("7660") ? "" : (stryCov_9fa48("7660"), 'current'));
            if (stryMutAct_9fa48("7662") ? false : stryMutAct_9fa48("7661") ? true : (stryCov_9fa48("7661", "7662"), cached)) return cached;
          }
        }
        const connections: Connection[] = stryMutAct_9fa48("7663") ? ["Stryker was here"] : (stryCov_9fa48("7663"), []);
        const processed = new Set<string>();
        nodesRef.current.forEach((nodeA, indexA) => {
          if (stryMutAct_9fa48("7664")) {
            {}
          } else {
            stryCov_9fa48("7664");
            const neighborCells = getNeighboringCells(nodeA.x, nodeA.y);
            neighborCells.forEach(cellKey => {
              if (stryMutAct_9fa48("7665")) {
                {}
              } else {
                stryCov_9fa48("7665");
                const nodesInCell = stryMutAct_9fa48("7668") ? spatialGridRef.current.get(cellKey) && [] : stryMutAct_9fa48("7667") ? false : stryMutAct_9fa48("7666") ? true : (stryCov_9fa48("7666", "7667", "7668"), spatialGridRef.current.get(cellKey) || (stryMutAct_9fa48("7669") ? ["Stryker was here"] : (stryCov_9fa48("7669"), [])));
                nodesInCell.forEach(nodeB => {
                  if (stryMutAct_9fa48("7670")) {
                    {}
                  } else {
                    stryCov_9fa48("7670");
                    if (stryMutAct_9fa48("7674") ? nodeA.id < nodeB.id : stryMutAct_9fa48("7673") ? nodeA.id > nodeB.id : stryMutAct_9fa48("7672") ? false : stryMutAct_9fa48("7671") ? true : (stryCov_9fa48("7671", "7672", "7673", "7674"), nodeA.id >= nodeB.id)) return; // Avoid duplicates

                    const pairKey = stryMutAct_9fa48("7675") ? `` : (stryCov_9fa48("7675"), `${nodeA.id}-${nodeB.id}`);
                    if (stryMutAct_9fa48("7677") ? false : stryMutAct_9fa48("7676") ? true : (stryCov_9fa48("7676", "7677"), processed.has(pairKey))) return;
                    processed.add(pairKey);
                    const dx = stryMutAct_9fa48("7678") ? nodeA.x + nodeB.x : (stryCov_9fa48("7678"), nodeA.x - nodeB.x);
                    const dy = stryMutAct_9fa48("7679") ? nodeA.y + nodeB.y : (stryCov_9fa48("7679"), nodeA.y - nodeB.y);
                    const distance = Math.sqrt(stryMutAct_9fa48("7680") ? dx * dx - dy * dy : (stryCov_9fa48("7680"), (stryMutAct_9fa48("7681") ? dx / dx : (stryCov_9fa48("7681"), dx * dx)) + (stryMutAct_9fa48("7682") ? dy / dy : (stryCov_9fa48("7682"), dy * dy))));
                    if (stryMutAct_9fa48("7686") ? distance >= connectionDistance : stryMutAct_9fa48("7685") ? distance <= connectionDistance : stryMutAct_9fa48("7684") ? false : stryMutAct_9fa48("7683") ? true : (stryCov_9fa48("7683", "7684", "7685", "7686"), distance < connectionDistance)) {
                      if (stryMutAct_9fa48("7687")) {
                        {}
                      } else {
                        stryCov_9fa48("7687");
                        const opacity = stryMutAct_9fa48("7688") ? Math.min(0, 1 - distance / connectionDistance) : (stryCov_9fa48("7688"), Math.max(0, stryMutAct_9fa48("7689") ? 1 + distance / connectionDistance : (stryCov_9fa48("7689"), 1 - (stryMutAct_9fa48("7690") ? distance * connectionDistance : (stryCov_9fa48("7690"), distance / connectionDistance)))));
                        connections.push(stryMutAct_9fa48("7691") ? {} : (stryCov_9fa48("7691"), {
                          from: nodeA,
                          to: nodeB,
                          opacity: stryMutAct_9fa48("7692") ? opacity / 0.3 : (stryCov_9fa48("7692"), opacity * 0.3),
                          strength: opacity
                        }));
                      }
                    }
                  }
                });
              }
            });
          }
        });

        // Cache connections if enabled
        if (stryMutAct_9fa48("7694") ? false : stryMutAct_9fa48("7693") ? true : (stryCov_9fa48("7693", "7694"), perfConfig.cacheConnections)) {
          if (stryMutAct_9fa48("7695")) {
            {}
          } else {
            stryCov_9fa48("7695");
            connectionCacheRef.current.set(stryMutAct_9fa48("7696") ? "" : (stryCov_9fa48("7696"), 'current'), connections);
          }
        }
        return connections;
      }
    }, stryMutAct_9fa48("7697") ? [] : (stryCov_9fa48("7697"), [connectionDistance, perfConfig.cacheConnections]));

    /**
     * Animation loop
     */
    const animate = useCallback(() => {
      if (stryMutAct_9fa48("7698")) {
        {}
      } else {
        stryCov_9fa48("7698");
        if (stryMutAct_9fa48("7701") ? (!canvasRef.current || dimensions.width === 0) && dimensions.height === 0 : stryMutAct_9fa48("7700") ? false : stryMutAct_9fa48("7699") ? true : (stryCov_9fa48("7699", "7700", "7701"), (stryMutAct_9fa48("7703") ? !canvasRef.current && dimensions.width === 0 : stryMutAct_9fa48("7702") ? false : (stryCov_9fa48("7702", "7703"), (stryMutAct_9fa48("7704") ? canvasRef.current : (stryCov_9fa48("7704"), !canvasRef.current)) || (stryMutAct_9fa48("7706") ? dimensions.width !== 0 : stryMutAct_9fa48("7705") ? false : (stryCov_9fa48("7705", "7706"), dimensions.width === 0)))) || (stryMutAct_9fa48("7708") ? dimensions.height !== 0 : stryMutAct_9fa48("7707") ? false : (stryCov_9fa48("7707", "7708"), dimensions.height === 0)))) return;

        // Pause animation when tab is hidden
        if (stryMutAct_9fa48("7711") ? false : stryMutAct_9fa48("7710") ? true : stryMutAct_9fa48("7709") ? isVisibleRef.current : (stryCov_9fa48("7709", "7710", "7711"), !isVisibleRef.current)) {
          if (stryMutAct_9fa48("7712")) {
            {}
          } else {
            stryCov_9fa48("7712");
            animationRef.current = undefined;
            return;
          }
        }
        const currentTime = performance.now();
        const deltaTime = stryMutAct_9fa48("7713") ? currentTime + lastFrameTimeRef.current : (stryCov_9fa48("7713"), currentTime - lastFrameTimeRef.current);

        // Frame rate limiting
        if (stryMutAct_9fa48("7717") ? deltaTime >= targetFrameTime : stryMutAct_9fa48("7716") ? deltaTime <= targetFrameTime : stryMutAct_9fa48("7715") ? false : stryMutAct_9fa48("7714") ? true : (stryCov_9fa48("7714", "7715", "7716", "7717"), deltaTime < targetFrameTime)) {
          if (stryMutAct_9fa48("7718")) {
            {}
          } else {
            stryCov_9fa48("7718");
            animationRef.current = requestAnimationFrame(animate);
            return;
          }
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext(stryMutAct_9fa48("7719") ? "" : (stryCov_9fa48("7719"), '2d'), stryMutAct_9fa48("7720") ? {} : (stryCov_9fa48("7720"), {
          alpha: stryMutAct_9fa48("7721") ? true : (stryCov_9fa48("7721"), false)
        }));
        if (stryMutAct_9fa48("7724") ? false : stryMutAct_9fa48("7723") ? true : stryMutAct_9fa48("7722") ? ctx : (stryCov_9fa48("7722", "7723", "7724"), !ctx)) return;

        // Clear canvas
        ctx.fillStyle = stryMutAct_9fa48("7725") ? "" : (stryCov_9fa48("7725"), 'transparent');
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Update nodes with frame-independent movement
        const speedMultiplier = stryMutAct_9fa48("7726") ? deltaTime * 16.67 : (stryCov_9fa48("7726"), deltaTime / 16.67); // Normalize to 60fps baseline

        nodesRef.current.forEach(node => {
          if (stryMutAct_9fa48("7727")) {
            {}
          } else {
            stryCov_9fa48("7727");
            // Update position
            stryMutAct_9fa48("7728") ? node.x -= node.vx * speedMultiplier : (stryCov_9fa48("7728"), node.x += stryMutAct_9fa48("7729") ? node.vx / speedMultiplier : (stryCov_9fa48("7729"), node.vx * speedMultiplier));
            stryMutAct_9fa48("7730") ? node.y -= node.vy * speedMultiplier : (stryCov_9fa48("7730"), node.y += stryMutAct_9fa48("7731") ? node.vy / speedMultiplier : (stryCov_9fa48("7731"), node.vy * speedMultiplier));

            // Bounce off edges
            if (stryMutAct_9fa48("7734") ? node.x <= 0 && node.x >= dimensions.width : stryMutAct_9fa48("7733") ? false : stryMutAct_9fa48("7732") ? true : (stryCov_9fa48("7732", "7733", "7734"), (stryMutAct_9fa48("7737") ? node.x > 0 : stryMutAct_9fa48("7736") ? node.x < 0 : stryMutAct_9fa48("7735") ? false : (stryCov_9fa48("7735", "7736", "7737"), node.x <= 0)) || (stryMutAct_9fa48("7740") ? node.x < dimensions.width : stryMutAct_9fa48("7739") ? node.x > dimensions.width : stryMutAct_9fa48("7738") ? false : (stryCov_9fa48("7738", "7739", "7740"), node.x >= dimensions.width)))) {
              if (stryMutAct_9fa48("7741")) {
                {}
              } else {
                stryCov_9fa48("7741");
                stryMutAct_9fa48("7742") ? node.vx /= -1 : (stryCov_9fa48("7742"), node.vx *= stryMutAct_9fa48("7743") ? +1 : (stryCov_9fa48("7743"), -1));
                node.x = stryMutAct_9fa48("7744") ? Math.min(0, Math.min(dimensions.width, node.x)) : (stryCov_9fa48("7744"), Math.max(0, stryMutAct_9fa48("7745") ? Math.max(dimensions.width, node.x) : (stryCov_9fa48("7745"), Math.min(dimensions.width, node.x))));
              }
            }
            if (stryMutAct_9fa48("7748") ? node.y <= 0 && node.y >= dimensions.height : stryMutAct_9fa48("7747") ? false : stryMutAct_9fa48("7746") ? true : (stryCov_9fa48("7746", "7747", "7748"), (stryMutAct_9fa48("7751") ? node.y > 0 : stryMutAct_9fa48("7750") ? node.y < 0 : stryMutAct_9fa48("7749") ? false : (stryCov_9fa48("7749", "7750", "7751"), node.y <= 0)) || (stryMutAct_9fa48("7754") ? node.y < dimensions.height : stryMutAct_9fa48("7753") ? node.y > dimensions.height : stryMutAct_9fa48("7752") ? false : (stryCov_9fa48("7752", "7753", "7754"), node.y >= dimensions.height)))) {
              if (stryMutAct_9fa48("7755")) {
                {}
              } else {
                stryCov_9fa48("7755");
                stryMutAct_9fa48("7756") ? node.vy /= -1 : (stryCov_9fa48("7756"), node.vy *= stryMutAct_9fa48("7757") ? +1 : (stryCov_9fa48("7757"), -1));
                node.y = stryMutAct_9fa48("7758") ? Math.min(0, Math.min(dimensions.height, node.y)) : (stryCov_9fa48("7758"), Math.max(0, stryMutAct_9fa48("7759") ? Math.max(dimensions.height, node.y) : (stryCov_9fa48("7759"), Math.min(dimensions.height, node.y))));
              }
            }

            // Update pulse (slower for better performance)
            stryMutAct_9fa48("7760") ? node.pulsePhase -= 0.01 * speedMultiplier : (stryCov_9fa48("7760"), node.pulsePhase += stryMutAct_9fa48("7761") ? 0.01 / speedMultiplier : (stryCov_9fa48("7761"), 0.01 * speedMultiplier));
            node.opacity = stryMutAct_9fa48("7762") ? 0.3 - 0.4 * Math.sin(node.pulsePhase) : (stryCov_9fa48("7762"), 0.3 + (stryMutAct_9fa48("7763") ? 0.4 / Math.sin(node.pulsePhase) : (stryCov_9fa48("7763"), 0.4 * Math.sin(node.pulsePhase))));
          }
        });

        // Update spatial grid periodically
        if (stryMutAct_9fa48("7766") ? frameCountRef.current % 10 !== 0 : stryMutAct_9fa48("7765") ? false : stryMutAct_9fa48("7764") ? true : (stryCov_9fa48("7764", "7765", "7766"), (stryMutAct_9fa48("7767") ? frameCountRef.current * 10 : (stryCov_9fa48("7767"), frameCountRef.current % 10)) === 0)) {
          if (stryMutAct_9fa48("7768")) {
            {}
          } else {
            stryCov_9fa48("7768");
            updateSpatialGrid();
          }
        }

        // Find and draw connections
        const connections = findConnections();

        // Draw connections with reduced quality for performance
        ctx.lineWidth = 1;
        connections.forEach(connection => {
          if (stryMutAct_9fa48("7769")) {
            {}
          } else {
            stryCov_9fa48("7769");
            ctx.beginPath();
            ctx.moveTo(connection.from.x, connection.from.y);
            ctx.lineTo(connection.to.x, connection.to.y);

            // Simplified gradient for performance
            ctx.strokeStyle = hexToRgba(colors.connections, connection.opacity);
            ctx.stroke();
          }
        });

        // Draw nodes with reduced effects
        nodesRef.current.forEach(node => {
          if (stryMutAct_9fa48("7770")) {
            {}
          } else {
            stryCov_9fa48("7770");
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, stryMutAct_9fa48("7771") ? Math.PI / 2 : (stryCov_9fa48("7771"), Math.PI * 2));

            // Get color based on type
            let color = colors.primary;
            if (stryMutAct_9fa48("7774") ? node.type !== 'secondary' : stryMutAct_9fa48("7773") ? false : stryMutAct_9fa48("7772") ? true : (stryCov_9fa48("7772", "7773", "7774"), node.type === (stryMutAct_9fa48("7775") ? "" : (stryCov_9fa48("7775"), 'secondary')))) color = colors.secondary;
            if (stryMutAct_9fa48("7778") ? node.type !== 'accent' : stryMutAct_9fa48("7777") ? false : stryMutAct_9fa48("7776") ? true : (stryCov_9fa48("7776", "7777", "7778"), node.type === (stryMutAct_9fa48("7779") ? "" : (stryCov_9fa48("7779"), 'accent')))) color = colors.accent;

            // Simple fill without gradient for performance
            ctx.fillStyle = hexToRgba(color, node.opacity);
            ctx.fill();
          }
        });

        // Update frame tracking
        lastFrameTimeRef.current = currentTime;
        stryMutAct_9fa48("7780") ? frameCountRef.current-- : (stryCov_9fa48("7780"), frameCountRef.current++);

        // Calculate actual FPS periodically
        if (stryMutAct_9fa48("7783") ? frameCountRef.current % 60 !== 0 : stryMutAct_9fa48("7782") ? false : stryMutAct_9fa48("7781") ? true : (stryCov_9fa48("7781", "7782", "7783"), (stryMutAct_9fa48("7784") ? frameCountRef.current * 60 : (stryCov_9fa48("7784"), frameCountRef.current % 60)) === 0)) {
          if (stryMutAct_9fa48("7785")) {
            {}
          } else {
            stryCov_9fa48("7785");
            const avgFrameTime = deltaTime;
            fpsRef.current = Math.round(stryMutAct_9fa48("7786") ? 1000 * avgFrameTime : (stryCov_9fa48("7786"), 1000 / avgFrameTime));
          }
        }
        animationRef.current = requestAnimationFrame(animate);
      }
    }, stryMutAct_9fa48("7787") ? [] : (stryCov_9fa48("7787"), [dimensions, colors, targetFrameTime, updateSpatialGrid, findConnections, hexToRgba]));

    /**
     * Start animation
     */
    useEffect(() => {
      if (stryMutAct_9fa48("7788")) {
        {}
      } else {
        stryCov_9fa48("7788");
        if (stryMutAct_9fa48("7791") ? (!canvasRef.current || dimensions.width === 0) && dimensions.height === 0 : stryMutAct_9fa48("7790") ? false : stryMutAct_9fa48("7789") ? true : (stryCov_9fa48("7789", "7790", "7791"), (stryMutAct_9fa48("7793") ? !canvasRef.current && dimensions.width === 0 : stryMutAct_9fa48("7792") ? false : (stryCov_9fa48("7792", "7793"), (stryMutAct_9fa48("7794") ? canvasRef.current : (stryCov_9fa48("7794"), !canvasRef.current)) || (stryMutAct_9fa48("7796") ? dimensions.width !== 0 : stryMutAct_9fa48("7795") ? false : (stryCov_9fa48("7795", "7796"), dimensions.width === 0)))) || (stryMutAct_9fa48("7798") ? dimensions.height !== 0 : stryMutAct_9fa48("7797") ? false : (stryCov_9fa48("7797", "7798"), dimensions.height === 0)))) return;
        const canvas = canvasRef.current;
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        lastFrameTimeRef.current = performance.now();
        animate();
        return () => {
          if (stryMutAct_9fa48("7799")) {
            {}
          } else {
            stryCov_9fa48("7799");
            if (stryMutAct_9fa48("7801") ? false : stryMutAct_9fa48("7800") ? true : (stryCov_9fa48("7800", "7801"), animationRef.current)) {
              if (stryMutAct_9fa48("7802")) {
                {}
              } else {
                stryCov_9fa48("7802");
                cancelAnimationFrame(animationRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("7803") ? [] : (stryCov_9fa48("7803"), [dimensions, animate]));
    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={stryMutAct_9fa48("7804") ? {} : (stryCov_9fa48("7804"), {
      zIndex: stryMutAct_9fa48("7805") ? +1 : (stryCov_9fa48("7805"), -1),
      background: stryMutAct_9fa48("7806") ? "" : (stryCov_9fa48("7806"), 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 35%, rgba(6, 182, 212, 0.05) 70%, transparent 100%)'),
      willChange: stryMutAct_9fa48("7807") ? "" : (stryCov_9fa48("7807"), 'transform'),
      transform: stryMutAct_9fa48("7808") ? "" : (stryCov_9fa48("7808"), 'translateZ(0)') // Force GPU acceleration
    })} aria-hidden="true" />;
  }
};
export default NeuralNetworkBackgroundOptimized;