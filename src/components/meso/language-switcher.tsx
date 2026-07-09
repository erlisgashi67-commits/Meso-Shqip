"use client";

import * as React from "react";
import { Check, Globe } from "lucide-react";
import { useAppStore } from "@/store/app";
import { LANGUAGES } from "@/lib/languages";
import type { LangCode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const [open, setOpen] = React.useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size={compact ? "icon" : "sm"} className="gap-1.5" aria-label="Change language">
          {compact ? <Globe className="size-4" /> : (<><span className="text-base leading-none">{current.flag}</span><span className="hidden sm:inline">{current.native}</span></>)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1">
        <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Interface language
        </div>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => {
              setLang(l.code as LangCode);
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
              l.code === lang && "bg-accent/60"
            )}
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1 text-left font-medium">{l.native}</span>
            <span className="text-[11px] text-muted-foreground">{l.code.toUpperCase()}</span>
            {l.code === lang && <Check className="size-4 text-brand" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
