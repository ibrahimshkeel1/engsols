"use client";

import { Box, PenLine, Video } from "lucide-react";
import type { WorkspaceTab } from "@/types/live-workspace";
import { cn } from "@/lib/utils";

const TABS: { id: WorkspaceTab; label: string; icon: typeof Video }[] = [
  { id: "video_only", label: "Video only", icon: Video },
  { id: "whiteboard", label: "Whiteboard", icon: PenLine },
  { id: "3D_review", label: "3D review", icon: Box },
];

type Props = {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  className?: string;
};

export function WorkspaceSwitcher({ activeTab, onTabChange, className }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Collaboration workspace"
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-xl border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur-md",
        className,
      )}
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const selected = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`workspace-panel-${id}`}
            id={`workspace-tab-${id}`}
            onClick={() => onTabChange(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
              selected
                ? "bg-zone-live text-white shadow-zone-live dark:text-slate-950"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
