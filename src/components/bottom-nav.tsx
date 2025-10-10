"use client";

import { useState, useEffect } from "react";
import { Briefcase, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [expandTimeout, setExpandTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Collapse on any scroll
      setIsCollapsed(true);
      setIsHovered(false);
      
      // Clear any pending timeouts
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (expandTimeout) clearTimeout(expandTimeout);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (expandTimeout) clearTimeout(expandTimeout);
    };
  }, [hoverTimeout, expandTimeout]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Clear any pending timeouts
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (expandTimeout) clearTimeout(expandTimeout);
    
    // Auto-collapse after 5 seconds
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 5000);
    setExpandTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear the auto-collapse timeout
    if (expandTimeout) clearTimeout(expandTimeout);
    
    // Collapse after 2 seconds of leaving
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 2000);
    setHoverTimeout(timeout);
  };

  const navItems = [
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: FileText, label: "Resume", path: "/resume" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const expanded = !isCollapsed || isHovered;

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-card border border-border rounded-full shadow-lg px-3 py-2.5 flex items-center gap-1 transition-all duration-500 ease-out">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center justify-center gap-2 px-3 py-2 rounded-full
                transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}
                ${expanded ? "min-w-[100px]" : "min-w-[40px]"}
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span
                className={`
                  overflow-hidden whitespace-nowrap font-medium
                  transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${expanded ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
