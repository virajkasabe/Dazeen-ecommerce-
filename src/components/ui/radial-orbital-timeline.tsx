"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  relatedIds: number[];
  status: "completed" | "roasted" | "brewing";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 175; // slightly reduced from 200 for safe fit inside box
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-[#FCD34D] bg-[#78350F] border-[#FCD34D]";
      case "roasted":
        return "text-[#10B981] bg-[#064E3B] border-[#10B981]";
      case "brewing":
        return "text-[#FB923C] bg-[#7C2D12] border-[#FB923C]";
      default:
        return "text-white bg-stone-800 border-stone-600";
    }
  };

  return (
    <div
      className="w-full h-[620px] flex flex-col items-center justify-center bg-stone-950 rounded-3xl relative overflow-hidden border border-stone-800 shadow-2xl py-12 px-4"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Decorative Warm Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,53,15,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Pulsing Sun/Bean Center */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-stone-800 to-amber-700 animate-pulse flex items-center justify-center z-10 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <div className="absolute w-20 h-20 rounded-full border border-amber-500/20 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-amber-500/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center border border-amber-400/30">
              <span className="w-3 h-1.5 rounded-full bg-amber-400 rotate-45" />
            </div>
          </div>

          {/* Orbital path ring */}
          <div className="absolute w-[350px] h-[350px] rounded-full border border-stone-800/80"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer flex flex-col items-center"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.4 + 40}px`,
                    height: `${item.energy * 0.4 + 40}px`,
                    left: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-amber-400 text-stone-950 font-black shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                      : isRelated
                      ? "bg-amber-500/50 text-white"
                      : "bg-stone-900 border-stone-800 text-stone-300"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? "border-amber-400 shadow-lg"
                      : isRelated
                      ? "border-amber-500 animate-pulse"
                      : "border-stone-700/80"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-140" : "hover:scale-110"}
                `}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`
                  absolute top-12 whitespace-nowrap
                  text-[10px] sm:text-xs font-serif font-black tracking-wide
                  transition-all duration-300 px-2 py-0.5 rounded-full bg-stone-950/80 border border-stone-900/60
                  ${isExpanded ? "text-amber-400 scale-110" : "text-stone-400"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-stone-900/95 backdrop-blur-xl border-stone-800 shadow-2xl overflow-visible z-50">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-stone-700"></div>
                    <CardHeader className="pb-2 p-4">
                      <div className="flex justify-between items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`px-2 text-[9px] font-mono tracking-wider ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-mono text-stone-400">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm mt-1.5 font-serif font-black text-white">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-stone-300 p-4 pt-0">
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-stone-800">
                        <div className="flex justify-between items-center text-[10px] text-stone-400 mb-1 font-mono">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1 text-amber-400 animate-pulse" />
                            Aromatic Intensity
                          </span>
                          <span className="font-mono text-amber-400">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-stone-800">
                          <div className="flex items-center mb-2">
                            <span className="text-[9px] uppercase tracking-wider font-bold font-mono text-stone-500">
                              Connected Notes
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-full border-stone-800 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white transition-all focus:outline-none"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-amber-400"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
