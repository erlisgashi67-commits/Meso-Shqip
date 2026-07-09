"use client";

import { cn } from "@/lib/utils";

export function BrandMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-12 w-12 text-2xl" : size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-xl";
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm",
        dims,
        className
      )}
      aria-hidden
    >
      <span className="leading-none">🦅</span>
      <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-background text-[9px] font-black text-brand ring-1 ring-brand/30">
        A
      </span>
    </div>
  );
}

export function Brand({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark size={size} />
      <div className="leading-tight">
        <div className={cn("font-extrabold tracking-tight", text)}>
          Mëso Shqip<span className="text-brand">🦅</span>
        </div>
        {size !== "sm" && (
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Albanian Learning
          </div>
        )}
      </div>
    </div>
  );
}
