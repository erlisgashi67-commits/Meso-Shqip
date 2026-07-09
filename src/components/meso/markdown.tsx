"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("text-[15px] leading-relaxed text-foreground/90", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="mb-3 mt-1 text-2xl font-bold tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-4 text-xl font-bold tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-3 text-lg font-semibold">{children}</h3>,
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1.5 marker:text-brand">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1.5 marker:text-brand marker:font-semibold">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-foreground bg-brand-muted/60 px-1 rounded">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-brand bg-brand-muted/40 py-2 pl-4 pr-3 rounded-r-md text-sm italic text-foreground/80">
              {children}
            </blockquote>
          ),
          code: ({ children }) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>,
          a: ({ children }) => <a className="text-brand underline underline-offset-2">{children}</a>,
          hr: () => <hr className="my-4 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
