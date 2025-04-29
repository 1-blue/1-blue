"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@1-blue/ui/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@1-blue/ui/components/dropdown-menu";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 키보드 단축키 처리 (Alt+T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        const trigger = document.getElementById("theme-toggle-trigger");
        if (trigger) {
          trigger.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectTheme = useCallback(
    (newTheme: string) => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            id="theme-toggle-trigger"
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300",
              "hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
            aria-label="테마 변경"
            title="테마 변경 (Alt+T)"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : theme === "dark" ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-40">
          <DropdownMenuItem
            onClick={() => selectTheme("system")}
            className={cn(
              "flex items-center cursor-pointer",
              theme === "system" && "bg-accent text-accent-foreground"
            )}
          >
            <Monitor className="w-4 h-4 mr-2" />
            <span>System</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => selectTheme("light")}
            className={cn(
              "flex items-center cursor-pointer",
              theme === "light" && "bg-accent text-accent-foreground"
            )}
          >
            <Sun className="w-4 h-4 mr-2" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => selectTheme("dark")}
            className={cn(
              "flex items-center cursor-pointer",
              theme === "dark" && "bg-accent text-accent-foreground"
            )}
          >
            <Moon className="w-4 h-4 mr-2" />
            <span>Dark</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
