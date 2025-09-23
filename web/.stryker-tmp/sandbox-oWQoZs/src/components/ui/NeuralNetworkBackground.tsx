// @ts-nocheck
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
  colors = stryMutAct_9fa48("7370") ? {} : (stryCov_9fa48("7370"), {
    primary: stryMutAct_9fa48("7371") ? "" : (stryCov_9fa48("7371"), '#3b82f6'),
    secondary: stryMutAct_9fa48("7372") ? "" : (stryCov_9fa48("7372"), '#8b5cf6'),
    accent: stryMutAct_9fa48("7373") ? "" : (stryCov_9fa48("7373"), '#06b6d4'),
    connections: stryMutAct_9fa48("7374") ? "" : (stryCov_9fa48("7374"), '#3b82f6')
  })
}) => {
  if (stryMutAct_9fa48("7375")) {
    {}
  } else {
    stryCov_9fa48("7375");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const nodesRef = useRef<Node[]>(stryMutAct_9fa48("7376") ? ["Stryker was here"] : (stryCov_9fa48("7376"), []));
    const [dimensions, setDimensions] = useState(stryMutAct_9fa48("7377") ? {} : (stryCov_9fa48("7377"), {
      width: 0,
      height: 0
    }));
    useEffect(() => {
      if (stryMutAct_9fa48("7378")) {
        {}
      } else {
        stryCov_9fa48("7378");
        const updateDimensions = () => {
          if (stryMutAct_9fa48("7379")) {
            {}
          } else {
            stryCov_9fa48("7379");
            setDimensions(stryMutAct_9fa48("7380") ? {} : (stryCov_9fa48("7380"), {
              width: window.innerWidth,
              height: window.innerHeight
            }));
          }
        };
        updateDimensions();
        window.addEventListener(stryMutAct_9fa48("7381") ? "" : (stryCov_9fa48("7381"), 'resize'), updateDimensions);
        return stryMutAct_9fa48("7382") ? () => undefined : (stryCov_9fa48("7382"), () => window.removeEventListener(stryMutAct_9fa48("7383") ? "" : (stryCov_9fa48("7383"), 'resize'), updateDimensions));
      }
    }, stryMutAct_9fa48("7384") ? ["Stryker was here"] : (stryCov_9fa48("7384"), []));

    // Initialize nodes
    useEffect(() => {
      if (stryMutAct_9fa48("7385")) {
        {}
      } else {
        stryCov_9fa48("7385");
        if (stryMutAct_9fa48("7388") ? dimensions.width === 0 && dimensions.height === 0 : stryMutAct_9fa48("7387") ? false : stryMutAct_9fa48("7386") ? true : (stryCov_9fa48("7386", "7387", "7388"), (stryMutAct_9fa48("7390") ? dimensions.width !== 0 : stryMutAct_9fa48("7389") ? false : (stryCov_9fa48("7389", "7390"), dimensions.width === 0)) || (stryMutAct_9fa48("7392") ? dimensions.height !== 0 : stryMutAct_9fa48("7391") ? false : (stryCov_9fa48("7391", "7392"), dimensions.height === 0)))) return;
        const nodes: Node[] = stryMutAct_9fa48("7393") ? ["Stryker was here"] : (stryCov_9fa48("7393"), []);
        const nodeTypes: Array<'primary' | 'secondary' | 'accent'> = stryMutAct_9fa48("7394") ? [] : (stryCov_9fa48("7394"), [stryMutAct_9fa48("7395") ? "" : (stryCov_9fa48("7395"), 'primary'), stryMutAct_9fa48("7396") ? "" : (stryCov_9fa48("7396"), 'secondary'), stryMutAct_9fa48("7397") ? "" : (stryCov_9fa48("7397"), 'accent')]);
        for (let i = 0; stryMutAct_9fa48("7400") ? i >= nodeCount : stryMutAct_9fa48("7399") ? i <= nodeCount : stryMutAct_9fa48("7398") ? false : (stryCov_9fa48("7398", "7399", "7400"), i < nodeCount); stryMutAct_9fa48("7401") ? i-- : (stryCov_9fa48("7401"), i++)) {
          if (stryMutAct_9fa48("7402")) {
            {}
          } else {
            stryCov_9fa48("7402");
            nodes.push(stryMutAct_9fa48("7403") ? {} : (stryCov_9fa48("7403"), {
              id: i,
              x: stryMutAct_9fa48("7404") ? Math.random() / dimensions.width : (stryCov_9fa48("7404"), Math.random() * dimensions.width),
              y: stryMutAct_9fa48("7405") ? Math.random() / dimensions.height : (stryCov_9fa48("7405"), Math.random() * dimensions.height),
              vx: stryMutAct_9fa48("7406") ? (Math.random() - 0.5) / animationSpeed : (stryCov_9fa48("7406"), (stryMutAct_9fa48("7407") ? Math.random() + 0.5 : (stryCov_9fa48("7407"), Math.random() - 0.5)) * animationSpeed),
              vy: stryMutAct_9fa48("7408") ? (Math.random() - 0.5) / animationSpeed : (stryCov_9fa48("7408"), (stryMutAct_9fa48("7409") ? Math.random() + 0.5 : (stryCov_9fa48("7409"), Math.random() - 0.5)) * animationSpeed),
              size: stryMutAct_9fa48("7410") ? Math.random() * 4 - 2 : (stryCov_9fa48("7410"), (stryMutAct_9fa48("7411") ? Math.random() / 4 : (stryCov_9fa48("7411"), Math.random() * 4)) + 2),
              opacity: stryMutAct_9fa48("7412") ? Math.random() * 0.7 - 0.3 : (stryCov_9fa48("7412"), (stryMutAct_9fa48("7413") ? Math.random() / 0.7 : (stryCov_9fa48("7413"), Math.random() * 0.7)) + 0.3),
              pulsePhase: stryMutAct_9fa48("7414") ? Math.random() * Math.PI / 2 : (stryCov_9fa48("7414"), (stryMutAct_9fa48("7415") ? Math.random() / Math.PI : (stryCov_9fa48("7415"), Math.random() * Math.PI)) * 2),
              type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)] as "primary" | "secondary" | "accent"
            }));
          }
        }
        nodesRef.current = nodes;
      }
    }, stryMutAct_9fa48("7416") ? [] : (stryCov_9fa48("7416"), [dimensions, nodeCount, animationSpeed]));

    // Animation loop
    useEffect(() => {
      if (stryMutAct_9fa48("7417")) {
        {}
      } else {
        stryCov_9fa48("7417");
        if (stryMutAct_9fa48("7420") ? (!canvasRef.current || dimensions.width === 0) && dimensions.height === 0 : stryMutAct_9fa48("7419") ? false : stryMutAct_9fa48("7418") ? true : (stryCov_9fa48("7418", "7419", "7420"), (stryMutAct_9fa48("7422") ? !canvasRef.current && dimensions.width === 0 : stryMutAct_9fa48("7421") ? false : (stryCov_9fa48("7421", "7422"), (stryMutAct_9fa48("7423") ? canvasRef.current : (stryCov_9fa48("7423"), !canvasRef.current)) || (stryMutAct_9fa48("7425") ? dimensions.width !== 0 : stryMutAct_9fa48("7424") ? false : (stryCov_9fa48("7424", "7425"), dimensions.width === 0)))) || (stryMutAct_9fa48("7427") ? dimensions.height !== 0 : stryMutAct_9fa48("7426") ? false : (stryCov_9fa48("7426", "7427"), dimensions.height === 0)))) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext(stryMutAct_9fa48("7428") ? "" : (stryCov_9fa48("7428"), '2d'));
        if (stryMutAct_9fa48("7431") ? false : stryMutAct_9fa48("7430") ? true : stryMutAct_9fa48("7429") ? ctx : (stryCov_9fa48("7429", "7430", "7431"), !ctx)) return;
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const animate = () => {
          if (stryMutAct_9fa48("7432")) {
            {}
          } else {
            stryCov_9fa48("7432");
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            // Helper function to convert hex to rgba
            const hexToRgba = (hex: string, alpha: number) => {
              if (stryMutAct_9fa48("7433")) {
                {}
              } else {
                stryCov_9fa48("7433");
                const r = parseInt(stryMutAct_9fa48("7434") ? hex : (stryCov_9fa48("7434"), hex.slice(1, 3)), 16);
                const g = parseInt(stryMutAct_9fa48("7435") ? hex : (stryCov_9fa48("7435"), hex.slice(3, 5)), 16);
                const b = parseInt(stryMutAct_9fa48("7436") ? hex : (stryCov_9fa48("7436"), hex.slice(5, 7)), 16);
                return stryMutAct_9fa48("7437") ? `` : (stryCov_9fa48("7437"), `rgba(${r}, ${g}, ${b}, ${alpha})`);
              }
            };

            // Update nodes
            nodesRef.current.forEach(node => {
              if (stryMutAct_9fa48("7438")) {
                {}
              } else {
                stryCov_9fa48("7438");
                // Update position
                stryMutAct_9fa48("7439") ? node.x -= node.vx : (stryCov_9fa48("7439"), node.x += node.vx);
                stryMutAct_9fa48("7440") ? node.y -= node.vy : (stryCov_9fa48("7440"), node.y += node.vy);

                // Bounce off edges
                if (stryMutAct_9fa48("7443") ? node.x <= 0 && node.x >= dimensions.width : stryMutAct_9fa48("7442") ? false : stryMutAct_9fa48("7441") ? true : (stryCov_9fa48("7441", "7442", "7443"), (stryMutAct_9fa48("7446") ? node.x > 0 : stryMutAct_9fa48("7445") ? node.x < 0 : stryMutAct_9fa48("7444") ? false : (stryCov_9fa48("7444", "7445", "7446"), node.x <= 0)) || (stryMutAct_9fa48("7449") ? node.x < dimensions.width : stryMutAct_9fa48("7448") ? node.x > dimensions.width : stryMutAct_9fa48("7447") ? false : (stryCov_9fa48("7447", "7448", "7449"), node.x >= dimensions.width)))) {
                  if (stryMutAct_9fa48("7450")) {
                    {}
                  } else {
                    stryCov_9fa48("7450");
                    stryMutAct_9fa48("7451") ? node.vx /= -1 : (stryCov_9fa48("7451"), node.vx *= stryMutAct_9fa48("7452") ? +1 : (stryCov_9fa48("7452"), -1));
                    node.x = stryMutAct_9fa48("7453") ? Math.min(0, Math.min(dimensions.width, node.x)) : (stryCov_9fa48("7453"), Math.max(0, stryMutAct_9fa48("7454") ? Math.max(dimensions.width, node.x) : (stryCov_9fa48("7454"), Math.min(dimensions.width, node.x))));
                  }
                }
                if (stryMutAct_9fa48("7457") ? node.y <= 0 && node.y >= dimensions.height : stryMutAct_9fa48("7456") ? false : stryMutAct_9fa48("7455") ? true : (stryCov_9fa48("7455", "7456", "7457"), (stryMutAct_9fa48("7460") ? node.y > 0 : stryMutAct_9fa48("7459") ? node.y < 0 : stryMutAct_9fa48("7458") ? false : (stryCov_9fa48("7458", "7459", "7460"), node.y <= 0)) || (stryMutAct_9fa48("7463") ? node.y < dimensions.height : stryMutAct_9fa48("7462") ? node.y > dimensions.height : stryMutAct_9fa48("7461") ? false : (stryCov_9fa48("7461", "7462", "7463"), node.y >= dimensions.height)))) {
                  if (stryMutAct_9fa48("7464")) {
                    {}
                  } else {
                    stryCov_9fa48("7464");
                    stryMutAct_9fa48("7465") ? node.vy /= -1 : (stryCov_9fa48("7465"), node.vy *= stryMutAct_9fa48("7466") ? +1 : (stryCov_9fa48("7466"), -1));
                    node.y = stryMutAct_9fa48("7467") ? Math.min(0, Math.min(dimensions.height, node.y)) : (stryCov_9fa48("7467"), Math.max(0, stryMutAct_9fa48("7468") ? Math.max(dimensions.height, node.y) : (stryCov_9fa48("7468"), Math.min(dimensions.height, node.y))));
                  }
                }

                // Update pulse
                stryMutAct_9fa48("7469") ? node.pulsePhase -= 0.02 : (stryCov_9fa48("7469"), node.pulsePhase += 0.02);
                node.opacity = stryMutAct_9fa48("7470") ? 0.3 - 0.4 * Math.sin(node.pulsePhase) : (stryCov_9fa48("7470"), 0.3 + (stryMutAct_9fa48("7471") ? 0.4 / Math.sin(node.pulsePhase) : (stryCov_9fa48("7471"), 0.4 * Math.sin(node.pulsePhase))));
              }
            });

            // Find connections
            const connections: Connection[] = stryMutAct_9fa48("7472") ? ["Stryker was here"] : (stryCov_9fa48("7472"), []);
            for (let i = 0; stryMutAct_9fa48("7475") ? i >= nodesRef.current.length : stryMutAct_9fa48("7474") ? i <= nodesRef.current.length : stryMutAct_9fa48("7473") ? false : (stryCov_9fa48("7473", "7474", "7475"), i < nodesRef.current.length); stryMutAct_9fa48("7476") ? i-- : (stryCov_9fa48("7476"), i++)) {
              if (stryMutAct_9fa48("7477")) {
                {}
              } else {
                stryCov_9fa48("7477");
                for (let j = stryMutAct_9fa48("7478") ? i - 1 : (stryCov_9fa48("7478"), i + 1); stryMutAct_9fa48("7481") ? j >= nodesRef.current.length : stryMutAct_9fa48("7480") ? j <= nodesRef.current.length : stryMutAct_9fa48("7479") ? false : (stryCov_9fa48("7479", "7480", "7481"), j < nodesRef.current.length); stryMutAct_9fa48("7482") ? j-- : (stryCov_9fa48("7482"), j++)) {
                  if (stryMutAct_9fa48("7483")) {
                    {}
                  } else {
                    stryCov_9fa48("7483");
                    const nodeA = nodesRef.current[i];
                    const nodeB = nodesRef.current[j];
                    if (stryMutAct_9fa48("7486") ? !nodeA && !nodeB : stryMutAct_9fa48("7485") ? false : stryMutAct_9fa48("7484") ? true : (stryCov_9fa48("7484", "7485", "7486"), (stryMutAct_9fa48("7487") ? nodeA : (stryCov_9fa48("7487"), !nodeA)) || (stryMutAct_9fa48("7488") ? nodeB : (stryCov_9fa48("7488"), !nodeB)))) continue;
                    const dx = stryMutAct_9fa48("7489") ? nodeA.x + nodeB.x : (stryCov_9fa48("7489"), nodeA.x - nodeB.x);
                    const dy = stryMutAct_9fa48("7490") ? nodeA.y + nodeB.y : (stryCov_9fa48("7490"), nodeA.y - nodeB.y);
                    const distance = Math.sqrt(stryMutAct_9fa48("7491") ? dx * dx - dy * dy : (stryCov_9fa48("7491"), (stryMutAct_9fa48("7492") ? dx / dx : (stryCov_9fa48("7492"), dx * dx)) + (stryMutAct_9fa48("7493") ? dy / dy : (stryCov_9fa48("7493"), dy * dy))));
                    if (stryMutAct_9fa48("7497") ? distance >= connectionDistance : stryMutAct_9fa48("7496") ? distance <= connectionDistance : stryMutAct_9fa48("7495") ? false : stryMutAct_9fa48("7494") ? true : (stryCov_9fa48("7494", "7495", "7496", "7497"), distance < connectionDistance)) {
                      if (stryMutAct_9fa48("7498")) {
                        {}
                      } else {
                        stryCov_9fa48("7498");
                        const opacity = stryMutAct_9fa48("7499") ? Math.min(0, 1 - distance / connectionDistance) : (stryCov_9fa48("7499"), Math.max(0, stryMutAct_9fa48("7500") ? 1 + distance / connectionDistance : (stryCov_9fa48("7500"), 1 - (stryMutAct_9fa48("7501") ? distance * connectionDistance : (stryCov_9fa48("7501"), distance / connectionDistance)))));
                        connections.push(stryMutAct_9fa48("7502") ? {} : (stryCov_9fa48("7502"), {
                          from: nodeA,
                          to: nodeB,
                          opacity: stryMutAct_9fa48("7503") ? opacity / 0.3 : (stryCov_9fa48("7503"), opacity * 0.3),
                          strength: opacity
                        }));
                      }
                    }
                  }
                }
              }
            }

            // Draw connections
            connections.forEach(connection => {
              if (stryMutAct_9fa48("7504")) {
                {}
              } else {
                stryCov_9fa48("7504");
                ctx.beginPath();
                ctx.moveTo(connection.from.x, connection.from.y);
                ctx.lineTo(connection.to.x, connection.to.y);

                // Create gradient for connection
                const gradient = ctx.createLinearGradient(connection.from.x, connection.from.y, connection.to.x, connection.to.y);
                gradient.addColorStop(0, hexToRgba(colors.connections, connection.opacity));
                gradient.addColorStop(0.5, hexToRgba(colors.accent, stryMutAct_9fa48("7505") ? connection.opacity / 0.5 : (stryCov_9fa48("7505"), connection.opacity * 0.5)));
                gradient.addColorStop(1, hexToRgba(colors.connections, connection.opacity));
                ctx.strokeStyle = gradient;
                ctx.lineWidth = stryMutAct_9fa48("7506") ? connection.strength / 1.5 : (stryCov_9fa48("7506"), connection.strength * 1.5);
                ctx.stroke();
              }
            });

            // Draw nodes
            nodesRef.current.forEach(node => {
              if (stryMutAct_9fa48("7507")) {
                {}
              } else {
                stryCov_9fa48("7507");
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, stryMutAct_9fa48("7508") ? Math.PI / 2 : (stryCov_9fa48("7508"), Math.PI * 2));

                // Get color based on type
                let color = colors.primary;
                if (stryMutAct_9fa48("7511") ? node.type !== 'secondary' : stryMutAct_9fa48("7510") ? false : stryMutAct_9fa48("7509") ? true : (stryCov_9fa48("7509", "7510", "7511"), node.type === (stryMutAct_9fa48("7512") ? "" : (stryCov_9fa48("7512"), 'secondary')))) color = colors.secondary;
                if (stryMutAct_9fa48("7515") ? node.type !== 'accent' : stryMutAct_9fa48("7514") ? false : stryMutAct_9fa48("7513") ? true : (stryCov_9fa48("7513", "7514", "7515"), node.type === (stryMutAct_9fa48("7516") ? "" : (stryCov_9fa48("7516"), 'accent')))) color = colors.accent;

                // Create radial gradient for glow effect
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, stryMutAct_9fa48("7517") ? node.size / 3 : (stryCov_9fa48("7517"), node.size * 3));
                gradient.addColorStop(0, hexToRgba(color, node.opacity));
                gradient.addColorStop(0.3, hexToRgba(color, stryMutAct_9fa48("7518") ? node.opacity / 0.5 : (stryCov_9fa48("7518"), node.opacity * 0.5)));
                gradient.addColorStop(1, hexToRgba(color, 0));
                ctx.fillStyle = gradient;
                ctx.fill();

                // Inner bright core
                ctx.beginPath();
                ctx.arc(node.x, node.y, stryMutAct_9fa48("7519") ? node.size / 0.4 : (stryCov_9fa48("7519"), node.size * 0.4), 0, stryMutAct_9fa48("7520") ? Math.PI / 2 : (stryCov_9fa48("7520"), Math.PI * 2));
                ctx.fillStyle = hexToRgba(color, stryMutAct_9fa48("7521") ? Math.max(1, node.opacity * 1.5) : (stryCov_9fa48("7521"), Math.min(1, stryMutAct_9fa48("7522") ? node.opacity / 1.5 : (stryCov_9fa48("7522"), node.opacity * 1.5))));
                ctx.fill();
              }
            });
            animationRef.current = requestAnimationFrame(animate);
          }
        };
        animate();
        return () => {
          if (stryMutAct_9fa48("7523")) {
            {}
          } else {
            stryCov_9fa48("7523");
            if (stryMutAct_9fa48("7525") ? false : stryMutAct_9fa48("7524") ? true : (stryCov_9fa48("7524", "7525"), animationRef.current)) {
              if (stryMutAct_9fa48("7526")) {
                {}
              } else {
                stryCov_9fa48("7526");
                cancelAnimationFrame(animationRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("7527") ? [] : (stryCov_9fa48("7527"), [dimensions, connectionDistance, colors]));
    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={stryMutAct_9fa48("7528") ? {} : (stryCov_9fa48("7528"), {
      zIndex: stryMutAct_9fa48("7529") ? +1 : (stryCov_9fa48("7529"), -1),
      background: stryMutAct_9fa48("7530") ? "" : (stryCov_9fa48("7530"), 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 35%, rgba(6, 182, 212, 0.05) 70%, transparent 100%)')
    })} />;
  }
};
export default NeuralNetworkBackground;